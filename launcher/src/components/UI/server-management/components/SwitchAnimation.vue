<template>
  <div class="fixed inset-0 items-center rounded-md bg-black bg-opacity-80 z-40 grid grid-cols-24 grid-rows-12 p-8">
    <div class="w-full h-full col-start-4 col-end-21 row-start-2 row-end-10 relative flex justify-center items-center">
      <img class="absolute inset-0 z-50" src="/animation/servers/server_switch.gif" alt="Anim" />
    </div>
    <button
      class="absolute col-start-9 col-end-18 row-start-11 row-span-full w-full h-[50px] bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md shadow-lg shadow-black active:shadow-none text-md uppercase z-50 cursor-pointer"
      type="button"
      @click="cancelLogin"
    >
      {{ t("multiServer.cancel") }}
    </button>
  </div>
</template>

<script setup>
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const emit = defineEmits(["cancelLogin"]);

const cancelLogin = () => {
  emit("cancelLogin");
};
</script>
