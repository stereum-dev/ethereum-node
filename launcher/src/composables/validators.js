import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import { useStakingStore } from "@/store/theStaking";
import { isObolDVTService } from "@/share/ObolDVTServices";

// A VC behind Charon/Pluto holds key shares of the cluster's validators, so count each on-chain key once
export function countOnChainKeys(keys = [], installedServices = []) {
  const shareHolders = installedServices
    .filter((s) => s.config?.dependencies?.consensusClients?.some((d) => isObolDVTService(d.service)))
    .map((s) => s.config.serviceID);
  return new Set(keys.filter((k) => !shareHolders.includes(k.validatorID)).map((k) => k.key)).size;
}

export async function useListKeys(forceRefresh) {
  const serviceStore = useServices();
  const nodeManageStore = useNodeManage();
  const stakingStore = useStakingStore();

  let keyStats = [];

  let clients = serviceStore.installedServices.filter((s) => s.category == "validator" && s.config.network != "devnet");

  if ((clients && clients.length > 0 && nodeManageStore.currentNetwork?.network != "") || forceRefresh) {
    for (let client of clients) {
      if ((client.config.keys === undefined || client.config.keys.length === 0 || forceRefresh) && client.state === "running") {
        //refresh validator list
        let result = await ControlService.listValidators(client.config.serviceID);
        if (!/Web3Signer|SSVNetwork/.test(client.service) && !isObolDVTService(client.service)) {
          let resultRemote = await ControlService.listRemoteKeys(client.config.serviceID);
          let remoteKeys = resultRemote.data
            ? resultRemote.data.map((e) => {
                return { validating_pubkey: e.pubkey, readonly: true };
              })
            : [];
          result.data = result.data ? result.data.concat(remoteKeys) : remoteKeys;

          //make sure there are no duplicates
          let validating_pubkeys = result.data.map((obj) => obj.validating_pubkey);
          result.data = result.data.filter((obj, index) => {
            return validating_pubkeys.indexOf(obj.validating_pubkey) === index;
          });
        }

        //update service config (pinia)
        client.config.keys = result.data
          ? result.data.map((e) => {
              return { key: e.validating_pubkey, isRemote: e.readonly, dvt: e.dvt ? e.dvt : false };
            })
          : [];

        //update service datasets in Pinia store
        serviceStore.installedServices = serviceStore.installedServices.map((service) => {
          if (service.id === client.id) {
            return client;
          }
          return service;
        });
      }

      if (client.config.keys) {
        keyStats = keyStats.concat(
          client.config.keys.map((key) => {
            return {
              key: key.key,
              validatorID: client.config.serviceID,
              icon: client.icon,
              activeSince: "-",
              status: "loading",
              balance: "-",
              network: client.config.network,
              isRemote: key.isRemote,
              dvt: key.dvt ? key.dvt : false,
            };
          })
        );
      }
    }
    let alias = await ControlService.readKeys();
    let keysToWrite = {};
    keyStats.forEach((key) => {
      if (alias[key.key]) {
        keysToWrite[key.key] = alias[key.key];
      }
    });
    for (let key in alias) {
      if (keysToWrite[key] === undefined && serviceStore.installedServices.some((s) => s.config?.serviceID === alias[key].validatorID)) {
        keysToWrite[key] = alias[key];
      }
    }
    keysToWrite.overwrite = true;
    await ControlService.writeKeys(keysToWrite);

    // Keep the last stats and row state (selection, open panels) of already listed keys across refreshes
    const previousKeys = new Map(stakingStore.keys.map((k) => [k.validatorID + k.key, k]));
    const STAT_FIELDS = ["status", "balance", "index", "activeSince", "exitSince", "elgibilitySince", "withdrawableSince"];

    stakingStore.keys = keyStats.map((key) => {
      const previous = previousKeys.get(key.validatorID + key.key);
      return {
        ...key,
        ...(previous ? Object.fromEntries(STAT_FIELDS.filter((f) => f in previous).map((f) => [f, previous[f]])) : {}),
        displayName: alias[key.key]?.keyName,
        showGrafitiText: previous?.showGrafitiText ?? false,
        showCopyText: previous?.showCopyText ?? false,
        showRemoveText: previous?.showRemoveText ?? false,
        showExitText: previous?.showExitText ?? false,
        selected: previous?.selected ?? false,
        groupName: alias[key.key]?.groupName,
        groupID: alias[key.key]?.groupID,
      };
    });
    if (stakingStore.keys && stakingStore.keys.length > 0) useUpdateValidatorStats();
  }
}

