<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <div
      class="w-full h-full col-start-5 col-end-21 row-start-3 row-end-11 grid grid-cols-12 grid-rows-7 p-2 mx-auto bg-[#1E2429] rounded-md"
    >
      <div class="w-full col-start-1 col-span-full row-start-1 row-span-2 flex justify-center items-center px-2">
        <span class="text-md text-gray-300 font-semibold text-left px-2">
          {{ t("uploadConfig.message") }}
        </span>
      </div>
      <div class="col-start-1 col-span-full row-start-3 row-span-4 flex flex-col justify-start items-center px-1 gap-y-4">
        <div class="uploadBox__title">
          <span class="text-md text-gray-300 font-semibold text-left">{{ t("uploadConfig.selectConfig") }}</span>
        </div>

        <div class="w-full col-start-1 col-span-full row-start-3 row-span-2 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full">
          <label
            class="w-full h-12 col-start-1 col-span-full bg-gray-300 rounded-full py-1 px-2 cursor-pointer grid grid-cols-12"
            for="file_input"
          >
            <div class="w-full h-full col-start-1 col-end-11 self-center overflow-hidden flex justify-start items-center">
              <span class="w-fit self-center text-xl text-left font-semibold text-gray-800"> {{ fileName }}</span>
            </div>
            <input id="file_input" ref="fileInput" class="invisible" type="file" accept=".zip" @change="handleFileUpload" />
            <div class="w-full h-full col-start-12 col-span-1 flex justify-end items-center">
              <img
                class="col-start-12 col-span-1 w-10 h-10 hover:scale-105 hover:shadow-lg hover:shadow-gray-900 active:scale-100 rounded-full justify-self-end transition-all duration-300 ease-in-out"
                src="/img/icon/server-management-icons/plus-icon.png"
                alt="icon"
              />
            </div>
          </label>
        </div>
      </div>
      <Transition name="fade">
        <div
          v-if="isErrorMessageActive || isConfirmMessageActive"
          class="col-start-1 col-span-full row-start-7 row-span-1 h-5 text-md font-semibold text-center"
          :class="isErrorMessageActive ? 'text-red-500' : 'text-teal-600'"
        >
          {{ message }}
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "@/store/services";
import YAML from "yaml";
// import ControlService from "@/store/ControlService";
import JSZip from "jszip";
import { ref, onMounted } from "vue";
import i18n from "../../../../includes/i18n";

const t = i18n.global.t;
const installStore = useClickInstall();
const servicesStore = useServices();

let fileName = ref("");
let message = ref("");

const isErrorMessageActive = ref(false);
const isConfirmMessageActive = ref(false);

onMounted(() => {
  installStore.isConfigButtonEnbabled = false;
  installStore.unzippedData = [];
  installStore.configServices = [];
  fileName.value = "";
});

const handleFileUpload = async (event) => {
  // Load config .zip file
  const file = event.target.files[0];
  if (file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
    isErrorMessageActive.value = true;
    message.value = "Invalid file type. Please select a valid file.";
    return;
  }

  // Extract, then check extensions of the files (.yaml)
  isErrorMessageActive.value = false;
  fileName.value = file.name;
  const zip = await JSZip.loadAsync(file);
  const yamlFiles = zip.file(/\.yaml$/i).filter((file) => !file.name.includes("_MACOSX"));

  if (yamlFiles.length === 0) {
    isErrorMessageActive.value = true;
    message.value = "Invalid file type. Please try again with a valid file.";
    return;
  }

  // Check name of the config files
  isErrorMessageActive.value = false;
  let serviceName = [];
  for (const file of yamlFiles) {
    const data = await file.async("string");
    serviceName.push({
      name: YAML.parse(data).service,
    });
  }
  const filteredServices = servicesStore.allServices.filter((service) => {
    return serviceName.some((item) => item.name === service.service);
  });

  if (filteredServices.length === 0) {
    isErrorMessageActive.value = true;
    message.value = "Invalid configuration file.";
    return;
  }

  isErrorMessageActive.value = false;
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

  message.value = "";

  const additionalSetups = installStore.unzippedData.filter((item) => {
    return item.service === undefined && item.id === undefined && item.network === undefined;
  });

  installStore.configServices = servicesStore.allServices
    .map((service) => {
      const sameItems = installStore.unzippedData.find((item) => item.service === service.service);
      if (!sameItems) {
        return false; // Skip if no matching item found
      }
      return {
        ...sameItems,
        icon: service.icon,
        category: service.category,
        name: service.name,
      };
    })
    .filter((item) => item);

  if (additionalSetups.length) {
    installStore.configServices.push(...additionalSetups);
  }
  console.log("configServices", installStore.configServices);

  isConfirmMessageActive.value = true;
  message.value = "STEREUM CONFIG RECOGNIZED - PRESS NEXT TO CONTINUE";
  if (installStore.configServices.length && isConfirmMessageActive.value) {
    installStore.isConfigButtonEnbabled = true;
  } else if (!installStore.configServices.length || isErrorMessageActive.value) {
    installStore.isConfigButtonEnbabled = false;
  }
};
</script>
