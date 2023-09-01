<template>
  <div class="col-start-1 col-end-2 gap-1 p-2 space-y-2 flex flex-col justify-start items-center relative">
    <div
      v-for="item in getValidatorServices"
      :key="item"
      ref="validatorRefs"
      class="h-[120px] w-[100px] flex justify-center items-center py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
    >
      <ClientLayout :client="item" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";

const validatorRefs = ref([]);
const nodeStore = useNodeStore();
const serviceStore = useServices();

const getValidatorServices = computed(() =>
  serviceStore.installedServices.filter((e) => e.category === "validator").sort((a, b) => a.name.localeCompare(b.name))
);

const getValidatorRef = computed(() =>
  validatorRefs.value.map((el, index) => ({
    ref: el,
    refId: getValidatorServices.value[index].config.serviceID,
  }))
);

watch(getValidatorRef, () => {
  nodeStore.validatorRef.value = getValidatorRef.value;
});
</script>
