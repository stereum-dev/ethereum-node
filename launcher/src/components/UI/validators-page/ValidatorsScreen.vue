<template>
  <base-layout>
    <div class="w-full h-full max-h-[492px] grid grid-cols-24 grid-rows-12 gap-1 p-1 select-none text-gray-200">
      <aside
        class="col-start-1 col-span-5 row-span-12 rounded-lg bg-linear-to-b from-[#1A1A20] to-[#0D0D12] border border-[#ffffff16] p-2 flex flex-col gap-2 min-h-0"
      >
        <div class="flex items-center gap-2 px-1">
          <img src="/img/icon/node-page-icons/validator-key-icon.png" class="w-4 h-4" alt="" />
          <span class="text-xs font-bold uppercase tracking-wide text-gray-300">{{ t("validatorsPage.clients") }}</span>
        </div>
        <span
          v-if="validatorsStore.holdersLoading && !validatorsStore.holders.length"
          class="flex items-center gap-2 text-xs text-gray-400 px-1"
        >
          <img src="/animation/loading/turning-circle.gif" class="w-5 h-5" alt="" />{{ t("validatorsPage.loading") }}
        </span>
        <span v-else-if="!validatorsStore.holders.length" class="text-xs text-gray-500 px-1">{{ t("validatorsPage.noClients") }}</span>
        <HolderList v-else class="min-h-0" />
      </aside>

      <div class="col-start-6 col-span-19 row-span-2 min-h-0">
        <SummaryCards v-if="validatorsStore.selectedHolder" />
      </div>

      <!-- the window has a fixed size, so the details slide in over the list instead of narrowing it -->
      <section
        class="relative col-start-6 col-span-19 row-start-3 row-span-10 rounded-lg bg-linear-to-b from-[#16181b] to-[#0D0D12] border border-[#ffffff16] p-2 min-h-0 overflow-hidden"
      >
        <template v-if="validatorsStore.selectedHolder">
          <KeyList v-if="validatorsStore.tab === 'keys'" @refresh="refreshKeys" />
          <DutiesPanel v-else-if="validatorsStore.tab === 'duties'" />
          <ClusterPanel v-else />
        </template>
        <transition
          enter-active-class="transition-transform duration-200"
          leave-active-class="transition-transform duration-200"
          enter-from-class="translate-x-full"
          leave-to-class="translate-x-full"
        >
          <aside
            v-if="validatorsStore.selectedPubkey && validatorsStore.tab === 'keys'"
            class="absolute top-0 right-0 h-full w-[300px] bg-linear-to-b from-[#1f2a2a] to-[#121417] border-l border-[#4b8585] shadow-[-8px_0_16px_rgba(0,0,0,0.5)] p-3 z-10"
          >
            <KeyDetails />
          </aside>
        </transition>
      </section>
    </div>
    <RenameModal v-if="modal?.type === 'rename'" :pubkey="modal.pubkeys[0]" @close="validatorsStore.modal = null" />
    <KeySettingModal
      v-if="modal?.type === 'graffiti' || modal?.type === 'feerecipient'"
      :setting="modal.type"
      :pubkeys="modal.pubkeys"
      @close="validatorsStore.modal = null"
    />
    <RemoveModal v-if="modal?.type === 'remove'" :pubkeys="modal.pubkeys" @close="validatorsStore.modal = null" />
    <ImportModal v-if="modal?.type === 'import'" :files="modal.files" @close="validatorsStore.modal = null" />
    <ExitModal v-if="modal?.type === 'exit'" :pubkeys="modal.pubkeys" @close="validatorsStore.modal = null" />
    <RemoteImportModal v-if="modal?.type === 'remoteImport'" @close="validatorsStore.modal = null" />
    <GroupModal
      v-if="modal?.type === 'group' || modal?.type === 'renameGroup'"
      :pubkeys="modal.pubkeys"
      :group-id="modal.groupID"
      @close="validatorsStore.modal = null"
    />
    <UngroupModal v-if="modal?.type === 'ungroup'" :group-id="modal.groupID" @close="validatorsStore.modal = null" />
  </base-layout>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from "vue";
import HolderList from "./components/HolderList.vue";
import KeyList from "./components/KeyList.vue";
import KeyDetails from "./components/KeyDetails.vue";
import DutiesPanel from "./components/DutiesPanel.vue";
import ClusterPanel from "./components/ClusterPanel.vue";
import SummaryCards from "./components/SummaryCards.vue";
import RenameModal from "./components/modals/RenameModal.vue";
import KeySettingModal from "./components/modals/KeySettingModal.vue";
import RemoveModal from "./components/modals/RemoveModal.vue";
import ImportModal from "./components/modals/ImportModal.vue";
import ExitModal from "./components/modals/ExitModal.vue";
import RemoteImportModal from "./components/modals/RemoteImportModal.vue";
import GroupModal from "./components/modals/GroupModal.vue";
import UngroupModal from "./components/modals/UngroupModal.vue";
import { useValidatorsStore } from "@/store/validators";
import { useServices } from "@/store/services";
import { holderTabs } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const serviceStore = useServices();
const modal = computed(() => validatorsStore.modal);
const STATES_REFRESH_MS = 60000;
const CSM_REFRESH_MS = 15 * 60000;
let statesTimer = null;
let csmTimer = null;
let unmounted = false;

// keys of the selected holder (cached unless forced), then their beacon states
const refresh = async (force = false) => {
  const holderId = validatorsStore.selectedHolderId;
  if (!holderId) return;
  await validatorsStore.loadKeys(holderId, force);
  if (!unmounted) await validatorsStore.loadStates(holderId);
};

// the Refresh of the key list also reads the CSM queue again, bypassing its cache
const refreshKeys = () => {
  refresh(true);
  if (validatorsStore.csm.installed) validatorsStore.loadCsmKeys(true);
};

watch(
  () => validatorsStore.selectedHolderId,
  () => {
    if (!holderTabs(validatorsStore.selectedHolder?.role).includes(validatorsStore.tab)) validatorsStore.tab = "keys";
    validatorsStore.selectedPubkey = null;
    validatorsStore.statusFilter = "all";
    validatorsStore.groupFilter = "all";
    validatorsStore.selection = {};
    refresh();
  }
);

// bulk actions must not reach keys the new group filter hides
watch(
  () => validatorsStore.groupFilter,
  () => (validatorsStore.selection = {})
);

onMounted(async () => {
  // fee recipients of CSM keys stay locked until this server's CSM keys are read
  validatorsStore.unconfirmCsm(serviceStore.installedServices.some((s) => s.service === "LCOMService"));
  await Promise.all([validatorsStore.loadHolders(), validatorsStore.loadAliases()]);
  if (unmounted) return;
  await refresh();
  if (unmounted) return;
  // the CSM lookup is slow and opens RPC tunnels, so it runs once here and rarely after
  validatorsStore.loadCsmKeys();
  csmTimer = setInterval(() => validatorsStore.csm.installed && validatorsStore.loadCsmKeys(), CSM_REFRESH_MS);
  // then list the other holders' keys one after another, so every card shows its key count
  for (const holder of validatorsStore.holders) {
    if (unmounted) return;
    await validatorsStore.loadKeys(holder.id);
  }
  // the timer is created after the awaits, so a page left meanwhile must not start it
  if (!unmounted) statesTimer = setInterval(() => validatorsStore.loadStates(validatorsStore.selectedHolderId), STATES_REFRESH_MS);
});

onUnmounted(() => {
  unmounted = true;
  clearInterval(statesTimer);
  clearInterval(csmTimer);
});
</script>
