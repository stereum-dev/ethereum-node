<template>
  <div class="grid grid-cols-[132px_minmax(0,1fr)_150px] gap-1 h-full">
    <SummaryCard :card="totalCard" :selected="validatorsStore.statusFilter === 'all'" :clickable="hasStats" @select="select" />

    <!-- up to three statuses get full cards, more fold into two rows of one-line tiles so all stay readable -->
    <div
      v-if="statusCards.length <= 3"
      class="grid gap-1 min-w-0"
      :style="{ gridTemplateColumns: `repeat(${Math.max(statusCards.length, 1)}, minmax(0, 1fr))` }"
    >
      <SummaryCard
        v-for="card in statusCards"
        :key="card.id"
        :card="card"
        :selected="validatorsStore.statusFilter === card.filter"
        clickable
        @select="select"
      />
    </div>
    <div
      v-else
      class="grid grid-rows-2 gap-1 min-w-0"
      :style="{ gridTemplateColumns: `repeat(${Math.ceil(statusCards.length / 2)}, minmax(0, 1fr))` }"
    >
      <button
        v-for="card in statusCards"
        :key="card.id"
        class="flex items-center gap-1 px-1.5 rounded-md border bg-linear-to-br from-[#1A1A20] to-[#0D0D12] text-left min-w-0 cursor-pointer transition-colors"
        :class="
          validatorsStore.statusFilter === card.filter
            ? 'border-[#4b8585] shadow-[0_0_8px_rgba(75,133,133,0.35)]'
            : 'border-[#ffffff16] hover:border-[#336666]'
        "
        :title="`${card.label}: ${card.value}`"
        @click="select(card.filter)"
      >
        <img :src="card.icon" class="w-4 h-4 shrink-0 object-contain" :class="card.iconClass" alt="" />
        <span class="text-2xs font-semibold uppercase text-gray-400 truncate grow">{{ card.label }}</span>
        <span class="text-sm font-bold" :class="card.color">{{ card.value }}</span>
      </button>
    </div>

    <SummaryCard :card="balanceCard" />
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import SummaryCard from "./SummaryCard.vue";
import { useValidatorsStore } from "@/store/validators";
import { useHolderRows } from "../useHolderRows";
import { STATUS_META } from "../statusMeta";
import { STATUS_BUCKETS, formatEth } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const { hasStats, counts, totalBalance, coinIcon, groups } = useHolderRows();

const select = (filter) => (validatorsStore.statusFilter = filter);

// with a group filter the cards summarise that group; the filter itself is cleared from the group pill
const scopeLabel = computed(() => {
  const filter = validatorsStore.groupFilter;
  if (filter === "all") return t("validatorsPage.validators");
  if (filter === "ungrouped") return t("validatorsPage.ungrouped");
  return groups.value.find((g) => g.id === filter)?.name ?? t("validatorsPage.validators");
});

const totalCard = computed(() => ({
  filter: "all",
  label: scopeLabel.value,
  icon: "/img/icon/node-page-icons/validator-key-icon.png",
  value: counts.value.all,
  color: "text-gray-100",
}));

// one card per status that has validators; shares have no stats, so they get none
const statusCards = computed(() =>
  hasStats.value
    ? STATUS_BUCKETS.filter((bucket) => counts.value[bucket] > 0).map((bucket) => ({
        id: bucket,
        filter: bucket,
        label: t(`validatorsPage.status.${bucket}`),
        icon: STATUS_META[bucket].icon,
        iconClass: STATUS_META[bucket].iconClass,
        value: counts.value[bucket],
        color: STATUS_META[bucket].color,
      }))
    : []
);

const balanceCard = computed(() => ({
  label: t("validatorsPage.totalBalance"),
  icon: coinIcon.value ?? "/img/icon/staking-page-icons/balance.png",
  value: hasStats.value ? formatEth(totalBalance.value, 2) : "n/a",
  color: "text-[#74fa65]",
}));

// a filter whose status has no validators any more would show an empty list without a card to undo it
watch(
  () => [validatorsStore.statusFilter, counts.value],
  ([filter]) => {
    if (filter !== "all" && !counts.value[filter]) validatorsStore.statusFilter = "all";
  }
);
</script>
