<template>
  <div
    class="stake-sidebar w-full h-full col-start-10 col-end-22 row-start-2 row-span-full grid grid-cols-12 grid-rows-15 items-center gap-1 pt-2 pb-1 pr-1 pl-1"
  >
    <WidgetCard class="services-select-widget col-start-1 col-span-6 row-start-1 row-span-3"><SelectServiceWidget /></WidgetCard>
    <WidgetCard class="amsterdam-widget col-start-1 col-span-6 row-start-4 row-span-3">
      <AmsterdamComponent v-if="pickedService" />
      <TheStaking v-else />
    </WidgetCard>
    <WidgetCard v-if="pickedService" class="endpoint-widget col-start-1 col-span-6 row-start-7 row-span-3"><EndpointWidget /></WidgetCard>
    <WidgetCard v-if="pickedService" class="p2pNetwork-widget col-start-1 col-span-6 row-start-10 row-span-3"><PeersOverTime /></WidgetCard>
    <WidgetCard v-if="pickedService" class="p2p-widget col-start-1 col-span-6 row-start-13 row-span-3"><PeerToPeer /></WidgetCard>
    <WidgetCard class="connected-validator-widget col-start-7 col-span-12 row-start-1 row-span-3"
      ><ConnectedValidatorWidget v-if="pickedService" /><ConnectedClientPair v-else
    /></WidgetCard>
    <WidgetCard v-if="pickedService" class="sync-status-widget col-start-7 col-span-12 row-start-4 row-span-3"> <SyncStatus /></WidgetCard>
    <WidgetCard v-if="pickedService" class="epoch-slot-widget col-start-7 col-span-12 row-start-7 row-span-3"><EpochSlot /></WidgetCard>
    <WidgetCard v-if="pickedService" class="subscribed-subnet-widget col-start-7 col-span-12 row-start-10 row-span-3"
      ><SubscribedSubnets
    /></WidgetCard>
  </div>
</template>

<script setup>
import WidgetCard from "../components/cards/WidgetCard.vue";
import SelectServiceWidget from "../components/widgets/SelectServiceWidget.vue";
import AmsterdamComponent from "../components/widgets/AmsterdamComponent.vue";
import TheStaking from "../components/widgets/TheStaking.vue";
import EndpointWidget from "../components/widgets/EndpointWidget.vue";
import PeerToPeer from "../components/widgets/PeerToPeer.vue";
import SyncStatus from "../components/widgets/SyncStatus.vue";
import PeersOverTime from "../components/widgets/PeersOverTime.vue";
import SubscribedSubnets from "../components/widgets/SubscribedSubnets.vue";
import EpochSlot from "../components/widgets/EpochSlot.vue";
import ConnectedValidatorWidget from "../components/widgets/ConnectedValidatorWidget.vue";
import ConnectedClientPair from "../components/widgets/ConnectedClientPair.vue";

import { watch, ref } from "vue";

import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();

const pickedService = ref(true);

watch(
  () => controlStore.pickedService,
  (newValue) => {
    pickedService.value = newValue === "vld" ? false : true;
  },
  { deep: true, immediate: true }
);
</script>
