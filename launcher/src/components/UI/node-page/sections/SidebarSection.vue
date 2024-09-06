<template>
  <aside class="flex flex-col items-center w-18 h-full custom-gradient" @pointerdown.prevent.stop @mousedown.prevent.stop>
    <div class="w-full max-h-[144px] grid grid-rows-3 mt-20 p-1 gap-y-5">
      <div
        class="col-span-1 row-start-1 row-end-2 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a] flex justify-center items-center cursor-pointer"
        @click="hoverRouter"
        @mouseenter="footerStore.cursorLocation = `${toEdit}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-7" src="/img/icon/node-page-icons/edit-node-icon.png" alt="Manage Icon" />
      </div>
      <Transition name="slide-fade">
        <router-link
          v-if="routerHovered"
          to="/edit"
          class="w-fit h-9 absolute col-span-1 row-start-1 row-end-2 py-1 px-2 rounded-md bg-gray-700 border border-gray-500 flex justify-between items-center z-10 space-x-2 ml-1 transition duration-200 shadow-md shadow-[#23272a]"
          @mouseleave="routerHovered = false"
        >
          <img class="w-6 mr-1" src="/img/icon/node-page-icons/edit-node-icon.png" alt="Manage Icon" />
          <span class="text-sm text-gray-200 font-semibold">{{ toEdit }}</span>
        </router-link>
      </Transition>

      <button v-if="isloading" class="row-start-2 row-end-3 p-1 rounded-md relative flex justify-center items-center">
        <img v-if="loading" src="/animation/loading/turning-circle-blue.gif" alt="loading" />
      </button>
      <button
        v-else-if="checkStatus"
        class="row-start-2 row-end-3 p-1 rounded-md transition-colors duration-200 hover:bg-[#23272a] flex justify-center items-center"
        @click="hoverPower"
        @mouseenter="footerStore.cursorLocation = `${trnOn}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-5" src="/img/icon/node-page-icons/turn-on.png" alt="Stop Icon" />
      </button>

      <button
        v-else-if="!checkStatus"
        class="row-start-2 row-end-3 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a] flex justify-center items-center"
        @click="hoverPower"
        @mouseenter="footerStore.cursorLocation = `${trnOff}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img class="w-5" src="/img/icon/node-page-icons/turn-off.png" alt="Stop Icon" />
      </button>
      <Transition name="slide-fade">
        <button
          v-if="checkStatus && powerHovered"
          class="w-fit h-9 absolute row-start-2 row-end-3 py-1 px-2 rounded-md duration-200 bg-gray-700 border border-gray-500 flex justify-between items-center z-10 space-x-2 ml-1 top-[33%]"
          @mouseleave="powerHovered = false"
          @click="showPowerModal"
        >
          <img class="w-4 mr-1" src="/img/icon/node-page-icons/turn-on.png" alt="Stop Icon" />
          <span class="text-sm text-gray-200 font-semibold">{{ trnOn }}</span>
        </button>

        <button
          v-else-if="!checkStatus && powerHovered"
          class="w-fit h-9 absolute row-start-2 row-end-3 py-1 px-2 rounded-md duration-200 bg-gray-700 border border-gray-500 flex justify-between items-center z-10 space-x-2 ml-1 top-[33%]"
          @mouseleave="powerHovered = false"
          @click="showPowerModal"
        >
          <img class="w-4 mr-1" src="/img/icon/node-page-icons/turn-off.png" alt="Stop Icon" />
          <span class="text-xs text-gray-200">{{ trnOff }}</span>
        </button>
      </Transition>
      <Transition name="slide-fade">
        <button
          v-if="!exportHovered"
          class="row-start-3 row-end-4 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a] flex justify-center items-center"
          @click="hoverExport"
          @mouseenter="footerStore.cursorLocation = `${expNode}`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <img class="w-5" src="/img/icon/node-page-icons/export-config-icon.png" alt="Export Icon" />
        </button>
        <button
          v-else
          class="w-fit h-9 absolute row-start-2 row-end-3 py-1 px-2 rounded-md duration-200 bg-gray-700 border border-gray-500 flex justify-between items-center z-10 space-x-2 ml-1 top-[42%]"
          @mouseleave="exportHovered = false"
          @click="exportData"
        >
          <img class="w-4" src="/img/icon/node-page-icons/export-config-icon.png" alt="Export Icon" />
          <span class="text-xs text-gray-200 font-semibold">{{ expNode }}</span>
        </button>
      </Transition>
    </div>
    <StateModal
      v-if="nodeStore.runNodePowerModal"
      :main-icon="checkStatus"
      @close-window="closeUpdatePowerStateModal"
      @turn-on="stateButtonHandler('started')"
      @turn-off="stateButtonHandler('stopped')"
    />
  </aside>
