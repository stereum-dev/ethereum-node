<template>
  <div class="col-start-1 col-span-full row-start-2 row-span-1 grid grid-cols-6 items-center">
    <img class="col-start-1 col-span-1 w-4 h-4" src="/img/icon/the-staking/comitte.png" alt="Block Icon" />
    <div class="col-start-2 col-span-full flex justify-evenly items-center">
      <TheEpoch v-for="epoch in props.epochs" :key="epoch" :state="epoch.state" :key-number="epoch.keyNumber" />
    </div>
  </div>
</template>
<script setup>
import TheEpoch from "./TheEpoch.vue";

const props = defineProps({
  epochs: {
    type: Array,
    required: true,
  },
});
</script>
