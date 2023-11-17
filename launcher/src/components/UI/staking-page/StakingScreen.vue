<template>
  <base-layout>
    <div class="w-full h-full max-h-full grid grid-cols-24 grid-rows-12 py-1">
      <SidebarSection />
      <ListSection
        @confirm-grouping="confirmGroupingName"
        @pick-validator="pickValidatorService"
        @upload-file="uploadValidatorKey"
        @confirm-password="passwordValidation"
        @on-drop="onDrop"
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
import ImportValidator from "./components/modals/ImportValidator.vue";
import ManagementSection from "./sections/ManagementSection.vue";
import { useStakingStore } from "@/store/theStaking";
import { computed } from "vue";

//Store
const stakingStore = useStakingStore();

const modals = {
  import: {
    component: ImportValidator,
    events: {
      closeWindow: () => closeWindow,
    },
    props: {},
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

//Methods

//**** Validator Key File ****

const processFile = (file) => {
  if (file.type === "application/json") {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonKey = JSON.parse(e.target.result);
        stakingStore.keyFiles.push(jsonKey);
        stakingStore.setActiveModal("import");
        stakingStore.isPreviewListActive = true;
      } catch (err) {
        console.error("Error parsing JSON:", err);
      }
    };

    reader.readAsText(file);
  } else {
    return;
  }
};

const onDrop = (event) => {
  stakingStore.isOverDropZone = false;
  const files = event.dataTransfer.files;

  if (files.length > 0) {
    processFile(files[0]);
  }
};

const uploadValidatorKey = (event) => {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  } else {
    stakingStore.setActivePanel(null);
  }
};

//****End of Validator Key File ****

//Create Grouping
const confirmGroupingName = (groupName) => {
  if (groupName === "") {
    return;
  }
  stakingStore.setActivePanel("insert");
  console.log(groupName);
};

//Pick a Validator Service

const pickValidatorService = (service) => {
  stakingStore.selectedValidatorService = service;
  stakingStore.setActivePanel("password");
};

//Validation validator key Password
const passwordValidation = (password) => {
  stakingStore.setActivePanel("insert");
  console.log(password);
};
</script>
