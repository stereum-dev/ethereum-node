<template>
  <div class="w-full col-start-1 col-end-2 pt-4 pb-2 gap-1 space-y-4 grid grid-flow-row auto-rows-max relative">
    <div
      v-for="item in getExecutions"
      :key="item"
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
          @connect-client="connectClient"
          @delete-service="deleteService"
          @info-modal="infoModal"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeManage } from "@/store/nodeManage";
import ClientLayout from "./ClientLayout.vue";
import GeneralMenu from "./GeneralMenu.vue";

import { computed, } from "vue";

const emit = defineEmits(["deleteService", "switchClient", "connectClient", "infoModal", "mouseOver", "mouseLeave"]);
const manageStore = useNodeManage();
const serviceStore = useServices();

const getExecutions = computed(() => {
  return manageStore.newConfiguration
    .filter((e) => e.category == "execution")
    .sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
});

// Methods
const getDynamicClasses = (item) => {
  if (item.hasOwnProperty("isRemoveProcessing") && item.isRemoveProcessing) {
    return "border bg-red-600 border-white hover:bg-red-600";
  }
  if (item.hasOwnProperty("isNotConnectedToConsensus") && item.isNotConnectedToConsensus) {
    return "border border-blue-400 bg-blue-600 hover:bg-blue-600";
  } else if (
    item.hasOwnProperty("connectedToConsensus") &&
    item.connectedToConsensus &&
    manageStore.newConfiguration.filter((e) => e.category === "consensus").length > 1
  ) {
    return "border border-green-500 bg-green-500 hover:bg-green-500 pointer-events-none";
  } else {
    return "bg-[#212629] hover:bg-[#374045] border border-gray-700";
  }
};

const displayMenu = (item) => {
  serviceStore.installedServices.forEach((service) => {
    service.displayPluginMenu = false;
  });
  if (!item.isNotConnectedToConsensus && !item.isNotConnectedToValidator && !item.isRemoveProcessing) {
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
const connectClient = (item) => {
  emit("connectClient", item);
};

// const confirmConnection = (item) => {
//   emit("confirmConnection", item);
// };

const deleteService = (item) => {
  emit("deleteService", item);
};

const switchClient = (item) => {
  emit("switchClient", item);
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
