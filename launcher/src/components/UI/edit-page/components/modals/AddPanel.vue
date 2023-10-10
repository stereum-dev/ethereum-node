import { onMounted } from 'vue';
<template>
  <div class="w-full flex flex-col justify-evenly items-center mx-auto px-4 py-2 space-y-2 mt-6">
    <div class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/folder.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">Installation Path</span>
        <input
          v-model="props.properties.installDir"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
    <div v-if="client.category === 'consensus'" class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="w-8 col-start-1" src="/img/icon/manage-node-icons/sync.gif" alt="Sync Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-md text-left">Sync Mode</span>
        <SyncCarousel :properties="props.properties" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import SyncCarousel from "../edit/SyncCarousel";
import ControlService from "@/store/ControlService";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
  properties: {
    type: Object,
    default: null,
  },
});

onMounted(() => {
  props.properties.installDir = "";
  getInstallPath();
});

const getInstallPath = async () => {
  let largestVolumePath = await ControlService.getLargestVolumePath();
  if (largestVolumePath === "/") largestVolumePath = largestVolumePath + "opt";
  const stereumInstallationPath = [largestVolumePath, "/stereum"].join("/").replace(/\/{2,}/, "/");
  props.properties.installDir = stereumInstallationPath;
};
</script>
