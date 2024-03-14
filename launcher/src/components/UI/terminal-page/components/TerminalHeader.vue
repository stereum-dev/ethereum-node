<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 items-center grid grid-cols-24">
    <div class="col-start-3 col-span-1 flex items-center justify-center">
      <img class="w-6" src="/img/icon/terminal-page-icons/terminal1.png" alt="Terminal Icon" />
    </div>
    <div class="col-start-4 col-end-12 flex items-center justify-center">
      <span class="w-full text-gray-300 text-md font-semibold text-left">SECURE SHELL - SERVER CONNECTION</span>
    </div>
    <div class="col-start-12 col-end-17 flex items-center justify-start overflow-hidden">
      <p class="w-full text-gray-300 text-md text-left">
        Server: <span class="w-full text-amber-300 text-md font-semibold text-left">{{ controlStore.ServerName }}</span>
      </p>
    </div>
    <div class="col-start-17 col-end-22 flex items-center justify-center">
      <p class="w-full text-gray-300 text-md text-left ml-2">
        IP: <span class="w-full text-amber-300 text-md font-semibold text-left">{{ controlStore.ipAddress }}</span>
      </p>
    </div>
    <!-- <div
      class="w-10 h-7 flex justify-center items-center bg-gray-700 hover:bg-black rounded-sm cursor-pointer transition-all duration-300 ease-in-out active:bg-gray-800 active:shadow-none active:shadow-gray-800"
      @click="refreshConnection"
    >
      <img class="w-6 h-6" src="/img/icon/terminal-page-icons/redo.png" alt="Refresh Icon" />
    </div> -->
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();
</script>
