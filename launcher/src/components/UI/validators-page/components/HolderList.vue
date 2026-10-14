<template>
  <div class="flex flex-col gap-1.5 overflow-y-auto pr-0.5">
    <button
      v-for="holder in holders"
      :key="holder.id"
      class="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left border transition-all"
      :class="
        holder.id === validatorsStore.selectedHolderId
          ? 'bg-linear-to-br from-[#2a4a4a] to-[#1a2626] border-[#4b8585] shadow-[0_0_10px_rgba(75,133,133,0.35)]'
          : 'bg-linear-to-br from-[#1A1A20] to-[#0D0D12] border-[#ffffff16] hover:border-[#336666]'
      "
      @click="validatorsStore.selectedHolderId = holder.id"
    >
      <!-- the setup color rings the client icon, the dot shows whether the client is running -->
      <span class="relative shrink-0 rounded-full p-[3px]" :class="setupStore.getBGColor(holder.setupColor)" :title="holder.setupName">
        <img v-if="holder.icon" :src="holder.icon" class="w-9 h-9 rounded-full bg-[#0D0D12] p-0.5" alt="" />
        <span
          class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0D0D12]"
          :class="holder.state === 'running' ? 'bg-green-500' : 'bg-red-500'"
        />
      </span>
      <div class="flex flex-col min-w-0 grow">
        <span class="text-xs font-bold truncate">{{ holder.name }}</span>
        <span class="text-2xs uppercase tracking-wide text-[#7fb3b3] truncate">{{ t(`validatorsPage.role.${holder.role}`) }}</span>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <img src="/img/icon/node-page-icons/validator-key-icon.png" class="w-3.5 h-3.5" alt="" />
        <span class="text-sm font-bold">{{ holder.keyCount ?? "-" }}</span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useValidatorsStore } from "@/store/validators";
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const serviceStore = useServices();
const setupStore = useSetups();

const holders = computed(() =>
  validatorsStore.holders.map((holder) => {
    const service = serviceStore.installedServices.find((s) => s.config?.serviceID === holder.id);
    return {
      ...holder,
      name: service?.name ?? holder.service.replace(/Service$/, ""),
      icon: service?.sIcon ?? service?.icon,
      setupColor: service?.setupColor ?? "default",
      setupName: service?.setupName,
      keyCount: validatorsStore.keysByHolder[holder.id]?.keys?.length,
    };
  })
);
</script>
