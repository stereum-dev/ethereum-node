<template>
  <div class="w-full h-full rounded-sm flex justify-start items-center cursor-pointer">
    <div
      class="w-full h-full flex justify-evenly items-center px-2 relative rounded-sm bg-[#232426]"
    >
      <div class="flex items-center pointer-events-none" @mousedown.prevent>
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        v-model="stakingStore.searchContent"
        type="search"
        class="z-10 text-gray-300 text-sm rounded-full block w-full px-2 py-1 placeholder-gray-500 bg-transparent"
        placeholder="Search for keys"
      />
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { onMounted, onUnmounted } from "vue";

const stakingStore = useStakingStore();

onMounted(() => {
  stakingStore.searchContent = "";
});

onUnmounted(() => {
  stakingStore.searchContent = "";
});
</script>
