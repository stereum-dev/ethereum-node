<template>
  <!-- keystores dropped anywhere on the list open the import with them -->
  <div class="flex flex-col w-full h-full min-h-0 gap-1.5" @dragover.prevent @drop.prevent="onDropFiles">
    <!-- toolbar -->
    <div class="flex items-center gap-2">
      <SectionTabs />
      <div class="relative w-52 min-w-0 shrink">
        <svg aria-hidden="true" class="absolute left-2.5 top-1.5 w-4 h-4 text-[#7fb3b3]" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          v-model="searchInput"
          type="text"
          :placeholder="t('validatorsPage.search')"
          class="h-7 w-full rounded-full bg-[#0D0D12] border border-[#4b8585] pl-8 pr-3 text-xs text-gray-200 outline-hidden focus:border-teal-400"
        />
      </div>
      <GroupFilter />
      <span class="grow" />
      <span v-if="sourceNote" class="text-2xs text-amber-300 truncate max-w-[260px]" :title="sourceNote">{{ sourceNote }}</span>
      <img
        v-if="statesEntry?.loading || keysEntry?.loading"
        src="/animation/loading/turning-circle.gif"
        class="w-5 h-5 shrink-0"
        alt="loading"
      />
      <ActionButton
        v-if="canImport"
        icon="/img/icon/staking-page-icons/validator-import.svg"
        :label="t('validatorsPage.import')"
        :title="whenRunning(t('validatorsPage.import'))"
        :disabled="clientStopped"
        primary
        @click="openImport([])"
      />
      <ActionButton
        v-if="canImportRemote"
        icon="/img/icon/staking-page-icons/remote-key-icon.svg"
        :label="t('validatorsPage.remoteImport.short')"
        :title="remoteImportBlock ?? t('validatorsPage.remoteImport.button')"
        :disabled="!!remoteImportBlock"
        @click="validatorsStore.modal = { type: 'remoteImport', pubkeys: [] }"
      />
      <IconButton
        icon="/img/icon/staking-page-icons/copy.png"
        :label="copyLabel('list')"
        :disabled="!rows.length"
        @click="copyKeys(rows, 'list')"
      />
      <IconButton
        icon="/img/icon/staking-page-icons/export.png"
        :label="t('validatorsPage.exportCsv')"
        :disabled="!rows.length"
        @click="exportCsv(rows)"
      />
      <button
        class="h-7 px-3 rounded-full bg-[#336666] hover:bg-[#4b8585] text-2xs font-semibold uppercase whitespace-nowrap shrink-0 shadow-xs shadow-[#1c3634] disabled:opacity-50"
        :disabled="keysEntry?.loading"
        @click="$emit('refresh')"
      >
        {{ t("validatorsPage.refresh") }}
      </button>
    </div>

    <p v-if="holder?.role === 'share'" class="flex items-center gap-1.5 text-2xs text-gray-400 px-1">
      <img src="/img/icon/staking-page-icons/obol-key.png" class="w-3.5 h-3.5" alt="" />
      {{ t("validatorsPage.shareNote", { client: dvtClientName }) }}
    </p>
    <div
      v-if="clientStopped"
      class="flex items-center gap-2 rounded-lg border border-red-500/60 bg-red-900/20 px-3 py-1.5 text-xs text-red-200"
    >
      <span class="w-2.5 h-2.5 shrink-0 rounded-full bg-red-500" />
      {{ t("validatorsPage.clientStopped") }}
    </div>
    <p v-else-if="keysEntry?.error" class="text-2xs text-red-400 px-1">{{ t("validatorsPage.keysError") }}: {{ keysEntry.error }}</p>
    <p v-if="statesEntry?.error" class="text-2xs text-amber-300 px-1">{{ t("validatorsPage.statesError") }}: {{ statesEntry.error }}</p>
    <p
      v-if="validatorsStore.csm.error && CSM_ROLES.includes(holder?.role)"
      class="text-2xs text-amber-300 px-1 truncate"
      :title="validatorsStore.csm.error"
    >
      {{ t("validatorsPage.csm.error") }}: {{ validatorsStore.csm.error }}
    </p>

    <!-- actions for the checked keys -->
    <div v-if="selectedRows.length" class="flex items-center gap-1.5 rounded-full bg-[#224141] border border-[#4b8585] pl-4 pr-1 py-1">
      <span class="text-xs font-bold grow min-w-0 truncate">{{ t("validatorsPage.selectedCount", { count: selectedRows.length }) }}</span>
      <template v-if="canSetKeySettings">
        <ActionButton
          icon="/img/icon/staking-page-icons/option-graffiti.png"
          :label="t('validatorsPage.graffiti')"
          :title="whenRunning(t('validatorsPage.graffiti'))"
          :disabled="clientStopped"
          @click="openBulk('graffiti')"
        />
        <ActionButton
          icon="/img/icon/staking-page-icons/option-fee-recepient.png"
          :label="t('validatorsPage.feeRecipient')"
          :title="whenRunning(t('validatorsPage.feeRecipient'))"
          :disabled="clientStopped"
          @click="openBulk('feerecipient')"
        />
      </template>
      <button
        v-if="canRemove"
        class="h-7 px-3 rounded-full bg-red-800 hover:bg-red-700 border border-red-500 text-2xs font-semibold uppercase whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        :title="whenRunning(t('validatorsPage.remove'))"
        :disabled="clientStopped"
        @click="openBulk('remove')"
      >
        {{ t("validatorsPage.remove") }}
      </button>
      <button
        v-if="canExit"
        class="h-7 px-3 rounded-full border border-red-500 text-red-300 bg-transparent hover:bg-red-900/40 text-2xs font-semibold uppercase whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        :title="whenRunning(t('validatorsPage.exit'))"
        :disabled="clientStopped"
        @click="openBulk('exit')"
      >
        {{ t("validatorsPage.exit") }}
      </button>
      <ActionButton icon="/img/icon/staking-page-icons/group.png" :label="t('validatorsPage.group')" @click="openBulk('group')" />
      <ActionButton :label="copyLabel('selection')" @click="copyKeys(selectedRows, 'selection')" />
      <ActionButton :label="t('validatorsPage.exportCsv')" @click="exportCsv(selectedRows)" />
      <ActionButton :label="t('validatorsPage.clearSelection')" @click="validatorsStore.selection = {}" />
    </div>

    <!-- header -->
    <div :class="COLUMNS" class="items-center pl-1 pr-2 text-2xs font-semibold uppercase text-[#7fb3b3]">
      <CheckMark
        :checked="allChecked"
        :partial="!allChecked && selectedRows.length > 0"
        :title="t('validatorsPage.selectAll')"
        @toggle="toggleAll"
      />
      <span />
      <span>{{ t("validatorsPage.col.key") }}</span>
      <span>{{ t("validatorsPage.col.index") }}</span>
      <span>{{ t("validatorsPage.col.status") }}</span>
      <span class="text-right">{{ t("validatorsPage.col.balance") }}</span>
      <span class="text-right">{{ t("validatorsPage.col.since") }}</span>
      <span />
    </div>

    <!-- rows -->
    <div class="grow min-h-0">
      <div v-if="keysEntry?.loading && !rows.length" class="flex items-center gap-2 text-xs text-gray-400 px-2">
        <img src="/animation/loading/turning-circle.gif" class="w-5 h-5" alt="" />{{ t("validatorsPage.loading") }}
      </div>
      <div v-else-if="!rows.length" class="text-xs text-gray-500 px-2">
        {{ allRows.length ? t("validatorsPage.noMatch") : t("validatorsPage.noKeys") }}
      </div>
      <VirtualList v-else :items="rows" :item-height="34" :item-key="(row) => row.pubkey">
        <template #default="{ item }">
          <div
            :class="[
              COLUMNS,
              item.pubkey === validatorsStore.selectedPubkey
                ? 'border-[#4b8585] bg-[#224141] shadow-[0_0_8px_rgba(75,133,133,0.45)]'
                : 'border-transparent bg-linear-to-r from-[#25302f] to-[#1b1f22] hover:from-[#2c3d3c]',
            ]"
            class="items-center h-[30px] pl-1 pr-2 rounded-full border text-xs cursor-pointer transition-colors"
            @click="validatorsStore.selectedPubkey = item.pubkey"
          >
            <CheckMark :checked="!!validatorsStore.selection[item.pubkey]" @toggle="validatorsStore.toggleSelection(item.pubkey)" />
            <span class="w-6 h-6 rounded-full bg-[#0D0D12] border border-[#4b8585] flex items-center justify-center">
              <img :src="keyIcon(item)" class="w-4 h-4" alt="" />
            </span>
            <span class="flex items-center gap-1.5 min-w-0">
              <span class="min-w-0 truncate font-semibold" :title="item.pubkey">{{ item.alias || shortPubkey(item.pubkey) }}</span>
              <span
                v-if="item.group && validatorsStore.groupFilter !== item.group.id"
                class="min-w-0 max-w-[56px] shrink-[4] truncate rounded-full px-1.5 h-4 leading-4 text-2xs bg-[#224141] border border-[#4b8585] text-[#7fb3b3]"
                :title="item.group.name"
                @click.stop="validatorsStore.groupFilter = item.group.id"
                >{{ item.group.name }}</span
              >
            </span>
            <span class="text-gray-300">{{ item.state?.index ?? "-" }}</span>
            <span v-if="item.exitSent" class="flex items-center gap-1.5 min-w-0">
              <img :src="STATUS_META.exiting.icon" class="w-5 h-5 shrink-0" :class="STATUS_META.exiting.iconClass" alt="" />
              <span class="truncate text-amber-400">{{ t("validatorsPage.status.exitSent") }}</span>
            </span>
            <span v-else class="flex items-center gap-1.5 min-w-0">
              <img
                v-if="hasStats"
                :src="STATUS_META[item.bucket].icon"
                class="w-5 h-5 shrink-0"
                :class="STATUS_META[item.bucket].iconClass"
                alt=""
              />
              <span class="truncate" :class="STATUS_META[item.bucket].color">{{
                hasStats ? t(`validatorsPage.status.${item.bucket}`) : "n/a"
              }}</span>
            </span>
            <span class="flex items-center justify-end gap-1">
              <span>{{ hasStats ? formatEth(item.state?.balance) : "n/a" }}</span>
            </span>
            <span class="text-right text-gray-400">{{ item.since }}</span>
            <span class="flex justify-end gap-1">
              <IconButton
                small
                icon="/img/icon/staking-page-icons/copy.png"
                :label="t('validatorsPage.copy')"
                @click="copyPubkey(item.pubkey)"
              />
              <IconButton
                v-if="hasExplorer"
                small
                icon="/img/icon/staking-page-icons/beaconcha.png"
                label="beaconcha.in"
                @click="openExplorer(item)"
              />
              <IconButton
                small
                icon="/img/icon/staking-page-icons/rename.png"
                :label="t('validatorsPage.rename')"
                @click="openModal('rename', item)"
              />
              <IconButton
                v-if="canSetKeySettings"
                small
                icon="/img/icon/staking-page-icons/option-graffiti.png"
                :label="whenRunning(t('validatorsPage.graffiti'))"
                :disabled="clientStopped"
                @click="openModal('graffiti', item)"
              />
              <IconButton
                v-if="canSetKeySettings && !item.csm"
                small
                icon="/img/icon/staking-page-icons/option-fee-recepient.png"
                :label="whenRunning(t('validatorsPage.feeRecipient'))"
                :disabled="clientStopped"
                @click="openModal('feerecipient', item)"
              />
              <IconButton
                v-if="canRemove"
                small
                icon="/img/icon/staking-page-icons/option-remove.png"
                :label="whenRunning(t('validatorsPage.remove'))"
                :disabled="clientStopped"
                @click="openModal('remove', item)"
              />
              <IconButton
                v-if="canExit"
                small
                icon="/img/icon/staking-page-icons/option-withdraw.png"
                :label="exitLabel(item)"
                :disabled="exitDisabled(item)"
                @click="openModal('exit', item)"
              />
            </span>
          </div>
        </template>
      </VirtualList>
    </div>
  </div>
