import ControlService from "@/store/ControlService";
import { useControlStore } from "@/store/theControl";

async function requestQueued() {
  const controlStore = useControlStore();
  controlStore.request = Array.isArray(controlStore.request) ? controlStore.request : [];
  const ARGUMENTS = Array.prototype.slice.call(arguments); // convert functon "arguments" to Array
  const meth = ARGUMENTS.length ? ARGUMENTS.shift() : null;
  const args = ARGUMENTS.length ? ARGUMENTS : null; // eslint-disable-line no-unused-vars
  if (meth in controlStore.request && controlStore.request[meth]) {
    return;
  }
  controlStore.request[meth] = true;
  const csvc = ControlService; // eslint-disable-line no-unused-vars
  const func = eval("async () => {return await csvc." + meth + "()}");
  const resp = await func();
  controlStore.request[meth] = false;
  return resp;
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
          controlStore.syncstatus = nodeStats.data.syncstatus;
          controlStore.p2pstatus = nodeStats.data.p2pstatus;
          controlStore.rpcstatus = nodeStats.data.rpcstatus;
          controlStore.wsstatus = nodeStats.data.wsstatus;
          controlStore.beaconstatus = nodeStats.data.beaconstatus;
          controlStore.portstatus = nodeStats.data.portstatus;
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
          controlStore.syncstatus = nodeStats.data.syncstatus;
          controlStore.p2pstatus = nodeStats.data.p2pstatus;
          controlStore.rpcstatus = nodeStats.data.rpcstatus;
          controlStore.wsstatus = nodeStats.data.wsstatus;
          controlStore.beaconstatus = nodeStats.data.beaconstatus;
          controlStore.portstatus = nodeStats.data.portstatus;
        } catch (e) {}
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
    // Get Balance Status
    requestQueued("getBalanceStatus").then((response) => {
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
      }
    });
  } catch (err) {
    console.log("some other error occured", err);
  }
}
