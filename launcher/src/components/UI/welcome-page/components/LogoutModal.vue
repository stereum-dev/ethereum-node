<template>
  <custom-modal
    main-title="Logging out"
    message-text="Are you sure you want to log out?"
    confirm-text="Logout"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="logoutHandler"
  >
    <template #content>
      <div class="w-2/3 flex justify-center items-center mx-auto p-2 mt-20">
        <span v-if="props.process" class="text-2xl text-amber-500 font-bold text-center">Please wait . . .</span>
        <span v-else class="text-lg text-gray-300 font-semibold text-center"
          >You will be logged out of the Stereum Launcher. You will need to log back in to access your node.</span
        >
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "../../edit-page/components/modals/CustomModal.vue";

const props = defineProps({
  process: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["logoutHandler", "close-window"]);

const closeWindow = () => {
  emit("close-window");
};

const logoutHandler = () => {
  emit("logoutHandler");
};
</script>
