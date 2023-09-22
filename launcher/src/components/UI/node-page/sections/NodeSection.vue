<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <EditHeader />
    <NodeBody @open-expert="openExpert" />
  </div>
</template>
<script setup>
import EditHeader from "../../edit-page/components/edit/EditHeader.vue";
import NodeBody from "../components/node/NodeBody.vue";

const emit = defineEmits(["openExpert"]);

const openExpert = (item) => {
  emit("openExpert", item);
};
</script>
