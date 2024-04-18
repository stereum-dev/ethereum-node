<template>
  <div
    class="col-start-4 col-end-7 grid grid-cols-6 gap-1 items-center bg-[#151618] border h-full border-gray-600 rounded-md p-2"
  >
    <SetupDropdown
      :list="props.list"
      @rename-setup="renameSetup"
      @confirm-rename="confirmRename"
      @select-setup="selectSetup"
    />
  </div>
</template>
<script setup>
import SetupDropdown from "../setups/SetupDropdown.vue";

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["renameSetup", "confirmRename", "selectSetup"]);

const renameSetup = (setup) => {
  emit("renameSetup", setup);
};

const confirmRename = (setup) => {
  emit("confirmRename", setup);
};

const selectSetup = (setup) => {
  emit("selectSetup", setup);
};
</script>
