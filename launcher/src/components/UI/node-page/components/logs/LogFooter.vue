<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-12 row-span-1 grid grid-cols-12 bg-[#2d3035] border-t border-gray-500 p-1">
    <div class="w-full h-full col-start-1 col-end-6 flex justify-center items-center space-x-2">
      <span class="text-sm text-gray-400 font-semibold">{{ $t("pluginLogs.serviceId") }}</span>
      <span class="text-amber-200 text-sm font-semibold">
        {{ client?.config?.serviceID }}
      </span>
    </div>
    <div class="buttonBox w-full h-full flex col-start-7 col-end-8">
      <div class="w-full h-full col-start-8 col-end-9 flex items-center cursor-pointer relative">
        <div
          v-if="isCustomLinesHovered && !isCustomLinesActive"
          class="absolute -top-8 flex justify-center items-center w-max h-8 px-2 bg-black rounded-md"
        >
          <span class="text-xs text-gray-200 font-semibold capitalize ml-3 mr-3"> export customized logs</span>
        </div>
        <div
          v-if="isCustomLinesActive && !isAllHovered && !is150Hovered"
          class="absolute -top-8 flex justify-center items-center w-max h-8 px-2 bg-black rounded-md"
        >
          <div
            v-if="!isExportCustomizedDate"
            class="kind-of-customize w-12 h-4/5 mr-2 rounded-md bg-slate-600 flex justify-center items-center text-xs text-gray-100 uppercase font-semibold active:scale-95 hover:bg-lime-900"
            @click="activeExportCustomizedDate"
          >
            date
          </div>
          <div
            v-if="!isExportCustomizedDate"
            class="kind-of-customize w-12 h-4/5 rounded-md flex justify-center items-center text-xs text-gray-100 uppercase font-semibold active:scale-95 hover:bg-lime-900"
            :class="isExportCustomizedLines ? 'bg-lime-900' : 'bg-slate-600'"
            @click="activeExportCustomizedLogs"
          >
            line
          </div>
          <label v-if="isExportCustomizedDate" for="kind-of-customize " class="text-gray-100 font-light text-xs uppercase mr-2">from</label>
          <input
            v-if="isExportCustomizedDate"
            v-model="sinceDate"
            type="date"
            class="kind-of-customize w-40 h-4/5 rounded-md flex justify-center items-center text-xs uppercase font-semibold mr-2"
            placeholder="since"
          />
          <label v-if="isExportCustomizedDate" for="kind-of-customize " class="text-gray-100 font-light text-xs uppercase mr-2">to</label>
          <input
            v-if="isExportCustomizedDate"
            v-model="untilDate"
            type="date"
            class="kind-of-customize w-40 h-4/5 rounded-md flex justify-center items-center text-xs uppercase font-semibold mr-2"
            placeholder="until"
          />
          <div
            v-if="isExportCustomizedDate"
            class="date-export-btn w-14 h-4/5 rounded-md flex justify-center items-center text-xs text-gray-100 uppercase font-semibold active:scale-95 bg-lime-900"
            @click="exportCustomizedLogs"
          >
            export
          </div>
        </div>
        <img
          class="w-6 h-6 hover:scale-110 active:scale-95 transition-all ease-in-out duration-150 select-none"
          :class="[customizedSpininng, { 'pointer-events-none opacity-50': nodeStore.is150Hovered }]"
          :src="loadingIconsClassCustomized"
          alt=""
          @mousedown.prevent
          @click="activeCustomLinesActive"
          @mouseenter="isCustomLinesHovered = true"
          @mouseleave="isCustomLinesHovered = false"
        />
      </div>
      <div class="w-full h-full col-start-6 col-end-7 flex items-center cursor-pointer relative">
        <div v-if="isAllHovered" class="absolute -top-8 flex justify-center items-center w-32 h-8 px-2 bg-black rounded-md">
          <span class="text-xs text-gray-200 font-semibold">{{ $t("pluginLogs.exportAll") }}</span>
        </div>

        <img
          class="w-6 h-6 hover:scale-110 active:scale-95 transition-all ease-in-out duration-150 select-none"
          :class="[isLoadingSpinning, { 'pointer-events-none opacity-50': nodeStore.isLogLoading }]"
          :src="loadingIconsClass"
          alt=""
          @mousedown.prevent
          @click="exportAllLogs('allLogs')"
          @mouseenter="isAllHovered = true"
          @mouseleave="isAllHovered = false"
        />
      </div>
      <div class="w-full h-full col-start-7 col-end-8 flex items-center cursor-pointer relative">
        <div v-if="is150Hovered" class="absolute -top-8 flex justify-center items-center w-32 h-8 px-2 bg-black rounded-md">
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
    </div>

    <div
      class="w-full h-full col-start-8 col-span-full flex justify-center items-center border border-gray-400 rounded-md bg-gray-200 relative"
    >
      <div v-if="!isExportCustomizedLines" class="w-8 flex justify-evenly items-center px-1 relative bg-gray-200 rounded-sm">
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
        v-model="searchLogsOrTail"
        :type="!isExportCustomizedLines ? 'search' : 'number'"
        class="z-10 text-gray-700 text-sm rounded-full block w-full px-2 py-1 placeholder-gray-500 bg-transparent"
        :placeholder="`${!isExportCustomizedLines ? 'Search' : 'Number of lines to export MAX=300.000'}`"
      />
      <div
        v-if="isExportCustomizedLines"
        class="exportBtn bg-lime-900 cursor-pointer w-20 h-3/4 rounded-md text-xs font-semibold text-gray-100 uppercase flex justify-center items-center active:scale-95 mr-2"
        @click="exportCustomizedLogs"
      >
        export
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNodeStore } from "@/store/theNode";
import { ref, computed, watch } from "vue";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["export-log", "export-all-log", "export-customized-logs"]);

