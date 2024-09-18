<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <NodeHeader />
    <NodeBody @open-expert="openExpert" @open-log="openLog" @export-setup="exportSetup" @external-modify="externalModify" />
  </div>
</template>

<script setup>
import NodeHeader from "../components/node/NodeHeader.vue";
import NodeBody from "../components/node/NodeBody.vue";

const emit = defineEmits(["openExpert", "openLog", "exportSetup", "externalModify"]);

const openExpert = (item) => {
  emit("openExpert", item);
};
const openLog = (item) => {
  emit("openLog", item);
};

const exportSetup = (item) => {
  emit("exportSetup", item);
};

const externalModify = (item) => {
  emit("externalModify", item);
};
</script>
