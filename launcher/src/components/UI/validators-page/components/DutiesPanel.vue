<template>
  <div class="flex flex-col w-full h-full min-h-0 gap-1.5">
    <!-- toolbar -->
    <div class="flex items-center gap-2 h-7 shrink-0">
      <SectionTabs />
      <template v-if="clock">
        <span class="h-7 flex items-center gap-1 px-3 rounded-full bg-[#0D0D12] border border-[#4b8585] text-2xs whitespace-nowrap">
          <span class="uppercase font-semibold text-[#7fb3b3]">{{ t("validatorsPage.duties.epoch") }}</span>
          <span class="font-bold">{{ clock.epoch }}</span>
        </span>
        <span
          class="relative h-7 flex items-center gap-1 px-3 rounded-full bg-[#0D0D12] border border-[#4b8585] text-2xs whitespace-nowrap overflow-hidden"
        >
          <span class="uppercase font-semibold text-[#7fb3b3]">{{ t("validatorsPage.duties.slot") }}</span>
          <span class="font-bold">{{ clock.slot }}</span>
          <span class="text-gray-400">{{ clock.slotInEpoch + 1 }}/{{ clock.slotsPerEpoch }}</span>
          <span class="absolute left-3 right-3 bottom-0.5 h-[2px] rounded-full bg-[#224141]">
            <span
              class="block h-full rounded-full bg-[#4b8585]"
              :style="{ width: `${((clock.slotInEpoch + 1) / clock.slotsPerEpoch) * 100}%` }"
            />
          </span>
        </span>
      </template>
      <span class="grow" />
      <span v-if="sourceNote" class="text-2xs text-amber-300 truncate max-w-[220px]" :title="sourceNote">{{ sourceNote }}</span>
      <img v-if="duties?.loading || rewards?.loading" src="/animation/loading/turning-circle.gif" class="w-5 h-5 shrink-0" alt="loading" />
      <button
        class="h-7 px-3 rounded-full bg-[#336666] hover:bg-[#4b8585] text-2xs font-semibold uppercase whitespace-nowrap shrink-0 shadow-xs shadow-[#1c3634] disabled:opacity-50"
        :disabled="duties?.loading || !hasActive"
        @click="refresh"
      >
        {{ t("validatorsPage.refresh") }}
      </button>
    </div>

    <p v-if="!hasActive && statesEntry?.error" class="text-2xs text-amber-300 px-1 truncate" :title="statesEntry.error">
      {{ t("validatorsPage.statesError") }}: {{ statesEntry.error }}
    </p>
    <p v-else-if="!hasActive" class="text-xs text-gray-500 px-1">{{ t("validatorsPage.duties.noActive") }}</p>
    <template v-else>
      <p v-if="duties?.error" class="text-2xs text-red-400 px-1 truncate shrink-0" :title="duties.error">
        {{ t("validatorsPage.duties.error") }}: {{ duties.error }}
      </p>
      <p v-if="rewards?.error" class="text-2xs text-amber-300 px-1 truncate shrink-0" :title="rewards.error">
        {{ t("validatorsPage.duties.rewardsError") }}: {{ rewards.error }}
      </p>

      <div class="grid grid-cols-4 gap-1 h-[64px] shrink-0">
        <SummaryCard v-for="card in cards" :key="card.id" :card="card" />
      </div>

      <div class="grid grid-cols-2 gap-1 grow min-h-0">
        <div class="flex flex-col min-h-0 rounded-lg bg-[#0D0D12]/70 border border-[#ffffff16] p-1.5">
          <span class="text-2xs font-semibold uppercase text-[#7fb3b3] px-1 pb-1">{{ t("validatorsPage.duties.proposals") }}</span>
          <div class="grow min-h-0 overflow-y-auto flex flex-col gap-0.5">
            <span v-if="!rows.length" class="text-2xs text-gray-500 px-1">{{ data ? t("validatorsPage.duties.noDuties") : "-" }}</span>
            <div
              v-for="row in rows"
              :key="row.slot"
              class="h-6 shrink-0 grid grid-cols-[68px_minmax(0,1fr)_auto] items-center gap-2 px-2 rounded-full bg-linear-to-r from-[#25302f] to-[#1b1f22] text-2xs"
            >
              <span class="text-gray-300">#{{ row.slot }}</span>
              <span class="truncate font-semibold" :title="row.pubkey">{{ keyLabel(row.pubkey) }}</span>
              <span
                class="whitespace-nowrap"
                :class="STATE_COLORS[row.state]"
                :title="row.state === 'proposed' ? consensusOnly : undefined"
                >{{ stateText(row) }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex flex-col min-h-0 rounded-lg bg-[#0D0D12]/70 border border-[#ffffff16] p-1.5">
          <span class="text-2xs font-semibold uppercase text-[#7fb3b3] px-1 pb-1">{{ t("validatorsPage.duties.history") }}</span>
          <div :class="HISTORY_COLUMNS" class="px-2 pb-0.5 text-2xs font-semibold uppercase text-gray-400">
            <span>{{ t("validatorsPage.duties.colEpoch") }}</span>
            <span class="text-right">{{ t("validatorsPage.duties.colAttestations") }}</span>
            <span class="text-right">{{ t("validatorsPage.duties.colSync") }}</span>
            <span class="text-right" :title="consensusOnly">{{ t("validatorsPage.duties.colBlocks") }}</span>
            <span class="text-right">{{ t("validatorsPage.duties.colTotal") }}</span>
          </div>
          <div class="grow min-h-0 overflow-y-auto flex flex-col gap-0.5">
            <span v-if="!history.length" class="text-2xs text-gray-500 px-1">-</span>
            <div
              v-for="row in history"
              :key="row.epoch"
              :class="HISTORY_COLUMNS"
              class="h-6 shrink-0 items-center px-2 rounded-full bg-linear-to-r from-[#25302f] to-[#1b1f22] text-2xs"
            >
              <span class="text-gray-300">{{ row.epoch }}</span>
              <span
                v-if="attestationPending(row)"
                class="text-right text-gray-500"
                :title="t('validatorsPage.duties.attestationPending')"
                >{{ t("validatorsPage.duties.pending") }}</span
              >
              <span v-else class="text-right" :title="cellTitle('attestation')">{{ cell(row.attestation, "attestation") }}</span>
              <span class="text-right" :title="cellTitle('sync')">{{ cell(row.sync, "sync") }}</span>
              <span class="text-right" :title="cellTitle('block') ?? consensusOnly">{{ cell(row.block, "block") }}</span>
              <span
                v-if="attestationPending(row)"
                class="text-right text-gray-500"
                :title="t('validatorsPage.duties.attestationPending')"
                >{{ t("validatorsPage.duties.pending") }}</span
              >
              <span v-else class="text-right font-semibold" :class="rowTotal(row) < 0 ? 'text-red-400' : 'text-[#74fa65]'">{{
                formatGwei(rowTotal(row))
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import SectionTabs from "./SectionTabs.vue";
import SummaryCard from "./SummaryCard.vue";
import { useValidatorsStore } from "@/store/validators";
import { useHolderRows } from "../useHolderRows";
import { shortPubkey } from "@/share/validatorStatus";
import { activeIndices, chainClock, proposalRows, formatCountdown, formatGwei } from "@/share/validatorDuties";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const { statesEntry } = useHolderRows();

const ICONS = "/img/icon/staking-page-icons/";
const MAX_PROPOSALS = 64;
const HISTORY_COLUMNS = "grid grid-cols-[52px_repeat(4,minmax(0,1fr))] gap-1";
const STATE_COLORS = { upcoming: "text-amber-300", pending: "text-gray-400", proposed: "text-[#74fa65]", missed: "text-red-400" };
const consensusOnly = t("validatorsPage.duties.consensusOnly");

const holderId = computed(() => validatorsStore.selectedHolderId);
const duties = computed(() => validatorsStore.dutiesByHolder[holderId.value]);
const rewards = computed(() => validatorsStore.rewardsByHolder[holderId.value]);
const data = computed(() => duties.value?.data ?? null);
const hasActive = computed(() => activeIndices(statesEntry.value?.byPubkey).length > 0);

// ticks every second for the countdown only, the clock is computed locally without IPC
const now = ref(Date.now());
// the duties' timing, or the states' one so the clock also shows without active keys
const clock = computed(() => {
  const d = data.value ?? statesEntry.value?.chain;
  if (!(d?.slotsPerEpoch > 0) || !(d.secondsPerSlot > 0)) return null;
  const live = chainClock(d, now.value);
  if (live) return { ...live, slotsPerEpoch: d.slotsPerEpoch };
  // without the genesis time the last head is the best guess
  if (!Number.isFinite(d.headSlot)) return null;
  const slotMs = d.secondsPerSlot * 1000;
  return {
    slot: d.headSlot,
    epoch: Math.floor(d.headSlot / d.slotsPerEpoch),
    slotInEpoch: d.headSlot % d.slotsPerEpoch,
    msToNextSlot: slotMs,
    msToNextEpoch: null,
    slotMs,
    slotsPerEpoch: d.slotsPerEpoch,
  };
});

const keyLabel = (pubkey) => validatorsStore.aliases[pubkey]?.keyName || shortPubkey(pubkey);
const rows = computed(() => proposalRows(data.value?.proposals ?? [], rewards.value?.proposals ?? {}, clock.value).slice(0, MAX_PROPOSALS));
const history = computed(() => rewards.value?.history ?? []);

const stateText = (row) => {
  if (row.state === "upcoming") return `${t("validatorsPage.duties.upcoming")} · ${formatCountdown(row.eta)}`;
  if (row.state === "proposed") return [t("validatorsPage.duties.proposed"), formatGwei(row.reward)].filter((s) => s !== "-").join(" ");
  if (row.state === "missed") return t("validatorsPage.duties.missedBlock");
  return t("validatorsPage.duties.pending");
};

const unsupported = (kind) => !!rewards.value?.unsupported?.[kind];
const cell = (value, kind) => (Number.isFinite(value) ? formatGwei(value) : unsupported(kind) ? "n/a" : "-");
const cellTitle = (kind) => (unsupported(kind) ? t("validatorsPage.duties.unsupported") : undefined);
// attestation rewards arrive once their epoch is finalized, about two epochs later; until then the total is not final
const attestedUpTo = computed(() => rewards.value?.attestation?.epoch ?? -1);
const attestationPending = (row) => !Number.isFinite(row.attestation) && !unsupported("attestation") && row.epoch > attestedUpTo.value;
const rowTotal = (row) => {
  const parts = [row.attestation, row.sync, row.block].filter(Number.isFinite);
  return parts.length ? parts.reduce((a, b) => a + b, 0) : NaN;
};
const percent = (x) => (Number.isFinite(x) ? `${(x * 100).toFixed(1)}%` : "-");

// the cards are narrow, so each one's full text is in its tooltip
const withTitle = (card) => ({ ...card, title: [card.value, card.sub, card.note].filter(Boolean).join(" · ") });
const cards = computed(() => {
  const d = data.value;
  const r = rewards.value;
  const next = rows.value.find((row) => row.state === "upcoming");
  const attestation = r?.attestation;
  const last = r ? history.value.find((row) => row.epoch === r.accountedEpoch) : null;
  const lastTotal = last ? [last.sync, last.block].filter(Number.isFinite).reduce((a, b) => a + b, 0) : NaN;
  return [
    {
      id: "proposal",
      label: t("validatorsPage.duties.nextProposal"),
      icon: ICONS + "cube.png",
      value: next ? t("validatorsPage.duties.inTime", { time: formatCountdown(next.eta) }) : d ? t("validatorsPage.duties.noDuties") : "-",
      color: next ? "text-amber-300" : "text-gray-300",
      sub: next ? t("validatorsPage.duties.proposalAt", { slot: next.slot, key: keyLabel(next.pubkey) }) : "",
    },
    {
      id: "sync",
      label: t("validatorsPage.duties.syncCommittee"),
      icon: ICONS + "sync-committee.png",
      value: d
        ? d.sync.current.length
          ? t("validatorsPage.duties.syncNow", { count: d.sync.current.length })
          : t("validatorsPage.duties.syncNone")
        : "-",
      color: d?.sync.current.length ? "text-[#74fa65]" : "text-gray-300",
      sub: d ? t("validatorsPage.duties.syncNext", { epoch: d.sync.nextPeriodStart, count: d.sync.next.length }) : "",
    },
    {
      id: "attestation",
      label: t("validatorsPage.duties.attestations"),
      icon: ICONS + "check.png",
      value: attestation ? formatGwei(attestation.total) : unsupported("attestation") ? "n/a" : "-",
      note: unsupported("attestation") ? t("validatorsPage.duties.unsupported") : undefined,
      color: attestation?.total < 0 ? "text-red-400" : "text-[#74fa65]",
      sub: attestation
        ? `${t("validatorsPage.duties.effectiveness", { value: percent(attestation.effectiveness) })} · ${t(
            "validatorsPage.duties.missed",
            {
              count: attestation.missedCount,
            }
          )}`
        : "",
    },
    {
      id: "last",
      label: t("validatorsPage.duties.lastEpoch"),
      icon: ICONS + "balance.png",
      value: formatGwei(lastTotal),
      note: consensusOnly,
      color: lastTotal < 0 ? "text-red-400" : "text-[#74fa65]",
      sub: last ? t("validatorsPage.duties.syncAndBlocks", { epoch: last.epoch }) : "",
    },
  ].map(withTitle);
});

const sourceNote = computed(() => {
  const entry = statesEntry.value;
  return entry?.base && entry.source === "configured" ? t("validatorsPage.sourceConfigured", { base: entry.base }) : "";
});

// polling lives here, so a hidden tab costs nothing; nothing is asked more than once per slot
let timer = null;
let unmounted = false;
let lastDutiesAt = 0;
let attemptedEpoch = null;
let epochRetryAt = 0;
// slot -> time from which its outcome may be asked again (Infinity: asked or answered)
const requested = new Map();
const slotMs = () => (data.value?.secondsPerSlot ?? 12) * 1000;
const canAsk = (slot) => !(requested.get(slot) > Date.now());
// no answer for a slot (head still behind it, error, skipped load): ask again a slot later
const settle = (slots, result) => {
  const answered = new Set(result?.code === 0 ? (result.blocks ?? []).map((b) => b.slot) : []);
  for (const slot of slots) if (!answered.has(slot)) requested.set(slot, Date.now() + slotMs());
};

// rewards of the epoch before the duties' one, once per epoch
const accountRewards = async (id, d) => {
  if (d.epoch < 1 || attemptedEpoch === d.epoch || Date.now() < epochRetryAt) return;
  if (validatorsStore.rewardsByHolder[id]?.accountedEpoch === d.epoch - 1) return;
  attemptedEpoch = d.epoch;
  // the previous epoch's proposals (the duties include them) whose outcome is not known yet
  const known = validatorsStore.rewardsByHolder[id]?.proposals ?? {};
  const proposals = d.proposals.filter(
    (p) => p.slot <= d.headSlot && Math.floor(p.slot / d.slotsPerEpoch) >= d.epoch - 1 && !known[p.slot] && canAsk(p.slot)
  );
  proposals.forEach((p) => requested.set(p.slot, Infinity));
  const result = await validatorsStore.loadRewards(id, {
    epoch: d.epoch - 1,
    attestationEpoch: d.finalizedEpoch ?? undefined,
    proposals,
  });
  settle(
    proposals.map((p) => p.slot),
    result
  );
  // skipped behind another load or failed: tried again, a failure only a slot later
  if ((result === null || result.code) && attemptedEpoch === d.epoch) {
    attemptedEpoch = null;
    if (result?.code) epochRetryAt = Date.now() + slotMs();
  }
};

const loadDuties = async () => {
  const id = holderId.value;
  if (!id || !hasActive.value || Date.now() - lastDutiesAt < slotMs()) return;
  lastDutiesAt = Date.now();
  const result = await validatorsStore.loadDuties(id);
  if (unmounted || id !== holderId.value || result?.code !== 0 || result.empty) return;
  accountRewards(id, result);
};

const refresh = () => {
  lastDutiesAt = 0;
  loadDuties();
};

const tick = () => {
  now.value = Date.now();
  const id = holderId.value;
  const d = data.value;
  const c = clock.value;
  if (!id || !d || !c || !hasActive.value) return;
  const stale = d.genesisTime == null ? Date.now() - (duties.value?.loadedAt ?? 0) > d.slotsPerEpoch * slotMs() : c.epoch > d.epoch;
  if (stale) loadDuties();
  accountRewards(id, d);
  // a proposal's outcome is asked once the clock has passed its slot
  for (const p of d.proposals) {
    if (c.slot > p.slot && !rewards.value?.proposals?.[p.slot] && canAsk(p.slot)) {
      requested.set(p.slot, Infinity);
      validatorsStore.loadRewards(id, { proposals: [p] }).then((result) => settle([p.slot], result));
    }
  }
};

watch(holderId, () => {
  lastDutiesAt = 0;
  attemptedEpoch = null;
  epochRetryAt = 0;
  requested.clear();
  loadDuties();
});
// the states arrive after the tab may have opened
watch(hasActive, (active) => active && loadDuties());

onMounted(() => {
  loadDuties();
  timer = setInterval(tick, 1000);
});
onUnmounted(() => {
  unmounted = true;
  clearInterval(timer);
});
</script>
