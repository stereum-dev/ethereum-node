<template>
  <div
    class="h-full col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-7 items-center"
    :class="getBackgroundColor ?? 'bg-[#232426]'"
  >
    <div
      v-if="stakingStore.selectedServiceToFilter"
      class="col-start-1 col-end-4 flex justify-start items-center px-1 space-x-3"
      @mouseenter="footerStore.cursorLocation = `Selected Client: ${stakingStore.selectedServiceToFilter?.service}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img :src="stakingStore.selectedServiceToFilter?.icon" alt="Client Icon" class="w-4 h-4" />

      <span class="w-1/2 text-[10px] font-semibold text-center"> {{ stakingStore.selectedServiceToFilter?.service }}</span>
    </div>
    <div v-else class="w-10/12 h-5 col-start-1 col-span-full flex justify-center items-center p-1 space-x-3 mx-auto mb-1">
      <div class="shrink-0 flex justify-center items-center">
        <span class="w-4 h-4 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 skeleton-pulse"></span>
      </div>
      <div
        class="w-full col-start-2 col-end-9 h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 self-center overflow-hidden flex justify-center items-center rounded-xl skeleton-pulse"
      ></div>
    </div>
  </div>
</template>
<script setup>
import { useStakingStore } from "@/store/theStaking";
const stakingStore = useStakingStore();
import { useFooter } from "@/store/theFooter";
import { useSetups } from "@/store/setups";
import { computed } from "vue";

const footerStore = useFooter();
const setupStore = useSetups();

const getBackgroundColor = computed(() => {
  /* eslint-disable no-constant-binary-expression */
  return (
    setupStore.getBGColor(stakingStore.selectedServiceToFilter?.setupColor) +
      " " +
      setupStore.getTextColor(stakingStore.selectedServiceToFilter?.setupColor) ?? "bg-[#232426]"
  );
});
</script>
<style scoped>
.skeleton-pulse {
  background-size: 200% 100%;
  animation: pulse 1.5s infinite linear;
}

@keyframes pulse {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
