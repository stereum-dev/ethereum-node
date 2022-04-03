<template>
  <LineChart
    :chart-data="data"
    :options="options"
    css-classes="chart-container"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import { LineChart } from "vue-chart-3";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);
const dataValues = ref([12, 144, 46, 18]);
const data = computed(() => ({
  labels: ["A", "B", "C", "D"],
  datasets: [
    {
      label: "CPU Load",
      data: dataValues.value,
      backgroundColor: "#345326",
    },
  ],
}));
const options = ref({
  plugins: {
    title: {
      text: "Line",
    },
  },
});
</script>
