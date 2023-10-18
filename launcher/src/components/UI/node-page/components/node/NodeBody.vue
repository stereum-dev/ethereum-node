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
        @mouse-leave="removeConnectionLines"
      />
      <ConsensusClients
        @open-expert="openExpert"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
        @mouse-leave="removeConnectionLines"
      />
      <ValidatorClients
        @open-expert="openExpert"
        @open-log="openLogsPage"
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
import { ref, defineEmits, onUnmounted } from "vue";
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
let lineOne = ref(null);
let lineTwo = ref(null);
let lineThree = ref(null);

// Store and router
const nodeStore = useNodeStore();
const serviceStore = useServices();

// Computed properties

//Hooks

onUnmounted(() => {
  if (lineOne.value) {
    lineOne.value.remove();
    lineOne.value = null;
  }
  if (lineTwo.value) {
    lineTwo.value.remove();
    lineTwo.value = null;
  }
  if (lineThree.value) {
    lineThree.value.remove();
    lineThree.value = null;
  }
});

// Methods

const oneWayConnection = (start, end) => {
  if (start && end) {
    lineOne.value = new LeaderLine(start, end, { dash: { animation: true } }, { hide: true });
    lineOne.value.position();
    lineOne.value.setOptions({
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
      startSocket: "right",
      endSocket: "left",
    });
  }
};

const twoWaysConnections = (start, middle, end) => {
  if (start && middle && end) {
    lineTwo.value = new LeaderLine(start, middle, { dash: { animation: true } }, { hide: true });
    lineTwo.value.setOptions({
      path: "fluid",
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
    });
    lineThree.value = new LeaderLine(middle, end, { dash: { animation: true } }, { hide: true });
    lineThree.value.setOptions({
      path: "fluid",
      size: 2,
      color: "#DBEF6A",
      endPlug: "behind",
    });
  }
};

const lineDrawHandler = (item) => {
  let start;
  let middle;
  let end;

  if (item && !item.displayPluginMenu) {
    if (item.category === "consensus") {
      if (item.config?.dependencies.executionClients[0]) {
        const execution = item.config?.dependencies.executionClients[0];
        const getExecutionRef = nodeStore.executionRefList.find((el) => el.refId === execution?.id);
        start = getExecutionRef?.ref ? getExecutionRef?.ref : null;
        middle = nodeStore.consensusRefList.find((el) => el.refId === item.config?.serviceID)?.ref;
        const validator = serviceStore.installedServices.find(
          (el) =>
            el.category === "validator" && el.config?.dependencies.consensusClients[0]?.id === item.config?.serviceID
        );
        const getValidatorRef = nodeStore.validatorRefList.find((el) => el.refId === validator?.config?.serviceID);

        end = getValidatorRef ? getValidatorRef?.ref : null;
        if (start && middle && end) {
          twoWaysConnections(start, middle, end);
        } else if (!start || !middle || !end) {
          const newStart = !start ? middle : start;
          const newEnd = !end ? middle : end;
          oneWayConnection(newStart, newEnd);
        }
      } else {
        return;
      }
    } else if (item.category === "validator" && item.config?.dependencies.consensusClients[0]) {
      const consensus = item.config?.dependencies.consensusClients[0];
      start = nodeStore.consensusRefList.find((el) => el.refId === consensus?.id)?.ref;
      end = nodeStore.validatorRefList.find((el) => el.refId === item.config?.serviceID)?.ref;
      if (start && end) {
        oneWayConnection(start, end);
      }
    } else if (item.category === "execution") {
      const consensus = serviceStore.installedServices.find(
        (el) =>
          el.category === "consensus" && el.config?.dependencies.executionClients[0]?.id === item.config?.serviceID
      );

      start = nodeStore.executionRefList.find((el) => el.refId === item.config?.serviceID)?.ref;
      if (consensus) {
        end = nodeStore.consensusRefList.find((el) => el.refId === consensus?.config?.serviceID)?.ref;
      }

      if (start && end) {
        oneWayConnection(start, end);
      }
    }
  } else if (item && item.displayPluginMenu) {
    removeConnectionLines();
  }
};

const removeConnectionLines = () => {
  // Remove all existing connections
  if (lineOne.value) {
    lineOne.value.remove();
    lineOne.value = null;
  }

  if (lineTwo.value) {
    lineTwo.value.remove();
    lineTwo.value = null;
  }

  if (lineThree.value) {
    lineThree.value.remove();
    lineThree.value = null;
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
