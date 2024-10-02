<template>
  <div class="connected-val-parent flex w-full h-full flex-col p-1">
    <div class="val-box flex w-full h-5/6 justify-start items-center gap-1">
      <!-- items start -->
      <div v-for="validator in setupStore.relatedValidators" :key="validator" class="val-client flex h-[90%] w-1/5 flex-col">
        <div
          class="icon-box w-full h-3/4 flex justify-center items-center mb-1"
          @mouseenter="footerStore.cursorLocation = `${validator.name}`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <img class="w-10 h-10" :src="validator.icon" :alt="validator.name" />
        </div>
        <div class="key-count w-full h-1/4 flex justify-center items-center">
          <div
            class="status-val h-2 w-2 flex rounded-lg"
            :class="validator.state == 'running' ? 'bg-green-500' : 'bg-red-500'"
            @mouseenter="footerStore.cursorLocation = `${validator.state}`"
            @mouseleave="footerStore.cursorLocation = ''"
          />
          <span
            class="w-3/4 h-full flex justify-center items-center font-semibold text-gray-200 text-xs"
            @mouseenter="
              footerStore.cursorLocation = `${t('controlPage.keyImported', {
                imported: getKeyCount(validator),
                key: getKeyCount(validator) > 1 ? 'keys' : 'key',
                isAre: getKeyCount(validator) > 1 ? 'are' : 'is',
              })}`
            "
            @mouseleave="footerStore.cursorLocation = ''"
            >{{ getKeyCount(validator) }}</span
          >
        </div>
      </div>
      <!-- items end -->
    </div>
    <div class="widget-name flex w-full h-1/6 justify-center items-center uppercase text-gray-200 text-[50%] font-semibold">
      {{ t("controlPage.connectValWidg") }}
    </div>
  </div>
</template>

<script setup>
import { useSetups } from "@/store/setups";
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();
const setupStore = useSetups();
const stakingStore = useStakingStore();

const getKeyCount = (validator) => {
  if (!validator || stakingStore.keys.length === 0) {
    return 0;
  }
  return stakingStore.keys.filter((key) => key.validatorID === validator.config.serviceID).length;
};
</script>

<style scoped></style>
