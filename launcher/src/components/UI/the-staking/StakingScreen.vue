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

onMounted(() => {
  if (installedValidators.value.length === 0) return;
  selectedValdiatorService.value = installedValidators.value[0];
  console.log(selectedValdiatorService.value);
  selectedIcon.value = installedValidators.value[0].icon;
  selectedName.value = installedValidators.value[0].name;
  selectedStatus.value = installedValidators.value[0].state;
  // console.log(selectedValdiatorService.value.expertOptions);

  if (typeof selectedValdiatorService.value === "object") {
    const doppelgangerOption = Object.values(selectedValdiatorService.value.expertOptions).find(
      (option) => option.title === "Doppelganger"
    );
    // console.log(doppelgangerOption);
    if (doppelgangerOption) {
      doppelganger.value = doppelgangerOption.pattern;
    }
  }
  // console.log(doppelganger.value[0]);
});

onMounted(() => {
  test(selectedValdiatorService.value);
});

// methods

let test = async (arg) => {
  try {
    let result = await ControlService.getServiceYAML(arg?.config.serviceID);
    if (result && result.endsWith) {
      console.log("Valid result:", result, arg?.config.serviceID);
    } else {
      console.error("Invalid result:", result);
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
  console.log("selected val", stakingStore.selectedValdiatorService);

  try {
    await test(stakingStore.selectedValdiatorService); // Wait for test() to complete before proceeding
    const doppelgangerOption = validator?.expertOptions?.find((option) => option.title === "Doppelganger");
    console.log(doppelgangerOption.pattern[0]);
  } catch (error) {
    console.error("Error in test function:", error);
  }
};
</script>
