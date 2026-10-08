import ControlService from "@/store/ControlService";
import { useControlStore } from "@/store/theControl";

const lastRequestAt = {};

// Skips a request while the previous one of the same kind is still running (or younger than minIntervalMs)
async function requestQueued(meth, minIntervalMs = 0) {
  const controlStore = useControlStore();
  controlStore.request = Array.isArray(controlStore.request) ? controlStore.request : [];
  if (meth in controlStore.request && controlStore.request[meth]) {
    return;
  }
  if (Date.now() - (lastRequestAt[meth] || 0) < minIntervalMs) {
    return;
  }
  lastRequestAt[meth] = Date.now();
  controlStore.request[meth] = true;
  try {
    return await ControlService[meth]();
  } catch (err) {
    console.warn(`${meth} failed:`, err);
  } finally {
    // a failed request must not block this metric for the rest of the session
    controlStore.request[meth] = false;
  }
}

export async function useRefreshNodeStats() {
  const controlStore = useControlStore();
  try {
    // Get Node Stats
    requestQueued("getNodeStats").then((nodeStats) => {
      if (nodeStats) {
        // @FRONTEND - getNodeStats returns an object with 3 keys (code/info/data)
        // code      : 0 (number!) means success all other values (including null or undefined) means error.
        // info      : a message about the last result.
        // data      : additional data (if available) or empty string
        // On error, the "data" key may or may not holds additional error information.
        // On success, each main element in the "data" key has the same 3 keys to handle errors individually!
        // For example "data.syncstatus.{code|info|data}" or "data.p2pstatus.{code|info|data}"
        // At the moment the following data is provided:
        // data.syncstatus   : can be used for wiring launcher/src/components/UI/the-control/SyncStatus.vue
        // data.p2pstatus    : can be used for wiring launcher/src/components/UI/the-control/PeerToPeer.vue
        // data.storagestatus: can be used for wiring launcher/src/components/UI/the-control/TheStorage.vue
        // data.rpcstatus    : can be used for wiring launcher/src/components/UI/the-control/{RpcEndpoint|NodeConnectionRow}.vue
        // data.beaconstatus : can be used for wiring launcher/src/components/UI/the-control/{DataApi|NodeConnectionRow}.vue
        // data.portstatus   : can be used for wiring launcher/src/components/UI/the-control/PortList.vue
        // console.log("@FRONTEND: data for wiring controls", nodeStats);
        try {
          controlStore.code = nodeStats.code;
          controlStore.syncstatus = nodeStats.data.syncstatus ?? [];
          controlStore.p2pstatus = nodeStats.data.p2pstatus;
          controlStore.rpcstatus = nodeStats.data.rpcstatus;
          controlStore.wsstatus = nodeStats.data.wsstatus;
          controlStore.beaconstatus = nodeStats.data.beaconstatus;
          controlStore.portstatus = nodeStats.data.portstatus ?? [];
          controlStore.rpcReceivedData = nodeStats.data.rpcReceivedData;
          controlStore.subnetSubs = nodeStats.data.subnetSubs;
        } catch (e) {}
      }
    });
  } catch (err) {
    console.log("some other error occured", err);
  }
}

export async function useRefreshMetrics() {
  const controlStore = useControlStore();
  try {
    // Get Node Stats
    requestQueued("getNodeStats").then((nodeStats) => {
      if (nodeStats) {
        // @FRONTEND - getNodeStats returns an object with 3 keys (code/info/data)
        // code      : 0 (number!) means success all other values (including null or undefined) means error.
        // info      : a message about the last result.
        // data      : additional data (if available) or empty string
        // On error, the "data" key may or may not holds additional error information.
        // On success, each main element in the "data" key has the same 3 keys to handle errors individually!
        // For example "data.syncstatus.{code|info|data}" or "data.p2pstatus.{code|info|data}"
        // At the moment the following data is provided:
        // data.syncstatus   : can be used for wiring launcher/src/components/UI/the-control/SyncStatus.vue
        // data.p2pstatus    : can be used for wiring launcher/src/components/UI/the-control/PeerToPeer.vue
        // data.storagestatus: can be used for wiring launcher/src/components/UI/the-control/TheStorage.vue
        // data.rpcstatus    : can be used for wiring launcher/src/components/UI/the-control/{RpcEndpoint|NodeConnectionRow}.vue
        // data.beaconstatus : can be used for wiring launcher/src/components/UI/the-control/{DataApi|NodeConnectionRow}.vue
        // data.portstatus   : can be used for wiring launcher/src/components/UI/the-control/PortList.vue
        // console.log("@FRONTEND: data for wiring controls", nodeStats);
        try {
          controlStore.code = nodeStats.code;
          controlStore.syncstatus = nodeStats.data.syncstatus ?? [];
          controlStore.p2pstatus = nodeStats.data.p2pstatus;
          controlStore.rpcstatus = nodeStats.data.rpcstatus;
          controlStore.wsstatus = nodeStats.data.wsstatus;
          controlStore.beaconstatus = nodeStats.data.beaconstatus;
          controlStore.portstatus = nodeStats.data.portstatus ?? [];
          controlStore.rpcReceivedData = nodeStats.data.rpcReceivedData;
          controlStore.subnetSubs = nodeStats.data.subnetSubs;
        } catch (e) {}
        // console.log("nodeStats ===>", nodeStats);
      }
    });
    // Get Storage Status
    requestQueued("getStorageStatus").then((response) => {
      if (response) {
        try {
          controlStore.storagestatus = response.data;
        } catch (e) {}
      }
    });
    // Get Balance Status (rewards of the last finalized epoch, which only changes every few minutes)
    requestQueued("getBalanceStatus", 60000).then((response) => {
      if (response) {
        try {
          controlStore.balancestatus = response.data;
        } catch (e) {}
      }
    });
    // Get Server Vitals
    requestQueued("getServerVitals").then((response) => {
      if (response) {
        controlStore.ServerName = response.ServerName;
        controlStore.totalRam = response.totalRam;
        controlStore.usedRam = response.usedRam;
        controlStore.availDisk = response.availDisk;
        controlStore.totalDisk = response.totalDisk;
        controlStore.usedPerc = response.usedPerc;
        controlStore.cpu = response.cpu;
        controlStore.rx = response.rx;
        controlStore.tx = response.tx;
        controlStore.readValue = response.readValue;
        controlStore.writeValue = response.writeValue;
        controlStore.tempCPU = response.tempCPU;
      }
    });
  } catch (err) {
    console.log("some other error occured", err);
  }
}
