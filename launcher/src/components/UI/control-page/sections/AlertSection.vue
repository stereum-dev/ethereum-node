<template>
  <div class="w-full h-full col-start-7 col-end-10 grid-cols-5 grid-rows-12 items-center">
    <AlertHeader />
    <AlertBody />
  </div>
</template>

<script setup>
import AlertBody from "../components/alert/AlertBody.vue";
import AlertHeader from "../components/alert/AlertHeader.vue";
</script>
