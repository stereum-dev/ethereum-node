<template>
  <div
    class="w-7/8 h-[437px] max-h-[489px] grid grid-cols-24 grid-rows-12 items-center bg-[#252525] border-t-2 border-gray-500 p-8 absolute top-2 left-12 z-10"
    @mousedown.prevent
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-end-6 flex justify-center items-center">
      <img class="w-80" src="/img/icon/the-staking/staking-disabled.png" alt="icon" />
    </div>

    <div class="w-full h-full col-start-1 col-span-full row-start-9 flex justify-center items-center text-center">
      <span class="text-cyan-400 text-2xl font-semibold font-sans">{{ t("disableStake.message") }}</span>
    </div>
  </div>
</template>

<script setup>
import i18n from "@/includes/i18n";

const t = i18n.global.t;
</script>
