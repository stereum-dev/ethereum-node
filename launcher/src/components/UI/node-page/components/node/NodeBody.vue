<template>
  <div class="w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-hidden bg-[#151618] flex justify-center items-center">
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
    <SetupBody v-if="!setupStore.isConfigViewActive" @open-setup="openSetup" @export-setup="exportSetup" />
    <PluginLogs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage" />
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

import LeaderLine from "leader-line-new";
import { useSetups } from "@/store/setups";

const emit = defineEmits(["openExpert", "openLog", "setupState", "exportSetup"]);

// Refs
const isPluginLogPageActive = ref(false);
const itemToLogs = ref({});
const loadingClients = ref(false);
const isLineDrawHandlerReady = ref(false);

// Store and router
const setupStore = useSetups();
const nodeStore = useNodeStore();
const serviceStore = useServices();

watchEffect(() => {
  if (nodeStore.skeletonLoading || serviceStore.installedServices.length === 0) {
    loadingClients.value = true;
  } else {
    loadingClients.value = false;
  }
});

watchEffect(() => {
  if (nodeStore.isLineHidden) {
    removeConnectionLines();
  }
});

//Lifecycle

// Methods

const oneWayConnection = (start, end, startSocket, endSocket) => {
  if (start && end) {
    let newLine = new LeaderLine(start, end, { dash: { animation: true } }, { hide: true });
    newLine.position();
    newLine.setOptions({
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
      startSocket: startSocket ? startSocket : "right",
      endSocket: endSocket ? endSocket : "left",
    });
    nodeStore.lines.push(newLine);
  }
};

const lineDrawHandler = (item) => {
  let start;
  let end;
  if (item && !item.displayPluginMenu) {
    switch (item.category) {
      case "execution": {
        const dependencies = serviceStore.installedServices.filter(
          (s) =>
            s.config?.dependencies?.executionClients?.length > 0 &&
            s.config?.dependencies?.executionClients.some((d) => d.id === item.config?.serviceID)
        );
        dependencies.forEach((d) => {
          if (d.category === "consensus") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(end, start);
            }
          }
        });
        break;
      }
      case "consensus": {
        const dependencies = serviceStore.installedServices.filter(
          (s) =>
            (s.config?.dependencies?.consensusClients?.length > 0 &&
              s.config?.dependencies?.consensusClients.some((d) => d.id === item.config?.serviceID)) ||
            item.config?.dependencies?.executionClients.some((d) => d.id === s.config?.serviceID)
        );
        dependencies.forEach((d) => {
          if (d.category === "validator") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(end, start);
            }
          }
          if (d.category === "execution") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(start, end);
            }
          }
        });
        break;
      }
      case "validator": {
        const dependencies = serviceStore.installedServices.filter(
          (s) =>
            item.config?.dependencies?.executionClients.some((d) => d.id === s.config?.serviceID) ||
            item.config?.dependencies?.consensusClients.some((d) => d.id === s.config?.serviceID) ||
            s.config?.dependencies?.consensusClients.some((d) => d.id === item.config?.serviceID)
        );
        dependencies.forEach((d) => {
          if (d.category === "validator") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              if (item.service === "CharonService") {
                oneWayConnection(end, start, "left", "left");
              } else {
                oneWayConnection(start, end, "left", "left");
              }
            }
          }
          if (d.category === "execution") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(start, end);
            }
          }
          if (d.category === "consensus") {
            start = d.ref;
            end = item.ref;
            if (start && end) {
              oneWayConnection(start, end);
            }
          }
        });
        break;
      }
    }
  } else if (item && item.displayPluginMenu) {
    removeConnectionLines();
  }
  isLineDrawHandlerReady.value = true;
};

const removeConnectionLines = () => {
  // Remove all existing connections
  nodeStore.lines.forEach((line) => {
    line.remove();
  });
  nodeStore.lines = [];
};

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
