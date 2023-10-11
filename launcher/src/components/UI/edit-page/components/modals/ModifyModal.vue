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
      <ModifyContent :client="client" :properties="properties" />
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import ModifyContent from "./ModifyContent.vue";
import { ref } from "vue";

import { computed, onMounted } from "vue";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

// eslint-disable-next-line vue/no-setup-props-destructure
const properties = ref({
  client: props.client,
  executionClients: [],
  consensusClients: [],
});

const emit = defineEmits(["closeWindow", "confirmModify"]);

const mainTitleHandler = computed(() => {
  let title = "";
  if (props.client.service !== "FlashbotsMevBoostService") {
    title = `${props.client.name} - ${props.client.category}`;
  } else {
    title = `${props.client.name}`;
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
  emit("confirmModify", properties.value);
};

const closeWindow = () => {
  emit("closeWindow");
};
</script>
