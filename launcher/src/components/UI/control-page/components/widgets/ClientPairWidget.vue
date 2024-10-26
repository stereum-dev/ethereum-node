<template>
  <div class="pair-parent w-full h-full flex-col flex justify-start items-center relative">
    <NoData v-if="!setupStore?.selectedServicePairs" />
    <template v-else>
      <div class="widget-name w-full h-1/4 flex justify-center items-center text-gray-200 uppercase font-semibold text-xs">CLIENT PAIR</div>
      <div class="widget-box w-full h-3/4 justify-center items-center flex flex-col">
        <div
          class="index-line w-full h-1/2 flex justify-center items-center pl-2"
          @mouseenter="
            footerStore.cursorLocation = `${t('controlPage.clientPairIndexIs', {
              index: setupStore.currentPairIndex,
            })}`
          "
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <span class="w-1/2 h-full flex justify-start items-center font-mono text-gray-200 uppercase text-xs">index</span>
          <span class="w-1/2 h-full flex justify-center items-center font-semibold text-gray-200 uppercase text-xs">{{
            setupStore.currentPairIndex
          }}</span>
        </div>
        <div
          class="index-line w-full h-1/2 flex justify-center items-center pl-2"
          @mouseenter="
            footerStore.cursorLocation = `${t('controlPage.totalClientPairs', {
              total: setupStore.clientPairsLength,
            })}`
          "
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <span class="w-1/2 h-full flex justify-start items-center font-mono text-gray-200 uppercase text-xs">total</span>
          <span class="w-1/2 h-full flex justify-center items-center font-semibold text-gray-200 uppercase text-xs">{{
            setupStore.clientPairsLength
          }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";
import NoData from "./NoData.vue";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const setupStore = useSetups();
const footerStore = useFooter();
</script>

<style scoped></style>
