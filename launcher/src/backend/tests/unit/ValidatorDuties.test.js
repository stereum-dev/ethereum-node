import {
  chainClock,
  nextPeriodStart,
  activeIndices,
  attestationSummary,
  syncSummary,
  mergeRewardHistory,
  proposalRows,
  formatCountdown,
  formatGwei,
} from "@/share/validatorDuties";

describe("chain clock", () => {
  // gnosis: 5 s slots, 16 slots per epoch
  const gnosis = { genesisTime: 1638993340, secondsPerSlot: 5, slotsPerEpoch: 16 };
  const at = (seconds) => (gnosis.genesisTime + seconds) * 1000;

  test("slot and epoch boundaries", () => {
    expect(chainClock(gnosis, at(0))).toMatchObject({ slot: 0, epoch: 0, slotInEpoch: 0, msToNextSlot: 5000, msToNextEpoch: 80000 });
    expect(chainClock(gnosis, at(80) - 1)).toMatchObject({ slot: 15, epoch: 0, slotInEpoch: 15, msToNextSlot: 1, msToNextEpoch: 1 });
    expect(chainClock(gnosis, at(80))).toMatchObject({ slot: 16, epoch: 1, slotInEpoch: 0, msToNextEpoch: 80000 });
    expect(chainClock(gnosis, at(5 * 1000 + 2.5))).toMatchObject({ slot: 1000, epoch: 62, slotInEpoch: 8, msToNextSlot: 2500 });
  });

  test("no clock without a genesis time or before genesis", () => {
    expect(chainClock({ ...gnosis, genesisTime: null }, at(10))).toBeNull();
    expect(chainClock(gnosis, at(-1))).toBeNull();
    expect(chainClock(undefined)).toBeNull();
  });
});

test("the next sync committee period starts at the next multiple of the period", () => {
  expect(nextPeriodStart(0, 256)).toEqual(256);
  expect(nextPeriodStart(255, 256)).toEqual(256);
  expect(nextPeriodStart(256, 256)).toEqual(512);
  expect(nextPeriodStart(1000, 512)).toEqual(1024);
});

test("active indices include exiting and slashed keys that still have duties", () => {
  const byPubkey = {
    a: { index: "1", status: "active_ongoing" },
    b: { index: "2", status: "active_exiting" },
    c: { index: "3", status: "active_slashed" },
    d: { index: "4", status: "pending_queued" },
    e: { index: "5", status: "exited_unslashed" },
    f: { index: "1", status: "active_ongoing" },
    g: { index: undefined, status: "active_ongoing" },
  };
  expect(activeIndices(byPubkey)).toEqual(["1", "2", "3"]);
  expect(activeIndices(undefined)).toEqual([]);
});

describe("attestation summary", () => {
  const ideal = (balance, head, target, source) => ({
    effective_balance: String(balance),
    head: String(head),
    target: String(target),
    source: String(source),
  });
  const reward = (index, head, target, source, inactivity = 0) => ({
    validator_index: String(index),
    head: String(head),
    target: String(target),
    source: String(source),
    inactivity: String(inactivity),
  });

  test("sums across chunks and matches ideal rewards by effective balance", () => {
    const ideals = [ideal(32e9, 10, 20, 10), ideal(64e9, 20, 40, 20)];
    const answers = [
      { data: { ideal_rewards: ideals, total_rewards: [reward(1, 10, 20, 10), reward(2, 20, 40, 20)] } },
      { data: { ideal_rewards: ideals, total_rewards: [reward(3, 0, -20, -10, -1)] } },
    ];
    const summary = attestationSummary(answers, { 1: 32e9, 2: 64e9, 3: 32e9 });
    expect(summary.total).toEqual(40 + 80 - 31);
    expect(summary.ideal).toEqual(40 + 80 + 40);
    expect(summary.effectiveness).toBeCloseTo(89 / 160);
    expect(summary.missed).toEqual(["3"]);
    expect(summary.missedCount).toEqual(1);
  });

  test("without known balances the 32 ETH entry is the ideal", () => {
    const answers = [{ data: { ideal_rewards: [ideal(31e9, 1, 1, 1), ideal(32e9, 10, 20, 10)], total_rewards: [reward(9, 10, 20, 10)] } }];
    expect(attestationSummary(answers).effectiveness).toEqual(1);
  });

  test("missed keys are capped in the answer but fully counted", () => {
    const total_rewards = Array.from({ length: 150 }, (_, i) => reward(i, 0, -1, -1));
    const summary = attestationSummary([{ data: { ideal_rewards: [ideal(32e9, 1, 1, 1)], total_rewards } }]);
    expect(summary.missed).toHaveLength(100);
    expect(summary.missedCount).toEqual(150);
  });

  test("no answers give no effectiveness", () => {
    expect(attestationSummary([null, {}])).toEqual({ total: 0, ideal: 0, effectiveness: null, missed: [], missedCount: 0 });
  });
});

