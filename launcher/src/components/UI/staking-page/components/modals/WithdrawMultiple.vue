<template>
  <staking-custom-modal
    :main-title="`${$t('stakingPage.withdrawExit')}`"
    title-color="withdraw"
    height="450"
    :click-outside-text="clickOut"
    :external-close="true"
    :confirm-text="confirmButtonText"
    :message-text="getDetailsText"
    :is-processing="isProcessing"
    :active-button="activeButton"
    @close-modal="closeModal"
    @confirm-action="onConfirmAction"
    @export-action="exportMessage"
  >
    <template #content>
      <div
        v-if="displayResponse"
        class="col-start-2 col-end-12 row-start-3 row-end-6 w-full h-full flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto max-h-[185px] bg-[#151618] rounded-lg p-2 space-y-2 mt-3"
      >
        <div
          class="w-full h-20 flex flex-col justify-start items-start p-2 border border-gray-700 rounded-lg bg-[#111213] space-y-1 mx-auto"
        >
          <div v-if="getStatus?.success" class="w-full h-full flex justify-center items-center overflow-hidden">
            <span class="text-md text-teal-700 font-semibold text-center"> {{ getStatus.success }} {{ $t("stakingPage.vldExited") }}</span>
          </div>
          <div v-if="getStatus?.failure" class="w-full h-full flex justify-center items-center overflow-x-hidden overflow-y-auto">
            <span class="max-w-full text-md text-red-500 font-semibold text-center overflow-x-hidden overflow-y-auto">
              {{ getStatus.failure }} {{ $t("stakingPage.vldFailed") }}</span
            >
          </div>
        </div>
        <div
          v-for="(item, index) in responseList.slice(0, -1)"
          :key="`withdraw-and-exit-${index}`"
          class="w-full h-20 flex flex-col justify-start items-start p-2 border border-gray-700 rounded-lg bg-[#111213] space-y-1 mx-auto"
        >
          <div v-if="item.code === 200" class="w-full h-full flex flex-col justify-center items-start overflow-hidden">
            <p class="text-sm text-amber-400 text-left font-semibold">
              {{ useTruncate(item.pubkey, 20, 20) }}:
              <span class="text-md text-teal-700 font-semibold text-left"> {{ $t("stakingPage.successExit") }}</span>
              <br />
              <span class="max-w-full text-sm text-gray-400 text-left font-semibold overflow-x-hidden overflow-y-auto">{{ item.msg }}</span>
            </p>
          </div>
          <div v-else-if="item.code !== 200" class="w-full h-24 flex flex-col justify-center items-start overflow-x-hidden overflow-y-auto">
            <p class="text-sm text-amber-400 text-left font-semibold overflow-x-hidden overflow-y-auto">
              {{ useTruncate(item?.pubkey, 20, 20) }}:
              <span class="text-md text-red-500 font-semibold text-left overflow-x-hidden overflow-y-auto">{{
                $t("stakingPage.exitFailed")
              }}</span>
            </p>
            <span class="max-w-full text-sm text-gray-400 text-left font-semibold overflow-x-hidden overflow-y-auto">{{ item.msg }}</span>
          </div>
        </div>
      </div>
      <div v-else class="col-start-1 col-span-full row-start-2 row-end-6 w-full h-full grid grid-cols-12 grid-rows-5">
        <div class="col-start-2 col-end-12 row-start-1 row-end-5 flex justify-center items-center px-3">
          <span class="text-md text-gray-200 text-left font-semibold overflow-x-hidden overflow-y-auto">{{ getTextMessage }}</span>
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

            <span class="text-sm text-gray-400">{{ $t("stakingPage.readConeq") }}</span>
          </label>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { useDeepClone, useTruncate } from "@/composables/utils";
import { computed, ref, watch } from "vue";

const emit = defineEmits(["confirmWithdraw", "exportMessage"]);

const stakingStore = useStakingStore();
const clickOut = ref("Click outside to cancel");

const responseList = ref([]);

const getStatus = computed(() => {
  return responseList.value?.at(-1);
});

const getDetailsText = computed(() => {
  let msg;
  if (displayResponse.value) msg = "Exit Validator Details :";

  return msg;
});

const getTextMessage = computed(() => {
  return "ARE YOU SURE YOU WANT TO EXIT THE CHAIN WITH THE SELECTED VALIDATOR KEYS? THIS STOPS YOUR VALIDATOR DUTY & CAN NOT BE REVERSED. YOUR FUND ARE ALSO ONLY WITHDRAWABLE, IF THE CHAIN ALLOWS IT.";
});

const buttonClicked = ref(false);

const activeButton = computed(() => {
  return !!stakingStore.withdrawIsChecked;
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

const getNumberOfKeys = () => {
  let successCount = 0;
  let failureCount = 0;

  if (Array.isArray(displayResponse.value)) {
    // console.log("displayResponse before loop", displayResponse.value);
    displayResponse.value.forEach((item) => {
      if (item.flag === "approved" && item.code === 200) {
        successCount++;
      } else if (item.flag === "approved" && item.code !== 200) {
        failureCount++;
      } else if (item.flag === "rejected") {
        failureCount++;
      }
    });
    // Combine the counts with the original displayResponse
    const combinedResponse = [...useDeepClone(displayResponse.value), { success: successCount, failure: failureCount }];

    // Update the responseList with the combined data
    responseList.value = combinedResponse;
  }
};

// Set up the watcher after ensuring the store is properly initialized
watch(
  displayResponse,
  (newValue) => {
    if (newValue) {
      getNumberOfKeys();
    }
  },
  { deep: true }
);

const confirmWithdraw = () => {
  clickOut.value = null;
  buttonClicked.value = true;
  emit("confirmWithdraw");
};

const exportMessage = () => {
  emit("exportMessage");
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
