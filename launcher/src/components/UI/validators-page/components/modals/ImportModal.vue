<template>
  <ValidatorModal :title="t('validatorsPage.importTitle')" icon="/img/icon/staking-page-icons/validator-import.svg" wide @close="close">
    <!-- 1: files -->
    <template v-if="step === 'files'">
      <!-- the drop zone shrinks to one line once files are in, so the summary and the list stay in view -->
      <label
        class="flex items-center justify-center rounded-lg border-2 border-dashed px-4 text-xs cursor-pointer transition-colors"
        :class="[
          dragging ? 'border-teal-300 bg-[#224141]' : 'border-[#4b8585] bg-[#0D0D12] hover:border-teal-400',
          hasFiles ? 'flex-row gap-2 py-2' : 'flex-col gap-1 py-5',
        ]"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="onDrop"
      >
        <img src="/img/icon/staking-page-icons/validator-import.svg" :class="hasFiles ? 'w-5 h-5' : 'w-8 h-8'" alt="" />
        <span class="font-semibold">{{ hasFiles ? t("validatorsPage.importDropMore") : t("validatorsPage.importDrop") }}</span>
        <span v-if="!hasFiles" class="text-gray-400">{{ t("validatorsPage.importDropHint") }}</span>
        <input type="file" multiple accept=".json,.txt" class="hidden" @change="onPick" />
      </label>

      <p v-if="walletMissing" class="rounded-lg border border-[#4b8585] bg-[#224141] px-3 py-1.5 text-xs text-gray-200">
        {{ t("validatorsPage.walletMissingImport") }}
      </p>

      <div class="flex flex-col gap-1">
        <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("validatorsPage.importPassword") }}</span>
        <input
          v-model="sharedPassword"
          type="password"
          :placeholder="t('validatorsPage.importPasswordPlaceholder')"
          class="h-9 rounded-full bg-[#0D0D12] border border-[#4b8585] px-4 text-xs outline-hidden focus:border-teal-400"
        />
      </div>

      <!-- what was picked up, above the list so it never scrolls out of view -->
      <div v-if="hasFiles" class="flex flex-wrap items-center gap-2">
        <span class="px-3 py-1 rounded-full text-xs font-semibold border border-[#4b8585] bg-[#224141]">{{
          t("validatorsPage.importCount", keystores.length)
        }}</span>
        <span v-if="withoutPassword" class="px-3 py-1 rounded-full text-xs font-semibold border border-red-500 text-red-400">{{
          t("validatorsPage.importWithoutPassword", withoutPassword)
        }}</span>
        <span v-if="fileProblems.length" class="px-3 py-1 rounded-full text-xs font-semibold border border-amber-500 text-amber-300">{{
          t("validatorsPage.importSkipped", fileProblems.length)
        }}</span>
      </div>
      <div v-if="reading" class="flex items-center gap-2 rounded-full bg-[#1d2023] px-3 py-1 text-xs text-gray-300">
        <img src="/animation/loading/turning-circle.gif" class="w-4 h-4" alt="" />
        <span class="grow truncate">{{
          t("validatorsPage.slashingReading", { name: reading.name, percent: Math.floor(reading.fraction * 100) })
        }}</span>
      </div>
      <div v-if="slashing" class="flex items-center gap-2 rounded-full border border-[#4b8585] bg-[#224141] px-3 py-1 text-xs">
        <img src="/img/icon/staking-page-icons/validator-state-slashed.png" class="w-3.5 h-3.5" alt="" />
        <span class="grow truncate" :title="slashing.name">{{ t("validatorsPage.slashingFile", { name: slashing.name }) }}</span>
        <span class="shrink-0 text-2xs text-[#7fb3b3]">{{
          t("validatorsPage.slashingSummary", { validators: slashing.stats.validators, size: formatBytes(slashing.size) })
        }}</span>
        <button class="text-gray-400 hover:text-white" @click="slashing = null">✕</button>
      </div>
      <div v-if="fileProblems.length" class="max-h-16 overflow-y-auto flex flex-col">
        <p v-for="problem in fileProblems" :key="problem" class="text-2xs text-red-400">{{ problem }}</p>
      </div>

      <!-- thousands of keystores stay cheap: only the rows in view are rendered -->
      <div v-if="keystores.length" :style="{ height: `${Math.min(keystores.length * 28, 140)}px` }">
        <VirtualList :items="keystores" :item-height="28" :item-key="(ks) => ks.pubkey">
          <template #default="{ item: ks }">
            <div class="flex items-center gap-2 h-[24px] rounded-full bg-[#1d2023] px-3 text-xs">
              <img src="/img/icon/node-page-icons/validator-key-icon.png" class="w-3.5 h-3.5" alt="" />
              <span class="grow truncate" :title="ks.name">{{ shortPubkey(ks.pubkey) }}</span>
              <span class="text-2xs" :class="passwordOf(ks) ? 'text-gray-400' : 'text-red-400'">
                {{ passwordLabel(ks) }}
              </span>
              <button class="text-gray-400 hover:text-white" @click="removeKeystore(ks)">✕</button>
            </div>
          </template>
        </VirtualList>
      </div>
    </template>

    <!-- 2: check -->
    <template v-else-if="step === 'check'">
      <div v-if="!check" class="flex items-center gap-2 text-sm text-gray-300">
        <img src="/animation/loading/turning-circle.gif" class="w-6 h-6" alt="" />{{ t("validatorsPage.importChecking") }}
      </div>
      <template v-else>
        <p v-if="check.info" class="text-xs text-red-400">{{ check.info }}</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="chip in checkChips" :key="chip.label" class="px-3 py-1 rounded-full text-xs font-semibold border border-[#4b8585]">
            {{ chip.label }}: {{ chip.count }}
          </span>
        </div>
        <p v-if="!check.statesKnown" class="text-xs text-amber-300">{{ t("validatorsPage.importNoStates") }}</p>

        <div
          v-if="check.live?.length"
          class="rounded-lg border border-red-500 bg-red-900/25 px-3 py-2 text-xs text-red-200 flex flex-col gap-2"
        >
          <span class="font-bold">{{ t("validatorsPage.importLive", { count: check.live.length }) }}</span>
          <span class="max-h-20 overflow-y-auto flex flex-col text-2xs">
            <span v-for="key in check.live" :key="key" class="break-all">{{ key }}</span>
          </span>
          <label class="flex items-start gap-2 cursor-pointer">
            <input v-model="liveAccepted" type="checkbox" class="mt-0.5" />{{ t("validatorsPage.importLiveAccept") }}
          </label>
        </div>

        <div
          class="rounded-lg border px-3 py-2 text-xs flex flex-col gap-1.5"
          :class="slashingCheck?.ok === false ? 'border-red-500 bg-red-900/20' : 'border-[#4b8585] bg-[#0D0D12]'"
        >
          <div class="flex items-center gap-2 font-semibold">
            <img src="/img/icon/staking-page-icons/validator-state-slashed.png" class="w-4 h-4" alt="" />
            <span>{{ t("validatorsPage.slashingTitle") }}</span>
            <span class="grow" />
            <span v-if="slashing" class="text-2xs font-normal text-gray-400 truncate max-w-[240px]" :title="slashing.name">{{
              slashing.name
            }}</span>
          </div>
          <template v-if="slashingCheck">
            <span :class="slashingCheck.ok ? 'text-green-500' : 'text-red-400'">{{
              slashingCheck.ok
                ? t("validatorsPage.slashingOk")
                : t("validatorsPage.slashingRejected", { reasons: slashingCheck.errors.join(", ") })
            }}</span>
            <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-gray-300">
              <span class="text-gray-500">{{ t("validatorsPage.slashingCoversLabel") }}</span>
              <span :class="slashingCheck.missing.length ? 'text-amber-300' : 'text-green-500'">{{
                t("validatorsPage.slashingCovers", {
                  covered: keystores.length - slashingCheck.missing.length,
                  total: keystores.length,
                })
              }}</span>
              <span class="text-gray-500">{{ t("validatorsPage.slashingContentsLabel") }}</span>
              <span>{{ slashingContents }}</span>
              <span class="text-gray-500">{{ t("validatorsPage.slashingHighestLabel") }}</span>
              <span>{{
                t("validatorsPage.slashingHighest", { epoch: slashing.stats.maxTarget ?? "-", slot: slashing.stats.maxSlot ?? "-" })
              }}</span>
              <span class="text-gray-500">{{ t("validatorsPage.slashingSentLabel") }}</span>
              <span>{{
                formatBytes(slashing.text.length) === formatBytes(slashing.size)
                  ? t("validatorsPage.slashingMinimalSame", { size: formatBytes(slashing.text.length) })
                  : t("validatorsPage.slashingMinimal", { size: formatBytes(slashing.text.length), original: formatBytes(slashing.size) })
              }}</span>
            </div>
            <details v-if="slashingCheck.ok && slashingCheck.missing.length" class="text-gray-400">
              <summary class="cursor-pointer">{{ t("validatorsPage.slashingMissing", slashingCheck.missing.length) }}</summary>
              <span class="max-h-20 overflow-y-auto flex flex-col text-2xs">
                <span v-for="key in slashingCheck.missing" :key="key" class="break-all">{{ key }}</span>
              </span>
            </details>
          </template>
          <span v-else class="text-gray-300">{{ t("validatorsPage.slashingNone") }}</span>
          <label v-if="needsNeverSigned" class="flex items-start gap-2 cursor-pointer text-amber-200">
            <input v-model="neverSigned" type="checkbox" class="mt-0.5" />{{
              t(
                check.statesKnown ? "validatorsPage.slashingNeverSigned" : "validatorsPage.slashingNeverSignedUnknown",
                uncoveredOnChain.length
              )
            }}
          </label>
        </div>

        <p v-if="check.doppelganger" class="text-xs text-[#7fb3b3]">{{ t("validatorsPage.importDoppelganger") }}</p>
      </template>
    </template>

    <!-- 3: importing -->
    <ImportAnimation
      v-else-if="step === 'importing'"
      :label="t('validatorsPage.importing', { count: keystores.length })"
      :detail="progressText"
    />

    <!-- 4: done -->
    <ImportResult
      v-else
      :results="result.results ?? []"
      :info="result.info ?? null"
      :doppelganger="!!check?.doppelganger"
      :on-chain="check?.statesKnown ? (check.onChain ?? {}) : null"
    />

    <template #footer>
      <template v-if="step === 'files'">
        <ActionButton :label="t('validatorsPage.cancel')" @click="close" />
        <ActionButton :label="t('validatorsPage.next')" primary :disabled="!filesReady" @click="runCheck" />
      </template>
      <template v-else-if="step === 'check'">
        <ActionButton :label="t('validatorsPage.back')" @click="step = 'files'" />
        <ActionButton
          :label="t('validatorsPage.importConfirm', { count: keystores.length })"
          primary
          :disabled="!importAllowed"
          @click="runImport"
        />
      </template>
      <ActionButton v-else-if="step === 'done'" :label="t('validatorsPage.close')" primary @click="close" />
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import ValidatorModal from "../ValidatorModal.vue";
import ActionButton from "../ActionButton.vue";
import ImportResult from "./ImportResult.vue";
import ImportAnimation from "./ImportAnimation.vue";
import VirtualList from "../VirtualList.vue";
import ControlService from "@/store/ControlService";
import { useValidatorsStore } from "@/store/validators";
import { parseKeystore, checkSlashingProtection } from "@/share/keystores";
import { readSlashingProtection, readSlashingFile } from "@/share/slashingProtection";
import { shortPubkey } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const props = defineProps({ files: { type: Array, default: () => [] } });
const emit = defineEmits(["close"]);

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const holderId = validatorsStore.selectedHolderId;

