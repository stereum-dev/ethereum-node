<template>
  <ValidatorModal
    :title="t('validatorsPage.remoteImport.title')"
    icon="/img/icon/staking-page-icons/remote-key-icon.svg"
    wide
    @close="close"
  >
    <!-- 1: source and keys -->
    <div v-if="step === 'source'" class="flex flex-col gap-2">
      <div class="flex items-center gap-2 min-h-8">
        <span class="w-28 shrink-0 text-2xs font-semibold uppercase text-[#7fb3b3]">{{
          t("validatorsPage.remoteImport.localSigners")
        }}</span>
        <div v-if="signers.length" class="flex flex-wrap gap-1.5 min-w-0">
          <button
            v-for="signer in signers"
            :key="signer.id"
            class="h-8 flex items-center gap-1.5 pl-1 pr-3 rounded-full border text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :class="
              source.signerId === signer.id
                ? 'border-teal-300 bg-[#224141]'
                : 'border-[#4b8585]/60 bg-[#0D0D12] enabled:hover:border-teal-400'
            "
            :disabled="loading || !signer.running"
            @click="load({ signerId: signer.id })"
          >
            <img v-if="signer.icon" :src="signer.icon" class="w-6 h-6 rounded-full" alt="" />
            <span class="font-semibold truncate max-w-[140px]">{{ signer.name }}</span>
            <span class="text-gray-400">{{
              signer.running ? (signer.keyCount ?? "-") : t("validatorsPage.remoteImport.signerStopped")
            }}</span>
          </button>
        </div>
        <span v-else class="text-xs text-gray-500">{{ t("validatorsPage.remoteImport.noLocalSigner", { network: holder?.network }) }}</span>
      </div>

      <div class="flex flex-col gap-0.5">
        <div class="flex items-center gap-2">
          <span class="w-28 shrink-0 text-2xs font-semibold uppercase text-[#7fb3b3]">{{ t("validatorsPage.remoteImport.urlLabel") }}</span>
          <input
            v-model="urlInput"
            type="text"
            spellcheck="false"
            :placeholder="t('validatorsPage.remoteImport.urlPlaceholder')"
            class="h-9 grow min-w-0 rounded-full bg-[#0D0D12] border border-[#4b8585] px-4 text-xs outline-hidden focus:border-teal-400"
            @keydown.enter="loadUrl"
          />
          <ActionButton :label="t('validatorsPage.remoteImport.load')" :disabled="!!urlCheck.error || loading" @click="loadUrl" />
        </div>
        <span v-if="urlInput.trim() && urlCheck.error" class="pl-30 text-2xs text-red-400">{{
          t(`validatorsPage.remoteImport.urlError.${urlCheck.error}`)
        }}</span>
      </div>

      <span v-if="loading" class="flex items-center gap-2 text-xs text-gray-400">
        <img src="/animation/loading/turning-circle.gif" class="w-5 h-5" alt="" />{{ t("validatorsPage.loading") }}
      </span>
      <span v-else-if="loadError" class="text-xs text-red-400 break-all">{{
        t("validatorsPage.remoteImport.unreachable", { info: loadError })
      }}</span>

      <template v-if="source.url">
        <div class="flex items-center gap-2 px-1">
          <CheckMark :checked="allChecked" :partial="!allChecked && selectedKeys.length > 0" @toggle="toggleAll" />
          <span class="grow text-2xs text-gray-300 truncate" :title="source.url">
            {{ t("validatorsPage.remoteImport.selectedOf", { selected: selectedKeys.length, total: allKeys.length }) }} · {{ source.url }}
          </span>
          <input
            v-model="listSearch"
            type="text"
            :placeholder="t('validatorsPage.search')"
            class="h-6 w-40 rounded-full bg-[#0D0D12] border border-[#4b8585] px-3 text-2xs outline-hidden focus:border-teal-400"
          />
        </div>
        <div class="h-36 rounded-lg bg-[#0D0D12] border border-[#ffffff16] p-1">
          <span v-if="!rows.length" class="block text-xs text-gray-500 px-2 py-1">{{ t("validatorsPage.noKeys") }}</span>
          <VirtualList v-else :items="rows" :item-height="26" :item-key="(row) => row.pubkey">
            <template #default="{ item }">
              <div
                class="h-6 flex items-center gap-2 px-2 rounded-full text-xs"
                :class="item.here ? 'cursor-default' : 'cursor-pointer hover:bg-[#224141]'"
                @click="toggle(item.pubkey)"
              >
                <CheckMark :checked="!!selection[item.pubkey]" @toggle="toggle(item.pubkey)" />
                <span class="grow min-w-0 truncate" :class="item.here ? 'text-gray-500' : ''" :title="item.pubkey">{{
                  shortPubkey(item.pubkey)
                }}</span>
                <span v-if="item.here" class="shrink-0 px-2 rounded-full border border-gray-600 text-2xs text-gray-400">{{
                  t("validatorsPage.remoteImport.badge.here")
                }}</span>
                <span
                  v-if="item.elsewhere"
                  class="shrink-0 px-2 rounded-full border border-amber-500/70 text-2xs text-amber-300"
                  :title="item.elsewhere"
                  >{{ t("validatorsPage.remoteImport.badge.elsewhere") }}</span
                >
                <span v-if="item.manual" class="shrink-0 px-2 rounded-full border border-amber-500/70 text-2xs text-amber-300">{{
                  t("validatorsPage.remoteImport.badge.manual")
                }}</span>
              </div>
            </template>
          </VirtualList>
        </div>
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-2">
            <input
              v-model="manualInput"
              type="text"
              spellcheck="false"
              :placeholder="t('validatorsPage.remoteImport.manualPlaceholder')"
              class="h-8 grow min-w-0 rounded-full bg-[#0D0D12] border border-[#4b8585] px-4 text-xs outline-hidden focus:border-teal-400"
              @keydown.enter="addManual"
            />
            <ActionButton :label="t('validatorsPage.remoteImport.add')" :disabled="!manualInput.trim()" @click="addManual" />
          </div>
          <span v-if="invalidCount" class="text-2xs text-red-400">{{
            t("validatorsPage.remoteImport.invalidKeys", { count: invalidCount })
          }}</span>
        </div>
      </template>
    </div>

    <!-- 2: check -->
    <template v-else-if="step === 'check'">
      <div v-if="!check" class="flex items-center gap-2 text-sm text-gray-300">
        <img src="/animation/loading/turning-circle.gif" class="w-6 h-6" alt="" />{{ t("validatorsPage.importChecking") }}
      </div>
      <template v-else>
        <p v-if="check.info" class="text-xs text-red-400">{{ check.info }}</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="chip in checkChips" :key="chip.label" class="px-3 py-1 rounded-full text-xs font-semibold border border-[#4b8585]">
            {{ chip.label }}: {{ chip.count }}
          </span>
        </div>
        <p v-if="!check.info && !check.statesKnown" class="text-xs text-amber-300">{{ t("validatorsPage.importNoStates") }}</p>

        <div
          v-if="check.remoteSigner?.mode === 'blocked'"
          class="rounded-lg border border-red-500 bg-red-900/25 px-3 py-2 text-xs text-red-200"
        >
          {{ t(`validatorsPage.remoteImport.prysmBlocked.${check.remoteSigner.reason}`, { url: check.remoteSigner.current ?? "" }) }}
        </div>
        <div
          v-else-if="check.remoteSigner?.mode === 'switch'"
          class="rounded-lg border border-[#4b8585] bg-[#224141] px-3 py-2 text-xs text-gray-200 flex flex-col gap-2"
        >
          <span>{{ t(`validatorsPage.remoteImport.${switchClient}Switch`, { url: checkedUrl }) }}</span>
          <span v-if="check.remoteSigner.kept">{{
            t("validatorsPage.remoteImport.prysmSwitchKept", { count: check.remoteSigner.kept })
          }}</span>
          <label class="flex items-start gap-2 cursor-pointer">
            <input v-model="switchAccepted" type="checkbox" class="mt-0.5" />{{
              t(`validatorsPage.remoteImport.${switchClient}SwitchAccept`)
            }}
          </label>
        </div>

        <div
          v-if="check.live?.length"
          class="rounded-lg border border-red-500 bg-red-900/25 px-3 py-2 text-xs text-red-200 flex flex-col gap-2"
        >
          <span class="font-bold">{{ t("validatorsPage.importLive", { count: check.live.length }) }}</span>
          <span class="max-h-20 overflow-y-auto flex flex-col text-2xs">
            <span v-for="key in check.live" :key="key" class="break-all">{{ key }}</span>
          </span>
          <label class="flex items-start gap-2 cursor-pointer">
            <input v-model="liveAccepted" type="checkbox" class="mt-0.5" />{{ t("validatorsPage.importLiveAccept") }}
          </label>
        </div>

        <div
          v-if="elsewhereSelected.length"
          class="rounded-lg border border-amber-500 bg-amber-900/20 px-3 py-2 text-xs text-amber-200 flex flex-col gap-2"
        >
          <span>{{ t("validatorsPage.remoteImport.elsewhere", { count: elsewhereSelected.length, clients: elsewhereClients }) }}</span>
          <label class="flex items-start gap-2 cursor-pointer">
            <input v-model="elsewhereAccepted" type="checkbox" class="mt-0.5" />{{ t("validatorsPage.remoteImport.elsewhereAccept") }}
          </label>
        </div>

        <p v-if="unlistedClients" class="text-xs text-amber-300">
          {{ t("validatorsPage.remoteImport.elsewhereUnknown", { clients: unlistedClients }) }}
        </p>

        <div
          v-if="onChainNotLive.length"
          class="rounded-lg border border-amber-500 bg-amber-900/20 px-3 py-2 text-xs text-amber-200 flex flex-col gap-2"
        >
          <label class="flex items-start gap-2 cursor-pointer">
            <input v-model="onChainAccepted" type="checkbox" class="mt-0.5" />{{ t("validatorsPage.remoteImport.onChainAccept") }}
          </label>
        </div>

        <p v-if="notOnSigner.length" class="text-xs text-amber-300">
          {{ t("validatorsPage.remoteImport.notOnSigner", { count: notOnSigner.length }) }}
        </p>
        <p v-if="allUnknown" class="text-xs text-amber-300">
          {{ t("validatorsPage.remoteImport.allUnknown", { network: holder?.network }) }}
        </p>
        <p v-if="check.doppelganger" class="text-xs text-[#7fb3b3]">{{ t("validatorsPage.importDoppelganger") }}</p>
      </template>
    </template>

    <!-- 3: importing -->
    <div v-else-if="step === 'importing'" class="flex flex-col items-center gap-1 text-sm text-gray-300">
      <ImportAnimation :label="t('validatorsPage.remoteImport.importing', { count: importCount })" />
      <span v-if="check?.remoteSigner?.mode === 'switch'" class="text-xs text-[#7fb3b3]">{{
        t(`validatorsPage.remoteImport.${switchClient}Restarting`)
      }}</span>
    </div>

    <!-- 4: done -->
    <ImportResult
      v-else
      :results="result.results ?? []"
      :info="resultInfo"
      :doppelganger="!!check?.doppelganger"
      :on-chain="check?.statesKnown ? (check.onChain ?? {}) : null"
    />

    <template #footer>
      <template v-if="step === 'source'">
        <ActionButton :label="t('validatorsPage.cancel')" @click="close" />
        <ActionButton
          :label="t('validatorsPage.next')"
          primary
          :disabled="loading || !source.url || !selectedKeys.length"
          @click="runCheck"
        />
      </template>
      <template v-else-if="step === 'check'">
        <ActionButton :label="t('validatorsPage.back')" @click="back" />
        <ActionButton
          :label="t('validatorsPage.importConfirm', { count: checkedKeys.length })"
          primary
          :disabled="!importAllowed"
          @click="runImport"
        />
      </template>
      <ActionButton v-else-if="step === 'done'" :label="t('validatorsPage.close')" primary @click="close" />
    </template>
  </ValidatorModal>
