<template>
  <custom-modal
    animation="/animation/launcher-update/update-loading.gif"
    bg-color="bg-[#1c1d1d]"
    :main-title="`Update ${version} available`"
    confirm-text=""
    :click-outside-text="t('deleteModal.close')"
    :is-disabled="btnDisabled"
    @close-window="closeWindow"
    @confirm-action="submitAuth"
  >
    <template #content>
      <div class="update-content-parent w-full h-full grid grid-cols-24 grid-rows-12 items-center">
        <span class="col-start-5 col-end-21 row-start-1 row-end-3 text-md text-center text-gray-300"
          >Do you want to update now?</span
        >
        <!-- <input
          v-model="password"
          class="col-start-6 col-end-20 row-start-5 row-span-2 h-full rounded-lg px-2 text-md text-gray-800"
          type="password"
        /> -->
        <div
          class="btn-modal col-start-3 col-end-10 row-start-7 row-span-4 h-full rounded-2xl px-2 font-semibold text-xl text-gray-700 bg-[#70E763] flex items-center justify-center uppercase cursor-pointer"
        >
          <span>agree</span>
        </div>
        <div
          class="btn-modal col-start-16 col-end-23 row-start-7 row-span-4 h-full rounded-2xl px-2 font-semibold text-xl text-gray-100 bg-[#EB5353] flex items-center justify-center uppercase cursor-pointer"
        >
          <span>deny</span>
        </div>
      </div>
    </template>
  </custom-modal>
</template>

<script setup>
import CustomModal from "../../../node-page/components/modals/CustomModal.vue";
import { ref } from "vue";
import i18n from "@/includes/i18n";
const t = i18n.global.t;
const version = ref("dummy version");
</script>

<style scoped>
.btn-modal:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
.btn-modal:active span {
  transform: scale(0.9);
}
</style>
