<template>
  <div class="max-h-[165px] col-start-1 col-span-full row-start-1 row-end-5 grid grid-cols-6 grid-rows-5">
    <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-6 grid-rows-5 gap-y-1">
      <EpochSlot />
      <TotalBalance />
      <AttestationReward />
      <CommitteeReward />
      <BlockReward />
    </div>
  </div>
</template>

<script setup>
import EpochSlot from "./components/EpochSlot.vue";
import TotalBalance from "./components/TotalBalance.vue";
import AttestationReward from "./components/AttestationReward.vue";
import CommitteeReward from "./components/CommitteeReward.vue";
import BlockReward from "./components/BlockReward.vue";
</script>
