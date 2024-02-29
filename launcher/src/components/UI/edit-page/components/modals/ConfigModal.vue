<template>
  <custom-modal
    :main-title="`${client.name} - ${client.category}`"
    :client="client"
    sub-title="SET CONFIGURATION"
    :confirm-text="getConfirmText"
    :disabled-button="disabledButton"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="confirmCreate"
  >
    <template #content>
      <div class="w-full h-full grid grid-cols-12 grid-rows-10 gap-y-1">
        <div class="w-full col-start-2 col-end-12 row-start-1 row-span-1">
          <span class="text-xs text-gray-300 text-left font-semibold capitalize"
            >PAST A VIABLE CONFIGURATION TO CREATE A CUSTOM SERVICE.</span
          >
        </div>
        <div
          class="w-full h-full max-h-[216px] col-start-2 col-end-12 row-start-2 row-end-11 flex justify-center items-center bg-black rounded-md"
        >
          <textarea
            v-model="customConfig"
            class="w-full h-full bg-black text-gray-400 p-2 text-sm"
            placeholder="paste you config here."
          ></textarea>
        </div>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import CustomModal from "./CustomModal.vue";
import { ref, computed, watchEffect } from "vue";

const props = defineProps({
  client: {
    type: Object,
    required: true,
  },
  externalServiceConfirmBtn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeWindow", "confirmInstall"]);

const disabledButton = ref(false);
const customConfig = ref("");

// computed & watcher

const getConfirmText = computed(() => {
  return "Create";
});

watchEffect(() => {
  if (customConfig.value === "") {
    disabledButton.value = true;
  } else {
    disabledButton.value = false;
  }
});

const confirmCreate = () => {
  emit("confirmCreate", props.client, customConfig.value);
};

// methods
const closeWindow = () => {
  emit("closeWindow", props.client);
};
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
