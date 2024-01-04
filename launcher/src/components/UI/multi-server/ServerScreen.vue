import ServerHeader from './components/ServerHeader.vue';
<template>
  <div class="w-screen h-screen absolute inset-0 grid grid-cols-24 grid-rows-12 bg-blue-500 z-10">
    <ServerHeader />
    <ServerBody />
  </div>
</template>

<script setup>
import ServerHeader from "./components/ServerHeader.vue";
import ServerBody from "./components/ServerBody.vue";
</script>
