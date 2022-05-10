<template>
  <div class="ctrlParent">
    <div class="machineName_cell"><machine-name></machine-name></div>
    <div class="the-ram"><the-ram></the-ram></div>
    <div class="sandFull_cell">
      <sand-clock></sand-clock>
    </div>
    <dashboard-card class="discSpace_cell">
      <the-storage></the-storage>
    </dashboard-card>
    <dashboard-card class="nodeStart_cell"
      ><amsterdam-component></amsterdam-component
    ></dashboard-card>
    <dashboard-card class="peerConnection_cell">
      <router-link class="link" to="/cpu">
        <peer-to-peer></peer-to-peer>
      </router-link>
    </dashboard-card>
    <dashboard-card class="networkCheck">
      <the-network></the-network>
    </dashboard-card>
    <dashboard-card class="validatorComment_cell">
     <validator-container-box></validator-container-box>
    </dashboard-card>
    <dashboard-card class="nodeStart"><the-cpu></the-cpu> </dashboard-card>
  </div>
</template>

<script>
import ValidatorContainerBox from "./ValidatorContainerBox.vue";
import TheCpu from "./TheCpu.vue";
import TheStorage from "./TheStorage.vue";
import MachineName from "./MachineName.vue";
import SandClock from "./SandClock.vue";
import DashboardCard from "./DashboardCard.vue";
import InclusionDistance from "./InclusionDistance.vue";
import AmsterdamComponent from "./AmsterdamComponent.vue";
import TheValidator from "./TheValidator.vue";
import TheRam from "./TheRam.vue";
import PeerToPeer from "./PeerToPeer.vue";
import TheNetwork from "./TheNetwork.vue";
export default {
  components: {
    SandClock,
  
    TheStorage,
    DashboardCard,
    AmsterdamComponent,
    
    MachineName,
    TheRam,
    PeerToPeer,
    TheCpu,
    TheNetwork,
    ValidatorContainerBox
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
  color: #eee;
  font-size: 50%;
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
</style>