export async function useUpdateValidatorStats() {
  const stakingStore = useStakingStore();
  const serviceStore = useServices();
  let totalBalance = 0;
  let data = [];

  // On a failed fetch keep the stats the keys already have, only keys without any become NA
  const keepPreviousStats = () =>
    stakingStore.keys.forEach((key) => {
      if (key.status === "loading") key.status = "NA";
    });

  try {
    data = await ControlService.getValidatorState(stakingStore.keys.map((key) => key.key));
  } catch (err) {
    console.log("Couldn't fetch validator stats:\n", err);
    keepPreviousStats();
    return;
  }
  if (!Array.isArray(data)) {
    console.log("Couldn't fetch validator stats: no beacon node answered");
    keepPreviousStats();
    return;
  }
  // Get queue keys
  let keysInQueue = [];
  if (serviceStore.installedServices.some((s) => s.service === "LCOMService")) {
    try {
      keysInQueue = (await ControlService.getSigningKeysWithQueueInfo()) || [];
      if (!Array.isArray(keysInQueue)) {
        console.warn("Unexpected response from getSigningKeysWithQueueInfo:", keysInQueue);
        keysInQueue = [];
      }
    } catch (error) {
      console.error("Error fetching signing keys with queue info:", error);
      keysInQueue = [];
    }
  }

  stakingStore.keys.forEach((key) => {
    let info = data.find((k) => k.pubkey === key.key);

    // Check if the key is in queue here
    let inQueue = keysInQueue.some((k) => k.key === key.key && k.queuePosition != 0);

    if (info) {
      let dateActive = new Date();
      let dateExit = new Date();
      let dateEligibility = new Date();
      let dateWithdrawable = new Date();
      let now = new Date();
      const latestEpoch = parseInt(info.latestEpoch);
      let activationEpoch = parseInt(info.activationEpoch);
      let exitEpoch = parseInt(info.exitEpoch);
      let elgibilityEpoch = parseInt(info.activationElgibilityEpoch);
      let withdrawableEpoch = parseInt(info.withdrawableEpoch);

      if (key.network === "gnosis") {
        dateActive.setMilliseconds(dateActive.getMilliseconds() - (latestEpoch - activationEpoch) * 80000);
        dateExit =
          exitEpoch > latestEpoch
            ? null
            : new Date(dateExit.setMilliseconds(dateExit.getMilliseconds() - (latestEpoch - exitEpoch) * 80000));
        dateWithdrawable =
          withdrawableEpoch > latestEpoch
            ? null
            : new Date(dateWithdrawable.setMilliseconds(dateWithdrawable.getMilliseconds() - (latestEpoch - withdrawableEpoch) * 80000));
        dateEligibility.setMilliseconds(dateEligibility.getMilliseconds() - (latestEpoch - elgibilityEpoch) * 80000);
      } else {
        dateActive.setMilliseconds(dateActive.getMilliseconds() - (latestEpoch - activationEpoch) * 384000);
        dateExit =
          exitEpoch > latestEpoch
            ? null
            : new Date(dateExit.setMilliseconds(dateExit.getMilliseconds() - (latestEpoch - exitEpoch) * 384000));
        dateWithdrawable =
          withdrawableEpoch > latestEpoch
            ? null
            : new Date(dateWithdrawable.setMilliseconds(dateWithdrawable.getMilliseconds() - (latestEpoch - withdrawableEpoch) * 384000));
        dateEligibility.setMilliseconds(dateEligibility.getMilliseconds() - (latestEpoch - elgibilityEpoch) * 384000);
      }
      key.index = info.validatorindex;
      key.status = inQueue ? "inQueue" : info.status;
      key.balance = info.balance / 1000000000;
      key.activeSince = ((now.getTime() - dateActive.getTime()) / 86400000).toFixed(1) + " Days";
      key.exitSince = dateExit === null ? null : ((now.getTime() - dateExit.getTime()) / 86400000).toFixed(1) + " Days";
      key.elgibilitySince = ((now.getTime() - dateEligibility.getTime()) / 86400000).toFixed(1) + " Days";
      key.withdrawableSince =
        dateWithdrawable === null ? null : ((now.getTime() - dateWithdrawable.getTime()) / 86400000).toFixed(1) + " Days";
      if (key.isRemote) {
        if (!stakingStore.keys.some((k) => k.key === key.key && !k.isRemote)) {
          totalBalance += key.balance;
        }
      } else {
        totalBalance += key.balance;
      }
    } else {
      key.status = inQueue ? "inQueue" : "deposit";
      key.balance = "-";
    }
  });
  stakingStore.totalBalance = totalBalance;
}

export async function useObolStats() {
  const stakingStore = useStakingStore();
  if (isObolDVTService(stakingStore.selectedServiceToFilter?.service)) {
    ControlService.getObolClusterInformation(stakingStore.selectedServiceToFilter?.config?.serviceID).then((data) => {
      stakingStore.obolStats = data;
    });
  }
}

export async function useSSVStats() {
  const stakingStore = useStakingStore();
  if (stakingStore.selectedServiceToFilter?.service === "SSVNetworkService") {
    ControlService.getSSVClusterInformation(stakingStore.selectedServiceToFilter?.config?.serviceID).then((data) => {
      stakingStore.ssvStats = data;
    });
  }
}
