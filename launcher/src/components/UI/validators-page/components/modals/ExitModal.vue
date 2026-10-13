<template>
  <ValidatorModal :title="t('validatorsPage.exitTitle')" icon="/img/icon/staking-page-icons/option-withdraw.png" wide @close="close">
    <div v-if="step === 'checking'" class="flex items-center gap-2 text-sm text-gray-300">
      <img src="/animation/loading/turning-circle.gif" class="w-6 h-6" alt="" />{{ t("validatorsPage.exitChecking") }}
    </div>

    <template v-else-if="step === 'confirm'">
      <p v-if="prep.code" class="text-xs text-red-400">{{ errorText(prep) }}</p>
      <template v-else>
        <KeyLabel v-if="pubkeys.length === 1" :pubkey="pubkeys[0]" />
        <div v-else class="flex items-center gap-2 rounded-lg bg-[#0D0D12] border border-[#ffffff16] px-3 py-2 text-xs">
          <img src="/img/icon/node-page-icons/validator-key-icon.png" class="w-4 h-4" alt="" />
          <span class="grow">{{ t("validatorsPage.exitCount", { eligible: prep.eligible.length, total: pubkeys.length }) }}</span>
          <span v-if="wholeClient" class="text-[#7fb3b3] font-semibold">{{
            t("validatorsPage.exitWholeClient", { count: pubkeys.length, client: clientName })
          }}</span>
        </div>

        <div v-if="prep.beacon?.blocker" class="rounded-lg border border-red-500 bg-red-900/25 px-3 py-2 text-xs text-red-200">
          {{ t(`validatorsPage.exitBeacon.${prep.beacon.blocker}`) }}
        </div>

        <div v-if="blockedChips.length" class="flex flex-wrap gap-2">
          <span
            v-for="chip in blockedChips"
            :key="chip.reason"
            class="px-3 py-1 rounded-full text-xs font-semibold border border-gray-600 text-gray-300"
          >
            {{ t(`validatorsPage.exitBlocked.${chip.reason}`) }}: {{ chip.count }}
          </span>
        </div>
        <p v-if="tooYoung" class="text-xs text-gray-400">
          {{ t("validatorsPage.exitTooYoung", { period: prep.shardCommitteePeriod, epoch: tooYoung.epoch, days: tooYoung.days }) }}
        </p>

        <div class="rounded-lg border border-amber-500/60 bg-amber-900/20 px-3 py-2 text-xs text-amber-200 flex flex-col gap-1">
          <span>{{ t("validatorsPage.exitWarning") }}</span>
          <span v-if="prep.blsCredentials.length">{{ t("validatorsPage.exitBlsNote", { count: prep.blsCredentials.length }) }}</span>
          <template v-if="prep.role === 'share'">
            <span>{{ t("validatorsPage.exitShareNote", { client: dvtClientName }) }}</span>
            <span>{{ t("validatorsPage.exitShareEpoch", { epoch: prep.signEpoch }) }}</span>
          </template>
        </div>

        <label class="flex items-start gap-2 text-xs cursor-pointer">
          <input v-model="accepted" type="checkbox" class="mt-0.5" />{{ t("validatorsPage.exitAccept") }}
        </label>
        <label v-if="prep.eligible.length" class="flex flex-col gap-1 text-xs">
          {{ t("validatorsPage.exitTypeToConfirm", { token }) }}
          <input
            v-model.trim="typed"
            class="h-9 w-40 rounded-full bg-[#0D0D12] border border-[#4b8585] px-4 text-sm outline-hidden focus:border-red-400"
            @keydown.enter="exit"
          />
        </label>
      </template>
    </template>

    <div v-else-if="step === 'exiting' || step === 'exporting'" class="flex items-center gap-2 text-sm text-gray-300">
      <img src="/animation/loading/turning-circle.gif" class="w-6 h-6" alt="" />{{
        step === "exiting"
          ? t("validatorsPage.exiting", { count: prep.eligible.length })
          : t("validatorsPage.exitExporting", { count: prep.exportable.length })
      }}
    </div>

    <template v-else>
      <p v-if="result.info" class="text-xs text-red-400">{{ errorText(result) }}</p>
      <p v-if="mode === 'export' && messages?.length" class="text-xs text-gray-200">
        {{ t("validatorsPage.exitExported", messages.length) }}
      </p>
      <div v-if="mode === 'exit'" class="flex flex-wrap gap-2">
        <span
          v-for="(count, status) in statusCounts"
          :key="status"
          class="px-3 py-1 rounded-full text-xs font-semibold border"
          :class="STATUS_CHIP[status]"
        >
          {{ t(`validatorsPage.exitStatus.${status}`) }}: {{ count }}
        </span>
      </div>
      <div v-if="resultRows.length" class="h-[170px]">
        <VirtualList :items="resultRows" :item-height="28" :item-key="(row) => row.pubkey">
          <template #default="{ item }">
            <div class="flex items-center gap-2 h-[24px] px-3 rounded-full bg-[#1d2023] text-xs">
              <span class="w-36 shrink-0 truncate font-semibold" :title="item.pubkey">{{
                aliasOf(item.pubkey) || shortPubkey(item.pubkey)
              }}</span>
              <span class="shrink-0 px-2 rounded-full text-2xs border" :class="STATUS_CHIP[item.status]">{{
                t(`validatorsPage.exitStatus.${item.status}`)
              }}</span>
              <span class="min-w-0 truncate text-gray-400" :title="item.message">{{ item.message }}</span>
            </div>
          </template>
        </VirtualList>
      </div>
      <p v-if="mode === 'exit' && !result.code" class="text-xs text-gray-400">{{ t("validatorsPage.exitSentNote") }}</p>
      <div
        v-if="mode === 'export' && messages?.length"
        class="rounded-lg border border-amber-500/60 bg-amber-900/20 px-3 py-2 text-xs text-amber-200"
      >
        {{ t("validatorsPage.exitExportNote") }}
      </div>
    </template>

    <template #footer>
      <template v-if="step === 'confirm'">
        <ActionButton :label="prep.code ? t('validatorsPage.close') : t('validatorsPage.cancel')" @click="close" />
        <template v-if="!prep.code">
          <ActionButton
            v-if="prep.role === 'validator'"
            :label="t('validatorsPage.exitExport')"
            :disabled="!accepted || !prep.exportable.length"
            @click="exportMessages"
          />
          <button
            class="h-7 px-4 rounded-full bg-red-700 hover:bg-red-600 border border-red-500 text-2xs font-semibold uppercase disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="!canExit"
            @click="exit"
          >
            {{ t("validatorsPage.exitConfirm", { count: prep.eligible.length }) }}
          </button>
        </template>
      </template>
      <template v-else-if="step === 'done'">
        <ActionButton v-if="mode === 'export' && messages?.length" :label="t('validatorsPage.downloadAgain')" @click="download" />
        <ActionButton :label="t('validatorsPage.close')" primary @click="close" />
      </template>
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, markRaw, onMounted, ref } from "vue";
import { saveAs } from "file-saver";
import ValidatorModal from "../ValidatorModal.vue";
import ActionButton from "../ActionButton.vue";
import VirtualList from "../VirtualList.vue";
import KeyLabel from "./KeyLabel.vue";
import { useValidatorsStore } from "@/store/validators";
import { useServices } from "@/store/services";
import { shortPubkey } from "@/share/validatorStatus";
import { EXIT_BLOCKERS, exitConfirmToken, exitMessagesFile, exitFileName } from "@/share/exits";
import i18n from "@/includes/i18n";

