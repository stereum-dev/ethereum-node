<template>
  <ValidatorModal :title="t('validatorsPage.ungroupTitle')" icon="/img/icon/staking-page-icons/ungroup.png" @close="$emit('close')">
    <dl class="grid grid-cols-[auto_1fr] gap-x-3 text-xs">
      <dt class="text-[#7fb3b3] py-1 border-b border-[#ffffff10]">{{ t("validatorsPage.groupId") }}</dt>
      <dd class="text-right py-1 border-b border-[#ffffff10] text-2xs break-all select-text">{{ groupId }}</dd>
      <dt class="text-[#7fb3b3] py-1 border-b border-[#ffffff10]">{{ t("validatorsPage.groupName") }}</dt>
      <dd class="text-right py-1 border-b border-[#ffffff10] font-semibold break-all">{{ name }}</dd>
      <dt class="text-[#7fb3b3] py-1 border-b border-[#ffffff10]">{{ t("validatorsPage.col.key") }}</dt>
      <dd class="text-right py-1 border-b border-[#ffffff10] font-semibold">
        {{ t("validatorsPage.groupKeys", { count: group?.count ?? 0 }, group?.count ?? 0) }}
      </dd>
      <dt class="text-[#7fb3b3] py-1 border-b border-[#ffffff10]">{{ t("validatorsPage.col.balance") }}</dt>
      <dd class="text-right py-1 border-b border-[#ffffff10] font-semibold text-amber-300">
        {{ hasStats && group ? `${formatEth(group.balance, 2)} ETH` : "n/a" }}
      </dd>
    </dl>
    <p class="text-xs text-gray-400">{{ t("validatorsPage.ungroupNote") }}</p>
    <p v-if="failure" class="text-xs text-red-400 break-all">{{ t("validatorsPage.writeKeysError") }}: {{ failure }}</p>

    <template #footer>
      <ActionButton :label="t('validatorsPage.cancel')" @click="$emit('close')" />
      <button
        class="h-7 px-4 rounded-full bg-red-700 hover:bg-red-600 border border-red-500 text-2xs font-semibold uppercase disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="busy"
        @click="ungroup"
      >
        {{ t("validatorsPage.ungroup") }}
      </button>
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, ref } from "vue";
import ValidatorModal from "../ValidatorModal.vue";
import ActionButton from "../ActionButton.vue";
import { useValidatorsStore } from "@/store/validators";
import { useHolderRows } from "../../useHolderRows";
import { groupMembers } from "@/share/keyGroups";
import { formatEth } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const props = defineProps({ groupId: { type: String, required: true } });
const emit = defineEmits(["close"]);

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const { groups, hasStats } = useHolderRows();
const group = computed(() => groups.value.find((g) => g.id === props.groupId));
const name = computed(
  () => group.value?.name ?? validatorsStore.aliases[groupMembers(validatorsStore.aliases, props.groupId)[0]]?.groupName ?? "-"
);
const busy = ref(false);
const failure = ref(null);

// only the grouping is removed, the keys stay on the client
const ungroup = async () => {
  if (busy.value) return;
  busy.value = true;
  failure.value = null;
  try {
    const result = await validatorsStore.removeGroup(props.groupId);
    if (result?.code === 0) emit("close");
    else failure.value = result?.info || "no answer";
  } finally {
    busy.value = false;
  }
};
</script>
