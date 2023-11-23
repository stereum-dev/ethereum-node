<template>
  <div
    class="w-full col-start-1 col-span-full row-start-1 row-span-1 rounded-t-md border-b-2 grid grid-cols-12 bg-[#151618] border-gray-500"
  >
    <div
      v-if="stakingStore.isPreviewListActive"
      class="w-full h-full col-start-1 col-span-full flex justify-center items-center rounded-t-md bg-[#17A2B8] space-x-4"
    >
      <span class="text-md font-semibold text-gray-200 uppercase">Insert Validator Key</span>
      <img class="w-4 h-5" src="/img/icon/the-staking/black-key.png" alt="icon" />
    </div>
    <div v-else class="w-full h-full col-start-1 col-span-full grid grid-cols-12 rounded-t-md">
      <span
        id="name"
        class="col-start-2 col-end-5 text-xs text-gray-300 font-semibold self-center text-center uppercase"
        >{{ t("displayValidator.pk") }}</span
      >
      <span id="service" class="col-start-5 col-span-1 text-xs text-gray-300 font-semibold self-center text-center">{{
        t("displayValidator.service")
      }}</span>
      <span id="active" class="col-start-6 col-span-1 text-xs text-gray-300 font-semibold self-center text-center"
        >PERIOD</span
      >
      <span id="state" class="col-start-7 col-span-1 text-xs text-gray-300 font-semibold self-center text-center">{{
        t("displayValidator.state")
      }}</span>
      <span id="balance" class="col-start-8 col-span-2 text-xs text-gray-300 font-semibold self-center text-left">{{
        t("displayValidator.balance")
      }}</span>
      <span
        id="option"
        class="col-start-10 col-span-full text-xs text-gray-300 font-semibold self-center text-center"
        >{{ t("displayValidator.option") }}</span
      >
    </div>
  </div>
</template>

<script setup>
import i118n from "@/includes/i18n";
import { useStakingStore } from "@/store/theStaking";

const t = i118n.global.t;

const stakingStore = useStakingStore();
</script>