const props = defineProps({ pubkeys: { type: Array, required: true } });
const emit = defineEmits(["close"]);

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const serviceStore = useServices();
const holder = validatorsStore.selectedHolder;

const STATUS_CHIP = {
  submitted: "border-green-500 text-green-500",
  rejected: "border-red-500 text-red-300",
  signFailed: "border-red-500 text-red-300",
  skipped: "border-gray-600 text-gray-400",
};
// failures first, so they are seen without scrolling
const STATUS_ORDER = ["rejected", "signFailed", "skipped", "submitted"];

const step = ref("checking");
const mode = ref(null);
const prep = ref(null);
const result = ref(null);
// signed exits only live here and are dropped with the modal
const messages = ref(null);
const accepted = ref(false);
const typed = ref("");

const serviceName = (id) =>
  serviceStore.installedServices.find((s) => s.config?.serviceID === id)?.name ??
  validatorsStore.holders.find((h) => h.id === id)?.service?.replace(/Service$/, "");
const clientName = computed(() => serviceName(holder?.id) ?? "");
const dvtClientName = computed(() => serviceName(holder?.dvtVia) ?? "Charon");
const aliasOf = (pubkey) => validatorsStore.aliases[pubkey]?.keyName;

// known failures are translated, the raw info is only the fallback for unexpected ones
const errorText = (answer) => {
  if (answer.beaconBlocker) return t(`validatorsPage.exitBeacon.${answer.beaconBlocker}`);
  return answer.reason ? t(`validatorsPage.exitError.${answer.reason}`) : answer.info;
};
const failureText = (entry) => (entry.error ? t(`validatorsPage.exitError.${entry.error}`) : (entry.message ?? ""));

