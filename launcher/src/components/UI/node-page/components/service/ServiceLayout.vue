<template>
  <div
    class="col-start-1 col-span-1 row-start-1 row-span-full w-full h-full flex justify-center items-center box-border"
    style="cursor: default"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
    @mouseenter="footerStore.cursorLocation = `${props.client.name} ${srvice}`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <div class="flex justify-start items-center">
      <img class="w-12 ml-1" :src="props.client.sIcon" alt="icon" />
    </div>
  </div>
</template>
<script setup>
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const srvice = t("serviceLay.srvice");

const footerStore = useFooter();

const props = defineProps({
  client: { type: Object, required: true },
});
</script>
