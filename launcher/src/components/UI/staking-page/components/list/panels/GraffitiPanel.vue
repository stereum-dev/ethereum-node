<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full rounded-sm flex justify-center items-center cursor-pointer bg-[#a846b8]"
  >
    <div
      v-if="isAlertVisible"
      role="alert"
      class="absolute -top-[90px] left-14 w-2/3 max-h-36 rounded border-s-4 p-4 z-50 bg-red-100 border-red-400"
      aria-live="assertive"
    >
      <div class="flex items-center gap-2 text-red-800">
        <strong class="block font-medium"> Something went wrong </strong>
      </div>
      <p class="mt-2 text-sm text-red-700">Entered Graffiti Not Valid.</p>
    </div>
    <div class="w-full h-full grid grid-cols-12 grid-rows-1 py-[2px]">
      <img
        class="w-6 h-6 self-center col-start-1 col-span-1 justify-self-center"
        src="/img/icon/the-staking/option-graffiti.png"
        alt="Graffiti Icon"
        @mousedown.prevent
      />

      <input
        id="graffitiInput"
        v-model="enteredGraffiti"
        class="col-start-2 col-end-11 w-full bg-[#171D22] border px-4 rounded-sm outline-none text-xs text-gray-400 border-gray-500 placeholder:text-gray-400"
        type="text"
        autofocus
        :class="graffitiInputClass"
        placeholder="Enter validator graffiti"
        @change="validateGraffiti"
      />

      <div class="col-start-11 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
          @click="cancelGraffiti"
        >
          <img class="w-4 h-4" src="/img/icon/the-staking/close.png" alt="Close Icon" @mousedown.prevent />
        </div>
      </div>
      <div class="col-start-12 col-span-1 flex justify-center items-center p-1">
        <div
          class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 transition-all duration-150"
          :class="[
            isGraffitiValid && enteredGraffiti.length > 0
              ? 'hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none cursor-pointer'
              : 'pointer-events-none opacity-50',
          ]"
          @click="confirmGraffiti"
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

const emit = defineEmits(["confirmGraffiti"]);
const stakingStore = useStakingStore();

const enteredGraffiti = ref("");
const isGraffitiValid = ref(true); // Default to true

const isAlertVisible = computed(() => !isGraffitiValid.value);

const graffitiInputClass = computed(() => {
  if (!enteredGraffiti.value) {
    return "border-gray-300";
  } else if (isGraffitiValid.value) {
    return "border-green-500";
  } else {
    return "border-red-500 placeholder-red-500";
  }
});

const validateGraffiti = () => {
  const newValue = enteredGraffiti.value;
  if (newValue.length > 0 && newValue.length <= 32) {
    isGraffitiValid.value = true;
  } else {
    isGraffitiValid.value = false;
  }
};

watch(enteredGraffiti, validateGraffiti);

const confirmGraffiti = () => {
  if (!isGraffitiValid.value) return;
  emit("confirmGraffiti", enteredGraffiti.value);
};

const cancelGraffiti = () => {
  enteredGraffiti.value = "";
  stakingStore.setActivePanel(null);
};
</script>
