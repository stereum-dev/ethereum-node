<template>
  <div
    class="w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-hidden bg-[#151618] flex justify-center items-center"
  >
    <ConfigBody
      v-if="setupStore.isConfigViewActive"
      @open-expert="openExpert"
      @open-docs="openDocs"
      @open-log="openLog"
      @copy-jwt="copyJwt"
      @click-outside="clickOutside"
      @line-draw="lineDrawHandler"
      @remove-lines="removeConnectionLines"
    />
    <SetupBody
      v-if="!setupStore.isConfigViewActive"
      @open-setup="openSetup"
      @export-setup="exportSetup"
    />
    <PluginLogs
      v-if="isPluginLogPageActive"
      :item="itemToLogs"
      @close-log="closePluginLogsPage"
    />
    <ConnectionLine
      v-for="connection in activeConnections"
      :key="connection.id"
      :start="{
        element: connection.start.element,
        position: connection.start.position,
      }"
      :end="{
        element: connection.end.element,
        position: connection.end.position,
      }"
      color="#F6F68B85"
      :animated="true"
      :dashed="true"
    />
  </div>
</template>

<script setup>
import ConfigBody from "./ConfigBody.vue";
import SetupBody from "./SetupBody.vue";
import PluginLogs from "../../sections/PluginLogs.vue";
import { ref, watchEffect } from "vue";

import { useNodeStore } from "@/store/theNode";
import { useServices } from "@/store/services";
import ControlService from "@/store/ControlService";

import { useSetups } from "@/store/setups";
import ConnectionLine from "../../../../layers/ConnectionLine.vue";
import { useConnectionLines } from "@/composables/useConnectionLines";

const emit = defineEmits(["openExpert", "openLog", "setupState", "exportSetup"]);

// Refs
const isPluginLogPageActive = ref(false);
const itemToLogs = ref({});
const loadingClients = ref(false);

// Store and router
const setupStore = useSetups();
const nodeStore = useNodeStore();
const serviceStore = useServices();
const {
  activeConnections,
  lineDrawHandler,
  removeConnectionLines,
} = useConnectionLines();

watchEffect(() => {
  if (nodeStore.skeletonLoading || serviceStore.installedServices.length === 0) {
    loadingClients.value = true;
  } else {
    loadingClients.value = false;
  }
});

//Lifecycle

// Methods

const openLog = (item) => {
  emit("openLog", item);
};

const closePluginLogsPage = () => {
  nodeStore.isLineHidden = false;
  isPluginLogPageActive.value = false;
};

const clickOutside = (item) => {
  nodeStore.isLineHidden = false;
  item.expertOptionsModal = false;
};

const openDocs = (item) => {
  window.open(item.docsUrl, "_blank");
};

const openExpert = (item) => {
  emit("openExpert", item);
};

const openSetup = (setup) => {
  setup.isActive = true;
  setupStore.selectedSetup = setup;
  // setupStore.selectedSetup.isActive = true;
  setupStore.isConfigViewActive = true;
};

const exportSetup = (setup) => {
  emit("exportSetup", setup);
};

const copyJwt = async (item) => {
  let volume = "";
  item.config?.volumes.forEach((vol) => {
    if (vol.destinationPath.endsWith("/engine.jwt")) {
      volume = vol.destinationPath;
    }
  });
  const result = await ControlService.copyExecutionJWT(volume);
  navigator.clipboard.writeText(result);
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
