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
  let clients = serviceStore.installedServices.filter(
    (s) => s.category == "validator" && s.service != "CharonService" && s.service != "SSVNetworkService"
  );
  if ((clients && clients.length > 0 && nodeManageStore.currentNetwork?.network != "") || forceRefresh) {
    for (let client of clients) {
      //if there is already a list of keys ()
      if (
        (client.config.keys === undefined || client.config.keys.length === 0 || forceRefresh) &&
        client.state === "running"
      ) {
        //refresh validaotr list
        let result = await ControlService.listValidators(client.config.serviceID);

        if (!client.service.includes("Web3Signer")) {
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
              return { key: e.validating_pubkey, isRemote: e.readonly };
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
      if (
        keysToWrite[key] === undefined &&
        serviceStore.installedServices.some((s) => s.config?.serviceID === alias[key].validatorID)
      ) {
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

      const chunkSize = 50;
      for (let i = 0; i < buffer.length; i += chunkSize) {
        //split validator accounts into chunks of 50 (api url limit)
        const chunk = buffer.slice(i, i + chunkSize);
        let response = await axios.get(
          nodeManageStore.currentNetwork.dataEndpoint + "/validator/" + encodeURIComponent(chunk.join()),
          {
            validateStatus: function (status) {
              return status < 500;
            },
          }
        );
        if (response.data.data) data = data.concat(response.data.data); //merge all gathered stats in one array
      }
    }
  } catch (err) {
    console.log("Couldn't fetch validator stats:\n", err);
    stakingStore.keys.forEach((key) => {
      key.status = "NA";
    });
    return;
  }

  stakingStore.keys.forEach((key) => {
    let info = data.find((k) => k.pubkey === key.key);
    if (info) {
      let d = new Date();
      let now = new Date();
      latestEpoch = latestEpoch ? parseInt(latestEpoch) : parseInt(info.latestEpoch);
      let activationEpoch = parseInt(info.activationepoch);
      if (key.network === "gnosis") {
        d.setMilliseconds(d.getMilliseconds() - (latestEpoch - activationEpoch) * 80000);
      } else {
        d.setMilliseconds(d.getMilliseconds() - (latestEpoch - activationEpoch) * 384000);
      }
      key.index = info.validatorindex;
      key.status = info.status;
      key.balance = info.balance / 1000000000;
      key.activeSince = ((now.getTime() - d.getTime()) / 86400000).toFixed(1) + " Days";
      if (key.isRemote) {
        if (!stakingStore.keys.some((k) => k.key === key.key && !k.isRemote)) {
          totalBalance += key.balance;
        }
      } else {
        totalBalance += key.balance;
      }
    } else {
      key.status = "deposit";
      key.balance = "-";
    }
  });
  stakingStore.totalBalance = totalBalance;
}
