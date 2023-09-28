<template>
  <custom-modal
    main-title="Service Informations"
    confirm-text="OK"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmAdd"
  >
    <template #content>
<!-- Add New Service Content -->
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "./CustomModal.vue";
import { computed } from "vue";

const { client } = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["closeWindow", "confirmAdd"]);



//Methods

const confirmAdd = () => {
  emit("confirmAdd");
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