const step = ref("files");
const dragging = ref(false);
// { name, pubkey, text, password: text of a matching .txt or null }
const keystores = ref([]);
const passwordFiles = ref({});
// { name, size, text: minimal form as JSON, stats } - full exports are reduced right after reading
const slashing = ref(null);
const reading = ref(null);
const fileProblems = ref([]);
const sharedPassword = ref("");

const baseName = (name) => name.replace(/\.(json|txt)$/i, "");
// an empty password file counts as none, so the shared password still applies
const passwordOf = (ks) => ks.password || passwordFiles.value[baseName(ks.name)] || sharedPassword.value || null;
const passwordLabel = (ks) => {
  if (ks.password) return t("validatorsPage.passwordFile");
  if (sharedPassword.value) return t("validatorsPage.passwordShared");
  return ks.password === "" ? t("validatorsPage.passwordFileEmpty") : t("validatorsPage.passwordMissing");
};

// keystores are a few KB; anything this large can only be a slashing protection export, read as a stream
const STREAM_FROM = 32 * 1024 * 1024;

const formatBytes = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const keepSlashing = (file, { interchange, stats }) =>
  (slashing.value = { name: file.name, size: file.size, text: JSON.stringify(interchange), stats });

const readLargeSlashing = async (file) => {
  reading.value = { name: file.name, fraction: 0 };
  try {
    keepSlashing(file, await readSlashingFile(file, (fraction) => (reading.value = { name: file.name, fraction })));
  } catch (err) {
    fileProblems.value.push(`${file.name}: ${err?.message || err}`);
  } finally {
    reading.value = null;
  }
};