</template>

<script setup>
import { computed, markRaw, ref, watch } from "vue";
import VirtualList from "./VirtualList.vue";
import IconButton from "./IconButton.vue";
import ActionButton from "./ActionButton.vue";
import CheckMark from "./CheckMark.vue";
import GroupFilter from "./GroupFilter.vue";
import SectionTabs from "./SectionTabs.vue";
import { saveAs } from "file-saver";
import { useKeyActions } from "../useKeyActions";
import { useValidatorsStore } from "@/store/validators";
import { useHolderRows } from "../useHolderRows";
import { STATUS_META } from "../statusMeta";
import { shortPubkey, formatEth, explorerUrl, keysToCsv } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

defineEmits(["refresh"]);

const t = i18n.global.t;
// only keys of a validator client (or the Web3Signer behind one) can be Lido CSM keys
const CSM_ROLES = ["validator", "signer"];
const validatorsStore = useValidatorsStore();
const { holder, keysEntry, statesEntry, hasStats, allRows, rows, dvtClientName } = useHolderRows();
const {
  copyPubkey,
  openExplorer,
  canSetKeySettings,
  canRemove,
  canImport,
  canImportRemote,
  remoteImportBlock,
  canExit,
  exitDisabled,
  exitLabel,
  clientStopped,
  whenRunning,
} = useKeyActions();
const openModal = (type, row) => (validatorsStore.modal = { type, pubkeys: [row.pubkey] });
const hasExplorer = computed(() => !!explorerUrl(holder.value?.network, "x"));

