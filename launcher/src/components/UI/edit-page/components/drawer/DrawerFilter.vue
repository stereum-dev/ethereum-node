<template>
  <div class="col-start-1 col-span-full row-start-2 row-span-1 z-10 flex">
    <div class="w-full relative mt-1">
      <button class="relative w-full cursor-default rounded-md bg-gray-200 p-1 text-left shadow-md text-sm" @click="toggleDropdown">
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
        </span>
        <span class="block truncate text-center capitalize">{{ selectedFilter }}</span>
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
            @click="selectFilter(filter.name)"
          >
            <span v-if="selectedFilter === filter.name" class="flex items-center text-cyan-600">
              <CheckIcon class="h-3 w-3" aria-hidden="true" />
            </span>
            <span
              class="block truncate capitalize"
              :class="{
                'font-medium': selectedFilter === filter.name,
                'font-normal': selectedFilter !== filter.name,
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
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useSetups } from "../../../../../store/setups";

const filters = [{ name: "all" }, { name: "execution" }, { name: "consensus" }, { name: "validator" }, { name: "service" }];

const serviceStore = useServices();
const setupStore = useSetups();
const manageStore = useNodeManage();
const selectedFilter = ref(filters[0].name);
const isOpen = ref(false);
const currentNetwork = ref(null);

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectFilter = (filter) => {
  selectedFilter.value = filter;
  isOpen.value = false;
};

const archFilter = (service) => {
  const armArchs = ["arm", "arm64", "aarch64_be", "aarch64", "armv8b", "armv8l"];

  return armArchs.includes(manageStore.architecture) ? !/(Prysm|ValidatorEjector|KeysAPI|Notification)/.test(service.service) : true;
};

const networkFilter = (service) => {
  switch (currentNetwork.value) {
    case "mainnet":
    case "hoodi":
    case "holesky":
      return true;
    case "sepolia":
      return service.service !== "SSVNetworkService" && service.service !== "SSVDKGService";
    case "gnosis":
      return /(Lighthouse|Teku|Nethermind|Erigon|Grafana|Prometheus)/.test(service.service);
    case "op-mainnet":
      return true;
    case "op-sepolia":
      return service.service !== "L2GethService";
    case "devnet":
      return;
    default:
      return service.service !== "SSVNetworkService";
  }
};

const determineCurrentNetwork = () => {
  const selectedNetwork = setupStore.selectedSetup?.network;

  if (selectedNetwork) {
    const foundNetwork = manageStore.networkList.find((network) => network.network === selectedNetwork);
    currentNetwork.value = foundNetwork ? foundNetwork.network : selectedNetwork === "devnet" ? selectedNetwork : null;
  }
};

// Computed
const networkArchFilteredServices = computed(() => {
  return serviceStore.allServices.filter((service) => {
    return networkFilter(service) && archFilter(service);
  });
});

const filteredServices = computed(() => {
  const filterName = selectedFilter.value ?? "all";
  return filterName === "all"
    ? networkArchFilteredServices.value
    : networkArchFilteredServices.value.filter((service) => service.category === filterName);
});

// Watchers

watch(
  [selectedFilter, networkArchFilteredServices],
  () => {
    serviceStore.filteredServices = filteredServices.value;
  },
  { immediate: true }
);

// Lifecycle Hooks
onMounted(() => {
  determineCurrentNetwork();
  serviceStore.filteredServices = filteredServices.value;
});

onUnmounted(() => {
  serviceStore.filteredServices = [];
});
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
