<template>
  <div class="w-full h-full flex flex-col justify-between items-center pt-1">
    <div class="w-full flex flex-col justify-between items-center px-4 rounded-t-lg">
      <span class="text-md font-semibold text-gray-200 uppercase">Services</span>
      <div class="w-full flex justify-between items-center px-1 overflow-hidden">
        <img v-for="el in getServices" :key="el.name" class="w-5" :src="el.sIcon" alt="icon" />
      </div>
    </div>

    <ServiceBody @open-expert="openExpert" @open-logs="openLogs" />
  </div>
</template>
<script setup>
import ServiceBody from "../components/service/ServiceBody.vue";
import { useServices } from "@/store/services";
import { computed } from "vue";

const emit = defineEmits(["openExpert", "openLogs"]);

const serviceStore = useServices();

const getServices = computed(() => {
  let service;
  service = serviceStore.installedServices.filter((el) => el?.category === "service");
  return service;
});

const openExpert = (item) => {
  emit("openExpert", item);
};

const openLogs = (item) => {
  emit("openLogs", item);
};
</script>