// checked keys in list order; the selection may hold keys a filter currently hides
const selectedRows = computed(() => allRows.value.filter((row) => validatorsStore.selection[row.pubkey]));
const allChecked = computed(() => rows.value.length > 0 && rows.value.every((row) => validatorsStore.selection[row.pubkey]));
// the header box checks every key the current filter and search show, or clears them all
const toggleAll = () => {
  if (allChecked.value) validatorsStore.selection = {};
  else validatorsStore.selection = Object.fromEntries(rows.value.map((row) => [row.pubkey, true]));
};
const openBulk = (type) => (validatorsStore.modal = { type, pubkeys: selectedRows.value.map((row) => row.pubkey) });

// pubkeys one per line, e.g. to paste into a deposit tool or a spreadsheet column
const copiedFrom = ref(null);
const copyLabel = (from) =>
  copiedFrom.value?.from === from ? t("validatorsPage.copiedKeys", { count: copiedFrom.value.count }) : t("validatorsPage.copyKeys");
const copyKeys = async (list, from) => {
  await navigator.clipboard.writeText(list.map((row) => row.pubkey).join("\n"));
  copiedFrom.value = { from, count: list.length };
  setTimeout(() => (copiedFrom.value = null), 1500);
};

const openImport = (files) => (validatorsStore.modal = { type: "import", pubkeys: [], files: markRaw(files) });
const onDropFiles = (event) =>
  canImport.value && !clientStopped.value && event.dataTransfer?.files?.length && openImport([...event.dataTransfer.files]);

