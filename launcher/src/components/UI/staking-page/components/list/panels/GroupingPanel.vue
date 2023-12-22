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
        <strong class="block font-medium"> Something went wrong </strong>
      </div>

      <p class="mt-2 text-sm text-red-700">{{ alertMessage }}</p>
    </div>
    <div class="w-full h-full grid grid-cols-12 grid-rows-1 py-[2px]">
      <img
        class="w-6 h-6 self-center col-start-1 col-span-1 justify-self-center"
        src="/img/icon/the-staking/group.png"
        alt="Group Icon"
        @mousedown.prevent
      />

      <input
        id="input1"
        v-model="stakingStore.groupName"
        class="col-start-2 col-end-11 w-full bg-[#171D22] border px-4 rounded-sm outline-none text-xs text-gray-400 border-gray-500 placeholder:text-gray-400"
        type="text"
        autofocus
        :class="inputClass"
        placeholder="Write here your group name"
        @change="changeActive"
      />

      <div class="col-start-11 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          @click="cancelGrouping"
        >
          <img class="w-4 h-4" src="/img/icon/the-staking/close.png" alt="Close Icon" @mousedown.prevent />
        </div>
      </div>
      <div class="col-start-12 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          :class="
            stakingStore.selectedValidatorKeys.length || stakingStore.mode === 'rename'
              ? 'cursor-pointer'
              : 'pointer-events-none opacity-50'
          "
          @click="confirmGrouping"
        >
          <img class="w-4 h-4" src="/img/icon/the-staking/check.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { useStakingStore } from "@/store/theStaking";

const emit = defineEmits(["confirmGrouping"]);
const stakingStore = useStakingStore();

const validName = ref("");
const alertMessage = ref("");
const isGroupNameValid = ref(false);

const groupName = computed(() => stakingStore.groupName);

const inputClass = computed(() => {
  if (!groupName.value) {
    return "border-gray-300"; // default class
  } else if (!isGroupNameValid.value) {
    return "border-red-500 placeholder-red-500"; // class for invalid input
  } else {
    return "border-green-500"; // class for valid input
  }
});

watch(groupName, (newValue) => {
  const trimmedName = newValue.trim();
  const isNameTaken = stakingStore.validatorKeyGroups.some((group) => group.name === trimmedName);
  const hasNoSpaces = !/\s/.test(trimmedName);
  const isUnderMaxLength = trimmedName.length <= 30;

  if (!trimmedName) {
    alertMessage.value = "Please enter a name for your group";
    isGroupNameValid.value = false;
  } else if (!hasNoSpaces || !isUnderMaxLength || isNameTaken) {
    alertMessage.value = isNameTaken ? "This name is already taken" : "Invalid group name";
    isGroupNameValid.value = false;
  } else {
    validName.value = trimmedName;
    stakingStore.groupName = trimmedName;
    alertMessage.value = "";
    isGroupNameValid.value = true;
  }
});

const confirmGrouping = () => {
  if (!isGroupNameValid.value) return;
  emit("confirmGrouping", validName.value);
};
const cancelGrouping = () => {
  stakingStore.keys.forEach((key) => (key.selected = false));
  stakingStore.isGroupingAllowed = false;
  stakingStore.groupName = "";
  stakingStore.setActivePanel(null);
};
</script>
