<template>
  <div class="select-service-widget-parent flex flex-col w-full h-full justify-center items-center">
    <div class="h-1/2 w-full justify-center items-center flex p-1">
      <div class="selector-services w-full h-full flex rounded-md border border-gray-500" @click="deopdownHandler">
        <div class="selected-service-name flex justify-center items-center w-[90%] h-full text-gray-200 text-2xs font-semibold uppercase">
          {{ controlStore.pickeedService === "exeCons" ? "EXECUTION & CONSENSUS CLIENTS" : "VALIDATOR CLIENT" }}
        </div>
        <div class="arrow-box flex justify-center items-center w-[10%] h-full text-gray-200 text-lg font-semibold uppercase">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-3 w-3 text-white self-center col-span-1 transform transition-transform duration-200 ease-in-out"
            :class="[isOpen ? 'rotate-180' : 'rotate-0']"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <Transition
        enter-active-class="transform transition duration-500 ease-custom"
        enter-class="-translate-y-1/2 scale-y-0 opacity-0"
        enter-to-class="translate-y-0 scale-y-100 opacity-100"
        leave-active-class="transform transition duration-300 ease-custom"
        leave-class="translate-y-0 scale-y-100 opacity-100"
        leave-to-class="-translate-y-1/2 scale-y-0 opacity-0"
      >
        <div
          v-if="isOpen"
          class="absolute top-[25%] z-20 min-h-20 mt-1 origin-top-right shadow-md bg-gray-200 transition-all duration-100 divide-y divide-gray-600 shadow-black rounded-md p-1 w-[24%]"
        >
          <div
            class="p-2 bg-gray-200 capitalize transition-colors duration-300 transform text-gray-600 hover:bg-blue-300 hover:text-gray-700 cursor-pointer text-2xs font-bold"
            @click="servicePicker('exeCons')"
          >
            <span class="col-start-1 col-span-full self-center text-left text-xs font-semibold overflow-hidden truncate font-sans uppercase"
              >EXECUTION & CONSENSUS CLIENTS</span
            >
          </div>
          <div
            class="p-2 bg-gray-200 capitalize transition-colors duration-300 transform text-gray-600 hover:bg-blue-300 hover:text-gray-700 cursor-pointer font-bold overflow-hidden truncate grid grid-cols-6 gap-x-1"
            @click="servicePicker('vld')"
          >
            <span class="col-start-1 col-span-full self-center text-xs font-bold overflow-hidden truncate font-sans uppercase"
              >VALIDATOR CLIENT</span
            >
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="controlStore.pickeedService === 'vld'" class="h-1/2 w-full flex justify-center items-center">
      <div
        v-if="filteredValidatorServices.length > 1"
        class="right-arro w-1/10 h-full flex justify-center items-center cursor-pointer"
        @click="prev"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-3 w-3 text-white self-center col-span-1 transform transition-transform duration-200 ease-in-out rotate-90"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div class="validator-info w-4/5 h-full flex justify-center items-center">
        <div class="vld-icon h-full w-1/6 flex justify-center items-center">
          <img
            class="w-4/6"
            :src="!selectedValidatorService?.icon ? '/img/icon/stereum-icons/stereum-logo.png' : selectedValidatorService.icon"
            :alt="selectedValidatorService?.name ? 'Stereum' : selectedValidatorService?.name"
          />
        </div>
        <div class="vld-info h-full w-2/6 flex justify-center items-center flex-col">
          <div class="name-val h-full w-2/6 flex justify-center items-center text-2xs text-gray-200 font-semibold">
            {{ !selectedValidatorService?.name ? "" : selectedValidatorService.name }}
          </div>
          <div class="id-val h-full w-2/6 flex justify-center items-center text-[40%] text-gray-200">
            {{ !selectedValidatorService?.config.serviceID ? "" : formatServiceId(selectedValidatorService?.config.serviceID) }}
          </div>
        </div>
        <div class="vld-keys h-1/2 w-2/6 flex justify-center items-center text-gray-200 text-lg font-semibold uppercase">
          {{ formattedValidatorNo }}
        </div>
        <div class="key-icon h-full w-1/6 flex justify-center items-center">
          <img class="w-4/6" src="/img/icon/control-page-icons/key-eth.svg" alt="key" />
        </div>
      </div>
      <div
        v-if="filteredValidatorServices.length > 1"
        class="right-arro w-1/10 h-full flex justify-center items-center cursor-pointer"
        @click="next"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-3 w-3 text-white self-center col-span-1 transform transition-transform duration-200 ease-in-out rotate-[270deg]"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <div v-else class="h-1/2 w-full flex justify-center items-center">
      <div class="right-arro w-1/10 h-full flex justify-center items-center cursor-pointer">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-3 w-3 text-white self-center col-span-1 transform transition-transform duration-200 ease-in-out rotate-90"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div class="pairs-info w-4/5 h-full flex justify-center items-center">
        <div class="exec-info w-1/2 h-full flex justify-center items-center flex-col">
          <div class="exec-name w-full h-1/2 flex justify-center items-center text-2xs text-gray-200 font-semibold">Lorem.</div>
          <div class="exec-id w-full h-1/2 flex justify-center items-center text-[40%] text-gray-200">Lorem ipsum dolor sit.</div>
        </div>
        <div class="cons-info w-1/2 h-full flex justify-center items-center flex-col">
          <div class="cons-name w-full h-1/2 flex justify-center items-center text-2xs text-gray-200 font-semibold">Lorem.</div>
          <div class="cons-id w-full h-1/2 flex justify-center items-center text-[40%] text-gray-200">Lorem ipsum dolor sit.</div>
        </div>
      </div>
      <div class="right-arro w-1/10 h-full flex justify-center items-center cursor-pointer">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-3 w-3 text-white self-center col-span-1 transform transition-transform duration-200 ease-in-out rotate-[270deg]"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useControlStore } from "@/store/theControl";
import { useSetups } from "@/store/setups";
import { useStakingStore } from "@/store/theStaking";

const controlStore = useControlStore();
const setupStore = useSetups();
const stakingStore = useStakingStore();

const formattedValidatorNo = computed(() => {
  return stakingStore.keys.length.toString().padStart(3, "0");
});

const isOpen = ref(false);

const deopdownHandler = () => {
  isOpen.value = !isOpen.value;
};

const servicePicker = (arg) => {
  arg === "vld" ? (controlStore.pickeedService = "vld") : (controlStore.pickeedService = "exeCons");
  isOpen.value = !isOpen.value;
};

const filteredValidatorServices = computed(() => {
  if (!setupStore.selectedSetup || !setupStore.selectedSetup.services) {
    return [];
  }

  return setupStore.selectedSetup.services.filter((service) => service.category === "validator");
});

const currentIndex = ref(0);

const prev = () => {
  if (!filteredValidatorServices.value.length) return; // If no services, do nothing
  currentIndex.value = (currentIndex.value - 1 + filteredValidatorServices.value.length) % filteredValidatorServices.value.length;
};

const next = () => {
  if (!filteredValidatorServices.value.length) return; // If no services, do nothing
  currentIndex.value = (currentIndex.value + 1) % filteredValidatorServices.value.length;
};

// This computed property will return the currently selected service based on currentIndex
const selectedValidatorService = computed(() => {
  return filteredValidatorServices.value.length ? filteredValidatorServices.value[currentIndex.value] : null;
});

const formatServiceId = (id) => {
  if (!id || id.length < 7) return id; // Return as-is if ID is too short
  return `${id.slice(0, 5)}...${id.slice(-5)}`;
};
</script>

<style scoped>
.ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
