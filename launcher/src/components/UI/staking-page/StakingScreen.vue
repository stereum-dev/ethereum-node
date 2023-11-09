<template>
  <base-layout>
    <div class="w-full h-full max-h-full grid grid-cols-24 grid-rows-12 p-1">
      <SidebarSection />
      <ListSection />
      <!-- <ManagementSection /> -->
    </div>
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import ListSection from "./sections/ListSection.vue";
import ManagementSection from "./sections/ManagementSection.vue";
</script>
