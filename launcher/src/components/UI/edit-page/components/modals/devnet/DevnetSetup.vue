<script setup>
import { ref, computed, watch } from "vue";
import CustomModal from "../CustomModal.vue";
import CreateSetup from "./components/CreateSetup.vue";
import SelectGenesis from "./components/SelectGenesis.vue";
import ConfigGenesis from "./components/ConfigGenesis.vue";
import AddAllocation from "./components/AddAllocation.vue";
import SummeryDisplay from "./components/SummeryDisplay.vue";
import { useSetups } from "../../../../../../store/setups";
import { useMultiSetups } from "../../../../../../composables/multiSetups";

const setupStore = useSetups();
const subtitle = ref("");
const buttonText = ref("Next");
const isGenesisUploaded = ref(false);

const { updateDom } = useMultiSetups();

const currentComponent = computed(() => {
  switch (setupStore.currentStep) {
    case 1:
      return CreateSetup;
    case 2:
      return SelectGenesis;
    case 3:
      return isGenesisUploaded.value ? SummeryDisplay : ConfigGenesis;
    case 4:
      return AddAllocation;
    case 5:
      return SummeryDisplay;
    default:
      return null;
  }
});

const isButtonDisabled = computed(() => {
  switch (setupStore.currentStep) {
    case 1:
      return setupStore.devnetButtonDisabled;
    case 2:
      return !setupStore.uploadedGenesisFile && !setupStore.isGenesisCreated;
    case 3:
      return !setupStore.isGenesisConfigValid;
    case 4:
      return !setupStore.isAllocationValid;
    case 5:
      return false; // Always enabled on summary page
    default:
      return true;
  }
});

watch(
  () => setupStore.currentStep,
  () => {
    getSubtitles();
    getConfirmText();
  }
);

const getSubtitles = () => {
  switch (setupStore.currentStep) {
    case 1:
      subtitle.value = "SETUP NAME AND COLOR";
      break;
    case 2:
      subtitle.value = "GENESIS JSON SELECTION";
      break;
    case 3:
      subtitle.value = isGenesisUploaded.value ? "SETUP SUMMARY" : "GENESIS JSON CONFIGURATION";
      break;
    case 4:
      subtitle.value = "INITIAL ADDRESS ALLOCATION";
      break;
    case 5:
      subtitle.value = "SETUP SUMMARY";
      break;
    default:
      subtitle.value = "";
  }
};

const getConfirmText = () => {
  buttonText.value = setupStore.currentStep === 5 ? "Confirm" : "Next";
};

const closeWindow = () => {
  console.log("closeWindow");
  setupStore.currentStep = 1;
  isGenesisUploaded.value = false;
  setupStore.uploadedGenesisFile = null;
  setupStore.isGenesisCreated = false;
  setupStore.isGenesisConfigValid = false;
  setupStore.isAllocationValid = false;
  setupStore.devnetButtonDisabled = true;
};

const confirmInstall = () => {
  if (setupStore.currentStep < 5) {
    if (setupStore.currentStep === 2 && isGenesisUploaded.value) {
      setupStore.currentStep = 5;
    } else {
      setupStore.currentStep++;
    }
  } else {
    console.log("Finish installation");
  }
};

const handleGenesisUpload = (uploaded) => {
  isGenesisUploaded.value = uploaded;
  if (uploaded) {
    setupStore.currentStep = 5;
  }
};
</script>

<template>
  <custom-modal
    main-title="Create A Custom Setup"
    :sub-title="subtitle"
    :confirm-text="buttonText"
    :disabled-button="isButtonDisabled"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmInstall"
  >
    <template #content>
      <component :is="currentComponent" @genesis-uploaded="handleGenesisUpload" />
    </template>
  </custom-modal>
</template>
