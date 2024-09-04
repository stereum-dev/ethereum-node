<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-end-2 grid grid-cols-12 bg-[#2d3035] border-b border-gray-500">
    <div class="w-full h-full col-start-2 col-end-5 flex justify-start items-center space-x-2">
      <img class="w-7 h-7" :src="client.sIcon" alt="Service Icon" @mousedown.prevent />
      <div class="text-gray-200 text-lg font-semibold">{{ client.name }}</div>
    </div>
    <div class="w-full h-full col-start-5 col-end-8 flex justify-center items-center space-x-2">
      <span class="text-sm text-[#dee3e3] font-semibold">{{ $t("pluginLogs.cat") }}</span>
      <span class="text-amber-200 text-md font-semibold capitalize">
        {{ client?.category }}
      </span>
    </div>
    <div class="w-full h-full col-start-8 col-end-11 flex justify-center items-center space-x-2">
      <span class="text-sm text-[#dee3e3] font-semibold">{{ $t("pluginLogs.ver") }}</span>
      <span class="text-amber-200 text-md font-semibold">
        {{ client?.config?.runningImageVersion }}
      </span>
    </div>
    <div class="w-full h-full col-start-12 col-span-1 flex justify-end items-center">
      <img
        class="w-6 h-6 border border-gray-400 rounded-md p-1 cursor-pointer hover:bg-opacity-10 hover:scale-110 transition-all duration-200 ease-in-out active:scale-95 mr-2"
        src="/img/icon/staking-page-icons/close.png"
        alt="Service Icon"
        @mousedown.prevent
        @click="closeLog"
      />
    </div>
  </div>
</template>
<script setup>
const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close-log"]);

const closeLog = () => {
  emit("close-log");
};
</script>
