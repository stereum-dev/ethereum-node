<template>
  <div
    class="w-full h-full col-start-1 col-end-10 row-start-1 row-span-full grid grid-cols-12 grid-rows-12 p-2"
  >
    <ServerDetails />
    <SshManagement />
  </div>
</template>

<script setup>
import ServerDetails from "./ServerDetails.vue";
import SshManagement from "./SshManagement.vue";
</script>
