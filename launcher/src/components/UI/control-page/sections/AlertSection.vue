<template>
  <div class="w-full h-full col-start-7 col-end-10 row-start-2 row-span-full flex justify-center items-center pt-2 pb-1">
    <ControlAlert @expert-handler="expertHandler" />
  </div>
</template>

<script setup>
import ControlAlert from "../components/alert/ControlAlert.vue";

const emit = defineEmits(["expertHandler"]);

const expertHandler = (data) => {
  emit("expertHandler", data);
};
</script>
