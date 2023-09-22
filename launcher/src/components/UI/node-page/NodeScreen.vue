<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24 relative">
      <div class="col-start-1 col-span-1 flex justify-center items-center">
        <SidebarSection />
      </div>
      <div class="col-start-2 col-end-17 w-full h-full relative">
        <NodeSection />
      </div>
      <div class="col-start-17 col-end-21 ml-1">
        <ServiceSection />
      </div>
      <div class="col-start-21 col-end-25 px-1 flex flex-col justify-between">
        <div class="h-[60px] self-center w-full flex flex-col justify-center items-center">
          <button
            class="w-full h-[34px] rounded-full bg-[#264744] hover:bg-[#325e5a] px-2 py-1 text-gray-200 active:scale-95 shadow-md shadow-zinc-800 active:shadow-none transition-all duration-200 ease-in-out uppercase flex justify-center items-center"
            @click="alarmToggle"
            @mouseenter="cursorLocation = infoAlarm ? `${chckTutorial}` : `${returnStatus}`"
            @mouseleave="cursorLocation = ''"
          >
            <img class="w-8" src="/img/icon/round-icon.png" alt="information" />
          </button>
        </div>
        <AlertSection :info-aralm="infoAlarm" />
      </div>
    </div>

    <!-- End Node main layout -->
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection";
import NodeSection from "./sections/NodeSection.vue";
import ServiceSection from "./sections/ServiceSection.vue";
import AlertSection from "./sections/AlertSection.vue";
import { ref } from "vue";
import { useNodeStore } from "@/store/theNode";

const expertModeClient = ref(null);
const updatePowerState = ref(false);
const cursorLocation = ref("");
const chckTutorial = "/img/icon/round-icon.png";
const returnStatus = "/img/icon/round-icon.png";
const displayUpdatePanel = ref(false);

const { infoAlarm, hideConnectedLines, runNodePowerModal } = useNodeStore();

const alarmToggle = () => {
  infoAlarm.value = !infoAlarm.value;
};
</script>

<style scoped>
.info-button {
  width: 98%;
  height: 7%;
  background: #264744;
  border-radius: 20px;
  box-shadow: 0 1px 3px 0px #1c1f22;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 3px;
  margin-bottom: 15px;
}
.info-button:hover {
  background: rgb(43, 84, 81);
}
.info-button:active {
  background: rgba(43, 84, 81, 0.5);
}
.info-button img {
  max-width: 19%;
}
</style>
