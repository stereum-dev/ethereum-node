<template>
  <div class="connected-val-parent flex w-full h-full flex-col p-1 relative">
    <NoData v-if="!setupStore.selectedSetup" />
    <template v-else>
      <div class="val-box flex w-full h-5/6 justify-start items-center gap-1">
        <ValidatorItem
          v-for="validator in relatedValidators"
          :key="validator.config.serviceID"
          :validator="validator"
          :key-count="getKeyCount(validator)"
          @mouseenter-name="setCursor(validator.name)"
          @mouseleave-name="clearCursor"
          @mouseenter-state="setCursor(validator.state)"
          @mouseleave-state="clearCursor"
          @mouseenter-key-count="setCursorKeyCount(validator)"
          @mouseleave-key-count="clearCursor"
        />
      </div>

      <div class="widget-name flex w-full h-1/6 justify-center items-center uppercase text-gray-200 text-[50%] font-semibold">
        {{ t("controlPage.connectValWidg") }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSetups } from "@/store/setups";
import { useStakingStore } from "@/store/theStaking";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import ValidatorItem from "../fragments/ValidatorItem.vue";
import NoData from "./NoData.vue";

const t = i18n.global.t;

const footerStore = useFooter();
const setupStore = useSetups();
const stakingStore = useStakingStore();

const relatedValidators = computed(() => setupStore.relatedValidators || []);

const getKeyCount = (validator) => {
  if (!validator || stakingStore.keys.length === 0) {
    return 0;
  }
  return stakingStore.keys.filter((key) => key.validatorID === validator.config.serviceID).length;
};

const setCursor = (info) => {
  footerStore.cursorLocation = info;
};

const clearCursor = () => {
  footerStore.cursorLocation = "";
};

const setCursorKeyCount = (validator) => {
  const count = getKeyCount(validator);
  const keyLabel = count > 1 ? "keys" : "key";
  const isAre = count > 1 ? "are" : "is";
  footerStore.cursorLocation = t("controlPage.keyImported", {
    imported: count,
    key: keyLabel,
    isAre: isAre,
  });
};
</script>
