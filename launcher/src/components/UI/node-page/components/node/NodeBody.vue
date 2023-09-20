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
        @open-expert="openExpertWindow"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="stateHandler"
        @restart-handler="restartService"
      />
      <ConsensusClients
        @open-expert="openExpertWindow"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="stateHandler"
        @restart-handler="restartService"
      />
      <ValidatorClients
        @open-expert="openExpertWindow"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="stateHandler"
        @restart-handler="restartService"
      />
    </div>
    <PluginLogs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage" />
    <PruingModal
      v-if="gethPrunningWarningModal"
      :item="item"
      @cancel-warning="hidePrunningWarningsModal"
      @confirm-btn="confirmRunningGethPrunning(item)"
    />
    <ResyncModal
      v-if="resyncWarningModal"
      :item="item"
      @cancel-warning="hideResyncWarningsModal"
      @confirm-btn="confirmRunningResync($event, item)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watchEffect } from "vue";
import { useNodeStore } from "@/store/theNode";
import { useServices } from "@/store/services";
import PluginLogs from "../../sections/PluginLogs.vue";
import ControlService from "@/store/ControlService";
import PruingModal from "./PrunningModal.vue";
import ResyncModal from "./ResyncModal.vue";
import LeaderLine from "leader-line-new";
import ExecutionClients from "./ExecutionClients";
import ConsensusClients from "./ConsensusClients";
import ValidatorClients from "./ValidatorClients";
import { useRouter } from "vue-router";

//Refs

const lineOne = ref(null);
const lineTwo = ref(null);
const isServiceOn = ref(false);
const gethPrunningWarningModal = ref(false);
const isPluginLogPageActive = ref(false);
const itemToLogs = ref({});
const itemToRestart = ref({});
const resyncWarningModal = ref(false);
const isClientLinkedToMev = ref(false);
const restartModalShow = ref(false);

const connected = reactive({
  val: null,
  con: null,
  exe: null,
});
const restartLoad = ref(false);

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
  console.log(connected.val);

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

// const restartService = (el) => {
//   itemToRestart.value = el;
//   restartModalShow.value = true;
//   titlePicker.value = restartTitle;
//   iconPicker.value = restartIcon;
//   functionCondition.value = true;
// };

// const restartConfirmed = async (service) => {
//   restartLoad.value = true;
//   service.yaml = await ControlService.getServiceYAML(service.config.serviceID);
//   if (!service.yaml.includes("isPruning: true")) {
//     isServiceOn.value = false;
//     service.serviceIsPending = true;
//     await ControlService.restartService(service.config.serviceID);
//     service.serviceIsPending = false;
//     updateStates();
//   }
// };

const updateStates = async () => {
  const serviceInfos = await ControlService.listServices();
  installedServices.value.forEach((s, idx) => {
    let updated = false;
    serviceInfos.forEach((i) => {
      if (i.Names.replace("stereum-", "") === s.config.serviceID) {
        installedServices.value[idx].state = i.State;
        updated = true;
        restartModalClose();
        restartLoad.value = false;
      }
    });
    if (!updated) {
      installedServices.value[idx].state = "exited";
    }
  });
};

const stateHandler = async (item) => {
  item.yaml = await ControlService.getServiceYAML(item.config.serviceID);
  if (!item.yaml.includes("isPruning: true")) {
    isServiceOn.value = false;
    item.serviceIsPending = true;
    let state = "stopped";
    if (item.state === "exited") {
      state = "started";
      isServiceOn.value = true;
    }
    try {
      await ControlService.manageServiceState({
        id: item.config.serviceID,
        state: state,
      });
    } catch (err) {
      console.log(state.replace("ed", "ing") + " service failed:\n", err);
    }
    item.serviceIsPending = false;
    updateStates();
  }
};

const restartModalClose = () => {
  restartModalShow.value = false;
};

// const runGethPrunningWarning = (option) => {
//   if (option.changeValue && option.displayWarningModal) {
//     gethPrunningWarningModal.value = true;
//   } else if (!option.changeValue || !option.displayWarningModal) {
//     gethPrunningWarningModal.value = false;
//   }
// };

// const runResyncWarning = (option) => {
//   if (option.changeValue && option.displayResyncModal) {
//     resyncWarningModal.value = true;
//   } else if (!option.changeValue || !option.displayWarningModal) {
//     resyncWarningModal.value = false;
//   }
// };

const hidePrunningWarningsModal = (el) => {
  gethPrunningWarningModal.value = false;
  el.expertOptions
    .filter((item) => item.title === "Prunning")
    .forEach((item) => {
      if (item.changeValue) {
        item.changeValue = false;
      }
    });
};

const confirmRunningGethPrunning = async (service) => {
  gethPrunningWarningModal.value = false;
  service.expertOptions
    .filter((item) => item.title === "Prunning")
    .forEach((item) => {
      if (item.changeValue) {
        item.changeValue = false;
      }
    });
  await ControlService.chooseServiceAction({
    action: "pruneGeth",
    service: service,
    data: {},
  });
};

const hideResyncWarningsModal = (el) => {
  resyncWarningModal.value = false;
  el.expertOptions
    .filter((item) => item.title === "Resync")
    .forEach((item) => {
      if (item.changeValue) {
        item.changeValue = false;
      }
    });
};

const confirmRunningResync = async (event, service) => {
  resyncWarningModal.value = false;
  service.expertOptions
    .filter((item) => item.title === "Resync")
    .forEach((item) => {
      if (item.changeValue) {
        item.changeValue = false;
      }
    });
  await ControlService.chooseServiceAction({
    action: "reSync",
    service: service,
    data: { checkpointURL: event },
  });
};

const openLogsPage = (item) => {
  itemToLogs.value = item;
  isPluginLogPageActive.value = true;
};

const closePluginLogsPage = () => {
  isPluginLogPageActive.value = false;
};

const openExpertWindow = (item) => {
  item.expertOptionsModal = true;
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

const getLogs = async (item) => {
  const logs = await ControlService.getLogs(item);
  logs.value = logs;
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
