<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-11 row-span-2 grid grid-cols-12 gird-rows-2 px-4" @mousedown.prevent>
    <router-link
      to="/oneClick/preset"
      class="col-start-1 col-span-2 row-start-1 row-span-2 justify-self-end w-[120px] h-12 bg-[#264744] hover:bg-[#447a75] rounded-full py-2 px-4 flex justify-center items-center hover:scale-110 hover:shadow-lg hover:shadow-[#1e2a29] transition-all duration-300 ease-in-out active:scale-100 active:shadow-none"
    >
      <span class="text-gray-200 text-xl font-semibold text-center uppercase">Back</span>
    </router-link>
    <router-link
      :to="nextRoute"
      class="col-start-11 col-span-1 row-start-1 row-span-2 w-[120px] h-12 bg-[#264744] hover:bg-[#447a75] rounded-full py-2 px-4 flex justify-center items-center hover:scale-110 hover:shadow-lg hover:shadow-[#1e2a29] transition-all duration-300 ease-in-out active:scale-100 active:shadow-none cursor-pointer"
    >
      <span class="text-gray-200 text-xl font-semibold text-center uppercase">{{ $t("customFooter.next") }}</span>
    </router-link>
  </div>
</template>
<script setup>
import { goToNext } from "@/composables/nextRoute";

const nextRoute = goToNext();
</script>
