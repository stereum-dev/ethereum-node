<template>
  <div class="w-full h-full border border-gray-600 rounded-[4px] grid grid-cols-7 items-center">
    <div
      class="col-start-1 col-end-4 flex justify-between items-center px-1 space-x-1"
      @mouseenter="footerStore.cursorLocation = `${ttlKeys}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <div class="w-full flex justify-between items-center">
        <img class="w-4 -rotate-90" src="/img/icon/staking-page-icons/keyIcon.png" alt="Key Icon" @mousedown.prevent />
        <span class="w-full text-[12px] text-green-600 font-semibold text-center">{{ totalKeys }}</span>
      </div>
      <span class="w-1/3 text-[10px] text-amber-300 font-semibold text-center">{{ $t("stakingPage.ttl") }}</span>
    </div>
    <div
      class="w-full h-full col-start-4 col-span-full bg-[#151618] rounded-r-sm overflow-hidden flex justify-center items-center px-1 text-center"
      @mouseenter="footerStore.cursorLocation = `${ttlBal}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span class="text-[11px] text-gray-300 font-normal self-center text-center">{{ totalBalance }}</span>
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

const ttlKeys = t("displayValidator.ttlKeys");
const ttlBal = t("displayValidator.ttlBal");

const stakingStore = useStakingStore();

// Computed property to get the total number of keys based on validatorID
const totalKeys = computed(() => {
  return stakingStore.keyNumbers;
});

// Computed property to calculate the total balance for the validator service
const totalBalance = computed(() => {
  const validatorID = stakingStore.selectedServiceToFilter?.config?.serviceID;
  if (!validatorID) return 0;
  const keysForValidator = stakingStore.keys.filter((key) => key.validatorID === validatorID);
  return keysForValidator.reduce((sum, key) => {
    return !isNaN(key.balance) ? (sum += key.balance) : (sum += 0);
  }, 0);
});
</script>
