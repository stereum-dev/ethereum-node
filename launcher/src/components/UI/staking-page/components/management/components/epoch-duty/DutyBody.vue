<template>
  <div
    class="h-full col-start-1 col-span-full row-start-2 row-end-8 rounded-md grid grid-cols-4 grid-rows-3 items-center"
  >
    <AttestationEpoch :epochs="props.epochs" />
    <CommitteeEpoch :epochs="props.epochs" />
    <BlockEpoch :epochs="props.epochs" />
  </div>
</template>
<script setup>
import AttestationEpoch from "./AttestationEpoch.vue";
import CommitteeEpoch from "./CommitteeEpoch.vue";
import BlockEpoch from "./BlockEpoch.vue";

//Props
const props = defineProps({
  epochs: {
    type: Array,
    required: true,
  },
});
</script>
