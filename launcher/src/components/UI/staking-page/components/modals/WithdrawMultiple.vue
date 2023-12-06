<template>
  <staking-custom-modal
    main-title="Withdraw & Exit Validator Keys"
    title-color="withdraw"
    click-outside-text="Click outside to cancel"
    :confirm-text="confirmButtonText"
    :is-processing="isProcessing"
    :active-button="activeButton"
    @close-modal="closeModal"
    @confirm-action="onConfirmAction"
  >
    <template #content>
      <div
        v-if="displayResponse"
        class="col-start-2 col-end-12 row-start-3 row-end-6 w-full h-full grid grid-cols-12 grid-rows-5 overflow-x-hidden overflow-y-auto max-h-[182px] bg-[#151618] rounded-lg p-2 gap-y-2"
      >
        <div
          class="col-start-1 col-span-full row-start-1 row-span-2 flex justify-center items-center px-3 border border-gray-700 rounded-lg bg-[#111213]"
        >
          <span class="text-md text-red-400 text-left font-semibold">{{ displayResponse }}</span>
        </div>
      </div>
      <div v-else class="col-start-1 col-span-full row-start-2 row-end-6 w-full h-full grid grid-cols-12 grid-rows-5">
        <div class="col-start-2 col-end-12 row-start-1 row-end-5 flex justify-center items-center px-3">
          <span class="text-md text-gray-200 text-left font-semibold">{{ getTextMessage }}</span>
        </div>
        <div class="col-start-3 col-end-11 row-start-5 row-span-1 flex justify-center items-center">
          <label for="MarketingAccept" class="flex gap-4">
            <input
              id="MarketingAccept"
              v-model="stakingStore.withdrawIsChecked"
              type="checkbox"
              name="marketing_accept"
              class="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
            />

            <span class="text-sm text-gray-700"> I READ THE TEXT AND I AM AWARE OF THE CONSEQUENCES </span>
          </label>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { computed, ref } from "vue";

const emit = defineEmits(["confirmWithdraw"]);

const stakingStore = useStakingStore();

const getTextMessage = computed(() => {
  return "ARE YOU SURE YOU WANT TO EXIT THE CHAIN WITH THE SELECTED VALIDATOR KEYS? THIS STOPS YOUR VALIDATOR DUTY & CAN NOT BE REVERSED. YOUR FUND ARE ALSO ONLY WITHDRAWABLE, IF THE CHAIN ALLOWS IT.";
});

const buttonClicked = ref(false);

const activeButton = computed(() => {
  if (stakingStore.withdrawIsChecked) {
    return true;
  } else {
    return false;
  }
});

const isProcessing = computed(() => {
  return buttonClicked.value && !displayResponse.value;
});

const displayResponse = computed(() => {
  return stakingStore.withdrawAndExitResponse;
});
const confirmButtonText = computed(() => {
  return stakingStore.withdrawAndExitResponse ? "OK" : "Withdraw & Exit";
});

const confirmWithdraw = () => {
  buttonClicked.value = true;
  emit("confirmWithdraw");
};

const closeModal = () => {
  if (stakingStore.selectedSingleKeyToWithdraw) {
    const keyToReset = stakingStore.keys.find((key) => key.key === stakingStore.selectedSingleKeyToWithdraw.key);
    if (keyToReset) {
      keyToReset.showExitText = false;
    }
    stakingStore.selectedSingleKeyToWithdraw = null;
  }
  buttonClicked.value = false;
  stakingStore.setActiveModal(null);
  stakingStore.withdrawAndExitResponse = null;
  stakingStore.withdrawIsChecked = false;
};

const onConfirmAction = () => {
  if (stakingStore.withdrawAndExitResponse) {
    closeModal();
  } else {
    confirmWithdraw();
  }
};
</script>
