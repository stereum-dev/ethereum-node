import { ref } from 'vue';
<template>
  <div class="col-start-1 col-span-full row-start-10 row-span-full flex justify-center items-center">
    <div class="w-full h-full border border-gray-600 rounded-md grid grid-cols-12 grid-rows-4 items-center bg-[#151618]">
      <DutyHeader />
      <DutyBody :epoch="epoch" />
      <DutyFooter :client="{ name: stakingStore.selectedServiceToFilter?.name }" />
    </div>
  </div>
</template>

<script setup>
import DutyHeader from "./components/epoch-duty/DutyHeader.vue";
import DutyBody from "./components/epoch-duty/DutyBody";
import DutyFooter from "./components/epoch-duty/DutyFooter.vue";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useStakingStore } from "@/store/theStaking";
import ControlService from "@/store/ControlService";

const stakingStore = useStakingStore();

const intervalID = ref(null);
const epoch = ref({
  syncDuties: 0,
  proposerDuties: 0,
});

const getFilteredValidators = computed(() => {
  return stakingStore.keys.filter((key) => key.validatorID === stakingStore.selectedServiceToFilter?.config?.serviceID);
});

onMounted(() => {
  if (!stakingStore.secondsPerSlot && !stakingStore.slotsPerEpoch) {
    ControlService.getCurrentEpochandSlot().then((data) => {
      stakingStore.secondsPerSlot = data.secondsPerSlot | 0;
      stakingStore.slotsPerEpoch = data.slotsPerEpoch | 0;
      stakingStore.currentEpoch = data.current_epoch | 0;
      stakingStore.currentSlot = data.current_slot | 0;
      if (stakingStore.secondsPerSlot && stakingStore.slotsPerEpoch) setupInterval();
    });
  } else {
    setupInterval();
  }
});

onUnmounted(() => {
  clearInterval(intervalID.value);
});

const setupInterval = async () => {
  getStats();
  intervalID.value = setInterval(() => {
    getStats();
  }, stakingStore.secondsPerSlot * 1000);
};

//TODO: Get Slot and Epoch in a separate interval, maybe move this to composables
const getStats = async () => {
  const data = await ControlService.getValidatorDuties(getFilteredValidators.value.map((k) => k.index).filter((k) => k));
  stakingStore.currentEpoch = data.currentEpoch | 0;
  stakingStore.currentSlot = data.currentSlot | 0;
  epoch.value.syncDuties = data.syncDuties?.length | 0;
  epoch.value.proposerDuties = data.proposerDuties?.length | 0;
};
</script>
