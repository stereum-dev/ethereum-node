<template>
  <div class="flex flex-col gap-2">
    <p class="text-2xs text-[#7fb3b3]">{{ t("builders.clientsHint") }}</p>
    <div v-for="client in setup.clients" :key="client.id" class="flex flex-col gap-1 rounded-lg bg-[#1d2023] px-3 py-2 text-xs">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full shrink-0" :class="clientStatus(client, setup).dot ?? 'bg-transparent'" />
        <span class="w-20 font-semibold">{{ shortName(client.service) }}</span>
        <span class="grow text-2xs text-gray-400 truncate">{{ client.version }}</span>
        <div class="flex gap-1 shrink-0 whitespace-nowrap">
          <button
            v-for="own in [false, true]"
            :key="String(own)"
            class="px-2 py-0.5 rounded-full text-2xs font-semibold border"
            :class="isOwn(client.id) === own ? 'bg-[#336666] border-[#4b8585]' : 'bg-[#0D0D12] border-gray-600 hover:border-[#4b8585]'"
            @click="$emit('own', client.id, own)"
          >
            {{ own ? t("builders.ownSettings") : t("builders.useDefault") }}
          </button>
        </div>
      </div>
      <div class="flex items-center gap-3 pl-4">
        <span class="grow text-2xs" :class="clientStatus(client, setup).text">{{ clientStatus(client, setup).label }}</span>
        <button class="text-2xs font-semibold uppercase text-[#7fb3b3] hover:text-white" @click="toggleOpen(client.id)">
          {{ open.has(client.id) ? "▾" : "▸" }} {{ t("builders.gets") }}
        </button>
        <button
          v-if="isOwn(client.id)"
          class="text-2xs font-semibold uppercase text-[#7fb3b3] hover:text-white"
          @click="$emit('edit', client.id)"
        >
          {{ t("builders.editOwn") }}
        </button>
      </div>
      <p v-for="note in notes(client)" :key="note" class="pl-4 text-2xs text-amber-300">{{ t(`builders.note.${note}`) }}</p>
      <pre
        v-if="open.has(client.id)"
        class="ml-4 rounded-lg bg-[#0D0D12] border border-[#ffffff16] px-3 py-2 text-2xs whitespace-pre-wrap break-all select-text"
        >{{ preview(client) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import YAML from "yaml";
import { builderConfiguration, effectiveBuilderSettings } from "@/share/builders";
import { clientStatus, shortName } from "./clientInfo";
import i18n from "@/includes/i18n";

const props = defineProps({
  setup: { type: Object, required: true },
  draft: { type: Object, required: true },
});
defineEmits(["own", "edit"]);

const t = i18n.global.t;
const isOwn = (id) => !!props.draft.clients?.[id]?.own;
const open = ref(new Set());
const toggleOpen = (id) => {
  const next = new Set(open.value);
  if (!next.delete(id)) next.add(id);
  open.value = next;
};

const configuration = (client) => builderConfiguration(client.service, effectiveBuilderSettings(props.draft, client.id), client.version);
const notes = (client) => configuration(client).notes;
const preview = (client) => {
  const { flags, file } = configuration(client);
  if (file) return `validators/builder_definitions.yml\n${YAML.stringify(file)}`;
  return flags.length ? flags.join("\n") : t("builders.noFlags");
};
</script>
