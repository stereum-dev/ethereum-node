<template>
  <div
    class="w-full h-8 bg-[#17A2B8] hover:bg-[#2c8692] rounded-full flex justify-center items-center cursor-pointer shadow-md shadow-gray-800"
  >
    <form
      class="w-full flex justify-between items-center border-2 border-gray-700 rounded-full bg-slate-300 focus:ring-blue-500 focus:border-blue-500"
    >
      <label for="simple-search" class="sr-only text-gray-400 rounded-full">Search</label>
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
          v-model="searchModel"
          type="search"
          class="z-10 text-gray-700 text-sm rounded-full block w-full pl-10 p-2.5 placeholder-gray-500 bg-transparent"
          placeholder="Search"
        />

        <!-- <img @click="$emit('close')" src="../../../../public/img/icon/task-manager-icons/close3.png" alt="icon" /> -->
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const searchModel = ref("");
</script>
