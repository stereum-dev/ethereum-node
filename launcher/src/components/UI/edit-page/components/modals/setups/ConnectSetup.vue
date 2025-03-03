<template>
  <custom-modal
    :main-title="getSelectedOpSetup?.setupName"
    :sub-title="subTitle"
    :client="selectedSetup"
    :confirm-text="'Confirm'"
    click-outside-text="Click outside to cancel"
    :disabled-button="!buttonActive"
    @close-window="closeWindow"
    @confirm-action="confirmAction"
  >
    <template #content>
      <div
        class="flex flex-col items-center py-2 px-4 space-y-3 max-height-400px overflow-y-auto"
      >
        <!-- Step 1: Select OP Node -->
        <template v-if="!selectedOpNode">
          <div
            v-for="service in getOpNodeFromOpSetup"
            :key="service?.config?.serviceID"
            class="w-full p-2 border border-gray-700 rounded-md shadow-md transition cursor-pointer animate__animated"
            :class="
              isOpNodeSelected(service)
                ? 'bg-teal-700 animate__fadeOutLeft animate__duration-1s'
                : 'bg-neutral-900/90 hover:bg-gray-700 animate__zoomIn'
            "
          >
            <label class="flex items-center justify-between w-full cursor-pointer">
              <div class="flex items-center">
                <img
                  v-if="service"
                  :src="service.icon"
                  alt="Setup Icon"
                  class="w-6 h-6 rounded-full mr-3"
                />
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-gray-200 uppercase">
                    {{ service.service }}
                  </span>
                  <span class="text-xs text-gray-400">
                    ID: {{ service.config.serviceID }}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                class="h-5 w-5 accent-teal-500 cursor-pointer"
                :checked="isOpNodeSelected(service)"
                @change="toggleOpNodeSelection(service)"
              />
            </label>
          </div>
        </template>

        <!-- Step 2: Select Setup -->
        <template v-else-if="!selectedSetup">
          <div
            v-for="setup in filteredSetups"
            :key="setup.setupId"
            class="w-full p-2 border border-gray-700 rounded-md shadow-md transition cursor-pointer animate__animated animate__zoomIn animate__delay-1s flex justify-between items-center"
            :class="
              isSetupSelected(setup)
                ? 'bg-teal-700 animate__animated animate__zoomOutUp'
                : 'bg-neutral-900/90 hover:bg-gray-700'
            "
            :style="{ animationDelay: `${filteredSetups.indexOf(setup) * 100}ms` }"
            @click="selectSetup(setup)"
          >
            <div class="flex items-center mb-2">
              <img
                v-if="setup.services.length > 0"
                :src="setup.services[0].icon"
                alt="Setup Icon"
                class="w-6 h-6 rounded-full mr-3"
              />
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-200 uppercase">{{
                  setup.setupName
                }}</span>
                <span class="text-xs text-gray-400">Network: {{ setup.network }}</span>
              </div>
            </div>
            <span
              class="w-5 h-5 rounded-full"
              :class="setupStore.getBGColor(setup.color)"
            ></span>
          </div>
          <p v-if="filteredSetups.length === 0" class="text-gray-400 italic">
            No valid setups available.
          </p>
        </template>

        <!-- Step 3: Select Services -->
        <template v-else>
          <div
            class="w-full flex flex-col space-y-2 animate__animated animate__zoomIn animate__delay-1s"
            :style="{ animationDelay: `${filteredSetups.indexOf(setup) * 100}ms` }"
          >
            <div
              v-for="service in selectedSetup.services"
              :key="service.id"
              class="flex items-center justify-between p-2 bg-neutral-800 rounded-md border border-gray-700"
            >
              <label class="flex items-center justify-between w-full cursor-pointer">
                <div class="flex items-center">
                  <img
                    :src="service.icon"
                    alt="Service Icon"
                    class="w-6 h-6 mr-3 rounded"
                  />
                  <div class="flex flex-col">
                    <span class="text-gray-300 text-sm font-semibold">
                      {{ service.service }}
                    </span>
                    <span
                      v-if="isServiceInDependencies(service)"
                      class="text-xs text-teal-400"
                    >
                      Currently connected
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  class="h-5 w-5 accent-teal-500 cursor-pointer"
                  :checked="isServiceSelected(service)"
                  @change="handleServiceSelection(service)"
                />
              </label>
            </div>

            <p
              v-if="selectedServices.length === 0"
              class="text-red-500 text-xs text-center"
            >
              Please select at least one service.
            </p>
          </div>
        </template>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import { computed, ref } from "vue";
import { useSetups } from "../../../../../../store/setups";
import CustomModal from "../../modals/CustomModal.vue";
import { useServices } from "@/store/services";
import { useDeepClone } from "@/composables/utils";

