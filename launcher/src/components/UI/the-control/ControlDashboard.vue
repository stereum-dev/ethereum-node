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

    <!-- <div class="networkSync_cell"></div> -->
    <dashboard-card class="nodeStart_cell"
      ><amsterdam-component></amsterdam-component
    ></dashboard-card>
    <dashboard-card class="peerConnection_cell">
      <router-link class="link" to="/cpu">
        <peer-to-peer></peer-to-peer>
      </router-link>
    </dashboard-card>
    <!-- <div class="networkCheck"></div> -->
    <dashboard-card class="networkCheck">
      <div class="wifiIco">
        <img
          class="wifiImg"
          src="../../../../public/img/icon/wifiIcon.svg"
          alt=""
        />
      </div>
      <div class="recive">
        <span class="rec">{{ rec }}</span>
        <span class="lblMbit">mbit</span>
        <small>Total Received</small>
        <div class="arrowPart">
          <div class="arrowIco">
            <img src="../../../../public/img/icon/arrows/arrowOrange.png" />
          </div>
          {{ ttlRec }} <span class="ttlRec">GB</span>
        </div>
      </div>
      <div class="transmit">
        <span class="tran">{{ tran }}</span>
        <span class="lblMbit">mbit</span>
        <small>Total Transmietted</small>
        <div class="arrowPart">
          <div class="arrowIco">
            <img src="../../../../public/img/icon/arrows/arrowGreen.png" />
          </div>
          {{ ttlTrn }} <span class="ttlRec">GB</span>
        </div>
      </div>
    </dashboard-card>

    <!-- <div class="validatorComment_cell">
      <storage-counter class="validCntr"></storage-counter>
    </div> -->
    <dashboard-card class="validatorComment_cell">
      <inclusion-distance class="validCntr"></inclusion-distance>
      <the-validator></the-validator>
    </dashboard-card>

    <!-- <div class="nodeStart"></div> -->
    <dashboard-card class="nodeStart"><the-cpu></the-cpu> </dashboard-card>
  </div>
</template>

<script>
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
export default {
  components: {
    SandClock,
    InclusionDistance,
    TheStorage,
    DashboardCard,
    AmsterdamComponent,
    TheValidator,
    MachineName,
    TheRam,
    PeerToPeer,
    TheCpu,
  },
  data() {
    return {
      No: 100,
      rec: 1.12,
      tran: 1.12,
      ttlRec: 44.6,
      ttlTrn: 44.6,
    };
  },
};
</script>

<style scoped>
.link {
  text-decoration: none;
  color: #eee;
  font-size: 50%;
}
.validCntr {
  width: 40%;
}
.recive {
  width: 30%;
  display: flex;
  flex-direction: column;
}
.rec {
  color: #ec590a;
  font-weight: bold;
  font-size: 1rem;
}
.transmit {
  width: 30%;
  display: flex;
  flex-direction: column;
}
small {
  font-size: 0.3rem;
}
.tran {
  color: #336666;
  font-weight: bold;
  font-size: 1rem;
}
.lblMbit {
  color: #eee;
  font-weight: bold;
  font-size: 0.9rem;
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
.sddimg {
  width: 30%;
}
.hddSvg {
  width: 80%;
}
.infoHdd {
  width: 80%;
}
.infHdd {
  display: flex;
  flex-direction: column;
}
.loading-container {
  width: 100%;
  height: 100%;
}
/*.networkSync_cell {
  grid-column: 2/3;
  grid-row: 2/3;
  display: flex;
  border: 1px solid orange;
}*/
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

.nodeStart_cell {
  width: 135%;
  height: 140%;
}

.networkUsage_cell {
  grid-column: 1/2;
  grid-row: 4/5;
}

.validatorComment_cell {
  grid-column: 3/4;
  grid-row: 2/3;
}

.netThermo {
  position: relative;
  top: 0rem;
}
.nodeStart {
  grid-column: 1/2;
  grid-row: 4/5;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.colorBar {
  width: 60%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.loli {
  width: 80%;
}
.imgCpu {
  width: 30%;
}
.cpuImg {
  width: 80%;
}
.wifiIco {
  width: 30%;
}
.wifiImg {
  width: 80%;
}

.slice-colors .slice-item {
  width: 100%;
  height: 100%;
}
.arrowPart {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.arrowIco {
  width: 20%;
}
.arrowIco img {
  width: 100%;
}
.ttlRec {
  font-weight: bold;
  color: #eee;
}
</style>
