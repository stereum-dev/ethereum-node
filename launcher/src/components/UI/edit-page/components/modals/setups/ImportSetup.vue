<template>
  <custom-modal
    main-title="IMPORT CONFIG FILES"
    confirm-text="Import"
    click-outside-text="Click outside to cancel"
    :disabled-button="sucessMessage === ''"
    @close-window="closeWindow"
    @confirm-action="confirmImport"
  >
    <template #content>
      <div class="w-full h-full grid grid-cols-6 grid-rows-3 py-4 px-8 mt-12 gap-y-1">
        <div
          class="col-start-2 col-end-6 row-start-1 row-span-1 flex justify-center items-center px-2"
        >
          <span class="text-sm text-left text-gray-400"
            >Select the zip folder containing the yaml configs files to import a new
            config into Stereum.</span
          >
        </div>
        <div
          class="col-start-2 col-end-6 row-start-2 row-span-1 flex justify-center items-center p-1"
        >
          <label
            for="file-upload"
            class="w-full h-full p-1 cursor-pointer grid grid-cols-12 bg-[#151618] border border-gray-700 rounded-md"
          >
            <input
              v-model="filePath"
              type="text"
              class="w-full h-full col-start-1 col-end-12 px-2 bg-transparent text-gray-300 font-sans text-xs overflow-hidden"
            />
            <img
              class="w-6 col-start-12 col-span-full self-center mx-auto hover:scale-110 transition-all duration-100 active:scale-90 hover:shadow-md hover shadow-black"
              src="/img/icon/server-management-icons/plus-icon.png"
              alt="Check Icon"
              @mousedown.prevent
            />
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              class="hidden"
              @change="onFileChanged"
            />
          </label>
        </div>
        <div
          v-if="sucessMessage !== ''"
          class="w-full h-full col-start-1 col-span-full row-start-3 row-span-1 flex justify-center items-center"
        >
          <span class="text-sm text-green-500 font-sans text-center">{{
            sucessMessage
          }}</span>
        </div>
        <div
          v-if="errorMessage !== ''"
          class="w-full h-full col-start-1 col-span-full row-start-3 row-span-1 flex justify-center items-center"
        >
          <span class="text-sm text-red-500 font-sans text-center">{{
            errorMessage
          }}</span>
        </div>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import { ref } from "vue";
import CustomModal from "../CustomModal.vue";
import jsYaml from "js-yaml";
import JSZip from "jszip";
import { useSetups } from "@/store/setups";
import { useNodeManage } from "../../../../../../store/nodeManage";

const emit = defineEmits(["confirmImport", "closeWindow"]);
const setupStore = useSetups();
const manageStore = useNodeManage();

const filePath = ref("");
const sucessMessage = ref("");
const errorMessage = ref("");

const onFileChanged = async (event) => {
  const file = event.target.files[0];
  if (!file) {
    errorMessage.value = "No file selected.";
    return;
  }

  filePath.value = file.name;
  if (!file.name.endsWith(".zip")) {
    errorMessage.value = "Please upload a ZIP file.";
    sucessMessage.value = "";
    return;
  }

  try {
    const zip = new JSZip();
    const content = await zip.loadAsync(file); // Read the ZIP file
    let yamlFiles = [];
    content.forEach((relativePath, zipEntry) => {
      if (relativePath.endsWith(".yaml") || relativePath.endsWith(".yml")) {
        yamlFiles.push(zipEntry.async("string"));
        console.log("yaml  Files", yamlFiles);
      }
    });

    if (yamlFiles.length === 0) {
      throw new Error("No YAML files found in the ZIP.");
    }

    // Validate all YAML files in parallel
    await Promise.all(
      yamlFiles.map(async (filePromise) => {
        const yamlContent = await filePromise;
        const loadedYamls = jsYaml.load(yamlContent); // Validate YAML content
        console.log("loadedYamls", loadedYamls);
      })
    );

    sucessMessage.value = "All files are valid YAML.";
    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = error.message;
    sucessMessage.value = "";
  }
};

const confirmImport = () => {
  if (errorMessage.value) {
    console.log("Fix errors before importing.");
    return;
  }
  emit("confirmImport");
  console.log("Importing ZIP file:", setupStore.importedSetupFile);
};

const closeWindow = () => {
  manageStore.isImportSetupYamlActive = false;
  filePath.value = "";
  sucessMessage.value = "";
  errorMessage.value = "";
};
</script>
