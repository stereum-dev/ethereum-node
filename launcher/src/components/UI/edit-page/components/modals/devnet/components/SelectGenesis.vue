<script setup>
import { ref } from "vue";
import { useSetups } from "../../../../../../../store/setups"; // Adjust the path as needed

const setupStore = useSetups();
const errorMessage = ref("");

const getGenesisFile = (event) => {
  const file = event.target.files[0];
  if (file && file.name.endsWith(".json")) {
    setupStore.devnetConfigData.uploadedGenesisConfig = file;
    setupStore.devnetButtonDisabled = false;
    setupStore.currentStep = 5; // Automatically move to the summary step
    errorMessage.value = "";
  } else {
    setupStore.devnetConfigData.uploadedGenesisConfig = null;
    errorMessage.value = "Please upload a valid JSON file.";
    setupStore.devnetButtonDisabled = true;
  }
};

const createNewGenesis = () => {
  setupStore.isGenesisCreated = true;
  setupStore.devnetButtonDisabled = false;
  errorMessage.value = "";
  // Move to the next step (ConfigGenesis)
  setupStore.currentStep = 3;
};

const confirmSelection = () => {
  if (setupStore.devnetConfigData.uploadedGenesisConfig) {
    setupStore.currentStep = 5;
  } else if (setupStore.isGenesisCreated) {
    setupStore.currentStep = 3;
  } else {
    errorMessage.value =
      "Please either upload a Genesis file or choose to create a new one.";
  }
};

// Expose the confirmSelection method to the parent component
defineExpose({ confirmSelection });
</script>

<template>
  <div
    class="w-3/4 max-h-[300px] grid grid-cols-6 grid-rows-8 py-4 px-8 mt-2 gap-y-1 mx-auto"
  >
    <div
      class="w-full max-h-full col-start-1 col-span-full row-start-2 row-end-8 flex flex-col justify-between items-center"
    >
      <div class="w-full flex justify-between items-center">
        <div
          class="bg-[#336666] hover:bg-[#488d8d] hover:scale-105 transition-all ease-in-out duration-150 hover:shadow-2xl hover:shadow-black active:scale-100 flex justify-center items-center shadow-md shadow-black p-1 h-14 w-[170px] rounded-md overflow-hidden my-4 mx-auto active:shadow-none"
        >
          <label
            for="uploadFile"
            class="capitalize font-sans font-semibold text-lg px-2 py-2.5 outline-none rounded-md cursor-pointer mx-auto w-max block text-gray-200"
          >
            Import Genesis
          </label>
          <input
            id="uploadFile"
            type="file"
            class="hidden"
            accept=".json"
            @change="getGenesisFile"
          />
        </div>
        <div
          class="bg-[#336666] hover:bg-[#488d8d] hover:scale-105 transition-all ease-in-out duration-150 hover:shadow-2xl hover:shadow-black active:scale-100 flex justify-center items-center shadow-md shadow-black p-1 h-14 w-[170px] rounded-md overflow-hidden my-4 mx-auto cursor-pointer active:shadow-none"
          @click="createNewGenesis"
        >
          <span
            class="text-center text-lg capitalize font-sans font-semibold text-gray-200"
          >
            Create Genesis
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
