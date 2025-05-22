<template>
  <div
    class="stake-sidebar w-full h-full col-start-10 col-end-22 row-start-2 row-span-full grid grid-cols-12 grid-rows-15 items-center gap-1 pt-2 pb-1 pr-1 pl-1"
  >
    <WidgetCard class="services-select-widget col-start-1 col-span-6 row-start-1 row-span-3 text-white"><SelectServiceWidget /></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickedService == 'exeCons' || controlStore.pickedService == 'vld'"
      class="amsterdam-widget col-start-1 col-span-6 row-start-4 row-span-3 text-white"
    >
      <PeerToPeer v-if="controlStore.pickedService == 'exeCons'" />
      <TheStaking v-else-if="controlStore.pickedService == 'vld'" />
    </WidgetCard>
    <WidgetCard
      v-if="controlStore.pickedService == 'exeCons'"
      class="endpoint-widget col-start-1 col-span-6 row-start-7 row-span-3 text-white"
      ><EndpointWidget
    /></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickedService == 'exeCons'"
      class="p2pNetwork-widget col-start-1 col-span-6 row-start-10 row-span-3 text-white"
      ><PeersOverTime
    /></WidgetCard>
    <WidgetCard class="connected-validator-widget col-start-7 col-span-12 row-start-1 row-span-3 text-white"
      ><ConnectedValidatorWidget v-if="controlStore.pickedService == 'exeCons'" /><ConnectedClientPair
        v-else-if="controlStore.pickedService == 'vld'" /><CsmStateWidget v-else-if="controlStore.pickedService == 'csm'" :csm-box="true"
    /></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickedService == 'exeCons'"
      class="sync-status-widget col-start-7 col-span-12 row-start-4 row-span-3 text-white"
    >
      <SyncStatus
    /></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickedService == 'exeCons'"
      class="epoch-slot-widget col-start-7 col-span-12 row-start-7 row-span-3 text-white"
      ><EpochSlot
    /></WidgetCard>
    <WidgetCard
      v-if="controlStore.pickedService == 'exeCons'"
      class="subscribed-subnet-widget col-start-7 col-span-12 row-start-10 row-span-3 text-white"
      ><SubscribedSubnets
    /></WidgetCard>
  </div>
</template>

<script setup>
import WidgetCard from "../components/cards/WidgetCard.vue";
import SelectServiceWidget from "../components/widgets/SelectServiceWidget.vue";
import TheStaking from "../components/widgets/TheStaking.vue";
import EndpointWidget from "../components/widgets/EndpointWidget.vue";
import PeerToPeer from "../components/widgets/PeerToPeer.vue";
import SyncStatus from "../components/widgets/SyncStatus.vue";
import PeersOverTime from "../components/widgets/PeersOverTime.vue";
import SubscribedSubnets from "../components/widgets/SubscribedSubnets.vue";
import EpochSlot from "../components/widgets/EpochSlot.vue";
import ConnectedValidatorWidget from "../components/widgets/ConnectedValidatorWidget.vue";
import ConnectedClientPair from "../components/widgets/ConnectedClientPair.vue";
import CsmStateWidget from "../components/widgets/CsmStateWidget.vue";

import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();
</script>
