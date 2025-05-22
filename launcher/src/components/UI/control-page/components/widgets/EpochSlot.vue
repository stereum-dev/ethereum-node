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
        :value="String(flag ? beaconControler : controlStore?.currentResult?.currentEpoch)"
        :hover-text="
          t('controlPage.currentEpochIs', {
            epoch: String(flag ? beaconControler : controlStore?.currentResult?.currentEpoch),
          })
        "
      />
      <ServiceLine
        label="INDEX"
        :value="String(flag ? beaconControler : getSlotIndex())"
        :hover-text="
          controlStore.slotIndex < 0
            ? ''
            : t('controlPage.currentSlotIs', {
                slot: String(controlStore.slotIndex + 1),
              })
        "
      />
      <ServiceLine
        :label="t('controlPage.currentSlot')"
        :value="String(flag ? beaconControler : controlStore?.currentResult?.currentSlot)"
        :hover-text="
          t('controlPage.currentSlotIs', {
            slot: String(flag ? beaconControler : controlStore?.currentResult?.currentSlot),
          })
        "
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
  return slot % controlStore.currentResult.slotsPerEpoch;
};

const isConsensusMissing = computed(() => footerStore?.missingServices?.includes("consensus"));

const flag = computed(() => !controlStore?.currentResult);
</script>
