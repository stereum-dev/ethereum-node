<template>
  <div
    class="w-full h-full col-start-22 col-end-25 row-start-2 row-span-full grid grid-cols-3 grid-rows-15 items-center gap-1 pt-2 pb-1 pr-1"
  >
    <MiniCard class="col-start-1 col-span-3 row-start-1 row-span-3"
      ><ClientPairWidget v-if="controlStore.pickedService == 'exeCons'" /><GasWidget
        v-else-if="controlStore.pickedService == 'vld'" /><IdKweyCsm v-else
    /></MiniCard>
    <MiniCard v-if="controlStore.pickedService == 'exeCons'" class="col-start-1 col-span-3 row-start-4 row-span-3"
      ><PairStatusWidget
    /></MiniCard>
    <MiniCard v-if="controlStore.pickedService == 'exeCons'" class="col-start-1 col-span-3 row-start-7 row-span-3"
      ><RPCRecievedOverTime
    /></MiniCard>
    <MiniCard v-if="controlStore.pickedService == 'exeCons'" class="col-start-1 col-span-3 row-start-10 row-span-3"
      ><ServicePort
    /></MiniCard>
  </div>
</template>

<script setup>
import MiniCard from "../components/cards/MiniCard.vue";
import ClientPairWidget from "../components/widgets/ClientPairWidget.vue";
import PairStatusWidget from "../components/widgets/PairStatusWidget.vue";
import RPCRecievedOverTime from "../components/widgets/RPCRecievedOverTime.vue";
import ServicePort from "../components/widgets/ServicePort.vue";
import GasWidget from "../components/widgets/GasWidget.vue";
import IdKweyCsm from "../components/widgets/IdKeyCsm.vue";

import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();
</script>
