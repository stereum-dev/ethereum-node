<template>
  <div class="np2p-parent" @mouseenter="footerStore.cursorLocation = `${compName}`" @mouseleave="footerStore.cursorLocation = ''">
    <div class="np2p-icon-box">
      <div class="np2p-icon-box_container">
        <img src="/img/icon/control-page-icons/PeertoPeerIcon.png" alt="" />
      </div>
      <span class="uppercase">{{ $t("controlPage.p2pNet") }}</span>
    </div>
    <div class="np2p-rowsbox">
      <div
        v-for="(item, index) in peerRows(selectedService)"
        :key="index"
        class="service-rox"
        @mouseenter="footerStore.cursorLocation = `${item.name} : ${dummy}`"
        @mouseleave="footerStore.cursorLocation = `${compName}`"
      >
        <div class="service-rox_icon"><img :src="item.icon" :alt="item.name" /></div>
        <div class="service-row_val">
          <span>{{ dummy }}</span>
        </div>
      </div>
    </div>
    <div class="service-selction">
      <div
        class="service-icon"
        :style="{ background: selectedService == consensus ? '#94DEFF' : '' }"
        @click="selectService(consensus)"
        @mouseenter="footerStore.cursorLocation = `${selConcensus}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          :class="controlStore.currentConsensusIcon == '' ? 'animate-spin' : ''"
          :src="controlStore.currentConsensusIcon == '' ? '/img/icon/loading-icons/loading-circle.png' : controlStore.currentConsensusIcon"
          alt="consensus"
        />
      </div>
      <div
        class="service-icon"
        :style="{ background: selectedService == execution ? '#94DEFF' : '' }"
        @click="selectService(execution)"
        @mouseenter="footerStore.cursorLocation = `${selExecution}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          :class="controlStore.currentExecutionIcon == '' ? 'animate-spin' : ''"
          :src="controlStore.currentExecutionIcon == '' ? '/img/icon/loading-icons/loading-circle.png' : controlStore.currentExecutionIcon"
          alt="execution"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useControlStore } from "@/store/theControl";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

import { ref } from "vue";

const t = i18n.global.t;

const footerStore = useFooter();
const serviceStore = useServices();
const controlStore = useControlStore();

const compName = t("controlPage.p2pNet");
const selConcensus = t("controlPage.selConcensus");
const selExecution = t("controlPage.selExecution");

const selectedService = ref("consensus");
const consensus = ref("consensus");
const execution = ref("execution");
const dummy = ref("000000000000"); // dummy data

const selectService = (service) => {
  selectedService.value = service;
};

const peerRows = (arg) => {
  console.log(serviceStore.allServices.filter((item) => item.category.toLowerCase() === arg));
  return serviceStore.allServices.filter((item) => item.category.toLowerCase() === arg);
};

console.log(serviceStore.allServices.filter((item) => item.category.toLowerCase() === "consensus"));
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
  height: 95%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
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
.service-rox_icon {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-rox_icon img {
  width: 0.8rem;
  height: 0.8rem;
}
.service-row_val {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80%;
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
