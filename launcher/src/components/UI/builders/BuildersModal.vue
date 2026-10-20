<template>
  <ValidatorModal :title="t('builders.title')" icon="/img/icon/service-icons/Other/Builders.png" wide fill @close="requestClose">
    <span v-if="store.loading && !store.setups.length" class="flex items-center gap-2 text-xs text-gray-400">
      <img src="/animation/loading/turning-circle.gif" class="w-4 h-4" alt="" />{{ t("builders.loading") }}
    </span>
    <p v-else-if="store.error" class="text-xs text-red-400 break-all">{{ store.error }}</p>
    <p v-else-if="!setup || !setup.clients.length" class="text-xs text-gray-400">{{ t("builders.noSetups") }}</p>

    <template v-else-if="draft && client">
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

      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in setup.clients"
          :key="c.id"
          class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
          :class="c.id === clientId ? 'bg-[#336666] border-[#4b8585]' : 'bg-[#1d2023] border-gray-600 hover:border-[#4b8585]'"
          @click="clientId = c.id"
        >
          {{ shortName(c.service) }}
          <span v-if="clientStatus(c, setup).dot" class="w-2 h-2 rounded-full" :class="clientStatus(c, setup).dot" />
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs">
        <span class="text-2xs text-gray-400">{{ client.version }}</span>
        <span class="grow" :class="clientStatus(client, setup).text">{{ clientStatus(client, setup).label }}</span>
        <ActionButton v-if="setup.clients.length > 1" :label="t('builders.useForAll')" @click="useForAll" />
      </div>
      <p v-for="note in notes" :key="note" class="text-xs text-amber-300">{{ t(`builders.note.${note}`) }}</p>

      <div class="flex border-b border-[#4b8585]">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-4 py-1.5 text-xs font-semibold uppercase border-b-2 -mb-px"
          :class="activeTab === tab.id ? 'border-teal-400 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- takes the space left: the relay list or the tab's content scrolls, not the dialog -->
      <div class="flex-1 min-h-0 flex flex-col">
        <BuilderRelays
          v-if="activeTab === 'relays'"
          v-model="editing"
          :network="setup.network"
          :mev-boost-relays="setup.mevBoostRelays"
          :nimbus="client.service === 'NimbusValidatorService'"
          :caps-trusted="capsTrustedPayments(client.service, client.version)"
        />
        <BuilderBids v-else-if="activeTab === 'bids'" v-model="editing" class="flex-1 min-h-0 overflow-y-auto pr-1" />
        <BuilderCalculator
          v-else-if="activeTab === 'calc'"
          class="flex-1 min-h-0 overflow-y-auto pr-1"
          :settings="editing"
          :clients="[client]"
          :amounts="amounts"
        />
        <div v-else class="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-3">
          <BuilderExpert v-model="editing" />
          <div class="flex flex-col gap-1">
            <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.gets") }}</span>
            <pre class="rounded-lg bg-[#0D0D12] border border-[#ffffff16] px-3 py-2 text-2xs whitespace-pre-wrap break-all select-text">{{
              preview
            }}</pre>
          </div>
        </div>
      </div>

      <p v-if="problems.length" class="text-xs text-red-400">{{ problems.join(", ") }}</p>
    </template>

    <template #footer>
      <ActionButton :label="t('builders.cancel')" @click="requestClose" />
      <ActionButton :label="t('builders.save')" primary :disabled="!canSave" @click="requestSave" />
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
      :class="LINE_CLASSES[line.level] ?? 'border-[#4b8585] bg-[#224141]'"
    >
      {{ line.text }}
    </div>
    <template #footer>
      <template v-if="reminder.kind === 'restart'">
        <ActionButton :label="t('builders.cancel')" @click="reminder = null" />
        <ActionButton :label="t('builders.reminder.withoutRestart')" @click="commit(false)" />
        <ActionButton :label="t('builders.reminder.withRestart')" primary @click="commit(true)" />
      </template>
      <template v-else-if="reminder.kind === 'close'">
        <ActionButton :label="t('builders.reminder.discard')" @click="discard" />
        <ActionButton :label="t('builders.reminder.keepEditing')" @click="reminder = null" />
      </template>
      <ActionButton
        v-if="reminder.kind !== 'restart' && reminder.kind !== 'close'"
        :label="reminder.canApply ? t('builders.reminder.review') : t('builders.reminder.ok')"
        @click="reminder = null"
      />
      <ActionButton
        v-if="reminder.canApply && reminder.kind !== 'restart'"
        :label="t('builders.save')"
        primary
        :disabled="!canSave"
        @click="requestSave"
      />
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import YAML from "yaml";
import ValidatorModal from "@/components/UI/validators-page/components/ValidatorModal.vue";
import ActionButton from "@/components/UI/validators-page/components/ActionButton.vue";
import BuilderRelays from "./BuilderRelays.vue";
import BuilderBids from "./BuilderBids.vue";
import BuilderCalculator from "./BuilderCalculator.vue";
import BuilderExpert from "./BuilderExpert.vue";
import { clientStatus, shortName } from "./clientInfo";
import { useBuilders } from "@/store/builders";
import { useSetups } from "@/store/setups";
import { builderConfiguration, capsTrustedPayments, validateBuilderSettings } from "@/share/builders";
import i18n from "@/includes/i18n";

