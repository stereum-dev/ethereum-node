<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-1 grid grid-cols-6 items-center px-1">
    <img
      class="col-start-1 col-span-1 w-4 h-4 justify-self-center"
      src="/img/icon/staking-page-icons/cube.png"
      alt="Block Icon"
      @mousedown.prevent
    />
    <div class="col-start-2 col-span-full flex justify-evenly items-center">
      <TheEpoch :duties-number="epoch.proposerDuties" />
    </div>
  </div>
</template>
<script setup>
import TheEpoch from "./TheEpoch.vue";

const { epoch } = defineProps({
  epoch: {
    type: Object,
    required: true,
  },
});
</script>
