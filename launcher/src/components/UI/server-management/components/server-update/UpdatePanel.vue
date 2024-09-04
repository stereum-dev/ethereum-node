<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-12 p-2 gap-y-1">
    <UpdateServer />
  </div>
</template>

<script setup>
import { useUpdateCheck } from "@/composables/version.js";
import UpdateServer from "./UpdateServer.vue";
import { onMounted } from "vue";

onMounted(() => {
  useUpdateCheck();
});
</script>
