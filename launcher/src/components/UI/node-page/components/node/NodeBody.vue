<!-- eslint-disable vue/return-in-computed-property -->
import { mapState, map } from 'pinia';
<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div
      class="absolute top-0 w-full mx-auto grid grid-cols-3 h-6 bg-[#4f585f] border border-gray-950 rounded-t-[5px] text-gray-200 text-[10px] font-semibold"
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
      />
      <ConsensusClients
        @open-expert="openExpert"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
      />
      <ValidatorClients
        @open-expert="openExpert"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
      />
    </div>
    <PluginLogs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watchEffect } from "vue";
import { useNodeStore } from "@/store/theNode";
import { useServices } from "@/store/services";
import PluginLogs from "../../sections/PluginLogs.vue";
import LeaderLine from "leader-line-new";
import ExecutionClients from "./ExecutionClients";
import ConsensusClients from "./ConsensusClients";
import ValidatorClients from "./ValidatorClients";
import { useRouter } from "vue-router";
import { useStateHandler, useRestartService } from "@/composables/services";

const emit = defineEmits(["openExpert"]);
//Refs

const lineOne = ref(null);
const lineTwo = ref(null);
const isPluginLogPageActive = ref(false);
const itemToLogs = ref({});
const isClientLinkedToMev = ref(false);

const connected = reactive({
  val: null,
  con: null,
  exe: null,
});

let {
  selectedExecutionRef,
  selectedConsensusRef,
  selectedValidatorRef,
  validatorRef,
  consensusRef,
  executionRef,
  hideConnectedLines,
} = useNodeStore();

const serviceStore = useServices();
const router = useRouter();

// Computed & Watchers properties

const installedServices = computed(() => serviceStore.installedServices);

watchEffect(installedServices, (newServices) => {
  const connectedVal = newServices
    .filter((item) => item.category === "validator")
    .find((item) => item.config.dependencies.consensusClients[0]);

  if (connectedVal) {
    connected.con = connectedVal.config.dependencies.consensusClients[0];
    connected.exe = connected.con.dependencies.executionClients[0];
  }
  if (connected.con.dependencies.mevboost) {
    isClientLinkedToMev.value = true;
  }
});

onMounted(() => {
  if (!hideConnectedLines || router.path == "/node") {
    getRefOfConnectedClients();
    drawLinesHandler();
    drawConnectingline(selectedValidatorRef, selectedConsensusRef, selectedExecutionRef);
  } else if (hideConnectedLines || router.path !== "/node") {
    hideConnectedLinesHandler();
  }
});

// Methods
const drawLinesHandler = () => {
  if (lineOne.value != null || lineTwo.value != null) {
    lineOne.value.show();
    lineTwo.value.show();
  }
};

const hideConnectedLinesHandler = () => {
  if (lineOne.value != null || lineTwo.value != null) {
    lineOne.value.hide();
    lineTwo.value.hide();
  }
};

const getRefOfConnectedClients = () => {
  const connectedVal = connectedVal;
  const connectedCons = connected.con;
  const connectedExec = connected.exe;

  if (connectedVal) {
    console.log(connectedVal.config.serviceID);
    const refService = validatorRef.find((item) => item.refId === connectedVal.config.serviceID);
    refService && selectedValidatorRef == refService.ref;
  }

  if (connectedCons) {
    const refService = consensusRef.find((item) => item.refId === connectedCons.id);
    refService && selectedConsensusRef == refService.ref;
  }

  if (connectedExec) {
    const refService = executionRef.value.find((item) => item.refId === connectedExec.id);
    refService && selectedExecutionRef == refService.ref;
  }
};

const openLogsPage = (item) => {
  console.log("hello");
  itemToLogs.value = item;
  isPluginLogPageActive.value = true;
};

const closePluginLogsPage = () => {
  isPluginLogPageActive.value = false;
};

const clickOutside = (item) => {
  hideConnectedLines = false;
  item.expertOptionsModal = false;
};

const drawConnectingline = (start, middle, end) => {
  if (!start || !end || !middle) {
    hideConnectedLines = true;
    return;
  }

  if (lineOne.value || lineTwo.value) {
    lineOne.value && lineOne.value.remove();
    lineTwo.value && lineTwo.value.remove();
  }

  if (!hideConnectedLines) {
    // Only create lines if hideConnectedLines is not true
    if (router.path === "/node") {
      lineOne.value = new LeaderLine(start, middle, { dash: { animation: true } }, { hide: true });
      lineOne.value.setOptions({
        path: "fluid",
        startPlugSize: 1,
        endPlugSize: 2,
        size: 2,
        color: "#58BDA2",
        endPlug: "behind",
      });
      lineTwo.value = new LeaderLine(middle, end, { dash: { animation: true } }, { hide: true });
      lineTwo.value.setOptions({
        path: "fluid",
        startPlugSize: 1,
        endPlugSize: 2,
        size: 2,
        color: "#58BDA2",
        endPlug: "behind",
      });
      LeaderLine.mouseHoverAnchor({ start, middle, end, style: { color: "#E9CE1F" } });
    }
  }
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
