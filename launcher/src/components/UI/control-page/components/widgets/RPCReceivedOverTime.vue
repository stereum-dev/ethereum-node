<template>
  <div class="rpc-recieved-parent w-full h-full flex justify-center items-center flex-col relative">
    <NoData v-if="loading" />
    <template v-else>
      <div class="widget-name w-full h-1/5 flex justify-center items-center text-gray-200 uppercase font-semibold text-[55%]">
        RPC RECEIVED OVER TIME
      </div>
      <div v-if="chartOptions && chartSeries" class="widget-box w-full h-4/5 justify-center items-center flex flex-col">
        <VueApexCharts :options="chartOptions" :series="chartSeries" class="fullSizeChart"></VueApexCharts>
      </div>
    </template>
  </div>
</template>

<script setup>
import NoData from "./NoData.vue";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useSetups } from "@/store/setups";
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const loading = ref(true);

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
    type: "area",
    width: "100%",
    height: "100%",
    zoom: { enabled: false },
    toolbar: { show: false },
    animations: {
      enabled: false,
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

      footerStore.cursorLocation = `${t("controlPage.rpcDataReciv", {
        value: formattedValue(value),
        time: new Date(time).toLocaleTimeString(),
      })}`;
      return ``;
    },
  },
  dataLabels: { enabled: false },
};

const formattedValue = (value) => {
  return value >= 1000000 ? (value / 1000000000).toFixed(2) + " GB" : (value / 1000).toFixed(2) + " KB";
};

const rpcOverTimeData = async () => {
  const rpcPort = controlStore.rpcPort;

  if (!rpcPort) return;

  const rpcReceivedData = Array.isArray(controlStore?.rpcReceivedData) ? controlStore.rpcReceivedData : [];

  const rpcDetails = rpcReceivedData.find((item) => Number(item.srcPort) === Number(rpcPort));

  const rpcDataCount = rpcDetails?.receivedDataLength || 0;

  const currentTime = new Date().getTime();

  chartData.value.push([currentTime, rpcDataCount]);

  if (chartData.value.length > 200) {
    chartData.value.shift();
  }
};

const checkSelectedSetup = () => {
  setTimeout(() => {
    setupStore?.selectedServicePairs ? (loading.value = false) : (loading.value = true);
  }, 1000);
};

watch(
  () => setupStore.selectedServicePairs,
  () => {
    setupStore?.selectedServicePairs ? (loading.value = false) : (loading.value = true);
  }
);

onMounted(() => {
  pollingInterval = setInterval(rpcOverTimeData, 1000);
  checkSelectedSetup();
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
