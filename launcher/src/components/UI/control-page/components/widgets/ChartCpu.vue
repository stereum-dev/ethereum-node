<template>
  <div class="theCpuParent flex w-full h-full justify-center items-center relative">
    <div class="cpuIco w-1/3 h-full flex flex-col justify-center items-center">
      <div class="cpuIco-container flex justify-center items-center w-full h-4/5 relative p-2">
        <img
          class="w-3/4"
          src="/img/icon/control-page-icons/cpuIcon.svg"
          :style="{
            filter:
              controlStore.tempCPU === null || controlStore.tempCPU === undefined || controlStore.tempCPU === ''
                ? ''
                : tempCPU === 'green'
                  ? 'invert(40%) sepia(90%) saturate(500%) hue-rotate(90deg)'
                  : tempCPU === 'yellow'
                    ? 'invert(45%) sepia(90%) saturate(500%) hue-rotate(0deg) brightness(150%)'
                    : tempCPU === 'orange'
                      ? 'invert(20%) sepia(80%) saturate(500%) hue-rotate(0deg) brightness(150%)'
                      : 'invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)',
          }"
        />
        <span
          v-if="controlStore.tempCPU !== null || controlStore.tempCPU !== undefined"
          class="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-gray-200 text-2xs font-semibold"
          >{{ controlStore.tempCPU }}</span
        >
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase">cpu</span>
    </div>
    <div v-if="chartSeries && chartOptions" class="cpuCountPart w-2/3 h-full flex justify-start items-center pr-1">
      <VueApexCharts v-if="chartSeries" :options="chartOptions" :series="chartSeries" class="full-size-chart" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const controlStore = useControlStore();
const footerStore = useFooter();

const cpu = computed(() => controlStore.cpu);
const chartData = ref([]);
let pollingInterval;
// const loader= ref(false);

const chartSeries = computed(() => [
  {
    name: "CPU Usage",
    data: chartData.value?.length ? chartData.value : [[Date.now(), 0]],
  },
]);

const chartOptions = {
  chart: {
    type: "area",
    width: "100%",
    height: "100%",
    toolbar: { show: false },

    zoom: { enabled: false },
    animations: {
      enabled: false,
      easing: "linear",
      dynamicAnimation: { speed: 0 },
    },
  },
  xaxis: {
    type: "datetime",
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
    tooltip: { enabled: false },
    crosshairs: { show: false },
  },
  yaxis: {
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
    min: 0,
    max: 100,
  },
  grid: {
    borderColor: "gray",
    strokeDashArray: 5,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
    padding: { top: -8, bottom: -8, left: -5, right: -5 },
  },
  stroke: { width: 1, colors: ["#00ff00"] },
  fill: {
    type: "solid",
    opacity: 0.1,
    colors: ["#00ff00"],
  },
  markers: { size: 0 },
  tooltip: {
    enabled: true,
    custom: function ({ seriesIndex, dataPointIndex, w }) {
      const hoveredData = w.config.series[seriesIndex].data[dataPointIndex];
      const value = hoveredData[1];
      const time = hoveredData[0];

      footerStore.cursorLocation = `${t("controlPage.cpuUsageIs", {
        usage: value,
        time: new Date(time).toLocaleTimeString(),
      })}`;
      return ``;
    },
  },
  dataLabels: { enabled: false },
};

const tempCPU = computed(() => {
  if (controlStore.tempCPU == null || controlStore.tempCPU === undefined) return ""; // No color for undefined/null
  if (controlStore.tempCPU >= 75) return "red"; // Red for CPU >= 80
  if (controlStore.tempCPU >= 60) return "orange";
  if (controlStore.tempCPU >= 35) return "yellow";
  if (controlStore.tempCPU >= 0) return "green";
  return "";
});

const updateChartData = () => {
  const currentTime = Date.now();
  chartData.value.push([currentTime, cpu.value]);

  if (chartData.value?.length > 200) {
    chartData.value.shift();
  }
};

onMounted(() => {
  pollingInterval = setInterval(updateChartData, 1000);
  // setupStore.fetchControlData();
});

onBeforeUnmount(() => {
  clearInterval(pollingInterval);
});
</script>
<style scoped>
.full-size-chart {
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