const emit = defineEmits(["close"]);
const LINE_CLASSES = { red: "border-red-500 bg-red-900/20 text-red-300", amber: "border-amber-500 bg-amber-900/20 text-amber-200" };
const t = i18n.global.t;
const store = useBuilders();
const setupsStore = useSetups();

// the dialog belongs to the setup that is open
const setupId = computed(() => setupsStore.selectedSetup?.setupId ?? null);
watch(setupId, (id) => !id && emit("close"));
const setup = computed(() => store.setups.find((s) => s.setupId === setupId.value));
const draft = ref(null);
const missing = ref([]);
const clientId = ref(null);
const activeTab = ref("relays");
// the calculator's example bid, kept while the dialog is open
const amounts = reactive({ local: "0.05", paid: "0.054", promised: "0" });

// the settings as saved (or, before the first save, as first shown), to tell unapplied edits
const baseline = ref("");
const startWith = (fromSetup) => {
  const start = store.draftFor(setup.value, fromSetup);
  draft.value = start.builders;
  missing.value = start.missing;
  // a takeover is an edit of saved settings, not a new starting point
  baseline.value = JSON.stringify(setup.value.saved ? store.draftFor(setup.value, false).builders : start.builders);
};
// a new setup or a changed set of validator clients starts a new draft
const setupKey = computed(() => (setup.value ? `${setup.value.setupId}:${setup.value.clients.map((c) => c.id).join(",")}` : null));
watch(
  setupKey,
  (key) => {
    if (!key) return;
    startWith(!setup.value.saved);
    clientId.value = setup.value.clients[0]?.id ?? null;
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

const client = computed(() => setup.value?.clients.find((c) => c.id === clientId.value));
// the settings of the selected client, which the tabs edit
const editing = computed({
  get: () => draft.value.clients[clientId.value],
  set: (value) => (draft.value.clients[clientId.value] = value),
});
const useForAll = () => {
  const settings = JSON.stringify(editing.value);
  for (const c of setup.value.clients) draft.value.clients[c.id] = JSON.parse(settings);
};

const configuration = computed(() => builderConfiguration(client.value.service, editing.value, client.value.version));
const notes = computed(() => configuration.value.notes);
const preview = computed(() => {
  const { flags, file } = configuration.value;
  if (file) return `validators/builder_definitions.yml\n${YAML.stringify(file)}`;
  return flags.length ? flags.join("\n") : t("builders.noFlags");
});

const tabs = computed(() => [
  { id: "relays", label: t("builders.tab.relays") },
  { id: "bids", label: t("builders.tab.bids") },
  { id: "calc", label: t("builders.tab.calc") },
  { id: "expert", label: t("builders.tab.expert") },
]);

const problems = computed(() => {
  if (!draft.value) return [];
  return [...new Set(Object.values(draft.value.clients).flatMap((s) => validateBuilderSettings(s)))];
});

const canSave = computed(() => !!draft.value && problems.value.length === 0);
// the running clients a save would restart: those whose flags or file would change
const restarting = computed(() => {
  const saved = setup.value.saved ? setup.value.builders.clients : {};
  const gets = (c, settings) => JSON.stringify(builderConfiguration(c.service, settings ?? {}, c.version));
  return setup.value.clients.filter(
    (c) => c.support.apply && c.running && (c.inSync === false || gets(c, draft.value.clients[c.id]) !== gets(c, saved[c.id]))
  );
});
// the save runs on in the background and reports in the task manager, so the dialog closes
const commit = (restart) => {
  store.save(setupId.value, draft.value, { restart }).catch((err) => console.error("Saving the builder settings failed:", err));
  reminder.value = null;
  emit("close");
};
const requestSave = () => {
  if (!canSave.value) return;
  if (!restarting.value.length) return commit(true);
  reminder.value = {
    kind: "restart",
    lines: [{ level: "amber", text: t("builders.reminder.restarts", { clients: names(restarting.value) }) }],
    canApply: false,
  };
};

// a second dialog that asks to apply: on opening when something is not applied, on closing with unapplied edits
const reminder = ref(null);
const names = (clients) => clients.map((c) => shortName(c.service)).join(", ");
const hasRelays = (builders) => Object.values(builders?.clients ?? {}).some((c) => c.relays?.length > 0);
const openReminder = () => {
  const current = setup.value;
  if (!current || !draft.value) return;
  const lines = [];
  let canApply = false;
  if (!current.saved && current.mevBoost) {
    canApply = true;
    const relays = [...new Set(Object.values(draft.value.clients).flatMap((c) => c.relays.map((r) => r.name)))];
    lines.push({ text: relays.length ? t("builders.reminder.taken", { relays: relays.join(", ") }) : t("builders.reminder.noneTaken") });
    if (missing.value.length)
      lines.push({ text: t("builders.migrationMissing", { relays: missing.value.join(", "), network: current.network }) });
  }
  const outOfSync = current.saved ? current.clients.filter((c) => c.support.apply && c.inSync === false) : [];
  if (outOfSync.length) {
    canApply = true;
    lines.push({ text: t("builders.reminder.outOfSync", { clients: names(outOfSync) }) });
  }
  // only worth a reminder while some client can take the settings; the fork alert covers the rest
  const settable = current.clients.some((c) => c.support.apply);
  const configured = hasRelays(current.saved ? current.builders : draft.value);
  const outdated = configured && settable ? current.clients.filter((c) => c.support.reason === "update") : [];
  if (outdated.length) lines.push({ level: "red", text: t("builders.reminder.update", { clients: names(outdated) }) });
  if (lines.length) reminder.value = { kind: canApply ? "apply" : "outdated", lines, canApply };
};
const unapplied = computed(() => {
  if (!draft.value || !setup.value) return false;
  if (JSON.stringify(draft.value) !== baseline.value) return true;
  // settings taken over from MEV-Boost are not applied until saved
  return !setup.value.saved && hasRelays(draft.value);
});
const requestClose = () => {
  // Escape reaches this dialog first
  if (reminder.value) return (reminder.value = null);
  if (unapplied.value) return (reminder.value = { kind: "close", lines: [], canApply: true });
  emit("close");
};
const discard = () => {
  reminder.value = null;
  emit("close");
};

onMounted(async () => {
  await store.load();
  openReminder();
});
</script>
