<template>
  <div class="col-start-4 col-end-7 grid grid-cols-6 gap-1 items-center bg-[#151618] border h-full border-gray-600 rounded-md p-2">
    <SetupDropdown
      :list="props.list"
      @select-rename="selectRename"
      @confirm-rename="confirmRename"
      @select-setup="selectSetup"
      @server-view="serverView"
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

const emit = defineEmits(["selectRename", "confirmRename", "selectSetup", "serverView"]);

const selectRename = (setup) => {
  emit("selectRename", setup);
};

const confirmRename = () => {
  emit("confirmRename");
};

const selectSetup = (setup) => {
  emit("selectSetup", setup);
};
const serverView = () => {
  emit("serverView");
};
</script>
