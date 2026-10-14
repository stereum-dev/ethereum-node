<template>
  <ValidatorModal
    :title="renaming ? t('validatorsPage.renameGroupTitle') : t('validatorsPage.groupTitle')"
    icon="/img/icon/staking-page-icons/group.png"
    @close="$emit('close')"
  >
    <template v-if="!renaming">
      <KeyLabel v-if="pubkeys.length === 1" :pubkey="pubkeys[0]" />
      <div v-else class="flex items-center gap-2 rounded-lg bg-[#0D0D12] border border-[#ffffff16] px-3 py-2 text-xs">
        <img src="/img/icon/node-page-icons/validator-key-icon.png" class="w-4 h-4" alt="" />
        {{ t("validatorsPage.appliesTo", { count: pubkeys.length }, pubkeys.length) }}
      </div>
    </template>

    <input
      ref="input"
      v-model.trim="draft"
      maxlength="30"
      :placeholder="t('validatorsPage.groupPlaceholder')"
      class="h-9 rounded-full bg-[#0D0D12] border px-4 text-sm outline-hidden"
      :class="problem ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
      @keydown.enter="save"
    />
    <span class="text-xs min-h-[16px]" :class="problem ? 'text-red-400' : 'text-gray-500'">
      {{ problem ? t(`validatorsPage.groupError.${problem}`) : t("validatorsPage.groupHint") }}
    </span>

    <div v-if="!renaming && groups.length" class="flex flex-col gap-1.5">
      <span class="text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("validatorsPage.addToGroup") }}</span>
      <div class="flex flex-wrap gap-1.5 max-h-[96px] overflow-y-auto">
        <button
          v-for="group in groups"
          :key="group.id"
          class="h-7 max-w-[200px] flex items-center gap-1.5 px-3 rounded-full border text-xs"
          :class="target?.id === group.id ? 'bg-[#224141] border-teal-400' : 'bg-[#0D0D12] border-[#4b8585] hover:border-teal-300'"
          :title="group.name"
          @click="pick(group)"
        >
          <img src="/img/icon/staking-page-icons/group-circle-icon.png" class="w-4 h-4 shrink-0" alt="" />
          <span class="truncate font-semibold">{{ group.name }}</span>
          <span class="shrink-0 text-gray-400">{{ group.count }}</span>
        </button>
      </div>
    </div>

    <p v-if="!renaming && movingCount" class="text-xs text-amber-300">
      {{ t("validatorsPage.groupMoveNote", { count: movingCount }, movingCount) }}
    </p>
    <p v-if="failure" class="text-xs text-red-400 break-all">{{ t("validatorsPage.writeKeysError") }}: {{ failure }}</p>

    <template #footer>
      <ActionButton
        v-if="!renaming && groupedPubkeys.length"
        :label="t('validatorsPage.removeFromGroup')"
        :disabled="busy"
        @click="run(() => validatorsStore.ungroupKeys(groupedPubkeys))"
      />
      <ActionButton :label="t('validatorsPage.save')" primary :disabled="!canSave" @click="save" />
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import ValidatorModal from "../ValidatorModal.vue";
import ActionButton from "../ActionButton.vue";
import KeyLabel from "./KeyLabel.vue";
import { useValidatorsStore } from "@/store/validators";
import { useHolderRows } from "../../useHolderRows";
import { groupNameError, keyGroup, groupMembers } from "@/share/keyGroups";
import i18n from "@/includes/i18n";

// pubkeys to group, or groupId to rename that group
const props = defineProps({
  pubkeys: { type: Array, default: () => [] },
  groupId: { type: String, default: null },
});
const emit = defineEmits(["close"]);

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const { groups } = useHolderRows();
const renaming = computed(() => !!props.groupId);
const currentName = computed(() => validatorsStore.aliases[groupMembers(validatorsStore.aliases, props.groupId)[0]]?.groupName ?? "");

const draft = ref(renaming.value ? currentName.value : "");
const target = ref(null);
const input = ref(null);
const busy = ref(false);
const failure = ref(null);
const problem = computed(() => groupNameError(draft.value, renaming.value ? props.groupId : null, validatorsStore.aliases));

// typing a name starts a new group instead of the picked one
watch(draft, (value) => value && (target.value = null));
const pick = (group) => {
  draft.value = "";
  target.value = group;
};

const groupedPubkeys = computed(() =>
  props.pubkeys.filter((pk) => keyGroup(validatorsStore.aliases[pk], validatorsStore.selectedHolderId))
);
// keys.yaml holds one group per key, so keys in another group (on any client) move
const movingCount = computed(
  () =>
    props.pubkeys.filter((pk) => {
      const entry = validatorsStore.aliases[pk];
      return entry?.groupName && entry.groupID && entry.groupID !== target.value?.id;
    }).length
);

const canSave = computed(() => {
  if (busy.value) return false;
  if (renaming.value) return !!draft.value && !problem.value && draft.value !== currentName.value;
  return !!target.value || (!!draft.value && !problem.value);
});

// stays open with the error on a failed write, closes on success
const run = async (action) => {
  if (busy.value) return;
  busy.value = true;
  failure.value = null;
  try {
    const result = await action();
    if (result?.code === 0) emit("close");
    else failure.value = result?.info || "no answer";
  } finally {
    busy.value = false;
  }
};

const save = () => {
  if (!canSave.value) return;
  if (renaming.value) return run(() => validatorsStore.renameGroup(props.groupId, draft.value));
  const group = target.value ? { id: target.value.id, name: target.value.name } : { name: draft.value };
  return run(() => validatorsStore.groupKeys(props.pubkeys, group));
};

onMounted(async () => {
  await nextTick();
  input.value?.focus();
});
</script>
