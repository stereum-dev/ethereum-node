// Pure helpers for voluntary exits on the validators page, shared by the backend and the UI

export const EXIT_BLOCKERS = ["notOnChain", "pending", "exiting", "exited", "slashed", "tooYoung", "notInCluster"];

const DECIMAL = /^\d+$/;
const SIGNATURE = /^0x[0-9a-f]{192}$/i;

// null when the key may exit now, else { reason, eligibleEpoch? }
export function exitBlocker(state, currentEpoch, shardCommitteePeriod) {
  if (!state) return { reason: "notOnChain" };
  const status = String(state.status || "");
  if (state.slashed || status.endsWith("_slashed")) return { reason: "slashed" };
  if (status === "active_exiting") return { reason: "exiting" };
  if (status.startsWith("exited") || status.startsWith("withdrawal")) return { reason: "exited" };
  if (status.startsWith("pending")) return { reason: "pending" };
  if (status !== "active_ongoing") return { reason: "notOnChain" };
  // the beacon rejects exits until a validator has been active for the shard committee period
  const eligibleEpoch = state.activationEpoch + shardCommitteePeriod;
  if (Number.isFinite(currentEpoch) && Number.isFinite(eligibleEpoch) && currentEpoch < eligibleEpoch) {
    return { reason: "tooYoung", eligibleEpoch };
  }
  return null;
}

const yes = (value) => value === true || value === "true";

// slots the head may trail the clock: missed blocks leave small gaps, a stopped execution client a growing one.
// Prysm keeps reporting is_syncing, is_optimistic and el_offline as false for minutes after its execution client stops
export const MAX_SYNC_DISTANCE = 16;

// syncing = /eth/v1/node/syncing data (or null if unreachable)
export function beaconBlocker(syncing) {
  if (!syncing || typeof syncing !== "object") return "unreachable";
  if (yes(syncing.is_syncing)) return "syncing";
  if (yes(syncing.is_optimistic)) return "optimistic";
  if (yes(syncing.el_offline)) return "elOffline";
  if (Number(syncing.sync_distance) > MAX_SYNC_DISTANCE) return "behind";
  return null;
}

const decimal = (value) => {
  const text = typeof value === "number" ? String(value) : value;
  return typeof text === "string" && DECIMAL.test(text) ? text : null;
};

// keymanager answer -> normalized signed exit or null; only checked fields are kept, so nothing else reaches a command
export function checkSignedExit(answer, expectedIndex) {
  const data = answer?.data;
  const epoch = decimal(data?.message?.epoch);
  const index = decimal(data?.message?.validator_index);
  const signature = data?.signature;
  if (epoch === null || index === null || typeof signature !== "string" || !SIGNATURE.test(signature)) return null;
  if (expectedIndex != null && index !== String(expectedIndex)) return null;
  return { message: { epoch, validator_index: index }, signature };
}

// one key: its validator index, several: "exit N"
export function exitConfirmToken(pubkeys, indexByPubkey = {}) {
  const index = pubkeys.length === 1 ? indexByPubkey[pubkeys[0]] : undefined;
  return index != null ? String(index) : `exit ${pubkeys.length}`;
}

// one message as an object (like the staking page's single exit file), several as an array
export function exitMessagesFile(messages) {
  return JSON.stringify(messages.length === 1 ? messages[0] : messages, null, 2) + "\n";
}

export function exitFileName(service, network, date = new Date()) {
  const client = String(service || "validator")
    .replace(/(Validator)?Service$/, "")
    .toLowerCase();
  const stamp = date.toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `exit-messages-${client}-${network || "unknown"}-${stamp}.json`;
}
