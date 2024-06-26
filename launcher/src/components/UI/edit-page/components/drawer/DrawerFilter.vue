<template>
  <div class="col-start-1 col-span-full row-start-2 row-span-1 z-10 flex">
    <div class="w-full relative mt-1">
      <button
        class="relative w-full cursor-default rounded-md bg-gray-200 p-1 text-left shadow-md text-sm"
        @click="toggleDropdown"
      >
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <ChevronUpDownIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
        </span>
        <span class="block truncate text-center">{{ selectedFilter.name }}</span>
      </button>
      <transition
        name="fade"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ul
          v-if="isOpen"
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
        >
          <li
            v-for="filter in filters"
            :key="filter.name"
            class="flex justify-center cursor-default select-none p-1 text-gray-900 hover:bg-gray-300"
            @click="selectFilter(filter)"
          >
            <span
              v-if="selectedFilter.name === filter.name"
              class="flex items-center text-cyan-600"
            >
              <CheckIcon class="h-3 w-3" aria-hidden="true" />
            </span>
            <span
              class="block truncate"
              :class="{
                'font-medium': selectedFilter.name === filter.name,
                'font-normal': selectedFilter.name !== filter.name,
              }"
            >
              {{ filter.name }}
            </span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/vue/20/solid";
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";

const filters = [
  { name: "All" },
  { name: "Execution" },
  { name: "Consensus" },
  { name: "Validator" },
  { name: "Service" },
];

const serviceStore = useServices();
const manageStore = useNodeManage();
const selectedFilter = ref(filters[0]);
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectFilter = (filter) => {
  selectedFilter.value = filter;
  isOpen.value = false;
};

const networkArchFilteredServices = computed(() => {
  return serviceStore.allServices.filter((service) => {
    return networkFilter(service) && archFilter(service);
  });
});

const filteredServices = () => {
  const filterName = selectedFilter.value?.name?.toLowerCase() ?? "all";
  return filterName === "all"
    ? networkArchFilteredServices.value
    : networkArchFilteredServices.value.filter(
        (service) => service.category.toLowerCase() === filterName.toLowerCase()
      );
};

onMounted(() => {
  serviceStore.filteredServices = filteredServices();
});

watch(selectedFilter, () => {
  serviceStore.filteredServices = filteredServices();
});

//serviceStore.filteredServices
//Methods

const networkFilter = (service) => {
  switch (manageStore.configNetwork.network) {
    case "mainnet":
      return (item) => archFilter(item.service);
    case "holesky":
      return service.service !== "SSVNetworkService";
    case "sepolia":
      return service.service !== "SSVNetworkService";
    case "gnosis":
      return /(Lighthouse|Teku|Nethermind|Erigon|Grafana|Prometheus)/.test(
        service.service
      );
    default:
      return service.service !== "SSVNetworkService";
  }
};

const archFilter = (service) => {
  const armArchs = ["arm", "arm64", "aarch64_be", "aarch64", "armv8b", "armv8l"];
  return armArchs.includes(manageStore.architecture)
    ? !/(Prysm|ValidatorEjector|KeysAPI|Notification)/.test(service.service)
    : true;
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
