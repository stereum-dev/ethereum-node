<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-2 row-end-12 grid grid-cols-24 grid-rows-12">
    <LogSidebar />
    <div class="w-full h-full col-start-2 col-span-full row-start-1 row-span-full bg-gray-500">LOGS BODY</div>
  </div>
</template>
<script setup>
import LogSidebar from "./LogSidebar";
import { ref } from "vue";
</script>
