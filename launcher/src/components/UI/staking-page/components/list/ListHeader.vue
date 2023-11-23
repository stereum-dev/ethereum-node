<template>
  <div
    class="w-full col-start-1 col-span-full row-start-1 row-span-1 rounded-t-md border-b-2 grid grid-cols-12 bg-[#151618] border-gray-500"
  >
    <div
      v-if="stakingStore.isPreviewListActive"
      class="w-full h-full col-start-1 col-span-full flex justify-center items-center rounded-t-md bg-[#17A2B8] space-x-4"
    >
      <span class="text-md font-semibold text-gray-200 uppercase">Insert Validator Key</span>
      <img class="w-4 h-5" src="/img/icon/the-staking/black-key.png" alt="icon" />
    </div>
    <div
      v-else
      class="w-full h-full col-start-1 col-span-full rounded-t-md bg-[#336666] grid grid-cols-12 items-center px-3"
    >
      <div class="col-start-1 col-end-4 flex justify-center items-center space-x-1">
        <img class="w-6 h-6" src="/img/icon/the-staking/group.png" alt="Manage Icon" />
        <span class="text-md font-semibold text-gray-200 uppercase">{{ stakingStore.currentGroup.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";

const stakingStore = useStakingStore();
</script>
