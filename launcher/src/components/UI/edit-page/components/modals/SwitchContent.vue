<template>
  <div class="w-2/3 flex flex-col justify-between items-center py-2 px-4 space-y-4 mx-auto mt-4">
    <div class="w-full flex flex-col justify-between items-center space-y-1">
      <span class="w-11/12 text-left text-teal-700 font-semibold">{{ $t("editModals.switchTo") }}</span>
      <div class="w-full relative py-2">
        <button
          aria-expanded="false"
          class="w-11/12 h-[40px] mx-auto border border-gray-500 shadow-sm shadow-gray-600 rounded-md font-semibold text-lg text-gray-500 px-4 py-2 hover:brightness-110 flex items-center whitespace-nowrap space-x-2 justify-center relative"
          @click="switchDropdownOpen = !switchDropdownOpen"
        >
          <img v-if="properties.itemToInstall?.icon" class="w-6 h-6 mr-2" :src="properties.itemToInstall?.sIcon" alt="Client Icon" />
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
        <Transition name="slide-fade">
          <ul
            v-show="switchDropdownOpen"
            class="right-4 transition-all max-h-[200px] duration-400 ease-in-out absolute bg-gray-700 rounded-lg shadow-lg pt-18 pb-1 w-11/12 z-10 mt-1 divide-y overflow-y-auto flex flex-col justify-start items-center"
          >
            <li
              v-for="service in getServices"
              :key="service.name"
              class="w-full min-h-[40px] max-h-[40px] grid grid-cols-6 px-4 hover:bg-blue-400"
              @click="switchService(service)"
            >
              <img class="h-[30px] col-start-1 col-end-2 self-center justify-self-center" :src="service.sIcon" alt="service Icon" />
              <span
                class="col-start-3 col-end-6 px-4 py-1 flex justify-start items-center outline-0 whitespace-nowrap cursor-pointer text-lg text-gray-200 font-semibold"
                >{{ service.name }}</span
              >
            </li>
          </ul>
        </Transition>
      </div>
      <SyncCarousel
        v-if="isSyncingActived && (client.category === 'execution' || client.category === 'consensus')"
        :cat="client.category"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useServices } from "@/store/services";
import SyncCarousel from "../edit/SyncCarousel";

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
//Computed & Watcher
const getServices = computed(() => {
  let service;
  service = serviceStore.allServices.filter((e) => e?.category == props.client.category && e?.name != props.client.name);
  return service;
});

//Methods

const switchService = (service) => {
  props.properties.itemToInstall = service;
  switchDropdownOpen.value = false;
  isSyncingActived.value = true;
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
