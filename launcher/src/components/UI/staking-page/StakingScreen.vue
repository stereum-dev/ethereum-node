<template>
  <base-layout>
    <SidebarSection />
    <ListSection />
    <ManagementSection />
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import ListSection from "./sections/ListSection.vue";
import ManagementSection from "./sections/ManagementSection.vue";
</script>
