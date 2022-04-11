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
  12, 14, 16, 18, 11, 13, 15, 12, 14, 16, 18, 11, 13, 15, 12, 14, 16, 18, 11,
  13, 15, 12, 14, 16, 18, 11, 13, 15,
]);
const data = computed(() => ({
  labels: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  datasets: [
    {
      label: "Foo",
      data: dataValues.value,
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "#73f423",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 2,
    },
  ],
}));
const options = ref({
  plugins: {
    title: {
      text: "CPU Control",
    },
  },
});
</script>
