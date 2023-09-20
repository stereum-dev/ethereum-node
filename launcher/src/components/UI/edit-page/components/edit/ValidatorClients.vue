<template>
  <div class="col-start-1 col-end-2 gap-1 pt-4 pb-2 space-y-4 grid grid-flow-row auto-rows-max relative">
    <div
      v-for="item in getValidators"
      :key="item"
      ref="validatorRefs"
      class="h-[110px] w-[110px] relative flex justify-center py-1 items-center rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700 hover:bg-[#374045] self-center justify-self-center"
      @mouseenter="displayMenu(item)"
    >
      <ClientLayout :client="item" />
      <Transition name="slide-fade">
        <div
          v-if="item.displayPluginMenu"
          class="absolute inset-x-0 w-full h-full flex justify-center items-center z-50"
          @mouseleave="item.displayPluginMenu = false"
          @mousedown.prevent
        >
          <div class="flex justify-center items-center bg-gray-800 z-20 p-2 rounded-md space-x-2">
            <img
              class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
              src="/img/icon/manage-node-icons/connection.png"
              alt="Trash Icon"
              @click="connectClient(item)"
            />
            <img
              class="w-7 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
              src="/img/icon/manage-node-icons/replace.png"
              alt="Trash Icon"
              @click="switchClient(item)"
            />
            <img
              class="w-6 rounded-sm hover:bg-gray-500 p-1 cursor-pointer active:scale-90 transition duration-200"
              src="/img/icon/manage-node-icons/trash.png"
              alt="Trash Icon"
              @click="deleteService(item)"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import { computed, reactive, watchEffect } from "vue";

// Variables & Constants

const emit = defineEmits(["deleteService", "switchClient", "connectClient"]);
const validatorRefs = reactive([]);
const nodeStore = useNodeStore();
const serviceStore = useServices();

// Computed & Watchers

const installedServices = computed(() => serviceStore.installedServices);

const getValidators = computed(() => {
  let service;
  service = installedServices.value.filter((e) => e?.category == "validator");
  return service;
});

watchEffect(() => {
  getValidators.value.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
});

const getValidatorRef = computed(() =>
  validatorRefs.map((el, index) => ({
    ref: el,
    refId: getValidators.value[index]?.config.serviceID,
  }))
);

watchEffect(getValidatorRef, () => {
  nodeStore.validatorRef.value = getValidatorRef.value;
});

watchEffect(() => {
  let connectedValidator;
  connectedValidator = serviceStore.installedServices
    .filter((e) => e.category === "validator")
    .find((e) => e.config.dependencies.consensusClients.length > 0);

  serviceStore.installedServices.map((service) => {
    if (service.service === connectedValidator.service) {
      service.serviceIsConnected = true;
      service.connectedToConsensus = true;
    }
  });
});

// Methods

const displayMenu = (item) => {
  serviceStore.installedServices.map((service) => {
    service.displayPluginMenu = false;
    service.isConnectedToMevboost = false;
  });
  item.displayPluginMenu = true;
};

const deleteService = (item) => {
  emit("deleteService", item);
};

const switchClient = (item) => {
  emit("switchClient", item);
};

const connectClient = (item) => {
  emit("connectClient", item);
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
