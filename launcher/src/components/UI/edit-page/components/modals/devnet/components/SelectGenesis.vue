<script setup>
import { ref } from "vue";
import { useSetups } from "../../../../../../../store/setups"; // Adjust the path as needed

const setupStore = useSetups();
const uploadedFile = ref(null);
const errorMessage = ref("");

const getGenesisFile = (event) => {
  const file = event.target.files[0];
  if (file && file.name.endsWith(".json")) {
    uploadedFile.value = file;
    errorMessage.value = "";
    setupStore.uploadedGenesisFile = file;
    setupStore.devnetButtonDisabled = false;
  } else {
    uploadedFile.value = null;
    errorMessage.value = "Please upload a valid JSON file.";
    setupStore.uploadedGenesisFile = null;
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
  if (uploadedFile.value) {
    // If a file is uploaded, move to the SummaryDisplay step
    setupStore.currentStep = 5;
  } else if (setupStore.isGenesisCreated) {
    // If "Create Genesis" was selected, move to the ConfigGenesis step
    setupStore.currentStep = 3;
  } else {
    errorMessage.value = "Please either upload a Genesis file or choose to create a new one.";
  }
};

// Expose the confirmSelection method to the parent component
defineExpose({ confirmSelection });
</script>

<template>
  <div class="w-3/4 max-h-[300px] grid grid-cols-6 grid-rows-8 py-4 px-8 mt-2 gap-y-1 mx-auto">
    <div
      class="w-full max-h-full col-start-1 col-span-full row-start-2 row-end-8 flex flex-col justify-between items-center"
    >
      <div class="w-full flex justify-between items-center">
        <div
          class="bg-[#336666] flex justify-center items-center shadow-md shadow-black p-1 h-12 w-[150px] font-[sans-serif] rounded-md overflow-hidden my-4 mx-auto active:shadow-none"
        >
          <label
            for="uploadFile"
            class="text-white text-md px-2 py-2.5 outline-none rounded-md cursor-pointer mx-auto w-max block"
          >
            Import Genesis
          </label>
          <input id="uploadFile" type="file" class="hidden" accept=".json" @change="getGenesisFile" />
        </div>
        <div
          class="bg-[#336666] text-white flex justify-center items-center shadow-md shadow-black p-1 h-12 w-[150px] font-[sans-serif] rounded-md overflow-hidden my-4 mx-auto cursor-pointer active:shadow-none"
          @click="createNewGenesis"
        >
          <div class="flex justify-evenly items-center">Create Genesis</div>
        </div>
      </div>
      <div class="w-full flex justify-center items-center px-8">
        <div
          class="w-full h-9 bg-white text-[#333] flex items-center shadow-md shadow-black p-1 font-[sans-serif] rounded-md overflow-hidden my-4 mx-auto"
        >
          <span v-if="uploadedFile">{{ uploadedFile.name }}</span>
          <span v-else-if="setupStore.isGenesisCreated">New Genesis will be created</span>
          <span v-else-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
          <span v-else> </span>
        </div>
      </div>
    </div>
  </div>
</template>
