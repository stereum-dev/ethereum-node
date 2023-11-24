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
      class="w-full h-full col-start-1 col-span-full rounded-t-md bg-[#336666] grid grid-cols-24 items-center px-3"
    >
      <img
        class="w-6 h-6 col-start-1 col-span-1 justify-self-center"
        src="/img/icon/the-staking/group.png"
        alt="Manage Icon"
        @mousedown.prevent
      />
      <span class="col-start-2 col-span-10 justify-self-start text-md font-semibold text-gray-200 uppercase">{{
        stakingStore.currentGroup.name
      }}</span>

      <button
        class="w-9 h-9 col-start-24 col-span-full rounded-md flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-150"
        @mouseenter="footerStore.cursorLocation = `Back to keys List`"
        @mouseleave="footerStore.cursorLocation = ''"
        @click="backToList"
        @mousedown.prevent
      >
        <img class="w-5 h-5" src="/img/icon/the-staking/list2.png" alt="Back Icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";

const stakingStore = useStakingStore();
const footerStore = useFooter();

const backToList = () => {
  stakingStore.isGroupListActive = false;
};
</script>
