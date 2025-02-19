<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-y-auto bg-[#151618]"
    :class="
      setupStore.isConfigViewActive
        ? 'animate__animated animate__fadeIn animate__faster'
        : 'animate__animated animate__fadeOut animate__faster'
    "
  >
    <div class="w-full h-full grid grid-cols-3 grid-rows-15">
      <div
        class="col-start-1 col-span-full row-start-1 row-span-1 w-full mx-auto grid grid-cols-3 h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] text-gray-300 text-xs font-[400] font-sans"
      >
        <span class="col-start-1 justify-self-center self-center">{{ $t("editModals.executionClients") }}</span>
        <span class="col-start-2 justify-self-center self-center">{{ $t("editModals.consensusClients") }}</span>
        <span class="col-start-3 justify-self-center self-center">{{ $t("editBody.validator") }} </span>
      </div>
      <ClientSkeleton v-for="i in skeletons" v-show="loadingClients" :key="i" />
      <ExecutionClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDraw"
        @mouse-leave="removeLines"
        @copy-jwt="copyJwt"
      />
      <ConsensusClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDraw"
        @mouse-leave="removeLines"
      />
      <ValidatorClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDraw"
        @mouse-leave="removeLines"
      />
    </div>
  </div>
</template>

<script setup>
import { useRestartService, useStateHandler } from "@/composables/services";
import { useNodeStore } from "@/store/theNode";
import { ref, watchEffect } from "vue";
import { useSetups } from "../../../../../store/setups";
import ClientSkeleton from "./clients/ClientSkeleton.vue";
import ConsensusClients from "./clients/ConsensusClients.vue";
import ExecutionClients from "./clients/ExecutionClients.vue";
import ValidatorClients from "./clients/ValidatorClients.vue";

const emit = defineEmits([
  "openExpert",
  "openLog",
  "openDocs",
  "clickOutside",
  "useStateHandler",
  "useRestartService",
  "lineDraw",
  "removeLines",
  "copyJwt",
]);

// Refs

const skeletons = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const loadingClients = ref(false);

// Store and router

const nodeStore = useNodeStore();
const setupStore = useSetups();

watchEffect(() => {
  if (nodeStore.skeletonLoading) {
    loadingClients.value = true;
  } else {
    loadingClients.value = false;
  }
});

// Methods

const openExpert = (item) => {
  emit("openExpert", item);
};

const openLog = (item) => {
  emit("openLog", item);
};

const openDocs = (item) => {
  emit("openDocs", item);
};

const clickOutside = () => {
  emit("clickOutside");
};

const lineDraw = (item) => {
  emit("lineDraw", item);
};

const removeLines = () => {
  emit("removeLines");
};

const copyJwt = (jwt) => {
  emit("copyJwt", jwt);
};
</script>