</template>

<script setup>
import { computed, onMounted, ref, shallowRef } from "vue";
import ValidatorModal from "../ValidatorModal.vue";
import ActionButton from "../ActionButton.vue";
import CheckMark from "../CheckMark.vue";
import VirtualList from "../VirtualList.vue";
import ImportResult from "./ImportResult.vue";
import ImportAnimation from "./ImportAnimation.vue";
import ControlService from "@/store/ControlService";
import { useValidatorsStore } from "@/store/validators";
import { useServices } from "@/store/services";
import { normalizeSignerUrl, parsePubkeyList, keysHeldElsewhere } from "@/share/remoteKeys";
import { shortPubkey, statusBucket } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const emit = defineEmits(["close"]);

const t = i18n.global.t;
const validatorsStore = useValidatorsStore();
const serviceStore = useServices();
// fixed at mount, so a client switch in the background cannot redirect the import
const holderId = validatorsStore.selectedHolderId;
const holder = computed(() => validatorsStore.holders.find((h) => h.id === holderId));

const holderName = (id) => {
  const service = serviceStore.installedServices.find((s) => s.config?.serviceID === id);
  return service?.name ?? validatorsStore.holders.find((h) => h.id === id)?.service?.replace(/Service$/, "") ?? id;
};

const step = ref("source");

