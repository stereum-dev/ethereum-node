<template>
  <div class="h-full col-start-20 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-12 px-1 gap-y-1">
    <ValidatorRewards />
    <ClientCommands
      @graffiti-multiple="graffitiMultiple"
      @remove-multiple="removeMultiple"
      @withdraw-multiple="withdrawMultiple"
      @import-remote="importRemote"
    />
    <EpochDuty />
  </div>
</template>

<script setup>
import ValidatorRewards from "../components/management/ValidatorRewards.vue";
import ClientCommands from "../components/management/ClientCommands.vue";
import EpochDuty from "../components/management/EpochDuty.vue";

const emit = defineEmits(["graffitiMultiple", "removeMultiple", "withdrawMultiple", "importRemote"]);

const graffitiMultiple = () => {
  emit("graffitiMultiple");
};

const removeMultiple = () => {
  emit("removeMultiple");
};

const withdrawMultiple = () => {
  emit("withdrawMultiple");
};

const importRemote = () => {
  emit("importRemote");
};
</script>
