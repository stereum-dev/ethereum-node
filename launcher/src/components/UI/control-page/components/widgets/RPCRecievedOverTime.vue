<template>
  <div class="rpc-recieved-parent w-full h-full flex justify-center items-center flex-col">
    <div class="widget-name w-full h-1/5 flex justify-center items-center text-gray-200 uppercase font-semibold text-[55%]">
      RPC RECEIVED OVER TIME
    </div>
    <div class="widget-box w-full h-4/5 justify-center items-center flex flex-col">
      <apex-chart :options="chartOptions" :series="chartOptions.series" class="fullSizeChart"></apex-chart>
    </div>
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
            name: "RPC Series 1",
            data: [10, 20, 10, 40, 30, 10, 20],
          },
          {
            name: "RPC Series 2",
            data: [5, 10, 5, 20, 15, 5, 10],
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
          parentHeightOffset: 0,
        },
        xaxis: {
          categories: ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
          labels: {
            show: false,
            style: {
              colors: "#ffffff",
            },
          },
          axisBorder: {
            show: false,
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
            right: 5,
            bottom: -5,
            left: -5,
          },
        },
        stroke: {
          width: 1,
          colors: ["#00ff00", "#ff0000"],
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          show: false, // Show series names in a minimal way
          labels: {
            colors: "#ffffff", // Adjust color to match your style
          },
        },
      },
    };
  },
});
</script>

<style scoped></style>
