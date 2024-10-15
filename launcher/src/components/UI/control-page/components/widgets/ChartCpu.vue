<template>
  <div
    class="theCpuParent flex w-full h-full justify-center items-center"
    @mouseenter="footerStore.cursorLocation = t('controlPage.cpuUsageIs', { usage: cpu })"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <div class="cpuIco w-1/3 h-full flex flex-col justify-center items-center">
      <div class="cpuIco-container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/cpuIcon.svg" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase">CPU</span>
    </div>
    <div v-if="chartSeries && chartOptions" class="cpuCountPart w-2/3 h-full flex justify-center items-center">
      <VueApexCharts v-if="chartSeries" :options="chartOptions" :series="chartSeries" class="full-size-chart" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
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

const chartSeries = computed(() => [{ name: "CPU Usage", data: chartData.value }]);

const chartOptions = {
  chart: {
    type: "area",
    width: "100%",
    height: "100%",
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: "linear",
      dynamicAnimation: { speed: 1000 },
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
    padding: { top: -5, bottom: -5 },
  },
  stroke: { width: 1, colors: ["#00ff00"] },
  markers: { size: 0 },
  dataLabels: { enabled: false },
  tooltip: { enabled: false },
};

const cpuTemp = computed(() => (controlStore.cpuTemp ? controlStore.cpuTemp.toFixed(2) : null));

watch(cpuTemp, () => {
  console.log(cpuTemp.value);
});

const updateChartData = () => {
  const currentTime = Date.now();
  chartData.value.push([currentTime, cpu.value]);

  if (chartData.value.length > 10) {
    chartData.value.shift();
  }
};

onMounted(() => {
  pollingInterval = setInterval(updateChartData, 1000);
  console.log(cpuTemp.value);
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