// keystores, their password files and a slashing protection file can be dropped together
const addFiles = async (files) => {
  const known = new Set(keystores.value.map((k) => k.pubkey));
  for (const file of files) {
    if (file.size > STREAM_FROM) {
      await readLargeSlashing(file);
      continue;
    }
    const text = await file.text();
    if (/\.txt$/i.test(file.name)) {
      passwordFiles.value[baseName(file.name)] = text.replace(/\r?\n$/, "");
      continue;
    }
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (e) {
      /* reported below */
    }
    if (json?.metadata && Array.isArray(json?.data)) {
      try {
        keepSlashing(file, readSlashingProtection(json));
      } catch (err) {
        fileProblems.value.push(`${file.name}: ${err?.message || err}`);
      }
      continue;
    }
    const parsed = parseKeystore(text);
    if (parsed.error) fileProblems.value.push(`${file.name}: ${parsed.error}`);
    else if (!known.has(parsed.pubkey)) {
      known.add(parsed.pubkey);
      keystores.value.push({ name: file.name, pubkey: parsed.pubkey, text, password: null });
    }
  }
  keystores.value.forEach((ks) => (ks.password = passwordFiles.value[baseName(ks.name)] ?? null));
};
const removeKeystore = (ks) => (keystores.value = keystores.value.filter((k) => k !== ks));
const onDrop = (event) => {
  dragging.value = false;
  addFiles([...event.dataTransfer.files]);
};
const onPick = (event) => addFiles([...event.target.files]);

