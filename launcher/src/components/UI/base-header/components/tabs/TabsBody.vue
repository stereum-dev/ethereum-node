<template>
  <div class="col-start-3 col-end-13 grid grid-cols-3 items-center gap-x-2">
    <SingleTab v-for="tab in tabs" :key="tab.page" :tab="tab" />
  </div>
</template>

<script setup>
import SingleTab from "./SingleTab.vue";
import { ref } from "vue";

const tabs = ref([
  { page: "Node", path: "/node", relativePath: "/edit" },
  { page: "Control", path: "/control" },
  { page: "Staking", path: "/staking" },
]);
</script>
