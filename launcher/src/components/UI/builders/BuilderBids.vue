<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.blockChoice") }}</span>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in boostOptions"
          :key="option.mode"
          class="px-3 py-1 rounded-full text-xs font-semibold border"
          :class="boostMode === option.mode ? 'bg-[#336666] border-[#4b8585]' : 'bg-[#1d2023] border-gray-600 hover:border-[#4b8585]'"
          @click="setBoost(option)"
        >
          {{ option.label }}
        </button>
        <div v-if="boostMode === 'custom'" class="flex items-center gap-1">
          <input
            v-model="settings.boostFactor"
            class="w-20 h-7 rounded-full bg-[#0D0D12] border px-3 text-xs outline-hidden"
            :class="/^\d+$/.test(String(settings.boostFactor)) ? 'border-[#4b8585] focus:border-teal-400' : 'border-red-500'"
          />
          <span class="text-2xs text-gray-400">%</span>
        </div>
      </div>
      <span class="text-2xs text-gray-400">{{ t(`builders.boostHint.${boostMode}`) }}</span>
    </div>

    <!-- side by side, so the tab fits without scrolling -->
    <div class="flex flex-col gap-1">
      <div class="grid grid-cols-2 gap-4">
        <label class="flex flex-col gap-1">
          <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.minBid") }}</span>
          <div class="flex items-center gap-2">
            <input
              v-model="settings.minBid"
              class="w-full h-8 rounded-full bg-[#0D0D12] border px-4 text-xs outline-hidden"
              :class="ethToGwei(settings.minBid) === null ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
            />
            <span class="text-2xs text-gray-400">ETH</span>
          </div>
        </label>
        <label class="flex flex-col gap-1">
          <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.maxPayment") }}</span>
          <div class="flex items-center gap-2">
            <input
              v-model="settings.maxExecutionPayment"
              class="w-full h-8 rounded-full bg-[#0D0D12] border px-4 text-xs outline-hidden"
              :class="ethToGwei(settings.maxExecutionPayment) === null ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
            />
            <span class="text-2xs text-gray-400">ETH</span>
          </div>
        </label>
      </div>
      <span class="text-2xs text-gray-400">{{ t("builders.minBidHint") }}</span>
      <p class="text-2xs text-[#7fb3b3]">{{ t("builders.maxPaymentHint") }}</p>
      <p v-if="trusted" class="text-2xs text-amber-300">{{ t("builders.trustedWarning") }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { ethToGwei } from "@/share/builders";
import i18n from "@/includes/i18n";

const settings = defineModel({ type: Object, required: true });
const props = defineProps({
  // an Obol cluster: Charon needs a block choice above 0%
  cluster: { type: Boolean, default: false },
});

const t = i18n.global.t;

const boostOptions = computed(() =>
  [
    { mode: "default", value: null, label: t("builders.boostDefault") },
    { mode: "local", value: 0, label: t("builders.boostLocal") },
    { mode: "profit", value: 100, label: t("builders.boostProfit") },
    { mode: "custom", value: 90, label: t("builders.boostCustom") },
  ].filter((o) => !props.cluster || o.mode !== "local")
);
const customBoost = ref(false);
const boostMode = computed(() => {
  const value = settings.value.boostFactor;
  if (customBoost.value) return "custom";
  if (value === null || value === undefined || value === "") return "default";
  if (Number(value) === 0) return "local";
  if (Number(value) === 100) return "profit";
  return "custom";
});
const setBoost = (option) => {
  customBoost.value = option.mode === "custom";
  settings.value.boostFactor = option.value;
};

// promised payments count, so the relays are trusted with up to this much
const trusted = computed(() => {
  const gwei = ethToGwei(settings.value.maxExecutionPayment);
  return gwei !== null && gwei !== "0";
});
</script>
