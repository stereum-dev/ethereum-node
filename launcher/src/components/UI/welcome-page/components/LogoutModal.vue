<template>
  <custom-modal
    :main-title="`${t('welcomePage.logOut')}`"
    :message-text="`${t('welcomePage.logOutMsg')}`"
    :confirm-text="`${t('welcomePage.logOutBtn')}`"
    :click-outside-text="`${t('ipScanModal.clockClose')}`"
    @close-window="closeWindow"
    @confirm-action="logoutHandler"
  >
    <template #content>
      <div class="w-2/3 flex justify-center items-center mx-auto p-2 mt-20">
        <span v-if="serverStore.isUpdateProcessing" class="text-2xl text-amber-500 font-bold text-center">{{ t("loginServer.wait") }}</span>
        <span v-else class="text-lg text-gray-300 font-semibold text-center">{{ t("welcomePage.logedOut") }}</span>
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "../../edit-page/components/modals/CustomModal.vue";
import { useServers } from "@/store/servers";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const emit = defineEmits(["logoutHandler", "close-window"]);

const serverStore = useServers();

const closeWindow = () => {
  emit("close-window");
};

const logoutHandler = () => {
  emit("logoutHandler");
};
</script>
