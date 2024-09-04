<template>
  <div class="h-full col-start-1 col-span-full row-start-2 row-span-2 rounded-md grid grid-cols-4 grid-rows-2 items-center">
    <CommitteeEpoch
      :epoch="props.epoch"
      @mouseenter="footerStore.cursorLocation = `${upcomingSync}`"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <BlockEpoch
      :epoch="props.epoch"
      @mouseenter="footerStore.cursorLocation = `${upcomingBlocProd}`"
      @mouseleave="footerStore.cursorLocation = ''"
    />
  </div>
</template>
<script setup>
import CommitteeEpoch from "./CommitteeEpoch.vue";
import BlockEpoch from "./BlockEpoch.vue";

import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();

const upcomingSync = t("displayValidator.upcomingSync");
const upcomingBlocProd = t("displayValidator.upcomingBlocProd");

//Props
const props = defineProps({
  epoch: {
    type: Object,
    required: true,
  },
});
</script>