// source: a Web3Signer on this node for the same network, or a URL
const signers = computed(() =>
  validatorsStore.holders
    .filter((h) => h.role === "signer" && h.network === holder.value?.network)
    .map((h) => {
      const service = serviceStore.installedServices.find((s) => s.config?.serviceID === h.id);
      return {
        id: h.id,
        name: holderName(h.id),
        icon: service?.sIcon ?? service?.icon,
        keyCount: validatorsStore.keysByHolder[h.id]?.keys?.length,
        running: h.state === "running",
      };
    })
);
const urlInput = ref("");
const urlCheck = computed(() => normalizeSignerUrl(urlInput.value));
const source = ref({ signerId: null, url: null });
const signerKeys = shallowRef(new Set());
const manualKeys = ref([]);
// pubkey -> true, a plain object written through the ref so it stays reactive
const selection = ref({});
const loading = ref(false);
const loadError = ref(null);
let loadRun = 0;

const here = computed(() => new Set((validatorsStore.keysByHolder[holderId]?.keys ?? []).map((k) => k.pubkey)));
const allKeys = computed(() => [...signerKeys.value, ...manualKeys.value.filter((k) => !signerKeys.value.has(k))]);
const elsewhere = computed(() => keysHeldElsewhere(allKeys.value, validatorsStore.keysByHolder, validatorsStore.holders, holderId));
// the 'elsewhere' check needs every other validator client's keys, which the page lists one by one
const otherClients = computed(() => validatorsStore.holders.filter((h) => h.role === "validator" && h.id !== holderId));
onMounted(() => otherClients.value.forEach((h) => validatorsStore.loadKeys(h.id)));
const unlistedClients = computed(() =>
  otherClients.value
    .filter((h) => !validatorsStore.keysByHolder[h.id]?.loadedAt)
    .map((h) => holderName(h.id))
    .join(", ")
);

