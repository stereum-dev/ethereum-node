import { exitBlocker, beaconBlocker, checkSignedExit, exitConfirmToken, exitMessagesFile, exitFileName } from "@/share/exits";

const SIG = "0x" + "ab".repeat(96);
const KEY = (n) => "0x" + String(n).padStart(96, "a");
const active = (activationEpoch) => ({ status: "active_ongoing", activationEpoch, slashed: false });

describe("exitBlocker", () => {
  test("an active key may exit once the shard committee period has passed", () => {
    expect(exitBlocker(active(100), 356, 256)).toBeNull();
    expect(exitBlocker(active(100), 400, 256)).toBeNull();
  });

  test("a key active for less than the period is too young, with the epoch it becomes eligible", () => {
    expect(exitBlocker(active(100), 355, 256)).toEqual({ reason: "tooYoung", eligibleEpoch: 356 });
  });

  test("keys that are not active ongoing are blocked by their status", () => {
    expect(exitBlocker({ status: "active_exiting" }, 1000, 256)).toEqual({ reason: "exiting" });
    expect(exitBlocker({ status: "exited_unslashed" }, 1000, 256)).toEqual({ reason: "exited" });
    expect(exitBlocker({ status: "withdrawal_possible" }, 1000, 256)).toEqual({ reason: "exited" });
    expect(exitBlocker({ status: "withdrawal_done" }, 1000, 256)).toEqual({ reason: "exited" });
    expect(exitBlocker({ status: "active_slashed" }, 1000, 256)).toEqual({ reason: "slashed" });
    expect(exitBlocker({ status: "exited_slashed" }, 1000, 256)).toEqual({ reason: "slashed" });
    expect(exitBlocker({ ...active(1), slashed: true }, 1000, 256)).toEqual({ reason: "slashed" });
    expect(exitBlocker({ status: "pending_initialized" }, 1000, 256)).toEqual({ reason: "pending" });
    expect(exitBlocker({ status: "pending_queued" }, 1000, 256)).toEqual({ reason: "pending" });
    expect(exitBlocker(undefined, 1000, 256)).toEqual({ reason: "notOnChain" });
  });
});

describe("beaconBlocker", () => {
  test("a synced beacon node with its execution client online does not block", () => {
    expect(beaconBlocker({ is_syncing: false, is_optimistic: false, el_offline: false })).toBeNull();
    expect(beaconBlocker({ is_syncing: "false", is_optimistic: "false", el_offline: "false" })).toBeNull();
  });

  test("syncing, optimistic, offline execution client and no answer block", () => {
    expect(beaconBlocker({ is_syncing: true })).toEqual("syncing");
    expect(beaconBlocker({ is_syncing: "true" })).toEqual("syncing");
    expect(beaconBlocker({ is_syncing: false, is_optimistic: true })).toEqual("optimistic");
    expect(beaconBlocker({ is_syncing: false, el_offline: "true" })).toEqual("elOffline");
    expect(beaconBlocker(null)).toEqual("unreachable");
  });

  // Prysm with a stopped Besu: all flags false while the head falls behind (12 slots after ~2 minutes)
  test("a head that falls behind the clock blocks, small gaps from missed blocks do not", () => {
    const healthy = { is_syncing: false, is_optimistic: false, el_offline: false };
    expect(beaconBlocker({ ...healthy, sync_distance: "3" })).toBeNull();
    expect(beaconBlocker({ ...healthy, sync_distance: "16" })).toBeNull();
    expect(beaconBlocker({ ...healthy, sync_distance: "17" })).toEqual("behind");
    expect(beaconBlocker({ ...healthy, sync_distance: 40 })).toEqual("behind");
  });
});

describe("checkSignedExit", () => {
  const answer = (message, signature = SIG) => ({ data: { message, signature, extra: "x" }, more: 1 });

  test("a valid answer is normalized and extra fields are dropped", () => {
    expect(checkSignedExit(answer({ epoch: 12, validator_index: "7", foo: "bar" }), 7)).toEqual({
      message: { epoch: "12", validator_index: "7" },
      signature: SIG,
    });
    expect(checkSignedExit(answer({ epoch: "0", validator_index: "7" }), null)).not.toBeNull();
  });

  test("anything off is rejected", () => {
    expect(checkSignedExit(answer({ epoch: "1", validator_index: "8" }), 7)).toBeNull();
    expect(checkSignedExit(answer({ epoch: "1", validator_index: "7" }, "0x" + "ab".repeat(95)), 7)).toBeNull();
    expect(checkSignedExit(answer({ epoch: "1", validator_index: "7" }, "0x" + "zz".repeat(96)), 7)).toBeNull();
    expect(checkSignedExit(answer({ epoch: "-1", validator_index: "7" }), 7)).toBeNull();
    expect(checkSignedExit(answer({ epoch: "1.5", validator_index: "7" }), 7)).toBeNull();
    expect(checkSignedExit({ message: "error" }, 7)).toBeNull();
    expect(checkSignedExit(answer({ epoch: "1; rm -rf /", validator_index: "7" }), 7)).toBeNull();
    expect(checkSignedExit(answer({ epoch: "1", validator_index: "1; rm" }), null)).toBeNull();
  });
});

test("the confirmation token is the index of one key, or exit N for several", () => {
  expect(exitConfirmToken([KEY(1)], { [KEY(1)]: "42" })).toEqual("42");
  expect(exitConfirmToken([KEY(1), KEY(2)], { [KEY(1)]: "42", [KEY(2)]: "43" })).toEqual("exit 2");
});

test("one exit message is saved as an object, several as an array", () => {
  const msg = (i) => ({ message: { epoch: "1", validator_index: String(i) }, signature: SIG });
  expect(JSON.parse(exitMessagesFile([msg(1)]))).toEqual(msg(1));
  expect(JSON.parse(exitMessagesFile([msg(1), msg(2)]))).toEqual([msg(1), msg(2)]);
});

test("the export file is named by client, network and time", () => {
  const date = new Date("2026-10-08T12:00:00Z");
  expect(exitFileName("LighthouseValidatorService", "hoodi", date)).toEqual("exit-messages-lighthouse-hoodi-2026-10-08-12-00-00.json");
});
