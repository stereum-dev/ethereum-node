import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import { useStakingStore } from "@/store/theStaking";
import axios from "axios";

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
        if (!/Web3Signer|CharonService|SSVNetwork/.test(client.service)) {
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

    stakingStore.keys = keyStats.map((key) => {
      return {
        ...key,
        displayName: alias[key.key]?.keyName,
        showGrafitiText: false,
        showCopyText: false,
        showRemoveText: false,
        showExitText: false,
        selected: false,
        groupName: alias[key.key]?.groupName,
        groupID: alias[key.key]?.groupID,
      };
    });
    if (stakingStore.keys && stakingStore.keys.length > 0) useUpdateValidatorStats();
  }
}

export async function useUpdateValidatorStats() {
  const nodeManageStore = useNodeManage();
  const stakingStore = useStakingStore();
  const serviceStore = useServices();
  let totalBalance = 0;
  let data = [];

  try {
    data = await ControlService.getValidatorState(stakingStore.keys.map((key) => key.key));

    if (!data || data.length == 0) {
      data = [];
      let latestEpochResponse = await axios.get(nodeManageStore.currentNetwork.dataEndpoint + "/epoch/latest", {
        validateStatus: function (status) {
          return status < 500;
        },
      });
      var latestEpoch = latestEpochResponse.data.data.epoch;
      let buffer = stakingStore.keys.map((key) => key.key);
      if (stakingStore.keys.length <= 100) {
        const chunkSize = 50;
        for (let i = 0; i < buffer.length; i += chunkSize) {
          //split validator accounts into chunks of 50 (api url limit)
          const chunk = buffer.slice(i, i + chunkSize);
          let response = await axios.get(nodeManageStore.currentNetwork.dataEndpoint + "/validator/" + encodeURIComponent(chunk.join()), {
            validateStatus: function (status) {
              return status < 500;
            },
          });

          if (response.data.data) data = data.concat(response.data.data); //merge all gathered stats in one array
        }
      }
    }
  } catch (err) {
    console.log("Couldn't fetch validator stats:\n", err);
    stakingStore.keys.forEach((key) => {
      key.status = "NA";
    });
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
      latestEpoch = latestEpoch ? parseInt(latestEpoch) : parseInt(info.latestEpoch);
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
  if (stakingStore.selectedServiceToFilter?.service === "CharonService") {
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
