import { ref } from 'vue';
<template>
  <div class="col-start-1 col-end-25 row-start-1 row-span-1 grid grid-cols-12 p-1 bg-[#264744] rounded-t-md">
    <div class="justify-self-center col-start-4 col-end-10 row-start-1 row-span-1 self-center flex justify-center items-center">
      <span class="text-2xl text-gray-300 font-bold uppercase">{{ $t("welcomePage.welcomeStereum") }}</span>
    </div>
    <div
      class="w-8 h-8 col-start-12 col-span-1 row-start-1 row-span-1 bg-[#303232] rounded-full justify-self-end self-center flex justify-center items-center p-2 border border-gray-500 shadow-md shadow-[#303232] cursor-pointer hover:shadow-lg hover:shadow-[#303232] hover:scale-110 transition-all duration-200 ease-in-out active:scale-100 relative"
      @mouseenter="runTooltip"
      @click="logout"
    >
      <img class="w-4 h-4 mx-auto" src="/img/icon/base-header-icons/header-logout-button.png" alt="Logout Icon" />
    </div>
    <div
      v-if="isHovered"
      role="tooltip"
      class="absolute top-10 right-10 max-w-xs break-words rounded bg-[#1d1f20] px-3 py-2 text-center text-xs font-medium text-white outline-none"
    >
      <span>{{ $t("welcomePage.logOutBtn") }}</span>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const emit = defineEmits(["logout"]);
const isHovered = ref(false);

const runTooltip = () => {
  isHovered.value = true;

  setTimeout(() => {
    isHovered.value = false;
  }, 1000);
};

const logout = () => {
  emit("logout");
};
</script>
