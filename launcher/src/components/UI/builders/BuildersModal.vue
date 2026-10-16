<template>
  <ValidatorModal :title="t('builders.title')" icon="/img/icon/service-icons/Other/Builders.png" wide @close="requestClose">
    <span v-if="store.loading && !store.setups.length" class="flex items-center gap-2 text-xs text-gray-400">
      <img src="/animation/loading/turning-circle.gif" class="w-4 h-4" alt="" />{{ t("builders.loading") }}
    </span>
    <p v-else-if="store.error" class="text-xs text-red-400 break-all">{{ store.error }}</p>
    <p v-else-if="!setup" class="text-xs text-gray-400">{{ t("builders.noSetups") }}</p>

    <template v-else-if="draft">
      <div class="flex items-center gap-2 text-xs">
        <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.setup") }}</span>
        <span class="font-semibold">{{ setup.name }}</span>
        <span class="text-2xs text-gray-400">{{ setup.network }}</span>
      </div>
      <p class="text-xs text-[#7fb3b3]">{{ t("builders.intro") }}</p>
      <div
        v-if="!setup.saved || setup.mevBoost"
        class="rounded-lg border border-[#4b8585] bg-[#224141] px-3 py-2 text-xs flex flex-col gap-1"
      >
        <div class="flex items-center gap-2">
          <span class="grow">{{ sourceText }}</span>
          <ActionButton v-if="setup.saved && setup.mevBoost" :label="t('builders.fromMevBoost')" @click="fromMevBoost" />
        </div>
        <span v-if="missing.length" class="text-amber-300">{{
          t("builders.migrationMissing", { relays: missing.join(", "), network: setup.network })
        }}</span>
      </div>

      <div v-if="ownClients.length" class="flex flex-wrap items-center gap-2">
        <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.settingsFor") }}</span>
        <button
          v-for="option in scopes"
          :key="option.id"
          class="px-3 py-1 rounded-full text-xs font-semibold border"
          :class="scope === option.id ? 'bg-[#336666] border-[#4b8585]' : 'bg-[#1d2023] border-gray-600 hover:border-[#4b8585]'"
          @click="scope = option.id"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="flex border-b border-[#4b8585]">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase border-b-2 -mb-px"
          :class="activeTab === tab.id ? 'border-teal-400 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span v-if="tab.marker" class="w-2 h-2 rounded-full" :class="tab.marker" />
        </button>
      </div>

      <div class="min-h-[22rem] shrink-0 flex flex-col">
        <BuilderRelays
          v-if="activeTab === 'relays'"
          v-model="editing"
          :network="setup.network"
          :mev-boost-relays="setup.mevBoostRelays"
          :nimbus="scopeClients.some((c) => c.service === 'NimbusValidatorService')"
        />
        <BuilderBids v-else-if="activeTab === 'bids'" v-model="editing" :clients="scopeClients" />
        <BuilderClients v-else-if="activeTab === 'clients'" :setup="setup" :draft="draft" @own="setOwn" @edit="editClient" />
        <BuilderExpert v-else v-model="editing" />
      </div>

      <p v-if="problems.length" class="text-xs text-red-400">{{ problems.join(", ") }}</p>
      <div v-if="result" class="text-xs" :class="result.code === 0 ? 'text-green-400' : 'text-amber-300'">
        <template v-if="result.info">{{ result.info }}</template>
        <template v-else>{{ t("builders.applied", { ok: appliedCount, total: result.results.length }, result.results.length) }}</template>
      </div>
    </template>

    <template #footer>
      <ActionButton :label="t('builders.cancel')" @click="requestClose" />
      <ActionButton :label="t('builders.save')" primary :disabled="!canSave" @click="save" />
    </template>
  </ValidatorModal>

  <ValidatorModal
    v-if="reminder"
    :title="t(`builders.reminder.${reminder.kind}.title`)"
    icon="/img/icon/service-icons/Other/Builders.png"
    @close="reminder = null"
  >
    <p class="text-xs">{{ t(`builders.reminder.${reminder.kind}.text`) }}</p>
    <div
      v-for="line in reminder.lines"
      :key="line.text"
      class="rounded-lg border px-3 py-2 text-xs"
      :class="line.level === 'red' ? 'border-red-500 bg-red-900/20 text-red-300' : 'border-[#4b8585] bg-[#224141]'"
    >
      {{ line.text }}
    </div>
    <template #footer>
      <template v-if="reminder.kind === 'close'">
        <ActionButton :label="t('builders.reminder.discard')" @click="discard" />
        <ActionButton :label="t('builders.reminder.keepEditing')" @click="reminder = null" />
      </template>
      <ActionButton
        v-else
        :label="reminder.canApply ? t('builders.reminder.review') : t('builders.reminder.ok')"
        @click="reminder = null"
      />
      <ActionButton v-if="reminder.canApply" :label="t('builders.save')" primary :disabled="!canSave" @click="saveFromReminder" />
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import ValidatorModal from "@/components/UI/validators-page/components/ValidatorModal.vue";
import ActionButton from "@/components/UI/validators-page/components/ActionButton.vue";
import BuilderRelays from "./BuilderRelays.vue";
import BuilderBids from "./BuilderBids.vue";
import BuilderClients from "./BuilderClients.vue";
import BuilderExpert from "./BuilderExpert.vue";
import { clientStatus, shortName } from "./clientInfo";
import { useBuilders } from "@/store/builders";
import { useSetups } from "@/store/setups";
import { validateBuilderSettings, DEFAULT_BUILDER_SETTINGS } from "@/share/builders";
import i18n from "@/includes/i18n";

