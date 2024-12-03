<template>
  <div
    class="volume-Parent flex w-full h-full justify-center items-center flex-col p-1 gap-1 relative"
  >
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
        :value="
          String(flag ? beaconControler : controlStore?.currentResult?.currentEpoch)
        "
        :hover-text="
          t('controlPage.currentEpochIs', {
            epoch: String(
              flag ? beaconControler : controlStore?.currentResult?.currentEpoch
            ),
          })
        "
      />
      <ServiceLine
        label="INDEX"
        :value="String(flag ? beaconControler : controlStore?.slotIndex + 1)"
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
            slot: String(
              flag ? beaconControler : controlStore?.currentResult?.currentSlot
            ),
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
import { computed } from "vue";
import NoData from "./NoData.vue";
import ServiceLine from "../fragments/ServiceLine.vue"; // Assuming ServiceLine is the reusable component
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const controlStore = useControlStore();
const footerStore = useFooter();
const setupsStore = useSetups();

const beaconControler = computed(() => {
  if (
    !controlStore.currentResult ||
    controlStore.currentResult.beaconStatus === undefined
  ) {
    return "Checking Beacon Status...";
  }
  return controlStore.currentResult.beaconStatus !== 0
    ? "No Running Beacon Node!"
    : "Loading...";
});

const isConsensusMissing = computed(() =>
  footerStore?.missingServices?.includes("consensus")
);

const flag = computed(
  () => !controlStore?.currentResult || controlStore?.currentResult?.beaconStatus !== 0
);
</script>
