<template>
  <div class="col-start-1 col-span-full row-start-5 row-end-10 flex justify-center items-center overflow-hidden">
    <div class="w-full h-full border border-gray-600 rounded-b-md grid grid-cols-12 grid-rows-6 items-center bg-[#151618]">
      <ValidatorState />
      <ButtonBox @graffiti-panel="graffitiPanel" @import-remote="importRemote" @withdraw-multiple="withdrawMultiple" />
    </div>
  </div>
</template>
<script setup>
import ButtonBox from "./components/client-commands/ButtonBox.vue";
import ValidatorState from "./components/client-commands/ValidatorState.vue";

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
