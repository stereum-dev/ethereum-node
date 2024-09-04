<template>
  <div class="col-start-2 col-end-3 gap-y-5 pt-4 pb-2 grid grid-flow-row auto-rows-max relative">
    <div
      v-for="item in getConsensus"
      :key="item.config.serviceID + item.id"
      :ref="
        (el) => {
          item.ref = el;
        }
      "
      class="h-[110px] w-[110px] flex justify-center items-center py-1 rounded-md shadow-md self-center justify-self-center cursor-pointer relative"
      :class="getDynamicClasses(item)"
      @click="displayMenu(item)"
      @mouseleave="hideMenu(item)"
      @mouseenter="mouseOver(item)"
    >
      <ClientLayout :client="item" />
      <TransitionGroup name="slide-fade">
        <GeneralMenu
          v-if="item.displayPluginMenu"
          :item="item"
          @switch-client="switchClient"
          @modify-service="modifyService"
          @delete-service="deleteService"
          @info-modal="infoModal"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { useNodeManage } from "@/store/nodeManage";
import ClientLayout from "./ClientLayout.vue";
import GeneralMenu from "./GeneralMenu.vue";

import { computed } from "vue";
import { useSetups } from "../../../../../../store/setups";

//Props & Emits
const emit = defineEmits(["deleteService", "switchClient", "modifyService", "infoModal", "mouseOver", "mouseLeave"]);

//Refs

const manageStore = useNodeManage();
const setupStore = useSetups();

// computed & watchers properties
const getConsensus = computed(() => {
  const services = manageStore.newConfiguration
    .filter((s) => s.setupId === setupStore.selectedSetup?.setupId && s.category === "consensus")
    .sort((a, b) => {
      const fa = a.name.toLowerCase();
      const fb = b.name.toLowerCase();

      return fa < fb ? -1 : fa > fb ? 1 : 0;
    });

  return services;
});

// methods

const getDynamicClasses = (item) => {
  if (item.hasOwnProperty("isRemoveProcessing") && item.isRemoveProcessing) {
    return "border bg-red-600 border-white hover:bg-red-600";
  } else if (item.hasOwnProperty("isNewClient") && item.isNewClient) {
    return "opacity-50 cursor-not-allowed pointer-events-none bg-[#212629]  border border-gray-700";
  } else if (item.hasOwnProperty("modifierPanel") && item.modifierPanel) {
    return "opacity-50 cursor-not-allowed pointer-events-none bg-[#212629]  border border-gray-700";
  } else {
    return "bg-[#212629] hover:bg-[#374045] border border-gray-700";
  }
};

const displayMenu = (item) => {
  manageStore.newConfiguration.forEach((service) => {
    service.displayPluginMenu = false;
    service.isConnectedToMevboost = false;
  });
  if (
    !item.isNotConnectedToMevboost &&
    !item.isNotConnectedToValidator &&
    !item.isRemoveProcessing &&
    !item.isNewClient &&
    !item.modifierPanel
  ) {
    item.displayPluginMenu = true;
  }
};

const hideMenu = (item) => {
  item.displayPluginMenu = false;
  emit("mouseLeave", item);
};

const mouseOver = (item) => {
  if (!item.displayPluginMenu) {
    emit("mouseOver", item);
  }
};

const deleteService = (item) => {
  emit("deleteService", item);
};

const switchClient = (item) => {
  emit("switchClient", item);
};

const modifyService = (item) => {
  emit("modifyService", item);
};
const infoModal = (item) => {
  emit("infoModal", item);
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
