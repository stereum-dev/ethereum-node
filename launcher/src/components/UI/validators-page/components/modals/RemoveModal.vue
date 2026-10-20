<template>
  <ValidatorModal
    :title="t('validatorsPage.removeTitle', pubkeys.length)"
    icon="/img/icon/staking-page-icons/option-remove.png"
    @close="close"
  >
    <template v-if="step === 'confirm'">
      <KeyLabel v-if="pubkeys.length === 1" :pubkey="pubkeys[0]" />
      <div v-else class="flex items-center gap-2 rounded-lg bg-[#0D0D12] border border-[#ffffff16] px-3 py-2 text-xs">
        <img src="/img/icon/node-page-icons/validator-key-icon.png" class="w-4 h-4" alt="" />
        {{ t("validatorsPage.removeCount", { local: localKeys.length, remote: remoteKeys.length }) }}
      </div>
      <div class="rounded-lg border border-amber-500/60 bg-amber-900/20 px-3 py-2 text-xs text-amber-200 flex flex-col gap-1">
        <span>{{ t("validatorsPage.removeWarning") }}</span>
        <span v-if="localKeys.length">{{ t("validatorsPage.removeSlashingNote") }}</span>
        <span v-if="remoteKeys.length">{{ t("validatorsPage.removeRemoteNote") }}</span>
        <span v-if="csmCount" class="text-amber-400 font-semibold">{{
          t("validatorsPage.csm.removeWarning", { count: csmCount }, csmCount)
        }}</span>
      </div>
      <TypeToConfirm
        v-if="pubkeys.length > 1"
        v-model="typed"
        keypath="validatorsPage.removeTypeCount"
        param="count"
        :token="String(pubkeys.length)"
        @enter="remove"
      />
    </template>

    <div v-else-if="step === 'removing'" class="flex items-center gap-2 text-sm text-gray-300">
      <img src="/animation/loading/turning-circle.gif" class="w-6 h-6" alt="" />{{
        t("validatorsPage.removing", { count: pubkeys.length }, pubkeys.length)
      }}
    </div>

    <template v-else>
      <p v-if="result.info" class="text-xs text-red-400">{{ result.info }}</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(count, status) in summary"
          :key="status"
          class="px-3 py-1 rounded-full text-xs font-semibold border"
          :class="status.startsWith('error') ? 'border-red-500 text-red-300' : 'border-[#4b8585] text-gray-200'"
        >
          {{ statusLabel(status) }}: {{ count }}
        </span>
      </div>
      <div v-if="result.slashingProtection" class="rounded-lg border border-[#4b8585] bg-[#0D0D12] px-3 py-2 text-xs flex flex-col gap-1">
        <span>{{ t("validatorsPage.slashingDownloaded") }}</span>
        <span v-if="result.savedTo" class="text-gray-400 break-all">{{
          t("validatorsPage.slashingSavedTo", { path: result.savedTo })
        }}</span>
      </div>
    </template>

    <template #footer>
      <template v-if="step === 'confirm'">
        <ActionButton :label="t('validatorsPage.cancel')" @click="close" />
        <button
          class="h-7 px-4 rounded-full bg-red-700 hover:bg-red-600 border border-red-500 text-2xs font-semibold uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!confirmed"
          @click="remove"
        >
          {{ t("validatorsPage.removeConfirm", { count: pubkeys.length }) }}
        </button>
      </template>
      <template v-else-if="step === 'done'">
        <ActionButton v-if="result.slashingProtection" :label="t('validatorsPage.slashingDownload')" @click="downloadSlashing" />
        <ActionButton :label="t('validatorsPage.close')" primary @click="close" />
      </template>
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, ref } from "vue";
import { saveAs } from "file-saver";
import ValidatorModal from "../ValidatorModal.vue";
import ActionButton from "../ActionButton.vue";
import KeyLabel from "./KeyLabel.vue";
import TypeToConfirm from "./TypeToConfirm.vue";
import { useValidatorsStore } from "@/store/validators";
import i18n from "@/includes/i18n";

const props = defineProps({ pubkeys: { type: Array, required: true } });
const emit = defineEmits(["close"]);

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const holder = validatorsStore.selectedHolder;

const remoteSet = computed(
  () => new Set((validatorsStore.keysByHolder[holder?.id]?.keys ?? []).filter((k) => k.remote).map((k) => k.pubkey))
);
const csmCount = computed(() => props.pubkeys.filter((p) => p in validatorsStore.csm.keys).length);
const localKeys = computed(() => props.pubkeys.filter((p) => !remoteSet.value.has(p)));
const remoteKeys = computed(() => props.pubkeys.filter((p) => remoteSet.value.has(p)));

const step = ref("confirm");
const typed = ref("");
const result = ref(null);
// more than one key needs the count typed in, so a stray click cannot remove a whole client
const confirmed = computed(() => props.pubkeys.length === 1 || typed.value === String(props.pubkeys.length));

const summary = computed(() => {
  const counts = {};
  for (const status of Object.values(result.value?.results ?? {})) {
    const key = String(status).startsWith("error") ? "error" : status;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
});
const statusLabel = (status) => t(`validatorsPage.removeStatus.${status}`, status);

const downloadSlashing = () => {
  const name = `slashing-protection-${holder?.service?.replace(/Service$/, "").toLowerCase()}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
  saveAs(new Blob([result.value.slashingProtection], { type: "application/json" }), name);
};

const remove = async () => {
  if (!confirmed.value || step.value !== "confirm") return;
  step.value = "removing";
  result.value = await validatorsStore.removeKeys(holder.id, localKeys.value, remoteKeys.value);
  step.value = "done";
  // the file is what makes running the keys elsewhere safe, so it is saved right away
  if (result.value.slashingProtection) downloadSlashing();
};

// closing during the removal would hide its result, so it waits until the answer is there
const close = () => {
  if (step.value === "removing") return;
  emit("close");
};
</script>
