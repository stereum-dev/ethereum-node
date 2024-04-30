<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-6 grid-rows-15 items-center gap-y-2"
  >
    <div
      class="col-start-1 col-span-full row-start-1 row-end-7 w-full h-full bg-[#292e32] rounded-md"
    ></div>

    <div
      class="col-start-1 col-span-full row-start-7 row-end-9 w-full h-full bg-[#151618] rounded-md flex flex-col justify-between items-center p-1 shadow-sm shadow-black active:shadow-none border border-gray-700"
    >
      <span class="text-xs text-center text-gray-100 font-sans uppercase mt-1"
        >Create a setup</span
      >

      <div
        class="w-full h-8 bg-teal-700 rounded-sm text-center p-1 cursor-pointer hover:bg-teal-900 transition-all duration-100"
        @click="createSetup"
      >
        <span class="text-sm text-gray-200 uppercase">Create</span>
      </div>
    </div>
    <div
      class="col-start-1 col-span-full row-start-9 row-end-11 w-full h-full bg-[#151618] rounded-md flex flex-col justify-between items-center p-1 shadow-sm shadow-black active:shadow-none border border-gray-700"
    >
      <span class="text-xs text-center text-gray-100 font-sans uppercase mt-1"
        >IMPORT A CONFIG</span
      >

      <div
        class="w-full h-8 bg-teal-700 rounded-sm text-center p-1 cursor-pointer hover:bg-teal-900 transition-all duration-100"
        @click="importSetup"
      >
        <span class="text-sm text-gray-200 uppercase">Import</span>
      </div>
    </div>
    <div
      class="col-start-1 col-span-full row-start-11 row-span-full w-full h-full bg-[#292e32] rounded-md grid grid-cols-6 grid-rows-6 items-start gap-y-1 p-1"
    >
      <span
        class="col-start-1 col-span-full row-start-1 row-span-1 text-xs text-center text-gray-100 font-sans uppercase"
        >ADD A SERVER SERVICE</span
      >
      <div
        class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full max-h-full overflow-x-hidden overflow-y-auto flex flex-col justify-start items-center space-y-1 bg-[#151618]"
      >
        <div
          v-for="service in serverServices"
          :key="service"
          class="w-full bg-gray-700 rounded-sm border border-gray-500 mx-auto h-6 shadow-md shadow-black"
        >
          {{ service }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["importSetup", "createSetup"]);
const serverServices = ref([1, 2, 3]);

const importSetup = () => {
  emit("importSetup");
};

const createSetup = () => {
  emit("createSetup");
};
</script>
