<template>
  <div
    class="col-start-7 col-end-13 row-start-2 row-span-full border border-gray-600 rounded-md bg-[#14171a] grid grid-cols-6 grid-rows-7 gap-y-1 p-1"
  >
    <div
      class="w-full col-start-1 col-span-full row-start-1 row-span-2 border rounded-md border-gray-600 mx-auto bg-[#336666] grid grid-cols-6 grid-rows-2"
    >
      <div class="col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center p-1">
        <span class="text-sm text-gray-300 font-semibold">{{ $t("pluginName.path") }}</span>
      </div>
      <div class="h-8 col-start-1 col-span-full row-start-2 row-span-1 flex justify-center items-center px-1 pb-1">
        <input
          v-model="clickStore.installationPath"
          type="text"
          :class="{ 'invalid-path': !clickStore.isPathValid }"
          class="path-input w-full h-full rounded-md bg-gray-300 pl-2 text-sm"
          @input="validatePath"
        />
      </div>
    </div>
    <div class="w-full col-start-1 col-span-full row-start-3 row-span-2 border rounded-md border-gray-600 mx-auto bg-[#336666]">
      <div class="col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center p-1">
        <span class="text-sm text-gray-300 font-semibold">{{ $t("pluginName.installOpt") }}</span>
      </div>
      <div class="h-8 col-start-1 col-span-full row-start-1 row-span-1 flex justify-center items-center p-1">
        <div class="checkpoint-part">
          <input
            id="InstallOption"
            v-model="clickStore.startServicesAfterInstall"
            type="checkbox"
            name="Start up client after installation?"
            class="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
          />

          <span class="text-sm text-gray-300 font-semibold">{{ $t("pluginName.startOnInstall") }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="clickStore.selectedPreset?.name === 'stereum on arm'"
      class="w-full col-start-1 col-span-full row-start-5 row-span-2 border rounded-md border-gray-600 mx-auto bg-[#336666]"
    >
      <div class="col-start-1 col-span-full row-start-2 row-span-1 flex justify-center items-center p-1">
        <span class="text-sm text-gray-300 font-semibold">{{ $t("pluginName.monitor") }}</span>
      </div>
      <div class="h-8 col-start-1 col-span-full row-start-2 row-span-1 flex justify-center items-center p-1">
        <div class="checkpoint-part">
          <label for="MarketingAccept" class="flex gap-2 cursor-pointer">
            <input
              id="MarketingAccept"
              v-model="clickStore.installMonitoring"
              type="checkbox"
              name="marketing_accept"
              class="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
            />
            <span class="text-sm text-gray-300 font-semibold">{{ $t("pluginName.instMonit") }}</span>
          </label>
        </div>

        <!-- <div :class="[checkBox, 'checkItem']" @click="props.monitoring = !props.monitoring">
          <img v-if="props.monitoring" src="/img/icon/server-management-icons/done.png" alt="" />
        </div> -->

        <!-- <input v-model="installMonitoring" class="switch" type="checkbox" /> -->
      </div>
    </div>
    <div
      v-if="
        (clickStore.selectedPreset?.name === 'op node archive' || clickStore.selectedPreset?.name === 'op and eth node archive') &&
        manageStore.currentNetwork.network == 'op-mainnet'
      "
      class="w-full col-start-1 col-span-full row-start-5 row-span-2 border rounded-md border-gray-600 mx-auto bg-[#336666] flex flex-col items-center p-2"
    >
      <!-- Centered Title -->
      <p class="text-sm text-gray-300 font-semibold uppercase">
        {{ isLegacyAdded ? "Remove Geth Legacy" : "Add Geth Legacy" }}
      </p>

      <!-- Service Info & Toggle Button -->
      <div class="w-full flex items-center justify-between mt-2">
        <!-- Left: Icon & Service Name -->
        <div class="flex items-center gap-3">
          <img :src="getLegacyService.icon" alt="legacy" class="w-8 h-8" />
          <p class="text-gray-100 text-md font-semibold">
            {{ getLegacyService?.name || getLegacyService?.service }}
          </p>
        </div>

        <!-- Right: Add/Remove Button -->
        <button
          class="w-12 h-8 flex items-center justify-center rounded-full transition-all text-xl font-bold"
          :class="{
            'bg-red-400 text-white hover:bg-red-700': isLegacyAdded,
            'bg-gray-800 text-gray-300 hover:bg-gray-700': !isLegacyAdded,
          }"
          @click="toggleLegacyPreset"
        >
          {{ isLegacyAdded ? "−" : "+" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { computed, onMounted } from "vue";
import { useServices } from "../../../../../store/services";
import { useNodeManage } from "@/store/nodeManage";

const clickStore = useClickInstall();
const serviceStore = useServices();
const manageStore = useNodeManage();

const validatePath = () => {
  const pathRegex = /^\/(?:[^ /\0*?<>|&{}$;][^ /\0]*\/?)*[^ /\0*?<>|&{}$;]{1,}$/;
  clickStore.isPathValid = pathRegex.test(clickStore.installationPath.trim());
};

const getLegacyService = computed(() => {
  return serviceStore.allServices.find((service) => service.service === "L2GethService");
});

// Check if Legacy Service is Already Added
const isLegacyAdded = computed(() => {
  return clickStore.selectedPreset.includedPlugins.some((plugin) => plugin.service === "L2GethService");
});

// Toggle Add/Remove Functionality
const toggleLegacyPreset = () => {
  if (isLegacyAdded.value) {
    // Remove if already included
    clickStore.selectedPreset.includedPlugins = clickStore.selectedPreset.includedPlugins.filter(
      (plugin) => plugin.service !== "L2GethService"
    );
  } else {
    // Add if not included
    clickStore.selectedPreset.includedPlugins.push(getLegacyService.value);
  }
};

onMounted(() => {
  clickStore.installMonitoring = false;
  clickStore.startServicesAfterInstall = true;
  clickStore.isPathValid = true;
});
</script>
<style scoped>
.checkpoint-part {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  width: 90%;
}
.invalid-path {
  border: 2px solid red;
}
</style>
