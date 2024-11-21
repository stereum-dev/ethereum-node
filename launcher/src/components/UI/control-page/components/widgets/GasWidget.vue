<template>
  <div class="gas-parent flex justify-center items-center flex-col w-full h-full relative">
    <NoData v-if="setupStore?.relatedValidatorPairs?.network === 'devnet'" />
    <template v-else>
      <div class="label w-full h-1/3 flex justify-center items-center text-gray-200 text-xs font-bold uppercase">change</div>
      <div class="fee-display w-full h-1/3 flex justify-center items-center text-lg font-bold uppercase" :class="balanceClass">
        {{ formattedGweiFee }}
      </div>
      <div class="label w-full h-1/3 flex justify-center items-center text-gray-200 text-xs font-bold uppercase">gwei</div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useControlStore } from "@/store/theControl";
import { useSetups } from "@/store/setups";
import NoData from "./NoData.vue";

const setupStore = useSetups();
const controlStore = useControlStore();
const balance = ref(0);

const formatNumber = (value) => value.toLocaleString();

watch(
  () => controlStore.balancestatus,
  (newStatus) => {
    if (newStatus && typeof newStatus === "object" && "balance" in newStatus) {
      balance.value = newStatus.balance;
    }
  },
  { immediate: true }
);

const formattedGweiFee = computed(() => formatNumber(balance.value));
const balanceClass = computed(() => (balance.value < 0 ? "text-red-500" : "text-green-500"));
</script>

<style scoped>
.label {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
  color: #cbd5e1; /* Tailwind's gray-200 */
}

.fee-display {
  font-size: 1.125rem;
  font-weight: bold;
}
</style>
