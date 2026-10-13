<template>
  <!-- children must not shrink, or a truncated line collapses when the details are taller than the drawer -->
  <div v-if="pubkey" class="flex flex-col gap-2 h-full min-h-0 overflow-y-auto [&>*]:shrink-0">
    <div class="flex items-center gap-2 pb-2 border-b border-[#4b8585]/50">
      <span class="w-7 h-7 rounded-full bg-[#0D0D12] border border-[#4b8585] flex items-center justify-center">
        <img src="/img/icon/node-page-icons/validator-key-icon.png" class="w-4 h-4" alt="" />
      </span>
      <span class="grow text-xs font-bold uppercase tracking-wide text-gray-200">{{ t("validatorsPage.details") }}</span>
      <button
        class="w-6 h-6 rounded-full text-xs text-gray-400 hover:text-white hover:bg-[#336666]"
        @click="validatorsStore.selectedPubkey = null"
      >
        ✕
      </button>
    </div>

    <div class="text-sm font-bold truncate" :class="alias ? 'text-[#7fb3b3]' : 'text-gray-500'">
      {{ alias || t("validatorsPage.noAlias") }}
    </div>
    <div class="text-2xs break-all text-gray-300 select-text rounded-md bg-[#0D0D12] border border-[#ffffff16] p-2">{{ pubkey }}</div>

    <!-- actions open in modals, the drawer only shows details; wraps when every action applies -->
    <div class="flex flex-wrap items-center gap-1.5">
      <IconButton
        icon="/img/icon/staking-page-icons/copy.png"
        :label="copied ? t('validatorsPage.copied') : t('validatorsPage.copy')"
        @click="copyPubkey(pubkey)"
      />
      <IconButton v-if="explorer" icon="/img/icon/staking-page-icons/beaconcha.png" label="beaconcha.in" @click="openExplorer" />
      <IconButton icon="/img/icon/staking-page-icons/rename.png" :label="t('validatorsPage.rename')" @click="openModal('rename')" />
      <IconButton icon="/img/icon/staking-page-icons/group.png" :label="t('validatorsPage.group')" @click="openModal('group')" />
      <IconButton
        v-if="canSetKeySettings"
        icon="/img/icon/staking-page-icons/option-graffiti.png"
        :label="whenRunning(t('validatorsPage.graffiti'))"
        :disabled="clientStopped"
        @click="openModal('graffiti')"
      />
      <IconButton
        v-if="canSetKeySettings && csmPosition === undefined"
        icon="/img/icon/staking-page-icons/option-fee-recepient.png"
        :label="whenRunning(t('validatorsPage.feeRecipient'))"
        :disabled="clientStopped"
        @click="openModal('feerecipient')"
      />
      <IconButton
        v-if="canRemove"
        icon="/img/icon/staking-page-icons/option-remove.png"
        :label="whenRunning(t('validatorsPage.remove'))"
        :disabled="clientStopped"
        @click="openModal('remove')"
      />
      <IconButton
        v-if="canExit"
        icon="/img/icon/staking-page-icons/option-withdraw.png"
        :label="exitLabel(exitRow)"
        :disabled="exitDisabled(exitRow)"
        @click="openModal('exit')"
      />
    </div>

    <dl class="grid grid-cols-[auto_1fr] gap-x-3 text-xs">
      <template v-for="field in fields" :key="field.label">
        <dt class="text-[#7fb3b3] py-1 border-b border-[#ffffff10]">{{ field.label }}</dt>
        <dd
          class="text-right py-1 border-b border-[#ffffff10] font-semibold"
          :class="field.truncate ? 'truncate min-w-0' : 'break-all'"
          :title="field.truncate ? field.value : undefined"
        >
          {{ field.value }}
        </dd>
      </template>
    </dl>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from "vue";
import IconButton from "./IconButton.vue";
import { useValidatorsStore } from "@/store/validators";
import { useKeyActions } from "../useKeyActions";
import { formatEth, explorerUrl, statusBucket } from "@/share/validatorStatus";
import { keyGroup } from "@/share/keyGroups";
import i18n from "@/includes/i18n";

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const { copied, copyPubkey, canSetKeySettings, canRemove, canExit, exitDisabled, exitLabel, clientStopped, whenRunning } = useKeyActions();

const FAR_FUTURE = Number.MAX_SAFE_INTEGER;
const epochText = (epoch) => (Number.isFinite(epoch) && epoch < FAR_FUTURE ? String(epoch) : "-");
// 0x00 BLS, 0x01 execution address, 0x02 compounding
const credentialType = (credentials) => (credentials ? credentials.slice(0, 4) : "-");

const pubkey = computed(() => validatorsStore.selectedPubkey);
const holder = computed(() => validatorsStore.selectedHolder);
const alias = computed(() => validatorsStore.aliases[pubkey.value]?.keyName);
const state = computed(() => validatorsStore.statesByHolder[validatorsStore.selectedHolderId]?.byPubkey?.[pubkey.value]);
const explorer = computed(() => explorerUrl(holder.value?.network, pubkey.value, state.value?.index));
const exitRow = computed(() => ({ bucket: statusBucket(state.value), exitSent: !!validatorsStore.exitsSent[pubkey.value] }));
const keyEntry = computed(() => validatorsStore.keysByHolder[holder.value?.id]?.keys?.find((k) => k.pubkey === pubkey.value));
const isRemote = computed(() => keyEntry.value?.remote);
const group = computed(() => keyGroup(validatorsStore.aliases[pubkey.value], holder.value?.id));
// Lido CSM keys keep the Lido vault as fee recipient, so that action is hidden for them
const csmPosition = computed(() => validatorsStore.csm.keys[pubkey.value]);

const fields = computed(() => {
  const s = state.value;
  return [
    { label: t("validatorsPage.col.index"), value: s?.index ?? "-" },
    { label: t("validatorsPage.col.status"), value: s?.status ?? "-" },
    { label: t("validatorsPage.col.balance"), value: `${formatEth(s?.balance, 9)} ETH` },
    { label: t("validatorsPage.effectiveBalance"), value: `${formatEth(s?.effectiveBalance, 0)} ETH` },
    { label: t("validatorsPage.credentials"), value: credentialType(s?.withdrawalCredentials) },
    { label: t("validatorsPage.activationEpoch"), value: epochText(s?.activationEpoch) },
    { label: t("validatorsPage.exitEpoch"), value: epochText(s?.exitEpoch) },
    { label: t("validatorsPage.keyType"), value: isRemote.value ? t("validatorsPage.remote") : t("validatorsPage.local") },
    { label: t("validatorsPage.groupLabel"), value: group.value?.name ?? "-", truncate: true },
    ...(csmPosition.value !== undefined
      ? [
          {
            label: t("validatorsPage.csm.badge"),
            value:
              csmPosition.value > 0
                ? t("validatorsPage.csm.queuePosition", { position: csmPosition.value })
                : t("validatorsPage.csm.notQueued"),
          },
        ]
      : []),
    ...(isRemote.value && keyEntry.value?.url
      ? [{ label: t("validatorsPage.remoteImport.signer"), value: keyEntry.value.url, truncate: true }]
      : []),
  ];
});

const openExplorer = () => window.open(explorer.value, "_blank");
const openModal = (type) => (validatorsStore.modal = { type, pubkeys: [pubkey.value] });

// the drawer covers part of the list, so Escape closes it
const onKeydown = (event) => event.key === "Escape" && (validatorsStore.selectedPubkey = null);
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>
