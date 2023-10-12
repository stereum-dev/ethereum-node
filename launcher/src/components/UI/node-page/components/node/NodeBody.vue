<!-- eslint-disable vue/return-in-computed-property -->
import { mapState, map } from 'pinia';
<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div
      class="absolute top-0 w-full mx-auto grid grid-cols-3 h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] text-gray-200 text-[10px] font-semibold"
    >
      <span class="col-start-1 justify-self-center self-center">Execution Clients</span>
      <span class="col-start-2 justify-self-center self-center">Consensus Clients</span>
      <span class="col-start-3 justify-self-center self-center">Validator </span>
    </div>
    <div class="w-full h-full grid grid-cols-3 pt-8">
      <ExecutionClients
        @open-expert="openExpert"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
      />
      <ConsensusClients
        @open-expert="openExpert"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
      />
      <ValidatorClients
        @open-expert="openExpert"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
      />
    </div>
    <PluginLogs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage" />
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import ExecutionClients from "./ExecutionClients.vue";
import ConsensusClients from "./ConsensusClients.vue";
import ValidatorClients from "./ValidatorClients.vue";
import PluginLogs from "../../sections/PluginLogs.vue";
import { useNodeStore } from "@/store/theNode";
import { useServices } from "@/store/services";
import LeaderLine from "leader-line-new";
import { useStateHandler, useRestartService } from "@/composables/services";

const emit = defineEmits(["openExpert"]);

// Refs
const isPluginLogPageActive = ref(false);
const itemToLogs = ref({});

// Store and router
const nodeStore = useNodeStore();
const serviceStore = useServices();

// Computed properties

//Hooks

// Methods

const oneWayConnection = (start, end) => {
  let lineOne = null;
  if (start && end) {
    lineOne = new LeaderLine(start, end, { dash: { animation: true } }, { hide: true });
    lineOne.setOptions({
      startPlugSize: 1,
      endPlugSize: 2,
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
    });

    setTimeout(() => {
      lineOne.remove();
    }, 2000);
  }
};

const twoWaysConnections = (start, middle, end) => {
  let lineOne = null;
  let lineTwo = null;
  if (start && middle && end) {
    lineOne = new LeaderLine(start, middle, { dash: { animation: true } }, { hide: true });
    lineOne.setOptions({
      startPlugSize: 1,
      endPlugSize: 2,
      size: 2,
      color: "#6FD9F0",
      endPlug: "behind",
    });
    lineTwo = new LeaderLine(middle, end, { dash: { animation: true } }, { hide: true });
    lineTwo.setOptions({
      startPlugSize: 1,
      endPlugSize: 2,
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
    });

    setTimeout(() => {
      lineOne.remove();
      lineTwo.remove();
    }, 2000);
  }
};

const lineDrawHandler = (item) => {
  let start;
  let middle;
  let end;
  let lineOne;
  let lineTwo;
  // Remove the previous line if it exists
  if (lineOne || lineTwo) {
    lineOne.remove();
    lineTwo.remove();
  }

  if (item) {
    if (item.category === "consensus") {
      const execution = item.config?.dependencies.executionClients[0];
      start = nodeStore.executionRefList.find((el) => el.refId === execution?.id)?.ref;
      middle = nodeStore.consensusRefList.find((el) => el.refId === item.config?.serviceID)?.ref;

      const validator = serviceStore.installedServices.find(
        (el) => el.category === "validator" && el.config?.dependencies.consensusClients[0].id === item.config?.serviceID
      );

      end = nodeStore.validatorRefList.find((el) => el.refId === validator?.config?.serviceID)?.ref;

      if (start && middle && end) {
        twoWaysConnections(start, middle, end);
      } else if (start && middle) {
        oneWayConnection(start, middle);
      }
    } else if (item.category === "validator") {
      const consensus = item.config?.dependencies.consensusClients[0];
      start = nodeStore.consensusRefList.find((el) => el.refId === consensus.id)?.ref;
      end = nodeStore.validatorRefList.find((el) => el.refId === item.config?.serviceID)?.ref;
      oneWayConnection(start, end);
    } else if (item.category === "execution") {
      const consensus = serviceStore.installedServices.find(
        (el) => el.category === "consensus" && el.config?.dependencies.executionClients[0].id === item.config?.serviceID
      );

      start = nodeStore.executionRefList.find((el) => el.refId === item.config?.serviceID)?.ref;
      end = nodeStore.consensusRefList.find((el) => el.refId === consensus?.config?.serviceID)?.ref;

      oneWayConnection(start, end);
    }
  }
};

const openLogsPage = (item) => {
  itemToLogs.value = item;
  isPluginLogPageActive.value = true;
};

const closePluginLogsPage = () => {
  isPluginLogPageActive.value = false;
};

const clickOutside = (item) => {
  nodeStore.hideConnectedLines = false;
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
