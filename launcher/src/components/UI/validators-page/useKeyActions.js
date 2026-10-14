import { computed, ref } from "vue";
import { useValidatorsStore } from "@/store/validators";
import { explorerUrl } from "@/share/validatorStatus";
import i18n from "@/includes/i18n";

const EXIT_DONE_BUCKETS = ["exiting", "exited", "withdrawn", "slashed"];

// Actions available on a key, shared by the rows and the details drawer
export function useKeyActions() {
  const validatorsStore = useValidatorsStore();

  const copied = ref(false);
  const copyPubkey = async (pubkey) => {
    await navigator.clipboard.writeText(pubkey);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  };

  const openExplorer = (row) => {
    const url = explorerUrl(validatorsStore.selectedHolder?.network, row.pubkey, row.state?.index);
    if (url) window.open(url, "_blank");
  };

  // graffiti and fee recipient only on a validator client with its own keys: a DV's settings are the
  // cluster's, not one share's, and Charon/Pluto, SSV and Web3Signer have no per-key settings on this node
  const canSetKeySettings = computed(() => validatorsStore.selectedHolder?.role === "validator");

  // removal works where the keys live on this node: a validator client's own keys or Web3Signer's;
  // shares and SSV validators are managed with their cluster
  const canRemove = computed(() => ["validator", "signer"].includes(validatorsStore.selectedHolder?.role));

  // keystores can be imported where removal works, except into a Prysm in remote signer mode
  const canImport = computed(() => canRemove.value && !validatorsStore.selectedHolder?.signerUrl);

  // remote keys only into a validator client with its own keys: shares go through Charon/Pluto, and Web3Signer is the source
  const canImportRemote = computed(() => validatorsStore.selectedHolder?.role === "validator");
  const holderRunning = computed(() => validatorsStore.selectedHolder?.state === "running");
  // everything that goes through the client's API waits until it runs again; aliases and groups do not
  const clientStopped = computed(() => !!validatorsStore.selectedHolder && !holderRunning.value);
  const whenRunning = (label) => (clientStopped.value ? i18n.global.t("validatorsPage.clientStoppedAction", { action: label }) : label);
  // why remote import is not possible right now, so the user is not sent through the whole modal first
  const remoteImportBlock = computed(() => {
    const holder = validatorsStore.selectedHolder;
    if (!holderRunning.value) return i18n.global.t("validatorsPage.remoteImport.notRunning");
    const keys = validatorsStore.keysByHolder[holder?.id]?.keys ?? [];
    if (holder?.service === "PrysmValidatorService" && keys.some((k) => !k.remote)) {
      return i18n.global.t("validatorsPage.remoteImport.prysmBlocked.localKeys");
    }
    return null;
  });

  // Charon/SSV exit with their cluster, and Web3Signer keys exit through the VC that uses them
  const canExit = computed(() => ["validator", "share"].includes(validatorsStore.selectedHolder?.role));
  // only a known state rules a key out; pending keys may export, unknown ones are left to the preflight
  const exitDisabled = (row) => clientStopped.value || !!row.exitSent || EXIT_DONE_BUCKETS.includes(row.bucket);
  const exitLabel = (row) => {
    if (row.exitSent) return i18n.global.t("validatorsPage.status.exitSent");
    if (clientStopped.value) return whenRunning(i18n.global.t("validatorsPage.exit"));
    return exitDisabled(row) ? i18n.global.t("validatorsPage.exitUnavailable") : i18n.global.t("validatorsPage.exit");
  };

  return {
    copied,
    copyPubkey,
    openExplorer,
    canSetKeySettings,
    canRemove,
    canImport,
    canImportRemote,
    holderRunning,
    clientStopped,
    whenRunning,
    remoteImportBlock,
    canExit,
    exitDisabled,
    exitLabel,
  };
}
