<template>
  <base-layout>
    <!-- Start Control main layouts -->
    <div class="ctrGridParent gap-1 relative">
      <div class="plugins-container">
        <control-plugins>
          <div class="plugins-title">
            <SetupDetails :list="setupsList" @select-setup="selectSetup" />
          </div>
          <div class="plugins-table-bg rounded-md">
            <div class="arrow-up" @click="scrollUp">
              <img src="/img/icon/control-page-icons/arrow-up-1.png" alt="" />
            </div>
            <div ref="pluginsTable" class="plugins-table">
              <div
                v-for="(item, index) in selecteConfigServices"
                :key="index"
                class="plugins-row"
                @mouseenter="footerStore.cursorLocation = `${item.name + ' / ' + item.category}`"
                @mouseleave="footerStore.cursorLocation = ''"
              >
                <div
                  class="plugins-pending-state"
                  :class="{
                    'plugins-running-state': item.state == 'running',
                    'plugins-exited-state': item.state == 'exited',
                    'plugins-restarting-state': item.state == 'restarting',
                  }"
                ></div>
                <div class="plugins-row-content">
                  <div class="row-plugin-name">
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="row-category">
                    <span>{{ item.category }}</span>
                  </div>
                </div>
                <div class="service-edit">
                  <div class="edit-box">
                    <div v-if="item.service !== 'ExternalExecutionService' && item.service !== 'ExternalConsensusService'" class="icon-bg">
                      <div class="power-icon">
                        <img
                          v-if="item.isServicePending"
                          class="pending"
                          src="/animation/loading/turning-circle.gif"
                          alt="icon"
                          @mouseenter="
                            footerStore.cursorLocation = `${t('controlScreenTooltips.isPending', {
                              service: item.name,
                            })}`
                          "
                          @mouseleave="footerStore.cursorLocation = ''"
                        />
                        <img
                          v-else-if="item.state == 'running'"
                          src="/img/icon/node-page-icons/service-command-turn-off.png"
                          alt="icon"
                          @click.stop="stateHandler(item)"
                          @mouseenter="
                            footerStore.cursorLocation = `${t('controlScreenTooltips.turnoff', {
                              service: item.name,
                            })}`
                          "
                          @mouseleave="footerStore.cursorLocation = ''"
                        />
                        <img
                          v-else-if="item.state == 'restarting'"
                          src="/img/icon//node-page-icons/service-command-restart.png"
                          alt="icon"
                          @click.stop="stateHandler(item)"
                          @mouseenter="
                            footerStore.cursorLocation = `${t('controlScreenTooltips.restart', {
                              service: item.name,
                            })}`
                          "
                          @mouseleave="footerStore.cursorLocation = ''"
                        />
                        <img
                          v-else
                          src="/img/icon/node-page-icons/service-command-turn-on.png"
                          alt="icon"
                          @click.stop="stateHandler(item)"
                          @mouseenter="footerStore.cursorLocation = `${t('controlScreenTooltips.turnon', { service: item.name })}`"
                          @mouseleave="footerStore.cursorLocation = ''"
                        />
                      </div>
                    </div>
                    <div class="icon-bg">
                      <div
                        class="seting-icon"
                        @click.stop="openLogPage(item)"
                        @mouseenter="
                          footerStore.cursorLocation = `${t('controlScreenTooltips.log', {
                            service: item.name,
                          })}`
                        "
                        @mouseleave="footerStore.cursorLocation = ''"
                      >
                        <img src="/img/icon/node-page-icons/service-command-open-logs.png" alt="icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="arrow-down" @click="scrollDown">
              <img src="/img/icon/control-page-icons/arrow-down-1.png" alt="icon" />
            </div>
          </div>
        </control-plugins>
      </div>
      <div class="dashboard-container border-4 border-gray-500 bg-black rounded-md">
        <control-dashboard></control-dashboard>
      </div>
      <div class="absolute bottom-[8px] right-[8px] col-start-21 col-end-25 row-start-2 row-end-5 py-2">
        <control-alert @expert-handler="expertModeHandlerAlert" />
      </div>
    </div>
    <LogsSection
      v-if="isLogsPageActive"
      :client="nodeStore.clientToLogs"
      @close-log="closeLogPage"
      @export-log="exportLogs"
      @export-all-log="updateAndExportAllLogs"
      @export-customized-logs="updateAndExportAllLogs"
    />
    <ExpertWindow v-if="isExpertWindowOpen" :item="expertModeClient" bg-opacity="opacity-25" @hide-modal="hideExpertMode(item)" />
    <!-- End Control main layout -->
  </base-layout>
