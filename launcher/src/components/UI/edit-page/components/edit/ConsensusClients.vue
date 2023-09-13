<template>
  <div class="col-start-2 col-span-1 gap-1 py-2 space-y-2 flex flex-col justify-start items-center relative">
    <div
      v-for="item in getConsensusServices"
      :key="item"
      ref="consensusRefs"
      class="h-[120px] w-[120px] flex justify-center items-center py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md hover:bg-[#374045]"
      @mouseenter="displayMenu(item)"
      @mouseleave="item.displayPluginMenu = false"
    >
      <ClientLayout :client="item" />
      <div
        v-if="item.displayPluginMenu"
        class="absolute left-0 right-0 w-full h-full flex justify-center items-center z-50"
        @mouseleave="item.displayPluginMenu = false"
      >
        <div class="flex justify-center items-center bg-gray-800 z-20 p-2 rounded-md space-x-1">
          <img
            class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
            src="/img/icon/manage-node-icons/stop.png"
            alt="Trash Icon"
          />
          <img
            class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
            src="/img/icon/manage-node-icons/delete.png"
            alt="Trash Icon"
          />
          <img
            class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
            src="/img/icon/manage-node-icons/trash.png"
            alt="Trash Icon"
            @click="deleteService(item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";

import { computed, ref, watch } from "vue";

const emit = defineEmits(["deleteService"]);
const executionRefs = ref([]);
const nodeStore = useNodeStore();
const serviceStore = useServices();

const getConsensusServices = computed(() => {
  return serviceStore.installedServices
    .filter((e) => e.category === "consensus")
    .sort((a, b) => a.name.localeCompare(b.name));
});

const getExecutionRef = computed(() => {
  return executionRefs.value.map((el, index) => {
    return {
      ref: el,
      refId: getConsensusServices.value[index].config.serviceID,
    };
  });
});

watch(() => {
  nodeStore.executionRef = getExecutionRef.value;
});
const displayMenu = (item) => {
  item.displayPluginMenu = true;
};
const deleteService = (item) => {
  emit("deleteService", item);
};
</script>
