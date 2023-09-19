<template>
  <div class="col-start-2 col-end-3 gap-1 py-2 space-y-2 flex flex-col justify-start items-center relative">
    <div
      v-for="item in getConsensus"
      :key="item.config.serviceID"
      ref="consensusRefs"
      class="h-[120px] w-[120px] flex justify-center items-center py-2 rounded-md shadow-md border border-gray-700 bg-[#212629] hover:bg-[#374045]"
      :class="getConnectionClasses(item)"
      @mouseover="mouseOverHandler(item)"
      @mouseleave="mouseLeaveHandler(item)"
    >
      <ClientLayout :client="item" />
      <TransitionGroup name="slide-fade">
        <div
          v-if="item.displayPluginMenu"
          class="absolute inset-x-0 w-full h-full flex justify-center items-center z-50"
          @mousedown.prevent
        >
          <div class="flex justify-center items-center bg-gray-800 z-20 p-2 rounded-md space-x-2">
            <img
              class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
              src="/img/icon/manage-node-icons/not-connected.png"
              alt="Trash Icon"
            />
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
          v-else-if="item.isNotConnectedToMevboost"
          class="absolute inset-x-0 w-full h-full flex justify-center items-center z-50"
          @mousedown.prevent
        >
          <div class="flex justify-center items-center bg-gray-900 z-20 p-2 rounded-md space-x-2">
            <img class="w-8 rounded-sm" src="/img/icon/plugin-icons/Other/mev-sIcon.png" alt="Trash Icon" />
            <img
              v-if="!isConfirmLoading"
              class="w-8 rounded-md bg-gray-500 border border-gray-700 p-1 cursor-pointer active:scale-90 transition duration-200"
              src="/img/icon/manage-node-icons/not-connected.png"
              alt="Trash Icon"
              @click="confirmConnection(item)"
            />
            <div v-else-if="isConfirmLoading" class="w-8 h-8 py-2 px-1 bg-gray-500 rounded-md border border-gray-700">
              <svg class="animate-spin rounded-full border-t-2 border-r-2 border-blue-300 h-4 w-4 mx-auto"></svg>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";

import { computed, ref, watchEffect } from "vue";

const emit = defineEmits(["deleteService", "switchClient"]);
const executionRefs = ref([]);
const nodeStore = useNodeStore();
const serviceStore = useServices();
const isConfirmLoading = ref(false);
const isMouseOverClient = ref(false);

const getConsensus = computed(() => {
  let service;
  service = serviceStore.installedServices.filter((e) => e?.category == "consensus");
  return service;
});
watchEffect(() => {
  getConsensus.value.sort((a, b) => {
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
      refId: getConsensus.value[index].config.serviceID,
    };
  });
});

const getConnectionClasses = (item) => {
  if (item.hasOwnProperty("isNotConnectedToMevboost") && item.isNotConnectedToMevboost) {
    return "border  border-blue-400 bg-blue-600 hover:bg-blue-600";
  }
};

watchEffect(() => {
  nodeStore.executionRef = getExecutionRef.value;
});

// methods

const mouseOverHandler = (item) => {
  if (!isMouseOverClient.value) {
    displayMenu(item);
  }
};

const mouseLeaveHandler = (item) => {
  if (!isMouseOverClient.value) {
    hideMenu(item);
  }
};

const displayMenu = (item) => {
  serviceStore.installedServices.forEach((service) => {
    service.displayPluginMenu = false;
    service.isConnectedToMevboost = false;
  });
  if (!item.isNotConnectedToMevboost) {
    item.displayPluginMenu = true;
  }
};

const hideMenu = (item) => {
  item.displayPluginMenu = false;
};

const deleteService = (item) => {
  emit("deleteService", item);
};

const confirmConnection = (item) => {
  isConfirmLoading.value = true;
  setTimeout(() => {
    isConfirmLoading.value = false;
    item.isNotConnectedToMevboost = false;
    item.isConnectedToMevboost = true;
  }, 5000);
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
