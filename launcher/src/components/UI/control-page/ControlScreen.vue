<template>
  <base-layout>
    <div class="w-full h-full grid grid-cols-24 grid-rows-12 items-center p-2">
      <ServerSection />
      <AlertSection />
      <BlockSection />
    </div>
  </base-layout>
</template>

<script setup>
import AlertSection from "./sections/AlertSection.vue";
import BlockSection from "./sections/BlockSection.vue";
import ServerSection from "./sections/ServerSection.vue";
</script>
