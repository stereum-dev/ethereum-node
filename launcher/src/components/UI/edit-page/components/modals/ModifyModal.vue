<template>
  <custom-modal
    :main-title="mainTitleHandler"
    :client="client"
    sub-title="Modify Connection"
    confirm-text="Confirm"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmModify"
  >
    <template #content>
      <ModifyContent :client="client" @select-service="selectService" />
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import ModifyContent from "./ModifyContent.vue";
import { useServices } from "@/store/services";

import { computed, onMounted } from "vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "confirmModify"]);

const serviceStore = useServices();

const mainTitleHandler = computed(() => {
  let title = "";
  if (client.service !== "FlashbotsMevBoostService") {
    title = `${client.name} - ${client.category}`;
  } else {
    title = `${client.name}`;
  }

  return title;
});

//life cycle hooks

onMounted(() => {});

//Methods

// const selectedItems = () => {
//   let selectedItems = [];
//   const commonElements = manageStore.newConfiguration.filter((element) => array2.includes(element));

//   return selectedItems;
// };

const confirmModify = () => {
  emit("confirmModify", client);
};

const closeWindow = () => {
  emit("closeWindow");
};

const selectService = (option) => {
  serviceStore.selectedServiceToConnect.push(option);
  console.log(serviceStore.selectedServiceToConnect);
};
</script>
