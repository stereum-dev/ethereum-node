<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full pt-1 mt-1">
    <ServiceBody @open-expert="openExpert" @open-logs="openLogs" />
  </div>
</template>

<script setup>
import ServiceBody from "../components/service/ServiceBody.vue";

const emit = defineEmits(["openExpert", "openLogs"]);

const openExpert = (item) => {
  emit("openExpert", item);
};

const openLogs = (item) => {
  emit("openLogs", item);
};
</script>