const load = async ({ signerId = null, url = null }) => {
  const run = ++loadRun;
  loading.value = true;
  loadError.value = null;
  let res;
  try {
    res = await ControlService.listSignerKeys({ signerId, url });
  } catch (err) {
    res = { code: 1, info: String(err?.message || err) };
  }
  // a newer load wins
  if (run !== loadRun) return;
  loading.value = false;
  if (res?.code !== 0) {
    loadError.value = res?.info || t("validatorsPage.noAnswer");
    // a known url still allows adding keys by hand, like the staking page did
    if (!res?.url) return;
    source.value = { signerId, url: res.url };
    signerKeys.value = new Set();
    manualKeys.value = [];
    selection.value = {};
    return;
  }
  source.value = { signerId, url: res.url };
  signerKeys.value = new Set(res.keys);
  manualKeys.value = [];
  // keys this or another client on the node already holds stay unchecked
  const held = keysHeldElsewhere(res.keys, validatorsStore.keysByHolder, validatorsStore.holders, holderId);
  selection.value = Object.fromEntries(res.keys.filter((k) => !here.value.has(k) && !held[k]).map((k) => [k, true]));
};
const loadUrl = () => !urlCheck.value.error && !loading.value && load({ url: urlCheck.value.url });

const listSearch = ref("");
const rows = computed(() => {
  const search = listSearch.value.trim().toLowerCase();
  return allKeys.value
    .filter((pubkey) => !search || pubkey.includes(search))
    .map((pubkey) => ({
      pubkey,
      here: here.value.has(pubkey),
      elsewhere: elsewhere.value[pubkey]?.map(holderName).join(", ") ?? "",
      manual: !signerKeys.value.has(pubkey),
    }));
});
const selectedKeys = computed(() => allKeys.value.filter((k) => selection.value[k]));
const selectable = computed(() => rows.value.filter((row) => !row.here));
const allChecked = computed(() => selectable.value.length > 0 && selectable.value.every((row) => selection.value[row.pubkey]));
const toggleAll = () => {
  if (allChecked.value) selection.value = {};
  else selection.value = { ...selection.value, ...Object.fromEntries(selectable.value.map((row) => [row.pubkey, true])) };
};
const toggle = (pubkey) => {
  // keys this client holds already would only come back as duplicates
  if (here.value.has(pubkey)) return;
  if (selection.value[pubkey]) delete selection.value[pubkey];
  else selection.value[pubkey] = true;
};

