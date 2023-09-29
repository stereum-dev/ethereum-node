<template>
  <custom-modal
    main-title="Switch Client"
    sub-title="Replace Service"
    icon="/img/icon/manage-node-icons/switch.png"
    confirm-text="Confirm"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="switchConfirm"
  >
    <template #content>
      <div class="w-2/3 flex flex-col justify-between items-center py-2 px-4 space-y-4 mx-auto">
        <div class="w-full flex flex-col justify-between items-center space-y-1">
          <span class="w-full text-left text-teal-700 font-semibold">Current Client</span>
          <div
            class="flex justify-center items-center w-full h-[40px] border border-gray-300 shadow-sm shadow-gray-600 rounded-md py-1 px-2 font-semibold text-lg"
          >
            <img class="w-6 h-6 mr-2" :src="client.sIcon" alt="Client Icon" />
            <span class="text-gray-200">{{ client.name }}</span>
          </div>
        </div>
        <div class="w-full flex flex-col justify-between items-center space-y-1">
          <span class="w-full text-left text-teal-700 font-semibold">Switch To</span>
          <div class="w-full relative py-2">
            <button
              aria-expanded="false"
              class="w-full h-[40px] border border-gray-300 shadow-sm shadow-gray-600 rounded-md font-semibold text-lg text-blue-500 px-4 py-2 hover:brightness-110 flex items-center whitespace-nowrap space-x-2 justify-center relative"
              @click="switchDropdownOpen = !switchDropdownOpen"
            >
              <img
                v-if="serviceStore.selectedServiceToSwitch?.icon"
                class="w-6 h-6 mr-2"
                :src="serviceStore.selectedServiceToSwitch?.sIcon"
                alt="Client Icon"
              />
              <span>{{
                serviceStore.selectedServiceToSwitch
                  ? serviceStore.selectedServiceToSwitch.name
                  : "Select a Client From List"
              }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 inline ml-1 absolute right-1"
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
                class="transition-all max-h-[100px] duration-400 ease-in-out absolute bg-gray-800 rounded-lg shadow-lg pt-14 pb-1 w-full z-10 mt-1 divide-y overflow-y-auto flex flex-col justify-evenly items-center"
                @mouseleave="switchDropdownOpen = false"
              >
                <li
                  v-for="service in getServices"
                  :key="service.name"
                  class="w-full h-[40px] grid grid-cols-6 px-4 hover:bg-blue-400"
                  @click="switchService(service)"
                >
                  <img
                    class="h-[30px] col-start-1 col-end-2 self-center justify-self-center"
                    :src="service.sIcon"
                    alt="service Icon"
                  />
                  <span
                    class="col-start-3 col-end-6 px-4 py-1 flex justify-start items-center outline-0 whitespace-nowrap cursor-pointer text-lg text-gray-200 font-semibold"
                    >{{ service.name }}</span
                  >
                </li>
              </ul>
            </Transition>
          </div>
        </div>
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import { ref, computed } from "vue";
import { useServices } from "@/store/services";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "switchConfirm"]);

const switchDropdownOpen = ref(false);
const serviceStore = useServices();

const getServices = computed(() => {
  let service;
  service = serviceStore.allServices.filter((e) => e?.category == client.category && e?.name != client.name);
  return service;
});

const switchService = (service) => {
  serviceStore.selectedServiceToSwitch = service;
  switchDropdownOpen.value = false;
};

const switchConfirm = () => {
  emit("switchConfirm", serviceStore.selectedServiceToSwitch);
};

const closeWindow = () => {
  emit("closeWindow");
};
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: opacity 0.3s ease-out;
}
.slide-leave-active {
  transition: opacity 0.3s ease-in;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
}
</style>
