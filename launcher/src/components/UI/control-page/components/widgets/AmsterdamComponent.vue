<template>
  <div class="amsterdam-parent">
    <no-data
      v-if="!setupsStore.selectedServicePairs || isConsensusMissing || !footerStore.isConsensusRunning || footerStore.prometheusIsOff"
    />
    <template v-else>
      <div
        class="icoTitle"
        @mouseenter="footerStore.cursorLocation = `${t('controlPage.netSel')} ${getSetupNetwork?.name}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <div class="icoContainer">
          <img :src="!setupsStore.selectedServicePairs ? defaultIcon : getSetupNetwork?.icon" />
        </div>
        <span>{{ $t("controlPage.node") }}</span>
      </div>
      <div class="docBox">
        <div v-if="flag" class="box-wrapper">
          <div class="spinner-square">
            <div class="square-1 square"></div>
            <div class="square-2 square"></div>
            <div class="square-3 square"></div>
          </div>
        </div>

        <div v-else class="box-wrapper">
          <div class="proposed-part">
            <div class="proposed-rows">
              <div
                v-for="(n, index) in proposedBlock"
                :key="index"
                class="proposed-square"
                :class="{
                  white: n.slotStatus == 'pending',
                  green: n.slotStatus == 'proposed',
                  red: n.slotStatus == 'missed',
                }"
                @mouseenter="
                  footerStore.cursorLocation = `the current epoch: ${
                    controlStore.currentResult?.currentEpoch || 'N/A'
                  } and the slot number is ${n.slotNumber === 0 ? 'N/A' : n.slotNumber}`
                "
                @mouseleave="footerStore.cursorLocation = ''"
              ></div>
            </div>
          </div>
          <div class="justified-part">
            <div class="Finalized-row">
              <div
                v-for="n in controlStore.currentResult?.justifiedEpochStatus?.[0] || []"
                :key="n"
                class="Finalized-square"
                :class="{
                  white: n.slotStatus == 'pending',
                  green: n.slotStatus == 'proposed',
                  red: n.slotStatus == 'missed',
                }"
                @mouseenter="
                  footerStore.cursorLocation = `the justified epoch: ${
                    controlStore.currentResult?.currentJustifiedEpoch || 'N/A'
                  } and the slot number is ${n.slotNumber}`
                "
                @mouseleave="footerStore.cursorLocation = ''"
              ></div>
            </div>
            <div class="Finalized-row">
              <div
                v-for="n in controlStore.currentResult?.preJustifiedEpochStatus?.[0] || []"
                :key="n"
                class="Finalized-square"
                :class="{
                  white: n.slotStatus == 'pending',
                  green: n.slotStatus == 'proposed',
                  red: n.slotStatus == 'missed',
                }"
                @mouseenter="
                  footerStore.cursorLocation = `the previous justified epoch: ${
                    controlStore.currentResult?.previousJustifiedEpoch || 'N/A'
                  } and the slot number is ${n.slotNumber}`
                "
                @mouseleave="footerStore.cursorLocation = ''"
              ></div>
            </div>
          </div>
          <div class="Finalized-part">
            <div class="Finalized-row">
              <div
                v-for="n in controlStore.currentResult?.finalizedEpochStatus?.[0] || []"
                :key="n"
                class="Finalized-square"
                :class="{
                  white: n.slotStatus == 'pending',
                  green: n.slotStatus == 'proposed',
                  red: n.slotStatus == 'missed',
                }"
                @mouseenter="
                  footerStore.cursorLocation = `the Finalized epoch: ${
                    controlStore.currentResult?.finalizedEpoch || 'N/A'
                  } and the slot number is ${n.slotNumber}`
                "
                @mouseleave="footerStore.cursorLocation = ''"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { useSetups } from "@/store/setups";

import { useNodeManage } from "@/store/nodeManage";
import { useFooter } from "@/store/theFooter";
import { useControlStore } from "@/store/theControl";
import { useServices } from "@/store/services";
import ControlService from "@/store/ControlService";
import NoData from "./NoData.vue";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const setupsStore = useSetups();
const nodeManageStore = useNodeManage();
const footerStore = useFooter();
const controlStore = useControlStore();
const servicesStore = useServices();

