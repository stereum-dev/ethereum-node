<template>
  <div class="Sync-parent flex w-full h-full justify-center items-center relative">
    <no-data
      v-if="
        !setupsStore?.selectedServicePairs ||
        !controlStore.syncstatus.data ||
        isConsensusMissing ||
        footerStore.prometheusIsOff ||
        setupsStore?.selectedServicePairs?.network === 'devnet'
      "
    />
    <template v-else>
      <div class="sync-icon w-1/4 h-full flex flex-col justify-center items-center">
        <div class="sync-icon_container flex justify-center items-center w-full h-4/5 p-2">
          <img class="w-full" :src="syncIconPath" />
        </div>
        <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-[40%] font-semibold uppercase">{{
          $t("controlPage.syncStatus")
        }}</span>
      </div>

      <div class="activeWidget w-3/4 h-full flex justify-center items-center pt-1 pb-1">
        <div
          class="consensusContainer"
          @mouseenter="footerStore.cursorLocation = `${consensusSyncData?.title}: ${formattedConsensusValue}`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <div class="consensusName">
            <span class="text-gray-200">{{ setupsStore?.selectedServicePairs?.consensusService?.name }}</span>
          </div>
          <div class="progressBox">
            <sync-circular-progress :color="consensusColor" :sync-percent="consensusCyrcle" />
            <img class="w-9 h-9 absolute" :src="setupsStore?.selectedServicePairs?.consensusService?.icon" alt="consensus" />
          </div>
          <div class="syncStatusStatus">
            <span :style="{ color: consensusColor }">{{ consensusState }}</span>
          </div>
        </div>

        <div
          class="executionContainer"
          @mouseenter="footerStore.cursorLocation = `${executionSyncData?.title}: ${formattedExecutionValue}`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <div class="executionName">
            <span class="text-gray-200">{{ setupsStore?.selectedServicePairs?.executionService?.name }}</span>
          </div>
          <div class="progressBox">
            <sync-circular-progress :color="executionColor" :sync-percent="executionCyrcle" />
            <img class="w-9 h-9 absolute" :src="setupsStore?.selectedServicePairs?.executionService?.icon" alt="execution" />
          </div>
          <div class="syncStatusStatus">
            <span :style="{ color: executionColor }">{{ executionState }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import NoData from "./NoData.vue";
import SyncCircularProgress from "./SyncCircularProgress.vue";
import { useSetups } from "@/store/setups";
import { computed, watch, ref } from "vue";

const controlStore = useControlStore();
const footerStore = useFooter();
const setupsStore = useSetups();

const isConsensusMissing = computed(() => footerStore.missingServices?.includes("consensus"));
const consensusColor = ref("grey");
const consensusCyrcle = ref(0);
const executionColor = ref("grey");
const executionCyrcle = ref(0);
const consensusState = ref(null);
const executionState = ref(null);
const syncIconPath = ref("");

// Icon setup for sync statuses
const syncIcons = {
  error: "/animation/synchronisation/synchronisation-icon-error.gif",
  onHold: "/animation/synchronisation/synchronisation-icon-unknown.gif",
  syncing: "/animation/synchronisation/synchronisation-icon-active.gif",
  synced: "/animation/synchronisation/synchronisation-icon-sucess.gif",
};

const formattedConsensusValue = computed(
  () => formatSyncData(consensusSyncData.value?.frstVal) + " / " + formatSyncData(consensusSyncData.value?.scndVal)
);

const formattedExecutionValue = computed(
  () => formatSyncData(executionSyncData.value?.frstVal) + " / " + formatSyncData(executionSyncData.value?.scndVal)
);

// Handle sync status and colors
const handleSyncStatus = (client, colorRef, cyrcleRef, stateRef) => {
  if (!client) {
    setSyncValues("grey", 100, "on-hold", colorRef, cyrcleRef, stateRef);
    return;
  }
  const { frstVal: lo, scndVal: hi, state: st } = client;
  const low = parseInt(lo);
  const high = parseInt(hi);
  if (st !== "running") {
    setSyncValues("red", 100, "error", colorRef, cyrcleRef, stateRef);
  } else if (low > high) {
    setSyncValues("orange", 100, "unknown", colorRef, cyrcleRef, stateRef);
  } else if (low < 1 && high < 1) {
    setSyncValues("grey", 100, "on-hold", colorRef, cyrcleRef, stateRef);
  } else if (low < high) {
    setSyncValues("lightblue", getSyncPercentage(low, high), "syncing", colorRef, cyrcleRef, stateRef);
  } else {
    setSyncValues("green", getSyncPercentage(low, high), "synced", colorRef, cyrcleRef, stateRef);
  }
};

const setSyncValues = (color, percent, state, colorRef, cyrcleRef, stateRef) => {
  colorRef.value = color;
  cyrcleRef.value = percent;
  stateRef.value = state;
};

const getSyncPercentage = (firstVal, secondVal) => ((firstVal / secondVal) * 100).toFixed(2);

// Sync Icon update
const updateSyncIcon = () => {
  const iconType =
    consensusState.value === "error" || executionState.value === "error"
      ? "error"
      : consensusState.value === "on-hold" || executionState.value === "on-hold"
        ? "onHold"
        : consensusState.value === "syncing" || executionState.value === "syncing"
          ? "syncing"
          : "synced";

  syncIconPath.value = syncIcons[iconType];
};

// Watchers for state changes
watch([consensusState, executionState], updateSyncIcon);

const getServiceSyncStatus = (serviceType, syncData) => {
  const serviceId =
    setupsStore?.selectedServicePairs?.[serviceType]?.config?.serviceID || setupsStore?.selectedServicePairs?.[serviceType]?.id;

  if (!Array.isArray(syncData)) return null;
  return syncData.flat().find((data) => data.serviceID === serviceId) || null;
};

const consensusSyncData = computed(() => getServiceSyncStatus("consensusService", controlStore?.syncstatus?.data));
const executionSyncData = computed(() => getServiceSyncStatus("executionService", controlStore?.syncstatus?.data));

watch(
  () => consensusSyncData.value,
  (newVal) => {
    handleSyncStatus(newVal, consensusColor, consensusCyrcle, consensusState);
  },
  { immediate: true, deep: true }
);
watch(
  () => executionSyncData.value,
  (newVal) => handleSyncStatus(newVal, executionColor, executionCyrcle, executionState),
  { immediate: true, deep: true }
);

const formatSyncData = (arg) => {
  const num = Number(arg) || 0;

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
</script>

<style scoped>
.consensusContainer,
.executionContainer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 45%;
  height: 98%;
  flex-direction: column;
  position: relative;
}
.consensusName,
.executionName {
  font-size: 60%;
  font-weight: 600;
  text-shadow: 1px 2px 5px #4f5256;
  display: flex;
  width: 100%;
  height: 17%;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}
.consensusPer {
  position: absolute;
  left: 10%;
  top: 85%;
  font-size: 30%;
  font-weight: 600;
  text-shadow: 1px 2px 5px #4f5256;
  text-transform: uppercase;
}
.progressBox {
  display: flex;
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
}
.syncStatusStatus {
  width: 100%;
  height: 12%;
  display: flex;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 50%;
  justify-content: center;
  align-items: center;
  bottom: 0;
}
</style>
