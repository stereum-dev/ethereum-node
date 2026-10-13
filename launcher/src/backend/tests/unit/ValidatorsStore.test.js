import { createPinia, setActivePinia } from "pinia";
import { useValidatorsStore } from "@/store/validators";
import { useKeyActions } from "@/components/UI/validators-page/useKeyActions";

jest.mock("@/store/ControlService", () => ({
  __esModule: true,
  default: {
    getValidatorHolders: jest.fn(),
    listHolderKeys: jest.fn(),
    getHolderValidatorStates: jest.fn(),
    readKeys: jest.fn(),
    prepareKeyExit: jest.fn(),
    exitValidatorKeys: jest.fn(),
    exportExitMessages: jest.fn(),
    importValidatorRemoteKeys: jest.fn(),
    writeKeyEntries: jest.fn(),
    getHolderDuties: jest.fn(),
    getHolderRewards: jest.fn(),
    getHolderClusterStats: jest.fn(),
    getCsmKeys: jest.fn(),
  },
}));
const ControlService = require("@/store/ControlService").default;

const KEY = "0x" + "a".repeat(96);

beforeEach(() => {
  setActivePinia(createPinia());
  jest.clearAllMocks();
});

test("the first holder of on-chain keys is opened, not a holder of shares", async () => {
  ControlService.getValidatorHolders.mockResolvedValue([
    { id: "teku", role: "share" },
    { id: "charon", role: "distributed" },
  ]);
  const store = useValidatorsStore();

  await store.loadHolders();

  expect(store.selectedHolderId).toEqual("charon");
});

test("keys are listed once per holder unless forced", async () => {
  ControlService.listHolderKeys.mockResolvedValue({ code: 0, keys: [{ pubkey: KEY, remote: false }] });
  const store = useValidatorsStore();

  await store.loadKeys("lh");
  await store.loadKeys("lh");
  expect(ControlService.listHolderKeys).toHaveBeenCalledTimes(1);

  await store.loadKeys("lh", true);
  expect(ControlService.listHolderKeys).toHaveBeenCalledTimes(2);
});

// A refresh that fails must not blank the list or the stats
test("a failed refresh keeps the keys and stats it had", async () => {
  const store = useValidatorsStore();
  store.holders = [{ id: "lh", role: "validator" }];
  ControlService.listHolderKeys.mockResolvedValueOnce({ code: 0, keys: [{ pubkey: KEY, remote: false }] });
  ControlService.getHolderValidatorStates.mockResolvedValueOnce({ code: 0, byPubkey: { [KEY]: { status: "active_ongoing" } } });
  await store.loadKeys("lh");
  await store.loadStates("lh");

  ControlService.listHolderKeys.mockResolvedValueOnce({ code: 1, info: "Not connected", keys: [] });
  ControlService.getHolderValidatorStates.mockResolvedValueOnce({ code: 1, info: "no beacon node", byPubkey: {} });
  await store.loadKeys("lh", true);
  await store.loadStates("lh");

  expect(store.keysByHolder.lh.keys).toHaveLength(1);
  expect(store.keysByHolder.lh.error).toEqual("Not connected");
  expect(store.statesByHolder.lh.byPubkey[KEY].status).toEqual("active_ongoing");
  expect(store.statesByHolder.lh.error).toEqual("no beacon node");
  expect(store.keysByHolder.lh.loading).toBe(false);
});

test("shares are never sent to the beacon node", async () => {
  const store = useValidatorsStore();
  store.holders = [{ id: "teku", role: "share" }];
  store.keysByHolder.teku = { keys: [{ pubkey: KEY }], loading: false, error: null, loadedAt: 1 };

  await store.loadStates("teku");

  expect(ControlService.getHolderValidatorStates).not.toHaveBeenCalled();
});