const defaultIcon = ref("/animation/loading/mushroom-spinner.gif");
const loadingStrater = ref(false);
const networkFlag = ref(false);
const polling = ref({});
const changeCounter = ref(0);

const getSetupNetwork = computed(() => {
  if (!setupsStore.selectedServicePairs) {
    return defaultIcon;
  } else {
    const net = setupsStore.selectedServicePairs?.network;
    if (net && nodeManageStore.networkList) {
      return nodeManageStore.networkList.find((network) => network.network === net);
    }
  }
  return defaultIcon;
});
const isConsensusMissing = computed(() => footerStore.missingServices?.includes("consensus"));

const proposedBlock = computed(() => {
  if (setupsStore.selectedServicePairs?.network === "gnosis") {
    return Array.from({ length: 16 }, () => ({
      slotNumber: 0,
      slotStatus: "pending",
    }));
  } else {
    return Array.from({ length: 32 }, () => ({
      slotNumber: 0,
      slotStatus: "pending",
    }));
  }
});

const flag = computed(() => {
  if (
    ["consensus", "Prometheus", "consensus and Prometheus"].includes(footerStore.installedServicesController) ||
    footerStore.consensusClientIsOff ||
    footerStore.prometheusIsOff ||
    controlStore.currentResult === undefined ||
    controlStore.currentResult.beaconStatus === undefined ||
    proposedBlock.value.every((item) => item.slotNumber === 0) ||
    loadingStrater.value ||
    networkFlag.value
  ) {
    return true;
  }
  return controlStore.currentResult.beaconStatus !== 0;
});

const serviceStateController = (serviceName, stateProperty) => {
  let isServiceOff = true;
  let servicesToCheck = [];

  if (serviceName.toLowerCase() === "prometheus") {
    servicesToCheck = servicesStore.installedServices;
  } else if (setupsStore.selectedSetup && setupsStore.selectedSetup.services) {
    servicesToCheck = setupsStore.selectedSetup.services;
  } else {
    servicesToCheck = setupsStore.allSetups.flatMap((setup) => setup.services || []);
  }

  for (let service of servicesToCheck) {
    if (service.name.toLowerCase() === serviceName.toLowerCase()) {
      isServiceOff = service.state === "exited";
      break;
    }
  }

  footerStore[stateProperty] = isServiceOff;
};

const serviceController = (args, setup) => {
  const foundCategories = new Set();
  let hasPrometheus = false;

  if (Array.isArray(args)) {
    for (let obj of args) {
      if (obj?.name?.toLowerCase().includes("prometheus")) {
        hasPrometheus = true;
      }
    }
  }

  const setupsToCheck = Array.isArray(setup) ? setup : [setup];

  for (const singleSetup of setupsToCheck) {
    if (singleSetup?.services && Array.isArray(singleSetup.services)) {
      for (let service of singleSetup.services) {
        if (service.category === "consensus" || service.category === "execution") {
          foundCategories.add(service.category);
        }
      }
    }
  }

  const requiredCategories = ["consensus", "execution"];
  const missingCategories = requiredCategories.filter((category) => !foundCategories.has(category));

  if (!hasPrometheus) {
    missingCategories.push("Prometheus");
  }

  footerStore.installedServicesController = missingCategories.join(", ").replace(/, (?=[^,]*$)/, " and ");
};

watch(servicesStore.installedServices, (newVal) => {
  const setupToCheck = setupsStore.selectedSetup?.services?.length ? setupsStore.selectedSetup : setupsStore.allSetups;
  serviceController(newVal, setupToCheck);
  const consensusServiceName = setupsStore?.selectedServicePairs?.consensusService?.name || null;

  if (consensusServiceName) {
    serviceStateController(consensusServiceName, "consensusClientIsOff");
  }
  serviceStateController("prometheus", "prometheusIsOff");
  currentEpochSlot(setupsStore?.selectedServicePairs?.consensusService?.name?.toUpperCase());
});

