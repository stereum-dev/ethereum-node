<template>
  <div
    v-if="!footerStore.isConsensusRunning || isConsensusMissing"
    class="NoDataParent flex w-full h-full justify-center items-center relative"
    @mouseenter="cursorLocation = `${footerStore.nodataMessage}`"
    @mouseleave="cursorLocation = ''"
  >
    <NoData />
  </div>

  <div v-else class="volume-Parent flex w-full h-full justify-center items-center flex-col p-1 gap-1">
    <ServiceLine
      :label="t('controlPage.currentEpoch')"
      :value="flag ? beaconControler : controlStore?.currentResult?.currentEpoch"
      :hover-text="
        t('controlPage.currentEpochIs', {
          epoch: flag ? beaconControler : controlStore?.currentResult?.currentEpoch,
        })
      "
    />
    <ServiceLine label="INDEX" value="-----" />
    <ServiceLine
      :label="t('controlPage.currentSlot')"
      :value="flag ? beaconControler : controlStore?.currentResult?.currentSlot"
      :hover-text="
        t('controlPage.currentSlotIs', {
          slot: flag ? beaconControler : controlStore?.currentResult?.currentSlot,
        })
      "
    />
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import { computed } from "vue";
import NoData from "./NoData.vue";
import ServiceLine from "../fragments/ServiceLine.vue"; // Assuming ServiceLine is the reusable component
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const controlStore = useControlStore();
const footerStore = useFooter();

const beaconControler = computed(() => {
  if (!controlStore.currentResult || controlStore.currentResult.beaconStatus === undefined) {
    return "Checking Beacon Status...";
  }
  return controlStore.currentResult.beaconStatus !== 0 ? "No Running Beacon Node!" : "Loading...";
});

const flag = computed(() => !controlStore.currentResult || controlStore.currentResult.beaconStatus !== 0);
</script>
