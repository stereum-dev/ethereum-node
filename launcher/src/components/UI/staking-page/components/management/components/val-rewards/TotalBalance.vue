<template>
  <div
    class="w-full max-h-5 col-start-1 col-span-full row-start-4 row-span-1 grid grid-cols-6 items-center p-[1px]"
    @mouseenter="footerStore.cursorLocation = `${ttlBal}`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <div class="h-full col-start-1 col-end-3 self-center grid grid-cols-3 justify-center items-center gap-1 px-[2px]">
      <img class="col-start-1 col-span-1 w-3 h-3" src="/img/icon/staking-page-icons/balance.png" alt="Block Icon" @mousedown.prevent />
      <span class="col-start-2 col-span-full text-[10px] text-amber-300 font-normal font-sans">{{ $t("stakingPage.ttl") }}</span>
    </div>
    <div
      class="w-full h-full col-start-3 col-span-full rounded-full self-center flex justify-center items-center bg-black px-1 min-h-[18px]"
    >
      <span class="w-full text-[10px] text-green-600 font-medium text-center">{{ totalBalance }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStakingStore } from "@/store/theStaking"; // Import your staking store as needed
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const footerStore = useFooter();

const ttlBal = t("displayValidator.ttlBal");

const stakingStore = useStakingStore();

const totalBalance = computed(() => {
  const validatorID = stakingStore.selectedServiceToFilter?.config?.serviceID;

  if (validatorID) {
    const keysForValidator = stakingStore.keys.filter((key) => key.validatorID === validatorID);
    return keysForValidator.reduce((sum, key) => {
      return !isNaN(key.balance) ? (sum += key.balance) : sum;
    }, 0);
  }
  return stakingStore.keys.reduce((sum, key) => {
    return !isNaN(key.balance) ? (sum += key?.balance) : sum;
  }, 0);
});
</script>
