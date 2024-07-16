<template>
  <custom-modal
    icon=""
    icon-size="w-10 h-10"
    bg-color="bg-[#1c1d1d]"
    :main-title="t('twoFactorAuth.scanCode')"
    confirm-text=""
    :click-outside-text="t('deleteModal.close')"
    @close-window="closeWindow"
  >
    <template #content>
      <div class="barcode-box flex justify-center items-center w-full h-full mt-5">
        <img :src="authStore.QRcode" class="w-60 rounded-md" alt="barcode" />
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import CustomModal from "../../../node-page/components/modals/CustomModal.vue";
import { useTwoFactorAuth } from "@/store/twoFactorAuth";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const authStore = useTwoFactorAuth();

const emit = defineEmits("close-window");

const closeWindow = () => {
  emit("close-window");
};
</script>