const currentEpochSlot = async (consensusName) => {
  try {
    let res = await ControlService.getCurrentEpochSlot(consensusName);

    controlStore.currentSlotData = res.currentSlot;
    controlStore.currentEpochData = res.currentEpoch;
    controlStore.currentResult = res;
  } catch (error) {
    console.error("An error occurred while fetching currentEpochSlot:", error);
  }
};

const refreshTimer = () => {
  const intervalTime = setupsStore.selectedServicePairs?.network === "gnosis" ? 5000 : 11000;

  polling.value = setInterval(() => {
    if (controlStore.currentSlotData && controlStore.currentEpochData) {
      currentEpochSlot(setupsStore?.selectedServicePairs?.consensusService?.name);
    }
  }, intervalTime);
};

onMounted(() => {
  refreshTimer();
});

onBeforeUnmount(() => {
  clearInterval(polling.value);
});

watch(
  () => controlStore.currentResult,
  (newResult) => {
    if (newResult && newResult.currentEpochStatus && newResult?.currentEpochStatus[0]) {
      const newArray = newResult?.currentEpochStatus[0].slice(0, proposedBlock.value.length).map((slot) => ({
        slotNumber: slot.slotNumber,
        slotStatus: slot.slotStatus,
      }));

      while (newArray.length < proposedBlock.value.length) {
        newArray.push({ slotNumber: 0, slotStatus: "pending" });
      }

      proposedBlock.value.splice(0, proposedBlock.value.length, ...newArray);
    }

    if (networkFlag.value) {
      changeCounter.value++;
      if (setupsStore.selectedServicePairs?.network === "gnosis" && controlStore.changeCounter === 4) {
        networkFlag.value = false;
        changeCounter.value = 0;
      } else if (setupsStore.selectedServicePairs?.network !== "gnosis" && controlStore.changeCounter === 2) {
        networkFlag.value = false;
        changeCounter.value = 0;
      }
    }
  },
  { deep: true, immediate: true }
);

const refreshHandling = () => {
  controlStore.currentResult = {};
  clearInterval(polling.value);
  currentEpochSlot(setupsStore?.selectedServicePairs?.consensusService?.name?.toUpperCase());
};

watch(
  () => setupsStore.selectedServicePairs,
  () => {
    refreshHandling();
    refreshTimer();
  },
  { deep: true }
);
</script>

<style scoped>
.box-wrapper {
  width: 100%;
  height: 95%;
  box-sizing: border-box;
  position: relative;
}
.amsterdam-parent {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
  color: #c1c1c1;
  position: relative;
}
.icoTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 30%;
  height: 100%;
}
.icoContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.icoContainer img {
  width: 70%;
}
.icoTitle span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60%;
}
.docBox {
  width: 70%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.Finalized-part,
.proposed-part {
  width: 95%;
  height: 25%;
  border-radius: 0 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.justified-part {
  width: 95%;
  height: 50%;
  border-radius: 0 0 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.Finalized-row,
.proposed-rows {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 60%;
  font-weight: 600;
  text-transform: uppercase;
  margin-top: 1.5%;
  color: red;
}
.Finalized-square {
  width: 3%;
  height: 90%;
  margin: 0 0.5%;
  border-radius: 5px;
}
.proposed-square {
  width: 3%;
  height: 90%;
  margin: 0 0.5%;
  border-radius: 5px;
}
.Finalized-square:hover,
.proposed-square:hover {
  transform: scale(1.3);
}
.white {
  background: #c1c1c1;
}
.green {
  background: #568d50;
}
.red {
  background: #ff0000;
}

.spinner-square {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.square {
  width: 5%;
  height: 40%;
  border-radius: 4px;
  margin-right: 5%;
}

.square-1 {
  animation: square-anim 1200ms 0s infinite;
}

.square-2 {
  animation: square-anim 1200ms 200ms infinite;
}

.square-3 {
  animation: square-anim 1200ms 400ms infinite;
}

@keyframes square-anim {
  0% {
    height: 40%;
    background-color: #336666;
  }
  20% {
    height: 40%;
  }
  40% {
    height: 80%;
    background-color: #478e8e;
  }
  80% {
    height: 40%;
  }
  100% {
    height: 40%;
    background-color: #336666;
  }
}
</style>
