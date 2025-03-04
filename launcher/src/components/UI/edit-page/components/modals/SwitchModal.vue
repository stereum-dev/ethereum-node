<template>
  <custom-modal
    :main-title="`${client.name} - ${client.category}`"
    :client="client"
    :sub-title="`${$t('editModals.switchClient')}`"
    :message-text="`${$t('editModals.selectClient')} ${client.name}.`"
    :confirm-text="`${$t('editModals.confirm')}`"
    :click-outside-text="`${$t('editModals.clckOutside')}`"
    @close-window="closeWindow"
    @confirm-action="switchConfirm"
  >
    <template #content>
      <SwitchContent :client="client" :properties="properties" />
    </template>
  </custom-modal>
</template>
<script setup>
import { ref } from "vue";
import CustomModal from "./CustomModal.vue";
import SwitchContent from "./SwitchContent";
import { useClickInstall } from "@/store/clickInstallation";

const installStore = useClickInstall();

//Props & Emits
const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const properties = ref({
  itemToReplace: props.client,
  itemToInstall: null,
  checkPointSyncUrl: null,
});

const emit = defineEmits(["closeWindow", "switchConfirm"]);

//Methods

const switchConfirm = () => {
  properties.value.checkPointSyncUrl = installStore.checkPointSync;
  installStore.checkPointSync = "";
  emit("switchConfirm", properties.value);
};

const closeWindow = () => {
  emit("closeWindow");
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
