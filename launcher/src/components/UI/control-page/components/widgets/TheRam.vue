<template>
  <div class="theRamParent flex w-full h-full justify-center items-center">
    <div class="ramIco w-1/3 h-full flex flex-col justify-center items-center">
      <div class="ramIco-container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/ramStick.svg" />
      </div>
      <span
        class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase"
        >{{ $t("controlPage.ram") }}</span
      >
    </div>
    <div class="ramValue w-2/3 h-full flex flex-col justify-center items-center">
      <div class="valDigits w-full h-2/3 flex justify-center items-center">
        <div class="digits flex h-full w-2/3 justify-center items-center">
          <span class="text-[100%] text-gray-200 font-semibold"
            ><span
              @mouseenter="
                footerStore.cursorLocation = `${t('controlPage.ramUsageIs', {
                  usage: controlStore.usedRam,
                })} `
              "
              @mouseleave="footerStore.cursorLocation = ''"
              >{{ controlStore.usedRam }}</span
            >
            /
            <span
              @mouseenter="
                footerStore.cursorLocation = `${t('controlPage.ramTotalis', {
                  total: controlStore.totalRam,
                })} `
              "
              @mouseleave="footerStore.cursorLocation = ''"
            >
              {{ controlStore.totalRam }}</span
            ></span
          >
        </div>
        <span
          class="flex w-1/3 justify-center items-center text-gray-200 font-semibold h-full"
          >MB</span
        >
      </div>
      <div
        class="valLbl h-1/3 w-full flex justify-start items-center text-2xs font-thin text-gray-200"
      >
        <span class="w-1/3 flex justify-center items-center">{{
          $t("controlPage.used")
        }}</span
        ><span class="w-1/3 flex justify-center items-center">{{
          $t("controlPage.totalram")
        }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const controlStore = useControlStore();
const footerStore = useFooter();
</script>
