<template>
  <div class="w-full mt-8 mx-auto px-4">
    <div class="w-full h-[240px] overflow-y-auto rounded-md">
      <div class="grid grid-cols-2 gap-y-4 p-4 items-center">
        <template v-for="service in sortedServices" :key="service.service">
          <div class="col-start-1 col-end-2 flex items-center">
            <img src="/img/icon/edit-node-icons/setting.png" alt="Gear" class="w-6 h-6 mr-2" />
            <span class="text-sm uppercase text-gray-300">{{ service.category }} Client</span>
          </div>
          <div class="col-start-2 col-span-full grid grid-cols-4 items-center">
            <img :src="service.icon" alt="Service Icon" class="col-start-1 col-span-1 w-8 h-8" />
            <span class="col-start-2 col-span-full text-sm font-semibold text-gray-300">{{ service.service }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted } from "vue";
import { useServices } from "@/store/services";
import { useSetups } from "../../../../../../../store/setups";

const serviceStore = useServices();
const setupStore = useSetups();

const categoryOrder = {
  execution: 1,
  consensus: 2,
  validator: 3,
};

const sortServices = (a, b) => {
  if (a.category !== b.category) {
    return categoryOrder[a.category] - categoryOrder[b.category];
  }
  return a.service.localeCompare(b.service);
};

const sortedServices = computed(() => {
  return serviceStore.allServices
    .filter(
      (service) =>
        service.service === "GethService" || service.service === "PrysmBeaconService" || service.service === "PrysmValidatorService"
    )
    .sort(sortServices);
});

onUnmounted(() => {
  setupStore.devnetConfigData.services = sortedServices.value;
});
</script>