describe("exits", () => {
  const KEY2 = "0x" + "b".repeat(96);
  const withKeys = () => {
    const store = useValidatorsStore();
    store.holders = [{ id: "lh", role: "validator" }];
    store.keysByHolder.lh = { keys: [{ pubkey: KEY }, { pubkey: KEY2 }], loading: false, error: null, loadedAt: 1 };
    ControlService.getHolderValidatorStates.mockResolvedValue({ code: 0, byPubkey: { [KEY]: { status: "active_ongoing" } } });
    return store;
  };

  test("submitted exits are remembered, the selection cleared and the states reloaded", async () => {
    const store = withKeys();
    store.selection = { [KEY]: true, [KEY2]: true };
    ControlService.exitValidatorKeys.mockResolvedValue({
      code: 0,
      partial: false,
      results: { [KEY]: { status: "submitted" }, [KEY2]: { status: "rejected", message: "no" } },
    });

    const result = await store.exitKeys("lh", [KEY, KEY2]);

    expect(result.code).toEqual(0);
    expect(Object.keys(store.exitsSent)).toEqual([KEY]);
    expect(store.exitsSent[KEY].partial).toBe(false);
    expect(store.selection).toEqual({});
    expect(ControlService.getHolderValidatorStates).toHaveBeenCalled();
  });

  test("a failed or missing answer becomes code 1", async () => {
    const store = withKeys();
    ControlService.exitValidatorKeys.mockRejectedValueOnce(new Error("ipc down"));
    expect(await store.exitKeys("lh", [KEY])).toEqual({ code: 1, info: "ipc down" });
    ControlService.exitValidatorKeys.mockResolvedValueOnce(undefined);
    expect((await store.exitKeys("lh", [KEY])).code).toEqual(1);
    expect(store.exitsSent).toEqual({});
  });

  test("a sent exit is dropped once the beacon no longer reports the key active", async () => {
    const store = withKeys();
    store.exitsSent = { [KEY]: { at: 1, partial: false }, [KEY2]: { at: 1, partial: false } };
    ControlService.getHolderValidatorStates.mockResolvedValueOnce({
      code: 0,
      byPubkey: { [KEY]: { status: "active_exiting" }, [KEY2]: { status: "active_ongoing" } },
    });

    await store.loadStates("lh");

    expect(Object.keys(store.exitsSent)).toEqual([KEY2]);
  });

  test("the preflight and the export are passed through", async () => {
    const store = withKeys();
    ControlService.prepareKeyExit.mockResolvedValue({ code: 0, eligible: [KEY] });
    ControlService.exportExitMessages.mockResolvedValue({ code: 0, messages: [{ signature: "0x" }], failed: [], skipped: {} });
    expect(await store.prepareExit("lh", [KEY])).toEqual({ code: 0, eligible: [KEY] });
    expect(ControlService.prepareKeyExit).toHaveBeenCalledWith("lh", [KEY]);
    expect((await store.exportExitMessages("lh", [KEY])).messages).toHaveLength(1);
    ControlService.prepareKeyExit.mockRejectedValueOnce(new Error("x"));
    expect((await store.prepareExit("lh", [KEY])).code).toEqual(1);
  });
});

test("exit stays open for unknown and pending keys, and closes once sent or exiting", () => {
  const store = useValidatorsStore();
  store.holders = [{ id: "lh", role: "validator", state: "running" }];
  store.selectedHolderId = "lh";
  const { exitDisabled, exitLabel } = useKeyActions();
  for (const bucket of ["active", "pending", "unknown"]) expect(exitDisabled({ bucket })).toBe(false);
  for (const bucket of ["exiting", "exited", "withdrawn", "slashed"]) expect(exitDisabled({ bucket })).toBe(true);
  expect(exitDisabled({ bucket: "active", exitSent: true })).toBe(true);
  expect(exitLabel({ bucket: "active", exitSent: true })).toEqual("Exit sent");
});

test("a stopped client blocks every action that needs its API and says why", () => {
  const store = useValidatorsStore();
  store.holders = [{ id: "lh", role: "validator", state: "exited" }];
  store.selectedHolderId = "lh";
  const { clientStopped, whenRunning, exitDisabled, exitLabel } = useKeyActions();
  expect(clientStopped.value).toBe(true);
  expect(exitDisabled({ bucket: "active" })).toBe(true);
  expect(exitLabel({ bucket: "active" })).toEqual("Exit (client not running)");
  expect(whenRunning("Remove")).toEqual("Remove (client not running)");
  store.holders[0].state = "running";
  expect([clientStopped.value, whenRunning("Remove"), exitDisabled({ bucket: "active" })]).toEqual([false, "Remove", false]);
});

