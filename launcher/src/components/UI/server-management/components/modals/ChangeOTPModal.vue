<template>
  <custom-modal
    icon="/img/icon/server-management-icons/form-error.png"
    icon-size="w-24"
    bg-color="bg-[#1c1d1d]"
    :main-title="'Password Change Required'"
    :confirm-text="t('twoFactorAuth.submit')"
    :click-outside-text="t('twoFactorAuth.submit')"
    :is-disabled="btnDisabled"
    @close-window="closeWindow"
    @confirm-action="submitPassword"
  >
    <template #content>
      <div class="2fa-content-parent w-full h-full grid grid-cols-24 grid-rows-6 items-center">
        <span class="col-start-5 col-end-21 row-start-1 row-end-3 text-md text-center text-gray-300">
          {{ t("otpModal.newPass") }}
        </span>
        <input
          v-model="password"
          class="col-start-6 col-end-20 row-start-5 row-span-3 h-full rounded-lg px-2 text-md text-gray-800"
          type="password"
        />
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import CustomModal from "../../../node-page/components/modals/CustomModal.vue";
import { ref, computed } from "vue";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const password = ref("");

const emit = defineEmits(["submitPassword", "close-window"]);

const btnDisabled = computed(() => {
  return !password.value;
});

const closeWindow = () => {
  password.value = "";
  emit("close-window");
};

const submitPassword = () => {
  emit("submitPassword", password.value);
};
</script>

<style scoped></style>
