<template>
  <div
    class="animate__animated animate__slideInLeft w-full h-full max-h-[35px] col-start-1 col-span-full bg-[#2e3335] rounded-sm flex justify-center items-center cursor-pointer p-1"
  >
    <div class="w-full h-full grid grid-cols-12 grid-rows-1">
      <img
        class="w-6 h-6 self-center col-start-1 col-span-1 justify-self-center"
        src="/img/icon/the-staking/group.png"
        alt="Group Icon"
        @mousedown.prevent
      />

      <input
        id="input1"
        v-model="groupName"
        class="col-start-2 col-end-11 w-full bg-[#171D22] border border-[#283139] px-4 py-1 rounded-sm outline-none text-xs text-gray-400 focus:border-gray-500 focus:rounded-md"
        type="text"
        autofocus
        :class="groupInputValidation.validationClass"
        :placeholder="groupInputValidation.placeholder"
        @focus="focused = true"
        @blur="focused = false"
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
          :class="groupNameValidation ? 'cursor-pointer' : 'pointer-events-none opacity-50'"
          @click="confirmGrouping"
        >
          <img class="w-4 h-4" src="/img/icon/the-staking/check.png" alt="Check Icon" @mousedown.prevent />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStakingStore } from "@/store/theStaking";
import { ref, computed } from "vue";

const emit = defineEmits(["confirmGrouping"]);

const stakingStore = useStakingStore();
const focused = ref(false);
let groupName = ref(null);

const groupInputValidation = computed(() => {
  let validationClass = "border-gray-300";
  let placeholder = focused.value ? "Write here your group name ..." : "Enter a name for your group";

  if (groupName.value === "" && focused.value) {
    validationClass = "border-red-500 placeholder-red-500";
    placeholder = "Please enter a name for your group";
  } else if (stakingStore.validatorKeyGroups.some((group) => group.name === groupName.value)) {
    validationClass = "border-amber-500 placeholder-amber-500";
    placeholder = "This name is already taken";
  } else if (!groupNameValidation.value && focused.value) {
    validationClass = "border-red-500 placeholder-red-500";
    placeholder = "Please enter a valid name for your group";
  }

  return { validationClass, placeholder };
});

const groupNameValidation = computed(() => {
  const trimmedName = groupName.value?.trim();
  const hasNoSpaces = !/\s/.test(trimmedName);
  const isUnderMaxLength = trimmedName?.length <= 30;
  if (trimmedName && hasNoSpaces && isUnderMaxLength) {
    return true;
  } else {
    return false;
  }
});

const confirmGrouping = () => {
  if (groupNameValidation.value) {
    emit("confirmGrouping", groupName.value);
  } else {
    return;
  }
};

const cancelGrouping = () => {
  groupName.value = "";
  stakingStore.setActivePanel(null);
};
</script>

<style scoped>
.panelIn {
  animation: slideIn 0.5s ease-in-out;
}

@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
