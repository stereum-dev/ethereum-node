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
import LeaderLine from "leader-line-new";
import { useStateHandler, useRestartService } from "@/composables/services";

const emit = defineEmits(["openExpert"]);

// Refs
const lineOne = ref(null);

const isPluginLogPageActive = ref(false);
const itemToLogs = ref({});

// Store and router
const nodeStore = useNodeStore();

// Computed properties

//Hooks

// Methods

const lineDrawHandler = (item) => {
  let start;
  let end;
  if (lineOne.value) {
    lineOne.value?.hide();
  }
  if (item.category === "consensus") {
    const execution = item.config?.dependencies.executionClients[0];
    start = nodeStore.executionRefList.find((el) => el.refId === execution?.id)?.ref;
    end = nodeStore.consensusRefList.find((el) => el.refId === item.config?.serviceID)?.ref;
  } else if (item.category === "validator") {
    const consensus = item.config?.dependencies.consensusClients[0];
    start = nodeStore.consensusRefList.find((el) => el.refId === consensus.id)?.ref;
    end = nodeStore.validatorRefList.find((el) => el.refId === item.config?.serviceID)?.ref;
  } else {
    return;
  }

  if (start && end) {
    lineOne.value = new LeaderLine(start, end, { dash: { animation: true } }, { hide: true });
    lineOne.value.setOptions({
      startPlugSize: 1,
      endPlugSize: 2,
      size: 2,
      color: "#58BDA2",
      endPlug: "behind",
    });
  }

  setTimeout(() => {
    lineOne.value?.hide();
  }, 5000);
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
