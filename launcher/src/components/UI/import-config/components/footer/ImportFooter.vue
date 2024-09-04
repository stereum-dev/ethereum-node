<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-11 row-span-2 grid grid-cols-12 gird-rows-2 px-4" @mousedown.prevent>
    <div
      class="col-start-1 col-span-2 row-start-1 row-span-2 justify-self-end w-[120px] h-12 bg-[#264744] hover:bg-[#447a75] rounded-full py-2 px-4 flex justify-center items-center hover:scale-110 hover:shadow-lg hover:shadow-[#1e2a29] transition-all duration-300 ease-in-out active:scale-100 active:shadow-none"
      @click="goBack"
    >
      <span class="text-gray-200 text-xl font-semibold text-center uppercase">Back</span>
    </div>
    <div
      class="col-start-11 col-span-1 row-start-1 row-span-2 w-[120px] h-12 bg-[#264744] hover:bg-[#447a75] rounded-full py-2 px-4 flex justify-center items-center hover:scale-110 hover:shadow-lg hover:shadow-[#1e2a29] transition-all duration-300 ease-in-out active:scale-100 active:shadow-none cursor-pointer"
      :class="!installStore.isConfigButtonEnbabled ? 'pointer-events-none opacity-50' : ''"
      @click="goToNext"
    >
      <span class="text-gray-200 text-xl font-semibold text-center uppercase">Next</span>
    </div>
  </div>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { computed } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["runInstaller"]);
const router = useRouter();
const installStore = useClickInstall();

const fullPath = computed(() => {
  return router.currentRoute.value.fullPath;
});

const goToNext = () => {
  if (fullPath.value === "/config/upload") {
    router.push("/config/list");
  } else if (fullPath.value === "/config/list") {
    router.push("/config/sync");
  } else if (fullPath.value === "/config/sync") {
    router.push("/config/verify");
  } else if (fullPath.value === "/config/verify") {
    emit("runInstaller");
  }
};

const goBack = () => {
  router.back();
};
</script>
