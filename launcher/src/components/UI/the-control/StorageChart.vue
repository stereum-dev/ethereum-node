<template>
  <DoughnutChart
    :chart-data="data"
    :options="options"
    css-classes="chart-container"
  />
</template>

<script setup>
import pattern from "patternomaly";
import { ref, computed } from "vue";
import { DoughnutChart } from "vue-chart-3";
import { Chart, DoughnutController, ArcElement } from "chart.js";
Chart.register(DoughnutController, ArcElement);
const dataValues = ref([524, 159, 260, 30, 20, 70]);
const data = computed(() => ({
  labels: ["Free", "Stereum", "Geth", "Lighthouse", "Grafna", "prometheus"],
  datasets: [
    {
      data: dataValues.value,
      backgroundColor: [
        "#fbe750",
        "#16578f",
        "#f15562",
        "#14af4a",
        "#ef5021",
        "#14a0db",
      ],
    },
  ],
}));
const options = ref({
  plugins: {
    title: {
      text: "STORAGE SPACE",
    },
  },
});
</script>
