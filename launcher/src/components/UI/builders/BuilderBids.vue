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

    <div class="flex flex-col gap-1">
      <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.minBid") }}</span>
      <div class="flex items-center gap-2 w-1/2">
        <input
          v-model="settings.minBid"
          class="w-full h-8 rounded-full bg-[#0D0D12] border px-4 text-xs outline-hidden"
          :class="ethToGwei(settings.minBid) === null ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
        />
        <span class="text-2xs text-gray-400">ETH</span>
      </div>
      <span class="text-2xs text-gray-400">{{ t("builders.minBidHint") }}</span>
    </div>

    <div class="flex flex-col gap-2 rounded-lg border border-[#4b8585] bg-[#151618] px-3 py-2">
      <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.calc.title") }}</span>
      <div class="grid grid-cols-3 gap-3">
        <label v-for="field in fields" :key="field.key" class="flex flex-col gap-1">
          <span class="text-2xs text-gray-300">{{ field.label }}</span>
          <div class="flex items-center gap-1">
            <input
              v-model="amounts[field.key]"
              class="w-full h-7 rounded-full bg-[#0D0D12] border px-3 text-xs outline-hidden"
              :class="ethToGwei(amounts[field.key]) === null ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
            />
            <span class="text-2xs text-gray-400">ETH</span>
          </div>
        </label>
      </div>
      <span class="text-2xs text-gray-400">{{ t("builders.calc.promisedHint") }}</span>

      <div v-for="row in rows" :key="row.id" class="flex flex-col gap-0.5 rounded-lg bg-[#1d2023] px-3 py-1.5 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-20 font-semibold">{{ row.name }}</span>
          <span class="grow text-2xs text-gray-400">{{ t("builders.calc.counts", { counted: eth(row.counted), boost: row.boost }) }}</span>
          <span
            class="px-3 py-0.5 rounded-full text-2xs font-semibold border"
            :class="row.winner === 'builder' ? 'border-green-500 text-green-400' : 'border-[#4b8585] text-[#7fb3b3]'"
          >
            {{ row.winner === "builder" ? t("builders.calc.builderBlock") : t("builders.calc.localBlock") }}
          </span>
        </div>
        <span class="text-2xs text-gray-300">{{ row.why }}</span>
      </div>
      <span v-if="!rows.length && amountsValid" class="text-2xs text-gray-500">{{ t("builders.calc.noClients") }}</span>
      <span class="text-2xs text-[#7fb3b3]">{{ t("builders.calc.footnote") }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { bidOutcome, ethToGwei } from "@/share/builders";
import { shortName } from "./clientInfo";
import i18n from "@/includes/i18n";

const settings = defineModel({ type: Object, required: true });
const props = defineProps({
  // the validator clients that use these settings
  clients: { type: Array, default: () => [] },
});

const t = i18n.global.t;

const boostOptions = computed(() => [
  { mode: "default", value: null, label: t("builders.boostDefault") },
  { mode: "local", value: 0, label: t("builders.boostLocal") },
  { mode: "profit", value: 100, label: t("builders.boostProfit") },
  { mode: "custom", value: 90, label: t("builders.boostCustom") },
]);
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

const amounts = reactive({ local: "0.05", paid: "0.054", promised: "0" });
const fields = computed(() => [
  { key: "local", label: t("builders.calc.local") },
  { key: "paid", label: t("builders.calc.paid") },
  { key: "promised", label: t("builders.calc.promised") },
]);
const amountsValid = computed(() => ["local", "paid", "promised"].every((k) => ethToGwei(amounts[k]) !== null));

// up to 6 decimals, without trailing zeros
const eth = (value) => String(Number(value.toFixed(6)));

const rows = computed(() =>
  props.clients
    .map((client) => {
      const outcome = bidOutcome(client.service, settings.value, amounts, client.version);
      if (!outcome) return null;
      const values = {
        boost: outcome.boost,
        counted: eth(outcome.counted),
        boosted: eth((outcome.counted * outcome.boost) / 100),
        local: amounts.local,
        minBid: settings.value.minBid,
        needed: outcome.needed === null ? "" : eth(outcome.needed),
      };
      return {
        id: client.id,
        name: shortName(client.service),
        winner: outcome.winner,
        counted: outcome.counted,
        boost: outcome.boost,
        why: t(`builders.calc.why.${outcome.reason}`, values),
      };
    })
    .filter(Boolean)
);
</script>
