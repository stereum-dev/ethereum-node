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
        />
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useServices } from "../../../store/services";
import { useStakingStore } from "@/store/theStaking";
import DisplayValidators from "./DisplayValidators.vue";
import SelectionOptions from "./SelectionOptions.vue";
import ValidatorStats from "./ValidatorStats.vue";

// refs
const refresh = ref(0);
const selectedName = ref("");
const selectedStatus = ref("");

// Pinia stores
const serviceStore = useServices();

const stakingStore = useStakingStore();

// computed

const installedValidators = computed(() => {
  const copyOfInstalledServices = structuredClone(serviceStore.installedServices);
  return copyOfInstalledServices.filter((obj) => obj.category === "validator");
});

// methods

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

const selectedValidator = (validator) => {
  stakingStore.selectedValdiatorService = validator;
  stakingStore.selectedIcon = validator?.icon;
  selectedName.value = validator?.name;
  selectedStatus.value = validator?.state;
};
</script>
