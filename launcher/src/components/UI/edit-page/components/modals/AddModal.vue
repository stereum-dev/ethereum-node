<template>
  <custom-modal
    :main-title="`${client.name} - ${client.category}`"
    :client="client"
    :sub-title="getSubTitles"
    :confirm-text="getConfirmText"
    :disabled-button="disabledButton"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmInstall"
  >
    <template #content>
      <AddPanel v-if="isAddPanelActivated" ref="addPanelComponent" :client="client" />
      <MevboostRelays v-else-if="isRelaysActivated" :client="client" />
      <AddConnection v-else-if="isModifyActivated" :client="client" @select-service="selectService" />
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import AddPanel from "./AddPanel.vue";
import AddConnection from "./AddConnection.vue";
import MevboostRelays from "./MevboostRelays.vue";
import { useNodeManage } from "@/store/nodeManage";
import { ref, onMounted, watchEffect, computed } from "vue";

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
const disabledButton = ref(false);

//Store
const manageStore = useNodeManage();

//Computed & Watcher

const getConfirmText = computed(() => {
  let text = "";
  if (isAddPanelActivated.value) {
    if (client.category === "execution") {
      text = "confirm";
    } else if (client.category === "consensus" || client.category === "validator") {
      text = "next";
    } else if (client.category === "service" && client.service !== "FlashbotsMevBoostService") {
      text = "confirm";
    } else if (client.category === "service" && client.service === "FlashbotsMevBoostService") {
      text = "next";
    }
  } else if (isRelaysActivated.value) {
    text = "next";
  } else if (isModifyActivated.value) {
    text = "confirm";
  }
  return text;
});

const getSubTitles = computed(() => {
  let text = "";
  if (isAddPanelActivated.value) {
    text = "Add Service";
  } else if (isRelaysActivated.value) {
    text = "Mevboost Relays";
  } else if (isModifyActivated.value) {
    text = "Add Connection";
  }
  return text;
});

//Watch the button state for relays
watchEffect(() => {
  if (isRelaysActivated.value && !manageStore.checkedRelays.length) {
    disabledButton.value = true;
  } else {
    disabledButton.value = false;
  }
});

//Lifecycle Hooks
onMounted(() => {
  isAddPanelActivated.value = true;
});

//Methods

const confirmInstall = () => {
  if (client.category === "execution" && getConfirmText.value === "confirm") {
    client.addPanel = false;
    emit("confirmInstall", client);
  } else if (
    (client.category === "consensus" && getConfirmText.value === "next") ||
    (client.category === "validator" && getConfirmText.value === "next")
  ) {
    isAddPanelActivated.value = false;
    isModifyActivated.value = true;
    emit("confirmInstall", client);
  } else if (
    client.category === "service" &&
    client.service !== "FlashbotsMevBoostService" &&
    getConfirmText.value === "confirm"
  ) {
    client.addPanel = false;
    emit("confirmInstall", client);
  } else if (
    client.category === "service" &&
    client.service === "FlashbotsMevBoostService" &&
    !isRelaysActivated.value &&
    getConfirmText.value === "next"
  ) {
    isAddPanelActivated.value = false;
    isRelaysActivated.value = true;
  } else if (isModifyActivated.value && getConfirmText.value === "confirm") {
    client.addPanel = false;
    emit("confirmInstall", client);
  } else if (
    isRelaysActivated.value &&
    client.category === "service" &&
    client.service === "FlashbotsMevBoostService" &&
    getConfirmText.value === "next"
  ) {
    console.log("Next Clicked");
    isAddPanelActivated.value = false;
    isRelaysActivated.value = false;
    isModifyActivated.value = true;
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
