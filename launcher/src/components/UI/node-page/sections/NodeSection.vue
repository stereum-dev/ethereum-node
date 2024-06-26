<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <NodeHeader />
    <NodeBody @open-expert="openExpert" @open-log="openLog" @export-setup="exportSetup" />
  </div>
</template>

<script setup>
import NodeHeader from "../components/node/NodeHeader.vue";
import NodeBody from "../components/node/NodeBody.vue";

const emit = defineEmits(["openExpert", "openLog", "exportSetup"]);

const openExpert = (item) => {
  emit("openExpert", item);
};
const openLog = (item) => {
  emit("openLog", item);
};

const exportSetup = (item) => {
  emit("exportSetup", item);
};
</script>
