import { computed } from "vue";
import { useValidatorsStore } from "@/store/validators";

// one load for all widgets on a page; again at most once a minute
const RELOAD_MS = 60 * 1000;
let loading = null;
let loadedAt = 0;

async function loadAll(store) {
  await store.loadHolders();
  const running = store.holders.filter((h) => h.state === "running");
  await Promise.all(running.map((h) => store.loadKeys(h.id, true)));
  // shares have no beacon states of their own, their keys are the distributed validators of the Charon/Pluto holder
  await Promise.all(running.filter((h) => h.role !== "share").map((h) => store.loadStates(h.id)));
  await store.loadCsmKeys();
}

/**
 * Key counts and balances over all validator clients of the node, from the validators store:
 * keyCount (keys of every client, a key on two clients counts twice), validatorCount (each on-chain key once,
 * key shares left out), totalBalance (ETH of those; the states hold gwei), keyCountOf(serviceID), csmQueued (Lido CSM keys in the queue).
 */
export function useValidatorTotals() {
  const store = useValidatorsStore();
  if (!loading && Date.now() - loadedAt > RELOAD_MS) {
    loading = loadAll(store)
      .catch((err) => console.error("Loading the validator totals failed:", err))
      .finally(() => {
        loading = null;
        loadedAt = Date.now();
      });
  }

  const holdersWithKeys = computed(() => store.holders.map((h) => ({ holder: h, keys: store.keysByHolder[h.id]?.keys ?? [] })));
  const keyCount = computed(() => holdersWithKeys.value.reduce((sum, { keys }) => sum + keys.length, 0));
  // a Web3Signer and the client signing through it hold the same key, and shares are parts of a distributed key
  const validatorKeys = computed(() => {
    const keys = new Set();
    for (const { holder, keys: list } of holdersWithKeys.value) {
      if (holder.role === "share") continue;
      for (const key of list) keys.add(key.pubkey);
    }
    return keys;
  });
  const validatorCount = computed(() => validatorKeys.value.size);
  const totalBalance = computed(() => {
    const balances = new Map();
    for (const entry of Object.values(store.statesByHolder)) {
      for (const [pubkey, state] of Object.entries(entry?.byPubkey ?? {})) {
        if (validatorKeys.value.has(pubkey) && Number.isFinite(state?.balance)) balances.set(pubkey, state.balance);
      }
    }
    return [...balances.values()].reduce((sum, balance) => sum + balance, 0) / 1e9;
  });
  const keyCountOf = (serviceID) => store.keysByHolder[serviceID]?.keys?.length ?? 0;
  const csmQueued = computed(() => [...validatorKeys.value].filter((pubkey) => store.csm.keys[pubkey] > 0).length);

  return { keyCount, validatorCount, totalBalance, keyCountOf, csmQueued };
}
