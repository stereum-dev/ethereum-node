<template>
  <base-layout>
    <!-- Start Node main layouts -->
    <div class="w-full h-full grid grid-cols-24">
      <div class="col-start-1 col-span-1 flex justify-center items-center">
        <SidebarSection />
      </div>
      <div class="col-start-2 col-end-17 w-full h-full">
        <NodeSection @open-expert="openExpertModal" @open-log="openLogPage" @export-setup="exportSetup" />
      </div>
      <div class="col-start-17 col-end-21 ml-1 grid grid-cols-2 grid-rows-9">
        <NetworkStatus />
        <ServiceSection @open-expert="openExpertModal" @open-logs="openLogPage" />
      </div>
      <div class="col-start-21 col-end-25 px-1 flex flex-col justify-between">
        <div class="h-[60px] self-center w-full flex flex-col justify-center items-center">
          <button
            class="info-toggle-btn w-full h-[34px] rounded-full bg-[#264744] hover:bg-[#325e5a] px-2 py-1 text-gray-200 active:scale-95 shadow-md shadow-zinc-800 active:shadow-none transition-all duration-200 ease-in-out uppercase flex justify-center items-center"
            @click="alarmToggle"
            @mouseenter="
              footerStore.cursorLocation = nodeStore.infoAlarm
                ? `${$t('nodeSidebarVideo.stereumTutorial')}`
                : `${$t('nodeSidebarVideo.statBox')}`
            "
            @mouseleave="footerStore.cursorLocation = ''"
          >
            <img class="w-8" src="/img/icon/node-page-icons/access-tutorial-icon.png" alt="information" />
          </button>
        </div>
        <AlertSection :info-aralm="nodeStore.infoAlarm" />
      </div>
      <LogsSection
        v-if="isLogsPageActive"
        :client="nodeStore.clientToLogs"
        @close-log="closeLogPage"
        @export-log="exportLogs"
        @export-all-log="updateAndExportAllLogs"
        @export-customized-logs="updateAndExportAllLogs"
      />
      <ExpertWindow v-if="isExpertModeOpen" :item="expertModeClient" @hide-modal="closeExpertMode" />
    </div>

    <!-- End Node main layout -->
  </base-layout>
</template>
<script setup>
import ControlService from "@/store/ControlService";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import { useNodeStore } from "@/store/theNode";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useRefreshNodeStats } from "../../../composables/monitoring";
import { useMultiSetups } from "../../../composables/multiSetups";
import { useListKeys } from "../../../composables/validators";
import NetworkStatus from "../../layers/NetworkStatus.vue";
import AlertSection from "./sections/AlertSection.vue";
import ExpertWindow from "./sections/ExpertWindow.vue";
import LogsSection from "./sections/LogsSection.vue";
import NodeSection from "./sections/NodeSection.vue";
import ServiceSection from "./sections/ServiceSection.vue";
import SidebarSection from "./sections/SidebarSection";

//*****************  Store & Refs *****************
const nodeStore = useNodeStore();
const headerStore = useNodeHeader();
const serviceStore = useServices();
const controlStore = useControlStore();
const router = useRouter();
const footerStore = useFooter();
const setupStore = useSetups();
const { updateDom } = useMultiSetups();

const expertModeClient = ref(null);
const isExpertModeOpen = ref(false);
const isLogsPageActive = ref(false);

let polling = null;
let pollingVitals = null;
let pollingNodeStats = null;
let pollingListingKeys = null;
let pollingPings = null;

//*****************  Watchers *****************

//Computed & Watchers
// TODO: maybe add watchSSV from service.js here?

watchEffect(() => {
  if (router.currentRoute.value.path !== "/node") {
    nodeStore.isLineHidden = true;
  } else {
    nodeStore.isLineHidden = false;
  }
});

watchEffect(() => {
  if (headerStore.openModalFromNodeAlert) {
    nodeStore.isLineHidden = true;
    expertModeClient.value = headerStore.selectedValidatorFromNodeAlert;
    expertModeClient.value.expertOptionsModal = true;
    isExpertModeOpen.value = true;
  }
});

//*****************  Lifecycle Hooks *****************

onMounted(async () => {
  await updateDom();
  nodeSetupsPrepration();

  updateConnectionStats();

  updateServiceLogs();

  polling = setInterval(updateServiceLogs, 10000); // refresh logs
  pollingVitals = setInterval(updateServerVitals, 1000); // refresh server vitals
  pollingNodeStats = setInterval(updateNodeStats, 1000); // refresh server vitals
  pollingListingKeys = setInterval(checkForListingKeys, 1000); // check for validators which need validator listing
});

onUnmounted(() => {
  clearInterval(polling);
  clearInterval(pollingVitals);
  clearInterval(pollingNodeStats);
  clearInterval(pollingListingKeys);
  clearInterval(pollingPings);
  setupStore.isConfigViewActive = false;
  setupStore.selectedSetup = null;
});

//*************  Methods *************

//get all configs and services
const nodeSetupsPrepration = () => {
  setupStore.allSetups.forEach((s) => (s.isActive = false));
  setupStore.selectedSetup = null;
};

