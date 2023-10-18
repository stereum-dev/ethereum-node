<template>
  <div class="col-start-2 col-end-3 gap-2 p-2 space-y-6 flex flex-col items-center">
    <div
      v-for="item in getConsensusServices"
      :key="item"
      ref="consensusRefs"
      class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700 hover:bg-[#2b3034]"
      @mouseenter="mouseOver(item)"
      @mouseleave="mouseLeave(item)"
    >
      <ClientLayout :client="item" />
      <ClientButtons
        :client="item"
        @open-expert="openExport(item)"
        @open-log="openLog"
        @state-handler="stateHandler"
        @restart-handler="restartHandler"
        @open-doc="openDoc"
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
import { ref, computed, watch } from "vue";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";

const emit = defineEmits([
  "openExpert",
  "openLog",
  "openDoc",
  "stateHandler",
  "restartHandler",
  "mouseOver",
  "mouseLeave",
]);

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

watch(getConsensusRef, (newValue) => {
  nodeStore.consensusRefList = newValue;
});

//Methods
const mouseOver = (item) => {
  emit("mouseOver", item);
};

const mouseLeave = (item) => {
  emit("mouseLeave", item);
};

const openResync = (item) => {
  item.isResyncModalOpen = true;
};

const openExport = (item) => {
  emit("openExpert", item);
};

const openLog = (item) => {
  emit("openLog", item);
};

const openDoc = (item) => {
  emit("openDoc", item);
};

const stateHandler = (item) => {
  emit("stateHandler", item);
};

const restartHandler = (item) => {
  emit("restartHandler", item);
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