test("the search finds a key by part of its index", () => {
  const { useHolderRows } = require("@/components/UI/validators-page/useHolderRows");
  const store = useValidatorsStore();
  const OTHER = "0x" + "b".repeat(96);
  store.holders = [{ id: "lh", role: "validator", state: "running" }];
  store.selectedHolderId = "lh";
  store.keysByHolder.lh = { keys: [{ pubkey: KEY }, { pubkey: OTHER }], loading: false };
  store.statesByHolder = { lh: { byPubkey: { [KEY]: { index: "1645300", status: "active_ongoing" }, [OTHER]: { index: "17" } } } };
  const { rows } = useHolderRows();
  store.search = "16453";
  expect(rows.value.map((r) => r.pubkey)).toEqual([KEY]);
  store.search = "1645300";
  expect(rows.value.map((r) => r.pubkey)).toEqual([KEY]);
});

describe("remote key import", () => {
  const W3S = "http://stereum-w3s:9000";
  const withHolder = () => {
    const store = useValidatorsStore();
    store.holders = [{ id: "prysm", role: "validator" }];
    ControlService.getValidatorHolders.mockResolvedValue([{ id: "prysm", role: "validator" }]);
    ControlService.listHolderKeys.mockResolvedValue({ code: 0, keys: [{ pubkey: KEY, remote: true }] });
    ControlService.getHolderValidatorStates.mockResolvedValue({ code: 0, byPubkey: {} });
    return store;
  };

  test("keys are sent as a copy, then listed again with their states", async () => {
    const store = withHolder();
    const pubkeys = [KEY];
    ControlService.importValidatorRemoteKeys.mockResolvedValue({ code: 0, results: [], restarted: false });

    const result = await store.importRemoteKeys("prysm", pubkeys, W3S);

    expect(result.code).toEqual(0);
    const sent = ControlService.importValidatorRemoteKeys.mock.calls[0];
    expect(sent).toEqual(["prysm", [KEY], W3S]);
    expect(sent[1]).not.toBe(pubkeys);
    expect(ControlService.listHolderKeys).toHaveBeenCalledWith("prysm");
    expect(store.keysByHolder.prysm.keys).toHaveLength(1);
    expect(ControlService.getHolderValidatorStates).toHaveBeenCalled();
    expect(ControlService.getValidatorHolders).not.toHaveBeenCalled();
  });

  test("a restarted client reloads the holders", async () => {
    const store = withHolder();
    ControlService.importValidatorRemoteKeys.mockResolvedValue({ code: 0, results: [], restarted: true });
    await store.importRemoteKeys("prysm", [KEY], W3S);
    expect(ControlService.getValidatorHolders).toHaveBeenCalled();
  });

  test("a failed call becomes code 1 and still refreshes the list", async () => {
    const store = withHolder();
    ControlService.importValidatorRemoteKeys.mockRejectedValueOnce(new Error("ipc down"));
    expect(await store.importRemoteKeys("prysm", [KEY], W3S)).toEqual({ code: 1, info: "ipc down" });
    ControlService.importValidatorRemoteKeys.mockResolvedValueOnce(undefined);
    expect(await store.importRemoteKeys("prysm", [KEY], W3S)).toEqual({ code: 1, info: "no answer" });
    expect(ControlService.listHolderKeys).toHaveBeenCalledTimes(2);
  });
});

test("remote import is offered only on a validator client, and enabled while it runs", () => {
  const store = useValidatorsStore();
  store.holders = [
    { id: "lh", role: "validator", state: "running" },
    { id: "teku", role: "share", state: "running" },
    { id: "w3s", role: "signer", state: "running" },
  ];
  const { canImportRemote, holderRunning } = useKeyActions();
  store.selectedHolderId = "lh";
  expect([canImportRemote.value, holderRunning.value]).toEqual([true, true]);
  store.holders[0].state = "exited";
  expect(holderRunning.value).toBe(false);
  for (const id of ["teku", "w3s"]) {
    store.selectedHolderId = id;
    expect(canImportRemote.value).toBe(false);
  }
});