</template>
<script setup>
import ControlService from "@/store/ControlService";
import LogsSection from "../node-page/sections/LogsSection.vue";
import { useStateHandler } from "@/composables/services";
import ControlDashboard from "./ControlDashboard.vue";
import ControlPlugins from "./ControlPlugins.vue";
import ControlAlert from "./ControlAlert.vue";
import { saveAs } from "file-saver";
import ExpertWindow from "../node-page/sections/ExpertWindow.vue";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import { useFooter } from "@/store/theFooter";
import { useControlStore } from "@/store/theControl";
import { useNodeHeader } from "@/store/nodeHeader";
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import i18n from "@/includes/i18n";
import SetupDetails from "../edit-page/components/edit/header/SetupDetails.vue";
import { useSetups } from "@/store/setups";
import { useMultiSetups } from "@/composables/multiSetups";
import { useRouter } from "vue-router";

const { getSelectedSetup, getServerView } = useMultiSetups();

const t = i18n.global.t;

const nodeStore = useNodeStore();
const serviceStore = useServices();
const controlStore = useControlStore();
const footerStore = useFooter();
const headerStore = useNodeHeader();
const setupStore = useSetups();
const router = useRouter();

const pluginsTable = ref(null);
const expertModeClient = ref(null);
const isExpertWindowOpen = ref(false);
const isLogsPageActive = ref(false);

let polling = null;

const setupsList = computed(() => {
  return setupStore.allSetups;
});

const selecteConfigServices = computed(() => {
  let test = [];
  const selectedSetup = setupStore.selectedSetup;
  if (selectedSetup && selectedSetup.services) {
    const selectedServiceIds = selectedSetup.services.map((service) => service.config.serviceID);
    serviceStore.installedServices.forEach((service) => {
      if (
        (["execution", "validator", "consensus"].includes(service.category) && selectedServiceIds.includes(service.config.serviceID)) ||
        service.category === "service"
      ) {
        test.push({
          isServicePending: false,
          ...service,
        });
      }
    });
  }
  return test;
});

const missingServices = computed(() => {
  const selectedServices = selecteConfigServices.value;
  const hasValidator = selectedServices.some((service) => service.category === "validator");
  const hasConsensus = selectedServices.some((service) => service.category === "consensus");

  let missing = [];
  if (!hasValidator) missing.push("validator");
  if (!hasConsensus) missing.push("consensus");

  return missing;
});

watch(
  missingServices,
  (newValue) => {
    footerStore.missingServices = newValue;
  },
  { immediate: true }
);

const isAnyConsensusRunning = computed(() => {
  const consensusServices = selecteConfigServices.value.filter((service) => service.category === "consensus");
  return consensusServices.length > 0 && consensusServices.some((service) => service.state === "running");
});
watch(
  isAnyConsensusRunning,
  (newValue) => {
    footerStore.isConsensusRunning = newValue;
  },
  { immediate: true }
);

//is prometheus off
const isPrometheusOff = computed(() => {
  const prometheusService = selecteConfigServices.value.find((service) => service.name === "Prometheus");
  return prometheusService?.state === "running" ? false : true;
});

watch(
  isPrometheusOff,
  (newValue) => {
    footerStore.prometheusIsOff = newValue;
  },
  { immediate: true }
);

const footerMessage = computed(() => {
  const missing = footerStore.missingServices;
  const isConsensusRunning = footerStore.isConsensusRunning;
  const isPrometheusOff = footerStore.prometheusIsOff;

  if (missing.includes("validator") && missing.includes("consensus")) {
    return "Install validator and consensus";
  }
  if (missing.includes("validator")) {
    return "Install validator";
  }
  if (missing.includes("consensus")) {
    return "Install consensus";
  }
  if (!isConsensusRunning) {
    return "Turn on the consensus";
  }
  if (isPrometheusOff) {
    return "Turn on Prometheus";
  }

  return "";
});

watch(
  footerMessage,
  (newValue) => {
    footerStore.nodataMessage = newValue;
  },
  { immediate: true }
);

const selectSetup = (setup) => {
  getSelectedSetup(setup);
};

// const serverView = () => {
//   getServerView();
// };

onMounted(() => {
  updateServiceLogs();
  polling = setInterval(updateServiceLogs, 10000);
  existanceSetups();
});

onUnmounted(() => {
  setupStore.selectedSetup = null;
  getServerView();
  clearInterval(polling);
});

// Methods

const existanceSetups = () => {
  const filtered = setupStore.allSetups.filter((s) => s.setupName !== "commonServices");
  if (!filtered.length) {
    router.push("/node");
  } else {
    getSelectedSetup(filtered[0]);
  }
};

const scrollUp = () => {
  if (pluginsTable.value) {
    pluginsTable.value.scrollTop -= 50;
  }
};

const scrollDown = () => {
  if (pluginsTable.value) {
    pluginsTable.value.scrollTop += 50;
  }
};

const hideExpertMode = (el) => {
  expertModeClient.value = el;
  isExpertWindowOpen.value = false;
};

const expertModeHandlerAlert = (validator) => {
  expertModeClient.value = validator;
  isExpertWindowOpen.value = true;
};

const stateHandler = (item) => {
  useStateHandler(item);
};

const openLogPage = (item) => {
  nodeStore.clientToLogs = item;
  isLogsPageActive.value = true;
};

