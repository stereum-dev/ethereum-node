<template>
  <div class="np2p-parent">
    <div class="np2p-icon-box">
      <div class="np2p-icon-box_container">
        <img src="/img/icon/control/PeertoPeerIcon.png" alt="" />
      </div>
      <span>PEER TO PEER NETWORK</span>
    </div>
    <div class="np2p-rowsbox">
      <div class="service-rox"></div>
    </div>
    <div class="service-selction">
      <div
        class="service-icon"
        :style="{ background: selectedService == consensus ? '#94DEFF' : '' }"
        @click="selectService(consensus)"
      >
        <img :src="controlStore.currentConsensusIcon" alt="" />
      </div>
      <div
        class="service-icon"
        :style="{ background: selectedService == execution ? '#94DEFF' : '' }"
        @click="selectService(execution)"
      >
        <img :src="controlStore.currentExecutionIcon" alt="" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useControlStore } from "@/store/theControl";
import { ref } from "vue";

const controlStore = useControlStore();
const selectedService = ref("consensus");
const consensus = ref("consensus");
const execution = ref("execution");

const selectService = (service) => {
  selectedService.value = service;
  console.log(selectedService.value);
};
</script>

<style scoped>
.np2p-parent {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
}
.np2p-icon-box {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.np2p-icon-box_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.np2p-icon-box_container img {
  width: 55%;
  height: 70%;
}
.np2p-icon-box span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
  color: #c1c1c1;
}
.np2p-rowsbox {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.service-rox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  height: 25%;
  margin: 1.2px;
  font-size: 70%;
  font-weight: 600;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  padding: 1% 2%;
}
.service-selction {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}
.service-icon {
  width: 90%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #232222;
  border-radius: 10px;
  margin: 1.2px;
  border: 1px solid #232222;
  box-shadow: 1px 1px 5px 1px #171717;
  cursor: pointer;
}
.service-icon img {
  width: 1.5rem;
  height: 1.5rem;
}
.service-icon:hover {
  background: #313131;
  border: 1px solid #c1c1c1;
  box-shadow: none;
}
.service-icon:active {
  background: #313131;
  border: none;
  box-shadow: inset 1px 1px 5px 1px #171717;
}
</style>
