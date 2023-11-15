<template>
  <div
    class="w-full h-[35px] col-start-1 col-span-full bg-[#25272a] rounded-full grid grid-cols-12 items-center cursor-pointer shadow-md shadow-gray-800 border border-gray-600"
  >
    <div class="w-full h-full col-start-1 col-end-11 relative flex justify-start items-center">
      <button class="absolute right-0 focus:outline-none rtl:left-0 rtl:right-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6 mx-4 text-gray-400 transition-colors duration-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
        >
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path
            fill-rule="evenodd"
            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <input
        v-model="enteredPassword"
        type="password"
        placeholder="Enter password"
        class="w-full h-full text-gray-700 placeholder-gray-400/70 rounded-l-full items-center py-1 pl-4 bg-[#171D22]"
      />
    </div>
    <div class="col-start-11 col-span-1 flex justify-center items-center p-1 bg-[#171D22]">
      <div
        class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
        @click="cancelPassword"
      >
        <img class="w-4 h-4" src="/img/icon/the-staking/close.png" alt="Close Icon" />
      </div>
    </div>
    <div class="col-start-12 col-span-1 flex justify-center items-center p-1 bg-[#171D22] rounded-r-full">
      <div
        class="w-6 h-6 rounded-md bg-[#171D22] p-1 flex justify-center items-center hover:scale-110 border border-[#171D22] active:scale-100 hover:shadow-md hover:shadow-[#101214] hover:border-[#3f4851] active:shadow-none transition-all duration-150"
        @click="confirmPassword"
      >
        <img class="w-4 h-4" src="/img/icon/the-staking/check.png" alt="Check Icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStakingStore } from "@/store/theStaking";
import { ref } from "vue";

const emit = defineEmits(["confirmPassword"]);
const stakingStore = useStakingStore();
let enteredPassword = ref("");

const cancelPassword = () => {
  stakingStore.setActivePanel(null);
};

const confirmPassword = () => {
  emit("confirmPassword", enteredPassword.value);
};
</script>
