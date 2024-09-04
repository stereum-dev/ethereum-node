<template>
  <custom-modal
    :main-title="`${client.name}`"
    :client="client"
    sub-title="Service Informaton"
    confirm-text="OK"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="OkButton"
  >
    <template #content>
      <div class="flex flex-col justify-between items-center py-2 px-4 space-y-2 mt-10">
        <div class="w-full flex justify-center items-center">
          <div class="w-full grid grid-cols-12 items-center text-md">
            <img class="col-start-1 w-7 h-7" src="/img/icon/edit-node-icons/service-item-icon.png" alt="Client Icon" />
            <span class="col-start-2 col-span-3 text-gray-400 text-left">{{ $t("editModals.serviceId") }}</span>
            <span class="col-start-6 col-end-13 text-amber-600 text-center">{{ client.config.serviceID }}</span>
          </div>
        </div>
        <div class="w-full flex justify-center items-center">
          <div class="w-full grid grid-cols-12 items-center text-md">
            <img class="col-start-1 w-7 h-7" src="/img/icon/edit-node-icons/service-category.png" alt="Client Icon" />
            <span class="col-start-2 col-span-3 text-gray-400 text-left">{{ $t("editModals.serviceCat") }}</span>
            <span
              v-if="client.category !== 'service'"
              class="col-start-6 col-end-13 text-lg text-gray-400 font-semibold text-center capitalize"
              >{{ `${client.category} client` }}</span
            >
            <span v-else class="col-start-6 col-end-13 text-lg text-gray-400 font-semibold text-center capitalize">{{
              client.category
            }}</span>
          </div>
        </div>

        <div v-if="activateConnectionInfo" class="w-full flex flex-col justify-between items-start space-y-1 py-1">
          <div v-if="getConnectedExecution" class="w-full flex justify-center items-center">
            <div class="w-full grid grid-cols-12 items-center text-md">
              <img class="col-start-1 w-5" src="/img/icon/edit-node-icons/service-connected.png" alt="Client Icon" />
              <span class="col-start-2 col-span-3 text-gray-400 text-left">{{ $t("editBody.executionClient") }}</span>
              <div class="col-start-5 col-end-13 flex justify-between items-center bg-teal-600 rounded-md p-1 overflow-hidden">
                <img class="w-5" :src="getConnectedExecution.icon" alt="Service Icon" />
                <span class="text-gray-800 text-left font-semibold text-sm">{{ getConnectedExecution.name }}</span>
                <span class="text-gray-800 text-left text-sm">{{ getConnectedExecution.config.serviceID }}</span>
              </div>
            </div>
          </div>
          <div v-if="getConnectedConsensus" class="w-full flex justify-center items-center">
            <div class="w-full grid grid-cols-12 items-center text-md">
              <img class="col-start-1 w-5" src="/img/icon/edit-node-icons/service-connected.png" alt="Client Icon" />
              <span class="col-start-2 col-span-3 text-gray-400 text-left">{{ $t("editBody.consensusClient") }}</span>
              <div class="col-start-5 col-end-13 flex justify-between items-center bg-teal-600 rounded-md p-1 overflow-hidden">
                <img class="w-5" :src="getConnectedConsensus.icon" alt="Service Icon" />
                <span class="text-gray-800 text-left font-semibold text-sm">{{ getConnectedConsensus.name }}</span>
                <span class="text-gray-800 text-left text-sm">{{ getConnectedConsensus.config.serviceID }}</span>
              </div>
            </div>
          </div>
          <div v-if="getConnectedMevboost" class="w-full flex justify-center items-center">
            <div class="w-full grid grid-cols-12 items-center text-md">
              <img class="col-start-1 w-5" src="/img/icon/edit-node-icons/service-connected.png" alt="Client Icon" />
              <span class="col-start-2 col-span-3 text-gray-400 text-left">Mevboost</span>
              <div class="col-start-5 col-end-13 flex justify-between items-center bg-teal-600 rounded-md p-1 overflow-hidden">
                <img class="w-5" :src="getConnectedMevboost.icon" alt="Service Icon" />
                <span class="text-gray-800 text-left font-semibold text-sm">MEVBOOST</span>
                <span class="text-gray-800 text-left text-sm">{{ getConnectedMevboost.config.serviceID }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import { useNodeManage } from "@/store/nodeManage";
import { computed } from "vue";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "okButton"]);

const manageStore = useNodeManage();

const getConnectedExecution = computed(() => {
  let { executionClients } = props.client.config ? props.client.config.dependencies : {};
  let service = manageStore.newConfiguration.find((i) => i.config.serviceID === executionClients[0]?.id);
  return executionClients.length ? service : null;
});

const getConnectedConsensus = computed(() => {
  let { consensusClients } = props.client.config ? props.client.config.dependencies : {};
  let service = manageStore.newConfiguration.find((i) => i.config.serviceID === consensusClients[0]?.id);
  return consensusClients.length ? service : null;
});

const getConnectedMevboost = computed(() => {
  let { mevboost } = props.client.config ? props.client.config.dependencies : {};
  let service = manageStore.newConfiguration.find((i) => i.config.serviceID === mevboost[0]?.id);
  return mevboost.length ? service : null;
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
