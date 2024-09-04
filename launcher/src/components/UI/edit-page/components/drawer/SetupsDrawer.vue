<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-6 grid-rows-15 items-center gap-y-2">
    <div
      class="col-start-1 col-span-full row-start-1 row-span-1 w-full h-full bg-[#151618] rounded-md p-1 flex justify-center items-center"
    >
      <div class="w-full h-full rounded-sm flex justify-center items-center">
        <span class="text-xs text-center text-gray-300 font-normal font-sans uppercase mt-1">Select A Network</span>
      </div>
    </div>
    <div class="col-start-1 col-span-full row-start-2 row-end-14 w-full h-full bg-[#1d1f21] rounded-md grid grid-cols-2 grid-rows-12">
      <div
        class="col-start-1 col-span-full row-start-1 row-span-full bg-black rounded-b-md flex flex-col justify-start items-center p-1 overflow-x-hidden overflow-y-auto space-y-1 border border-gray-700 scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-800"
      >
        <div
          v-for="network in manageStore.networkList"
          :key="network"
          class="w-full h-7 bg-[#282a2c] rounded-sm border border-gray-500 items-center mx-auto cursor-pointer hover:bg-gray-700 transition-all duration-100 grid grid-cols-5"
          @click="getNetwork(network)"
        >
          <img class="col-start-1 col-span-1 w-5 self-center mx-auto" :src="network.icon" alt="Network" />
          <span class="col-start-2 col-span-full text-left text-xs font-sans text-gray-200 ml-1">{{ network?.name }} </span>
        </div>
      </div>
    </div>

    <div
      class="col-start-1 col-span-full row-start-14 row-span-full w-full h-full bg-[#151618] rounded-md flex flex-col justify-between items-center p-1 shadow-sm shadow-black active:shadow-none border border-gray-700 opacity-50 pointer-events-none"
    >
      <span class="text-2xs text-center text-gray-100 font-semibold font-sans uppercase mt-1">Create Custom Setup</span>

      <div
        class="w-full h-8 bg-teal-700 rounded-sm text-center p-1 cursor-pointer hover:bg-teal-900 transition-all duration-100"
        @click="createCustom"
      >
        <span class="text-sm text-gray-200 uppercase">Custom Setup</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNodeManage } from "../../../../../store/nodeManage";

const emit = defineEmits(["getNetwork", "createCustom"]);
const manageStore = useNodeManage();

const getNetwork = (network) => {
  emit("getNetwork", network);
};

const createCustom = () => {
  emit("createCustom");
};
</script>
