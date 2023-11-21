<template>
  <div
    class="w-full max-h-[35px] col-start-1 col-span-full bg-[#171D22] rounded-full flex justify-center items-center cursor-pointer shadow-md shadow-gray-800 border border-gray-700"
  >
    <div class="w-full flex justify-evenly items-center px-5 rounded-full relative">
      <div class="flex items-center pointer-events-none">
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
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
        class="z-10 text-gray-400 text-sm rounded-full block w-full px-2 py-1 placeholder-gray-500 bg-transparent"
        placeholder="Search"
      />
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";

const stakingStore = useStakingStore();
</script>
