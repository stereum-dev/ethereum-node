<template>
  <div class="flex flex-col w-full h-full min-h-0 gap-1.5">
    <!-- toolbar -->
    <div class="flex items-center gap-2 h-7 shrink-0">
      <SectionTabs />
      <span class="grow" />
      <span v-if="entry?.loadedAt" class="text-2xs text-gray-400 whitespace-nowrap">{{
        t("validatorsPage.cluster.updated", { time: new Date(entry.loadedAt).toLocaleTimeString() })
      }}</span>
      <img v-if="entry?.loading" src="/animation/loading/turning-circle.gif" class="w-5 h-5 shrink-0" alt="loading" />
      <button
        class="h-7 px-3 rounded-full bg-[#336666] hover:bg-[#4b8585] text-2xs font-semibold uppercase whitespace-nowrap shrink-0 shadow-xs shadow-[#1c3634] disabled:opacity-50"
        :disabled="entry?.loading"
        @click="load"
      >
        {{ t("validatorsPage.refresh") }}
      </button>
    </div>

    <p v-if="holder?.role === 'share'" class="flex items-center gap-1.5 text-2xs text-gray-400 px-1">
      <img src="/img/icon/staking-page-icons/obol-key.png" class="w-3.5 h-3.5" alt="" />
      {{ t("validatorsPage.cluster.of", { client: dvtClientName }) }}
    </p>
    <p v-if="entry?.error" class="text-2xs text-red-400 px-1 truncate" :title="entry.error">
      {{ t("validatorsPage.cluster.error") }}: {{ entry.error }}
    </p>
    <p v-if="entry?.loadedAt && entry.empty" class="text-xs text-gray-500 px-1">
      {{ entry.kind === "ssv" ? t("validatorsPage.cluster.ssvEmpty") : t("validatorsPage.cluster.empty") }}
    </p>

    <div v-if="entry?.loadedAt && !entry.empty" class="grid grid-cols-3 grid-rows-2 gap-1 h-[132px] shrink-0">
      <SummaryCard v-for="card in cards" :key="card.id" :card="card" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from "vue";
import SectionTabs from "./SectionTabs.vue";
import SummaryCard from "./SummaryCard.vue";
import { useValidatorsStore } from "@/store/validators";
import { useHolderRows } from "../useHolderRows";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const { holder, dvtClientName } = useHolderRows();

const ICONS = "/img/icon/staking-page-icons/";
const REFRESH_MS = 120000;
const entry = computed(() => validatorsStore.clustersByHolder[holder.value?.id]);

const shown = (v) => (v === undefined || v === null || v === "" ? "-" : String(v));
const percent = (v) => (Number.isFinite(parseFloat(v)) ? `${parseFloat(v).toFixed(2)} %` : "-");

const obolCards = (stats, service) => [
  {
    id: "peer",
    label: t("validatorsPage.cluster.peer"),
    icon: ICONS + "obol-key.png",
    value: shown(stats.peerName),
    color: "text-gray-100",
  },
  {
    id: "status",
    label: t("validatorsPage.cluster.status"),
    icon: ICONS + "check.png",
    value: shown(stats.nodeStatus),
    color: stats.nodeStatus === "ACTIVE" ? "text-green-400" : stats.nodeStatus ? "text-red-400" : "text-gray-300",
  },
  {
    id: "operators",
    label: t("validatorsPage.cluster.operators"),
    icon: ICONS + "group.png",
    value:
      stats.operators !== undefined
        ? t("validatorsPage.cluster.operatorsValue", { operators: stats.operators, threshold: shown(stats.threshold) })
        : "-",
    color: "text-gray-100",
  },
  {
    id: "validators",
    label: t("validatorsPage.cluster.validators"),
    icon: "/img/icon/node-page-icons/validator-key-icon.png",
    value: shown(stats.validators),
    color: "text-gray-100",
  },
  {
    id: "performance",
    label: t("validatorsPage.cluster.performance"),
    icon: ICONS + "predicition-icon.png",
    value: percent(stats.attestationPerformance),
    color: "text-[#74fa65]",
  },
  // Pluto does not report participation
  ...(service === "PlutoService"
    ? []
    : [
        {
          id: "participation",
          label: t("validatorsPage.cluster.participation"),
          icon: ICONS + "sync-committee.png",
          value: shown(stats.attestationParticipation),
          color: "text-gray-100",
        },
      ]),
];

const ssvCards = (stats) => [
  {
    id: "operator",
    label: t("validatorsPage.cluster.operator"),
    icon: ICONS + "ssv-key.png",
    value: shown(stats.operator),
    sub: stats.name ?? "",
    color: "text-gray-100",
  },
  {
    id: "status",
    label: t("validatorsPage.cluster.status"),
    icon: ICONS + "check.png",
    value: shown(stats.status),
    color: String(stats.status).toLowerCase() === "active" ? "text-green-400" : "text-gray-300",
  },
  {
    id: "performance24h",
    label: t("validatorsPage.cluster.performance24h"),
    icon: ICONS + "predicition-icon.png",
    value: percent(stats.performance),
    color: "text-[#74fa65]",
  },
  {
    id: "performance30d",
    label: t("validatorsPage.cluster.performance30d"),
    icon: ICONS + "predicition-icon.png",
    value: percent(stats.performance30d),
    color: "text-[#74fa65]",
  },
  {
    id: "visibility",
    label: t("validatorsPage.cluster.visibility"),
    icon: ICONS + "eye.png",
    value: stats.private === undefined ? "-" : stats.private ? t("validatorsPage.cluster.private") : t("validatorsPage.cluster.public"),
    color: "text-gray-100",
  },
  {
    id: "validators",
    label: t("validatorsPage.cluster.validators"),
    icon: "/img/icon/node-page-icons/validator-key-icon.png",
    value: shown(stats.validators),
    color: "text-gray-100",
  },
];

const cards = computed(() => {
  const e = entry.value;
  if (!e) return [];
  return e.kind === "ssv" ? ssvCards(e.stats ?? {}) : obolCards(e.stats ?? {}, e.service);
});

// the store's in-flight guard keeps a slow Prometheus or SSV API from stacking requests
const load = () => holder.value && validatorsStore.loadClusterStats(holder.value.id);

let timer = null;
watch(() => holder.value?.id, load);
onMounted(() => {
  load();
  timer = setInterval(load, REFRESH_MS);
});
onUnmounted(() => clearInterval(timer));
</script>
