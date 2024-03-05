<template>
  <div class="col-span-1 row-start-1 row-end-2 z-10 flex">
    <Listbox v-model="selectedfilter">
      <div class="w-full relative mt-1">
        <ListboxButton class="relative w-full cursor-default rounded-md bg-gray-200 p-1 text-left shadow-md text-sm">
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
          </span>
          <span class="block truncate">{{ selectedfilter.name }}</span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
          >
            <ListboxOption
              v-for="filter in filters"
              v-slot="{ active, selected }"
              :key="filter.name"
              :value="filter"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-gray-300 text-cyan-500' : 'text-gray-900',
                  'flex justify-center cursor-default select-none p-1',
                ]"
              >
                <span v-if="selected" class="flex items-center text-cyan-600">
                  <CheckIcon class="h-3 w-3" aria-hidden="true" />
                </span>
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ filter.name }}</span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
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

const selectedfilter = ref(filters[0]);

serviceStore.filteredServices = computed(() => {
  if (selectedfilter.value.name.toLowerCase() === "all") {
    return serviceStore.allServices.filter(getFilterbyNetwork());
  } else {
    return serviceStore.allServices
      .filter((item) => item.category.toLowerCase() === selectedfilter.value.name.toLowerCase())
      .filter(getFilterbyNetwork());
  }
});
const getFilterbyNetwork = () => {
  switch (manageStore.configNetwork.network) {
    case "mainnet":
    case "goerli":
      return (item) => archFilter(item.service);
    case "holesky":
      return (item) => item.service != archFilter(item.service);
    case "sepolia":
      return (item) => item.service != "SSVNetworkService" && archFilter(item.service);
    case "gnosis":
      return (item) =>
        /(Lighthouse|Teku|Nethermind|Erigon|Grafana|Prometheus)/.test(item.service) && archFilter(item.service);
    default:
      return (item) => item.service != "SSVNetworkService" && archFilter(item.service);
  }
};
const archFilter = (service) => {
  const armArchs = ["arm", "arm64", "aarch64_be", "aarch64", "armv8b", "armv8l"];
  return armArchs.includes(manageStore.architecture)
    ? !/(Prysm|ValidatorEjector|KeysAPI|Notification)/.test(service)
    : true;
};
</script>