const nodeStore = useNodeStore();

const isAllHovered = ref(false);
const is150Hovered = ref(false);
const isCustomLinesHovered = ref(false);
const isCustomLinesActive = ref(false);
const isExportCustomizedLines = ref(false);
const isExportCustomizedDate = ref(false);
const sinceDate = ref(null);
const untilDate = ref(null);

const loadingIconsClass = computed(() => {
  return nodeStore.isLogLoading ? "/img/icon/loading-icons/loading-circle.png" : "/img/icon/service-log-icons/all-log-export-button.png";
});

const loadingIconsClassCustomized = computed(() => {
  return nodeStore.isExportCustomizedDateLoading
    ? "/img/icon/loading-icons/loading-circle.png"
    : "/img/icon/service-log-icons/customized-log-export-button.png";
});

const isLoadingSpinning = computed(() => {
  return nodeStore.isLogLoading ? "animate-spin" : "";
});

const customizedSpininng = computed(() => {
  return nodeStore.isExportCustomizedDateLoading ? "animate-spin" : "";
});

const searchLogsOrTail = computed({
  get() {
    return !isExportCustomizedLines.value ? nodeStore.searchLogs : nodeStore.logTail;
  },
  set(value) {
    if (!isExportCustomizedLines.value) {
      nodeStore.searchLogs = value;
    } else {
      nodeStore.logTail = value;
    }
  },
});

watch([is150Hovered, isAllHovered], (value) => {
  if (value[0] || value[1]) {
    isCustomLinesActive.value = false;
    isExportCustomizedLines.value = false;
    isExportCustomizedDate.value = false;
    sinceDate.value = ref("");
    untilDate.value = ref("");
  }
});

watch([sinceDate, untilDate], () => {
  nodeStore.sinceDateParsDays = isNaN(daysUntilNow(sinceDate.value)) ? 0 : daysUntilNow(sinceDate.value);

  nodeStore.untilDateParsDays = isNaN(daysUntilNow(untilDate.value)) ? 0 : daysUntilNow(untilDate.value);
});

watch(isExportCustomizedLines, (value) => {
  if (value == true) {
    setTimeout(() => {
      isExportCustomizedLines.value = false;
      isCustomLinesActive.value = false;
      isExportCustomizedDate.value = false;
    }, 20000);
  }
});

const exportAllLogs = () => {
  nodeStore.isLogLoading = true;
  nodeStore.exportLogs = false;
  nodeStore.exportAllLogs = true;
  isCustomLinesActive.value = false;
  nodeStore.exportLogsType = "lines";
  emit("export-all-log", props.client);
  nodeStore.logTail = null;
};

const exportCustomizedLogs = () => {
  nodeStore.isExportCustomizedDateLoading = true;
  nodeStore.exportLogs = false;
  nodeStore.exportAllLogs = false;
  isCustomLinesActive.value = false;
  isExportCustomizedLines.value === true ? (nodeStore.exportLogsType = "lines") : (nodeStore.exportLogsType = "date");
  emit("export-customized-logs", props.client);
  nodeStore.logTail = null;
};

const activeExportCustomizedDate = () => {
  sinceDate.value = ref("");
  untilDate.value = ref("");
  isExportCustomizedDate.value = true;
  nodeStore.logTail = null;
};

const activeCustomLinesActive = () => {
  sinceDate.value = ref("");
  untilDate.value = ref("");
  nodeStore.logTail = null;
  isCustomLinesActive.value = !isCustomLinesActive.value;
};

const activeExportCustomizedLogs = () => {
  sinceDate.value = ref("");
  untilDate.value = ref("");
  isExportCustomizedLines.value = !isExportCustomizedLines.value;
};

const exportLogs = () => {
  nodeStore.exportAllLogs = false;
  nodeStore.exportLogs = true;
  emit("export-log", props.client);
};

function daysUntilNow(dateString) {
  const inputDate = new Date(dateString);
  if (isNaN(inputDate)) {
    return NaN;
  }
  const now = new Date();
  const diffTime = now - inputDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
</script>
