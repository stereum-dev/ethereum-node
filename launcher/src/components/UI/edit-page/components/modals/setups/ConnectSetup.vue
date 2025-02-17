<template>
  <custom-modal
    :main-title="getSelectedSetup?.setupName"
    sub-title="Select A Setup"
    :client="selectedSetup"
    :confirm-text="'Confirm'"
    click-outside-text="Click outside to cancel"
    :disabled-button="!buttonActive"
    @close-window="closeWindow"
    @confirm-action="confirmAction"
  >
    <template #content>
      <div class="flex flex-col items-center py-2 px-4 space-y-3 max-height-400px overflow-y-auto">
        <template v-if="!selectedSetup">
          <div
            v-for="setup in filteredSetups"
            :key="setup.setupId"
            class="w-full p-2 border border-gray-700 rounded-md shadow-md transition cursor-pointer"
            :class="isSetupSelected(setup) ? 'bg-teal-700' : 'bg-neutral-900/90 hover:bg-gray-700'"
            @click="selectSetup(setup)"
          >
            <div class="flex items-center mb-2">
              <img v-if="setup.services.length > 0" :src="setup.services[0].icon" alt="Setup Icon" class="w-6 h-6 rounded-full mr-3" />
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-200 uppercase">{{ setup.setupName }}</span>
                <span class="text-xs text-gray-400">Network: {{ setup.network }}</span>
              </div>
            </div>
          </div>
          <p v-if="filteredSetups.length === 0" class="text-gray-400 italic">No valid setups available.</p>
        </template>

        <template v-else>
          <div class="w-full flex flex-col space-y-2">
            <h3 class="text-lg font-semibold text-gray-300 text-center">Select Services to Include</h3>

            <div
              v-for="service in selectedSetup.services"
              :key="service.id"
              class="flex items-center justify-between p-2 bg-neutral-800 rounded-md border border-gray-700"
            >
              <div class="flex items-center">
                <img :src="service.icon" alt="Service Icon" class="w-6 h-6 mr-3 rounded" />
                <span class="text-gray-300 text-sm font-semibold">{{ service.service }}</span>
              </div>

              <input
                type="checkbox"
                class="h-5 w-5 accent-teal-500 cursor-pointer"
                :checked="isServiceSelected(service)"
                @change="handleServiceSelection(service)"
              />
            </div>

            <p v-if="selectedServices.length === 0" class="text-red-500 text-xs text-center">Please select at least one service.</p>
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

const emit = defineEmits(["closeWindow", "confirmAction"]);
const setupStore = useSetups();

const selectedSetup = ref(null);
const selectedServices = ref([]);

const getSelectedSetup = computed(() => setupStore.selectedOPSetup);
const buttonActive = computed(() => selectedServices.value.length === 2);

const filteredSetups = computed(() => {
  return setupStore.allSetups.filter((setup) => {
    const setupNameLower = setup.setupName.toLowerCase();
    if (setupNameLower === "commonservices" || setupNameLower.includes("op")) return false;

    const hasExecution = setup.services.some((service) => service.category === "execution");
    const hasConsensus = setup.services.some((service) => service.category === "consensus");

    return hasExecution && hasConsensus;
  });
});

const isSetupSelected = (setup) => selectedSetup.value?.setupId === setup.setupId;

const selectSetup = (setup) => {
  selectedSetup.value = setup;
  selectedServices.value = [];
};

const isServiceSelected = (service) => selectedServices.value.includes(service);

const handleServiceSelection = (service) => {
  if (service.category === "execution") {
    selectedServices.value = [service];

    const linkedConsensus = selectedSetup.value.services.find(
      (s) => s.category === "consensus" && s.config.dependencies.executionClients.some((ec) => ec.service === service.service)
    );

    if (linkedConsensus) {
      selectedServices.value.push(linkedConsensus);
    }
  } else if (service.category === "consensus") {
    selectedServices.value = [service];

    const linkedExecution = selectedSetup.value.services.find((s) => s.category === "execution");

    if (linkedExecution) {
      selectedServices.value.push(linkedExecution);
    }
  }
};

const confirmAction = () => {
  if (selectedServices.value.length !== 2) {
    return;
  }

  const rawSelectedServices = selectedServices.value.map((service) => JSON.parse(JSON.stringify(service)));
  setupStore.isConnectSetupModalActive = false;
  console.log("confirmAction", rawSelectedServices);
  emit("confirmAction", rawSelectedServices);
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
