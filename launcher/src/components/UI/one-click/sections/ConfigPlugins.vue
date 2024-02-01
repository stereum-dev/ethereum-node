<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <ConfigHeader />
    <ConfigBody />
    <ConfigFooter />
  </div>
</template>
<script setup>
import ConfigHeader from "../components/plugin/ConfigHeader.vue";
import ConfigBody from "../components/plugin/ConfigBody.vue";
import ConfigFooter from "../components/plugin/ConfigFooter.vue";
</script>
