import { ref } from 'vue'; import { useStakingStore } from '@/store/theStaking';
<template>
  <div
    class="w-full h-6 bg-gray-300 rounded-full grid grid-cols-6 row-span-1 items-center px-2 hover:bg-[#336666] active:scale-95 hover:text-gray-300 text-gray-800 transition-all duration-150 ease-in-out mx-auto"
    :class="displayButtonByCondition ? 'pointer-events-none opacity-30 ' : 'cursor-pointer '"
    @click="props.button.events"
  >
    <img class="col-start-1 col-span-1 row-start-1 w-5 h-5" :src="props.button.icon" alt="Button Icon" @mousedown.prevent />
    <span class="col-start-2 col-span-full row-start-1 text-2xs font-semibold text-center uppercase">{{ props.button.text }}</span>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";

const props = defineProps({
  button: {
    type: Object,
    required: true,
  },
});

const stakingStore = useStakingStore();

const displayButtonByCondition = computed(() => {
  const isValidatorFilterRunning = stakingStore.selectedServiceToFilter && stakingStore.selectedServiceToFilter.state === "running";

  //Web3SignerService is selected in filter
  const isSelectedFilterWeb3Signer = stakingStore.selectedServiceToFilter?.service === "Web3SignerService";

  // Remote Key btn
  const isImportRemoteButton = props.button.text === "Import Remote Keys";

  //Imported keys for selected validator service
  const matchingKeyForService = stakingStore.keys.some((key) => key.validatorID === stakingStore.selectedServiceToFilter?.config.serviceID);

  if (isImportRemoteButton && stakingStore.isStakingDisabled) {
    return true;
  }

  if (isSelectedFilterWeb3Signer) {
    if (isImportRemoteButton || !matchingKeyForService || !isValidatorFilterRunning) {
      return true;
    }
  } else if (!isSelectedFilterWeb3Signer) {
    if ((!matchingKeyForService || !isValidatorFilterRunning) && !isImportRemoteButton) {
      return true;
    }
  }

  return false;
});
</script>
