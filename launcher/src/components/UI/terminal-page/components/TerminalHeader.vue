<template>
  <div class="w-full h-full col-start-2 col-end-24 bg-gray-200 row-start-1 row-span-1 items-center grid grid-cols-24">
    <div class="col-start-2 col-span-1 flex items-center justify-center">
      <img class="w-6" src="/img/icon/terminal-page-icons/terminal1.png" alt="Terminal Icon" />
    </div>
    <div class="col-start-3 col-end-12 flex items-center justify-center">
      <span class="w-full text-gray-700 text-md font-semibold text-left">SECURE SHELL - SERVER CONNECTION</span>
    </div>
    <div class="col-start-12 col-end-17 flex items-center justify-start overflow-hidden">
      <p class="w-full text-gray-700 text-md text-left">
        Server: <span class="w-full text-[#336666] text-md font-semibold text-left">{{ controlStore.ServerName }}</span>
      </p>
    </div>
    <div class="col-start-17 col-end-22 flex items-center justify-center">
      <p class="w-full text-gray-700 text-md text-left ml-2">
        IP: <span class="w-full text-[#336666] text-md font-semibold text-left">{{ controlStore.ipAddress }}</span>
      </p>
    </div>
    <div class="col-start-24 col-span-1 flex items-center justify-center cursor-pointer" @click="refreshTerminal">
      <img
        class="w-7 hover:scale-110 active:scale-100 hover:shadow-md hover:shadow-[#1b1d20] active:shadow-none transition duration-300 ease-in-out"
        src="/img/icon/terminal-page-icons/reload.png"
        alt="Terminal Icon"
      />
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { useServers } from "../../../../store/servers";

const serverStore = useServers();
const controlStore = useControlStore();

const refreshTerminal = () => {
  serverStore.refreshTerminal();
};
</script>
