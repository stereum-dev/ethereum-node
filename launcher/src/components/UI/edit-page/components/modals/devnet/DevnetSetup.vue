<script setup>
import { computed, ref } from "vue";
import { useSetups } from "../../../../../../store/setups";
import CustomModal from "../CustomModal.vue";
import AddAllocation from "./components/AddAllocation.vue";
import ConfigGenesis from "./components/ConfigGenesis.vue";
import CreateSetup from "./components/CreateSetup.vue";
import SelectCilent from "./components/SelectCilent.vue";
import SelectGenesis from "./components/SelectGenesis.vue";
import SummeryDisplay from "./components/SummeryDisplay.vue";

const emit = defineEmits(["confirmDevnet"]);

const setupStore = useSetups();
const isGenesisConfigChanged = ref(false);
const allocations = ref([]);

const getComponent = computed(() => {
  let comp;
  let btnText = "Next";
  let btnState = false;
  let subtitle = "";
  if (setupStore.currentStep === 1) {
    comp = CreateSetup;
    subtitle = "SETUP NAME AND COLOR";
    btnState = !(setupStore.devnetConfigData.setupName && setupStore.devnetConfigData.setupColor);
  } else if (setupStore.currentStep === 2) {
    comp = SelectGenesis;
    btnState = true;
    subtitle = "GENESIS JSON SELECTION";
  } else if (setupStore.currentStep === 3) {
    comp = setupStore.devnetConfigData.uploadedGenesisConfig ? SelectCilent : ConfigGenesis;
    subtitle = setupStore.devnetConfigData.uploadedGenesisConfig ? "SETUP SUMMARY" : "GENESIS JSON CONFIGURATION";
  } else if (setupStore.currentStep === 4) {
    comp = AddAllocation;
    subtitle = "INITIAL ADDRESS ALLOCATION";
  } else if (setupStore.currentStep === 5) {
    comp = SelectCilent;
    subtitle = "INIT CLIENTS";
  } else if (setupStore.currentStep === 6) {
    comp = SummeryDisplay;
    subtitle = "SETUP SUMMARY";
    btnText = "Confirm";
  }

  return { modal: comp, buttonText: btnText, buttonState: btnState, subtitle: subtitle };
});

const closeWindow = () => {
  setupStore.isDevnetSetupModalActive = false;
  setupStore.currentStep = 1;
  setupStore.devnetConfigData = {
    network: "devnet",
    setupName: "",
    setupColor: "",
    genesisConfig: null,
    uploadedGenesisConfig: null,
    genesisChanged: false,
    configYaml: "",
    services: [],
  };
};

const buttonAction = () => {
  if (setupStore.currentStep < 6) {
    if (setupStore.currentStep === 2 && setupStore.devnetConfigData.uploadedGenesisConfig) {
      setupStore.currentStep = 5;
    } else {
      setupStore.currentStep++;
    }
  } else {
    confirmDevnet();
  }
};

const handleGenesisUpload = (uploaded) => {
  setupStore.devnetConfigData.uploadedGenesisConfig = uploaded;
  if (uploaded) {
    setupStore.currentStep = 5;
  }
};

// New methods to handle input changes
const updateSetupInfo = (name, color) => {
  setupStore.devnetConfigData.setupName = name;
  setupStore.devnetConfigData.setupColor = color;
};

const updateGenesisConfig = () => {
  isGenesisConfigChanged.value = true;
};

const updateAllocations = (newAllocations) => {
  allocations.value = newAllocations;
};

const confirmDevnet = () => {
  emit("confirmDevnet");
};
</script>

<template>
  <custom-modal
    main-title="Create A Custom Setup"
    :sub-title="getComponent.subtitle"
    :confirm-text="getComponent.buttonText"
    :disabled-button="getComponent.buttonState"
    click-outside-text="Click outside to cancel"
    icon="/img/icon/network-icons/devnet-square.png"
    @close-window="closeWindow"
    @confirm-action="buttonAction"
  >
    <template #content>
      <component
        :is="getComponent.modal"
        @genesis-uploaded="handleGenesisUpload"
        @update-setup-info="updateSetupInfo"
        @update-genesis-config="updateGenesisConfig"
        @update-allocations="updateAllocations"
      />
    </template>
  </custom-modal>
</template>