// keys typed in by hand, e.g. ones the signer loads later
const manualInput = ref("");
const invalidCount = ref(0);
const addManual = () => {
  const { keys, invalid } = parsePubkeyList(manualInput.value);
  for (const key of keys) {
    if (!signerKeys.value.has(key) && !manualKeys.value.includes(key)) manualKeys.value.push(key);
    if (!here.value.has(key)) selection.value[key] = true;
  }
  invalidCount.value = invalid.length;
  if (!invalid.length) manualInput.value = "";
};

// check
const check = ref(null);
// the keys and signer the check ran for, so a later change on the first step cannot slip past it
const checkedKeys = ref([]);
const checkedUrl = ref(null);
let checkRun = 0;
const liveAccepted = ref(false);
const elsewhereAccepted = ref(false);
const onChainAccepted = ref(false);
const switchAccepted = ref(false);

const elsewhereSelected = computed(() => checkedKeys.value.filter((k) => elsewhere.value[k]));
const elsewhereClients = computed(() =>
  [...new Set(elsewhereSelected.value.flatMap((k) => elsewhere.value[k]))].map(holderName).join(", ")
);
const notOnSigner = computed(() => checkedKeys.value.filter((k) => !signerKeys.value.has(k)));
// remote keys come without slashing protection, so keys that may have signed before need a confirmation
const onChainNotLive = computed(() =>
  checkedKeys.value.filter((k) => {
    const state = check.value?.onChain?.[k];
    return state && ["active", "pending", "exiting"].includes(statusBucket(state)) && !check.value.live?.includes(k);
  })
);
const allUnknown = computed(() => !!check.value?.statesKnown && !checkedKeys.value.some((k) => check.value.onChain?.[k]));
const checkChips = computed(() => {
  const onChain = checkedKeys.value.map((k) => check.value?.onChain?.[k]).filter(Boolean);
  return [
    { label: t("validatorsPage.importKeys"), count: checkedKeys.value.length },
    { label: t("validatorsPage.importAlready"), count: check.value?.alreadyImported?.length ?? 0 },
    { label: t("validatorsPage.status.active"), count: onChain.filter((s) => String(s.status).startsWith("active")).length },
    { label: t("validatorsPage.status.unknown"), count: checkedKeys.value.length - onChain.length },
  ].filter((chip, i) => i === 0 || chip.count);
});
const importAllowed = computed(
  () =>
    !!check.value &&
    !check.value.info &&
    check.value.remoteSigner?.mode !== "blocked" &&
    (check.value.remoteSigner?.mode !== "switch" || switchAccepted.value) &&
    (!check.value.live?.length || liveAccepted.value) &&
    (!elsewhereSelected.value.length || elsewhereAccepted.value) &&
    (!onChainNotLive.value.length || onChainAccepted.value)
);
const switchClient = computed(() => (holder.value?.service === "TekuValidatorService" ? "teku" : "prysm"));
const runCheck = async () => {
  // a signer load still running must not replace the source the check is for
  loadRun++;
  loading.value = false;
  const run = ++checkRun;
  step.value = "check";
  check.value = null;
  checkedKeys.value = [...selectedKeys.value];
  checkedUrl.value = source.value.url;
  liveAccepted.value = false;
  elsewhereAccepted.value = false;
  onChainAccepted.value = false;
  switchAccepted.value = false;
  let res;
  try {
    res = (await ControlService.prepareKeyImport(holderId, checkedKeys.value, checkedUrl.value)) ?? {
      code: 1,
      info: t("validatorsPage.noAnswer"),
    };
  } catch (err) {
    res = { code: 1, info: String(err?.message || err) };
  }
  // only the answer for the latest keys counts
  if (run === checkRun) check.value = res;
};

const back = () => {
  // drops a check still running
  checkRun++;
  step.value = "source";
};

// import
const result = ref(null);
const importCount = ref(0);
const runImport = async () => {
  if (!importAllowed.value) return;
  importCount.value = checkedKeys.value.length;
  step.value = "importing";
  result.value = await validatorsStore.importRemoteKeys(holderId, checkedKeys.value, checkedUrl.value);
  step.value = "done";
};
// a blocked Prysm answers with a reason the modal can translate
const resultInfo = computed(() => {
  const res = result.value;
  if (!res?.info) return null;
  return res.reason ? t(`validatorsPage.remoteImport.prysmBlocked.${res.reason}`) : res.info;
});

const close = () => {
  if (step.value === "importing") return;
  emit("close");
};
</script>
