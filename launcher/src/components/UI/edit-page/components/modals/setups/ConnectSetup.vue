<template>
  <custom-modal
    :main-title="getSelectedSetup?.setupName || 'Select a Setup'"
    :client="getSelectedSetup"
    sub-title="Optimism Connection"
    confirm-text="Next"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmAction"
  >
    <template #content>
      <div
        class="flex flex-col items-center py-2 px-4 space-y-3 max-height-400px overflow-y-auto"
      >
        <div
          v-for="setup in filteredSetups"
          :key="setup.setupId"
          class="w-full p-2 border border-gray-700 rounded-md shadow-md transition cursor-pointer"
          :class="
            isSetupSelected(setup) ? 'bg-teal-700' : 'bg-neutral-900/90 hover:bg-gray-700'
          "
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
              <span class="text-sm font-semibold text-gray-200 uppercase">
                {{ setup.setupName }}
              </span>
              <span class="text-xs text-gray-400">Network: {{ setup.network }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="service in setup.services"
              :key="service.id"
              class="flex items-center p-1 bg-neutral-700 rounded-md"
            >
              <img :src="service.icon" alt="Client Icon" class="w-5 h-5 mr-2 rounded" />
              <span class="text-gray-300 text-sm font-semibold">
                {{ service.service }}
              </span>
            </div>
          </div>
        </div>

        <p v-if="filteredSetups.length === 0" class="text-gray-400 italic">
          No valid setups available.
        </p>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import { computed } from "vue";
import { useSetups } from "../../../../../../store/setups";
import CustomModal from "../../modals/CustomModal.vue";

const emit = defineEmits(["closeWindow", "confirmAction"]);
const setupStore = useSetups();

// Get the selected setup
const getSelectedSetup = computed(() => setupStore.selectedOPSetup);

// **Fix: Filter setups correctly**
const filteredSetups = computed(() => {
  return setupStore.allSetups.filter((setup) => {
    const setupNameLower = setup.setupName.toLowerCase();
    if (setupNameLower === "commonservices" || setupNameLower.includes("op")) {
      return false;
    }

    const hasExecution = setup.services.some(
      (service) => service.category === "execution"
    );
    const hasConsensus = setup.services.some(
      (service) => service.category === "consensus"
    );

    return hasExecution && hasConsensus;
  });
});

const isSetupSelected = (setup) => {
  return setupStore.selectedOPSetup?.setupId === setup.setupId;
};

const selectSetup = (setup) => {
  setupStore.selectedOPSetup = setup;
};

const confirmAction = () => {
  emit("confirmAction", setupStore.selectedOPSetup);
  setupStore.isConnectSetupModalActive = false;
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
