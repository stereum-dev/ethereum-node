<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <EditHeader @select-rename="selectRename" @confirm-rename="confirmRename" />
    <ConfigBody
      v-if="setupStore.isEditConfigViewActive"
      @on-drop="onDrop"
      @confirm-connection="confirmConnection"
      @switch-client="switchClient"
      @delete-service="deleteService"
      @confirm-consensus="confirmConsensus"
      @info-modal="infoModal"
      @modify-service="modifyService"
      @remove-lines="removeConnectionLines"
    />
    <SetupBody v-else @delete-setup="deleteSetup" @connect-setup="connectSetup" @setup-infos="setupInfos" @open-configs="openConfigs" />
  </div>
</template>

<script setup>
import ConfigBody from "./ConfigBody.vue";
import EditHeader from "./EditHeader.vue";
import SetupBody from "./SetupBody.vue";

import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { useSetups } from "@/store/setups";
import { computed, ref, watch } from "vue";
import { useMultiSetups } from "../../../../../composables/multiSetups";

const { getSelectedSetup } = useMultiSetups();

const emit = defineEmits([
  "onDrop",
  "confirmConnection",
  "switchClient",
  "deleteService",
  "confirmConsensus",
  "infoModal",
  "modifyService",

  "openConfigs",
  "deleteSetup",
]);

//Pinia stores
const manageStore = useNodeManage();
const setupStore = useSetups();

// refs

const isOverDropZone = ref(false);
// const isLineDrawHandlerReady = ref(false);

// computed & watchers properties
// eslint-disable-next-line no-unused-vars
const displayDropZone = computed(() => {
  let dropClass;
  if (isOverDropZone.value) {
    dropClass = "border-dashed border-4 border-gray-500 z-50";
  } else {
    dropClass = "border-0";
  }
  return dropClass;
});

watch(
  () => manageStore.isLineHidden,
  (newValue) => {
    if (newValue) {
      removeConnectionLines();
    }
  }
);

// methods

const removeConnectionLines = () => {
  // Remove all existing connections
  manageStore.lines.forEach((line) => {
    line.remove();
  });
  manageStore.lines = [];
};

const onDrop = (event) => {
  isOverDropZone.value = false;
  manageStore.isLineHidden = true;
  emit("onDrop", event);
};

const confirmConnection = (item) => {
  emit("confirmConnection", item);
};

const switchClient = (item) => {
  manageStore.isLineHidden = true;
  emit("switchClient", item);
};

const modifyService = (item) => {
  manageStore.isLineHidden = true;
  emit("modifyService", item);
};
const deleteService = (item) => {
  manageStore.isLineHidden = true;
  emit("deleteService", item);
};

const confirmConsensus = (item) => {
  emit("confirmConsensus", item);
};

const infoModal = (item) => {
  manageStore.isLineHidden = true;
  emit("infoModal", item);
};

const selectRename = async (setup) => {
  setupStore.setupToRename = setup.setupName;
  setupStore.isRenameSetupActive = true;
};

const confirmRename = async () => {
  const setup = {
    setupId: setupStore.selectedSetup.setupId,
    setupName: setupStore.setupToRename,
  };
  setupStore.selectedSetup.setupName = setupStore.setupToRename;
  setupStore.editSetups = setupStore.editSetups.map((s) => {
    if (s.setupId === setup.setupId) {
      s.setupName = setup.setupName;
    }
    return s;
  });
  await ControlService.renameSetup(setup);
  setupStore.isRenameSetupActive = false;
  setupStore.setupToRename = null;
};

const openConfigs = (setup) => {
  getSelectedSetup(setup, true);
};

const deleteSetup = (item) => {
  emit("deleteSetup", item);
};

const connectSetup = (item) => {
  console.log("connectSetup", item);
};

const setupInfos = (item) => {
  setupStore.selectedSetupInfos = item;
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
