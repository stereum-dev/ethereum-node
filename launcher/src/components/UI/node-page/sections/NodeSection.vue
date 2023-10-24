<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <NodeHeader />
    <NodeBody @open-expert="openExpert" />
  </div>
</template>
<script setup>
import NodeHeader from "../components/node/NodeHeader.vue";
import NodeBody from "../components/node/NodeBody.vue";

const emit = defineEmits(["openExpert"]);

const openExpert = (item) => {
  emit("openExpert", item);
};
</script>