</template>

<script setup>
import StateModal from "../components/modals/StateModal";
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import { computed, ref } from "vue";
import { useFooter } from "@/store/theFooter";
const JSZip = require("jszip");
const saveAs = require("file-saver");

let routerHovered = ref(false);
let powerHovered = ref(false);
let exportHovered = ref(false);
let loading = ref(false);
let isExporting = ref(false);
const footerStore = useFooter();
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const toEdit = t("sidebarSect.toEdit");
const trnOn = t("sidebarSect.trnOn");
const trnOff = t("sidebarSect.trnOff");
const expNode = t("sidebarSect.expNode");

//stores
const serviceStore = useServices();
const nodeStore = useNodeStore();

const isloading = computed({
  // getter
  get: function () {
    return loading.value ? true : false;
  },
  // setter
  set: function (newValue) {
    loading.value = newValue;
  },
});

const checkStatus = computed(() => {
  let servicesToManage = serviceStore.installedServices.filter((service) => service.name !== "Notifications");
  return !servicesToManage.some((s) => s.state == "running");
});

const closeUpdatePowerStateModal = () => {
  nodeStore.hideConnectedLines = false;
  nodeStore.runNodePowerModal = false;
};

const showPowerModal = () => {
  nodeStore.hideConnectedLines = true;
  nodeStore.runNodePowerModal = true;
};

const stateButtonHandler = async (state) => {
  loading.value = true;
  closeUpdatePowerStateModal();
  try {
    //this is the temporary solution until notification service is exiting correctly
    let servicesToManage = serviceStore.installedServices.filter((service) => service.name !== "Notifications");

    let promises = servicesToManage.map(async (service, index) => {
      new Promise((resolve) => setTimeout(resolve, index * 1000)).then(() => {
        ControlService.manageServiceState({
          id: service.config.serviceID,
          state: state,
        });
      });
    });
    promises.push(
      new Promise((resolve) =>
        setTimeout(() => {
          loading.value = false;
          resolve();
        }, promises.length * (state == "running" ? 8000 : 4000))
      )
    );
    Promise.all(promises);
  } catch (err) {
    console.log(state.replace("ed", "ing") + " services failed:\n", err);
  }
};

const exportData = async () => {
  if (!isExporting.value) {
    try {
      isExporting.value = true;
      const stereumConfig = await ControlService.exportConfig();
      if (stereumConfig.length > 0) {
        const zip = new JSZip();

        stereumConfig.forEach((item) => {
          zip.file(item.filename, item.content);
        });

        zip.generateAsync({ type: "blob" }).then(function (blob) {
          saveAs(blob, "stereum_config.zip");
        });
      }
    } catch (err) {
      console.log("Failed exporting config: ", err);
    } finally {
      isExporting.value = false;
    }
  }
};

const hoverRouter = () => {
  if (routerHovered.value || exportHovered.value || powerHovered.value) {
    routerHovered.value = false;
    exportHovered.value = false;
    powerHovered.value = false;
  }
  routerHovered.value = true;
};

const hoverPower = () => {
  if (routerHovered.value || exportHovered.value || powerHovered.value) {
    routerHovered.value = false;
    exportHovered.value = false;
    powerHovered.value = false;
  }
  powerHovered.value = true;
};

const hoverExport = () => {
  if (routerHovered.value || exportHovered.value || powerHovered.value) {
    routerHovered.value = false;
    exportHovered.value = false;
    powerHovered.value = false;
  }
  exportHovered.value = true;
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
.showPowerBtn {
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
.showPowerBtn:active,
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
