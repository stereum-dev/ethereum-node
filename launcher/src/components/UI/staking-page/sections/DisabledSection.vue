<template>
  <div
    class="w-7/8 h-[439px] max-h-[489px] grid grid-cols-24 grid-rows-12 items-center bg-[#252525] p-8 absolute top-3 left-11 z-10 rounded-r-t"
    @mousedown.prevent
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-3 row-end-7 flex justify-center items-center">
      <img class="w-81 mt-2" src="/img/icon/the-staking/staking-disabled.png" alt="icon" />
    </div>

    <div
      class="w-full h-full col-start-1 col-span-full row-start-10 row-end-12 flex justify-center items-center text-center mt-2"
    >
      <span class="text-cyan-400 text-2xl font-semibold font-sans">{{ t("disableStake.message") }}</span>
    </div>
  </div>
</template>

<script setup>
import i18n from "@/includes/i18n";

const t = i18n.global.t;
</script>
