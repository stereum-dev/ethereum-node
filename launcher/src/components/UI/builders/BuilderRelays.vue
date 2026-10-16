<template>
  <div class="flex flex-col gap-3" :class="disabled ? 'opacity-50 pointer-events-none' : ''">
    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-between">
        <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.relays") }}</span>
        <span class="text-2xs text-gray-400">{{ t("builders.readyOn", { network }) }}</span>
      </div>
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
        <span class="w-2 h-2 rounded-full shrink-0" :class="relay.entry ? 'bg-green-500' : 'bg-gray-500'" />
        <span class="font-semibold">{{ relay.name }}</span>
        <span v-if="relay.inMevBoost" class="px-2 rounded-full border border-[#4b8585] text-2xs text-[#7fb3b3]">MEV-Boost</span>
        <span class="grow truncate text-right text-2xs" :class="relay.entry ? 'text-gray-400' : 'text-gray-500'">
          {{ relay.entry ? host(relay.entry.url) : t("builders.notYet", { network }) }}
        </span>
      </label>
      <div v-for="relay in custom" :key="relay.url" class="flex items-center gap-2 rounded-full bg-[#1d2023] px-3 py-1 text-xs">
        <span class="w-2 h-2 rounded-full shrink-0 bg-[#7fb3b3]" />
        <span class="font-semibold">{{ t("builders.custom") }}</span>
        <span class="grow truncate text-right text-2xs text-gray-400 select-text">{{ relay.url }}</span>
        <button class="text-gray-400 hover:text-red-400" :title="t('builders.removeRelay')" @click="remove(relay)">✕</button>
      </div>
      <div class="flex items-center gap-2">
        <input
          v-model="customUrl"
          :placeholder="t('builders.customPlaceholder')"
          class="grow h-8 rounded-full bg-[#0D0D12] border px-4 text-xs outline-hidden"
          :class="customUrl && !customValid ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
          @keydown.enter="addCustom"
        />
        <ActionButton :label="t('builders.add')" :disabled="!customValid" @click="addCustom" />
      </div>
      <p v-if="!settings.relays.length" class="text-2xs text-[#7fb3b3]">{{ t("builders.noRelaysHint") }}</p>
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
import { computed, ref } from "vue";
import ActionButton from "@/components/UI/validators-page/components/ActionButton.vue";
import { useNodeManage } from "@/store/nodeManage";
import { epbsRelay } from "@/store/builders";
import { builderUrl } from "@/share/builders";
import { relayHost } from "./relayHost";
import i18n from "@/includes/i18n";

const settings = defineModel({ type: Object, required: true });
const props = defineProps({
  network: { type: String, required: true },
  // the relays the setup's MEV-Boost uses now
  mevBoostRelays: { type: Array, default: () => [] },
  // a Nimbus client uses these settings and takes one relay
  nimbus: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const t = i18n.global.t;
const nodeManage = useNodeManage();
const host = relayHost;

// relays of the list that run on this network, with their ePBS entry where they serve it
const listed = computed(() => {
  const inMevBoost = new Set(props.mevBoostRelays.map((url) => builderUrl(url)));
  return nodeManage.relaysList
    .filter((r) => r[props.network] || r.epbs?.[props.network])
    .map((r) => ({ name: r.name, entry: epbsRelay(r, props.network), inMevBoost: inMevBoost.has(builderUrl(r[props.network])) }))
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
