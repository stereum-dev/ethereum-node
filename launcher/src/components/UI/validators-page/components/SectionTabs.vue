<template>
  <!-- first item of each tab's toolbar, so the tabs take no height from the list -->
  <div v-if="tabs.length > 1" class="inline-flex h-7 shrink-0 rounded-full bg-[#0D0D12] border border-[#4b8585] p-0.5 gap-0.5">
    <button
      v-for="tab in tabs"
      :key="tab"
      class="h-6 px-2 rounded-full flex items-center gap-1 text-2xs font-semibold uppercase transition-colors"
      :class="validatorsStore.tab === tab ? 'bg-[#336666] text-white' : 'text-[#7fb3b3] hover:bg-[#224141]'"
      @click="validatorsStore.tab = tab"
    >
      <img :src="icons[tab]" class="w-3.5 h-3.5" alt="" />
      {{ t(`validatorsPage.tabs.${tab}`) }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useValidatorsStore } from "@/store/validators";
import { holderTabs } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const role = computed(() => validatorsStore.selectedHolder?.role);
const tabs = computed(() => holderTabs(role.value));
const icons = computed(() => ({
  keys: "/img/icon/node-page-icons/validator-key-icon.png",
  duties: "/img/icon/staking-page-icons/predicition-icon.png",
  cluster: `/img/icon/staking-page-icons/${role.value === "ssv" ? "ssv-key.png" : "obol-key.png"}`,
}));
</script>
