<template>
  <div class="col-start-1 col-span-full row-start-5 row-end-10 flex justify-center items-center overflow-hidden">
    <div
      class="w-full h-full border border-gray-600 rounded-b-md grid grid-cols-12 grid-rows-6 items-center bg-[#151618]"
    >
      <ValidatorState state="running" />
      <ButtonBox
        @graffiti-multiple="graffitiMultiple"
        @remove-multiple="removeMultiple"
        @withdraw-multiple="withdrawMultiple"
        @import-remote="importRemote"
      />
    </div>
  </div>
</template>

<script setup>
import ButtonBox from "./components/client-commands/ButtonBox.vue";
import ValidatorState from "./components/client-commands/ValidatorState.vue";

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
