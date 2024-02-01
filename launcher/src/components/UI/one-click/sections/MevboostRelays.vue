<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <MevboostHeader />
    <MevboostBody />
    <MevboostFooter />
  </div>
</template>

<script setup>
import MevboostHeader from "../components/mevboost/MevboostHeader.vue";
import MevboostBody from "../components/mevboost/MevboostBody.vue";
import MevboostFooter from "../components/mevboost/MevboostFooter.vue";
</script>
