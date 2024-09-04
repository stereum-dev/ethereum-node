<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-2 row-end-12 grid grid-cols-24 grid-rows-12 bg-[#2d3035] p-2">
    <LogSidebar :client="props.client" />
    <div
      class="w-full h-full col-start-2 col-span-full row-start-1 row-span-full overflow-x-hidden overflow-y-auto max-h-full p-1 flex flex-col justify-start items-start space-y-1 bg-[#202225]"
    >
      <div
        v-for="(log, index) in limitedLogs"
        :key="index"
        :class="`w-full h-full min-h-11 max-h-12 flex justify-start items-center gap-x-2 px-1 py-2 relative cursor-pointer text-[#e6e4e4] ${
          index % 2 === 0 ? 'bg-[#495056] ' : 'bg-[#202225]'
        }  overflow-y-hidden overflow-x-scroll whitespace-pre text-nowrap`"
        @click="copy(log)"
        @mouseenter="hoveredLogIndex = index"
        @mouseleave="hoveredLogIndex = null"
      >
        <span class="text-sm font-semibold text-gray-400">#{{ 150 - index }}</span>
        <span class="text-sm font-semibold">{{ log }}</span>
        <img
          v-if="hoveredLogIndex === index"
          class="w-7 h-7 sticky left-[920px] p-1 bg-[#171D22] rounded-md shadow-md shadow-[#191a1b] animate__animated animate__slideInDown cursor-pointer active:scale-90 transition-all ease-in-out duration-150 z-10"
          :src="copyIconHandler"
          alt="Copy Icon"
          @click="copy(log)"
          @mousedown.prevent
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import LogSidebar from "./LogSidebar";
import { useNodeStore } from "@/store/theNode";
import { computed, ref } from "vue";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const nodeStore = useNodeStore();
const hoveredLogIndex = ref(null);
const isCopied = ref(false);

const copyIconHandler = computed(() => {
  if (isCopied.value === true) {
    return "/img/icon/service-log-icons/copied.png";
  }
  return "/img/icon/staking-page-icons/copy.png";
});

const logsList = computed(() => {
  return nodeStore.serviceLogs.filter((i) => i.config?.serviceID === nodeStore.clientToLogs?.config?.serviceID).flatMap((i) => i.logs);
});

const limitedLogs = computed(() => {
  const allLogs =
    nodeStore.searchLogs.length > 0
      ? logsList.value.filter((log) => log.toLowerCase().includes(nodeStore.searchLogs.toLowerCase()))
      : logsList.value;
  return allLogs.slice(-150).reverse();
});

//Methods

const copy = async (log) => {
  try {
    await navigator.clipboard.writeText(log);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 1000);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: transparent;
}

/* Track */
::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #333639;

  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #69b3f8;
}
</style>
