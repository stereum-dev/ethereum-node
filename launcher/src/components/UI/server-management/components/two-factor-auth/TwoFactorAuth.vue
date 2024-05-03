<template>
  <div
    class="2-fa-auth w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-24 grid-rows-14 p-2"
  >
    <span
      class="top-ttl col-start-1 col-span-full row-start-1 row-span-1 text-gray-100 text-base font-semibold uppercase flex justify-start items-center"
      >2 FACTOR AUTHENTICATION</span
    >
    <TwoFactorBtn class="row-start-3" btn-name="Setup" @btnClick="enableTwoFactor" />
  </div>
</template>

<script setup>
import TwoFactorBtn from "./TwoFactorBtn.vue";
</script>
