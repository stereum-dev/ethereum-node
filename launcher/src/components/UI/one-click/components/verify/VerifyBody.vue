import { ref, onMounted } from 'vue';
<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-3 row-end-11 grid grid-cols-12 grid-rows-7 p-2 mx-auto">
    <div
      class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-full bg-[#1c1d1d] grid grid-cols-12 grid-rows-7 p-4 border border-gray-600 rounded-md"
    >
      <div
        class="col-start-1 col-span-full row-start-1 row-span-1 w-full h-10 bg-[#336666] grid grid-cols-12 rounded-md justify-start items-center px-2"
      >
        <span class="col-start-1 col-span-2 text-left text-gray-300 text-sm font-normal">{{
          $t("verifyInstallation.name")
        }}</span>
        <span class="col-start-5 col-span-2 text-left text-gray-300 text-sm font-normal">{{
          $t("verifyInstallation.cat")
        }}</span>
        <span class="col-start-7 col-span-2 text-left text-gray-300 text-sm font-normal">{{
          $t("verifyInstallation.path")
        }}</span>
      </div>
      <div
        class="col-start-1 col-span-full row-start-2 row-span-full w-full flex flex-col justify-start items-center rounded-md space-y-2 overflow-y-auto overflow-x-hidden"
      >
        <div
          v-for="(item, index) in clickStore.selectedPreset.includedPlugins"
          :key="index"
          class="w-full h-12 bg-[#21272c] rounded-md p-2 mx-1 grid grid-cols-12 justify-start items-center"
        >
          <span class="col-start-1 col-end-5 text-left text-gray-300 text-sm font-normal overflow-hidden w-full">{{
            item.name
          }}</span>
          <span class="col-start-5 col-span-2 text-left text-gray-300 text-sm font-normal overflow-hidden w-full">{{
            item.category
          }}</span>
          <span class="col-start-7 col-span-full text-left text-amber-500 text-sm font-normal overflow-hidden">
            {{ clickStore.installationPath + item.path }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const clickStore = useClickInstall();

onMounted(() => {
  if (Object.keys(clickStore.selectedPreset).length === 0) {
    router.push("/oneClick/config");
  }
});
</script>
