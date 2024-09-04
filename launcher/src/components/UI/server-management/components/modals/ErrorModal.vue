<template>
  <custom-modal
    :client="errorIcon"
    :main-title="t('multiServer.loginFailed')"
    :confirm-text="t('multiServer.ok')"
    :click-outside-text="t('deleteModal.close')"
    @close-window="closeWindow"
    @confirm-action="closeWindow"
  >
    <template #content>
      <div class="w-2/3 flex justify-center items-center mx-auto p-2 mt-20">
        <span v-if="props.process" class="text-2xl text-amber-500 font-bold text-center">{{ $t("loginServer.wait") }}</span>
        <div v-else class="w-full flex flex-col justify-evenly items-center mx-auto space-y-4">
          <span class="text-md text-gray-300 font-semibold text-center">{{ $t("loginServer.chckServerDetails") }}</span>
          <span class="text-xl text-red-500 font-semibold text-center">{{ props.description }}</span>
        </div>
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "../../../edit-page/components/modals/CustomModal.vue";
import i18n from "@/includes/i18n";
import { ref } from "vue";

const errorIcon = ref({ icon: "/img/icon/server-management-icons/form-error.png" });

const t = i18n.global.t;
const props = defineProps({
  description: {
    type: String,
    default: "Error",
    required: true,
  },
});

const emit = defineEmits(["removeHandler", "close-window"]);

const closeWindow = () => {
  emit("close-window");
};
</script>
