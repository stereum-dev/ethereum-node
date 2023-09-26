<template>
  <div class="col-start-2 col-end-3 gap-2 p-2 space-y-6 flex flex-col items-center">
    <div
      v-for="item in getConsensusServices"
      :key="item"
      ref="consensusRefs"
      class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
    >
      <ClientLayout :client="item" />
      <ClientButtons
        :client="item"
        @open-expert="openExport(item)"
        @open-log="$emit('openLog', item)"
        @state-handler="$emit('stateHandler', item)"
        @restart-handler="$emit('restartHandler', item)"
        @open-doc="$emit('openDoc', item)"
        @open-resync="openResync(item)"
      />
      <TransitionGroup name="fadeModal">
        <ResyncModal v-if="item.isResyncModalOpen" :item="item" @close-window="item.isResyncModalOpen = false" />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import ResyncModal from "../modals/ResyncModal.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";

const emit = defineEmits(["openExpert"]);


//Refs
const consensusRefs = ref([]);
const nodeStore = useNodeStore();
const serviceStore = useServices();


//Computed & Watchers
const getConsensusServices = computed(() =>
  serviceStore.installedServices.filter((e) => e.category === "consensus").sort((a, b) => a.name.localeCompare(b.name))
);

const getConsensusRef = computed(() =>
  consensusRefs.value.map((el, index) => ({
    ref: el,
    refId: getConsensusServices.value[index].config.serviceID,
  }))
);

watch(getConsensusRef, () => {
  nodeStore.consensusRef.value = getConsensusRef.value;
});

onMounted(() => {
  if (getConsensusRef.value.length > 0) {
    nodeStore.consensusRef.value = getConsensusRef.value;
  }
});

//Methods

const openResync = (item) => {
  item.isResyncModalOpen = true;
};

const openExport = (item) => {
  emit("openExpert", item);
};
</script>

<style scoped>
.fadeModal-enter-active,
.fadeModal-leave-active {
  transition: opacity 0.5s ease;
}

.fadeModal-enter-from,
.fadeModal-leave-to {
  opacity: 0;
}
</style>
