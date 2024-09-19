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
    <div class="h-1/2 w-full justify-center items-center bg-orange-300 flex"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useControlStore } from "@/store/theControl";

const controlStore = useControlStore();

const isOpen = ref(false);

const deopdownHandler = () => {
  isOpen.value = !isOpen.value;
};

const servicePicker = (arg) => {
  arg === "vld" ? (controlStore.pickeedService = "vld") : (controlStore.pickeedService = "exeCons");
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
