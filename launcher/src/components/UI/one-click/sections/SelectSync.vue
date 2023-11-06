<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <SyncHeader />
    <SyncBody />
    <SyncFooter />
  </div>
</template>
//
<script setup>
import SyncHeader from "../components/sync/SyncHeader.vue";
import SyncBody from "../components/sync/SyncBody.vue";
import SyncFooter from "../components/sync/SyncFooter.vue";
</script>
