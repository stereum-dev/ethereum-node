<template>
  <div
    class="animate__animated animate__fadeIn w-full h-full max-h-[32px] col-start-1 col-span-full bg-[#3e4347] rounded-sm grid grid-cols-12 items-center cursor-pointer shadow-md shadow-gray-800 border border-gray-600"
  >
    <div class="w-full h-full col-start-1 col-end-11 relative flex justify-start items-center">
      <button class="absolute right-2 focus:outline-none rtl:left-0 rtl:right-auto" @click="togglePasswordVisibility">
        <img
          v-if="isPasswordVisible"
          class="w-4"
          src="/img/icon/the-staking/visible.png"
          alt="Visible Icon"
          @mousedown.prevent
        />
        <img v-else class="w-4" src="/img/icon/the-staking/invisible.png" alt="Invisible Icon" @mousedown.prevent />
      </button>

      <input
        v-model="eneteredPassword"
        :type="isPasswordVisible ? 'text' : 'password'"
        placeholder="Enter password"
        class="w-full max-h-[28px] text-gray-400 placeholder-gray-400/70 rounded-sm items-center py-1 pl-4 bg-[#171D22]"
      />
    </div>
    <div class="col-start-11 col-span-1 flex justify-center items-center p-1">
      <div
        class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
        @click="cancelPassword"
      >
        <img class="w-4 h-4" src="/img/icon/the-staking/close.png" alt="Close Icon" @mousedown.prevent />
      </div>
    </div>
    <div class="col-start-12 col-span-1 flex justify-center items-center p-1">
      <div
        class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
        @click="confirmPassword"
      >
        <img class="w-4 h-4" src="/img/icon/the-staking/check.png" alt="Check Icon" @mousedown.prevent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { ref } from "vue";

const emit = defineEmits(["confirmPassword"]);

const stakingStore = useStakingStore();
let eneteredPassword = ref("");
let isPasswordVisible = ref(false);

//Methods

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const cancelPassword = () => {
  stakingStore.isPreviewListActive = false;
  stakingStore.setActivePanel(null);
  stakingStore.previewKeys = [];
};

const confirmPassword = () => {
  emit("confirmPassword", eneteredPassword.value.trim());
};
</script>
