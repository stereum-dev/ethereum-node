<template>
  <custom-modal
    main-title="Switch Network"
    message-text="Are you sure you want to switch network?"
    confirm-text="Confirm"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="switchConfirm"
  >
    <template #content>
      <div class="flex flex-col justify-between items-center py-2 px-4 space-y-4">
        <div class="w-full flex flex-col justify-between items-center space-y-1">
          <span class="w-full text-left text-teal-700 font-semibold">Current Network</span>
          <div
            class="flex justify-center items-center w-full h-[40px] border border-gray-300 shadow-sm shadow-gray-600 rounded-md py-1 px-2 font-semibold text-lg"
          >
            <span>{{ manageStore.currentNetwork.name }}</span>
          </div>
        </div>
        <div class="w-full flex flex-col justify-between items-center space-y-1">
          <span class="w-full text-left text-teal-700 font-semibold">Switch To</span>
          <div class="w-full relative">
            <button
              aria-expanded="false"
              class="w-full h-[40px] border border-gray-300 shadow-sm shadow-gray-600 rounded-md font-semibold text-lg text-blue-500 px-4 py-2 hover:brightness-110 flex items-center whitespace-nowrap space-x-4 justify-between"
              @click="networkDropdownOpen = !networkDropdownOpen"
            >
              <span>{{
                manageStore.selectedNetwrok ? manageStore.selectedNetwrok.name : "Select Network From List"
              }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-width="2" d="M5 10l7 7 7-7"></path>
              </svg>
            </button>
            <Transition name="slide">
              <ul
                v-show="networkDropdownOpen"
                class="transition-all max-h-[180px] duration-400 ease-in-out absolute bg-gray-600 rounded-lg shadow-lg py-1 w-full z-10 mt-1 divide-y overflow-y-auto flex flex-col justify-evenly items-center"
                @mouseleave="networkDropdownOpen = false"
              >
                <li
                  v-for="network in manageStore.networkList"
                  :key="network.name"
                  class="w-full grid grid-cols-6 px-4"
                  @click="switchNetwork(network)"
                >
                  <img class="col-start-1 col-end-2 w-10 p-1" :src="network.icon" alt="Network Icon" />
                  <span
                    class="col-start-3 col-end-6 px-4 py-2 flex gap-2 justify-start items-center outline-0 hover:bg-blue-400 whitespace-nowrap cursor-pointer text-lg text-gray-200 font-semibold"
                    >{{ network.name }}</span
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
import { useNodeManage } from "@/store/nodeManage";
import { ref } from "vue";

const emit = defineEmits(["closeWindow", "switchConfirm"]);

const networkDropdownOpen = ref(false);
const manageStore = useNodeManage();

const switchNetwork = (network) => {
  manageStore.selectedNetwrok = network;
  networkDropdownOpen.value = false;
};

const switchConfirm = () => {
  emit("switchConfirm");
};

const closeWindow = () => {
  emit("closeWindow");
};
</script>
