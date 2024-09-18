<template>
  <div
    class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12"
  >
    <OnlyHeader />
    <OnlyBody />
    <OnlyFooter />
  </div>
</template>

<script setup>
import OnlyHeader from "../components/vconly/OnlyHeader.vue";
import OnlyBody from "../components/vconly/OnlyBody.vue";
import OnlyFooter from "../components/vconly/OnlyFooter.vue";
</script>
