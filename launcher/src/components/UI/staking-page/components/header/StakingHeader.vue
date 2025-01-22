<template>
  <div
    class="w-full h-7 col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-24 items-center rounded-md bg-[#151618] py-0 divide-x divide-gray-600"
  >
    <div
      class="col-start-1 col-end-13 h-full flex justify-start items-center bg-[#232426] divide-x divide-gray-600 rounded-l-md"
    >
      <p
        class="w-2/5 text-[10px] text-gray-400 font-medium font-sans uppercase pl-6 relative flex items-center text-center"
      >
        Page Filter

        <span
          class="ml-2 w-2 h-2 border-t-2 border-r-2 border-gray-400 transform rotate-45 text-right"
        ></span>
      </p>
      <SetupDropdown
        :list="setupList"
        :new-height="newHeight"
        new-border=""
        @select-setup="selectSetup"
        @server-view="serverView"
      />
    </div>
    <div class="col-start-13 col-span-full h-full flex justify-center items-center">
      <SearchKeys />
    </div>
  </div>
</template>
<script setup>
import { useMultiSetups } from "@/composables/multiSetups";
import { computed } from "vue";
import { useSetups } from "../../../../../store/setups";
import SetupDropdown from "../../../edit-page/components/edit/setups/SetupDropdown.vue";
import SearchKeys from "./SearchKeys.vue";

const setupStore = useSetups();

const { getSelectedSetup, getServerView } = useMultiSetups();

const newHeight = "h-7";

const setupList = computed(() => {
  return setupStore.stakingSetups;
});

const selectSetup = (setup) => {
  getSelectedSetup(setup);
};

const serverView = () => {
  getServerView();
};
</script>
