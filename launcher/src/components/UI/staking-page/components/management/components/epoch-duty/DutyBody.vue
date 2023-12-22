<template>
  <div
    class="h-full col-start-1 col-span-full row-start-2 row-span-2 rounded-md grid grid-cols-4 grid-rows-2 items-center"
  >
    <CommitteeEpoch :epoch="props.epoch" />
    <BlockEpoch :epoch="props.epoch" />
  </div>
</template>
<script setup>
import CommitteeEpoch from "./CommitteeEpoch.vue";
import BlockEpoch from "./BlockEpoch.vue";

//Props
const props = defineProps({
  epoch: {
    type: Object,
    required: true,
  },
});
</script>