const wholeClient = computed(() => {
  const keys = validatorsStore.keysByHolder[holder?.id]?.keys ?? [];
  const requested = new Set(props.pubkeys);
  return props.pubkeys.length > 1 && keys.length > 0 && keys.every((k) => requested.has(k.pubkey));
});

const indexByPubkey = computed(() => Object.fromEntries(Object.entries(prep.value?.keys ?? {}).map(([p, k]) => [p, k.index])));
const token = computed(() => exitConfirmToken(prep.value?.eligible ?? [], indexByPubkey.value));
const canExit = computed(
  () => accepted.value && typed.value === token.value && prep.value?.eligible.length > 0 && !prep.value.beacon?.blocker
);

const blockedChips = computed(() => {
  const counts = {};
  for (const key of Object.values(prep.value?.keys ?? {})) {
    if (key.blocker) counts[key.blocker.reason] = (counts[key.blocker.reason] ?? 0) + 1;
  }
  return EXIT_BLOCKERS.filter((reason) => counts[reason]).map((reason) => ({ reason, count: counts[reason] }));
});

const tooYoung = computed(() => {
  const epochs = Object.values(prep.value?.keys ?? {})
    .filter((k) => k.blocker?.reason === "tooYoung")
    .map((k) => k.blocker.eligibleEpoch);
  if (!epochs.length) return null;
  const epoch = Math.min(...epochs);
  const days = ((epoch - prep.value.currentEpoch) * prep.value.secondsPerEpoch) / 86400;
  return { epoch, days: Math.max(0, days).toFixed(1) };
});

const statusCounts = computed(() => {
  const counts = {};
  for (const entry of Object.values(result.value?.results ?? {})) counts[entry.status] = (counts[entry.status] ?? 0) + 1;
  return Object.fromEntries(STATUS_ORDER.filter((s) => counts[s]).map((s) => [s, counts[s]]));
});

const resultRows = computed(() => {
  if (mode.value === "export") {
    return [
      ...(result.value?.failed ?? []).map((f) => ({ pubkey: f.pubkey, status: "signFailed", message: failureText(f) })),
      ...Object.entries(result.value?.skipped ?? {}).map(([pubkey, reason]) => ({
        pubkey,
        status: "skipped",
        message: t(`validatorsPage.exitBlocked.${reason}`),
      })),
    ];
  }
  return Object.entries(result.value?.results ?? {})
    .map(([pubkey, entry]) => ({
      pubkey,
      status: entry.status,
      message: entry.reason ? t(`validatorsPage.exitBlocked.${entry.reason}`) : failureText(entry),
    }))
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
});

onMounted(async () => {
  prep.value = await validatorsStore.prepareExit(holder?.id, props.pubkeys);
  step.value = "confirm";
});

const exit = async () => {
  if (!canExit.value || step.value !== "confirm") return;
  step.value = "exiting";
  mode.value = "exit";
  result.value = await validatorsStore.exitKeys(holder.id, prep.value.eligible);
  step.value = "done";
};

const download = () => {
  saveAs(new Blob([exitMessagesFile(messages.value)], { type: "application/json" }), exitFileName(holder?.service, holder?.network));
};

const exportMessages = async () => {
  if (!accepted.value || !prep.value?.exportable.length || step.value !== "confirm") return;
  step.value = "exporting";
  mode.value = "export";
  const answer = await validatorsStore.exportExitMessages(holder.id, prep.value.exportable);
  messages.value = answer.code ? null : markRaw(answer.messages);
  // the result keeps no messages, so they exist only in the raw ref above
  result.value = { code: answer.code, info: answer.info, reason: answer.reason, failed: answer.failed, skipped: answer.skipped };
  step.value = "done";
  if (messages.value?.length) download();
};

// closing while exits are sent would hide their result, so it waits until the answer is there
const close = () => {
  if (step.value === "exiting" || step.value === "exporting") return;
  messages.value = null;
  emit("close");
};
</script>
