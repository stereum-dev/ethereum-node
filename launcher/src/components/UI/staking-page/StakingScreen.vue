<template>
  <base-layout>
    <div class="w-full h-full max-h-full grid grid-cols-24 grid-rows-12 py-1">
      <SidebarSection />
      <ListSection
        @confirm-grouping="confirmGrouping"
        @pick-validator="pickValidatorService"
        @upload-file="uploadValidatorKey"
        @confirm-password="passwordValidation"
        @on-drop="onDrop"
        @delete-key="deletePreviewKey"
        @open-group="openGroupList"
        @rename-group="renameGroup"
        @withdraw-group="withdrawGroup"
        @remove-group="removeGroup"
      />
      <ManagementSection />
    </div>
    <transition
      tag="div"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <component :is="activeModal?.component" v-bind="activeModal?.props" v-on="activeModal?.events" />
    </transition>
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import ListSection from "./sections/ListSection.vue";
import ManagementSection from "./sections/ManagementSection.vue";
import ControlService from "../../../store/ControlService";
import ImportValidator from "./components/modals/ImportValidator.vue";
import RiskWarning from "./components/modals/RiskWarning.vue";
import { v4 as uuidv4 } from "uuid";
import { useDeepClone } from "@/composables/utils";
import { useListKeys } from "@/composables/validators";
import { useStakingStore } from "@/store/theStaking";
import { computed, onMounted } from "vue";
import { useServices } from "@/store/services";

//Store
const stakingStore = useStakingStore();
const serviceStore = useServices();

const modals = {
  import: {
    component: ImportValidator,

    props: {},
  },
  risk: {
    component: RiskWarning,
  },
};
//Computed & Watchers

const activeModal = computed(() => {
  const modalConfig = modals[stakingStore.activeModal] || {};
  return {
    component: modalConfig.component || null,
    props: modalConfig.props || {},
    events: modalConfig.events || {},
  };
});
// const searchContent = computed(() => {
//   return console.log(stakingStore.searchContent);
// });

//Lifecycle Hooks

onMounted(async () => {
  await listKeys();
});

// *************** Methods *****************

//**** Validator Key File ****

//Read File Content
const readFileContent = (file) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const jsonContent = JSON.parse(event.target.result);
      stakingStore.previewKeys.push(jsonContent);
    } catch (e) {
      console.error("Error parsing JSON file:", e);
    }
  };
  reader.onerror = (event) => {
    console.error("Error reading file:", event.target.error);
  };

  reader.readAsText(file);
};

//Handle multiple files
const handleFiles = (files) => {
  if (files.length > 1) {
    for (let file of files) {
      if (file.type === "application/json") {
        readFileContent(file);
      }
    }
  } else {
    readFileContent(files[0]);
  }
};

const uploadValidatorKey = (event) => {
  let uploadedFiles = event.target.files;
  if (!stakingStore.keyFiles.includes(uploadedFiles[0]["name"]) && uploadedFiles[0]["type"] === "application/json") {
    handleFiles(uploadedFiles);
    stakingStore.keyFiles.push(...uploadedFiles);
    stakingStore.isOverDropZone = false;
    stakingStore.isPreviewListActive = true;
    stakingStore.setActivePanel("validator");
  }
};

const onDrop = (event) => {
  let validator = serviceStore.installedServices.filter((s) => s.category === "validator");
  if (validator && validator.map((e) => e.state).includes("running")) {
    let droppedFiles = event.dataTransfer.files;
    if (droppedFiles[0]["type"] === "application/json") {
      stakingStore.isOverDropZone = false;
      stakingStore.isPreviewListActive = true;
      handleFiles(droppedFiles);
      stakingStore.keyFiles.push(...droppedFiles);
      stakingStore.setActivePanel("validator");
    }
  }
};

const listKeys = async () => {
  await useListKeys(stakingStore.forceRefresh);
};

// const updateValidatorStats = async () => {
//   await useUpdateValidatorStats();
// };

