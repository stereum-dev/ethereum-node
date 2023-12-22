import { computed } from 'vue';
<template>
  <div
    class="w-full h-8 rounded-full grid grid-cols-24 items-center p-1 cursor-pointer animate__animated animate animate__slideInLeft animate__faster bg-gray-400 opacity-50"
  >
    <div class="flash col-start-1 col-span-1 self-center overflow-hidden flex justify-start items-center">
      <span class="w-6 h-6 rounded-full cursor-pointer bg-white flash"></span>
    </div>
    <div
      class="flash col-start-2 col-end-9 h-2 bg-slate-200 w-full rounded-full self-center overflow-hidden flex justify-start items-center"
    ></div>

    <span class="flash w-6 h-6 col-start-9 col-end-11 bg-slate-200 rounded-full self-center mx-auto"> </span>
    <span
      class="flash col-start-11 col-end-13 h-2 bg-slate-200 w-full rounded-full self-center text-center text-xs text-gray-300 overflow-hidden"
    ></span>
    <div class="w-full col-start-13 col-end-15 self-center overflow-hidden flex justify-center items-center"></div>

    <div class="flash h-full col-start-18 col-span-full bg-gray-500 rounded-full grid grid-cols-4 items-center">
      <div class="col-start-1 col-span-1 w-4 h-4 bg-gray-200 rounded-md justify-self-center"></div>
      <div class="col-start-2 col-span-1 w-4 h-4 bg-gray-200 rounded-md justify-self-center"></div>
      <div class="col-start-3 col-span-1 w-4 h-4 bg-gray-200 rounded-md justify-self-center"></div>
      <div class="col-start-4 col-span-1 w-4 h-4 bg-gray-200 rounded-md justify-self-center"></div>
    </div>
  </div>
</template>
<style scoped>
.flash {
  animation: flash 2s infinite 0.2s;
}
@keyframes flash {
  0% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 0.2;
  }
}
</style>
