<template>
  <custom-modal
    main-title="Service Informations"
    confirm-text="OK"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="OkButton"
  >
    <template #content>
      <div class="flex flex-col justify-between items-center py-2 px-4 space-y-2">
        <div class="flex justify-start items-center w-full py-1 px-2 font-semibold text-xl uppercase">
          <img class="w-10 h-10 mr-2" :src="client.sIcon" alt="Client Icon" />
          <span>{{ client.name }}</span>
        </div>
        <div class="flex justify-start items-center w-full py-1 px-2 font-semibold text-xl uppercase">
          <span v-if="client.category !== 'service'">{{ client.category }} client</span>
          <span v-else>{{ client.category }}</span>
        </div>
        <div class="flex justify-start items-center w-full py-1 px-2 font-semibold text-xl">
          <span class="uppercase">Service ID:</span>
          <span class="ml-2">{{ client.config.serviceID }}</span>
        </div>
        <div v-if="activateConnectionInfo" class="w-full flex flex-col justify-between items-start space-y-1 py-1 px-2">
          <span v-if="getConnectedExecution" class="w-full text-left text-teal-700 font-semibold">{{
            `${client.name} is connected to ${getConnectedExecution}`
          }}</span>
          <span v-if="getConnectedConsensus" class="w-full text-left text-teal-700 font-semibold">{{
            `${client.name} is connected to ${getConnectedConsensus}`
          }}</span>
          <span v-if="getConnectedMevboost" class="w-full text-left text-teal-700 font-semibold">{{
            `${client.name} is connected to MEV-Boost`
          }}</span>
        </div>
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import { computed } from "vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "okButton"]);

const getConnectedExecution = computed(() => {
  let { executionClients } = client.config.dependencies;
  return executionClients.length ? executionClients[0].service : null;
});

const getConnectedConsensus = computed(() => {
  let { consensusClients } = client.config.dependencies;
  return consensusClients.length ? consensusClients[0].service : null;
});

const getConnectedMevboost = computed(() => {
  let { mevboost } = client.config.dependencies;
  return mevboost.length ? mevboost[0] : null;
});

const activateConnectionInfo = computed(() => {
  if (getConnectedExecution.value || getConnectedConsensus.value || getConnectedMevboost.value) {
    return true;
  } else {
    return false;
  }
});

//Methods

const OkButton = () => {
  emit("okButton");
};

const closeWindow = () => {
  emit("closeWindow");
};
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: opacity 0.3s ease-out;
}
.slide-leave-active {
  transition: opacity 0.3s ease-in;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
}
</style>
