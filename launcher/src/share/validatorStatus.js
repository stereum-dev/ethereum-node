// Pure helpers of the validators page, shared so they can be tested without the UI

export const STATUS_BUCKETS = ["active", "exiting", "pending", "queued", "exited", "withdrawn", "slashed", "unknown"];

// Status of a validator for filtering, following the beacon API statuses. Slashed wins (it can be
// active, exited or withdrawn at the same time), and only "*_slashed" counts, not "exited_unslashed".
// A key without beacon state is "unknown": not deposited yet, or not visible to this beacon node.
// queued: a Lido CSM key waiting in the deposit queue, which the beacon cannot know yet.
export function statusBucket(state, queued = false) {
  if (!state) return queued ? "queued" : "unknown";
  const status = String(state.status || "");
  if (state.slashed || status.endsWith("_slashed")) return "slashed";
  if (status === "active_exiting") return "exiting";
  if (status.startsWith("active")) return "active";
  if (status.startsWith("pending")) return "pending";
  if (status.startsWith("exited")) return "exited";
  // withdrawal_possible: exited and withdrawable, but the balance is still there until the sweep pays it out
  if (status === "withdrawal_possible") return "exited";
  if (status.startsWith("withdrawal")) return "withdrawn";
  return "unknown";
}

// Days between an epoch and the chain head, or null when either is unknown or the epoch is in the future
export function daysSinceEpoch(epoch, chain) {
  if (!chain?.headSlot || !Number.isFinite(epoch) || epoch > Number.MAX_SAFE_INTEGER) return null;
  const headEpoch = Math.floor(chain.headSlot / chain.slotsPerEpoch);
  if (epoch > headEpoch) return null;
  return ((headEpoch - epoch) * chain.slotsPerEpoch * chain.secondsPerSlot) / 86400;
}

export function shortPubkey(pubkey) {
  return pubkey && pubkey.length > 20 ? `${pubkey.slice(0, 10)}…${pubkey.slice(-8)}` : pubkey;
}

// Gwei to ETH with a fixed number of decimals, "-" when unknown
export function formatEth(gwei, decimals = 4) {
  return Number.isFinite(gwei) ? (gwei / 1e9).toFixed(decimals) : "-";
}

const EXPLORERS = {
  mainnet: "https://beaconcha.in/",
  hoodi: "https://hoodi.beaconcha.in/",
  sepolia: "https://sepolia.beaconcha.in/",
  holesky: "https://holesky.beaconcha.in/",
  gnosis: "https://gnosischa.in/",
};

// Explorer page of a validator (by index when known, else by pubkey), null for networks without one
export function explorerUrl(network, pubkey, index) {
  const base = EXPLORERS[network];
  return base ? `${base}validator/${index ?? pubkey}` : null;
}

export const FEE_RECIPIENT = /^0x[a-fA-F0-9]{40}$/;

// Same rules as the staking page so existing aliases stay valid: no spaces, at most 30 characters, unique
export function aliasError(name, pubkey, aliases = {}) {
  if (!name) return null;
  if (/\s/.test(name)) return "spaces";
  if (name.length > 30) return "length";
  if (Object.entries(aliases).some(([key, entry]) => key !== pubkey && entry?.keyName === name)) return "taken";
  return null;
}

// CSV of key rows; fields are always quoted so pubkeys, aliases and commas survive spreadsheet imports
export function keysToCsv(rows) {
  // a leading quote keeps spreadsheets from evaluating user text (aliases, group names) as a formula
  const cell = (v) =>
    `"${String(v ?? "")
      .replace(/^[=+\-@\t\r]/, "'$&")
      .replace(/"/g, '""')}"`;
  const header = [
    "pubkey",
    "alias",
    "group",
    "index",
    "status",
    "balance_eth",
    "effective_balance_eth",
    "activation_epoch",
    "exit_epoch",
    "credentials",
    "remote",
    "lido_csm",
  ];
  const epoch = (e) => (Number.isFinite(e) && e < Number.MAX_SAFE_INTEGER ? e : "");
  const lines = rows.map((r) =>
    [
      r.pubkey,
      r.alias,
      r.group?.name,
      r.state?.index,
      r.state?.status ?? (r.bucket === "queued" ? "csm_queue" : "not_on_chain"),
      Number.isFinite(r.state?.balance) ? r.state.balance / 1e9 : "",
      Number.isFinite(r.state?.effectiveBalance) ? r.state.effectiveBalance / 1e9 : "",
      epoch(r.state?.activationEpoch),
      epoch(r.state?.exitEpoch),
      r.state?.withdrawalCredentials,
      r.remote ? "yes" : "no",
      r.csm ? "yes" : "no",
    ]
      .map(cell)
      .join(",")
  );
  return [header.map(cell).join(","), ...lines].join("\n") + "\n";
}

const HOLDER_TABS = {
  validator: ["keys", "duties"],
  signer: ["keys", "duties"],
  distributed: ["keys", "duties", "cluster"],
  ssv: ["keys", "duties", "cluster"],
  // shares are not on chain, so they have no duties; their cluster is the Charon/Pluto they run behind
  share: ["keys", "cluster"],
};

// Section tabs a holder role offers
export function holderTabs(role) {
  return HOLDER_TABS[role] ?? ["keys"];
}

const PUBKEY = /^0x[0-9a-f]{96}$/;

// Lido CSM signing keys [{ key, queuePosition }] -> { lowercased pubkey: position }, 0 meaning not queued
export function csmQueueMap(list) {
  const map = {};
  for (const entry of Array.isArray(list) ? list : []) {
    const pubkey = String(entry?.key ?? "").toLowerCase();
    if (!PUBKEY.test(pubkey)) continue;
    const position = Number(entry.queuePosition ?? 0);
    map[pubkey] = Number.isFinite(position) && position > 0 ? position : 0;
  }
  return map;
}
