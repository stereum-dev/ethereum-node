<template>
  <div class="w-full h-6 grid grid-cols-24 items-center bg-[#33393E]">
    <div
      class="col-start-2 col-end-7 h-5 bg-[#161717] rounded-r-full px-[2px] grid grid-cols-12"
      @mouseenter="cursorLocation = stereumStatus ? `stereum status` : `Attempting to reconnect...`"
      @mouseleave="cursorLocation = ''"
    >
      <div class="col-start-1 col-span-2 self-center flex justify-start items-center p-[2px]">
        <img class="w-4 h-4" :src="getIcon" alt="WIFI Icon" />
      </div>

      <div class="col-start-3 col-end-8 flex justify-start items-center">
        <span class="text-sm font-semibold" :class="getStatusClass">{{ footerStore.stereumStatus ? "Online" : "Offline" }}</span>
      </div>

      <div class="w-full h-full col-start-8 col-span-full flex justify-end items-center">
        <span class="w-2/3 text-2xs text-center font-sans rounded-full p-[1px]" :class="getPingTimeClass">{{ getPingTime }} ms</span>
      </div>
    </div>
    <div class="col-start-7 col-span-full rounded-full text-sm text-gray-200 capitalize z-20 flex justify-start items-center">
      <span class="w-full text-xs font-sans ml-2">{{ footerStore.cursorLocation }}</span>
    </div>
  </div>
</template>

<script setup>
import { useFooter } from "@/store/theFooter";
import { computed } from "vue";
import { useNodeStore } from "../../store/theNode";

const footerStore = useFooter();
const nodeStore = useNodeStore();

const getPingTime = computed(() => {
  return Math.round(nodeStore.connectionStatus?.pingTime || 0);
});

const getIcon = computed(() => {
  switch (nodeStore.connectionStatus?.status) {
    case "excellent":
      return "/img/icon/connection-status/excellent.png";
    case "good":
      return "/img/icon/connection-status/good.png";
    case "fair":
      return "/img/icon/connection-status/fair.png";
    case "poor":
      return "/img/icon/connection-status/poor.png";
    case "very poor":
      return "/img/icon/connection-status/very-poor.png";
    default:
      return "/img/icon/connection-status/searching.gif";
  }
});

const getStatusClass = computed(() => {
  switch (nodeStore.connectionStatus?.status) {
    case "excellent":
      return "text-green-400";
    case "good":
      return "text-green-400";
    case "fair":
      return "text-yellow-400";
    case "poor":
      return "text-orange-500";
    case "very poor":
      return "text-red-500";
    default:
      return "text-white";
  }
});
const getPingTimeClass = computed(() => {
  switch (nodeStore.connectionStatus?.status) {
    case "excellent":
      return "bg-green-600 text-gray-50";
    case "good":
      return "bg-green-600 text-gray-50";
    case "fair":
      return "bg-yellow-400 text-gray-800";
    case "poor":
      return "bg-orange-500 text-gray-50";
    case "very poor":
      return "bg-red-500 text-gray-50";
    default:
      return "bg-red-500 text-gray-50";
  }
});
</script>

<style scoped lang="css">
.footer-parent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: default;
}
.footer-status-info {
  width: 85%;
  height: 4%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  left: 14%;
  font-size: 80%;
  color: #c1c1c1;
  font-weight: 700;
  text-transform: uppercase;
  position: absolute;
  bottom: 0.5%;
}
.stereum-status {
  width: 10%;
  height: 3.5%;
  background: #1f1f1f;
  border-radius: 0 30px 30px 0;
  margin-left: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  bottom: 0.5%;
  z-index: 50;
}
.stereum-stateIcon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 5%;
}
.online {
  color: green;
}

.offline {
  color: red;
}
.onlineState {
  background-color: green;
  z-index: 50;
}
.offlineState {
  background-color: red;
  z-index: 50;
}
.stereum-status-state {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 90%;
  z-index: 50;
}
</style>
