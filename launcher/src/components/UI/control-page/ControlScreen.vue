<template>
  <base-layout>
    <div class="w-full h-full grid grid-cols-24 grid-rows-12 items-center p-2 bg-[#242529]">
      <ServerDashboard />
      <AlertSection />
      <NodeDashboard />
    </div>
  </base-layout>
</template>

<script setup>
import AlertSection from "./sections/AlertSection.vue";
import NodeDashboard from "./sections/NodeDashboard.vue";
import ServerDashboard from "./sections/ServerDashboard.vue";
</script>
