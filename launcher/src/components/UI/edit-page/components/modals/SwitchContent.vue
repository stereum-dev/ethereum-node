<template>
  <div class="w-2/3 flex flex-col justify-between items-center py-2 px-4 space-y-4 mx-auto mt-4">
    <div class="w-full flex flex-col justify-between items-center space-y-1">
      <span class="w-full text-left text-teal-700 font-normal">{{ $t("editModals.switchTo") }}</span>
      <div class="w-full relative">
        <button
          aria-expanded="false"
          class="w-full h-[40px] border border-gray-400 shadow-sm shadow-gray-600 rounded-md font-normal text-md text-gray-400 px-4 py-2 hover:brightness-110 flex items-center whitespace-nowrap space-x-4 justify-center"
          @click="switchDropdownOpen = !switchDropdownOpen"
        >
          <img v-if="properties.itemToInstall?.icon" class="w-6" :src="properties.itemToInstall?.sIcon" alt="Client Icon" />
          <span>{{ properties.itemToInstall ? properties.itemToInstall.name : `${$t("editModals.selectClient")}` }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 inline ml-1 absolute right-1 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-width="2" d="M5 10l7 7 7-7"></path>
          </svg>
        </button>
        <Transition name="slide">
          <ul
            v-show="switchDropdownOpen"
            class="transition-all max-h-[150px] duration-400 ease-in-out absolute bg-gray-600 rounded-lg shadow-lg py-2 w-full z-10 mt-1 divide-y divide-gray-500 overflow-x-hidden overflow-y-auto flex flex-col justify-start items-center"
          >
            <li
              v-for="service in getServices"
              :key="service.name"
              class="w-full grid grid-cols-6 px-4 hover:bg-blue-400"
              @click="switchService(service)"
            >
              <img class="col-start-3 w-7 self-center" :src="service.sIcon" alt="service Icon" />
              <span
                class="col-start-4 col-end-6 px-4 py-2 flex gap-2 justify-start items-center outline-0 whitespace-nowrap cursor-pointer text-sm text-gray-200 font-normal text-left"
                >{{ service.name }}</span
              >
            </li>
          </ul>
        </Transition>
      </div>
      <SyncCarousel
        v-if="
          isSyncingActived &&
          (client.category === 'execution' || client.category === 'consensus') &&
          !client.name.toLowerCase().includes('op')
        "
        :cat="client.category"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";
import SyncCarousel from "../edit/SyncCarousel.vue";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
  properties: {
    type: Object,
    default: null,
  },
});

//Refs
const isSyncingActived = ref(false);
const switchDropdownOpen = ref(false);

//Store
const serviceStore = useServices();
const setupStore = useSetups();
//Computed & Watcher
const getServices = computed(() => {
  if (setupStore.selectedSetup.network === "devnet") return [];

  const excludedOpServices = ["OpReth", "OpErigon", "OpGeth", "L2Geth", "OpNode"];
  const excludedService = props?.client?.name;
  const { network } = setupStore.selectedSetup;
  const { allServices } = serviceStore;

  if (network === "op-sepolia") {
    return allServices.filter((e) => ["OpReth", "OpErigon", "OpGeth"].includes(e.name) && e.name !== excludedService);
  }

  if (network === "op-mainnet") {
    return allServices.filter((e) => ["OpErigon", "OpGeth", "OpReth"].includes(e.name) && e.name !== excludedService);
  }

  return allServices.filter(
    (e) => e.category === props.client.category && e.name !== excludedService && !excludedOpServices.includes(e.name)
  );
});

//Methods

const switchService = (service) => {
  props.properties.itemToInstall = service;
  switchDropdownOpen.value = false;
  isSyncingActived.value = true;
};
</script>
<style scoped></style>
