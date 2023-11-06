<template>
  <div class="col-start-5 col-end-21 row-start-1 row-span-2 grid grid-cols-6 grid-rows-2 p-1 items-end gap-2">
    <div class="h-14 col-start-1 col-end-4 row-start-1 row-span-2 flex justify-center bg-[#1E2429] rounded-md p-1">
      <img
        v-if="incommingNetwork"
        class="w-[50px] h-[50px] col-start-1 col-span-2 row-start-1 row-span-2 z-10 self-center"
        :src="incommingNetwork?.icon"
        alt="Preset Icon"
      />
      <div class="w-full h-full flex justify-center items-center ml-2">
        <span class="w-full text-[22px] font-bold text-gray-400 uppercase tracking-wider">
          {{ incommingNetwork?.name }}</span
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, watchEffect, ref } from "vue";
import { useClickInstall } from "@/store/clickInstallation";
import { useRouter } from "vue-router";
import { useServices } from "@/store/services";

const installStore = useClickInstall();
const manageStore = useServices();
const router = useRouter();
const incommingNetwork = ref(null);
const fullPath = router.currentRoute.value.fullPath;

// Computed properties

const currentNetwork = computed(() => {
  return manageStore.currentNetwork;
});

const configNetwork = computed(() => {
  return installStore.configNetwork;
});

// Watchers

watchEffect(() => {
  if (fullPath.startsWith("/config")) {
    incommingNetwork.value = configNetwork.value;
  } else {
    incommingNetwork.value = currentNetwork.value;
  }
});
</script>
