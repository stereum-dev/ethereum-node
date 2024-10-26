<template>
  <div class="peers-over-time_parent flex w-full h-full justify-center items-center relative">
    <NoData v-if="loading" />
    <template v-else>
      <div class="peers-over-time_ico w-1/3 h-full flex flex-col justify-center items-center">
        <div class="peers-over-time_ico_container flex justify-center items-center w-full h-4/5">
          <img class="w-3/4" src="/img/icon/control-page-icons/PeertoPeerIcon.png" />
        </div>
        <span class="w-full h-1/5 flex justify-center items-center text-center text-gray-200 text-[40%] font-semibold uppercase">
          {{ t("controlPage.pOverTime") }}
        </span>
      </div>

      <div
        v-if="chartOptions && chartSeries"
        class="peers-over-time_part w-3/4 h-full flex justify-start items-start"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <VueApexCharts :options="chartOptions" :series="chartSeries" class="full-size-chart" />
      </div>

      <div v-if="setupStore.selectedServicePairs !== null" class="iconss w-1/5 h-full flex justify-center items-center flex-col gap-1">
        <div
          class="service-icon flex justify-center items-center w-8 p-1 rounded-md"
          :style="{ background: selectedService === 'consensus' ? '#94DEFF' : '' }"
          @click="selectService('consensus')"
        >
          <img :class="isServiceLoading('consensus') ? 'animate-spin' : ''" :src="getServiceIcon('consensus')" alt="consensus" />
        </div>

        <div
          class="service-icon flex justify-center items-center w-8 p-1 rounded-md"
          :style="{ background: selectedService === 'execution' ? '#94DEFF' : '' }"
          @click="selectService('execution')"
        >
          <img
            class="w-10"
            :class="isServiceLoading('execution') ? 'animate-spin' : ''"
            :src="getServiceIcon('execution')"
            alt="execution"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useControlStore } from "@/store/theControl";
import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import NoData from "./NoData.vue";

const t = i18n.global.t;
const controlStore = useControlStore();
const setupStore = useSetups();
const footerStore = useFooter();

const selectedService = ref("consensus");
const chartData = ref([]);
let pollingInterval = null;
const maxPeer = ref(100);
const loading = ref(true);

const chartSeries = computed(() => [
  {
    name: selectedService.value === "consensus" ? "Consensus Peers" : "Execution Peers",
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
    max: maxPeer.value,
    labels: {
      show: false,
    },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  grid: {
    borderColor: "gray",
    strokeDashArray: 5,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
    padding: { top: -25, bottom: -5, left: -5, right: -2 },
  },
  stroke: { width: 1, colors: ["#00ff00"], curve: "smooth" },
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

      const numPeer = hoveredData[2];

      footerStore.cursorLocation = `${t("controlPage.connectedPairs", {
        isAre: numPeer === 1 || numPeer === 0 ? "is" : "are",
        connected: numPeer,
        time: new Date(hoveredData[0]).toLocaleTimeString(),
      })}`;
      return "";
    },
  },
  dataLabels: { enabled: false },
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

const updateChartData = () => {
  const serviceType = selectedService.value;
  const serviceId = setupStore.selectedServicePairs?.[`${serviceType}Service`]?.id;

  if (!serviceId) return;

  const p2pData = Array.isArray(controlStore.p2pstatus?.data) ? controlStore.p2pstatus.data : [];

  const peerDetails = p2pData.find((pair) => pair.details[serviceType]?.serviceID === serviceId)?.details[serviceType];

  const maxPeerValue = peerDetails?.maxPeer || 100;
  const valPeer = peerDetails ? peerDetails.valPeer : 0;
  const numPeer = peerDetails?.numPeer || 0;
  const currentTime = new Date().getTime();

  maxPeer.value = maxPeerValue;
  chartData.value.push([currentTime, valPeer, numPeer]);

  if (chartData.value.length > 600) {
    chartData.value.shift();
  }
};

onMounted(() => {
  pollingInterval = setInterval(updateChartData, 1000);
  checkSelectedSetup();
});

onBeforeUnmount(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});

const selectService = (service) => {
  selectedService.value = service;
  chartData.value = [];
};

const isServiceLoading = (service) => !setupStore.selectedServicePairs?.[`${service}Service`]?.icon;

const getServiceIcon = (service) =>
  isServiceLoading(service)
    ? "/img/icon/loading-icons/loading-circle.png"
    : setupStore.selectedServicePairs?.[`${service}Service`]?.icon || "";
</script>

<style scoped>
.full-size-chart {
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
