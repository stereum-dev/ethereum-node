import {
  statusBucket,
  daysSinceEpoch,
  shortPubkey,
  formatEth,
  explorerUrl,
  aliasError,
  FEE_RECIPIENT,
  keysToCsv,
  STATUS_BUCKETS,
  holderTabs,
  csmQueueMap,
} from "@/share/validatorStatus";

test("statuses are bucketed for filtering", () => {
  expect(statusBucket({ status: "active_ongoing" })).toEqual("active");
  expect(statusBucket({ status: "active_exiting" })).toEqual("exiting");
  expect(statusBucket({ status: "pending_initialized" })).toEqual("pending");
  expect(statusBucket({ status: "pending_queued" })).toEqual("pending");
  expect(statusBucket({ status: "exited_unslashed" })).toEqual("exited");
  expect(statusBucket({ status: "withdrawal_possible" })).toEqual("exited");
  expect(statusBucket({ status: "withdrawal_done" })).toEqual("withdrawn");
  expect(statusBucket({ status: "exited_slashed" })).toEqual("slashed");
  expect(statusBucket({ status: "active_slashed", slashed: true })).toEqual("slashed");
  expect(statusBucket({ status: "withdrawal_done", slashed: true })).toEqual("slashed");
  expect(statusBucket(undefined)).toEqual("unknown");
});

test("days since an epoch use the chain's own timing", () => {
  const chain = { headSlot: 3200, slotsPerEpoch: 32, secondsPerSlot: 12 }; // head epoch 100
  expect(daysSinceEpoch(100, chain)).toEqual(0);
  expect(daysSinceEpoch(0, chain)).toBeCloseTo((100 * 384) / 86400, 6);
  expect(daysSinceEpoch(2 ** 64 - 1, chain)).toBeNull(); // FAR_FUTURE_EPOCH
  expect(daysSinceEpoch(101, chain)).toBeNull();
  expect(daysSinceEpoch(5, null)).toBeNull();
});

test("pubkeys and balances are formatted for the list", () => {
  expect(shortPubkey("0x" + "a".repeat(96))).toEqual("0xaaaaaaaa…aaaaaaaa");
  expect(formatEth(32001000000)).toEqual("32.0010");
  expect(formatEth(undefined)).toEqual("-");
});

test("explorer links point to the network's explorer", () => {
  expect(explorerUrl("hoodi", "0xabc", "123")).toEqual("https://hoodi.beaconcha.in/validator/123");
  expect(explorerUrl("mainnet", "0xabc")).toEqual("https://beaconcha.in/validator/0xabc");
  expect(explorerUrl("gnosis", "0xabc", "5")).toEqual("https://gnosischa.in/validator/5");
  expect(explorerUrl("devnet", "0xabc")).toBeNull();
});

test("aliases follow the staking page rules", () => {
  const aliases = { "0xa": { keyName: "main" }, "0xb": { keyName: "" } };
  expect(aliasError("backup", "0xb", aliases)).toBeNull();
  expect(aliasError("main", "0xa", aliases)).toBeNull(); // its own name
  expect(aliasError("main", "0xb", aliases)).toEqual("taken");
  expect(aliasError("my key", "0xb", aliases)).toEqual("spaces");
  expect(aliasError("x".repeat(31), "0xb", aliases)).toEqual("length");
});

test("fee recipients must be an execution address", () => {
  expect(FEE_RECIPIENT.test("0x" + "aB".repeat(20))).toBe(true);
  expect(FEE_RECIPIENT.test("0x123")).toBe(false);
});

test("CSV quotes every field and survives quotes and commas in aliases", () => {
  const csv = keysToCsv([
    {
      pubkey: "0xa",
      alias: 'main, "first"',
      group: { id: "g1", name: "batch-1" },
      remote: false,
      state: {
        index: "7",
        status: "active_ongoing",
        balance: 32001000000,
        effectiveBalance: 32e9,
        activationEpoch: 10,
        exitEpoch: 2 ** 64 - 1,
        withdrawalCredentials: "0x01ab",
      },
    },
    { pubkey: "0xb", remote: true },
    { pubkey: "0xc", remote: false, bucket: "queued", csm: true },
  ]);
  const lines = csv.trim().split("\n");
  expect(lines[0]).toEqual(
    '"pubkey","alias","group","index","status","balance_eth","effective_balance_eth","activation_epoch","exit_epoch","credentials","remote","lido_csm"'
  );
  expect(lines[1]).toEqual('"0xa","main, ""first""","batch-1","7","active_ongoing","32.001","32","10","","0x01ab","no","no"');
  expect(lines[2]).toEqual('"0xb","","","","not_on_chain","","","","","","yes","no"');
  // a CSM key waiting for its deposit
  expect(lines[3]).toEqual('"0xc","","","","csm_queue","","","","","","no","yes"');
});

test("CSV defuses aliases and group names a spreadsheet would run as a formula", () => {
  const csv = keysToCsv([{ pubkey: "0xa", alias: "=1+2", group: { id: "g", name: "@SUM(A1)" } }]);
  expect(csv.split("\n")[1]).toMatch(/^"0xa","'=1\+2","'@SUM\(A1\)",/);
});

test("only a key without beacon state can be in the CSM queue", () => {
  expect(statusBucket(undefined, true)).toEqual("queued");
  expect(statusBucket(undefined, false)).toEqual("unknown");
  expect(statusBucket({ status: "pending_queued" }, true)).toEqual("pending");
  expect(statusBucket({ status: "active_ongoing" }, true)).toEqual("active");
  expect(STATUS_BUCKETS.indexOf("queued")).toEqual(STATUS_BUCKETS.indexOf("pending") + 1);
});

test("section tabs follow the holder role, shares have no duties", () => {
  expect(holderTabs("validator")).toEqual(["keys", "duties"]);
  expect(holderTabs("signer")).toEqual(["keys", "duties"]);
  expect(holderTabs("distributed")).toEqual(["keys", "duties", "cluster"]);
  expect(holderTabs("ssv")).toEqual(["keys", "duties", "cluster"]);
  expect(holderTabs("share")).toEqual(["keys", "cluster"]);
  expect(holderTabs(undefined)).toEqual(["keys"]);
});

test("CSM queue positions become numbers keyed by lowercased pubkey, junk is dropped", () => {
  const upper = "0x" + "A".repeat(96);
  const other = "0x" + "b".repeat(96);
  expect(
    csmQueueMap([
      { key: upper, queuePosition: 3n },
      { key: other, queuePosition: 0 },
      { key: "0x1234", queuePosition: 1n },
      { key: "0x" + "c".repeat(96) + "; rm -rf /", queuePosition: 1n },
      null,
    ])
  ).toEqual({ ["0x" + "a".repeat(96)]: 3, [other]: 0 });
  expect(csmQueueMap(null)).toEqual({});
});
