<template>
  <div class="peers-over-time_parent flex w-full h-full justify-center items-center">
    <div class="peers-over-time_ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="peers-over-time_ico_container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/SubnetSubscriptions.png" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-center text-gray-200 text-[40%] font-semibold uppercase">
        {{ t("controlPage.subscribedSubnets") }}
      </span>
    </div>
    <div class="peers-over-time_part w-3/4 h-full flex justify-start items-start">
      <VueApexCharts :options="chartOptions" :series="chartSeries" class="fullSizeChart" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useSetups } from "@/store/setups";
import ControlService from "@/store/ControlService";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();
const setupStore = useSetups();
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
    padding: { top: -25, bottom: 20 },
  },
  stroke: { width: 1, colors: ["#00ff00"] },
  markers: { size: 5 },
  tooltip: {
    enabled: true,
    custom: function ({ seriesIndex, dataPointIndex, w }) {
      const hoveredData = w.config.series[seriesIndex].data[dataPointIndex];
      const value = hoveredData[1];

      footerStore.cursorLocation = `${t("controlPage.connectedSubnets", {
        isAre: value === 1 || value === 0 ? "is" : "are",
        count: value,
      })}`;
      return `<div style="padding:5px;">Subscribed Subnets: ${value}</div>`;
    },
  },
  dataLabels: { enabled: false },
};

const fetchSubnet = async () => {
  try {
    const subscriber = await ControlService.getSubnetSubs();

    if (subscriber && subscriber.data && Array.isArray(subscriber.data)) {
      const serviceId = setupStore.selectedServicePairs?.consensusService?.id;

      const subnetInfo = subscriber.data.find((item) => item.serviceId === serviceId);

      if (subnetInfo) {
        const subnetCount = subnetInfo.subnetCount || 0;
        const currentTime = new Date().getTime();

        chartData.value.push([currentTime, subnetCount]);

        if (chartData.value.length > 10) {
          chartData.value.shift();
        }
      }
    }
  } catch (error) {
    console.error("Error fetching subnet subscriptions", error);
  }
};

onMounted(() => {
  fetchSubnet();
  pollingInterval = setInterval(fetchSubnet, 1000);
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
