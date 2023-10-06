<template>
  <custom-modal
    :main-title="`${client.name} - ${client.category}`"
    :client="client"
    :sub-title="getSubTitles"
    :confirm-text="getConfirmText"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmInstall"
  >
    <template #content>
      <AddPanel v-if="isAddPanelActivated" :client="client" />
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
import { ref, onMounted, watch, watchEffect, computed } from "vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "confirmInstall", "selectService"]);

//Refs
const isAddPanelActivated = ref();
const isRelaysActivated = ref(false);
const isModifyActivated = ref(false);

//Watchers

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

watch(client, () => {
  // if (val) {
  //   if (val.category === "execution") {
  //     isAddPanelActivated.value = true;
  //     confirmText.value = "Confirm";
  //     subTitle.value = "Add Service";
  //   } else if (val.category === "consensus" || val.category === "validator") {
  //     isAddPanelActivated.value = false;
  //     isModifyActivated.value = true;
  //     confirmText.value = "Confirm";
  //     subTitle.value = "Add Connection";
  //   } else if (val.category === "service" && val.service !== "FlashbotsMevBoostService") {
  //     confirmText.value = "Confirm";
  //     subTitle.value = "Add Service";
  //     isAddPanelActivated.value = false;
  //   } else if (val.category === "service" && val.service === "FlashbotsMevBoostService") {
  //     isAddPanelActivated.value = false;
  //     isRelaysActivated.value = true;
  //     confirmText.value = "Next";
  //     subTitle.value = "Mevboost Relays";
  //   } else if (isRelaysActivated.value) {
  //     isAddPanelActivated.value = false;
  //     isRelaysActivated.value = false;
  //     isModifyActivated.value = true;
  //     confirmText.value = "Confirm";
  //     subTitle.value = "Add Connection";
  //   } else if (isModifyActivated.value) {
  //     confirmText.value = "Confirm";
  //     subTitle.value = "Add Connection";
  //     val.addPanel = false;
  //     isAddPanelActivated.value = false;
  //   }
  // }
});

watchEffect(() => {});

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
    getConfirmText.value === "next"
  ) {
    isAddPanelActivated.value = false;
    isRelaysActivated.value = true;
  } else if (isRelaysActivated.value && getConfirmText.value === "next") {
    isRelaysActivated.value = false;
    isModifyActivated.value = true;
  } else if (isModifyActivated.value && getConfirmText.value === "confirm") {
    client.addPanel = false;
    emit("confirmInstall", client);
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
