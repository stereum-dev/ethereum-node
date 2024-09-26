<template>
  <div class="col-start-1 col-span-1 gap-2 p-2 space-y-6 flex flex-col items-start">
    <div
      v-for="item in getExecutionServices"
      :key="item"
      :ref="
        (el) => {
          item.ref = el;
        }
      "
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
        @copy-jwt="copyJwt"
      />
      <TransitionGroup name="fadeModal">
        <ResyncModal v-if="item.isResyncModalOpen" icon-size="w-14" :item="item" @close-window="closeResyncModal(item)" />
        <PrunningModal v-if="showPruningModal" :item="item" @cancel-warning="closePruning" />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import PrunningModal from "../../modals/PrunningModal.vue";
import ResyncModal from "../../modals/ResyncModal.vue";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";
import { computed, ref } from "vue";
import { useSetups } from "../../../../../../store/setups";

//Emits
const emit = defineEmits(["openExpert", "openLog", "openDoc", "stateHandler", "restartHandler", "mouseOver", "mouseLeave", "copyJwt"]);

//Refs
const showPruningModal = ref(false);

//Stores
const nodeStore = useNodeStore();
const serviceStore = useServices();
const setupStore = useSetups();

const getExecutionServices = computed(() => {
  if (!setupStore.selectedSetup || !setupStore.selectedSetup.services) {
    return [];
  }
  const services = serviceStore.installedServices
    .filter((s) => s.category === "execution" && s.setupId === setupStore.selectedSetup?.setupId)
    .sort((a, b) => {
      const fa = a.name.toLowerCase();
      const fb = b.name.toLowerCase();

      return fa < fb ? -1 : fa > fb ? 1 : 0;
    });

  return services;
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

const copyJwt = (item) => {
  emit("copyJwt", item);
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
