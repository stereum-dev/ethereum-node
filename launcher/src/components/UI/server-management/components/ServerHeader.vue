import { ref, watchEffect } from 'vue';
<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-24 items-center">
    <span class="col-start-4 col-end-14 text-3xl text-gray-200 font-bold">SERVER MANAGEMENT</span>
    <div class="col-start-14 col-span-full w-full h-full grid grid-cols-12 grid-rows-5 items-center pr-2 pl-1">
      <div class="col-start-1 col-span-full row-start-2 row-end-5 h-full bg-[#1b1b1d] rounded-md grid grid-cols-8 items-center px-2">
        <div
          v-for="tab in serverStore.tabs"
          :key="tab.name"
          :class="[
            'col-span-1 w-8 h-8 bg-gray-500 hover:text-teal-500 border border-gray-500 hover:border-teal-200 rounded-sm shadow-md shadow-black flex justify-center items-center cursor-pointer active:scale-95 transition-all duration-200 active:shadow-none',
            tab.isActive ? 'bg-teal-500 border-teal-200' : '',
            isConnectedServer && tab.name === 'login' ? ' opacity-30 pointer-events-none scale-90 shadow-none' : '',
            isServerToConnect && tab.name !== 'login' ? ' opacity-30 pointer-events-none scale-90 shadow-none' : '',
            isLoginRoute && tab.name !== 'login' ? ' opacity-30 pointer-events-none scale-90 shadow-none' : '',
          ]"
          @click="
            (isServerToConnect && tab.name !== 'login') ||
            (isConnectedServer && tab.name === 'login') ||
            (isLoginRoute && tab.name !== 'login')
              ? null
              : tabPicker(tab.name)
          "
          @mouseenter="footerStore.cursorLocation = `${tabTooltip(tab)}`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <img class="w-7 h-7 mx-auto hover:scale-110 transition-all duration-200" :src="tab.icon" alt="Server Icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useServers } from "@/store/servers";
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const login = t("serverHeader.login");
const info = t("serverHeader.info");
const ssh = t("serverHeader.ssh");
const osUpdate = t("serverHeader.osUpdate");
const settings = t("serverHeader.settings");
const twoFactorAuth = t("serverHeader.twoFactorAuth");

const footerStore = useFooter();

const route = useRoute();
const serverStore = useServers();
const emit = defineEmits(["tabPicker"]);

// Computed property to check if current route is '/login'
const isLoginRoute = computed(() => route.path === "/login");

const tabTooltip = (tab) => {
  if (tab.name === "login") {
    return login;
  } else if (tab.name === "info") {
    return info;
  } else if (tab.name === "ssh") {
    return ssh;
  } else if (tab.name === "update") {
    return osUpdate;
  } else if (tab.name === "settings") {
    return settings;
  } else if (tab.name === "2fa") {
    return twoFactorAuth;
  }
  return null; // Default case if none of the conditions match
};

const isConnectedServer = computed(() => {
  return serverStore.selectedServerConnection && !serverStore.selectedServerToConnect;
});

const isServerToConnect = computed(() => {
  return serverStore.selectedServerToConnect;
});

const tabPicker = (tabName) => {
  serverStore.setActiveTab(tabName);
  emit("tabPicker", tabName);
};
</script>
