<template>
  <div
    class="w-[180px] h-[100px] col-span-1 row-span-1 grid grid-cols-2 items-center p-1 border border-gray-500 rounded-md mx-auto"
  >
    <SetupLayout :setup="props.setup" />

    <SetupButtons
      :setup="props.setup"
      @open-setup="openSetup"
      @export-setup="exportSetup"
      @state-handler="setupState"
    />
  </div>
</template>

<script setup>
import SetupLayout from "./SetupLayout.vue";
import SetupButtons from "./SetupButtons.vue";

const props = defineProps({
  setup: Object,
});

const emit = defineEmits(["openSetup", "exportSetup", "setupState"]);

const openSetup = (item) => {
  emit("openSetup", item);
};

const exportSetup = (item) => {
  emit("exportSetup", item);
};

const setupState = (item) => {
  emit("setupState", item);
};
</script>
