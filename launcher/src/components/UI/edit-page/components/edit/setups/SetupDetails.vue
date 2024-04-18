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
import { useSetups } from "../../../../../../store/setups";
import SetupDropdown from "./SetupDropdown.vue";

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
});

const setupStore = useSetups();

const renameSetup = (setup) => {
  console.log("renameSetup", setup);
  setupStore.isRenameSetupActive = true;
  setupStore.setupToRename = setup;
};

const confirmRename = (setup) => {
  console.log("confirmRename", setup);
  setupStore.isRenameSetupActive = false;
};

const selectSetup = (setup) => {
  console.log("selectSetup", setup);
};
</script>
