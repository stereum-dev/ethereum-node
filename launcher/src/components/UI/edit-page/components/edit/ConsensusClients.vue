<template>
  <div class="col-start-2 col-end-3 gap-1 p-2 space-y-2 flex flex-col justify-start items-center relative">
    <div
      v-for="item in getConsensusServices"
      :key="item"
      ref="consensusRefs"
      class="h-[120px] w-[100px] flex justify-center items-center py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
    >
      <ClientLayout :client="item" />
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";

import { computed, ref, watch } from "vue";

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
</script>
