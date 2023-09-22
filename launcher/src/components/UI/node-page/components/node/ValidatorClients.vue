<template>
  <div class="col-start-3 col-end-4 gap-2 p-2 space-y-6 flex flex-col items-end">
    <div
      v-for="item in getValidatorServices"
      :key="item"
      ref="validatorRefs"
      class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
    >
      <ClientLayout :client="item" />
      <ClientButtons
        :client="item"
        @open-expert="openExpert"
        @open-log="$emit('openLog', item)"
        @state-handler="$emit('stateHandler', item)"
        @restart-handler="$emit('restartHandler', item)"
        @open-doc="$emit('openDoc', item)"
      />
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";
import { computed, watch, ref } from "vue";

const emit = defineEmits(["openExpert"]);

const validatorRefs = ref([]);

const nodeStore = useNodeStore();
const serviceStore = useServices();

const getValidatorServices = computed(() =>
  serviceStore.installedServices.filter((e) => e.category === "validator").sort((a, b) => a.name.localeCompare(b.name))
);

const getValidatorRef = computed(() => {
  return validatorRefs.value.map((el, index) => ({
    ref: el,
    refId: getValidatorServices.value[index].config.serviceID,
  }));
});

watch(getValidatorRef, (newValue) => {
  nodeStore.validatorRef = newValue;
});

const openExpert = (item) => {
  emit("openExpert", item);
};
</script>
