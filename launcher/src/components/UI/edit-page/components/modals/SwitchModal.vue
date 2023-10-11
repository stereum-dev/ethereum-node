<template>
  <custom-modal
    :main-title="`${client.name} - ${client.category}`"
    :client="client"
    sub-title="Switch Client"
    :message-text="`Select a client to replace the ${client.name}.`"
    confirm-text="Confirm"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="switchConfirm"
  >
    <template #content> <SwitchContent :client="client" :properties="properties" /> </template>
  </custom-modal>
</template>
<script setup>
import { ref } from "vue";
import CustomModal from "./CustomModal.vue";
import SwitchContent from "./SwitchContent";

//Props & Emits
const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

// eslint-disable-next-line vue/no-setup-props-destructure
const properties = ref({
  itemToReplace: props.client,
  itemToInstall: null,
  checkPointSyncUrl: null,
});

const emit = defineEmits(["closeWindow", "switchConfirm"]);

//Methods

const switchConfirm = () => {
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
