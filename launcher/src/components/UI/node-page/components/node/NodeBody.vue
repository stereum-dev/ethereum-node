<!-- eslint-disable vue/return-in-computed-property -->
import { mapState, map } from 'pinia';
<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div
      class="absolute top-0 w-full mx-auto grid grid-cols-3 h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] text-gray-200 text-[10px] font-semibold"
    >
      <span class="col-start-1 justify-self-center self-center">{{ $t("editModals.executionClients") }}</span>
      <span class="col-start-2 justify-self-center self-center">{{ $t("editModals.consensusClients") }}</span>
      <span class="col-start-3 justify-self-center self-center">{{ $t("editBody.validator") }} </span>
    </div>
    <div class="w-full h-full grid grid-cols-3 pt-8">
      <ExecutionClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
        @mouse-leave="removeConnectionLines"
      />
      <ConsensusClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
        @mouse-leave="removeConnectionLines"
      />
      <ValidatorClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
        @mouse-leave="removeConnectionLines"
      />
    </div>
    <PluginLogs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage" />
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import ExecutionClients from "./ExecutionClients.vue";
import ConsensusClients from "./ConsensusClients.vue";
import ValidatorClients from "./ValidatorClients.vue";
import PluginLogs from "../../sections/PluginLogs.vue";
import { useNodeStore } from "@/store/theNode";
import { useServices } from "@/store/services";

import LeaderLine from "leader-line-new";
import { useStateHandler, useRestartService } from "@/composables/services";

const emit = defineEmits(["openExpert", "openLog"]);

// Refs
const isPluginLogPageActive = ref(false);
const itemToLogs = ref({});
const isLineDrawHandlerReady = ref(false);

// Store and router
const nodeStore = useNodeStore();
const serviceStore = useServices();

watchEffect(() => {
  if (nodeStore.isLineHidden) {
    removeConnectionLines();
  }
});

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
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
