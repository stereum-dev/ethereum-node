<template>
  <div class="max-h-[165px] col-start-1 col-span-full row-start-1 row-end-5 grid grid-cols-6 grid-rows-4 space-y-1" @mousedown.prevent>
    <EpochSlot />
    <AttestationReward />
    <CommitteeReward />
    <BlockReward />
  </div>
</template>
<script setup>
import EpochSlot from "./components/val-rewards/EpochSlot.vue";
import AttestationReward from "./components/val-rewards/AttestationReward.vue";
import CommitteeReward from "./components/val-rewards/CommitteeReward.vue";
import BlockReward from "./components/val-rewards/BlockReward.vue";
</script>
