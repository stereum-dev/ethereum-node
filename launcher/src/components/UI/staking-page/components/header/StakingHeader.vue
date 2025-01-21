<template>
  <div
    class="w-full h-7 col-start-1 col-span-full row-start-1 row-span-1 grid grid-cols-24 items-center rounded-xs bg-[#151618] py-0 divide-x divide-gray-600"
  >
    <div
      class="col-start-1 col-end-11 h-full flex justify-start items-center bg-[#232426] divide-x divide-gray-600"
    >
      <p class="w-2/5 text-[10px] text-gray-400 font-medium font-sans uppercase px-2">
        Page Filter
      </p>
      <SetupDropdown
        :list="setupList"
        :new-height="newHeight"
        new-border=""
        @select-setup="selectSetup"
        @server-view="serverView"
      />
    </div>
    <div class="col-start-11 col-end-22 h-full flex justify-center items-center">
      <SearchKeys />
    </div>
    <div class="col-start-22 col-span-full h-7 flex justify-end items-center">
      <p class="w-full text-[10px] font-medium text-gray-400 uppercase pl-1">
        Selected Client
      </p>
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