test("a Prysm in remote signer mode gets no keystore import, and one with local keys no remote import", () => {
  const store = useValidatorsStore();
  store.holders = [
    { id: "remote", role: "validator", service: "PrysmValidatorService", state: "running", signerUrl: "http://stereum-w3s:9000" },
    { id: "local", role: "validator", service: "PrysmValidatorService", state: "running", signerUrl: null },
    { id: "lh", role: "validator", service: "LighthouseValidatorService", state: "running" },
  ];
  store.keysByHolder = {
    local: { keys: [{ pubkey: "0x1", remote: false }] },
    lh: { keys: [{ pubkey: "0x2", remote: false }] },
  };
  const { canImport, remoteImportBlock } = useKeyActions();
  store.selectedHolderId = "remote";
  expect([canImport.value, remoteImportBlock.value]).toEqual([false, null]);
  store.selectedHolderId = "local";
  expect(canImport.value).toBe(true);
  expect(remoteImportBlock.value).toEqual(expect.stringContaining("local keys"));
  store.selectedHolderId = "lh";
  expect([canImport.value, remoteImportBlock.value]).toEqual([true, null]);
  store.holders[2].state = "exited";
  expect(remoteImportBlock.value).toEqual(expect.stringContaining("not running"));
});

describe("key groups", () => {
  const KEY2 = "0x" + "b".repeat(96);
  const KEY3 = "0x" + "c".repeat(96);
  const entry = (fields = {}) => ({ keyName: "", groupName: "", groupID: null, validatorClientID: null, ...fields });
  // the backend answers with the merged file
  const answerMerged = (store) =>
    ControlService.writeKeyEntries.mockImplementation(async (patch) => {
      const aliases = { ...store.aliases };
      for (const [pk, fields] of Object.entries(patch)) aliases[pk] = { ...entry(), ...aliases[pk], ...fields };
      return { code: 0, aliases };
    });

  test("a rename sends only the alias", async () => {
    const store = useValidatorsStore();
    answerMerged(store);

    const result = await store.renameKey(KEY, "main");

    expect(ControlService.writeKeyEntries).toHaveBeenCalledWith({ [KEY]: { keyName: "main" } });
    expect(result.code).toEqual(0);
    expect(store.aliases[KEY].keyName).toEqual("main");
  });

  test("a new group gets a fresh id on the selected holder and clears the selection", async () => {
    const uuid = jest.spyOn(global.crypto, "randomUUID").mockReturnValue("uuid-1");
    const store = useValidatorsStore();
    store.selectedHolderId = "lh";
    store.selection = { [KEY]: true, [KEY2]: true };
    const upper = "0x" + "A".repeat(96);
    ControlService.writeKeyEntries.mockResolvedValue({
      code: 0,
      aliases: { [upper]: entry({ groupName: "g", groupID: "uuid-1", validatorClientID: "lh" }) },
    });

    await store.groupKeys([KEY, KEY2], { name: "g" });

    expect(ControlService.writeKeyEntries).toHaveBeenCalledWith({
      [KEY]: { groupName: "g", groupID: "uuid-1", validatorClientID: "lh" },
      [KEY2]: { groupName: "g", groupID: "uuid-1", validatorClientID: "lh" },
    });
    // the answer is adopted with lowercased pubkeys
    expect(store.aliases[KEY].groupID).toEqual("uuid-1");
    expect(store.selection).toEqual({});
    uuid.mockRestore();
  });

  test("joining an existing group keeps its id and name", async () => {
    const store = useValidatorsStore();
    store.selectedHolderId = "lh";
    answerMerged(store);

    await store.groupKeys([KEY3], { id: "id1", name: "g" });

    expect(ControlService.writeKeyEntries).toHaveBeenCalledWith({ [KEY3]: { groupName: "g", groupID: "id1", validatorClientID: "lh" } });
  });

  test("a group is renamed and removed as a whole, and its filter reset", async () => {
    const store = useValidatorsStore();
    store.aliases = {
      [KEY]: entry({ keyName: "a", groupName: "g", groupID: "id1", validatorClientID: "lh" }),
      [KEY2]: entry({ groupName: "g", groupID: "id1", validatorClientID: "lh" }),
      [KEY3]: entry({ groupName: "h", groupID: "id2", validatorClientID: "lh" }),
    };
    store.groupFilter = "id1";
    answerMerged(store);

    await store.renameGroup("id1", "x");
    expect(ControlService.writeKeyEntries).toHaveBeenLastCalledWith({ [KEY]: { groupName: "x" }, [KEY2]: { groupName: "x" } });

    await store.removeGroup("id1");
    expect(ControlService.writeKeyEntries).toHaveBeenLastCalledWith({
      [KEY]: { groupName: "", groupID: null, validatorClientID: null },
      [KEY2]: { groupName: "", groupID: null, validatorClientID: null },
    });
    expect(store.groupFilter).toEqual("all");
    expect(store.aliases[KEY].keyName).toEqual("a");
  });

  test("a failed write keeps the aliases and returns the result", async () => {
    const store = useValidatorsStore();
    store.selectedHolderId = "lh";
    store.selection = { [KEY]: true };
    store.aliases = { [KEY]: entry({ keyName: "a" }) };
    ControlService.writeKeyEntries.mockResolvedValueOnce({ code: 1, info: "disk full" });

    const result = await store.groupKeys([KEY], { id: "id1", name: "g" });

    expect(result).toEqual({ code: 1, info: "disk full" });
    expect(store.aliases).toEqual({ [KEY]: entry({ keyName: "a" }) });
    expect(store.selection).toEqual({ [KEY]: true });

    ControlService.writeKeyEntries.mockRejectedValueOnce(new Error("ipc gone"));
    expect(await store.renameKey(KEY, "b")).toEqual({ code: 1, info: "ipc gone" });
  });
});

