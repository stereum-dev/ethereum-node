<template>
  <div class="peers-over-time_parent flex w-full h-full justify-center items-center">
    <NoData v-if="loading" />
    <template v-else>
      <div class="peers-over-time_ico w-1/4 h-full flex flex-col justify-center items-center">
        <div class="peers-over-time_ico_container flex justify-center items-center w-full h-3/4">
          <img class="w-4/5" src="/img/icon/control-page-icons/SubnetSubscriptions.png" />
        </div>
        <span class="w-full h-1/4 flex justify-center items-center text-center text-gray-200 text-[40%] font-semibold uppercase">
          {{ t("controlPage.subscribedSubnets") }}
        </span>
      </div>

      <div
        v-if="chartOptions && chartSeries"
        class="peers-over-time_part w-3/4 h-full flex justify-center items-center relative"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <VueApexCharts :options="chartOptions" :series="chartSeries" class="fullSizeChart" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useSetups } from "@/store/setups";
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import NoData from "./NoData.vue";

const t = i18n.global.t;

const footerStore = useFooter();
const setupStore = useSetups();
const controlStore = useControlStore();
const chartData = ref([]);
let pollingInterval = null;
const loading = ref(true);

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
    min: 0,
    max: 100,
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  grid: {
    borderColor: "gray",
    strokeDashArray: 5,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, bottom: 0, left: -5, right: 5 },
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

  if (chartData.value.length > 100) {
    chartData.value.shift();
  }
};
const checkSelectedSetup = () => {
  setTimeout(() => {
    setupStore?.selectedServicePairs ? (loading.value = false) : (loading.value = true);
  }, 1000);
};

watch(
  () => setupStore?.selectedServicePairs,
  () => {
    setupStore?.selectedServicePairs ? (loading.value = false) : (loading.value = true);
  }
);

onMounted(() => {
  pollingInterval = setInterval(subnetData, 1000);
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