const emit = defineEmits(["close"]);
const t = i18n.global.t;
const store = useBuilders();
const setupsStore = useSetups();

// the dialog belongs to the setup that is open
const setupId = computed(() => setupsStore.selectedSetup?.setupId ?? null);
watch(setupId, (id) => !id && emit("close"));
const setup = computed(() => store.setups.find((s) => s.setupId === setupId.value));
const draft = ref(null);
const missing = ref([]);
const activeTab = ref("relays");
// "default" or the id of a validator client with its own settings
const scope = ref("default");
const busy = ref(false);
const result = ref(null);

// the draft as it was last loaded or saved, to tell unapplied edits
const baseline = ref("");
const startWith = (fromSetup) => {
  const start = store.draftFor(setup.value, fromSetup);
  draft.value = { ...start.builders, clients: start.builders.clients ?? {} };
  baseline.value = JSON.stringify(draft.value);
  missing.value = start.missing;
  scope.value = "default";
  result.value = null;
};
watch(
  setup,
  (current, previous) => {
    if (!current || current.setupId === previous?.setupId) return;
    startWith(!current.saved);
    activeTab.value = "relays";
  },
  { immediate: true }
);
const fromMevBoost = () => startWith(true);

const sourceText = computed(() => {
  if (setup.value.saved) return t("builders.source.saved");
  if (setup.value.mevBoost) return t("builders.source.mevBoost");
  return t("builders.source.local");
});

const isOwn = (id) => !!draft.value?.clients?.[id]?.own;
const ownClients = computed(() => (setup.value?.clients ?? []).filter((c) => isOwn(c.id)));
const scopes = computed(() => [
  { id: "default", label: t("builders.setupDefault") },
  ...ownClients.value.map((c) => ({ id: c.id, label: shortName(c.service) })),
]);
// the settings the Relays, Bids and Expert tabs edit
const editing = computed({
  get: () => (scope.value === "default" ? draft.value : draft.value.clients[scope.value]),
  set: (value) => {
    if (scope.value === "default") draft.value = value;
    else draft.value.clients[scope.value] = value;
  },
});
// the validator clients that use the settings being edited
const scopeClients = computed(() =>
  (setup.value?.clients ?? []).filter((c) => (scope.value === "default" ? !isOwn(c.id) : c.id === scope.value))
);

