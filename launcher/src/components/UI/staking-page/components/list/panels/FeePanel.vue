<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full rounded-sm flex justify-center items-center cursor-pointer bg-[#4D56CB]"
  >
    <div
      v-if="alertMessage !== ''"
      role="alert"
      class="absolute -top-[90px] left-14 w-2/3 max-h-36 rounded border-s-4 p-4 z-50 bg-red-100 border-red-400"
    >
      <div class="flex items-center gap-2 text-red-800">
        <strong class="block font-medium">{{ $t("stakingPage.somethingWrong") }}</strong>
      </div>

      <p class="mt-2 text-sm text-red-700">{{ alertMessage }}</p>
    </div>
    <div
      v-if="infoMessage !== ''"
      role="info"
      class="absolute -top-[90px] left-14 w-2/3 max-h-36 rounded border-s-4 p-4 z-60 bg-gray-100 border-gray-400"
    >
      <div class="flex items-center gap-2 text-info-800">
        <strong class="block font-medium">Info</strong>
      </div>

      <p class="mt-2 text-sm">{{ infoMessage }}</p>
    </div>
    <div class="w-full h-full grid grid-cols-13 grid-rows-1 py-[2px]">
      <img
        class="w-6 h-6 self-center col-start-1 col-span-1 justify-self-center"
        src="/img/icon/staking-page-icons/option-fee-recepient.png"
        alt="Group Icon"
        @mousedown.prevent
      />

      <input
        id="input1"
        v-model="stakingStore.enteredFeeRecipientAddress"
        class="col-start-2 col-end-11 w-full bg-[#171D22] border px-4 rounded-sm outline-none text-xs text-gray-400 border-gray-500 placeholder:text-gray-400"
        type="text"
        autofocus
        :class="inputClass"
        placeholder="Enter fee recipient address"
        @change="changeActive"
      />

      <div class="col-start-11 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          @click="cancelFeeRecepient"
        >
          <img class="w-4 h-4" src="/img/icon/staking-page-icons/close.png" alt="Close Icon" @mousedown.prevent />
        </div>
      </div>
      <div class="col-start-12 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          :class="isAddressValid ? 'cursor-pointer' : 'pointer-events-none opacity-50'"
          @click="confirmFeerecepient"
        >
          <img class="w-4 h-4" src="/img/icon/staking-page-icons/check.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>
      <div class="col-start-13 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          @click="deleteFeerecepient"
        >
          <img class="w-4 h-4" src="/img/icon/edit-node-icons/service-delete.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

const emit = defineEmits(["confirmFeerecepient", "deleteFeerecepient"]);
const stakingStore = useStakingStore();

const validName = ref("");
const alertMessage = ref("");
const isAddressValid = ref(false);

const feeRecepientAddress = computed(() => stakingStore.enteredFeeRecipientAddress);
const infoMessage = computed(() => stakingStore.feeRecipientInfoMessage || "");

const inputClass = computed(() => {
  if (!feeRecepientAddress.value) {
    return "border-gray-300"; // default class
  } else if (!isAddressValid.value) {
    return "border-red-500 placeholder-red-500"; // class for invalid input
  } else {
    return "border-green-500"; // class for valid input
  }
});

watch(feeRecepientAddress, (newValue) => {
  const trimmedName = newValue.trim();

  // Ethereum address validation (starts with 0x and is 42 characters long)
  const isValidEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(trimmedName);

  if (!trimmedName) {
    alertMessage.value = "";
    isAddressValid.value = false;
  } else if (!isValidEthereumAddress) {
    alertMessage.value = "Invalid wallet address";
    isAddressValid.value = false;
  } else {
    validName.value = trimmedName;
    stakingStore.feeRecepientAddress = trimmedName;
    alertMessage.value = "";
    isAddressValid.value = true;
  }
});

const confirmFeerecepient = () => {
  if (!isAddressValid.value) return;
  stakingStore.feeRecipientInfoMessage = `Applying new fee recipient address...`;
  emit("confirmFeerecepient", stakingStore.feeRecepientAddress);
};
const cancelFeeRecepient = () => {
  stakingStore.keys.find((key) => key.key === stakingStore.selectKeyForFee.key).selected = false;
  stakingStore.enteredFeeRecipientAddress = "";
  stakingStore.setActivePanel(null);
};
const deleteFeerecepient = () => {
  stakingStore.feeRecipientInfoMessage = `Deleting current fee recipient address...`;
  emit("deleteFeerecepient");
};
</script>
