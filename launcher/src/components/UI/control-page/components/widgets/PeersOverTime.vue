<template>
  <div class="peers-over-time_parent flex w-full h-full justify-center items-center">
    <div class="peers-over-time_ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="peers-over-time_ico_container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/peersovertime.png" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-[40%] font-semibold uppercase">Peers over time</span>
    </div>
    <div class="peers-over-time_part w-3/4 h-full flex justify-start items-start">
      <apex-chart :options="chartOptions" :series="chartOptions.series" class="fullSizeChart"></apex-chart>
    </div>
    <div class="iconss w-1/4 h-full bg-blue-500"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  components: {
    ApexChart: VueApexCharts,
  },
  data() {
    return {
      chartOptions: {
        series: [
          {
            name: "Series 1",
            data: [10, 20, 10, 40, 30, 50, 40, 22, 38, 41], // Adjusted for 10 values
          },
        ],
        chart: {
          type: "line",
          height: "100%",
          toolbar: {
            show: false,
          },
          animations: {
            enabled: false,
          },
          parentHeightOffset: 0, // Ensures the chart takes up the full height
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: true,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        grid: {
          show: true,
          borderColor: "gray",
          strokeDashArray: 5,
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
          padding: {
            top: -20,
            right: 0,
            bottom: 5,
            left: 0,
          },
        },
        stroke: {
          width: 1,
          colors: ["#00ff00"],
        },
        tooltip: {
          enabled: false,
        },
      },
    };
  },
});
</script>

<style scoped>
.fullSizeChart {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
