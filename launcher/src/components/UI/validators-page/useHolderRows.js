import { computed } from "vue";
import { useValidatorsStore } from "@/store/validators";
import { useServices } from "@/store/services";
import { STATUS_BUCKETS, statusBucket, daysSinceEpoch } from "@/share/validatorStatus";
import { keyGroup, groupSummaries, filterByGroup } from "@/share/keyGroups";

const NETWORK_COINS = {
  mainnet: "network-currency-icons-ethereum-mainnet.png",
  gnosis: "network-currency-icons-gnosis-mainnet.png",
  sepolia: "network-currency-icons-sepolia-testnet.png",
  holesky: "network-currency-icons-holesky-testnet.png",
  hoodi: "network-currency-icons-hoodi-testnet.png",
};

// Rows of the selected holder (keys joined with their beacon state and alias), shared by the summary and the list
export function useHolderRows() {
  const validatorsStore = useValidatorsStore();

  const holder = computed(() => validatorsStore.selectedHolder);
  const keysEntry = computed(() => validatorsStore.keysByHolder[holder.value?.id]);
  const statesEntry = computed(() => validatorsStore.statesByHolder[holder.value?.id]);
  // shares are not on chain, their stats are those of the distributed validator on the Charon/Pluto holder;
  // without any beacon answer yet (still loading, or a lone Web3Signer) the states are unknown, not "not on chain"
  const hasStats = computed(() => !!holder.value && holder.value.role !== "share" && !!statesEntry.value?.chain);
  const coinIcon = computed(() => {
    const coin = NETWORK_COINS[holder.value?.network];
    return coin ? `/img/icon/control-page-icons/network-currency-icons/${coin}` : null;
  });

  const allRows = computed(() => {
    const byPubkey = statesEntry.value?.byPubkey ?? {};
    const chain = statesEntry.value?.chain;
    const csmKeys = validatorsStore.csm.keys;
    return (keysEntry.value?.keys ?? []).map((key) => {
      const state = byPubkey[key.pubkey];
      // a Lido CSM key waiting for its deposit has no beacon state yet
      const csmPosition = csmKeys[key.pubkey];
      const bucket = statusBucket(state, csmPosition > 0);
      const since =
        bucket === "active" || bucket === "exiting"
          ? daysSinceEpoch(state.activationEpoch, chain)
          : bucket === "exited" || bucket === "withdrawn"
            ? daysSinceEpoch(state.exitEpoch, chain)
            : null;
      return {
        pubkey: key.pubkey,
        remote: key.remote,
        alias: validatorsStore.aliases[key.pubkey]?.keyName,
        group: keyGroup(validatorsStore.aliases[key.pubkey], holder.value?.id),
        state,
        bucket,
        since: since === null ? "" : `${since.toFixed(1)} d`,
        // until the beacon includes it, a sent exit still reads as active
        exitSent: !!validatorsStore.exitsSent[key.pubkey] && (!hasStats.value || bucket === "active"),
        csm: csmPosition !== undefined,
      };
    });
  });

  const groups = computed(() => groupSummaries(allRows.value));
  const ungroupedCount = computed(() => allRows.value.filter((row) => !row.group).length);
  // rows of the active group filter; the cards summarise this scope
  const scopedRows = computed(() => filterByGroup(allRows.value, validatorsStore.groupFilter));

  const counts = computed(() => {
    const result = Object.fromEntries(STATUS_BUCKETS.map((b) => [b, 0]));
    for (const row of scopedRows.value) result[row.bucket]++;
    result.all = scopedRows.value.length;
    return result;
  });

  const totalBalance = computed(() =>
    scopedRows.value.reduce((sum, row) => sum + (Number.isFinite(row.state?.balance) ? row.state.balance : 0), 0)
  );

  const rows = computed(() => {
    const search = validatorsStore.search;
    const filter = hasStats.value ? validatorsStore.statusFilter : "all";
    return scopedRows.value.filter(
      (row) =>
        (filter === "all" || row.bucket === filter) &&
        (!search ||
          row.pubkey.includes(search) ||
          row.alias?.toLowerCase().includes(search) ||
          String(row.state?.index ?? "").includes(search))
    );
  });

  const dvtClientName = computed(() => holderName(holder.value?.dvtVia));

  return {
    holder,
    keysEntry,
    statesEntry,
    hasStats,
    coinIcon,
    allRows,
    scopedRows,
    groups,
    ungroupedCount,
    counts,
    totalBalance,
    rows,
    dvtClientName,
  };
}

// Name of a holder like in the client list (the Charon/Pluto of shares falls back to "Charon")
export function holderName(serviceID) {
  const validatorsStore = useValidatorsStore();
  const service = useServices().installedServices.find((s) => s.config?.serviceID === serviceID);
  return service?.name ?? validatorsStore.holders.find((h) => h.id === serviceID)?.service.replace(/Service$/, "") ?? "Charon";
}
