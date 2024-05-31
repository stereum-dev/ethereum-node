<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full pt-1 mt-1">
    <ServiceBody @change-connection="changeConnection" @delete-service="deleteService" />
  </div>
</template>

<script setup>
import ServiceBody from "../components/service/ServiceBody.vue";

const emit = defineEmits(["changeConnection", "deleteService"]);

const changeConnection = (item) => {
  emit("changeConnection", item);
};

const deleteService = (item) => {
  emit("deleteService", item);
};
</script>
