<template>
  <custom-modal
    :main-title="`${client.name} - ${client.category}`"
    :client="client"
    :sub-title="subTitle"
    :confirm-text="confirmText"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmInstall"
  >
    <template #content>
      <AddPanel v-if="isAddPanelActivated" :client="client" />
      <MevboostRelays v-if="isRelaysActivated" :client="client" />
      <AddConnection v-if="isModifyActivated" :client="client" @select-service="selectService" />
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import AddPanel from "./AddPanel.vue";
import AddConnection from "./AddConnection.vue";
import MevboostRelays from "./MevboostRelays.vue";
import { ref, onMounted, watchEffect } from "vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "confirmInstall", "selectService"]);

//Refs
const isAddPanelActivated = ref(false);
const isRelaysActivated = ref(false);
const isModifyActivated = ref(false);
let confirmText = ref("");
let subTitle = ref("");

//Lifecycle Hooks
onMounted(() => {
  isAddPanelActivated.value = true;
  confirmText.value = "Next";
});

//Methods

const confirmInstall = (item) => {
  if (item.category === "execution") {
    confirmText.value = "Confirm";
    subTitle.value = "Add Service";
    emit("confirmInstall", item);
  } else if (item.category === "consensus" || item.category === "validator") {
    isAddPanelActivated.value = false;
    isModifyActivated.value = true;
    confirmText.value = "Confirm";
    subTitle.value = "Add Connection";
    emit("confirmInstall", item);
  } else if (item.category === "service" && item.service !== "FlashbotsMevBoostService") {
    confirmText.value = "Confirm";
    subTitle.value = "Add Service";
    isAddPanelActivated.value = false;
    emit("confirmInstall", item);
  } else if (item.category === "service" && item.service === "FlashbotsMevBoostService") {
    isAddPanelActivated.value = false;
    isRelaysActivated.value = true;
    confirmText.value = "Next";
    subTitle.value = "Mevboost Relays";
    emit("confirmInstall", item);
  } else if (isRelaysActivated.value) {
    isAddPanelActivated.value = false;
    isRelaysActivated.value = false;
    isModifyActivated.value = true;
    confirmText.value = "Confirm";
    subTitle.value = "Add Connection";
    emit("confirmInstall", item);
  } else if (isModifyActivated.value) {
    confirmText.value = "Confirm";
    subTitle.value = "Add Connection";
    item.addPanel = false;
    emit("confirmInstall", item);
  }
};

const closeWindow = () => {
  emit("closeWindow", client);
};

const selectService = (item) => {
  emit("selectService", item);
};
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: opacity 0.3s ease-out;
}
.slide-leave-active {
  transition: opacity 0.3s ease-in;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
}
</style>
