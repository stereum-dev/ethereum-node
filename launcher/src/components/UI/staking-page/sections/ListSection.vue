<template>
  <div class="h-full col-start-2 col-end-20 row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <div
      class="h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12 rounded-md relative overflow-hidden"
    >
      <ListHeader />
      <ListBody @on-drop="onDrop" />
      <ListPanels
        @confirm-grouping="confirmGrouping"
        @pick-validator="pickValidator"
        @upload-file="uploadFile"
        @confirm-password="confirmPassword"
      />
    </div>
  </div>
</template>
<script setup>
import ListHeader from "../components/list/ListHeader.vue";
import ListBody from "../components/list/ListBody.vue";
import ListPanels from "../components/list/ListPanels.vue";

const emit = defineEmits(["confirmGrouping", "pickValidator", "uploadFile", "confirmPassword", "onDrop"]);

const confirmGrouping = (groupName) => {
  emit("confirmGrouping", groupName);
};

const pickValidator = (service) => {
  emit("pickValidator", service);
};

const uploadFile = (event) => {
  emit("uploadFile", event);
};

const confirmPassword = (password) => {
  emit("confirmPassword", password);
};

const onDrop = (event) => {
  emit("onDrop", event);
};
</script>
