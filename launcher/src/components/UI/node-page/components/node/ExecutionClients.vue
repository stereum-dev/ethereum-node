<template>
  <div class="col-start-1 col-span-1 gap-2 p-2 space-y-6 flex flex-col items-start">
    <div
      v-for="item in getExecutionServices"
      :key="item"
      ref="executionRefs"
      class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700 hover:bg-[#2b3034]"
      @mouseenter="mouseOver(item)"
      @mouseleave="mouseLeave(item)"
    >
      <ClientLayout :client="item" />
      <ClientButtons
        :client="item"
        @open-expert="openExpert"
        @open-log="openLog"
        @state-handler="stateHandler"
        @restart-handler="restartHandler"
        @open-doc="openDoc"
        @open-resync="openResync(item)"
        @open-pruning="openPruning"
      />
      <TransitionGroup name="fadeModal">
        <ResyncModal
          v-if="item.isResyncModalOpen"
          icon-size="w-14"
          :item="item"
          @close-window="closeResyncModal(item)"
        />
        <PrunningModal v-if="showPruningModal" :item="item" @cancel-warning="closePruning" />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import PrunningModal from "../modals/PrunningModal.vue";
import ResyncModal from "../modals/ResyncModal.vue";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";
import { computed, ref, watch } from "vue";

//Emits
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
const executionRefs = ref([]);
const showPruningModal = ref(false);

//Stores
const nodeStore = useNodeStore();
const serviceStore = useServices();

//Computed & Watchers
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

watch(getExecutionRef, (newValue) => {
  nodeStore.executionRefList = newValue;
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
const closeResyncModal = (item) => {
  nodeStore.isLineHidden = false;
  item.isResyncModalOpen = false;
};

const openPruning = () => {
  showPruningModal.value = true;
};

const closePruning = () => {
  nodeStore.isLineHidden = false;
  showPruningModal.value = false;
};

const openExpert = (item) => {
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
