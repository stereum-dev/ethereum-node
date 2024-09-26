<template>
  <custom-modal
    :main-title="getSelectedSetup.setupName"
    :client="getSelectedSetup"
    sub-title="Setup Informaton"
    confirm-text="OK"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="okButton"
  >
    <template #content>
      <div class="flex flex-col justify-between items-center py-2 px-4 space-y-1">
        <div class="w-full flex justify-center items-center">
          <div class="w-full grid grid-cols-12 items-center text-md">
            <img class="col-start-1 w-7 h-7" src="/img/icon/stereum-icons/stereum-logo.png" alt="Client Icon" />
            <span class="col-start-2 col-span-3 text-gray-400 text-left"> Setup ID </span>
            <span class="col-start-6 col-end-13 text-amber-600 text-center">{{ getSelectedSetup.setupId }}</span>
          </div>
        </div>
        <div class="w-full flex justify-center items-center">
          <div class="w-full grid grid-cols-12 items-center text-md">
            <img class="col-start-1 w-7 h-7" src="/img/icon/staking-page-icons/rename.png" alt="Client Icon" />
            <span class="col-start-2 col-span-3 text-gray-400 text-left"> Setup Name </span>
            <span v-if="getSelectedSetup" class="col-start-6 col-end-13 text-lg text-gray-400 text-center capitalize">{{
              getSelectedSetup.setupName
            }}</span>
          </div>
        </div>
        <div class="w-full flex justify-center items-center">
          <div class="w-full grid grid-cols-12 items-center text-md">
            <img class="col-start-1 w-7 h-7" src="/img/icon/edit-node-icons/coloring-icon.png" alt="Client Icon" />
            <span class="col-start-2 col-span-3 text-gray-400 text-left"> Setup Color </span>
            <span
              v-if="getSelectedSetup"
              class="w-6 h-6 rounded-full col-start-8 col-span-1 text-lg text-gray-400 font-sans text-center capitalize"
              :class="setupStore.getBGColor(getSelectedSetup.color)"
            ></span>
            <span v-if="getSelectedSetup" class="col-start-9 col-end-13 text-lg text-gray-400 font-sans text-left capitalize">{{
              getSelectedSetup.color
            }}</span>
          </div>
        </div>
        <div class="w-full flex justify-center items-center">
          <div class="w-full grid grid-cols-12 items-center text-md">
            <img class="col-start-1 w-7 h-7" src="/img/icon/edit-node-icons/service-item-icon.png" alt="Client Icon" />
            <span class="col-start-2 col-span-3 text-gray-400 text-left"> Included Services: </span>
          </div>
        </div>

        <div class="w-full h-9 grid grid-cols-3 gap-1">
          <span
            v-for="service in getSelectedSetup.services"
            :key="service.service"
            class="col-span-1 text-xs text-gray-300 font-semibold text-center capitalize bg-teal-700 rounded-sm p-1"
            >{{ service.service }}</span
          >
        </div>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import { computed } from "vue";
import { useSetups } from "../../../../../../store/setups";
import CustomModal from "../../modals/CustomModal.vue";

const setupStore = useSetups();

const getSelectedSetup = computed(() => {
  return setupStore.selectedSetupInfos;
});

// const getSetupIcon = computed(() => {
//   return setupStore.selectedSetup.icon;
// });

const okButton = () => {
  setupStore.selectedSetupInfos = null;
};

const closeWindow = () => {
  setupStore.selectedSetupInfos = null;
};
</script>
