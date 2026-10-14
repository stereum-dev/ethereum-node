// Pure helpers of the duties tab (chain clock, reward summaries), shared by the backend, the store and the UI
import { formatEth } from "./validatorStatus";

// Wall-clock slot and epoch from the genesis time, null without it (or before genesis)
export function chainClock({ genesisTime, secondsPerSlot, slotsPerEpoch } = {}, nowMs = Date.now()) {
  if (!Number.isFinite(genesisTime) || !(secondsPerSlot > 0) || !(slotsPerEpoch > 0)) return null;
  const slotMs = secondsPerSlot * 1000;
  const elapsed = nowMs - genesisTime * 1000;
  if (elapsed < 0) return null;
  const slot = Math.floor(elapsed / slotMs);
  const epoch = Math.floor(slot / slotsPerEpoch);
  return {
    slot,
    epoch,
    slotInEpoch: slot - epoch * slotsPerEpoch,
    msToNextSlot: (slot + 1) * slotMs - elapsed,
    msToNextEpoch: (epoch + 1) * slotsPerEpoch * slotMs - elapsed,
    slotMs,
  };
}

// First epoch of the sync committee period after the one epoch is in
export function nextPeriodStart(epoch, period) {
  return (Math.floor(epoch / period) + 1) * period;
}

// Unique validator indices that have duties: every "active_*" status, exiting and slashed ones included
export function activeIndices(byPubkey = {}) {
  const indices = new Set();
  for (const state of Object.values(byPubkey ?? {})) {
    const index = String(state?.index ?? "");
    if (String(state?.status ?? "").startsWith("active") && /^\d+$/.test(index)) indices.add(index);
  }
  return [...indices];
}

const MISSED_CAP = 100;
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Attestation reward answers (one per chunk) -> { total, ideal, effectiveness, missed, missedCount }.
 * The ideal reward depends on the effective balance, so effectiveByIndex picks the matching ideal entry;
 * without it the 32 ETH entry (or the largest) is used.
 */
export function attestationSummary(answers = [], effectiveByIndex = {}) {
  let total = 0;
  let ideal = 0;
  let missedCount = 0;
  const missed = [];
  for (const answer of answers) {
    const data = answer?.data;
    if (!data) continue;
    const ideals = new Map();
    for (const entry of data.ideal_rewards ?? []) {
      ideals.set(String(entry.effective_balance), num(entry.head) + num(entry.target) + num(entry.source));
    }
    const fallbackKey = ideals.has("32000000000") ? "32000000000" : [...ideals.keys()].sort((a, b) => num(b) - num(a))[0];
    for (const reward of data.total_rewards ?? []) {
      const source = num(reward.source);
      const target = num(reward.target);
      total += num(reward.head) + target + source + num(reward.inactivity);
      const balance = effectiveByIndex[String(reward.validator_index)];
      ideal += ideals.get(String(balance)) ?? ideals.get(fallbackKey) ?? 0;
      if (source < 0 || target < 0) {
        missedCount++;
        if (missed.length < MISSED_CAP) missed.push(String(reward.validator_index));
      }
    }
  }
  return { total, ideal, effectiveness: ideal > 0 ? total / ideal : null, missed, missedCount };
}

// Sync committee reward answers per slot ([{ slot, status, body }]) -> { total, missedCount, missedSlots }
export function syncSummary(answers = []) {
  let total = 0;
  let missedCount = 0;
  const missedSlots = [];
  for (const { slot, status, body } of answers) {
    // no block in that slot, so nobody could sign for it
    if (status === 404) {
      missedSlots.push(slot);
      continue;
    }
    for (const entry of body?.data ?? []) {
      const reward = num(entry.reward);
      total += reward;
      if (reward < 0) missedCount++;
    }
  }
  return { total, missedCount, missedSlots };
}

// Merge a (partial) epoch row into the history, newest first, at most max epochs
export function mergeRewardHistory(history = [], entry, max = 10) {
  if (!entry || !Number.isSafeInteger(entry.epoch)) return history;
  const rows = history.filter((row) => row.epoch !== entry.epoch);
  const existing = history.find((row) => row.epoch === entry.epoch);
  rows.push({ ...existing, ...entry });
  return rows.sort((a, b) => b.epoch - a.epoch).slice(0, max);
}

/**
 * Rows of own proposals for the list: { slot, index, pubkey, state, eta, reward }, upcoming ones first
 * (soonest first), then past ones newest first. outcomes: { slot: { result, reward } }.
 */
export function proposalRows(proposals = [], outcomes = {}, clock = null) {
  const rows = proposals.map((p) => {
    const outcome = outcomes?.[p.slot];
    let state = outcome?.result ?? "pending";
    let eta = null;
    if (clock && p.slot > clock.slot) {
      state = "upcoming";
      eta = (p.slot - clock.slot - 1) * clock.slotMs + clock.msToNextSlot;
    }
    return { slot: p.slot, index: p.index, pubkey: p.pubkey, state, eta, reward: outcome?.reward ?? null };
  });
  const upcoming = rows.filter((r) => r.state === "upcoming").sort((a, b) => a.slot - b.slot);
  const past = rows.filter((r) => r.state !== "upcoming").sort((a, b) => b.slot - a.slot);
  return [...upcoming, ...past];
}

// Milliseconds as "1h 4m", "3m 12s" or "12s"
export function formatCountdown(ms) {
  const seconds = Math.max(0, Math.ceil((Number(ms) || 0) / 1000));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}

// Signed ETH from gwei; per-epoch rewards are tiny, so more decimals than balances
export function formatGwei(gwei, decimals = 6) {
  if (!Number.isFinite(gwei)) return "-";
  return (gwei > 0 ? "+" : "") + formatEth(gwei, decimals);
}
