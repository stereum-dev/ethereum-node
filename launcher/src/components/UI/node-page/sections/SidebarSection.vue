<template>
  <aside class="flex flex-col items-center w-18 h-full bg-[#33393E]" @pointerdown.prevent.stop @mousedown.prevent.stop>
    <div class="w-full grid grid-rows-3 mt-20 p-1 gap-y-5">
      <router-link
        v-if="!routerHovered"
        to="/edit"
        class="col-span-1 row-start-1 row-end-2 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a]"
        @mouseover="routerHovered = true"
      >
        <img class="w-8" src="/img/icon/node-icons/edit-node.png" alt="Manage Icon" />
      </router-link>
      <router-link v-else to="/edit" class="showManageBtn" @mouseleave="routerHovered = false">
        <img class="w-7 mr-1" src="/img/icon/node-icons/edit-node.png" alt="Manage Icon" />
        <span class="text-sm text-gray-200 font-semibold">To Edit Node</span>
      </router-link>
      <button v-if="isloading" class="row-start-2 row-end-3 p-1 rounded-md relative">
        <img v-if="loading" src="/img/icon/task-manager-icons/turning_circle_blue.gif" alt="loading" />
      </button>
      <button
        v-else-if="checkStatus && !powerHovered"
        class="row-start-2 row-end-3 p-1 rounded-md"
        @mouseenter="powerHovered = true"
        @click="showPowerModal"
      >
        <img class="w-6" src="/img/icon/node-icons/turn_on.png" alt="Stop Icon" />
      </button>

      <button
        v-else-if="checkStatus && powerHovered"
        class="showPowerBtn"
        @mouseleave="powerHovered = false"
        @click="showPowerModal"
      >
        <img class="w-7 mr-1" src="/img/icon/node-icons/turn_on.png" alt="Stop Icon" />
        <span class="text-sm text-gray-200 font-semibold">Turn Node On</span>
      </button>
      <button
        v-else-if="!checkStatus && !powerHovered"
        class="row-start-2 row-end-3 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a]"
        @mouseenter="powerHovered = true"
        @click="showPowerModal"
      >
        <img class="w-6" src="/img/icon/node-icons/power2.png" alt="Stop Icon" />
      </button>

      <button
        v-else-if="!checkStatus && powerHovered"
        class="showPowerBtn"
        @mouseleave="powerHovered = false"
        @click="showPowerModal"
      >
        <img class="w-6 mr-1" src="/img/icon/node-icons/power2.png" alt="Stop Icon" />
        <span class="text-sm text-gray-200 font-semibold">Turn Node Off</span>
      </button>

      <button
        v-if="!exportHovered"
        class="row-start-3 row-end-4 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 hover:bg-[#23272a]"
        @mouseenter="exportHovered = true"
        @click="exportData"
      >
        <img class="w-8" src="/img/icon/node-icons/export_config.png" alt="Export Icon" />
      </button>
      <button v-else class="showExportBtn" @mouseleave="exportHovered = false" @click="exportData">
        <img class="w-7 mr-1" src="/img/icon/node-icons/export_config.png" alt="Export Icon" />
        <span class="text-sm text-gray-200 font-semibold">Export Node Config</span>
      </button>
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
const JSZip = require("jszip");
const saveAs = require("file-saver");

let routerHovered = ref(false);
let powerHovered = ref(false);
let exportHovered = ref(false);
let loading = ref(false);
let isExporting = ref(false);

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
