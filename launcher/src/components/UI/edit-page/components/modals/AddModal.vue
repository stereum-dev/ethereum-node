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
      <AddPanel v-if="isAddPanelActivated" ref="addPanelComponent" :client="client" :properties="properties" />
      <MevboostRelays v-if="isRelaysActivated" :client="client" :properties="properties" />
      <AddConnection v-if="isModifyActivated" :client="client" :properties="properties" />
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import AddPanel from "./AddPanel";
import AddConnection from "./AddConnection";
import MevboostRelays from "./MevboostRelays.vue";
import { ref, onMounted, computed } from "vue";
import { useNodeManage } from "@/store/nodeManage";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "confirmInstall", "selectService"]);

const manageStore = useNodeManage();

//Refs
const isAddPanelActivated = ref(false);
const isRelaysActivated = ref(false);
const isModifyActivated = ref(false);
const disabledButton = ref(false);
// eslint-disable-next-line vue/no-setup-props-destructure
const properties = ref({
  client: props.client,
  network: manageStore.configNetwork.network,
  installDir: "/opt/stereum",
  executionClients: [],
  consensusClients: [],
  relays: [],
});

//Computed & Watcher

const getConfirmText = computed(() => {
  let text = "";
  if (isAddPanelActivated.value) {
    if (props.client.category === "execution") {
      text = "confirm";
    } else if (props.client.category === "consensus" || props.client.category === "validator") {
      text = "next";
    } else if (props.client.category === "service" && props.client.service !== "FlashbotsMevBoostService") {
      text = "confirm";
    } else if (props.client.category === "service" && props.client.service === "FlashbotsMevBoostService") {
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

//Lifecycle Hooks
onMounted(() => {
  isAddPanelActivated.value = true;
});

//Methods

const confirmInstall = () => {
  if (props.client.category === "execution" && getConfirmText.value === "confirm") {
    props.client.addPanel = false;
    emit("confirmInstall", properties.value);
  } else if (
    (props.client.category === "consensus" && getConfirmText.value === "next") ||
    (props.client.category === "validator" && getConfirmText.value === "next")
  ) {
    isAddPanelActivated.value = false;
    isModifyActivated.value = true;
  } else if (
    props.client.category === "service" &&
    props.client.service !== "FlashbotsMevBoostService" &&
    getConfirmText.value === "confirm"
  ) {
    props.client.addPanel = false;
    emit("confirmInstall", properties.value);
  } else if (
    props.client.category === "service" &&
    props.client.service === "FlashbotsMevBoostService" &&
    !isRelaysActivated.value &&
    getConfirmText.value === "next"
  ) {
    isAddPanelActivated.value = false;
    isRelaysActivated.value = true;
  } else if (isModifyActivated.value && getConfirmText.value === "confirm") {
    props.client.addPanel = false;
    emit("confirmInstall", properties.value);
  } else if (
    isRelaysActivated.value &&
    props.client.category === "service" &&
    props.client.service === "FlashbotsMevBoostService" &&
    getConfirmText.value === "next"
  ) {
    isAddPanelActivated.value = false;
    isRelaysActivated.value = false;
    isModifyActivated.value = true;
  }
};

const closeWindow = () => {
  emit("closeWindow", props.client);
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
