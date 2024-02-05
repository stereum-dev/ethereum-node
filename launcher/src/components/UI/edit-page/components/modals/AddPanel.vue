import { onMounted, watch, onUnmounted, ref } from 'vue';
<template>
  <div class="w-full h-full flex flex-col justify-evenly items-center mx-auto px-4 py-2 space-y-2 mt-6 relative">
    <div class="w-full flex justify-center items-center">
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/folder.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">{{ $t("editModals.installationPath") }}</span>
        <input
          v-model="props.properties.installDir"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
    <div
      v-if="client.category === 'consensus' && client.service !== 'ExternalConsensusService'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="w-8 col-start-1" src="/img/icon/manage-node-icons/sync.gif" alt="Sync Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-md text-left">{{ $t("editModals.syncMode") }}</span>
        <SyncCarousel :properties="props.properties" />
      </div>
    </div>

    <div
      v-if="props.client.service === 'ExternalExecutionService' || props.client.service === 'ExternalConsensusService'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/external-source.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">External Source</span>
        <input
          v-model="sourceLink"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>

    <div
      v-if="client.service === 'ExternalExecutionService' && client.category == 'execution'"
      class="w-full flex justify-center items-center"
    >
      <div class="w-full grid grid-cols-12 items-center text-md">
        <img class="col-start-1 w-8" src="/img/icon/manage-node-icons/JWTTokenIcon.png" alt="Path Icon" />
        <span class="col-start-2 col-span-3 text-gray-400 text-left">JWT TOKEN</span>
        <input
          v-model="jwtToken"
          class="col-start-6 col-span-7 min-h-[30px] border border-gray-500 px-2 py-1 text-left text-gray-400 text-xs rounded bg-[#141516] focus:border-teal-500"
          type="text"
          autofocus
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
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

const sourceLink = ref("");
const jwtToken = ref("");

//Computed & Watcher

watchEffect(() => {
  props.client.config.source = sourceLink.value;
});

watchEffect(() => {
  props.client.config.jwtToken = jwtToken.value;
});

//Lifecycle Hooks

onMounted(() => {
  sourceLink.value = "";
  jwtToken.value = "";
  props.properties.installDir = "";
  getInstallPath();
});

//Methods

const getInstallPath = async () => {
  let largestVolumePath = await ControlService.getLargestVolumePath();
  if (largestVolumePath === "/") largestVolumePath = largestVolumePath + "opt";
  const stereumInstallationPath = [largestVolumePath, "/stereum"].join("/").replace(/\/{2,}/, "/");
  props.properties.installDir = stereumInstallationPath;
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
}
</style>