describe("duties, rewards, clusters and CSM", () => {
  const active = { [KEY]: { index: "5", status: "active_ongoing", effectiveBalance: 32e9 } };
  const withHolder = (role = "validator") => {
    const store = useValidatorsStore();
    store.holders = [{ id: "lh", role }];
    store.statesByHolder.lh = { byPubkey: active, chain: null, loading: false, error: null };
    return store;
  };
  const deferred = () => {
    let resolve;
    const promise = new Promise((r) => (resolve = r));
    return { promise, resolve };
  };
  const duties = { code: 0, epoch: 100, slotsPerEpoch: 32, sync: { current: ["5"], next: [], nextPeriodStart: 256 }, proposals: [] };

  test("duties are not asked twice at once, and a failure keeps the previous ones", async () => {
    const store = withHolder();
    const first = deferred();
    ControlService.getHolderDuties.mockReturnValueOnce(first.promise);

    const a = store.loadDuties("lh");
    expect(await store.loadDuties("lh")).toBeNull();
    first.resolve(duties);
    await a;
    expect(ControlService.getHolderDuties).toHaveBeenCalledTimes(1);
    expect(ControlService.getHolderDuties).toHaveBeenCalledWith("lh", ["5"]);
    expect(store.dutiesByHolder.lh.data.epoch).toEqual(100);

    ControlService.getHolderDuties.mockResolvedValueOnce({ code: 2, info: "no head" });
    await store.loadDuties("lh");
    expect(store.dutiesByHolder.lh.data.epoch).toEqual(100);
    expect(store.dutiesByHolder.lh.error).toEqual("no head");

    ControlService.getHolderDuties.mockRejectedValueOnce(new Error("ipc down"));
    await store.loadDuties("lh");
    expect(store.dutiesByHolder.lh.data.epoch).toEqual(100);
    expect(store.dutiesByHolder.lh.loading).toBe(false);
  });

  // the epoch of a late attestation reward may predate the page; without committee membership its sync reward is 0
  test("a row that only the attestation reward created gets a sync reward of 0 outside the committee", async () => {
    const store = withHolder();
    store.dutiesByHolder.lh = { data: { ...duties, sync: { ...duties.sync, current: [] } }, loading: false, error: null, loadedAt: 1 };
    ControlService.getHolderRewards.mockResolvedValueOnce({
      code: 0,
      attestation: { epoch: 97, total: 40, ideal: 40, effectiveness: 1, missed: [], missedCount: 0 },
      blocks: [],
      unsupported: {},
    });
    await store.loadRewards("lh", { epoch: 99, attestationEpoch: 97 });
    expect(store.rewardsByHolder.lh.history.find((r) => r.epoch === 97)).toEqual({ epoch: 97, attestation: 40, sync: 0 });
  });

  test("shares never ask for duties", async () => {
    const store = withHolder("share");
    expect(await store.loadDuties("lh")).toBeNull();
    expect(ControlService.getHolderDuties).not.toHaveBeenCalled();
  });

  test("rewards are merged into the history as their parts arrive", async () => {
    const store = withHolder();
    store.dutiesByHolder.lh = { data: duties, loading: false, error: null, loadedAt: 1 };
    ControlService.getHolderRewards.mockResolvedValueOnce({
      code: 0,
      attestation: { epoch: 97, total: 40, ideal: 40, effectiveness: 1, missed: [], missedCount: 0 },
      sync: { epoch: 99, total: 93, missedCount: 0 },
      blocks: [{ slot: 99 * 32 + 3, index: "5", result: "proposed", reward: 1000 }],
      unsupported: { attestation: false, sync: false, block: false },
    });

    await store.loadRewards("lh", { epoch: 99, attestationEpoch: 97, proposals: [{ slot: 99 * 32 + 3, index: "5", pubkey: KEY }] });

    expect(ControlService.getHolderRewards).toHaveBeenCalledWith("lh", {
      indices: ["5"],
      attestationEpoch: 97,
      epoch: 99,
      syncIndices: ["5"],
      proposals: [{ slot: 99 * 32 + 3, index: "5" }],
      effectiveBalances: { 5: 32e9 },
    });
    const entry = store.rewardsByHolder.lh;
    expect(entry.history).toEqual([
      { epoch: 99, sync: 93, block: 1000 },
      { epoch: 97, attestation: 40 },
    ]);
    expect(entry.proposals[99 * 32 + 3]).toEqual({ result: "proposed", reward: 1000 });
    expect(entry.accountedEpoch).toEqual(99);

    // the next epoch fills in the attestation of epoch 99 later on, a failure keeps everything
    ControlService.getHolderRewards.mockResolvedValueOnce({
      code: 0,
      attestation: { epoch: 99, total: 38, ideal: 40, effectiveness: 0.95, missed: [], missedCount: 0 },
      sync: { epoch: 100, total: 90, missedCount: 1 },
      blocks: [],
      unsupported: {},
    });
    await store.loadRewards("lh", { epoch: 100, attestationEpoch: 99 });
    expect(entry.history[1]).toEqual({ epoch: 99, sync: 93, block: 1000, attestation: 38 });
    ControlService.getHolderRewards.mockResolvedValueOnce({ code: 1, info: "beacon down" });
    await store.loadRewards("lh", { epoch: 101, attestationEpoch: 99 });
    expect(entry.history).toHaveLength(3);
    expect(entry.accountedEpoch).toEqual(100);
    expect(entry.error).toEqual("beacon down");
  });

  test("a block without a known outcome leaves the epoch's block reward open until it arrives", async () => {
    const store = withHolder();
    const slot = 99 * 32 + 3;
    store.dutiesByHolder.lh = { data: { ...duties, proposals: [{ slot, index: "5", pubkey: KEY }] }, loading: false, error: null };
    // the head was still behind the slot, so the backend had no outcome yet
    ControlService.getHolderRewards.mockResolvedValueOnce({ code: 0, sync: null, blocks: [], unsupported: {} });
    await store.loadRewards("lh", { epoch: 99, proposals: [{ slot, index: "5" }] });
    const entry = store.rewardsByHolder.lh;
    expect(entry.history[0].epoch).toEqual(99);
    expect(entry.history[0].block).toBeUndefined();

    ControlService.getHolderRewards.mockResolvedValueOnce({ code: 0, blocks: [{ slot, index: "5", result: "proposed", reward: 700 }] });
    await store.loadRewards("lh", { proposals: [{ slot, index: "5" }] });
    expect(entry.history[0]).toMatchObject({ epoch: 99, block: 700 });
    expect(entry.accountedEpoch).toEqual(99);
  });

  test("sync rewards of the last epoch of a period use that period's committee", async () => {
    const store = withHolder();
    const sync = { current: ["6"], next: [], periodStart: 256, nextPeriodStart: 512 };
    store.dutiesByHolder.lh = { data: { ...duties, epoch: 256, sync }, previousSync: null, loading: false, error: null };
    ControlService.getHolderRewards.mockResolvedValue({ code: 0, sync: null, blocks: [], unsupported: {} });

    // the committee of epoch 255 is unknown, so its sync reward is not taken as 0
    await store.loadRewards("lh", { epoch: 255 });
    expect(ControlService.getHolderRewards.mock.calls[0][1].syncIndices).toEqual([]);
    expect(store.rewardsByHolder.lh.history[0]).toEqual({ epoch: 255, block: 0 });

    store.dutiesByHolder.lh.previousSync = { current: ["5"], next: ["6"], periodStart: 0, nextPeriodStart: 256 };
    await store.loadRewards("lh", { epoch: 255 });
    expect(ControlService.getHolderRewards.mock.calls[1][1].syncIndices).toEqual(["5"]);
    await store.loadRewards("lh", { epoch: 256 });
    expect(ControlService.getHolderRewards.mock.calls[2][1].syncIndices).toEqual(["6"]);
    ControlService.getHolderRewards.mockReset();
  });

  test("a new sync period keeps the committee of the one before", async () => {
    const store = withHolder();
    const first = { ...duties, epoch: 255, sync: { current: ["5"], next: ["6"], periodStart: 0, nextPeriodStart: 256 } };
    const second = { ...duties, epoch: 256, sync: { current: ["6"], next: [], periodStart: 256, nextPeriodStart: 512 } };
    ControlService.getHolderDuties.mockResolvedValueOnce(first).mockResolvedValueOnce(second).mockResolvedValueOnce(second);
    await store.loadDuties("lh");
    expect(store.dutiesByHolder.lh.previousSync).toBeNull();
    await store.loadDuties("lh");
    expect(store.dutiesByHolder.lh.previousSync).toEqual(first.sync);
    await store.loadDuties("lh");
    expect(store.dutiesByHolder.lh.previousSync).toEqual(first.sync);
  });

  test("a rewards load while another runs is skipped", async () => {
    const store = withHolder();
    const first = deferred();
    ControlService.getHolderRewards.mockReturnValueOnce(first.promise);
    const a = store.loadRewards("lh", { epoch: 99, attestationEpoch: 97 });
    expect(await store.loadRewards("lh", { proposals: [{ slot: 1, index: "5" }] })).toBeNull();
    first.resolve({ code: 0, blocks: [], unsupported: {} });
    await a;
    expect(ControlService.getHolderRewards).toHaveBeenCalledTimes(1);
  });

  test("cluster stats are not asked twice at once, and a failure keeps the previous ones", async () => {
    const store = withHolder("distributed");
    const first = deferred();
    ControlService.getHolderClusterStats.mockReturnValueOnce(first.promise);

    const a = store.loadClusterStats("lh");
    await store.loadClusterStats("lh");
    first.resolve({ code: 0, kind: "obol", service: "CharonService", stats: { operators: 4 }, empty: false });
    await a;
    expect(ControlService.getHolderClusterStats).toHaveBeenCalledTimes(1);
    expect(store.clustersByHolder.lh.stats).toEqual({ operators: 4 });

    ControlService.getHolderClusterStats.mockResolvedValueOnce({ code: 1, info: "SSV API down" });
    await store.loadClusterStats("lh");
    expect(store.clustersByHolder.lh.stats).toEqual({ operators: 4 });
    expect(store.clustersByHolder.lh.error).toEqual("SSV API down");
  });

  test("CSM keys are kept when a later lookup fails", async () => {
    const store = useValidatorsStore();
    ControlService.getCsmKeys.mockResolvedValueOnce({ code: 0, installed: true, keys: { [KEY]: 3 } });
    await store.loadCsmKeys();
    expect(store.csm).toMatchObject({ installed: true, keys: { [KEY]: 3 }, error: null });

    ControlService.getCsmKeys.mockResolvedValueOnce({ code: 1, installed: true, info: "node syncing" });
    await store.loadCsmKeys(true);
    expect(ControlService.getCsmKeys).toHaveBeenLastCalledWith(true);
    expect(store.csm).toMatchObject({ installed: true, keys: { [KEY]: 3 }, error: "node syncing", loading: false });

    // another visit counts the keys as unconfirmed until they are read again
    store.unconfirmCsm(true);
    expect(store.csm).toMatchObject({ installed: true, keys: { [KEY]: 3 }, error: null, loadedAt: null });

    // a node without LCOM has no CSM keys
    ControlService.getCsmKeys.mockResolvedValueOnce({ code: 0, installed: false, keys: {} });
    await store.loadCsmKeys();
    expect(store.csm).toMatchObject({ installed: false, keys: {}, error: null });
  });
});

