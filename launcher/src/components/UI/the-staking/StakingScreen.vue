<template>
  <base-layout>
    <div class="w-full h-full grid grid-cols-12 grid-rows-6 p-1 gap-1">
      <div class="col-start-1 col-end-10 row-start-1 row-end-7 grid grid-cols-12 grid-rows-6">
        <DisplayValidators />
      </div>
      <div class="col-start-10 col-end-13 row-start-1 row-end-7 flex flex-col">
        <ValidatorStats />
        <SelectionOptions
          :key="refresh"
          :button-state="serviceStore.buttonState"
          :validator-icon="stakingStore.selectedIcon"
          :validator-name="selectedName"
          :validator-state="selectedStatus"
          :validators="installedValidators"
          :disable="stakingStore.display"
          @click-btn-graffiti="grafittiHandler"
          @click-btn-remove="removeHandler"
          @vld-picker="selectedValidator"
          @import-remote-keys="importRemoteKeysHandler"
        />
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import ControlService from "@/store/ControlService";
import { ref, computed, onMounted } from "vue";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";
import DisplayValidators from "./DisplayValidators.vue";
import SelectionOptions from "./SelectionOptions.vue";
import ValidatorStats from "./ValidatorStats.vue";

// refs
const refresh = ref(0);
const selectedName = ref(null);
const selectedStatus = ref(null);
const selectedIcon = ref(null);
let selectedValdiatorService = ref(null);
let doppelganger = ref(null);

// Pinia stores
const serviceStore = useServices();

const stakingStore = useStakingStore();

const installedValidators = computed(() => {
  const copyOfInstalledServices = structuredClone(serviceStore.installedServices);
  return copyOfInstalledServices.filter((obj) => obj.category === "validator");
});

// lifecycle hooks

onMounted(() => {
  if (installedValidators.value.length === 0) return;
  selectedValdiatorService.value = installedValidators.value[0];
  selectedIcon.value = installedValidators.value[0].icon;
  selectedName.value = installedValidators.value[0].name;
  selectedStatus.value = installedValidators.value[0].state;

  if (typeof selectedValdiatorService.value === "object") {
    const doppelgangerOption = Object.values(selectedValdiatorService.value.expertOptions).find(
      (option) => option.title === "Doppelganger"
    );
    if (doppelgangerOption) {
      doppelganger.value = doppelgangerOption.pattern;
    }
  }
});

onMounted(() => {
  doppelgangerController(selectedValdiatorService.value, doppelganger.value);
});

// methods

let doppelgangerController = async (arg, arg1) => {
  try {
    let result = await ControlService.getServiceYAML(arg?.config.serviceID);

    if (arg.service === "LighthouseValidatorService") {
      stakingStore.doppelgangerStatus = result.match(new RegExp(arg1[0])) ? true : false;
    } else {
      const matchResult = result.match(new RegExp(arg1[0]));
      if (matchResult) {
        stakingStore.doppelgangerStatus = matchResult[2] === "true";
      } else {
        console.log("Pattern not found in the input string.");
      }
    }
  } catch (error) {
    // console.error("Error fetching service YAML:", error);
  }
};
const importRemoteKeysHandler = () => {
  stakingStore.exitChainForMultiValidatorsActive = false;
  stakingStore.removeForMultiValidatorsActive = false;
  stakingStore.grafitiForMultiValidatorsActive = false;
  stakingStore.importRemoteKeysActive = true;
};

const grafittiHandler = () => {
  stakingStore.insertKeyBoxActive = false;
  stakingStore.enterPasswordBox = false;
  stakingStore.exitChainForMultiValidatorsActive = false;
  stakingStore.removeForMultiValidatorsActive = false;
  stakingStore.grafitiForMultiValidatorsActive = true;
};

const removeHandler = () => {
  stakingStore.exitChainForMultiValidatorsActive = false;
  stakingStore.grafitiForMultiValidatorsActive = false;
  stakingStore.removeForMultiValidatorsActive = true;
};

const selectedValidator = async (validator) => {
  stakingStore.selectedValdiatorService = validator;
  stakingStore.selectedIcon = validator?.icon;
  selectedName.value = validator?.name;
  selectedStatus.value = validator?.state;

  try {
    const doppelgangerOption = validator?.expertOptions?.find((option) => option.title === "Doppelganger");
    await doppelgangerController(stakingStore.selectedValdiatorService, doppelgangerOption.pattern);
  } catch (error) {
    // console.error("Error in test function:", error);
  }
};
</script>
