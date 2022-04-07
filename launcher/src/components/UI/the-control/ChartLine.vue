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
const dataValues = ref([
  12, 14, 16, 18, 11, 13, 15, 12, 14, 16, 18, 11, 13, 15,
]);
const data = computed(() => ({
  labels: [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ],
  datasets: [
    {
      label: "Foo",
      data: dataValues.value,
      backgroundColor: "green",
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
