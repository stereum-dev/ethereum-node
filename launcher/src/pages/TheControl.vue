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
import ControlGrid from '../components/UI/the-control/ControlGrid.vue'
import { useControlStore } from '../store/theControl';
export default {
  components: { ControlGrid },
  computed:{
    ...mapWritableState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
      totalRam: "totalRam",
      usedRam: "usedRam",
      availDisk: "availDisk",
      usedDisk: "usedDisk",
      usedPerc: "usedPerc",
      cpu: "cpu",
      rx: "rx",
      tx: "tx",
    })
  },
  mounted(){
    this.polling = setInterval(this.refresh, 1000); //refresh services
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods:{
    async refresh(){
      const response = await ControlService.getServerVitals();
      if(response){
        this.ServerName = response.ServerName
        this.totalRam = response.totalRam
        this.usedRam = response.usedRam
        this.availDisk = response.availDisk
        this.usedDisk = response.usedDisk
        this.usedPerc = response.usedPerc
        this.cpu = response.cpu
        this.rx = response.rx
        this.tx = response.tx
      }
    }
  }
}
</script>

<style scoped>
#head {
  position: fixed;
  top: 0;
}
</style>
