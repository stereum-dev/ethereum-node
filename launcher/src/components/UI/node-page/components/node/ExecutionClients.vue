<template>
  <div class="col-start-1 col-span-1 gap-2 p-2 space-y-6 flex flex-col items-start">
    <div
      v-for="item in getExecutionServices"
      :key="item"
      ref="executionRefs"
      class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
    >
      <ClientLayout :client="item" />
      <ClientButtons
        :client="item"
        @open-expert="$emit('openExpert', item)"
        @open-log="$emit('openLog', item)"
        @state-handler="$emit('stateHandler', item)"
        @restart-handler="$emit('restartHandler', item)"
        @open-doc="$emit('openDoc', item)"
      />
      <ExpertWindow
        v-if="item.expertOptionsModal"
        :item="item"
        @hide-modal="hideModal(item)"
        @prunning-warning="$emit('prunning-warning', item)"
        @resync-warning="$emit('resync-warning', item)"
      />
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";
import ExpertWindow from "../../sections/ExpertWindow.vue";
import { computed, ref, watch } from "vue";

const executionRefs = ref([]);

const nodeStore = useNodeStore();

const serviceStore = useServices();
const emit = defineEmits(["openExpert", "openLog", "stateHandler", "restartHandler"]);

const getExecutionServices = computed(() => {
  return serviceStore.installedServices
    .filter((e) => e.category === "execution")
    .sort((a, b) => a.name.localeCompare(b.name));
});

const getExecutionRef = computed(() => {
  return executionRefs.value.map((el, index) => {
    return {
      ref: el,
      refId: getExecutionServices.value[index].config.serviceID,
    };
  });
});

watch(() => {
  nodeStore.executionRef = getExecutionRef.value;
});

const hideModal = (item) => {
  emit("hide-modal", item);
};
</script>
