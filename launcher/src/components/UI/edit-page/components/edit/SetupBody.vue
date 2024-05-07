<template>
  <div
    class="w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-hidden mt-1 bg-[#151618] relative"
    :class="manageStore.disableConfirmButton ? 'opacity-70 pointer-events-none' : ''"
  >
    <div class="w-full h-full max-h-full rounded-md grid grid-cols-24 grid-rows-12">
      <div
        class="col-start-1 col-span-full row-start-1 row-span-1 w-full mx-auto h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] flex justify-center items-center overflow-hidden"
      >
        <span class="text-xs text-gray-300 text-center font-sans">All Setups</span>
      </div>
      <div
        class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full grid grid-cols-3 auto-rows-fr scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto overflow-x-hidden items-start"
      >
        <SingleSetup
          v-for="setup in setupStore.editSetups.filter(
            (s) => s.setupName !== 'commonServices'
          )"
          :key="setup.setupName"
          :setup="setup"
          @delete-setup="deleteSetup"
          @connect-setup="connectSetup"
          @info-modal="infoModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SingleSetup from "./setups/SingleSetup.vue";
import { useNodeManage } from "@/store/nodeManage";
import { useSetups } from "../../../../../store/setups";

const emit = defineEmits(["deleteSetup", "connectSetup", "infoModal"]);

const manageStore = useNodeManage();
const setupStore = useSetups();

// Methods

const deleteSetup = (item) => {
  emit("deleteSetup", item);
};

const connectSetup = (item) => {
  emit("connectSetup", item);
};

const infoModal = (item) => {
  emit("infoModal", item);
};
</script>