const emit = defineEmits(["closeWindow", "confirmAction"]);
const setupStore = useSetups();
const serviceStore = useServices();

const selectedOpNode = ref(null);
const selectedSetup = ref(null);
const selectedServices = ref([]);

const getSelectedOpSetup = computed(() => setupStore.selectedOPSetup);
const buttonActive = computed(() => selectedServices.value.length === 3);

const subTitle = computed(() => {
  if (!selectedOpNode.value) {
    return "Select an OP Node";
  } else if (!selectedSetup.value) {
    return "Select a Setup";
  } else {
    return "Select Services";
  }
});

const getOpNodeFromOpSetup = computed(() => {
  return setupStore.selectedOPSetup?.services?.filter(
    (service) =>
      service.category === "consensus" && service.service === "OpNodeBeaconService"
  );
});

const filteredSetups = computed(() => {
  return setupStore.allSetups.filter((setup) => {
    const setupNameLower = setup.setupName.toLowerCase();
    if (setupNameLower === "commonservices" || setupNameLower.includes("op"))
      return false;

    const hasExecution = setup.services.some(
      (service) => service.category === "execution"
    );
    const hasConsensus = setup.services.some(
      (service) => service.category === "consensus"
    );

    return hasExecution && hasConsensus;
  });
});

const isOpNodeSelected = (node) => selectedOpNode.value?.id === node.id;

const toggleOpNodeSelection = (node) => {
  if (selectedOpNode.value?.id === node.id) {
    selectedOpNode.value = null;
  } else {
    selectedOpNode.value = node;

    console.log("selectedOpNode", selectedOpNode.value);
  }
};

const isSetupSelected = (setup) => selectedSetup.value?.setupId === setup.setupId;

const selectSetup = (setup) => {
  selectedSetup.value = setup;
  selectedServices.value = [selectedOpNode.value];

  setup.services.forEach((service) => {
    if (isServiceInDependencies(service)) {
      selectedServices.value.push(service);
    }
  });
};

const isServiceSelected = (service) =>
  selectedServices.value.some((s) => s.id === service.id);

const isServiceInDependencies = (service) => {
  if (!selectedOpNode.value?.config?.dependencies) return false;

  const deps = selectedOpNode.value.config.dependencies;

  if (service.category === "execution") {
    return deps.executionClients.some(
      (client) =>
        client.service === service.service && client.id === service.config?.serviceID
    );
  }

  if (service.category === "consensus") {
    return deps.consensusClients.some(
      (client) =>
        client.service === service.service && client.id === service.config?.serviceID
    );
  }

  return false;
};

const handleServiceSelection = (service) => {
  if (service.category === "execution") {
    selectedServices.value = [selectedOpNode.value, service];

    const linkedConsensus = selectedSetup.value.services.find(
      (s) =>
        s.category === "consensus" &&
        s.config.dependencies.executionClients.some(
          (ec) => ec.service === service.service
        )
    );

    if (linkedConsensus) {
      selectedServices.value.push(linkedConsensus);
    }
  } else if (service.category === "consensus") {
    selectedServices.value = [selectedOpNode.value, service];

    const linkedExecution = selectedSetup.value.services.find(
      (s) => s.category === "execution"
    );

    if (linkedExecution) {
      selectedServices.value.push(linkedExecution);
    }
  }
};

const confirmAction = () => {
  if (selectedServices.value.length === 0) {
    return;
  }

  const opNode = selectedServices.value.find(
    (service) => service.service === "OpNodeBeaconService"
  );
  const executionService = selectedServices.value.find(
    (service) => service.category === "execution"
  );
  const consensusService = selectedServices.value.find(
    (service) =>
      service.category === "consensus" && service.service !== "OpNodeBeaconService"
  );

  if (!opNode || !executionService || !consensusService) {
    return;
  }

  const existingExecutionConnections = opNode.config.dependencies.executionClients
    .map((connection) => {
      return serviceStore.installedServices.find(
        (service) => service.config.serviceID === connection.id
      );
    })
    .filter(Boolean);

  const existingConsensusConnections = opNode.config.dependencies.consensusClients
    .map((connection) => {
      return serviceStore.installedServices.find(
        (service) => service.config.serviceID === connection.id
      );
    })
    .filter(Boolean);

  const restructuredData = {
    client: opNode,
    consensusClients: [consensusService, ...existingConsensusConnections],
    executionClients: [executionService, ...existingExecutionConnections],
    otherServices: [],
  };

  setupStore.isConnectSetupModalActive = false;
  emit("confirmAction", useDeepClone(restructuredData));
};

const closeWindow = () => {
  emit("closeWindow");
};
</script>

<style scoped>
.max-height-400px {
  max-height: 400px;
  overflow-y: auto;
}
</style>
