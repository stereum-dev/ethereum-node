<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3 rounded-lg border px-4 py-3" :class="tone.box">
      <span class="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-lg font-bold text-white" :class="tone.icon">{{
        tone.glyph
      }}</span>
      <div class="flex flex-col min-w-0">
        <span class="text-sm font-bold" :class="tone.text">{{ headline }}</span>
        <span v-if="subline" class="text-xs text-gray-400">{{ subline }}</span>
      </div>
    </div>

    <p v-if="info" class="text-xs text-red-400">{{ info }}</p>

    <div v-if="results.length" class="grid grid-cols-3 gap-2">
      <div
        v-for="tile in tiles"
        :key="tile.status"
        class="rounded-lg border bg-[#0D0D12] px-3 py-2 flex flex-col items-center"
        :class="tile.count ? RESULT_STYLE[tile.status] : 'border-[#ffffff16] text-gray-600'"
      >
        <span class="text-2xl font-bold leading-none">{{ tile.count }}</span>
        <span class="mt-1 text-2xs uppercase tracking-wide">{{ t(`validatorsPage.importStatus.${tile.status}`) }}</span>
      </div>
    </div>

    <div v-if="rows.length" :style="{ height: `${Math.min(rows.length * ROW, 170)}px` }">
      <VirtualList :items="rows" :item-height="ROW" :item-key="(row) => row.pubkey">
        <template #default="{ item }">
          <div class="flex items-center gap-2 h-[24px] px-3 rounded-full bg-[#1d2023] text-xs">
            <span class="w-36 shrink-0 truncate font-semibold" :title="item.pubkey">{{ item.name }}</span>
            <template v-if="onChain">
              <span class="w-16 shrink-0 text-gray-400">{{ item.index != null ? `#${item.index}` : "" }}</span>
              <span class="w-24 shrink-0 truncate" :class="STATUS_META[item.bucket]?.color ?? 'text-gray-400'">{{
                t(`validatorsPage.status.${item.bucket}`)
              }}</span>
            </template>
            <span class="shrink-0 px-2 rounded-full text-2xs border" :class="RESULT_STYLE[item.status] ?? RESULT_STYLE.error">{{
              t(`validatorsPage.importStatus.${item.status}`, item.status)
            }}</span>
            <span class="min-w-0 truncate text-gray-400" :title="item.message">{{ item.message }}</span>
          </div>
        </template>
      </VirtualList>
    </div>

    <p v-if="notOnChain" class="text-xs text-gray-400">{{ t("validatorsPage.importDone.notOnChain", notOnChain) }}</p>
    <p v-if="doppelganger && counts.imported" class="text-xs text-[#7fb3b3]">{{ t("validatorsPage.importDoppelganger") }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import VirtualList from "../VirtualList.vue";
import { STATUS_META } from "../../statusMeta";
import { useValidatorsStore } from "@/store/validators";
import { shortPubkey, statusBucket } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

// Outcome of a keystore or remote key import, shared so both modals report it the same way
const props = defineProps({
  results: { type: Array, default: () => [] },
  info: { type: String, default: null },
  doppelganger: { type: Boolean, default: false },
  // { pubkey: { index, status } } from the import check; null hides the chain columns
  onChain: { type: Object, default: null },
});

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const ROW = 28;

const RESULT_STYLE = {
  imported: "border-green-500 text-green-500",
  duplicate: "border-[#4b8585] text-[#7fb3b3]",
  error: "border-red-500 text-red-300",
};

const TONES = {
  success: { box: "border-green-500/60 bg-[#224141]", icon: "bg-green-500", text: "text-green-500", glyph: "✓" },
  nothing: { box: "border-[#4b8585] bg-[#224141]", icon: "bg-[#336666]", text: "text-[#7fb3b3]", glyph: "✓" },
  partial: { box: "border-amber-500/60 bg-amber-900/20", icon: "bg-amber-600", text: "text-amber-300", glyph: "!" },
  failed: { box: "border-red-500/60 bg-red-900/20", icon: "bg-red-700", text: "text-red-300", glyph: "✕" },
};

const counts = computed(() => {
  const result = { imported: 0, duplicate: 0, error: 0 };
  for (const r of props.results) result[r.status in result ? r.status : "error"]++;
  return result;
});
const tiles = computed(() => ["imported", "duplicate", "error"].map((status) => ({ status, count: counts.value[status] })));

const outcome = computed(() => {
  const { imported, error } = counts.value;
  if (!props.results.length || error === props.results.length) return "failed";
  if (error) return "partial";
  return imported ? "success" : "nothing";
});
const tone = computed(() => TONES[outcome.value]);

const headline = computed(() => {
  const { imported } = counts.value;
  if (outcome.value === "success") return t("validatorsPage.importDone.imported", imported);
  return t(`validatorsPage.importDone.${outcome.value}`);
});
const subline = computed(() => {
  const { duplicate, error } = counts.value;
  if (outcome.value === "success")
    return duplicate ? t("validatorsPage.importDone.importedSub", duplicate) : t("validatorsPage.importDone.importedNext");
  if (outcome.value === "nothing") return t("validatorsPage.importDone.nothingSub", duplicate);
  if (outcome.value === "partial") return t("validatorsPage.importDone.partialSub", error);
  return props.results.length ? t("validatorsPage.importDone.failedSub") : "";
});

// failures first, so they are never scrolled away
const rows = computed(() =>
  props.results
    .map((r) => {
      const state = props.onChain?.[r.pubkey];
      return {
        ...r,
        name: validatorsStore.aliases?.[r.pubkey]?.keyName || shortPubkey(r.pubkey),
        index: state?.index ?? null,
        bucket: statusBucket(state),
      };
    })
    .sort((a, b) => (a.status === "error" ? 0 : 1) - (b.status === "error" ? 0 : 1))
);
const notOnChain = computed(() => (props.onChain ? rows.value.filter((r) => r.status === "imported" && r.bucket === "unknown").length : 0));
</script>