test("sync summary counts missed slots and penalties", () => {
  const summary = syncSummary([
    { slot: 32, status: 200, body: { data: [{ validator_index: "1", reward: "20" }] } },
    { slot: 33, status: 404, body: { code: 404, message: "not found" } },
    { slot: 34, status: 200, body: { data: [{ validator_index: "1", reward: "-20" }] } },
    { slot: 35, status: 200, body: { data: [{ validator_index: "1", reward: "20" }] } },
  ]);
  expect(summary).toEqual({ total: 20, missedCount: 1, missedSlots: [33] });
});

test("reward history merges partial epochs, newest first, at most 10", () => {
  let history = [];
  history = mergeRewardHistory(history, { epoch: 100, sync: 5, block: 0 });
  history = mergeRewardHistory(history, { epoch: 98, attestation: 7 });
  history = mergeRewardHistory(history, { epoch: 100, attestation: 9 });
  expect(history).toEqual([
    { epoch: 100, sync: 5, block: 0, attestation: 9 },
    { epoch: 98, attestation: 7 },
  ]);
  for (let epoch = 101; epoch < 115; epoch++) history = mergeRewardHistory(history, { epoch, sync: 1 });
  expect(history).toHaveLength(10);
  expect(history[0].epoch).toEqual(114);
  expect(history[9].epoch).toEqual(105);
  expect(mergeRewardHistory(history, { epoch: "x" })).toBe(history);
});

test("proposal rows: upcoming first with their eta, then past ones newest first", () => {
  const clock = { slot: 100, msToNextSlot: 4000, slotMs: 12000 };
  const proposals = [
    { slot: 90, index: "1", pubkey: "a" },
    { slot: 105, index: "2", pubkey: "b" },
    { slot: 98, index: "3", pubkey: "c" },
    { slot: 101, index: "4", pubkey: "d" },
    { slot: 100, index: "5", pubkey: "e" },
  ];
  const outcomes = { 90: { result: "proposed", reward: 12345 }, 98: { result: "missed", reward: 0 } };
  const rows = proposalRows(proposals, outcomes, clock);
  expect(rows.map((r) => [r.slot, r.state])).toEqual([
    [101, "upcoming"],
    [105, "upcoming"],
    [100, "pending"],
    [98, "missed"],
    [90, "proposed"],
  ]);
  expect(rows[0].eta).toEqual(4000);
  expect(rows[1].eta).toEqual(4 * 12000 + 4000);
  expect(rows[4].reward).toEqual(12345);
});

test("countdowns and signed rewards are formatted", () => {
  expect(formatCountdown(192000)).toEqual("3m 12s");
  expect(formatCountdown(11200)).toEqual("12s");
  expect(formatCountdown(3725000)).toEqual("1h 2m");
  expect(formatCountdown(-5)).toEqual("0s");
  expect(formatGwei(12345)).toEqual("+0.000012");
  expect(formatGwei(-12345)).toEqual("-0.000012");
  expect(formatGwei(0)).toEqual("0.000000");
  expect(formatGwei(NaN)).toEqual("-");
});
