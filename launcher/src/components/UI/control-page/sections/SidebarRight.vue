<template>
  <div
    class="w-full h-full col-start-22 col-end-25 row-start-2 row-span-full grid grid-cols-3 grid-rows-15 items-center gap-1 pt-2 pb-1 pr-1"
  >
    <MiniCard class="col-start-1 col-span-3 row-start-1 row-span-3"><ClientPairWidget /></MiniCard>
    <MiniCard v-if="controlStore.pickeedService === 'exeCons'" class="col-start-1 col-span-3 row-start-4 row-span-3" />
    <MiniCard v-if="controlStore.pickeedService === 'exeCons'" class="col-start-1 col-span-3 row-start-7 row-span-3" />
    <MiniCard v-if="controlStore.pickeedService === 'exeCons'" class="col-start-1 col-span-3 row-start-10 row-span-3" />
  </div>
</template>

<script setup>
import MiniCard from "../components/cards/MiniCard.vue";
import ClientPairWidget from "../components/widgets/ClientPairWidget.vue";

import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();
</script>

<style scoped></style>
