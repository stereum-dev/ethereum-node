<template>
  <custom-modal
    main-title="IMPORT CONFIG FILES"
    confirm-text="Import"
    click-outside-text="Click outside to cancel"
    :disabled-button="!installStore.isConfigButtonEnbabled"
    @close-window="closeWindow"
    @confirm-action="confirmImport"
  >
    <template #content>
      <div class="w-full h-full grid grid-cols-6 grid-rows-3 py-4 px-8 mt-12 gap-y-1">
        <div class="col-start-2 col-end-6 row-start-1 row-span-1 flex justify-center items-center px-2">
          <span class="text-sm text-left text-gray-400"
            >Select the zip folder containing the yaml configs files to import a new config into Stereum.</span
          >
        </div>
        <div class="col-start-2 col-end-6 row-start-2 row-span-1 flex justify-center items-center p-1">
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
            <input id="file-upload" name="file-upload" type="file" class="hidden" @change="handleFileUpload" />
          </label>
        </div>
        <div
          v-if="sucessMessage !== ''"
          class="w-full h-full col-start-1 col-span-full row-start-3 row-span-1 flex justify-center items-center"
        >
          <span class="text-sm text-green-500 font-sans text-center">{{ sucessMessage }}</span>
        </div>
        <div
          v-if="errorMessage !== ''"
          class="w-full h-full col-start-1 col-span-full row-start-3 row-span-1 flex justify-center items-center"
        >
          <span class="text-sm text-red-500 font-sans text-center">{{ errorMessage }}</span>
        </div>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import { ref } from "vue";
import CustomModal from "../CustomModal.vue";
import JSZip from "jszip";
import { useSetups } from "@/store/setups";
import { useNodeManage } from "../../../../../../store/nodeManage";
import YAML from "yaml";
import { useServices } from "@/store/services";
import { useClickInstall } from "@/store/clickInstallation";

const emit = defineEmits(["confirmImport", "closeWindow"]);
const setupStore = useSetups();
const servicesStore = useServices();
const installStore = useClickInstall();
const manageStore = useNodeManage();

const filePath = ref("");
const fileName = ref("");
const sucessMessage = ref("");
const errorMessage = ref("");

const handleFileUpload = async (event) => {
  // Load config .zip file
  const file = event.target.files[0];
  if (file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
    errorMessage.value = "Invalid file type. Please select a valid file.";
    return;
  }

  // Extract, then check extensions of the files (.yaml)
  errorMessage.value = "";
  fileName.value = file.name;
  filePath.value = file.name;
  const zip = await JSZip.loadAsync(file);
  const yamlFiles = zip.file(/\.yaml$/i).filter((file) => !file.name.includes("_MACOSX"));

  if (yamlFiles.length === 0) {
    errorMessage.value = "Invalid file type. Please try again with a valid file.";
    return;
  }

  // Check name of the config files
  errorMessage.value = "";
  let serviceName = [];
  for (const file of yamlFiles) {
    const data = await file.async("string");

    if (data) {
      const parsedData = YAML.parse(data);
      if (parsedData.service !== undefined) {
        serviceName.push({
          name: parsedData.service,
        });
      }
    }
  }
  const filteredServices = servicesStore.allServices.filter((service) => {
    return serviceName.some((nameObj) => nameObj.name === service.service);
  });

  if (filteredServices.length === 0) {
    errorMessage.value = "Invalid configuration file.";
    return;
  }

  errorMessage.value = "";
  let rootPath = "";
  for (const file of yamlFiles) {
    const data = await file.async("string");
    let serviceVolume = YAML.parse(data).volumes?.find((el) => el.includes(YAML.parse(data).id));
    let split = {};

    if (serviceVolume) {
      let path = serviceVolume.split(YAML.parse(data).id)[0];
      split = path.split("/");
    }
    rootPath = serviceVolume
      ? split.slice(0, split.length - 1).join("/") + "/"
      : YAML.parse(data).service === "PrometheusNodeExporterService"
      ? "/"
      : rootPath;

    installStore.unzippedData.push({
      service: YAML.parse(data).service,
      id: YAML.parse(data).id,
      network: YAML.parse(data).network,
      content: data,
      path: rootPath,
    });
  }

  setupStore.setupDataToImport = installStore.unzippedData;
  if (setupStore.setupDataToImport.length) {
    installStore.isConfigButtonEnbabled = true;
    errorMessage.value = "";
    sucessMessage.value = "STEREUM SETUP RECOGNIZED - PRESS IMPORT TO CONTINUE";
  } else {
    errorMessage.value = "Invalid configuration file.";
  }
};

const confirmImport = async () => {
  if (errorMessage.value) {
    installStore.configServices = [];
    setupStore.setupDataToImport = [];
    return;
  }
  emit("confirmImport", setupStore.setupDataToImport);
};

const closeWindow = () => {
  manageStore.isImportSetupYamlActive = false;
  installStore.configServices = [];
  filePath.value = "";
  sucessMessage.value = "";
  errorMessage.value = "";
};
</script>
