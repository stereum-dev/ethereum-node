<template>
  <div class="w-full h-full col-start-2 col-end-24 bg-gray-200 row-start-1 row-span-1 items-center grid grid-cols-24">
    <div class="col-start-2 col-span-1 flex items-center justify-center">
      <img class="w-6" src="/img/icon/terminal-page-icons/console.png" alt="Terminal Icon" />
    </div>
    <div class="col-start-3 col-end-12 flex items-center justify-center">
      <span class="w-full text-gray-700 text-md font-semibold text-left">{{ title }}</span>
    </div>
    <div class="col-start-12 col-end-17 flex items-center justify-start overflow-hidden">
      <p class="w-full text-gray-700 text-md text-left">
        Server:
        <span class="w-full text-[#336666] text-md font-semibold text-left">{{ controlStore.ServerName }}</span>
      </p>
    </div>
    <div class="col-start-17 col-end-22 flex items-center justify-center">
      <p class="w-full text-gray-700 text-md text-left ml-2">
        IP:
        <span class="w-full text-[#336666] text-md font-semibold text-left">{{ controlStore.ipAddress }}</span>
      </p>
    </div>
    <div class="col-start-22 col-span-1 flex items-center justify-center cursor-pointer relative" @click="clearTerminal">
      <img
        class="w-7 hover:scale-105 active:scale-100 hover:shadow-md hover:shadow-[#1b1d20] active:shadow-none transition duration-300 ease-in-out rounded-md bg-[#1f2226] p-[2px]"
        src="/img/icon/terminal-page-icons/broom.png"
        alt="Terminal Icon"
        @mouseenter="footerStore.cursorLocation = `${clear}`"
        @mouseleave="footerStore.cursorLocation = ''"
      />
    </div>
    <div class="col-start-23 col-span-1 flex items-center justify-center cursor-pointer relative" @click="killTerminal">
      <img
        class="w-7 hover:scale-105 active:scale-100 hover:shadow-md hover:shadow-[#1b1d20] active:shadow-none transition duration-300 ease-in-out rounded-md bg-[#1f2226] p-[4px]"
        src="/img/icon/terminal-page-icons/trash.png"
        alt="Terminal Icon"
        @mouseenter="footerStore.cursorLocation = `${kill}`"
        @mouseleave="footerStore.cursorLocation = ''"
      />
    </div>
    <div class="col-start-24 col-span-1 flex items-center justify-center cursor-pointer relative" @click="newTerminal">
      <span
        class="w-7 hover:scale-105 active:scale-100 hover:shadow-md hover:shadow-[#1b1d20] active:shadow-none transition duration-300 ease-in-out rounded-md text-center text-lg bg-[#1f2226] text-gray-100"
        @mouseenter="footerStore.cursorLocation = `${newT}`"
        @mouseleave="footerStore.cursorLocation = ''"
        >+</span
      >
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "@/store/theControl";
import { useServers } from "@/store/servers";
// import { ref } from "vue";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const title = t("shellPage.title");
const clear = t("shellPage.clear");
const kill = t("shellPage.kill");
const newT = t("shellPage.newTerminal");

const footerStore = useFooter();

const serverStore = useServers();
const controlStore = useControlStore();

const killTerminal = () => {
  serverStore.killTerminal();
};

const newTerminal = () => {
  serverStore.newTerminal();
};

const clearTerminal = () => {
  serverStore.clearTerminal();
};
</script>