const setOwn = (id, own) => {
  draft.value.clients = {
    ...draft.value.clients,
    // own settings start as a copy of the setup's
    [id]: own
      ? { ...JSON.parse(JSON.stringify({ ...DEFAULT_BUILDER_SETTINGS, ...draft.value, clients: undefined })), own: true }
      : { own: false },
  };
  if (!own && scope.value === id) scope.value = "default";
};
const editClient = (id) => {
  scope.value = id;
  activeTab.value = "relays";
};

const clientsMarker = computed(() => {
  const dots = (setup.value?.clients ?? []).map((c) => clientStatus(c, setup.value).dot);
  return dots.find((d) => d === "bg-red-500") ?? dots.find(Boolean) ?? null;
});
const tabs = computed(() => [
  { id: "relays", label: t("builders.tab.relays") },
  { id: "bids", label: t("builders.tab.bids") },
  { id: "clients", label: t("builders.tab.clients"), marker: clientsMarker.value },
  { id: "expert", label: t("builders.tab.expert") },
]);

const problems = computed(() => {
  if (!draft.value) return [];
  const own = Object.values(draft.value.clients ?? {}).filter((c) => c?.own);
  return [...new Set([draft.value, ...own].flatMap((s) => validateBuilderSettings(s)))];
});

const appliedCount = computed(() => result.value?.results?.filter((r) => r.applied).length ?? 0);
const canSave = computed(() => !!draft.value && !busy.value && problems.value.length === 0);
const save = async () => {
  busy.value = true;
  result.value = null;
  try {
    result.value = await store.save(setupId.value, draft.value);
    if (result.value?.code !== 1) baseline.value = JSON.stringify(draft.value);
  } catch (err) {
    result.value = { code: 1, info: String(err?.message ?? err) };
  } finally {
    busy.value = false;
  }
};

// a second dialog that asks to apply: on opening when something is not applied, on closing with unapplied edits
const reminder = ref(null);
const names = (clients) => clients.map((c) => shortName(c.service)).join(", ");
const openReminder = () => {
  const current = setup.value;
  if (!current || !draft.value) return;
  const lines = [];
  let canApply = false;
  if (!current.saved && current.mevBoost) {
    canApply = true;
    lines.push({
      text: draft.value.relays.length
        ? t("builders.reminder.taken", { relays: draft.value.relays.map((r) => r.name).join(", ") })
        : t("builders.reminder.noneTaken"),
    });
    if (missing.value.length)
      lines.push({ text: t("builders.migrationMissing", { relays: missing.value.join(", "), network: current.network }) });
  }
  const outOfSync = current.saved ? current.clients.filter((c) => c.support.apply && c.inSync === false) : [];
  if (outOfSync.length) {
    canApply = true;
    lines.push({ text: t("builders.reminder.outOfSync", { clients: names(outOfSync) }) });
  }
  const configured = (current.saved ? current.builders.relays?.length : draft.value.relays.length) > 0;
  // only worth a reminder while some client can take the settings; the fork alert covers the rest
  const settable = current.clients.some((c) => c.support.apply);
  const outdated = configured && settable ? current.clients.filter((c) => c.support.reason === "update") : [];
  if (outdated.length) lines.push({ level: "red", text: t("builders.reminder.update", { clients: names(outdated) }) });
  if (lines.length) reminder.value = { kind: canApply ? "apply" : "outdated", lines, canApply };
};
const unapplied = computed(() => {
  if (!draft.value || !setup.value) return false;
  if (JSON.stringify(draft.value) !== baseline.value) return true;
  // settings taken over from MEV-Boost are not applied until saved
  return !setup.value.saved && draft.value.relays.length > 0;
});
const requestClose = () => {
  // Escape reaches this dialog first
  if (reminder.value) return (reminder.value = null);
  if (unapplied.value && !busy.value) return (reminder.value = { kind: "close", lines: [], canApply: true });
  emit("close");
};
const discard = () => {
  reminder.value = null;
  emit("close");
};
const saveFromReminder = async () => {
  reminder.value = null;
  await save();
};

onMounted(async () => {
  await store.load();
  openReminder();
});
</script>
