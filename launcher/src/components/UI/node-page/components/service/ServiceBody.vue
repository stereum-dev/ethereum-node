<template>
  <div class="w-full h-[430px] rounded-md border border-gray-600 bg-[#151618] grid grid-cols-6 grid-rows-15">
    <div
      class="col-start-1 col-span-full row-start-1 row-span-1 w-full mx-auto flex justify-center items-center h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px]"
    >
      <span v-if="setupStore.isConfigViewActive" class="text-xs text-gray-300 text-center font-sans">Config Services </span>
      <span v-else class="text-xs text-gray-300 text-center font-sans">Server Services </span>
    </div>
    <div
      ref="service"
      class="col-start-1 col-span-full row-start-2 row-span-full flex flex-col justify-start space-y-1 items-center overflow-x-hidden overflow-y-auto scrollbar scrollbar-rounded-* hover:scrollbar-thumb-teal-800 scrollbar-track-transparent px-1"
    >
      <div v-if="loadingClients" class="space-y-3">
        <ServiceSkeleton v-for="i in skeletons" :key="i" />
      </div>

      <div
        v-for="item in getServices"
        :key="item"
        class="h-[90px] w-full grid grid-cols-2 grid-rows-5 items-center rounded-md border border-gray-700 border-t-0"
      >
        <ClientStatus :client="item" />
        <div
          class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-3 grid-rows-2 bg-[#212629] shadow-md mx-auto"
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
  </div>
</template>

<script setup>
import { useStateHandler, useRestartService } from "@/composables/services";
import { useServices } from "@/store/services";
import ServiceLayout from "./ServiceLayout.vue";
import ServiceButtons from "./ServiceButtons.vue";
import ClientStatus from "./ClientStatus.vue";
import ServiceSkeleton from "./ServiceSkeleton.vue";
import { computed, ref, watchEffect } from "vue";
import { useNodeStore } from "@/store/theNode";
import { useSetups } from "../../../../../store/setups";

const emit = defineEmits(["openExpert", "openLogs"]);

const serviceStore = useServices();
const nodeStore = useNodeStore();
const setupStore = useSetups();

const skeletons = [1, 2, 3, 4];
const loadingClients = ref(false);

const getServices = computed(() => {
  let services = serviceStore.installedServices.filter((e) => e.category === "service").sort((a, b) => a.name.localeCompare(b.name));

  if (!setupStore.isConfigViewActive) {
    const seen = new Set();
    services = services.filter((service) => {
      if (setupStore.serverServices.includes(service.service)) {
        if (!seen.has(service.service)) {
          seen.add(service.service);
          return true;
        }
        return false; // Exclude duplicate
      }
      return false; // services not in serverServices
    });
  } else {
    services = services.filter(
      (service) => !setupStore.serverServices.includes(service.service) && service.setupId === setupStore.selectedSetup?.setupId
    );
  }

  return services;
});

watchEffect(() => {
  if (nodeStore.skeletonLoading || serviceStore.installedServices.length === 0) {
    loadingClients.value = true;
  } else {
    loadingClients.value = false;
  }
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
