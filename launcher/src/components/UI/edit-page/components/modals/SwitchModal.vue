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
import CustomModal from "./CustomModal.vue";
import SwitchContent from "./SwitchContent.vue";
import { useServices } from "@/store/services";

//Props & Emits
const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "switchConfirm"]);

//Store
const serviceStore = useServices();

//Methods

const switchConfirm = () => {
  emit("switchConfirm", serviceStore.selectedServiceToSwitch);
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
