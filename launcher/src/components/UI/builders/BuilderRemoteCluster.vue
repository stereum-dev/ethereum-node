<template>
  <!-- only the relay list scrolls, so the values and the paste field stay in view -->
  <div class="flex-1 min-h-0 flex flex-col gap-3">
    <!-- what the validator client signs with: the stored copy, or a pasted one not saved yet -->
    <div v-if="shown" class="flex-1 min-h-0 flex flex-col gap-1">
      <div class="shrink-0 flex items-center gap-2">
        <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.remote.current") }}</span>
        <span v-if="modelValue" class="text-2xs text-amber-300">{{ t("builders.remote.notSaved") }}</span>
      </div>
      <div class="flex-1 min-h-[2.25rem] overflow-y-auto rounded-lg bg-[#151618] p-1 flex flex-col gap-1">
        <div
          v-for="(relay, i) in relays"
          :key="relay.url"
          class="shrink-0 flex items-center gap-2 rounded-full bg-[#1d2023] px-3 py-1 text-xs"
        >
          <span class="w-2 h-2 rounded-full shrink-0 bg-green-500" />
          <span class="font-semibold">{{ relay.name }}</span>
          <span
            v-if="i === 0 && firstFor && relays.length > 1"
            class="px-2 rounded-full border border-amber-500/70 text-2xs text-amber-300"
            :title="t('builders.firstForTitle', { client: firstFor })"
            >{{ firstFor }}</span
          >
          <span class="grow truncate text-right text-2xs text-gray-400">{{ relay.host }}</span>
        </div>
        <p v-if="!relays.length" class="px-3 py-1 text-2xs text-gray-400">{{ t("builders.remote.noBuilders") }}</p>
      </div>
      <div class="shrink-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 px-1 text-2xs">
        <span class="text-[#7fb3b3]">{{ t("builders.remote.feeRecipient") }}</span>
        <span class="truncate select-text">
          {{ shown.default_config.fee_recipient }}
          <span v-if="ownFeeRecipients" class="text-gray-400">{{ t("builders.remote.ownKeys", ownFeeRecipients) }}</span>
        </span>
        <span class="text-[#7fb3b3]">{{ t("builders.remote.gasLimit") }}</span>
        <span>{{ shown.default_config.gas_limit }}</span>
        <span class="text-[#7fb3b3]">{{ t("builders.remote.builderApi") }}</span>
        <span>{{ builderApi ? t("builders.remote.on") : t("builders.remote.off") }}</span>
      </div>
    </div>

    <div class="shrink-0 flex flex-col gap-1">
      <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{
        shown ? t("builders.remote.replace") : t("builders.remote.paste")
      }}</span>
      <textarea
        v-model="text"
        rows="3"
        spellcheck="false"
        :placeholder="t('builders.remote.placeholder')"
        class="w-full rounded-lg bg-[#0D0D12] border px-3 py-2 text-2xs font-mono outline-hidden resize-none"
        :class="error ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
      />
      <div class="flex items-center gap-2">
        <p class="grow text-2xs" :class="error ? 'text-red-400' : 'text-[#7fb3b3]'">{{ error || t("builders.remote.hint") }}</p>
        <ActionButton :label="t('builders.remote.use')" :disabled="!text.trim()" @click="use" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ActionButton from "@/components/UI/validators-page/components/ActionButton.vue";
import { useNodeManage } from "@/store/nodeManage";
import { builderUrl } from "@/share/builders";
import { parseRemoteProposerConfig, remoteBuilderApi } from "@/share/obolBuilders";
import { relayHost } from "./relayHost";
import i18n from "@/includes/i18n";

// a pasted copy of Charon's proposer config, null until one is pasted
const props = defineProps({
  modelValue: { type: Object, default: null },
  // the stored copy
  cluster: { type: Object, required: true },
  network: { type: String, required: true },
  // the client that takes only the first relay (Nimbus), marked on it
  firstFor: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const t = i18n.global.t;
const nodeManage = useNodeManage();
const text = ref("");
const error = ref("");

const shown = computed(() => props.modelValue ?? props.cluster.proposerConfig ?? null);
const builderApi = computed(() => remoteBuilderApi(shown.value));
const ownFeeRecipients = computed(
  () =>
    Object.values(shown.value?.proposer_config ?? {}).filter(
      (e) => e?.fee_recipient && e.fee_recipient !== shown.value.default_config.fee_recipient
    ).length
);
// the relays by their list name where Stereum knows them
const relays = computed(() =>
  (shown.value?.default_config?.builder?.builders ?? []).map((b) => {
    const url = builderUrl(b.url);
    const known = nodeManage.relaysList.find((r) => [r[props.network], r.epbs?.[props.network]].some((u) => u && builderUrl(u) === url));
    return { url, name: known?.name ?? t("builders.custom"), host: relayHost(url) };
  })
);

const use = () => {
  const { config, error: problem } = parseRemoteProposerConfig(text.value);
  error.value = problem ? t("builders.remote.invalid", { problem }) : "";
  if (!config) return;
  emit("update:modelValue", config);
  text.value = "";
};
</script>
