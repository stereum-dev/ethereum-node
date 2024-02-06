import { useServers } from '@/store/servers';
<template>
  <div class="w-full h-[30px] grid grid-cols-12 mx-auto bg-[#334d4d] text-gray-300 font-semibold text-md">
    <div
      v-if="serverStore.isUpdateProcessing"
      class="col-start-1 col-span-2 p-1 flex justify-center items-center bg-gray-700 rounded-sm user-select-none pointer-events-none cursor-not-allowed"
    >
      <img class="w-5" src="/img/icon/node-icons/download_disabled.png" alt="icon" />
    </div>
    <div
      v-else
      class="col-start-1 col-span-2 p-1 flex justify-center items-center bg-[#4d7575] hover:bg-[#243535] rounded-sm cursor-pointer active:scale-95 transition-transform"
      @click="updateServer"
    >
      <img class="w-5" src="/img/icon/node-icons/download2.png" alt="icon" />
    </div>
    <div class="col-start-4 col-end-8 flex justify-center items-center overflow-hidden">
      <span class="text-sm text-gray-200 font-semibold">{{ props.item?.name }}</span>
    </div>
    <div class="col-start-9 col-span-full flex justify-center items-center overflow-hidden">
      <span class="text-sm text-amber-400 font-semibold">{{ props.item?.version }}</span>
    </div>
  </div>
</template>

<script setup>
import { useServers } from "@/store/servers";

const emit = defineEmits(["updateServer"]);
const serverStore = useServers();

const props = defineProps({
  item: Object,
});

const updateServer = () => {
  emit("updateServer", props.item);
};
</script>
