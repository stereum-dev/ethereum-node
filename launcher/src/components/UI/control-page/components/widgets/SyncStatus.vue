<template>
  <div class="Sync-parent relative">
    <no-data
      v-if="isConsensusMissing || footerStore.prometheusIsOff || !setupsStore?.selectedSetup"
      @mouseenter="cursorLocation = `${nodataMessage}`"
      @mouseleave="cursorLocation = ''"
    />
    <div v-else class="sync-box">
      <div class="sync-icon">
        <div class="sync-icon_container">
          <img :src="syncIconPath" />
        </div>
        <span>{{ $t("controlPage.syncStatus") }}</span>
      </div>
      <div class="wrapper">
        <div class="activeWidget">
          <div class="consensusContainer">
            <div class="consensusName">
              <span class="text-gray-200 mt-2">{{ setupsStore?.selectedServicePairs?.consensusService?.name }}</span>
            </div>
            <div class="progressBox">
              <sync-circular-progress :color="consensusColor" :sync-percent="consensusCyrcle" />
            </div>
            <div class="syncStatusStatus">
              <span :style="{ color: consensusColor }">{{ consensusState }}</span>
            </div>
            <div class="consensusIconCons">
              <img :src="setupsStore?.selectedServicePairs?.consensusService?.icon" alt="consensus" />
            </div>
          </div>

          <div class="executionContainer">
            <div class="executionName">
              <span class="text-gray-200 mt-2">{{ setupsStore?.selectedServicePairs?.executionService?.name }}</span>
            </div>
            <div class="progressBox">
              <sync-circular-progress :color="executionColor" :sync-percent="executionCyrcle" />
            </div>
            <div class="syncStatusStatus">
              <span :style="{ color: executionColor }">{{ executionState }}</span>
            </div>
            <div class="executionIconCons">
              <img :src="setupsStore?.selectedServicePairs?.executionService?.icon" alt="execution" />
            </div>
          </div>
        </div>
      </div>
    </div>
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

// Handle sync status and colors
const handleSyncStatus = (client, colorRef, cyrcleRef, stateRef) => {
  if (!client) {
    setSyncValues("grey", 100, "on-hold", colorRef, cyrcleRef, stateRef);
    return;
  }

  const { frstVal: lo, scndVal: hi, state: st } = client;
  if (st !== "running") {
    setSyncValues("red", 100, "error", colorRef, cyrcleRef, stateRef);
  } else if (lo > hi) {
    setSyncValues("orange", 100, "unknown", colorRef, cyrcleRef, stateRef);
  } else if (lo < 1 && hi < 1) {
    setSyncValues("grey", 100, "on-hold", colorRef, cyrcleRef, stateRef);
  } else if (lo < hi) {
    setSyncValues("lightblue", getSyncPercentage(lo, hi), "syncing", colorRef, cyrcleRef, stateRef);
  } else {
    setSyncValues("green", getSyncPercentage(lo, hi), "synced", colorRef, cyrcleRef, stateRef);
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

const consensusSyncData = computed(() => getServiceSyncStatus("consensusService", controlStore.syncstatus.data));
const executionSyncData = computed(() => getServiceSyncStatus("executionService", controlStore.syncstatus.data));

watch(
  () => consensusSyncData.value,
  (newVal) => {
    handleSyncStatus(newVal, consensusColor, consensusCyrcle, consensusState);
  },
  { immediate: true }
);
watch(
  () => executionSyncData.value,
  (newVal) => handleSyncStatus(newVal, executionColor, executionCyrcle, executionState),
  { immediate: true }
);
</script>

<style scoped>
.activeWidget {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
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
.executionIconCons {
  position: absolute;
  width: 51%;
  left: 24.5%;
  top: 28.5%;
}
.consensusIconCons {
  position: absolute;
  width: 51%;
  left: 24.5%;
  top: 28.5%;
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
.pageNumber {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  width: 98%;
  height: 30%;
}
.arrowBox {
  width: 6%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.arrowUp,
.arrowDown {
  height: 30%;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
}
.arrowDown img {
  transform: rotate(180deg);
}
.Sync-parent {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  height: 100%;
}
.sync-box {
  width: 90%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.sync-icon {
  box-sizing: border-box;
  width: 31%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.sync-icon span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  color: #c1c1c1;
  font-weight: bold;
}
.sync-icon_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.sync-icon_container img {
  width: 70%;
  height: 90%;
}
.sync-box_value {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow-y: auto;
  color: #c1c1c1;
  overflow-y: auto;
  position: relative;
}
.wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 69%;
  height: 100%;
  position: relative;
}
.sync-box_row {
  display: flex;
  width: 95%;
  height: 27%;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #c1c1c1;
  border-radius: 5px;
  padding: 2% 2%;
  margin: 2% 0;
}
.sync-box-row_title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  font-weight: 600;
  font-size: 45%;
  margin-left: 1%;
}
.sync-box-row_val {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 62%;
  font-weight: 400;
  font-size: 50%;
  color: #94deff;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}

/* Client font colors */
.clientred * {
  color: #f84343;
}
.clientorange * {
  color: #ff8c00;
}
.clientgrey * {
  color: grey;
}
.clientblue * {
  color: lightblue;
}
.clientgreen * {
  color: #00be00;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}
</style>
