<template>
  <div class="gas-parent flex justify-center items-center flex-col w-full h-full">
    <div class="w-full h-1/3 flex justify-center items-center text-gray-200 text-xs font-bold uppercase">change</div>
    <div class="w-full h-1/3 flex justify-center items-center text-green-500 text-lg font-bold uppercase">
      {{ gasFee }}
    </div>
    <div class="w-full h-1/3 flex justify-center items-center text-gray-200 text-xs font-bold uppercase">gwei</div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const gasFee = ref("+1,022"); //dummy gas fee
</script>

<style scoped></style>
