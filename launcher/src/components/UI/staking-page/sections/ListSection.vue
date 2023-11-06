<template>
  <div class="h-full col-start-2 col-end-20 row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <div
      class="colstart-1 col-span-full row-start-1 row-span-full border-2 border-gray-500 bg-[#151618] grid grid-cols-24 grid-rows-12 rounded-md"
    >
      <ListHeader />
      <ListBody />
      <ListFooter />
    </div>
  </div>
</template>
<script setup>
import ListHeader from "../components/list/ListHeader.vue";
import ListBody from "../components/list/ListBody.vue";
import ListFooter from "../components/list/ListFooter.vue";
</script>
