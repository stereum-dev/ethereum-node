import ServerHeader from './components/ServerHeader.vue';
<template>
  <div
    class="w-full h-full absolute inset-0 grid grid-cols-24 grid-rows-7 bg-gray-700 z-10 p-2 rounded-md"
  >
    <ServerHeader />
    <ServerBody />
  </div>
</template>

<script setup>
import ServerHeader from "./components/ServerHeader.vue";
import ServerBody from "./components/ServerBody.vue";
</script>
