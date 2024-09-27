<template>
  <div class="pair-state-parent w-full h-full flex flex-col justify-center items-center">
    <div class="index-line w-full h-1/2 flex justify-center items-center pl-2">
      <div class="icon-box w-1/4 h-full flex justify-center items-center">
        <img class="w-7 h-7" src="/img/icon/service-icons/execution/Geth.png" alt="execution" />
      </div>
      <div class="status-box w-3/4 h-full flex justify-center items-center uppercase text-xs text-green-500 font-semibold">
        {{ (state = "online") }}
      </div>
    </div>
    <div class="index-line w-full h-1/2 flex justify-center items-center pl-2">
      <div class="icon-box w-1/4 h-full flex justify-center items-center">
        <img class="w-7 h-7" src="/img/icon/service-icons/consensus/LightHouse.png" alt="execution" />
      </div>
      <div class="status-box w-3/4 h-full flex justify-center items-center uppercase text-xs text-red-500 font-semibold">
        {{ (state = "offline") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const state = ref("");
</script>

<style scoped></style>
