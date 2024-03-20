<template>
  <custom-modal
    :main-title="t('loginServer.removeServer')"
    :message-text="t('loginServer.removeServerText')"
    :confirm-text="t('deleteModal.rem')"
    :click-outside-text="t('deleteModal.close')"
    @close-window="closeWindow"
    @confirm-action="removeHandler"
  >
    <template #content>
      <div class="w-2/3 flex justify-center items-center mx-auto p-2 mt-20">
        <span v-if="serverStore.isRemoveProcessing" class="text-2xl text-amber-500 font-bold text-center">{{
          $t("loginServer.wait")
        }}</span>
        <span v-else class="text-lg text-gray-300 font-semibold text-center">{{ $t("loginServer.serverRem") }}</span>
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import CustomModal from "../../../edit-page/components/modals/CustomModal.vue";
import i18n from "@/includes/i18n";
import { useServers } from "@/store/servers";

const t = i18n.global.t;

const emit = defineEmits(["removeHandler", "close-window"]);

const serverStore = useServers();

const closeWindow = () => {
  emit("close-window");
};

const removeHandler = () => {
  emit("removeHandler");
};
</script>
