<template>
  <div class="w-full col-start-3 col-end-4 pt-4 pb-2 gap-1 space-y-4 grid grid-flow-row auto-rows-max relative">
    <div
      v-for="item in getExecutions"
      :key="item"
      ref="executionRefs"
      class="h-[110px] w-[110px] flex justify-center items-center py-1 rounded-md border border-gray-700 bg-[#212629] shadow-md hover:bg-[#374045] self-center justify-self-center cursor-pointer relative"
      :class="getDynamicClasses(item)"
      @click="displayMenu(item)"
      @mouseleave="hideMenu(item)"
    >
      <ClientLayout :client="item" />
      <Transition name="slide-fade">
        <div
          v-if="item.displayPluginMenu"
          class="absolute inset-x-0 w-full h-full flex justify-center items-center z-50"
          @mousedown.prevent
        >
          <div class="flex justify-center items-center bg-gray-800 z-20 p-2 rounded-md space-x-2">
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
      </Transition>
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
    .filter((e) => e?.category == "execution")
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
  let connsectedConsensus;
  let connectedExecution;
  connsectedConsensus = serviceStore.installedServices
    .filter((e) => e.category === "consensus")
    .find((e) => e.config.dependencies.executionClients.length > 0);

  connectedExecution = connsectedConsensus?.config.dependencies.executionClients[0];

  serviceStore.installedServices.map((service) => {
    if (service.service === connectedExecution.service) {
      service.serviceIsConnected = true;
      service.connectedToConsensus = true;
    }
  });
});

// Methods

const getDynamicClasses = (item) => {
  if (item.hasOwnProperty("isRemoveProcessing") && item.isRemoveProcessing) {
    return "bg-red-600 ";
  }
};

const displayMenu = (item) => {
  serviceStore.installedServices.map((service) => {
    service.displayPluginMenu = false;
    service.isConnectedToMevboost = false;
  });
  item.displayPluginMenu = true;
};

const hideMenu = (item) => {
  item.displayPluginMenu = false;
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
