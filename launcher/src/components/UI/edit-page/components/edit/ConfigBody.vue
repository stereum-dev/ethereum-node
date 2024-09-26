<template>
  <div
    class="w-full h-full max-h-[430px] rounded-md border overflow-hidden bg-[#151618] relative"
    :class="[
      isOverDropZone ? 'border-dashed border-2 border-blue-500 ' : 'border-gray-600',
      manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : '',
      setupStore.isEditConfigViewActive
        ? 'animate__animated animate__fadeIn animate__faster'
        : 'animate__animated animate__fadeOut animate__faster',
    ]"
  >
    <div
      class="absolute top-0 w-full mx-auto grid grid-cols-3 h-6 border border-gray-950 rounded-t-[5px] text-xs font-[400] font-sans"
      :class="[setupStore.getBGColor(setupStore.selectedSetup?.color), setupStore.getTextColor(setupStore.selectedSetup?.color)]"
    >
      <span class="col-start-1 justify-self-center self-center">{{ $t("editBody.executionClient") }}</span>
      <span class="col-start-2 justify-self-center self-center">{{ $t("editBody.consensusClient") }}</span>
      <span class="col-start-3 justify-self-center self-center">{{ $t("editBody.validator") }}</span>
    </div>
    <div
      ref="dropZoneRef"
      class="w-full h-full max-h-[428px] grid grid-cols-3 pt-5 z-10"
      :class="{
        'scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto': activateScrollBar,
      }"
      @drop="onDrop($event)"
      @dragover.prevent="isOverDropZone = true"
      @dragleave.prevent="isOverDropZone = false"
    >
      <span
        v-if="isOverDropZone"
        class="col-start-2 col-span-1 self-center justify-self-center flex justify-center items-center text-xl text-blue-400"
        >+</span
      >
      <ExecutionClients
        v-if="!isOverDropZone"
        @delete-service="deleteService"
        @switch-client="switchClient"
        @confirm-consensus="confirmConsensus"
        @info-modal="infoModal"
        @mouse-over="lineDraw"
        @mouse-leave="removeLines"
      />

      <ConsensusClients
        v-if="!isOverDropZone"
        @delete-service="deleteService"
        @confirm-connection="confirmConnection"
        @switch-client="switchClient"
        @modify-service="modifyService"
        @info-modal="infoModal"
        @mouse-over="lineDraw"
        @mouse-leave="removeLines"
      />
      <ValidatorClients
        v-if="!isOverDropZone"
        @delete-service="deleteService"
        @switch-client="switchClient"
        @modify-service="modifyService"
        @info-modal="infoModal"
        @mouse-over="lineDraw"
        @mouse-leave="removeLines"
      />
    </div>
  </div>
</template>

<script setup>
import ConsensusClients from "./clients/ConsensusClients.vue";
import ExecutionClients from "./clients/ExecutionClients.vue";
import ValidatorClients from "./clients/ValidatorClients.vue";

import { useNodeManage } from "@/store/nodeManage";
import { computed, onMounted, ref } from "vue";
import { useMultiSetups } from "../../../../../composables/multiSetups";
import { useSetups } from "../../../../../store/setups";

const emit = defineEmits([
  "onDrop",
  "confirmConnection",
  "switchClient",
  "deleteService",
  "confirmConsensus",
  "infoModal",
  "modifyService",
  "removeLines",
  "lineDraw",
]);

const manageStore = useNodeManage();
const setupStore = useSetups();
const { updateDom } = useMultiSetups();

const isOverDropZone = ref(false);

const activateScrollBar = computed(() => {
  const validators = manageStore.newConfiguration.filter((service) => service.category === "validator");
  const consensus = manageStore.newConfiguration.filter((service) => service.category === "consensus");
  const execution = manageStore.newConfiguration.filter((service) => service.category === "execution");
  return !!(validators.length > 3 || consensus.length > 3 || execution.length > 3);
});

//Update selected setup
// watch(
//   () => manageStore.newConfiguration,
//   () => {
//     updateDom();

//   }
// );

//Lifecycle Hooks
onMounted(() => {
  updateDom();
});

// Methods

const removeLines = () => {
  emit("removeLines");
};

const lineDraw = (service) => {
  emit("lineDraw", service);
};

const onDrop = (event) => {
  emit("onDrop", event);
};

const deleteService = (service) => {
  emit("deleteService", service);
};

const switchClient = (service) => {
  emit("switchClient", service);
};

const confirmConsensus = (service) => {
  emit("confirmConsensus", service);
};

const confirmConnection = (service) => {
  emit("confirmConnection", service);
};

const infoModal = (service) => {
  emit("infoModal", service);
};

const modifyService = (service) => {
  emit("modifyService", service);
};
</script>
