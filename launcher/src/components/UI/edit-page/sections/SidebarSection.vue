<template>
  <aside class="flex flex-col items-center w-18 h-full bg-[#33393E]" @pointerdown.prevent.stop @mousedown.prevent.stop>
    <div class="w-full grid grid-rows-3 mt-20 p-1 gap-y-5">
      <router-link
        v-if="!routerHovered"
        to="/node"
        class="col-span-1 row-start-1 row-end-2 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a]"
        @mouseover="routerHovered = true"
      >
        <img class="w-7" src="/img/icon/arrows/left-1.png" alt="Manage Icon" />
      </router-link>
      <router-link v-else to="/node" class="showManageBtn" @mouseleave="routerHovered = false">
        <img class="w-7 mr-1" src="/img/icon/arrows/left-1.png" alt="Manage Icon" />
        <span class="text-sm text-gray-200 font-semibold">Back to Node</span>
      </router-link>
      <button
        v-if="!networkHovered"
        class="col-span-1 row-start-2 row-end-3 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200"
        @mouseenter="networkHovered = true"
      >
        <img src="/img/icon/manage-node-icons/change-network.png" alt="Network" />
      </button>

      <button v-else class="showNetworkBtn" @mouseleave="networkHovered = false" @click="emit('networkModal')">
        <img class="w-7 mr-1" src="/img/icon/manage-node-icons/change-network.png" alt="Network Icon" />
        <span class="text-sm text-gray-200 font-semibold">Switch Network</span>
      </button>

      <button
        v-if="!nukeHovered"
        class="row-start-3 row-end-4 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a]"
        @mouseenter="nukeHovered = true"
      >
        <img class="w-8" src="/img/icon/manage-node-icons/nuke.png" alt="Export Icon" />
      </button>
      <button v-else class="showExportBtn" @mouseleave="nukeHovered = false" @click="nukeNode">
        <img class="w-7 mr-1" src="/img/icon/manage-node-icons/nuke.png" alt="Export Icon" />
        <span class="text-sm text-gray-200 font-semibold">Nuke Node</span>
      </button>
    </div>
  </aside>
</template>
<script setup>
import { ref } from "vue";

const routerHovered = ref(false);
const networkHovered = ref(false);
const nukeHovered = ref(false);
const emit = defineEmits(["nukeNode", "networkModal"]);

const nukeNode = () => {
  console.log("nuking");
  emit("nukeNode");
};
</script>

<style scoped>
.showManageBtn {
  grid-column: 1;
  grid-row: 1/2;
  position: absolute;
  border: 1px solid rgb(71, 75, 80);
  padding: 5px;
  border-radius: 5px;
  width: max-content;
  min-height: 35px;
  display: flex;
  background: #374151;
  box-shadow: 0 1px 3px 1px rgb(33, 34, 34);
  align-items: center;
  justify-content: space-evenly;
  transform: translateX(0);
  animation: fadeIn 0.5s ease-in-out;
  z-index: 100;
}
.showNetworkBtn {
  grid-column: 1;
  grid-row: 2/3;
  position: absolute;
  border: 1px solid rgb(58, 61, 65);
  padding: 5px;
  border-radius: 5px;
  width: max-content;
  min-height: 35px;
  display: flex;
  background: #374151;
  box-shadow: 0 1px 3px 1px rgb(33, 34, 34);
  align-items: center;
  justify-content: space-evenly;
  transform: translateX(0);
  animation: fadeIn 0.5s ease-in-out;
  z-index: 100;
}
.showExportBtn {
  grid-column: 1;
  grid-row: 3/4;
  position: absolute;
  border: 1px solid rgb(58, 61, 65);
  padding: 5px;
  border-radius: 5px;
  width: max-content;
  min-height: 35px;
  display: flex;
  background: #374151;
  box-shadow: 0 1px 3px 1px rgb(33, 34, 34);
  align-items: center;
  justify-content: space-evenly;
  transform: translateX(0);
  animation: fadeIn 0.5s ease-in-out;
  z-index: 100;
}
.showManageBtn:active,
.showNetworkBtn:active,
.showExportBtn:active {
  transform: scale(0.95);
}
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }

  100% {
    opacitx: 1;
    transform: translateX(0);
  }
}
</style>
