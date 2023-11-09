<template>
  <div class="max-h-[165px] col-start-1 col-span-full row-start-1 row-end-5 grid grid-cols-6 grid-rows-5 space-y-1">
    <EpochSlot />
    <TotalBalance />
    <AttestationReward />
    <CommitteeReward />
    <BlockReward />
  </div>
</template>

<script setup>
import EpochSlot from "./components/rewards/EpochSlot.vue";
import TotalBalance from "./components/rewards/TotalBalance.vue";
import AttestationReward from "./components/rewards/AttestationReward.vue";
import CommitteeReward from "./components/rewards/CommitteeReward.vue";
import BlockReward from "./components/rewards/BlockReward.vue";
</script>
