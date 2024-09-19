<template>
  <div
    class="stake-sidebar w-full h-full col-start-10 col-end-22 row-start-2 row-span-full grid grid-cols-12 grid-rows-15 items-center gap-1 pt-2 pb-1 pr-1 pl-1 bg-red-400"
  >
    <WidgetCard
      class="services-select-widget col-start-1 col-span-6 row-start-1 row-span-3"
      ><SelectServiceWidget
    /></WidgetCard>
    <WidgetCard
      class="amsterdam-widget col-start-1 col-span-6 row-start-4 row-span-3"
    ></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickeedService === 'exeCons'"
      class="endpoint-widget col-start-1 col-span-6 row-start-7 row-span-3"
    ></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickeedService === 'exeCons'"
      class="p2pNetwork-widget col-start-1 col-span-6 row-start-10 row-span-3"
    ></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickeedService === 'exeCons'"
      class="p2p-widget col-start-1 col-span-6 row-start-13 row-span-3"
    ></WidgetCard>
    <WidgetCard
      class="connected-validator-widget col-start-7 col-span-12 row-start-1 row-span-3"
    ></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickeedService === 'exeCons'"
      class="sync-status-widget col-start-7 col-span-12 row-start-4 row-span-3"
    ></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickeedService === 'exeCons'"
      class="epoch-slot-widget col-start-7 col-span-12 row-start-7 row-span-3"
    ></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickeedService === 'exeCons'"
      class="subscribed-subnet-widget col-start-7 col-span-12 row-start-10 row-span-3"
    ></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickeedService === 'exeCons'"
      class="peer-over-time-widget col-start-7 col-span-12 row-start-13 row-span-3"
    ></WidgetCard>
  </div>
</template>

<script setup>
import WidgetCard from "../components/cards/WidgetCard.vue";
import SelectServiceWidget from "../components/widgets/SelectServiceWidget.vue";

import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();
</script>

<style scoped></style>
