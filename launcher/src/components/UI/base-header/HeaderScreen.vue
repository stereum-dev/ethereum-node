<template>
  <div
    class="w-full rounded-t-lg h-16 bg-gradient-to-b from-10% from-[#264744] via-[#325d5a] vie-10% to-[#264744] to-95% border-b border-[#1c3634] grid grid-cols-24"
  >
    <LogoSection />
    <TabsSection />
    <ServiceSection />
    <MenuSection />
  </div>
</template>
<script setup>
import LogoSection from "./sections/LogoSection.vue";
import TabsSection from "./sections/TabsSection.vue";
import ServiceSection from "./sections/ServiceSection.vue";
import MenuSection from "./sections/MenuSection.vue";
</script>
