<template>
  <div class="rpc-recieved-parent w-full h-full flex justify-center items-center flex-col relative">
    <div class="widget-name w-full h-1/5 flex justify-center items-center text-gray-200 uppercase font-semibold text-[55%]">
      RPC RECEIVED OVER TIME
    </div>
    <div v-if="chartOptions && chartSeries" class="widget-box w-full h-4/5 justify-center items-center flex flex-col">
      <VueApexCharts :options="chartOptions" :series="chartSeries" class="fullSizeChart"></VueApexCharts>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useSetups } from "@/store/setups";
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
// import NoData from "./NoData.vue";

const t = i18n.global.t;

const footerStore = useFooter();
const setupStore = useSetups();
const controlStore = useControlStore();
const chartData = ref([]);
let pollingInterval = null;

const chartSeries = computed(() => [
  {
    name: "Subnet Subscriptions",
    data: chartData.value,
  },
]);

const chartOptions = {
  chart: {
    type: "line",
    width: "100%",
    height: "100%",
    zoom: { enabled: false },
    toolbar: { show: false },
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
    crosshairs: {
      show: false,
    },
  },
  yaxis: {
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  grid: {
    borderColor: "gray",
    strokeDashArray: 5,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
    padding: { top: -10, bottom: -10, left: -5, right: 5 },
  },
  stroke: { width: 1, colors: ["#00ff00"] },
  markers: { size: 0 },
  tooltip: {
    enabled: true,
    custom: function ({ seriesIndex, dataPointIndex, w }) {
      const hoveredData = w.config.series[seriesIndex].data[dataPointIndex];
      const value = hoveredData[1];

      footerStore.cursorLocation = `${t("controlPage.connectedSubnets", {
        isAre: value === 1 || value === 0 ? "is" : "are",
        count: value,
      })}`;
      return ``;
    },
  },
  dataLabels: { enabled: false },
};

const subnetData = async () => {
  const serviceId = setupStore.selectedServicePairs?.consensusService?.id;

  if (!serviceId) return;

  const subnetSubs = Array.isArray(controlStore.subnetSubs?.data)
    ? controlStore.subnetSubs.data // Use subnetSubs.data instead of subnetSubs
    : [];

  const customerDetails = subnetSubs.find((item) => item.serviceId === serviceId);

  const subnetCount = customerDetails?.subnetCount || 0;

  const currentTime = new Date().getTime();

  chartData.value.push([currentTime, subnetCount]);

  if (chartData.value.length > 5) {
    chartData.value.shift();
  }
};

onMounted(() => {
  pollingInterval = setInterval(subnetData, 1000);
});

onBeforeUnmount(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
.fullSizeChart {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
