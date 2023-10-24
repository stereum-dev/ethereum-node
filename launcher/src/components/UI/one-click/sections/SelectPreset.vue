<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <PresetHeader />
    <PresetBody />
    <PresetFooter />
  </div>
</template>
<script setup>
import PresetHeader from "../components/presets/PresetHeader.vue";
import PresetBody from "../components/presets/PresetBody.vue";
import PresetFooter from "../components/presets/PresetFooter.vue";
</script>
