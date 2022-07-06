<template>
  <div class="ctrlParent">
    <div class="machineName_cell"><machine-name></machine-name></div>
    <div class="the-ram"><node-server-response></node-server-response></div>
    <div class="sandFull_cell"><time-gas></time-gas></div>
    <dashboard-card class="discSpace_cell">
      <router-link class="link" to="/storage">
        <the-storage></the-storage
      ></router-link>
    </dashboard-card>
    <dashboard-card class="nodeStart_cell">
      <peer-to-peer></peer-to-peer
    ></dashboard-card>
    <dashboard-card class="peerConnection_cell">
      <the-cpu></the-cpu>
    </dashboard-card>
    <dashboard-card class="networkCheck"
      ><amsterdam-component></amsterdam-component>
    </dashboard-card>
    <dashboard-card class="validatorComment_cell">
      <validator-container-box></validator-container-box>
    </dashboard-card>
    <dashboard-card class="nodeStart"> <the-ram></the-ram></dashboard-card>
    <dashboard-card class="third_cell"
      ><the-network></the-network
    ></dashboard-card>
    <div class="half-card">
      <node-connection-card></node-connection-card>
    </div>
  </div>
</template>

<script>
import NodeServerResponse from "./NodeServerResponse.vue";
import ValidatorContainerBox from "./ValidatorContainerBox.vue";
import TheCpu from "./TheCpu.vue";
import TheStorage from "./TheStorage.vue";
import MachineName from "./MachineName.vue";
import DashboardCard from "./DashboardCard.vue";
import AmsterdamComponent from "./AmsterdamComponent.vue";
import TheRam from "./TheRam.vue";
import PeerToPeer from "./PeerToPeer.vue";
import TheNetwork from "./TheNetwork.vue";
import TimeGas from "./TimeGas.vue";
import NodeConnectionCard from "./NodeConnectionCard.vue";
export default {
  components: {
    TheStorage,
    DashboardCard,
    AmsterdamComponent,
    MachineName,
    TheRam,
    PeerToPeer,
    TheCpu,
    TheNetwork,
    ValidatorContainerBox,
    TimeGas,
    NodeServerResponse,
    NodeConnectionCard,
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
  color: #eee;
}

.ctrlParent {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(3, 32%);
  grid-template-rows: 13% repeat(3, 26%);
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

.nodeProcess_cell {
  grid-column: 2/3;
  grid-row: 1/2;
}

.sandFull_cell {
  grid-column: 3/4;
  grid-row: 1/2;
  border-radius: 0 15px 0 0;
  display: flex;
}

.discSpace_cell {
  grid-column: 1/2;
  grid-row: 2/3;
}

.networkCheck {
  grid-row: 2/3;
  grid-column: 2/3;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.peerConnection_cell {
  grid-column: 1/2;
  grid-row: 3/4;
}

.networkUsage_cell {
  grid-column: 1/2;
  grid-row: 4/5;
}

.validatorComment_cell {
  grid-column: 3/4;
  grid-row: 2/3;
}

.nodeStart {
  grid-column: 1/2;
  grid-row: 4/5;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.third_cell {
  grid-row: 4/5;
  grid-column: 2/3;
}
.half-card {
  grid-row: 3/4;
  grid-column: 3/4;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
