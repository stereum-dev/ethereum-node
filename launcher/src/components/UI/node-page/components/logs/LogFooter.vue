<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-12 row-span-1 grid grid-cols-12 bg-[#2d3035] border-t border-gray-500 p-1"
  >
    <div class="w-full h-full col-start-1 col-end-6 flex justify-center items-center space-x-2">
      <span class="text-sm text-gray-400 font-semibold">{{ $t("pluginLogs.serviceId") }}</span>
      <span class="text-amber-200 text-sm font-semibold">
        {{ client?.config?.serviceID }}
      </span>
    </div>
    <div class="w-full h-full col-start-6 col-end-7 flex justify-end items-center cursor-pointer relative">
      <div
        v-if="isAllHovered"
        class="absolute -top-8 flex justify-center items-center w-32 h-8 px-2 bg-black rounded-md"
      >
        <span class="text-xs text-gray-200 font-semibold">{{ $t("pluginLogs.exportAll") }}</span>
      </div>

      <img
        class="w-6 h-6 hover:scale-110 active:scale-95 transition-all ease-in-out duration-150 select-none"
        :class="[isLoadingSpinning, { 'pointer-events-none opacity-50': nodeStore.isLogLoading }]"
        :src="loadingIconsClass"
        alt=""
        @mousedown.prevent
        @click="exportAllLogs"
        @mouseenter="isAllHovered = true"
        @mouseleave="isAllHovered = false"
      />
    </div>
    <div class="w-full h-full col-start-7 col-end-8 flex justify-start items-center cursor-pointer ml-2 relative">
      <div
        v-if="is150Hovered"
        class="absolute -top-8 flex justify-center items-center w-32 h-8 px-2 bg-black rounded-md"
      >
        <span class="text-xs text-gray-200 font-semibold">{{ $t("pluginLogs.export150") }}</span>
      </div>
      <img
        class="w-6 h-6 hover:scale-110 active:scale-95 transition-all ease-in-out duration-150 select-none"
        src="/img/icon/service-log-icons/150-log-export-button.png"
        alt=""
        @mousedown.prevent
        @click="exportLogs"
        @mouseenter="is150Hovered = true"
        @mouseleave="is150Hovered = false"
      />
    </div>
    <div
      class="w-full h-full col-start-8 col-span-full flex justify-center items-center border border-gray-400 rounded-md bg-gray-200"
    >
      <div class="w-8 flex justify-evenly items-center px-1 relative bg-gray-200 rounded-sm">
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        v-model="nodeStore.searchLogs"
        type="search"
        class="z-10 text-gray-700 text-sm rounded-full block w-full px-2 py-1 placeholder-gray-500 bg-transparent"
        placeholder="Search"
      />
    </div>
  </div>
</template>

<script setup>
import { useNodeStore } from "@/store/theNode";
import { ref, computed } from "vue";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["export-log", "export-all-log"]);

const nodeStore = useNodeStore();

const isAllHovered = ref(false);
const is150Hovered = ref(false);

const loadingIconsClass = computed(() => {
  return nodeStore.isLogLoading
    ? "/img/icon/loading-icons/loading-circle.png"
    : "/img/icon/service-log-icons/all-log-export-button.png";
});

const isLoadingSpinning = computed(() => {
  return nodeStore.isLogLoading ? "animate-spin" : "";
});

const exportAllLogs = () => {
  nodeStore.exportLogs = false;
  nodeStore.exportAllLogs = true;
  emit("export-all-log", props.client);
};

const exportLogs = () => {
  nodeStore.exportAllLogs = false;
  nodeStore.exportLogs = true;
  emit("export-log", props.client);
};
</script>
