<template>
  <base-layout>
    <div class="w-full h-full max-h-full grid grid-cols-24 grid-rows-12 py-1">
      <SidebarSection />
      <ListSection
        @confirm-grouping="confirmGroupingName"
        @pick-validator="pickValidatorService"
        @upload-file="uploadValidatorKey"
        @confirm-password="passwordValidation"
      />
      <ManagementSection />
    </div>
  </base-layout>
</template>
<script setup>
import SidebarSection from "./sections/SidebarSection.vue";
import ListSection from "./sections/ListSection.vue";
import ManagementSection from "./sections/ManagementSection.vue";
import { useStakingStore } from "@/store/theStaking";
import { ref } from "vue";

//Store
const stakingStore = useStakingStore();

//Refs
let validatorKeyFile = ref(null);

//Computed & Watchers

// const searchContent = computed(() => {
//   return console.log(stakingStore.searchContent);
// });

//Methods
const confirmGroupingName = (groupName) => {
  if (groupName === "") {
    return;
  }
  stakingStore.setActivePanel("insert");
  console.log(groupName);
};

const uploadValidatorKey = (event) => {
  const file = event.target.files;
  validatorKeyFile.value = file[0];
  if (validatorKeyFile.value) {
    stakingStore.setActivePanel("validator");
  } else {
    stakingStore.setActivePanel(null);
  }

  console.log(validatorKeyFile.value);
};

const pickValidatorService = (service) => {
  stakingStore.selectedValidatorService = service;
  stakingStore.setActivePanel("password");
  console.log(service);
};

const passwordValidation = (password) => {
  stakingStore.setActivePanel("insert");
  console.log(password);
};
</script>
