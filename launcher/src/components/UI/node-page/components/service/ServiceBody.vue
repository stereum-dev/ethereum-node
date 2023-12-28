<template>
  <div
    class="w-full h-[430px] rounded-md border border-gray-600 bg-[#151618] relative hover:scroll-auto overflow-y-auto"
  >
    <div
      class="absolute inset-x-0 w-full mx-auto flex justify-center items-center h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] text-gray-200 text-[10px] font-semibold"
    >
      <span class="self-center">Services </span>
    </div>
    <div
      ref="service"
      style="padding-right: 0 !important"
      class="h-full max-h-[430px] flex flex-col space-y-4 items-center pt-2 px-1 overflow-x-hidden overflow-y-auto scrollbar scrollbar-rounded-* hover:scrollbar-thumb-teal-800 scrollbar-track-transparent"
    >
      <div
        v-for="item in getServices"
        :key="item"
        class="max-h-[70px] max-w-[160px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md mt-8"
      >
        <ServiceLayout :client="item" />
        <ServiceButtons
          :client="item"
          @handle-state="useStateHandler"
          @restart-service="useRestartService"
          @open-expert="openExpert(item)"
          @open-logs="openLogs"
          @open-docs="openDocs"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStateHandler, useRestartService } from "@/composables/services";
import { useServices } from "@/store/services";
import ServiceLayout from "./ServiceLayout.vue";
import ServiceButtons from "./ServiceButtons.vue";
import { computed } from "vue";

const emit = defineEmits(["openExpert", "openLogs"]);

const serviceStore = useServices();

const getServices = computed(() => {
  return serviceStore.installedServices
    .filter((e) => e.category === "service")
    .sort((a, b) => a.name.localeCompare(b.name));
});

const openExpert = (item) => {
  emit("openExpert", item);
};

const openDocs = (item) => {
  window.open(item.docsUrl, "_blank");
};

const openLogs = (item) => {
  emit("openLogs", item);
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
