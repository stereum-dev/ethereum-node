<template>
  <custom-modal
    icon="/animation/launcher-update/update-loading-modal.gif"
    icon-size="w-[30%]"
    bg-color="bg-[#336666]"
    :main-title="`${t('updateModal.updateTitle', { version: version })} `"
    confirm-text=""
    @close-window="closeWindow"
  >
    <template #content>
      <div class="update-content-parent w-full flex flex-col items-center gap-10 py-6">
        <span class="w-2/3 text-md text-center text-gray-300">{{ manual ? t("updateModal.manualQ") : t("updateModal.updateQ") }}</span>
        <div class="w-full flex justify-around">
          <div
            class="btn-modal w-[30%] h-12 rounded-2xl px-2 font-semibold text-xl text-gray-700 bg-[#70E763] flex items-center justify-center uppercase cursor-pointer"
            @click="submitUpdate"
          >
            <span>{{ manual ? t("updateModal.download") : t("updateModal.acc") }}</span>
          </div>
          <div
            class="btn-modal w-[30%] h-12 rounded-2xl px-2 font-semibold text-xl text-gray-100 bg-[#EB5353] flex items-center justify-center uppercase cursor-pointer"
            @click="closeWindow"
          >
            <span>{{ manual ? t("updateModal.later") : t("updateModal.deny") }}</span>
          </div>
        </div>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import CustomModal from "../../../node-page/components/modals/CustomModal.vue";
import i18n from "@/includes/i18n";
const t = i18n.global.t;
defineProps({
  version: String,
  // the update is downloaded from the release page instead of installed in place
  manual: { type: Boolean, default: false },
});

const emit = defineEmits(["update", "close-window"]);

const submitUpdate = () => {
  emit("update");
};

const closeWindow = () => {
  emit("close-window");
};
</script>

<style scoped>
.btn-modal:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
.btn-modal:active span {
  transform: scale(0.9);
}
</style>
