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
        <input v-model="clickStore.installationPath" type="text" class="w-full h-full rounded-md bg-gray-300 pl-2 text-sm" />
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
      v-if="clickStore.selectedPreset.name === 'stereum on arm'"
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
  </div>
</template>

<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { onMounted } from "vue";

const clickStore = useClickInstall();

onMounted(() => {
  clickStore.installMonitoring = false;
  clickStore.startServicesAfterInstall = true;
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
</style>