//****End of Validator Key File ****

//**** Import Key Validation ****

const importKey = async (val) => {
  stakingStore.importEnteredPassword = val;
  stakingStore.importKeyMessage = await ControlService.importKey(
    stakingStore.selectedValidatorService.config.serviceID
  );
  stakingStore.isPreviewListActive = false;
  stakingStore.setActivePanel("insert");
  stakingStore.keyFiles = [];
  stakingStore.previewKeys = [];
  stakingStore.importEnteredPassword = "";

  await listKeys();
};

//Validation validator key Password
const passwordValidation = async (pass) => {
  stakingStore.importEnteredPassword = pass;

  stakingStore.setActiveModal("import");
  stakingStore.checkActiveValidatorsResponse = await ControlService.checkActiveValidators({
    files: stakingStore.keyFiles,
    password: stakingStore.importEnteredPassword,
    serviceID: stakingStore.selectedValidatorService.config.serviceID,
    //Temporarily set slashingDB to null
    slashingDB: null,
  });
  stakingStore.setActivePanel(null);
  if (
    stakingStore.checkActiveValidatorsResponse.length === 0 ||
    stakingStore.checkActiveValidatorsResponse.includes("Validator check error:\n")
  ) {
    importKey(stakingStore.importEnteredPassword);
    stakingStore.keys.push(...stakingStore.checkActiveValidatorsResponse);
  } else {
    console.log("error");
  }
};
//****End of Import Key Validation ****

//Open Group List

const openGroupList = (item) => {
  stakingStore.isGroupListActive = true;
  stakingStore.currentGroup = item;
};

//Confirm Grouping

const confirmGrouping = (groupName) => {
  if (stakingStore.mode === "create") {
    creatingNewGroup(groupName);
  } else if (stakingStore.mode === "rename") {
    const group = stakingStore.validatorKeyGroups.find((g) => g.id === stakingStore.currentGroup.id);
    if (group) {
      group.name = groupName;
      stakingStore.setMode("create");
      stakingStore.setActivePanel(null);
    }
  }
};

//Create Grouping
const creatingNewGroup = (groupName) => {
  stakingStore.isPreviewListActive = false;
  if (groupName === "" || groupName === null) {
    stakingStore.setActivePanel(null);
    return;
  }

  const uniqueId = uuidv4();

  if (stakingStore.selectedValidatorKeys.length > 0) {
    stakingStore.selectedValidatorKeys.forEach((key) => {
      if (key.selected) {
        key.selected = false;
      }
    });

    stakingStore.validatorKeyGroups.push({
      id: uniqueId,
      keys: useDeepClone(stakingStore.selectedValidatorKeys),
      name: stakingStore.groupName,
      selected: false,
    });
    stakingStore.setActivePanel(null);

    stakingStore.keys = stakingStore.keys.filter(
      (key) => !stakingStore.selectedValidatorKeys.find((e) => e.key === key.key)
    );
    stakingStore.selectedValidatorKeys = [];
  }
};

//Rename Group

const renameGroup = (item) => {
  stakingStore.setMode("rename");
  stakingStore.currentGroup = item;
  stakingStore.setActivePanel("grouping");
};

//Withdraw Group

const withdrawGroup = (item) => {
  console.log(item);
  stakingStore.setActivePanel("password");
};

//Pick a Validator Service

const pickValidatorService = (service) => {
  stakingStore.selectedValidatorService = service;
  stakingStore.setActivePanel("password");
};

//Delete Preview Key
const deletePreviewKey = (item) => {
  stakingStore.previewKeys = stakingStore.previewKeys.filter((key) => key.pubkey !== item.pubkey);
  if (!stakingStore.previewKeys.length) {
    stakingStore.isPreviewListActive = false;
    stakingStore.setActivePanel("insert");
  }
};

//Remove Group

const removeGroup = (item) => {
  stakingStore.validatorKeyGroups = stakingStore.validatorKeyGroups.filter((group) => group.id !== item.id);
};
</script>
