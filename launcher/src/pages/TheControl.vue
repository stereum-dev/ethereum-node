<template>
  <div class="control-parent">
    <node-bg>
      <control-grid></control-grid>
    </node-bg>
    <node-header id="head"> </node-header>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import ControlService from "@/store/ControlService";
import ControlGrid from "../components/UI/the-control/ControlGrid.vue";
import { useControlStore } from "../store/theControl";
export default {
  components: { ControlGrid },
  computed: {
    ...mapWritableState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
      totalRam: "totalRam",
      usedRam: "usedRam",
      totalDisk: "totalDisk",
      availDisk: "availDisk",
      usedPerc: "usedPerc",
      cpu: "cpu",
      rx: "rx",
      tx: "tx",
      readValue: "readValue",
      writeValue: "writeValue",
      code: "code",
      syncstatus: "syncstatus",
      p2pstatus: "p2pstatus",
      rpcstatus: "rpcstatus",
      beaconstatus: "beaconstatus",
      portstatus: "portstatus",
      storagestatus: "storagestatus",
    }),
  },
  mounted() {
    this.polling = setInterval(this.refresh, 100); //refresh services
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods: {
    async requestQueued() {
      this.request = Array.isArray(this.request) ? this.request : [];
      const ARGUMENTS = Array.prototype.slice.call(arguments); // convert functon "arguments" to Array
      const meth = ARGUMENTS.length ? ARGUMENTS.shift() : null;
      const args = ARGUMENTS.length ? ARGUMENTS : null;
      if (meth in this.request && this.request[meth]) {
        return;
      }
      this.request[meth] = true;
      const csvc = ControlService;
      const func = eval("async () => {return await csvc." + meth + "()}");
      const resp = await func();
      this.request[meth] = false;
      return resp;
    },
    async refresh() {
      try {
        // Get Node Stats
        this.requestQueued("getNodeStats").then((nodeStats) => {
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
              this.code = nodeStats.code;
              this.syncstatus = nodeStats.data.syncstatus;
              this.p2pstatus = nodeStats.data.p2pstatus;
              this.rpcstatus = nodeStats.data.rpcstatus;
              this.beaconstatus = nodeStats.data.beaconstatus;
              this.portstatus = nodeStats.data.portstatus;
              this.storagestatus = nodeStats.data.storagestatus.data;
            } catch (e) {}
          }
        });
        // Get Server Vitals
        this.requestQueued("getServerVitals").then((response) => {
          if (response) {
            this.ServerName = response.ServerName;
            this.totalRam = response.totalRam;
            this.usedRam = response.usedRam;
            this.availDisk = response.availDisk;
            this.totalDisk = response.totalDisk;
            this.usedPerc = response.usedPerc;
            this.cpu = response.cpu;
            this.rx = response.rx;
            this.tx = response.tx;
            this.readValue = response.readValue;
            this.writeValue = response.writeValue;
          }
        });
      } catch (err) {
        console.log("some other error occured", err);
      }
    },
  },
};
</script>

<style scoped>
#head {
  position: fixed;
  top: 0;
}
</style>
