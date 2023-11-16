<template>
  <div class="h-full col-start-2 col-end-20 row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <div
      class="max-h-[468px] col-start-1 col-span-full row-start-1 row-span-full border bg-[#151618] grid grid-cols-24 grid-rows-12 rounded-md relative"
      :class="stakingStore.isOverDropZone ? 'border-dashed border border-blue-500 ' : 'border-gray-600'"
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
import { useStakingStore } from "@/store/theStaking";

const emit = defineEmits(["confirmGrouping", "pickValidator", "uploadFile", "confirmPassword", "onDrop"]);
const stakingStore = useStakingStore();

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
