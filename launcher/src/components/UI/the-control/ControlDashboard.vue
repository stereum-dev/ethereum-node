<template>
  <div class="ctrlParent">
    <div class="machineName_cell"><machine-name></machine-name></div>
    <div class="node-serve">
      <node-server-response></node-server-response>
    </div>
    <div class="sandFull_cell"><time-gas></time-gas></div>
    <dashboard-card class="hard-disk">
      <the-hard></the-hard>
    </dashboard-card>
    <dashboard-card class="storage"><the-storage></the-storage></dashboard-card>
    <dashboard-card class="disk-speed"
      ><disk-speed></disk-speed
    ></dashboard-card>
    <dashboard-card class="p2p"> <peer-to-peer></peer-to-peer></dashboard-card>
    <dashboard-card class="the-cpu">
      <the-cpu></the-cpu>
    </dashboard-card>
    <dashboard-card class="amsterdam"
      >
      <amsterdam-component></amsterdam-component>
    </dashboard-card>
    <dashboard-card class="sync-status"
      ><sync-status></sync-status
    ></dashboard-card>
    <dashboard-card class="validatorComment_cell">
      <comming-soon></comming-soon>
      <the-staking></the-staking>
    </dashboard-card>
    <dashboard-card class="the-ram"> <the-ram></the-ram></dashboard-card>
    <dashboard-card class="the-network"
      ><the-network></the-network
    ></dashboard-card>
    <dashboard-card class="portlist_card"
      ><port-list></port-list
    ></dashboard-card>

    <div class="half-card">
      <rpc-endpoint></rpc-endpoint>
    </div>
    <div class="half-card2"><data-api></data-api></div>
  </div>
</template>

<script>
import TheStorage from "./TheStorage.vue";
import DataApi from "./DataApi.vue";
import SyncStatus from "./SyncStatus.vue";
import NodeServerResponse from "./NodeServerResponse.vue";
import TheCpu from "./TheCpu.vue";
import TheHard from "./TheHard.vue";
import MachineName from "./MachineName.vue";
import DashboardCard from "./DashboardCard.vue";
import AmsterdamComponent from "./AmsterdamComponent.vue";
import TheRam from "./TheRam.vue";
import PeerToPeer from "./PeerToPeer.vue";
import TheNetwork from "./TheNetwork.vue";
import TimeGas from "./TimeGas.vue";
import RpcEndpoint from "./RpcEndpoint.vue";
import DiskSpeed from "./DiskSpeed.vue";
import PortList from "./PortList.vue";
import TheStaking from "./TheStaking.vue";
import CommingSoon from "../../layers/CommingSoon.vue";
export default {
  components: {
    PortList,
    TheStorage,
    DataApi,
    SyncStatus,
    TheHard,
    DashboardCard,
    AmsterdamComponent,
    MachineName,
    TheRam,
    PeerToPeer,
    TheCpu,
    TheNetwork,
    TimeGas,
    NodeServerResponse,
    RpcEndpoint,
    DiskSpeed,
    TheStaking,
    CommingSoon,
  },
};
</script>

<style scoped>
.portlist_card {
  grid-column: 2/3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
}
.link {
  text-decoration: none;
  color: #eee;
}

.ctrlParent {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(3, 32%);
  grid-template-rows: 10% repeat(5, 16.5%);
  position: relative;
  gap: 1%;
  margin: 1%;
  box-sizing: border-box;
}
.card a {
  width: 100%;
  height: 100%;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.machineName_cell {
  grid-column: 1/2;
  grid-row: 1/2;
  color: aliceblue;
  border-radius: 15px 0 0 0;
}

.node-serve {
  grid-column: 2/3;
  grid-row: 1/2;
}

.sandFull_cell {
  grid-column: 3/4;
  grid-row: 1/2;
  border-radius: 0 15px 0 0;
  display: flex;
}

.hard-disk {
  grid-column: 1/2;
  grid-row: 2/3;
}
.storage {
  grid-column: 1/2;
  grid-row: 3/4;
}
.disk-speed {
  grid-column: 1/2;
  grid-row: 4/5;
}
.amsterdam {
  grid-row: 3/4;
  grid-column: 2/3;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.the-cpu {
  grid-row: 5/6;
  grid-column: 1/2;
}
.sync-status {
  grid-column: 2/3;
  grid-row: 4/5;
}

.validatorComment_cell {
  grid-column: 3/4;
  grid-row: 2/3;
}

.the-ram {
  grid-column: 1/2;
  grid-row: 6/7;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.the-network {
  grid-row: 2/3;
  grid-column: 2/3;
}
.half-card {
  grid-row: 3/4;
  grid-column: 3/4;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.half-card2 {
  grid-row: 4/5;
  grid-column: 3/4;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.p2p {
  grid-row: 5/6;
  grid-column: 2/3;
}
</style>
