<template>
  <div class="col-start-3 col-end-14 grid grid-cols-7 items-center gap-x-2">
    <SingleTab v-for="tab in tabs" :key="tab.page" :tab="tab" />
    <router-link to="/shell" class="w-full h-full col-start-7 col-span-1 flex justify-center items-center">
      <img
        class="w-8 h-8 border border-gray-400 rounded-full shadow-md shadow-gray-800 hover:shadow-lg hover:shadow-gray-800 hover:scale-110 cursor-pointer transition-transform duration-300 ease-in-out active:scale-100 active:shadow-none active:shadow-gray-800"
        src="/img/icon/base-header-icons/header-shell-icon.png"
        alt="Shell Icon"
        @click="startShell"
        @mousedown.prevent
      />
    </router-link>
  </div>
</template>

<script setup>
import SingleTab from "./SingleTab.vue";
import { ref } from "vue";
import ControlService from "@/store/ControlService";
import { useClickInstall } from "@/store/clickInstallation";

const clickStore = useClickInstall();

console.log("pathaaaaaaaa-------------------", clickStore.installationPath);

const tabs = ref([
  { page: "Node", path: "/node", relativePath: "/edit" },
  { page: "Control", path: "/control" },
  { page: "Staking", path: "/staking" },
]);

// onBeforeMount(() => {});

const startShell = async () => {
  // stat webserver on the remote ubuntu .nodeConnection.sshSas;dlfj.exec(`${path} node server.js`)
  await ControlService.startShell();
};
</script>