const exportCsv = (list) => {
  const name = `${holder.value?.service?.replace(/Service$/, "") ?? "validators"}-${holder.value?.network ?? ""}-keys.csv`;
  saveAs(new Blob([keysToCsv(list)], { type: "text/csv;charset=utf-8" }), name);
};

const COLUMNS = "grid grid-cols-[18px_28px_1fr_76px_116px_92px_58px_196px] gap-2";
const ICONS = "/img/icon/staking-page-icons/";

const keyIcon = (row) => {
  if (row.csm) return ICONS + "csm-key.png";
  if (holder.value?.role === "distributed") return ICONS + "obol-key.png";
  if (holder.value?.role === "ssv") return ICONS + "ssv-key.png";
  return row.remote ? ICONS + "remote-key-icon.svg" : "/img/icon/node-page-icons/validator-key-icon.png";
};

const sourceNote = computed(() => {
  const entry = statesEntry.value;
  return entry?.base && entry.source === "configured" ? t("validatorsPage.sourceConfigured", { base: entry.base }) : "";
});

// debounced so typing does not re-filter thousands of rows on every key stroke
const searchInput = ref(validatorsStore.search);
let searchTimer;
watch(searchInput, (value) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => (validatorsStore.search = value.trim().toLowerCase()), 150);
});
</script>
