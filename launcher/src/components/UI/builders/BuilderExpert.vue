<template>
  <div class="flex flex-col gap-3" :class="disabled ? 'opacity-50 pointer-events-none' : ''">
    <div class="flex flex-col gap-1">
      <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.maxPayment") }}</span>
      <div class="flex items-center gap-2 w-1/2">
        <input
          v-model="settings.maxExecutionPayment"
          class="w-full h-8 rounded-full bg-[#0D0D12] border px-4 text-xs outline-hidden"
          :class="ethToGwei(settings.maxExecutionPayment) === null ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
        />
        <span class="text-2xs text-gray-400">ETH</span>
      </div>
      <p class="text-2xs text-[#7fb3b3]">{{ t("builders.maxPaymentHint") }}</p>
      <p v-if="trusted" class="text-xs text-amber-300">{{ t("builders.trustedWarning") }}</p>
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("builders.authData") }}</span>
      <p class="text-2xs text-[#7fb3b3]">{{ t("builders.authHint") }}</p>
      <div v-for="relay in settings.relays" :key="relay.url" class="flex items-center gap-2 text-xs">
        <span class="w-40 truncate text-gray-300">{{ relayHost(relay.url) }}</span>
        <input
          v-model="relay.authData"
          :placeholder="relayHost(relay.url)"
          class="grow h-7 rounded-full bg-[#0D0D12] border px-3 text-xs outline-hidden"
          :class="normalizeAuthData(relay.authData) === null ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
        />
      </div>
      <span v-if="!settings.relays.length" class="text-2xs text-gray-500">{{ t("builders.noRelays") }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ethToGwei, normalizeAuthData } from "@/share/builders";
import { relayHost } from "./relayHost";
import i18n from "@/includes/i18n";

const settings = defineModel({ type: Object, required: true });
defineProps({ disabled: { type: Boolean, default: false } });

const t = i18n.global.t;
const trusted = computed(() => {
  const gwei = ethToGwei(settings.value.maxExecutionPayment);
  return gwei !== null && gwei !== "0";
});
</script>
