<template>
  <staking-custom-modal
    :main-title="`${$t('stakingPage.riskWarning')}`"
    title-color="remove"
    :click-outside-text="clickOut"
    :confirm-text="getBtnText"
    :active-button="true"
    :is-processing="isProcessing"
    @confirm-action="acceptRisk"
  >
    <template #content>
      <div class="w-full col-start-1 col-span-full row-start-2 row-end-6 grid grid-cols-7 grid-rows-4 items-center overflow-hidden">
        <div class="col-start-2 col-end-7 row-start-1 row-span-1 flex justify-center items-center">
          <span class="text-sm text-gray-300 text-left font-semibold">{{ t("displayValidator.warningMessage") }}</span>
        </div>
        <div class="col-start-2 col-end-7 row-start-2 row-span-1 flex justify-center items-center">
          <span class="text-lg text-amber-400 text-left font-semibold">{{ $t("displayValidator.warningAlarm") }}</span>
        </div>
        <div class="col-start-2 col-end-7 row-start-3 row-span-1 flex justify-center items-center">
          <span class="text-sm text-gray-300 text-left font-semibold"> {{ $t("displayValidator.warningQuestion") }}</span>
        </div>
        <div class="col-start-2 col-end-7 row-start-4 row-span-1 flex justify-center items-center">
          <span class="text-sm text-gray-300 text-left font-semibold">
            {{ $t("stakingPage.stopImport") }}
          </span>
        </div>
      </div>
    </template>
  </staking-custom-modal>
</template>
<script setup>
import i18n from "@/includes/i18n";
import { computed, ref } from "vue";

const emit = defineEmits(["acceptRisk"]);

const t = i18n.global.t;
const isProcessing = ref(false);
const clickOut = ref("Click outside to close");

const getBtnText = computed(() => {
  return t("displayValidator.sure");
});

//Methods

const acceptRisk = () => {
  clickOut.value = null;
  isProcessing.value = true;
  emit("acceptRisk");
};
</script>
