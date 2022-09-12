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
        // code      : 0 means success all other values means error.
        // info      : a message about the last result.
        // data      : additional data (if available) or empty string
        // At the moment the following data is provided:
        // data.syncstatus: can be used for wiring launcher/src/components/UI/the-control/SyncStatus.vue
        // data.p2pstatus : can be used for wiring launcher/src/components/UI/the-control/PeerToPeer.vue
        const nodeStats = await ControlService.getNodeStats();
        console.log("@FRONTEND: data for wiring controls",nodeStats);
        // if(!nodeStats.code){
        //   try{
        //     console.log('syncstatus[0] -> title',nodeStats.data.syncstatus[0].title);
        //     console.log('syncstatus[0] -> frstVal',nodeStats.data.syncstatus[0].frstVal);
        //     console.log('syncstatus[0] -> scndVal',nodeStats.data.syncstatus[0].scndVal);
        //     console.log('syncstatus[1] -> title',nodeStats.data.syncstatus[1].title);
        //     console.log('syncstatus[1] -> frstVal',nodeStats.data.syncstatus[1].frstVal);
        //     console.log('syncstatus[1] -> scndVal',nodeStats.data.syncstatus[1].scndVal);
        //     console.log('p2pstatus -> maxPeer',nodeStats.data.p2pstatus.maxPeer); // maximum number of peer connections
        //     console.log('p2pstatus -> numPeer',nodeStats.data.p2pstatus.numPeer); // current number of peer connections
        //     console.log('p2pstatus -> valPeer',nodeStats.data.p2pstatus.valPeer); // current peers in percentage
        //   }catch(e){}
        // }

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
        console.log('some other error occured',err);
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
