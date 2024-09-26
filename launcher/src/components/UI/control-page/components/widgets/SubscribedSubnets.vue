<template>
  <div class="peers-over-time_parent flex w-full h-full justify-center items-center">
    <div class="peers-over-time_ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="peers-over-time_ico_container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/SubnetSubscriptions.png" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-center text-gray-200 text-[40%] font-semibold uppercase"
        >SUBSCRIBED SUBNETS</span
      >
    </div>
    <div class="peers-over-time_part w-3/4 h-full flex justify-start items-start">
      <apex-chart :options="chartOptions" :series="chartOptions.series" class="fullSizeChart"></apex-chart>
    </div>
    <div class="iconss w-1/4 h-full flex justify-center flex-col gap-1">
      <div class="service-icon" :style="{ background: selectedService == consensus ? '#94DEFF' : '' }" @click="selectService(consensus)">
        <img
          :class="currentConsensusIcon == '' ? 'animate-spin' : ''"
          :src="currentConsensusIcon == '' ? '/img/icon/loading-icons/loading-circle.png' : currentConsensusIcon"
          alt="consensus"
        />
      </div>
      <div class="service-icon" :style="{ background: selectedService == execution ? '#94DEFF' : '' }" @click="selectService(execution)">
        <img
          :class="currentExecutionIcon == '' ? 'animate-spin' : ''"
          :src="currentExecutionIcon == '' ? '/img/icon/loading-icons/loading-circle.png' : currentExecutionIcon"
          alt="execution"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useControlStore } from "@/store/theControl";
import { mapState } from "pinia";

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
            bottom: 0,
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
      selectedService: "consensus",
      consensus: "consensus",
      execution: "execution",
    };
  },
  computed: {
    ...mapState(useControlStore, {
      currentConsensusIcon: "currentConsensusIcon",
      currentExecutionIcon: "currentExecutionIcon",
    }),
  },
  methods: {
    selectService(service) {
      console.log(service);
      this.selectedService = service;
    },
  },
});
</script>

<style scoped>
.service-icon {
  width: 90%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #232222;
  border-radius: 10px;
  margin: 1.2px;
  border: 1px solid #232222;
  box-shadow: 1px 1px 5px 1px #171717;
  cursor: pointer;
}
.service-icon img {
  width: 1.5rem;
  height: 1.5rem;
}
.service-icon:hover {
  background: #313131;
  border: 1px solid #c1c1c1;
  box-shadow: none;
}
.service-icon:active {
  background: #313131;
  border: none;
  box-shadow: inset 1px 1px 5px 1px #171717;
}

.fullSizeChart {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
