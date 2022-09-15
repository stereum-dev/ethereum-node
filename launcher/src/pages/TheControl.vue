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
      storagestatus: "storagestatus",
      consensusClient: "consensusClient",
      consensusNumPeer: "consensusNumPeer",
      consensusValPeer: "consensusValPeer",
      executionClient: "executionClient",
      executionNumPeer: "executionNumPeer",
      executionValPeer: "executionValPeer",
    }),
  },
  mounted() {
    this.polling = setInterval(this.refresh, 1000); //refresh services
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods: {
    async refresh() {
      try {
        // @FRONTEND - getNodeStats returns an object with 3 keys (code/info/data)
        // code      : 0 (number!) means success all other values (including null or undefined) means error.
        // info      : a message about the last result.
        // data      : additional data (if available) or empty string
        // Eeach main element in the "data" response has also the same 3 keys to handle errors indivudually!
        // For example "data.syncstatus.{code|info|data}" or "data.p2pstatus.{code|info|data}"
        // At the moment the following data is provided:
        // data.syncstatus   : can be used for wiring launcher/src/components/UI/the-control/SyncStatus.vue
        // data.p2pstatus    : can be used for wiring launcher/src/components/UI/the-control/PeerToPeer.vue
        // data.storagestatus: can be used for wiring launcher/src/components/UI/the-control/TheStorage.vue
        const nodeStats = await ControlService.getNodeStats();

        // console.log("@FRONTEND: data for wiring controls", nodeStats);
        if (nodeStats) {
          try {
            this.code = nodeStats.code;
            this.valPeer = nodeStats.data.p2pstatus.data.valPeer;
            this.numPeer = nodeStats.data.p2pstatus.data.numPeer;
            this.syncstatus = nodeStats.data.syncstatus.data;
            this.storagestatus = nodeStats.data.storagestatus.data;
            this.consensusClient =
              nodeStats.data.p2pstatus.data.details.consensus.client;
            this.consensusNumPeer =
              nodeStats.data.p2pstatus.data.details.consensus.numPeer;
            this.consensusValPeer =
              nodeStats.data.p2pstatus.data.details.consensus.valPeer;
            this.executionClient =
              nodeStats.data.p2pstatus.data.details.execution.client;
            this.executionValPeer =
              nodeStats.data.p2pstatus.data.details.execution.valPeer;
            this.executionNumPeer =
              nodeStats.data.p2pstatus.data.details.execution.numPeer;
          } catch (e) {}
        }

        const response = await ControlService.getServerVitals();
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
