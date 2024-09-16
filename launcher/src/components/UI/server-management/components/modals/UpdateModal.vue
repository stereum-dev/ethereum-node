<template>
  <custom-modal
    icon=" /animation/launcher-update/update-loading-modal.gif"
    icon-size="w-[30%]"
    bg-color="bg-[#336666]"
    :main-title="`${t('updateModal.updateTitle', { version: version })} `"
    confirm-text=""
    @close-window="closeWindow"
  >
    <template #content>
      <div class="update-content-parent w-full h-full grid grid-cols-24 grid-rows-12 items-center">
        <span class="col-start-5 col-end-21 row-start-2 row-end-4 text-md text-center text-gray-300">{{ t("updateModal.updateQ") }}</span>
        <div
          class="btn-modal col-start-3 col-end-10 row-start-8 row-span-4 h-full rounded-2xl px-2 font-semibold text-xl text-gray-700 bg-[#70E763] flex items-center justify-center uppercase cursor-pointer"
          @click="submitUpdate"
        >
          <span>{{ t("updateModal.acc") }}</span>
        </div>
        <div
          class="btn-modal col-start-16 col-end-23 row-start-8 row-span-4 h-full rounded-2xl px-2 font-semibold text-xl text-gray-100 bg-[#EB5353] flex items-center justify-center uppercase cursor-pointer"
          @click="closeWindow"
        >
          <span>{{ t("updateModal.deny") }}</span>
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