// a new Prysm has no wallet yet; the import creates it and restarts the client once
const walletMissing = computed(() => !!validatorsStore.keysByHolder[holderId]?.walletMissing);
const hasFiles = computed(() => keystores.value.length > 0 || !!slashing.value || fileProblems.value.length > 0);
const withoutPassword = computed(() => keystores.value.filter((ks) => !passwordOf(ks)).length);
const filesReady = computed(() => !reading.value && keystores.value.length > 0 && keystores.value.every((ks) => passwordOf(ks)));

// check
const check = ref(null);
const liveAccepted = ref(false);
const neverSigned = ref(false);
const slashingCheck = computed(() => {
  if (!slashing.value || !check.value) return null;
  // without the chain's genesis the file cannot be checked, and it must never be dropped silently
  if (!check.value.genesisRoot) return { ok: false, errors: [t("validatorsPage.slashingNoGenesis")], missing: [] };
  return checkSlashingProtection(slashing.value.text, {
    genesisRoot: check.value.genesisRoot,
    pubkeys: keystores.value.map((k) => k.pubkey),
  });
});
// keys on chain (or maybe, if the chain was not asked) that the slashing protection does not cover may have signed before; the user has to vouch for them
const uncoveredOnChain = computed(() => {
  const missing = new Set(slashingCheck.value?.missing ?? []);
  const covered = (k) => slashingCheck.value?.ok && !missing.has(k);
  const maybeOnChain = (k) => !check.value?.statesKnown || check.value?.onChain?.[k];
  return keystores.value.map((k) => k.pubkey).filter((k) => maybeOnChain(k) && !covered(k));
});
const slashingContents = computed(() => {
  const { validators, attestations, blocks } = slashing.value?.stats ?? {};
  return [
    t("validatorsPage.slashingValidators", validators),
    t("validatorsPage.slashingAttestations", attestations),
    t("validatorsPage.slashingBlocks", blocks),
  ].join(", ");
});
const needsNeverSigned = computed(() => uncoveredOnChain.value.length > 0);
const importAllowed = computed(
  () =>
    check.value &&
    !check.value.info &&
    slashingCheck.value?.ok !== false &&
    (!check.value.live?.length || liveAccepted.value) &&
    (!needsNeverSigned.value || neverSigned.value)
);
const checkChips = computed(() => {
  const onChain = Object.values(check.value?.onChain ?? {});
  return [
    { label: t("validatorsPage.importKeys"), count: keystores.value.length },
    { label: t("validatorsPage.importAlready"), count: check.value?.alreadyImported?.length ?? 0 },
    { label: t("validatorsPage.status.active"), count: onChain.filter((s) => String(s.status).startsWith("active")).length },
    { label: t("validatorsPage.status.unknown"), count: keystores.value.length - onChain.length },
  ].filter((chip, i) => i === 0 || (chip.count && (i < 2 || check.value?.statesKnown)));
});
const runCheck = async () => {
  step.value = "check";
  check.value = null;
  liveAccepted.value = false;
  neverSigned.value = false;
  check.value = await ControlService.prepareKeyImport(
    holderId,
    keystores.value.map((k) => k.pubkey)
  );
};

// import, with the backend's progress per request
const result = ref(null);
const progress = ref(null);
const onProgress = (_, value) => (progress.value = value);
const progressText = computed(() => {
  const p = progress.value;
  if (!p) return "";
  if (p.phase === "preparing") return t("validatorsPage.importPreparing");
  return t("validatorsPage.importProgress", p);
});
const runImport = async () => {
  if (!importAllowed.value) return;
  step.value = "importing";
  progress.value = null;
  result.value = await validatorsStore.importKeys(
    holderId,
    keystores.value.map((k) => k.text),
    keystores.value.map((k) => passwordOf(k)),
    slashingCheck.value?.ok ? slashing.value.text : null
  );
  step.value = "done";
};

const close = () => {
  if (step.value === "importing") return;
  emit("close");
};

onMounted(() => {
  ControlService.addListener("importProgress", onProgress);
  if (props.files.length) addFiles(props.files);
});
onBeforeUnmount(() => ControlService.removeListener("importProgress", onProgress));
</script>
