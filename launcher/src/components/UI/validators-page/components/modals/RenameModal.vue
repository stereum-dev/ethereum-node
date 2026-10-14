<template>
  <ValidatorModal :title="t('validatorsPage.renameTitle')" icon="/img/icon/staking-page-icons/rename.png" @close="$emit('close')">
    <KeyLabel :pubkey="pubkey" />
    <input
      ref="input"
      v-model.trim="draft"
      maxlength="30"
      :placeholder="t('validatorsPage.aliasPlaceholder')"
      class="h-9 rounded-full bg-[#0D0D12] border px-4 text-sm outline-hidden"
      :class="problem ? 'border-red-500' : 'border-[#4b8585] focus:border-teal-400'"
      @keydown.enter="draft !== (current ?? '') && save()"
    />
    <span class="text-xs min-h-[16px]" :class="problem ? 'text-red-400' : 'text-gray-500'">
      {{ problem ? t(`validatorsPage.aliasError.${problem}`) : t("validatorsPage.aliasHint") }}
    </span>
    <p v-if="failure" class="text-xs text-red-400 break-all">{{ t("validatorsPage.writeKeysError") }}: {{ failure }}</p>
    <template #footer>
      <ActionButton v-if="current" :label="t('validatorsPage.removeAlias')" :disabled="busy" @click="save('')" />
      <ActionButton :label="t('validatorsPage.save')" primary :disabled="!!problem || busy || draft === (current ?? '')" @click="save()" />
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import ValidatorModal from "../ValidatorModal.vue";
import ActionButton from "../ActionButton.vue";
import KeyLabel from "./KeyLabel.vue";
import { useValidatorsStore } from "@/store/validators";
import { aliasError } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const props = defineProps({ pubkey: { type: String, required: true } });
const emit = defineEmits(["close"]);

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const current = computed(() => validatorsStore.aliases[props.pubkey]?.keyName);
const draft = ref(current.value ?? "");
const input = ref(null);
const busy = ref(false);
const failure = ref(null);
const problem = computed(() => aliasError(draft.value, props.pubkey, validatorsStore.aliases));

const save = async (name = draft.value) => {
  if (busy.value || (name && problem.value)) return;
  busy.value = true;
  failure.value = null;
  try {
    const result = await validatorsStore.renameKey(props.pubkey, name);
    // stays open on a failed write, so the alias is not lost
    if (result?.code === 0) emit("close");
    else failure.value = result?.info || "no answer";
  } finally {
    busy.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  input.value?.focus();
});
</script>
