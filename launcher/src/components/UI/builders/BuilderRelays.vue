<template>
  <div class="flex-1 min-h-0 flex flex-col gap-3" :class="disabled ? 'opacity-50 pointer-events-none' : ''">
    <div class="flex-1 min-h-0 flex flex-col gap-1">
      <div class="flex items-center justify-between">
        <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.relays") }}</span>
        <span class="text-2xs text-gray-400">{{ t("builders.readyOn", { network }) }}</span>
      </div>
      <!-- only the list scrolls, so the notes and the custom field stay in view -->
      <!-- at least three rows; when the dialog is too short for that, the dialog scrolls instead -->
      <div class="flex-1 min-h-[6.5rem] flex flex-col gap-1 overflow-y-auto rounded-lg bg-[#151618] p-1">
        <label
          v-for="relay in listed"
          :key="relay.name"
          class="flex items-center gap-2 rounded-full bg-[#1d2023] border px-3 py-1 text-xs"
          :class="relay.entry ? 'border-transparent hover:border-[#4b8585] cursor-pointer' : 'border-transparent opacity-60'"
        >
          <input
            type="checkbox"
            class="accent-[#336666]"
            :disabled="!relay.entry"
            :checked="isChosen(relay.entry)"
            @change="toggle(relay.entry)"
          />
          <span class="w-2 h-2 rounded-full shrink-0" :class="dotOf(relay)" />
          <span class="font-semibold">{{ relay.name }}</span>
          <span v-if="relay.inMevBoost" class="px-2 rounded-full border border-[#4b8585] text-2xs text-[#7fb3b3]">MEV-Boost</span>
          <span class="grow truncate text-right text-2xs" :class="textOf(relay)" :title="probeTitle(relay.url)">
            {{ labelOf(relay) }}
          </span>
        </label>
        <div v-for="relay in custom" :key="relay.url" class="flex items-center gap-2 rounded-full bg-[#1d2023] px-3 py-1 text-xs">
          <span class="w-2 h-2 rounded-full shrink-0" :class="customDot(relay.url)" :title="probeTitle(relay.url)" />
          <span class="font-semibold">{{ t("builders.custom") }}</span>
          <span v-if="customNote(relay.url)" class="text-2xs text-amber-400">{{ customNote(relay.url) }}</span>
          <span class="grow truncate text-right text-2xs text-gray-400 select-text">{{ relay.url }}</span>
          <button class="text-gray-400 hover:text-red-400" :title="t('builders.removeRelay')" @click="remove(relay)">✕</button>
        </div>
      </div>
      <p v-if="!settings.relays.length" class="text-2xs text-[#7fb3b3]">{{ t("builders.noRelaysHint") }}</p>
      <p v-else-if="capsTrusted && ethToGwei(settings.maxExecutionPayment) === '0'" class="text-2xs leading-tight text-amber-400">
        {{ t("builders.trustedZeroNote") }}
      </p>
      <div class="flex items-center gap-2">
        <input
          v-model="customUrl"
          :placeholder="t('builders.customPlaceholder')"
          class="grow h-7 rounded-full bg-[#0D0D12] border px-4 text-xs outline-hidden"
          :class="customUrl && !customValid ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
          @keydown.enter="addCustom"
        />
        <ActionButton :label="t('builders.add')" :disabled="!customValid" @click="addCustom" />
      </div>
    </div>

    <div v-if="nimbus && settings.relays.length > 1" class="flex flex-col gap-1">
      <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.nimbusRelay") }}</span>
      <select v-model="settings.nimbusRelay" class="h-8 rounded-full bg-[#0D0D12] border border-[#4b8585] px-3 text-xs outline-hidden">
        <option value="">{{ host(settings.relays[0].url) }}</option>
        <option v-for="relay in settings.relays.slice(1)" :key="relay.url" :value="relay.url">{{ host(relay.url) }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import ActionButton from "@/components/UI/validators-page/components/ActionButton.vue";
import { useNodeManage } from "@/store/nodeManage";
import { epbsRelay, useBuilders } from "@/store/builders";
import { builderUrl, ethToGwei } from "@/share/builders";
import { relayHost } from "./relayHost";
import i18n from "@/includes/i18n";

const settings = defineModel({ type: Object, required: true });
const props = defineProps({
  network: { type: String, required: true },
  // the relays the setup's MEV-Boost uses now
  mevBoostRelays: { type: Array, default: () => [] },
  // a Nimbus client uses these settings and takes one relay
  nimbus: { type: Boolean, default: false },
  // the client caps promised payments by the max trusted payment, so 0 ignores them
  capsTrusted: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
});

const t = i18n.global.t;
const nodeManage = useNodeManage();
const buildersStore = useBuilders();
const host = relayHost;

// relays of the list that run on this network, with their ePBS entry where they serve it
const listed = computed(() => {
  const inMevBoost = new Set(props.mevBoostRelays.map((url) => builderUrl(url)));
  return nodeManage.relaysList
    .filter((r) => r[props.network] || r.epbs?.[props.network])
    .map((r) => {
      const entry = epbsRelay(r, props.network, buildersStore.probes);
      // the address it is checked at: its ePBS one, else the one MEV-Boost uses
      const url = entry ? builderUrl(entry.url) : builderUrl(r[props.network]);
      return { name: r.name, entry, url, inMevBoost: inMevBoost.has(builderUrl(r[props.network])) };
    })
    .sort((a, b) => (b.entry ? 1 : 0) - (a.entry ? 1 : 0));
});
const listedUrls = computed(() => new Set(listed.value.filter((r) => r.entry).map((r) => r.entry.url)));
const custom = computed(() => settings.value.relays.filter((r) => !listedUrls.value.has(r.url)));
const isChosen = (entry) => !!entry && settings.value.relays.some((r) => r.url === entry.url);
const toggle = (entry) => {
  if (!entry) return;
  settings.value.relays = isChosen(entry)
    ? settings.value.relays.filter((r) => r.url !== entry.url)
    : [...settings.value.relays, { ...entry }];
};
// what the server found when it asked each relay and custom builder for an ePBS bid
watch(
  () => [...listed.value.map((r) => r.url), ...custom.value.map((r) => r.url)].join(" "),
  (urls) => buildersStore.probe(urls.split(" ")),
  { immediate: true }
);
const probeOf = (url) => buildersStore.probes[url]?.result ?? null;
const probeTitle = (url) => {
  const probe = buildersStore.probes[url];
  return probe && probe.result !== "checking" ? t(`builders.probe.title.${probe.result}`, { status: probe.status || "-" }) : "";
};
const dotOf = (relay) => {
  const probe = probeOf(relay.url);
  if (relay.entry) return probe === "no" || probe === "unreachable" ? "bg-amber-400" : "bg-green-500";
  return "bg-gray-500";
};
const textOf = (relay) => {
  const probe = probeOf(relay.url);
  if (relay.entry) return probe === "no" || probe === "unreachable" ? "text-amber-400" : "text-gray-400";
  return "text-gray-500";
};
const labelOf = (relay) => {
  const probe = probeOf(relay.url);
  if (relay.entry) {
    if (probe === "no") return t("builders.probe.noRoute");
    if (probe === "unreachable") return t("builders.probe.unreachable");
    return host(relay.entry.url);
  }
  return probe === "checking" ? t("builders.probe.checking") : t("builders.notYet", { network: props.network });
};
const customDot = (url) => {
  const probe = probeOf(url);
  if (probe === "ready") return "bg-green-500";
  if (probe === "no" || probe === "unreachable") return "bg-amber-400";
  return "bg-[#7fb3b3]";
};
const customNote = (url) => {
  const probe = probeOf(url);
  if (probe === "no") return t("builders.probe.noRoute");
  if (probe === "unreachable") return t("builders.probe.unreachable");
  return "";
};
const remove = (relay) => (settings.value.relays = settings.value.relays.filter((r) => r.url !== relay.url));

const customUrl = ref("");
const customValid = computed(() => {
  const url = builderUrl(customUrl.value);
  return !!url && !settings.value.relays.some((r) => r.url === url);
});
const addCustom = () => {
  if (!customValid.value) return;
  const url = builderUrl(customUrl.value);
  settings.value.relays = [...settings.value.relays, { name: host(url), url, authData: "" }];
  customUrl.value = "";
};
</script>
