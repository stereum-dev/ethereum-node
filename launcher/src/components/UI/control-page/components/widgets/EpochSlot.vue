<template>
  <div class="volume-Parent flex w-full h-full justify-center items-center flex-col p-1 gap-1 relative">
    <NoData
      v-if="
        !setupsStore?.selectedServicePairs ||
        isConsensusMissing ||
        !footerStore?.isConsensusRunning ||
        footerStore?.prometheusIsOff ||
        setupsStore?.selectedServicePairs?.network === 'devnet'
      "
    />
    <template v-else>
      <ServiceLine
        :label="t('controlPage.currentEpoch')"
        :value="flag ? beaconControler : String(controlStore.currentResult.currentEpoch)"
        :hover-text="flag ? '' : t('controlPage.currentEpochIs', { epoch: String(controlStore.currentResult.currentEpoch) })"
      />
      <ServiceLine
        label="INDEX"
        :value="flag ? beaconControler : String(getSlotIndex())"
        :hover-text="flag ? '' : t('controlPage.correntSlotIndexIs', { index: String(getSlotIndex()) })"
      />
      <ServiceLine
        :label="t('controlPage.currentSlot')"
        :value="flag ? beaconControler : String(controlStore.currentResult.currentSlot)"
        :hover-text="flag ? '' : t('controlPage.currentSlotIs', { slot: String(controlStore.currentResult.currentSlot) })"
      />
    </template>
  </div>
</template>

<script setup>
import { useSetups } from "@/store/setups";
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import NoData from "./NoData.vue";
import ServiceLine from "../fragments/ServiceLine.vue"; // Assuming ServiceLine is the reusable component
import i18n from "@/includes/i18n";
import ControlService from "@/store/ControlService";

const t = i18n.global.t;
const controlStore = useControlStore();
const footerStore = useFooter();
const setupsStore = useSetups();

const polling = ref(null);

const beaconControler = computed(() => {
  return "Loading...";
});

const refreshTimer = () => {
  const intervalTime = setupsStore.selectedServicePairs?.network === "gnosis" ? 5000 : 11000;

  polling.value = setInterval(() => {
    currentEpochSlot();
  }, intervalTime);
};

const currentEpochSlot = async () => {
  try {
    let res = await ControlService?.getCurrentEpochandSlot();
    // Keep the last result (or "Loading...") instead of rendering an error response
    if (res?.code) {
      console.error("Couldn't fetch current epoch and slot:", res.info);
      return;
    }
    res.currentEpoch = res.current_epoch;
    res.currentSlot = res.current_slot;
    delete res.current_epoch;
    delete res.current_slot;
    controlStore.currentResult = res;
  } catch (error) {
    console.error("An error occurred while fetching currentEpochandSlot:", error);
  }
};

onMounted(() => {
  refreshTimer();
});

onBeforeUnmount(() => {
  clearInterval(polling.value);
});

const getSlotIndex = () => {
  const slot = controlStore?.currentResult?.currentSlot;
  return slot % controlStore?.currentResult?.slotsPerEpoch;
};

const isConsensusMissing = computed(() => footerStore?.missingServices?.includes("consensus"));

const flag = computed(() => !controlStore?.currentResult);
</script>
