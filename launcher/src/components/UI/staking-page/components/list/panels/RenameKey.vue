<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full bg-[#3e4347] rounded-sm flex justify-center items-center cursor-pointer"
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
    <div class="w-full h-full grid grid-cols-12 grid-rows-1 py-[2px]">
      <img
        class="w-6 h-6 self-center col-start-1 col-span-1 justify-self-center"
        src="/img/icon/staking-page-icons/key-icon.png"
        alt="Group Icon"
        @mousedown.prevent
      />

      <input
        id="input1"
        v-model="stakingStore.validatorDisplayName"
        class="col-start-2 col-end-10 w-full bg-[#171D22] border px-4 rounded-sm outline-none text-xs text-gray-400 border-gray-500 placeholder:text-gray-400"
        type="text"
        autofocus
        :class="inputClass"
        placeholder="Write here your key name"
        :disabled="isKeysEmpty"
        @change="changeActive"
      />

      <div class="col-start-10 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          @click="cancelRename"
        >
          <img class="w-4 h-4" src="/img/icon/staking-page-icons/close.png" alt="Close Icon" @mousedown.prevent />
        </div>
      </div>
      <div class="col-start-11 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          :class="stakingStore.selectKeyToRename !== null ? 'cursor-pointer' : 'pointer-events-none opacity-50'"
          @click="resetName"
        >
          <img class="w-4 h-4" src="/img/icon/staking-page-icons/reset.png" alt="Reset Icon" @mousedown.prevent />
        </div>
      </div>
      <div class="col-start-12 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          :class="stakingStore.selectKeyToRename !== null ? 'cursor-pointer' : 'pointer-events-none opacity-50'"
          @click="confirmRename"
        >
          <img class="w-4 h-4" src="/img/icon/staking-page-icons/check.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

const emit = defineEmits(["confirmRename", "resetName"]);
const stakingStore = useStakingStore();

const validName = ref("");
const alertMessage = ref("");
const isKeyNameValid = ref(false);

const isKeysEmpty = computed(() => stakingStore.keys.length === 0);
const keyName = computed(() => stakingStore.validatorDisplayName);

const inputClass = computed(() => {
  if (!keyName.value) {
    return "border-gray-300"; // default class
  } else if (!isKeyNameValid.value) {
    return "border-red-500 placeholder-red-500"; // class for invalid input
  } else {
    return "border-green-500"; // class for valid input
  }
});

watch(keyName, (newValue) => {
  const trimmedName = newValue.trim();
  const isNameTaken = stakingStore.keys.some((key) => key.displayName === trimmedName);
  const hasNoSpaces = !/\s/.test(trimmedName);
  const isUnderMaxLength = trimmedName.length <= 30;

  if (!trimmedName) {
    alertMessage.value = "Please enter a name for your key";
    isKeyNameValid.value = false;
  } else if (!hasNoSpaces || !isUnderMaxLength || isNameTaken) {
    alertMessage.value = isNameTaken ? "This name is already taken" : "Invalid key name";
    isKeyNameValid.value = false;
  } else {
    validName.value = trimmedName;
    stakingStore.validatorDisplayName = trimmedName;
    alertMessage.value = "";
    isKeyNameValid.value = true;
  }
});

const confirmRename = () => {
  if (!isKeyNameValid.value) return;
  emit("confirmRename", validName.value);
};
const cancelRename = () => {
  stakingStore.keys.find((key) => key.key === stakingStore.selectKeyToRename.key).selected = false;
  stakingStore.validatorDisplayName = "";
  stakingStore.setActivePanel(null);
};

const resetName = () => {
  stakingStore.validatorDisplayName = "";
  emit("resetName", stakingStore.selectKeyToRename);
};
</script>
