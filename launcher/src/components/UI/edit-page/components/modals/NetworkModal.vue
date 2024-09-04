<template>
  <custom-modal
    :main-title="network?.name"
    :client="manageStore.configNetwork.id ? manageStore.configNetwork : manageStore.currentNetwork"
    :sub-title="`${$t('editModals.switchNetwork')}`"
    :message-text="`${$t('editModals.selectNetwork')} ${network?.name}.`"
    :confirm-text="`${$t('editModals.confirm')}`"
    :click-outside-text="`${$t('editModals.clckOutside')}`"
    @close-window="closeWindow"
    @confirm-action="switchConfirm"
  >
    <template #content>
      <div class="w-2/3 flex flex-col justify-between items-center py-2 px-4 space-y-4 mx-auto mt-4">
        <div class="w-full flex flex-col justify-between items-center space-y-1">
          <span class="w-full text-left text-teal-700 font-semibold">Switch To</span>
          <div class="w-full relative">
            <button
              aria-expanded="false"
              class="w-full h-[40px] border border-gray-400 shadow-sm shadow-gray-600 rounded-md font-semibold text-lg text-gray-400 px-4 py-2 hover:brightness-110 flex items-center whitespace-nowrap space-x-4 justify-between"
              @click="networkDropdownOpen = !networkDropdownOpen"
            >
              <img v-if="manageStore.selectedNetwork?.id" :src="manageStore.selectedNetwork.icon" alt="Network Icon" class="w-7" />
              <span>{{ manageStore.selectedNetwork?.id ? manageStore.selectedNetwork?.name : "Select Network From List" }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 inline ml-1 text-gray-200"
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
                class="transition-all max-h-[150px] duration-400 ease-in-out absolute bg-gray-600 rounded-lg shadow-lg pt-10 w-full z-10 mt-1 divide-y overflow-x-hidden overflow-y-auto flex flex-col justify-start items-center"
                @mouseleave="networkDropdownOpen = false"
              >
                <li
                  v-for="item in manageStore.networkList"
                  :key="item?.name"
                  class="w-full grid grid-cols-6 px-4 hover:bg-blue-400"
                  :class="item?.state === 'disabled' ? 'pointer-events-none opacity-50' : ''"
                  @click="switchNetwork(item)"
                >
                  <img class="col-start-1 col-end-2 w-10 p-1" :src="item.icon" alt="Network Icon" />
                  <span
                    class="col-start-3 col-end-6 px-4 py-2 flex gap-2 justify-start items-center outline-0 whitespace-nowrap cursor-pointer text-lg text-gray-200 font-semibold"
                    >{{ item?.name }}</span
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
import { onMounted, ref } from "vue";

const emit = defineEmits(["closeWindow", "switchConfirm"]);

const networkDropdownOpen = ref(false);
const manageStore = useNodeManage();
const network = ref({});

onMounted(() => {
  network.value = manageStore.configNetwork?.id ? manageStore.configNetwork : manageStore.currentNetwork;
});
const switchNetwork = (network) => {
  manageStore.selectedNetwork = network;
  networkDropdownOpen.value = false;
};

const switchConfirm = () => {
  emit("switchConfirm", manageStore.selectedNetwork);
};

const closeWindow = () => {
  emit("closeWindow");
};
</script>
