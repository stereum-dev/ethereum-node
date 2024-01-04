<template>
  <div
    class="w-full h-full max-h-[489px] grid grid-cols-24 grid-rows-12 items-center bg-[#252525] border-t-2 border-gray-500 p-8"
    @mousedown.prevent
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-end-6 flex justify-center items-center">
      <img class="w-80" src="/img/icon/the-staking/staking-disabled.png" alt="icon" />
    </div>

    <div class="w-full h-full col-start-1 col-span-full row-start-6 row-end-9 flex justify-center items-center">
      <span class="text-cyan-400 text-2xl font-semibold font-sans">{{ t("disableStake.message") }}</span>
    </div>

    <div
      class="w-full h-full col-start-1 col-span-full row-start-9 row-span-full flex justify-center items-center space-x-2"
    >
      <div v-for="item in validatorClients" :key="item" class="w-20 h-20 flex justify-center items-center">
        <img :src="item" alt="Service Icon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const validatorClients = ref([
  "/img/icon/plugin-icons/validator/Lighthouse-Validator-Circle.png",
  "/img/icon/plugin-icons/validator/Lodestar-Validator-Circle.png",
  "/img/icon/plugin-icons/validator/Nimbus-Validator-Circle.png",
  "/img/icon/plugin-icons/validator/Prysm-Validator-Circle.png",
  "/img/icon/plugin-icons/validator/Teku-Validator-Circle.png",
  "/img/icon/plugin-icons/validator/Web3Signer-Circle.png",
]);
</script>
