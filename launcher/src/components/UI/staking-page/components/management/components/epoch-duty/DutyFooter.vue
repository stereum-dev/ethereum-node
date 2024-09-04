<template>
  <div
    class="col-start-1 col-span-full row-start-4 row-span-1 flex justify-center items-center space-x-2"
    @mouseenter="footerStore.cursorLocation = `${selValClint}`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <span class="text-[10px] text-amber-400 font-semibold text-center uppercase">{{ $t("displayValidator.clentSel") }}:</span>
    <span class="text-[10px] text-gray-300 font-semibold text uppercase">{{ props.client.name }}</span>
  </div>
</template>

<script setup>
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();

const selValClint = t("displayValidator.selValClint");

const props = defineProps({
  client: {
    type: Object || String,
    required: true,
  },
});
</script>