const closeLogPage = () => {
  isLogsPageActive.value = false;
  controlStore.serviceLogs = null;
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

const exportLogs = async (client) => {
  const currentService = nodeStore.serviceLogs.find((service) => service.config?.serviceID === client.config?.serviceID);

  const fileName = nodeStore.exportLogs ? `${client.name}_150_logs.txt` : `${client.name}_all_logs.txt`;

  // Select the data based on the condition
  const data = nodeStore.exportLogs ? currentService.logs.slice(-150).reverse() : currentService.logs.reverse();

  const lineByLine = data.map((line, index) => `#${data.length - index}: ${line}`).join("\n\n");
  const blob = new Blob([lineByLine], { type: "text/plain;charset=utf-8" });
  saveAs(blob, fileName);
};
const updateServiceLogs = async () => {
  if (serviceStore.installedServices && serviceStore.installedServices.length > 0 && headerStore.refresh) {
    const data = await ControlService.getServiceLogs({ logs_tail: 150 });
    nodeStore.serviceLogs = data;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: #fff;
}
.ctrGridParent {
  width: 100%;
  height: 100%;
  max-height: 488px;
  padding: 2px;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: repeat(4, 1fr);
  z-index: 0;
  text-align: center;
}

.plugins-container {
  background-color: transparent;
  color: white;
  grid-column: 1/6;
  grid-row: 1/5;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.dashboard-container {
  color: white;
  grid-column: 6/25;
  grid-row: 1/5;
  z-index: 0;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 5px;
}

.control-panel {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 4;
}

.alerts {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
}

.footer {
  width: 100%;
  height: 99%;
  margin: 0 auto;
  grid-column: 1/4;
  grid-row: 4;
  background-color: rgb(52, 52, 52);
  border-radius: 0 0 7px 7px;
}
.plugins-title {
  width: 90%;
  height: 10%;
  background-color: #23272a;
  padding: 2px;
  border: 1px solid #4a5150;
  border-radius: 7px;
  margin: 14px auto 5px auto;
  box-shadow: 0 1px 3px 1px rgb(20, 44, 34);
  display: flex;
  justify-content: center;
  align-items: center;
}
.plugins-title span {
  color: rgb(194, 194, 194);
  font-size: 0.8rem;
  font-weight: 600;
}
.plugins-table-bg {
  width: 90%;
  height: 82%;
  background-color: #23272a;
  border: 1px solid #707070;
  box-shadow: 1px 1px 5px 1px rgb(0, 23, 23);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.arrow-down,
.arrow-up {
  width: 50%;
  height: 10%;
  margin: 5px;
}
.arrow-up img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.arrow-down img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.arrow-down:active,
.arrow-up:active {
  transform: scale(0.9);
}
.plugins-table {
  width: 97%;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(8, 1fr);
  border: 1px solid #707070;
  border-radius: 10px;
  box-shadow: 1px 1px 5px 1px rgb(0, 23, 23);
}
.plugins-table::-webkit-scrollbar {
  width: 0;
}
.plugins-row {
  width: 97%;
  height: 40px;
  justify-self: center;
  margin-top: 5px;
  background-color: #33393e;
  display: flex;
  justify-content: flex-start;
  border: 1px solid #333;
  border-radius: 3px;
  box-shadow: 0 1px 3px 1px #393939;
}
.plugins-running-state {
  width: 20%;
  height: 100%;
  background-color: #22b53f !important;
  border-radius: 3px;
}
.plugins-exited-state {
  width: 20%;
  height: 100%;
  background-color: #d52727 !important;
  border-radius: 3px;
}
.plugins-restarting-state {
  width: 20%;
  height: 100%;
  background-color: #ff843d !important;
  border-radius: 3px;
}
.plugins-pending-state {
  width: 20%;
  height: 100%;
  background-color: #7d7d7d;
  border-radius: 3px;
}
.plugins-row-content {
  width: 68%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-left: 5px;
}
.row-plugin-name,
.row-category {
  width: 98%;
  height: 40%;
  color: #eee;
  background-color: #464a44;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
}

.row-plugin-name span,
.row-category span {
  font-size: 0.6rem;
  font-weight: 800;
}
.service-edit {
  width: 12%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-edit .edit-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}
.edit-box .icon-bg {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.power-icon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.seting-icon {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.power-icon img:hover,
.seting-icon img:hover {
  transform: scale(1.1);
  border: 1px solid white;
  border-radius: 100%;
}
.power-icon img:active,
.seting-icon img:active {
  transform: scale(1);
}

.power-icon img {
  width: 16px;
  height: 16px;
}
.powerOff {
  background-color: rgb(226, 62, 62);
}
.powerOn {
  background-color: rgb(113, 205, 136);
}
.power-icon .pending {
  width: 17px;
  height: 17px;
  background-color: rgb(71, 70, 70);
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
  pointer-events: none;
}

.seting-icon img {
  width: 17px;
  height: 17px;
}

.service-options .control-task__manager {
  position: fixed;
  left: -3px;
  bottom: -1px;
  z-index: 1;
}
</style>
