<template>
  <div class="h-full col-start-20 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-12 px-1 gap-y-1">
    <ValidatorRewards />
    <ClientCommands @graffiti-panel="graffitiPanel" @import-remote="importRemote" @withdraw-multiple="withdrawMultiple" />
    <EpochDuty />
  </div>
</template>

<script setup>
import ValidatorRewards from "../components/management/ValidatorRewards.vue";
import ClientCommands from "../components/management/ClientCommands.vue";
import EpochDuty from "../components/management/EpochDuty.vue";

const emit = defineEmits(["graffitiPanel", "importRemote", "withdrawMultiple"]);

const graffitiPanel = () => {
  emit("graffitiPanel");
};

const importRemote = () => {
  emit("importRemote");
};

const withdrawMultiple = () => {
  emit("withdrawMultiple");
};
</script>