test("a CSM key without beacon state counts as queued only while it waits in the queue", () => {
  const { useHolderRows } = require("@/components/UI/validators-page/useHolderRows");
  const store = useValidatorsStore();
  const OTHER = "0x" + "b".repeat(96);
  const PLAIN = "0x" + "d".repeat(96);
  store.holders = [{ id: "lh", role: "validator" }];
  store.selectedHolderId = "lh";
  store.keysByHolder.lh = { keys: [{ pubkey: KEY }, { pubkey: OTHER }, { pubkey: PLAIN }], loading: false };
  store.csm.keys = { [KEY]: 4, [OTHER]: 0 };

  const { allRows, counts } = useHolderRows();

  expect(allRows.value.map((r) => [r.bucket, r.csm])).toEqual([
    ["queued", true],
    ["unknown", true],
    ["unknown", false],
  ]);
  expect(counts.value.queued).toEqual(1);
});

// Electron's IPC cannot clone Vue proxies ("An object could not be cloned"), and the mocked
// ControlService would accept them, so the arguments are checked to be plain data
describe("IPC arguments are plain data", () => {
  const { isProxy } = require("vue");
  const anyProxy = (value) => isProxy(value) || (value && typeof value === "object" && Object.values(value).some(anyProxy));

  test("the rewards request does not carry the reactive sync committee", async () => {
    const store = useValidatorsStore();
    store.holders = [{ id: "lh", role: "validator" }];
    store.statesByHolder.lh = { byPubkey: { [KEY]: { index: "7", status: "active_ongoing", effectiveBalance: 32e9 } } };
    store.dutiesByHolder.lh = {
      data: { slotsPerEpoch: 32, sync: { current: ["7"], next: [], periodStart: 100, nextPeriodStart: 356 } },
      previousSync: null,
    };
    ControlService.getHolderRewards.mockResolvedValue({ code: 1, info: "stop" });

    await store.loadRewards("lh", { epoch: 120, attestationEpoch: 119 });

    const request = ControlService.getHolderRewards.mock.calls[0][1];
    expect(request.syncIndices).toEqual(["7"]);
    expect(anyProxy(request)).toBe(false);
  });

  test("a group rename patch built from the aliases is sent as plain data", async () => {
    const store = useValidatorsStore();
    store.aliases = { [KEY]: { keyName: "a", groupName: "old", groupID: "g1", validatorClientID: "lh" } };
    ControlService.writeKeyEntries.mockResolvedValue({ code: 0, keys: {} });

    await store.renameGroup("g1", "new");

    expect(anyProxy(ControlService.writeKeyEntries.mock.calls[0][0])).toBe(false);
  });
});
