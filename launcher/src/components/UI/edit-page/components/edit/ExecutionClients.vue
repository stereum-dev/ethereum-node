<template>
  <div class="w-full col-start-3 col-end-4 pt-4 pb-2 gap-1 space-y-4 grid grid-flow-row auto-rows-max relative">
    <div
      v-for="item in getExecutions"
      :key="item"
      ref="executionRefs"
      class="h-[110px] w-[110px] flex justify-center items-center py-1 rounded-md shadow-md hover:bg-[#374045] self-center justify-self-center cursor-pointer border bg-[#212629] border-gray-700 relative"
      :class="getDynamicClasses(item)"
      @click="displayMenu(item)"
      @mouseleave="hideMenu(item)"
    >
      <ClientLayout :client="item" />
      <TransitionGroup name="slide-fade">
        <div
          v-if="item.displayPluginMenu"
          class="absolute inset-x-0 w-full h-full flex justify-center items-center z-10"
          @mousedown.prevent
        >
          <div class="flex justify-center items-center bg-gray-800 p-2 rounded-md space-x-2">
            <img
              class="w-7 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
              src="/img/icon/manage-node-icons/replace.png"
              alt="Trash Icon"
              @click="switchClient(item)"
            />
            <img
              class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
              src="/img/icon/manage-node-icons/trash.png"
              alt="Trash Icon"
              @click="deleteService(item)"
            />
          </div>
        </div>
        <div
          v-else-if="item.isNotConnectedToConsensus"
          class="absolute inset-x-0 w-full h-full flex justify-center items-center z-20"
          @mousedown.prevent
        >
          <div class="flex justify-center items-center bg-gray-900 p-2 rounded-md space-x-2">
            <img
              v-if="!item.isConfirmProcessing"
              class="w-6 rounded-md bg-gray-500 border border-gray-700 p-1 cursor-pointer active:scale-90 transition duration-200 hover:bg-gray-700"
              src="/img/icon/manage-node-icons/connection.png"
              alt="Trash Icon"
              @click="confirmConsensus(item)"
            />
            <div
              v-else-if="item.isConfirmProcessing"
              class="w-6 h-6 pt-1 bg-gray-500 rounded-md border border-gray-700"
            >
              <svg class="animate-spin rounded-full border-t-2 border-r-2 border-blue-100 h-4 w-4 mx-auto"></svg>
            </div>
            <img
              class="w-6 bg-gray-500 rounded-md border border-gray-700 hover:bg-gray-700"
              src="/img/icon/the-staking/close.png"
              alt="CIcon"
              @click="hideConnectionMenu(item)"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import { useNodeManage } from "@/store/nodeManage";
import ClientLayout from "./ClientLayout.vue";

import { computed, ref, watchEffect } from "vue";

const emit = defineEmits(["deleteService", "switchClient"]);
const executionRefs = ref([]);
const nodeStore = useNodeStore();
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

const getExecutionRef = computed(() => {
  return executionRefs.value.map((el, index) => {
    return {
      ref: el,
      refId: getExecutions.value[index]?.config.serviceID,
    };
  });
});

watchEffect(() => {
  nodeStore.executionRef = getExecutionRef.value;
});

watchEffect(() => {
  let connectedExecution;
  manageStore.newConfiguration
    .filter((e) => e.category === "consensus")
    .forEach((e) => {
      if (e.config.dependencies.executionClients.length > 0) {
        connectedExecution = e.config.dependencies.executionClients[0];
        manageStore.newConfiguration.map((service) => {
          if (service.service === connectedExecution.service) {
            service.serviceIsConnected = true;
            service.connectedToExecution = true;
          }
        });
      }
    });
});

// Methods
const getDynamicClasses = (item) => {
  if (item.hasOwnProperty("isRemoveProcessing") && item.isRemoveProcessing) {
    return "bg-red-600 hover:red-600";
  }
  if (item.hasOwnProperty("isNotConnectedToConsensus") && item.isNotConnectedToConsensus) {
    return "border border-blue-400 bg-blue-600 hover:bg-blue-600";
  } else if (
    item.hasOwnProperty("connectedToConsensus") &&
    item.connectedToConsensus &&
    manageStore.newConfiguration.filter((e) => e.category === "consensus").length > 1
  ) {
    return "border border-green-500 bg-green-500 hover:bg-green-500 ";
  }
};

const displayMenu = (item) => {
  serviceStore.installedServices.forEach((service) => {
    service.displayPluginMenu = false;
  });
  if (item.isNotConnectedToConsensus || item.isNotConnectedToValidator || item.isNotConnectedToMevboost) {
    return;
  } else {
    item.displayPluginMenu = true;
  }
};

const hideMenu = (item) => {
  item.displayPluginMenu = false;
};

const hideConnectionMenu = (item) => {
  item.displayPluginMenu = false;
  manageStore.newConfiguration.forEach((service) => {
    if (service.connectedToConsensus) {
      service.connectedToConsensus = false;
    }
  });
  setTimeout(() => {
    item.isNotConnectedToConsensus = false;
  });
};

const confirmConsensus = (item) => {
  emit("confirmConsensus", item);
};

const deleteService = (item) => {
  emit("deleteService", item);
};

const switchClient = (item) => {
  emit("switchClient", item);
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
