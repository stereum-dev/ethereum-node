<template>
  <base-layout>
    <div class="Control-screen w-full h-full grid grid-cols-24 grid-rows-12 items-center bg-[#242529]">
      <ControlHeader />
      <CommonSidebar />
      <AlertSection />
    </div>
  </base-layout>
</template>

<script setup>
import ControlHeader from "./sections/ControlHeader.vue";
import CommonSidebar from "./sections/CommonSidebar.vue";
import AlertSection from "./sections/AlertSection.vue";
</script>
<style scoped>
.Control-screen {
  max-height: 488px;
}
</style>