const exportSetup = async (setup) => {
  const setupId = setup.setupId;
  const setupName = setup.setupName;
  if (setupId) {
    try {
      const setupConfig = await ControlService.exportSingleSetup(setupId);
      if (setupConfig.length > 0) {
        const zip = new JSZip();

        setupConfig.forEach((item) => {
          zip.file(item.filename, item.content);
        });

        zip.generateAsync({ type: "blob" }).then(function (blob) {
          saveAs(blob, `${setupName}.zip`);
        });
      }
    } catch (err) {
      console.log("Failed exporting setup: ", err);
    }
  }
};

const alarmToggle = () => {
  nodeStore.infoAlarm = !nodeStore.infoAlarm;
  footerStore.cursorLocation = "";
};

const checkForListingKeys = async () => {
  //is true when there is at least one validator service running without keys
  if (
    serviceStore.installedServices &&
    serviceStore.installedServices.length > 0 &&
    serviceStore.installedServices.some(
      (s) => s.category === "validator" && s.state === "running" && (!s.config.keys || !s.config.keys.length > 0)
    )
  ) {
    clearInterval(pollingListingKeys);
    useListKeys();
  }
};

const updateConnectionStats = async () => {
  const stats = await ControlService.getConnectionStats();
  controlStore.ServerName = stats.ServerName;
  controlStore.ipAddress = stats.ipAddress;
};
const updateServiceLogs = async () => {
  if (serviceStore.installedServices && serviceStore.installedServices.length > 0 && headerStore.refresh) {
    const data = await ControlService.getServiceLogs({ logs_tail: 150 });
    nodeStore.serviceLogs = data;
  }
};

const updateAndExportAllLogs = async (client) => {
  nodeStore.allLogsForExp = await ControlService.getAllServiceLogs({
    serviceID: client.config?.serviceID,
    lines: !nodeStore.logTail ? 100000 : nodeStore.logTail,
    dateOrLines: nodeStore.exportLogsType,
    since: nodeStore.exportLogsType === "lines" ? 0 : nodeStore.sinceDateParsDays,
    until: nodeStore.untilDateParsDays,
  });

  const fileName = `${client.name}_${nodeStore.isExportCustomizedDateLoading ? "customized" : "all"}_logs.txt`;
  const data = [...nodeStore.allLogsForExp.logs].reverse();
  const lineByLine = data.map((line, index) => `#${data.length - index}: ${line}`).join("\n\n");
  const blob = new Blob([lineByLine], { type: "text/plain;charset=utf-8" });
  saveAs(blob, fileName);

  nodeStore.isLogLoading = false;
  nodeStore.isExportCustomizedDateLoading = false;
  nodeStore.logTail = null;
  nodeStore.exportLogsType = "";
};

const updateServerVitals = async () => {
  try {
    if (serviceStore.installedServices && serviceStore.installedServices.length > 0 && headerStore.refresh) {
      const data = await ControlService.getServerVitals();
      controlStore.cpu = data.cpu;
      controlStore.availDisk = data.availDisk;
      controlStore.usedPerc = data.usedPerc;
    }
  } catch (e) {
    console.log("couldn't check server vitals");
  }
};

const openExpertModal = (item) => {
  nodeStore.isLineHidden = true;
  expertModeClient.value = item;
  expertModeClient.value.expertOptionsModal = true;
  isExpertModeOpen.value = true;
};

const updateNodeStats = async () => {
  await useRefreshNodeStats();
  nodeStore.isLineHidden = false;
};

const closeExpertMode = () => {
  isExpertModeOpen.value = false;
  nodeStore.isLineHidden = false;
  headerStore.openModalFromNodeAlert = false;
  headerStore.selectedValidatorFromNodeAlert = null;
};
// ********** LOGS **********

const exportLogs = async (client) => {
  const currentService = nodeStore.serviceLogs.find((service) => service.config?.serviceID === client.config?.serviceID);

  const fileName = nodeStore.exportLogs ? `${client.name}_150_logs.txt` : `${client.name}_all_logs.txt`;

  // Select the data based on the condition
  const data = nodeStore.exportLogs ? currentService.logs.slice(-150).reverse() : currentService.logs.reverse();

  const lineByLine = data.map((line, index) => `#${data.length - index}: ${line}`).join("\n\n");
  const blob = new Blob([lineByLine], { type: "text/plain;charset=utf-8" });
  saveAs(blob, fileName);
};

const openLogPage = (item) => {
  nodeStore.clientToLogs = item;
  isLogsPageActive.value = true;
};

const closeLogPage = () => {
  nodeStore.clientToLogs = null;
  isLogsPageActive.value = false;
};
</script>

<style scoped>
.info-button {
  width: 98%;
  height: 7%;
  background: #264744;
  border-radius: 20px;
  box-shadow: 0 1px 3px 0px #1c1f22;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 3px;
  margin-bottom: 15px;
}
.info-button:hover {
  background: rgb(43, 84, 81);
}
.info-button:active {
  background: rgba(43, 84, 81, 0.5);
}
.info-button img {
  max-width: 19%;
}
</style>
