<template>
  <aside class="flex flex-col items-center w-18 h-full custom-gradient" @pointerdown.prevent.stop @mousedown.prevent.stop>
    <div class="w-full grid grid-rows-3 mt-20 p-1 gap-y-5">
      <div
        class="col-span-1 row-start-1 row-end-2 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a] flex justify-center items-center"
        @click="hoverRouter"
        @mouseenter="footerStore.cursorLocation = `${toNode}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-8 h-5" src="/img/icon/edit-node-icons/back-to-node.png" alt="Manage Icon" />
      </div>
      <Transition name="slide-fade">
        <router-link
          v-if="routerHovered"
          to="/node"
          class="w-fit h-9 absolute col-span-1 row-start-1 row-end-2 py-1 px-2 rounded-md bg-gray-700 border border-gray-500 flex justify-between items-center space-x-2 ml-1 transition duration-200 shadow-md shadow-[#23272a] z-50"
          @mouseleave="routerHovered = false"
        >
          <img class="w-6 h-4 mr-1" src="/img/icon/edit-node-icons/back-to-node.png" alt="Manage Icon" />
          <span class="text-sm text-gray-200 font-semibold">{{ $t("sidebarSect.toNode") }}</span>
        </router-link>
      </Transition>
      <button
        v-if="setupStore.isEditConfigViewActive && setupStore.selectedSetup"
        class="col-span-1 row-start-2 row-end-3 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a] flex justify-center items-center"
        @click="hoverNetwork"
        @mouseenter="footerStore.cursorLocation = `${setchNet}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-6" src="/img/icon/edit-node-icons/change-network.png" alt="Network" />
      </button>
      <Transition name="slide-fade">
        <button
          v-if="networkHovered"
          class="w-fit h-9 absolute row-start-2 row-end-3 py-1 px-2 rounded-md duration-200 bg-gray-700 border border-gray-500 flex justify-between items-center z-10 space-x-2 ml-1"
          @mouseleave="networkHovered = false"
          @click="networkModal"
        >
          <img class="w-4 mr-1" src="/img/icon/edit-node-icons/change-network.png" alt="Network Icon" />
          <span class="text-sm text-gray-200 font-semibold">{{ setchNet }}</span>
        </button>
      </Transition>

      <button
        v-if="!setupStore.isEditConfigViewActive && setupStore.selectedSetup === null"
        class="row-start-2 row-end-3 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a] flex justify-center items-center"
        @click="hoverNuke"
        @mouseenter="footerStore.cursorLocation = `${nukTheNud}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-6" src="/img/icon/edit-node-icons/nuke-node.png" alt="Export Icon" />
      </button>
      <Transition name="slide-fade">
        <button
          v-if="nukeHovered"
          class="w-fit h-9 absolute row-start-2 row-end-3 py-1 px-2 rounded-md duration-200 bg-gray-700 border border-gray-500 flex justify-between items-center z-10 space-x-2 ml-1"
          @mouseleave="nukeHovered = false"
          @click="nukeNode"
        >
          <img class="w-4" src="/img/icon/edit-node-icons/nuke-node.png" alt="Export Icon" />
          <span class="text-xs text-gray-200 font-semibold">{{ $t("sidebarSect.nukNod") }}</span>
        </button>
      </Transition>
    </div>
  </aside>
</template>
<script setup>
import { ref } from "vue";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import { useSetups } from "../../../../store/setups";

const t = i18n.global.t;

const toNode = t("sidebarSect.toNode");
const setchNet = t("sidebarSect.setchNet");
const nukTheNud = t("sidebarSect.nukTheNud");

const routerHovered = ref(false);
const networkHovered = ref(false);
const nukeHovered = ref(false);
const footerStore = useFooter();
const setupStore = useSetups();

const emit = defineEmits(["nukeNode", "networkModal"]);

const nukeNode = () => {
  emit("nukeNode");
};

const networkModal = () => {
  emit("networkModal");
};

const hoverRouter = () => {
  if (routerHovered.value || networkHovered.value || nukeHovered.value) {
    routerHovered.value = false;
    networkHovered.value = false;
    nukeHovered.value = false;
  }
  routerHovered.value = true;
};

const hoverNetwork = () => {
  if (routerHovered.value || networkHovered.value || nukeHovered.value) {
    routerHovered.value = false;
    networkHovered.value = false;
    nukeHovered.value = false;
  }
  networkHovered.value = true;
};

const hoverNuke = () => {
  if (routerHovered.value || networkHovered.value || nukeHovered.value) {
    routerHovered.value = false;
    networkHovered.value = false;
    nukeHovered.value = false;
  }
  nukeHovered.value = true;
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.custom-gradient {
  background: linear-gradient(to bottom, #264744 0%, #33393e 20%);
}
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
