import { Validators } from "../../Validators";
import { getSigningKeysWithQueueInfo } from "../../web3/CSM.js";

// web3 cannot load under jsdom, and the CSM lookup opens RPC tunnels
jest.mock("../../web3/CSM.js", () => ({ getSigningKeysWithQueueInfo: jest.fn() }));

const info = (service, serviceID, consensusClients = []) => ({
  service,
  state: "running",
  config: { serviceID, network: "hoodi", dependencies: { consensusClients } },
});
const key = (n) => "0x" + String(n).padStart(96, "a");

describe("holder classification", () => {
  test("every key-holding service becomes a holder with its role", () => {
    const holders = Validators.classifyHolders([
      info("LighthouseValidatorService", "lh", [{ service: "LighthouseBeaconService", id: "beacon" }]),
      info("TekuValidatorService", "teku", [{ service: "CharonService", id: "charon" }]),
      info("CharonService", "charon", [{ service: "TekuBeaconService", id: "beacon" }]),
      info("SSVNetworkService", "ssv"),
      info("Web3SignerService", "w3s"),
      info("GethService", "geth"),
      info("ValidatorEjectorService", "ejector"),
    ]);

    expect(holders.map((h) => [h.id, h.role])).toEqual([
      ["lh", "validator"],
      ["teku", "share"],
      ["charon", "distributed"],
      ["ssv", "ssv"],
      ["w3s", "signer"],
    ]);
    // a VC behind Charon points at the holder of the distributed keys
    expect(holders[1].dvtVia).toEqual("charon");
  });
});

describe("validator states", () => {
  const validatorsWith = (stdout, rc = 0) => {
    const exec = jest.fn().mockResolvedValue({ rc, stdout, stderr: "" });
    const v = new Validators({ nodeConnection: { sshService: { execShared: exec } } });
    v.findHolderBeacon = jest.fn().mockResolvedValue({ code: 0, data: { url: "http://127.0.0.1:5051", source: "local" } });
    v.getSpec = jest.fn().mockResolvedValue({ slotsPerEpoch: 32, secondsPerSlot: 12 });
    return { v, exec };
  };
  const answer = (...validators) =>
    JSON.stringify({
      data: validators.map(([pubkey, index, status]) => ({
        index: String(index),
        status,
        balance: "32001000000",
        validator: {
          pubkey,
          effective_balance: "32000000000",
          slashed: false,
          withdrawal_credentials: "0x01",
          activation_epoch: "100",
          exit_epoch: "18446744073709551615",
          withdrawable_epoch: "18446744073709551615",
        },
      })),
    });
  const M = "\n=====STEREUM_VALIDATOR_STATES\n";

  test("all chunks go out in one exec and keys the beacon does not know are left out", async () => {
    const keys = Array.from({ length: 600 }, (_, i) => key(i));
    const stdout =
      JSON.stringify({ data: { header: { message: { slot: "3200" } } } }) +
      M +
      answer([keys[0], 1, "active_ongoing"]) +
      M +
      answer([keys[599], 2, "pending_queued"]) +
      M;
    const { v, exec } = validatorsWith(stdout);

    const result = await v.getValidatorStates(keys, "lh");

    expect(exec).toHaveBeenCalledTimes(1);
    expect(exec.mock.calls[0][0].match(/states\/head\/validators/g)).toHaveLength(2); // 600 keys, chunks of 500
    expect(result.code).toEqual(0);
    expect(Object.keys(result.byPubkey)).toEqual([keys[0], keys[599]]);
    expect(result.byPubkey[keys[0]]).toMatchObject({ index: "1", status: "active_ongoing", balance: 32001000000, activationEpoch: 100 });
    expect(result.headSlot).toEqual(3200);
    expect(result.genesisTime).toEqual(null);
  });

  test("anything that is not a public key is never put into the command", async () => {
    const { v, exec } = validatorsWith(JSON.stringify({ data: {} }) + M + answer() + M);

    await v.getValidatorStates([key(1), "0x1234'; rm -rf /", "not a key"], "lh");

    expect(exec.mock.calls[0][0]).not.toContain("rm -rf");
    expect(exec.mock.calls[0][0]).toContain(key(1));
  });

  test("a beacon node that does not answer is a failure, so the page keeps its stats", async () => {
    const { v } = validatorsWith("", 7);
    expect((await v.getValidatorStates([key(1)], "lh")).code).not.toEqual(0);

    const { v: v2 } = validatorsWith("{}" + M + "<html>bad gateway</html>" + M);
    expect((await v2.getValidatorStates([key(1)], "lh")).code).not.toEqual(0);
  });

  test("keys that are not on chain yet are an answer, not a failure", async () => {
    const { v } = validatorsWith("{}" + M + JSON.stringify({ code: 404, message: "not found" }) + M);
    const result = await v.getValidatorStates([key(1)], "lh");
    expect(result.code).toEqual(0);
    expect(result.byPubkey).toEqual({});
  });
});

describe("key listing", () => {
  test("Charon lists the cluster's distributed keys, not shares", async () => {
    const monitoring = {
      nodeConnection: {},
      getServiceInfos: jest.fn().mockResolvedValue([info("CharonService", "charon")]),
      validatorAccountManager: {
        getDVTKeys: jest.fn().mockResolvedValue([{ distributed_public_key: key(7).toUpperCase().replace("0X", "0x") }]),
      },
    };
    const result = await new Validators(monitoring).listHolderKeys("charon");
    expect(result).toEqual({ code: 0, keys: [{ pubkey: key(7), remote: false }] });
  });

  test("a validator client lists its keystores and remote keys once each", async () => {
    const keymanagerAPI = jest
      .fn()
      .mockResolvedValueOnce({ rc: 0, stdout: JSON.stringify({ data: [{ validating_pubkey: key(1), readonly: false }] }) })
      .mockResolvedValueOnce({ rc: 0, stdout: JSON.stringify({ data: [{ pubkey: key(1) }, { pubkey: key(2) }] }) });
    const monitoring = {
      nodeConnection: { readServiceConfiguration: jest.fn().mockResolvedValue({ id: "lh", service: "LighthouseValidatorService" }) },
      getServiceInfos: jest.fn().mockResolvedValue([info("LighthouseValidatorService", "lh")]),
      validatorAccountManager: { keymanagerAPI },
    };
    const result = await new Validators(monitoring).listHolderKeys("lh");
    expect(result.keys).toEqual([
      { pubkey: key(1), remote: false },
      { pubkey: key(2), remote: true },
    ]);
  });

  test("a failed listing is reported, not thrown", async () => {
    const monitoring = {
      nodeConnection: { readServiceConfiguration: jest.fn().mockRejectedValue(new Error("Not connected")) },
      getServiceInfos: jest.fn().mockResolvedValue([info("LighthouseValidatorService", "lh")]),
      validatorAccountManager: {},
    };
    const result = await new Validators(monitoring).listHolderKeys("lh");
    expect(result.code).toEqual(1);
    expect(result.keys).toEqual([]);
  });

  describe("task panel", () => {
    const lister = (answers) => {
      const taskManager = { otherTasksHandler: jest.fn() };
      const keymanagerAPI = jest.fn();
      answers.forEach((a) => keymanagerAPI.mockResolvedValueOnce(a));
      const monitoring = {
        nodeConnection: {
          taskManager,
          readServiceConfiguration: jest.fn().mockResolvedValue({ id: "lh", service: "LighthouseValidatorService" }),
        },
        getServiceInfos: jest.fn().mockResolvedValue([info("LighthouseValidatorService", "lh")]),
        validatorAccountManager: { keymanagerAPI },
      };
      return { v: new Validators(monitoring), calls: () => taskManager.otherTasksHandler.mock.calls };
    };

    test("the page's listing shows every answer, then the result", async () => {
      const keystores = { data: [{ validating_pubkey: key(1), readonly: false }] };
      const { v, calls } = lister([
        { rc: 0, stdout: JSON.stringify(keystores) },
        { rc: 0, stdout: JSON.stringify({ data: [] }) },
      ]);

      await v.listHolderKeys("lh", { report: true });

      expect(calls().map((c) => [c[1], c[2]])).toEqual([
        ["Listing Keys", undefined],
        ["GET /eth/v1/keystores", true],
        ["GET /eth/v1/remotekeys", true],
        ["Result", true],
        [undefined, undefined],
      ]);
      expect(calls()[1][3]).toEqual(
        "GET http://stereum-lh:5062/eth/v1/keystores\ncurl exit 0\nanswer:\n" + JSON.stringify(keystores, null, 2)
      );
      expect(calls()[3][3]).toEqual("1 keys: 1 local, 0 remote");
    });

    test("a stopped client's failure is shown with curl's reason and the raw answer", async () => {
      const { v, calls } = lister([{ rc: 6, stdout: "", stderr: "" }]);

      const result = await v.listHolderKeys("lh", { report: true });

      expect(result.info).toEqual("keymanager /eth/v1/keystores failed: host not found");
      const failed = calls().find((c) => c[1] === "GET /eth/v1/keystores");
      expect(failed[2]).toBe(false);
      expect(failed[3]).toContain("curl exit 6 (host not found)");
      expect(failed[3]).toContain("answer:\n(empty)");
      expect(calls().at(-2)).toEqual([expect.any(String), "Result", false, result.info]);
      expect(calls().at(-1)).toHaveLength(1);
    });

    test("a Prysm without wallet lists no keys and says the import creates it, without failing", async () => {
      const taskManager = { otherTasksHandler: jest.fn() };
      const keymanagerAPI = jest.fn().mockResolvedValue({
        rc: 0,
        stdout: JSON.stringify({ message: "Prysm Wallet not initialized. Please create a new wallet.", code: 503 }),
      });
      const monitoring = {
        nodeConnection: {
          taskManager,
          readServiceConfiguration: jest.fn().mockResolvedValue({ id: "prysm", service: "PrysmValidatorService", command: [] }),
        },
        getServiceInfos: jest.fn().mockResolvedValue([info("PrysmValidatorService", "prysm")]),
        validatorAccountManager: { keymanagerAPI },
      };

      const result = await new Validators(monitoring).listHolderKeys("prysm", { report: true });

      expect(result).toEqual({ code: 0, keys: [], walletMissing: true });
      const calls = taskManager.otherTasksHandler.mock.calls;
      expect(calls.map((c) => [c[1], c[2]])).toEqual([
        ["Listing Keys", undefined],
        ["GET /eth/v1/keystores", true],
        ["Result", true],
        [undefined, undefined],
      ]);
      expect(calls[1][3]).toContain("no wallet yet: Stereum creates it with the first import");
      expect(calls[2][3]).toEqual("0 keys: Prysm has no wallet yet, the first import creates it");
    });

    test("listings inside other tasks add no entry of their own", async () => {
      const { v, calls } = lister([
        { rc: 0, stdout: JSON.stringify({ data: [] }) },
        { rc: 0, stdout: JSON.stringify({ data: [] }) },
      ]);
      await v.listHolderKeys("lh");
      expect(calls()).toEqual([]);
    });
  });
});

describe("per-key settings", () => {
  const withBatch = (statuses) => {
    const taskManager = { otherTasksHandler: jest.fn() };
    const v = new Validators({ nodeConnection: { taskManager } });
    v.keymanagerCalls = jest.fn(async (id, requests) =>
      requests.map((r, i) => ({
        status: statuses[i],
        body: statuses[i] === 400 ? { message: "bad graffiti" } : null,
        raw: "",
        method: r.method,
        url: "http://stereum-lh:7500" + r.path,
      }))
    );
    v.taskManager = taskManager;
    v.graffitiFileOf = jest.fn().mockResolvedValue(null);
    return v;
  };

  test("each key is reported as set or failed by its own status", async () => {
    const v = withBatch([202, 400]);
    const result = await v.setKeySetting("lh", [key(1), key(2)], "graffiti", "stereum");
    expect(v.keymanagerCalls).toHaveBeenCalledWith("lh", [
      { method: "POST", path: `/eth/v1/validator/${key(1)}/graffiti`, body: { graffiti: "stereum" } },
      { method: "POST", path: `/eth/v1/validator/${key(2)}/graffiti`, body: { graffiti: "stereum" } },
    ]);
    expect(result).toEqual({ code: 0, ok: [key(1)], failed: [key(2)] });

    // the panel shows every key's answer, the rejection with the client's own message
    const [, name, ok, data] = v.taskManager.otherTasksHandler.mock.calls[1];
    expect(name).toEqual("Applied to 1 of 2");
    expect(ok).toBe(false);
    expect(data).toContain("POST http://stereum-lh:7500/eth/v1/validator/{pubkey}/graffiti");
    expect(data).toContain(`${key(1)}: HTTP 202`);
    expect(data).toContain(`${key(2)}: HTTP 400, answer: {"message":"bad graffiti"}`);
  });

  test("the current values of many keys are read in one batched call and reported per key", async () => {
    const taskManager = { otherTasksHandler: jest.fn() };
    const v = new Validators({ nodeConnection: { taskManager } });
    v.keymanagerCalls = jest.fn(async (id, requests) =>
      requests.map((r, i) =>
        i === 2
          ? { status: 500, body: { message: "internal error" }, raw: "", url: "http://stereum-lh:7500" + r.path }
          : { status: 200, body: { data: { ethaddress: i ? "0xB" : "0xA" } }, raw: "", url: "http://stereum-lh:7500" + r.path }
      )
    );

    const result = await v.readKeySettings("lh", [key(1), key(2), key(3), "nope"], "feerecipient");

    expect(v.keymanagerCalls.mock.calls[0][1]).toEqual(
      [key(1), key(2), key(3)].map((k) => ({ method: "GET", path: `/eth/v1/validator/${k}/feerecipient` }))
    );
    expect(result).toEqual({
      code: 0,
      values: { [key(1)]: "0xA", [key(2)]: "0xB" },
      failed: { [key(3)]: "internal error" },
      defaultUnknown: [],
    });
    const names = taskManager.otherTasksHandler.mock.calls.map((c) => c[1]);
    expect(names).toEqual(["Read fee recipient (3)", "Read 2 of 3", "Result", undefined]);
    // short enough for the task panel, which wraps longer names
    expect(names.filter(Boolean).every((n) => n.length <= 24)).toBe(true);
  });

  // Prysm answers "stereum.net" padded to 32 bytes, which the dialog took for an invalid, different value
  test("graffiti read back without the zero bytes Prysm pads it with", async () => {
    const v = new Validators({ nodeConnection: { taskManager: { otherTasksHandler: jest.fn() } } });
    v.graffitiFileOf = jest.fn().mockResolvedValue(null);
    v.keymanagerCalls = jest.fn(async (id, requests) =>
      requests.map(() => ({ status: 200, body: { data: { graffiti: "stereum.net" + "\0".repeat(21) } }, raw: "", url: "u" }))
    );
    const result = await v.readKeySettings("lh", [key(1)], "graffiti");
    expect(result.values[key(1)]).toEqual("stereum.net");
    expect(Validators.cleanGraffiti('Grüße "Stereum"\0\0')).toEqual('Grüße "Stereum"');
    expect(Validators.cleanGraffiti(undefined)).toBeUndefined();
    // Lighthouse answers with the bytes as hex
    expect(Validators.cleanGraffiti("0x4c48204150492074657374000000000000000000000000000000000000000000")).toEqual("LH API test");
    expect(Validators.cleanGraffiti("0x" + Buffer.from("Grüße").toString("hex").padEnd(64, "0"))).toEqual("Grüße");
  });

  // Prysm looks the default graffiti up by validator index, which a never-deposited key does not have yet
  test("a default graffiti Prysm cannot read before the deposit is no failure", async () => {
    const taskManager = { otherTasksHandler: jest.fn() };
    const v = new Validators({ nodeConnection: { taskManager } });
    v.graffitiFileOf = jest.fn().mockResolvedValue(null);
    v.keymanagerCalls = jest.fn(async (id, requests) =>
      requests.map((r, i) =>
        i
          ? { status: 500, body: { message: `could not find validator index for public key \`${key(2)}\`` }, raw: "", url: "u" }
          : { status: 200, body: { data: { graffiti: "stereum.net" } }, raw: "", url: "u" }
      )
    );
    const result = await v.readKeySettings("lh", [key(1), key(2)], "graffiti");
    expect(result).toEqual({ code: 0, values: { [key(1)]: "stereum.net" }, failed: {}, defaultUnknown: [key(2)] });
    // Lighthouse without a --graffiti flag answers 500 for its default
    v.keymanagerCalls = jest.fn(async (id, requests) =>
      requests.map(() => ({
        status: 500,
        body: { message: "INTERNAL_SERVER_ERROR: No graffiti found, unable to return the process-wide default" },
        raw: "",
        url: "u",
      }))
    );
    expect((await v.readKeySettings("lh", [key(3)], "graffiti")).defaultUnknown).toEqual([key(3)]);
    // Lodestar without a graffiti flag
    v.keymanagerCalls = jest.fn(async (id, requests) =>
      requests.map(() => ({ status: 404, body: { message: `No graffiti for pubkey ${key(4)}` }, raw: "", url: "u" }))
    );
    expect((await v.readKeySettings("lh", [key(4)], "graffiti")).defaultUnknown).toEqual([key(4)]);
    const calls = taskManager.otherTasksHandler.mock.calls;
    expect(calls[1].slice(1, 3)).toEqual(["Read 1 of 2", true]);
    expect(calls[1][3]).toContain(`${key(2)}: client default, not reported by the client`);
  });

  // Lighthouse answers 202 while refusing a graffiti because --graffiti-file is set
  // Lodestar answers 500 "Body cannot be empty when content-type is set to 'application/json'" otherwise
  test("requests without a body send no JSON content type", () => {
    const del = Validators.curlBlock("http://b", "T", false, { method: "DELETE", path: "/x", body: null });
    const post = Validators.curlBlock("http://b", "T", false, { method: "POST", path: "/x", body: { a: 1 } });
    expect(del).not.toContain("Content-Type");
    expect(post).toContain('header = "Content-Type: application/json"');
  });

  test("an accepted status with an error in the body counts as failed", async () => {
    const v = withBatch([202]);
    v.keymanagerCalls = jest.fn(async (id, requests) =>
      requests.map((r) => ({
        status: 202,
        body: { code: 401, message: 'Unable to update graffiti as the "--graffiti-file" flag is set' },
        raw: "",
        url: "u" + r.path,
      }))
    );
    expect(await v.setKeySetting("lh", [key(1)], "graffiti", "x")).toEqual({ code: 0, ok: [], failed: [key(1)] });
    expect(v.taskManager.otherTasksHandler.mock.calls[1][3]).toContain("--graffiti-file");
  });

  describe("Lighthouse graffiti file", () => {
    const FILE = "/opt/stereum/lighthouse-lh/graffitis/graffitis.yaml";
    const lighthouse = (text) => {
      const exec = jest.fn(async (cmd) =>
        cmd.startsWith("cat ") ? { rc: 0, stdout: text, stderr: "" } : { rc: 0, stdout: "", stderr: "" }
      );
      const v = new Validators({
        nodeConnection: {
          taskManager: { otherTasksHandler: jest.fn() },
          sshService: { exec },
          readServiceConfiguration: jest.fn().mockResolvedValue({
            id: "lh",
            service: "LighthouseValidatorService",
            command: ["--graffiti-file=/opt/app/graffitis/graffitis.yaml", "--http"],
            volumes: ["/opt/stereum/lighthouse-lh/graffitis:/opt/app/graffitis"],
          }),
        },
      });
      v.keymanagerCalls = jest.fn();
      const written = () =>
        exec.mock.calls
          .map((c) => c[0])
          .filter((c) => !c.startsWith("cat '"))
          .map((c) => c.split("\n").slice(1, -1).join("\n"))
          .join("\n");
      return { v, exec, written };
    };

    test("the file is found through the volume of the --graffiti-file flag", async () => {
      expect(await lighthouse("").v.graffitiFileOf("lh")).toEqual({ path: FILE });
    });

    test("keys get their own lines, the old page's default stays, and the API is never asked", async () => {
      const { v, written } = lighthouse("default: stereum.net\n");
      const result = await v.setKeySetting("lh", [key(1), key(2)], "graffiti", 'Grüße "Stereum"');
      expect(result).toEqual({ code: 0, ok: [key(1), key(2)], failed: [] });
      expect(written()).toEqual(`default: stereum.net\n${key(1)}: Grüße "Stereum"\n${key(2)}: Grüße "Stereum"`);
      expect(v.keymanagerCalls).not.toHaveBeenCalled();
    });

    test("a reset removes only that key's line", async () => {
      const { v, written } = lighthouse(`default: stereum.net\n${key(1)}: one\n${key(2)}: two\n`);
      await v.setKeySetting("lh", [key(1)], "graffiti", null);
      expect(written()).toEqual(`default: stereum.net\n${key(2)}: two`);
    });

    test("reading takes a key's line, else the default, and asks the API only for the rest", async () => {
      const { v } = lighthouse(`${key(1)}: own\n`);
      v.keymanagerCalls.mockResolvedValue([{ status: 200, body: { data: { graffiti: "flag" } }, url: "u" }]);
      expect((await v.readKeySettings("lh", [key(1), key(2)], "graffiti")).values).toEqual({ [key(1)]: "own", [key(2)]: "flag" });
      expect(v.keymanagerCalls.mock.calls[0][1]).toEqual([{ method: "GET", path: `/eth/v1/validator/${key(2)}/graffiti` }]);
      const withDefault = lighthouse("default: stereum.net\n");
      expect((await withDefault.v.getGraffiti("lh", key(3))).graffiti).toEqual("stereum.net");
    });

    test("the parser follows Lighthouse: first colon, trimmed value, exact default key", () => {
      expect(Validators.parseGraffitiFile(`default: a:b \n ${key(1)}: x\n${key(2).toUpperCase().replace("0X", "0x")}:  y\n`)).toEqual({
        default: "a:b",
        keys: { [key(2)]: "y" },
      });
    });
  });

  test("no value resets the setting to the client default", async () => {
    const v = withBatch([204]);
    const result = await v.setKeySetting("lh", [key(1)], "feerecipient", null);
    expect(v.keymanagerCalls.mock.calls[0][1][0]).toEqual({
      method: "DELETE",
      path: `/eth/v1/validator/${key(1)}/feerecipient`,
      body: null,
    });
    expect(result.ok).toEqual([key(1)]);
  });

  test("invalid input never reaches the validator client", async () => {
    const v = withBatch([]);
    expect((await v.setKeySetting("lh", [key(1)], "graffiti", "x".repeat(33))).code).toEqual(1);
    expect((await v.setKeySetting("lh", [key(1)], "graffiti", "two\nlines")).code).toEqual(1);
    expect((await v.setKeySetting("lh", [key(1)], "feerecipient", "0x123")).code).toEqual(1);
    expect((await v.setKeySetting("lh", ["not a key"], "graffiti", "ok")).code).toEqual(1);
    expect(v.keymanagerCalls).not.toHaveBeenCalled();
  });

  test("graffiti is limited by bytes, not characters", async () => {
    const v = withBatch([202]);
    expect((await v.setKeySetting("lh", [key(1)], "graffiti", "ü".repeat(16))).code).toEqual(0); // 32 bytes
    expect((await v.setKeySetting("lh", [key(1)], "graffiti", "ü".repeat(17))).code).toEqual(1); // 34 bytes
  });
});

describe("key removal", () => {
  const interchange = (keys) => JSON.stringify({ metadata: { interchange_format_version: "5" }, data: keys.map((pubkey) => ({ pubkey })) });
  const remover = (answers) => {
    const taskManager = { otherTasksHandler: jest.fn() };
    const v = new Validators({
      nodeConnection: { taskManager, sshService: { exec: jest.fn().mockResolvedValue({ rc: 0, stdout: "", stderr: "" }) } },
    });
    v.taskManager = taskManager;
    v.keymanagerRequest = jest.fn();
    answers.forEach((a) => v.keymanagerRequest.mockResolvedValueOnce(a));
    return v;
  };

  // large deletes made validator clients run out of memory, so keys go out in chunks
  test("keystores are deleted in chunks and their slashing protection merged", async () => {
    const keys = Array.from({ length: 45 }, (_, i) => key(i));
    const v = remover([]);
    v.keymanagerRequest.mockImplementation(async (id, request) => ({
      status: 200,
      body: { data: request.body.pubkeys.map(() => ({ status: "deleted" })), slashing_protection: interchange(request.body.pubkeys) },
    }));

    const result = await v.removeKeys("lh", { local: keys });

    expect(v.keymanagerRequest.mock.calls.map((c) => c[1].body.pubkeys.length)).toEqual([20, 20, 5]);
    expect(Object.values(result.results).every((s) => s === "deleted")).toBe(true);
    expect(JSON.parse(result.slashingProtection).data).toHaveLength(45);
    expect(result.savedTo).toMatch(/^\/etc\/stereum\/slashing-protection\/lh-\d+\.json$/);

    const calls = v.taskManager.otherTasksHandler.mock.calls;
    expect(calls.map((c) => c[1])).toEqual([
      "Removing 45 keys",
      "Removed 20 of 45",
      "Removed 40 of 45",
      "Removed 45 of 45",
      "Saved slashing protection",
      "Result",
      undefined,
    ]);
    expect(calls[1][3]).toContain(`${key(0)}: deleted`);
    expect(calls[1][3]).toContain('"slashing_protection": "(see the saved file)"');
    expect(calls[4][3]).toContain(`${result.savedTo}\n45 validators`);
    expect(calls[5][3]).toEqual("45 deleted");
  });

  // full histories (5.5 MB for 45 keys after 4 days) outgrew the SSH command and, for thousands of keys, any string
  test("a full slashing protection export is kept in minimal form, downloaded and saved in pieces that fit one SSH command", async () => {
    const keys = Array.from({ length: 45 }, (_, i) => key(i));
    const att = (e) => ({ source_epoch: String(e), target_epoch: String(e + 1), signing_root: "0x" + "c".repeat(64) });
    const v = remover([]);
    v.keymanagerRequest.mockImplementation(async (id, request) => ({
      status: 200,
      body: {
        data: request.body.pubkeys.map(() => ({ status: "deleted" })),
        slashing_protection: JSON.stringify({
          metadata: { interchange_format_version: "5" },
          data: request.body.pubkeys.map((pubkey) => ({
            pubkey,
            signed_blocks: [{ slot: "5" }, { slot: "900" }],
            signed_attestations: Array.from({ length: 830 }, (_, e) => att(128532 + e)),
          })),
        }),
      },
    }));

    const result = await v.removeKeys("lh", { local: keys });

    const kept = JSON.parse(result.slashingProtection);
    expect(kept.data).toHaveLength(45);
    expect(kept.data[0]).toEqual({
      pubkey: key(0),
      signed_blocks: [{ slot: "900" }],
      signed_attestations: [{ source_epoch: "129361", target_epoch: "129362" }],
    });
    expect(result.slashingProtection.length).toBeLessThan(30000);
    const commands = v.nodeConnection.sshService.exec.mock.calls.map((c) => c[0]);
    expect(Math.max(...commands.map((c) => c.length))).toBeLessThan(128 * 1024);
    // the pieces put together are the whole file, and only the last one moves it in place
    const text = commands
      .slice(1)
      .map((c) => c.split("\n").slice(1, -1).join("\n"))
      .join("\n");
    expect(JSON.parse(text)).toEqual(kept);
    expect(commands.at(-1)).toContain(`&& mv -f ${result.savedTo}.tmp ${result.savedTo}`);
  });

  test("a chunk the client could not handle is reported per key", async () => {
    const v = remover([{ status: 0, rc: 52, body: null }]);
    const result = await v.removeKeys("lh", { local: [key(1)] });
    expect(result.results[key(1)]).toEqual("error: validator client ran out of memory");
    expect(result.slashingProtection).toBeNull();
  });

  test("remote keys are removed separately and nothing invalid is sent", async () => {
    const v = remover([{ status: 200, body: { data: [{ status: "deleted" }] } }]);
    const result = await v.removeKeys("lh", { remote: [key(2), "0xnope"] });
    expect(v.keymanagerRequest).toHaveBeenCalledWith("lh", { method: "DELETE", path: "/eth/v1/remotekeys", body: { pubkeys: [key(2)] } });
    expect(result.results).toEqual({ [key(2)]: "deleted" });
    expect((await v.removeKeys("lh", { local: ["0xnope"] })).code).toEqual(1);
  });
});

describe("key import", () => {
  const ROOT = "0x" + "1".repeat(64);
  const keystore = (n) => JSON.stringify({ crypto: {}, pubkey: key(n).slice(2), version: 4 });
  const importer = () => {
    const monitoring = {
      nodeConnection: { taskManager: { otherTasksHandler: jest.fn() } },
      queryBeaconApi: jest.fn(async (url, endpoint) =>
        endpoint.includes("genesis")
          ? { code: 0, data: { api_reponse: { data: { genesis_validators_root: ROOT } } } }
          : {
              code: 0,
              data: {
                api_reponse: {
                  data: [
                    { index: "1", is_live: true },
                    { index: "2", is_live: false },
                  ],
                },
              },
            }
      ),
      getServiceInfos: jest
        .fn()
        .mockResolvedValue([
          { service: "LighthouseValidatorService", config: { serviceID: "lh", command: ["--enable-doppelganger-protection"] } },
        ]),
    };
    const v = new Validators(monitoring);
    v.initClient = jest.fn().mockResolvedValue();
    v.findHolderBeacon = jest.fn().mockResolvedValue({ code: 0, data: { url: "http://127.0.0.1:5052" } });
    v.getValidatorHolders = jest.fn().mockResolvedValue([{ id: "lh", role: "validator" }]);
    return v;
  };

  // an attestation in the last epoch means the key validates somewhere else right now
  test("keys that attested in the last epoch are reported as live", async () => {
    const v = importer();
    v.listHolderKeys = jest.fn().mockResolvedValue({ code: 0, keys: [{ pubkey: key(3) }] });
    v.getValidatorStates = jest.fn().mockResolvedValue({
      code: 0,
      headSlot: 3200,
      slotsPerEpoch: 32,
      byPubkey: { [key(1)]: { index: "1", status: "active_ongoing" }, [key(2)]: { index: "2", status: "active_ongoing" } },
    });

    const result = await v.prepareImport("lh", [key(1), key(2), key(3)]);

    expect(v.monitoring.queryBeaconApi).toHaveBeenCalledWith("http://127.0.0.1:5052", "/eth/v1/validator/liveness/99", ["1", "2"], "POST");
    expect(result).toMatchObject({ code: 0, live: [key(1)], alreadyImported: [key(3)], genesisRoot: ROOT, doppelganger: true });
  });

  // a lone Web3Signer has no beacon node, the known root of its network checks the slashing protection
  test("without a beacon node the known genesis root of the holder's network is used", async () => {
    const v = importer();
    const hoodi = "0x212f13fc4df078b6cb7db228f1c8307566dcecf900867401a92023d7ba99cb5f";
    v.findHolderBeacon = jest.fn().mockResolvedValue({ code: 1, info: "no beacon node" });
    v.getValidatorHolders = jest.fn().mockResolvedValue([{ id: "lh", role: "signer", network: "hoodi" }]);
    v.listHolderKeys = jest.fn().mockResolvedValue({ code: 0, keys: [] });
    v.getValidatorStates = jest.fn().mockResolvedValue({ code: 1, byPubkey: {} });
    v.keymanagerRequest = jest.fn().mockResolvedValue({ status: 200, body: { data: [{ status: "imported" }] } });
    const interchange = (root) =>
      JSON.stringify({
        metadata: { interchange_format_version: "5", genesis_validators_root: root },
        data: [{ pubkey: key(1), signed_blocks: [], signed_attestations: [] }],
      });

    expect(await v.prepareImport("lh", [key(1)])).toMatchObject({ code: 0, genesisRoot: hoodi });
    expect((await v.importKeys("lh", [keystore(1)], ["pw"], interchange(hoodi))).results[0].status).toEqual("imported");
    expect((await v.importKeys("lh", [keystore(1)], ["pw"], interchange(ROOT))).info).toContain("different network");
  });

  test("keystores are imported in chunks and reported in their order", async () => {
    const v = importer();
    v.keymanagerRequest = jest
      .fn()
      .mockResolvedValueOnce({ status: 200, body: { data: Array.from({ length: 50 }, () => ({ status: "imported" })) } })
      .mockResolvedValueOnce({ status: 200, body: { data: [{ status: "duplicate" }, { status: "error", message: "wrong password" }] } });
    const stores = Array.from({ length: 52 }, (_, i) => keystore(i));

    const result = await v.importKeys(
      "lh",
      stores,
      stores.map(() => "pw")
    );

    expect(v.keymanagerRequest.mock.calls.map((c) => c[1].body.keystores.length)).toEqual([50, 2]);
    expect(result.results[50]).toEqual({ pubkey: key(50), status: "duplicate", message: "" });
    expect(result.results[51]).toEqual({ pubkey: key(51), status: "error", message: "wrong password" });
  });

  test("the task panel shows each answer as received and a summary, never keystores or passwords", async () => {
    const v = importer();
    const answer = {
      data: [
        { status: "imported", message: "" },
        { status: "duplicate", message: "" },
      ],
    };
    v.keymanagerRequest = jest.fn().mockResolvedValue({
      status: 200,
      rc: 0,
      body: answer,
      raw: JSON.stringify(answer),
      stderr: "",
      method: "POST",
      url: "http://stereum-lh:5062/eth/v1/keystores",
    });

    await v.importKeys("lh", [keystore(1), keystore(2)], ["SECRET_PW", "SECRET_PW"]);

    const calls = v.nodeConnection.taskManager.otherTasksHandler.mock.calls;
    expect(calls.map((c) => c[1])).toEqual(["Importing 2 keys", "Imported 2 of 2", "Result", undefined]);
    const [, , ok, data] = calls[1];
    expect(ok).toBe(true);
    expect(data).toContain(`${key(1)}: imported\n${key(2)}: duplicate`);
    expect(data).toContain("POST http://stereum-lh:5062/eth/v1/keystores\nHTTP 200\nanswer:\n" + JSON.stringify(answer, null, 2));
    expect(calls[2][3]).toEqual("1 imported, 1 duplicate");
    const panel = calls.map((c) => c[3] ?? "").join("\n");
    expect(panel).not.toContain("SECRET_PW");
    expect(panel).not.toContain('"crypto"');
  });

  // a 5.5 MB Prysm export went out with every chunk and the server dropped the SSH connection (HTTP 0 for all)
  test("every import request fits into one SSH command, even with a full slashing protection export", async () => {
    const v = importer();
    const blocks = [];
    v.keymanagerRequest = jest.fn(async (id, request) => {
      blocks.push(Validators.curlBlock("http://stereum-prysm:7500", "T".repeat(64), false, request));
      return { status: 200, body: { data: request.body.keystores.map(() => ({ status: "imported" })) } };
    });
    // a real keystore is about 1.8 KB of JSON with many quotes, which the curl config escapes twice
    const stores = Array.from({ length: 45 }, (_, i) =>
      JSON.stringify({
        crypto: { kdf: { params: { salt: "a".repeat(64) } }, cipher: { message: "b".repeat(1500) } },
        pubkey: key(i).slice(2),
        version: 4,
      })
    );
    const exported = JSON.stringify({
      metadata: { interchange_format_version: "5", genesis_validators_root: ROOT },
      data: stores.map((_, i) => ({
        pubkey: key(i),
        signed_blocks: [],
        signed_attestations: Array.from({ length: 830 }, (_, e) => ({
          source_epoch: String(128532 + e),
          target_epoch: String(128533 + e),
          signing_root: "0x" + "c".repeat(64),
        })),
      })),
    });
    expect(exported.length).toBeGreaterThan(5_000_000);

    const result = await v.importKeys(
      "lh",
      stores,
      stores.map(() => "a long keystore password!"),
      exported
    );

    expect(result.results.every((r) => r.status === "imported")).toBe(true);
    expect(Math.max(...blocks.map((b) => b.length))).toBeLessThan(128 * 1024);
    // each chunk carries the minimal entries of its own keys only
    const sent = v.keymanagerRequest.mock.calls.map((c) => JSON.parse(c[1].body.slashing_protection));
    expect(sent.flatMap((sp) => sp.data.map((d) => d.pubkey))).toEqual(stores.map((_, i) => key(i)));
    expect(sent[0].data[0].signed_attestations).toEqual([{ source_epoch: "129361", target_epoch: "129362" }]);
  });

  test("the import reports its progress per request, after preparing the client", async () => {
    const v = importer();
    v.keymanagerRequest = jest.fn(async (id, request) => ({
      status: 200,
      body: { data: request.body.keystores.map(() => ({ status: "imported" })) },
    }));
    const stores = Array.from({ length: 120 }, (_, i) => keystore(i));
    const onProgress = jest.fn();

    await v.importKeys(
      "lh",
      stores,
      stores.map(() => "pw"),
      null,
      onProgress
    );

    expect(onProgress.mock.calls.map((c) => c[0])).toEqual([
      { phase: "preparing", done: 0, total: 120 },
      { phase: "importing", done: 0, total: 120, chunk: 1, chunks: 3 },
      { phase: "importing", done: 50, total: 120, chunk: 2, chunks: 3 },
      { phase: "importing", done: 100, total: 120, chunk: 3, chunks: 3 },
    ]);
  });

  test("a request that never ran says why instead of HTTP 0", () => {
    expect(Validators.curlFailure(-1, 0, null, "Connection lost!")).toEqual("Connection lost!");
    expect(Validators.curlFailure(2, 0, null, "")).toEqual("no answer (rc 2)");
    expect(Validators.curlFailure(0, 500, null, "")).toEqual("HTTP 500");
  });

  // without this a freshly installed Prysm has no wallet and the import fails
  test("the client's wallet and API access are set up before keys go in, like the staking page did", async () => {
    const client = { id: "prysm", service: "PrysmValidatorService" };
    const initWallet = jest.fn().mockResolvedValue();
    const taskManager = { otherTasksHandler: jest.fn() };
    const v = new Validators({
      nodeConnection: { taskManager },
      serviceManager: { readServiceConfigurations: jest.fn().mockResolvedValue([{ id: "other" }, client]) },
      validatorAccountManager: { initWallet },
    });

    await v.initClient("prysm", "ref");

    expect(initWallet).toHaveBeenCalledWith(client, "ref");
    expect(taskManager.otherTasksHandler.mock.calls[0].slice(0, 3)).toEqual(["ref", "Checked client setup", true]);
    await expect(v.initClient("gone", "ref")).rejects.toThrow("no validator service gone");
  });

  test("an answer that is not JSON is shown as it came, a missing one with curl's reason", () => {
    expect(Validators.answerText({ method: "POST", url: "u", status: 502, body: null, raw: "<html>Bad Gateway</html>" })).toEqual(
      "POST u\nHTTP 502\nanswer:\n<html>Bad Gateway</html>"
    );
    expect(Validators.answerText({ method: "POST", url: "u", status: 0, rc: 7, body: null, raw: "", stderr: "" })).toEqual(
      "POST u\nno answer: connection refused (curl exit 7)\nanswer: (empty)"
    );
  });

  test("nothing is sent without a password per keystore or with foreign slashing protection", async () => {
    const v = importer();
    v.keymanagerRequest = jest.fn();
    expect((await v.importKeys("lh", [keystore(1)], [])).code).toEqual(1);
    const foreign = JSON.stringify({
      metadata: { interchange_format_version: "5", genesis_validators_root: "0x" + "2".repeat(64) },
      data: [],
    });
    const result = await v.importKeys("lh", [keystore(1)], ["pw"], foreign);
    expect(result.info).toMatch(/different network/);
    expect(v.keymanagerRequest).not.toHaveBeenCalled();
  });
});

describe("marked curl output", () => {
  const M = (status) => `\n=====STEREUM_HTTP ${status}\n`;

  test("each request gets its status and parsed body, in order", () => {
    const pretty = JSON.stringify({ data: { message: { epoch: "1" } } }, null, 2);
    const stdout = '{"a":1}' + M(200) + M(200) + pretty + M(200) + '{"code":404,"message":"nope"}' + M(404) + M("000");
    expect(Validators.splitMarked(stdout, 5)).toEqual([
      { status: 200, body: { a: 1 }, raw: '{"a":1}' },
      { status: 200, body: null, raw: "" },
      { status: 200, body: { data: { message: { epoch: "1" } } }, raw: pretty },
      { status: 404, body: { code: 404, message: "nope" }, raw: '{"code":404,"message":"nope"}' },
      { status: 0, body: null, raw: "" },
    ]);
  });

  test("requests without a marker count as failed", () => {
    expect(Validators.splitMarked('{"a":1}' + M(200) + '{"b":', 2)).toEqual([
      { status: 200, body: { a: 1 }, raw: '{"a":1}' },
      { status: 0, body: null, raw: "" },
    ]);
    expect(Validators.splitMarked("", 1)).toEqual([{ status: 0, body: null, raw: "" }]);
  });
});

describe("chain spec", () => {
  const withSpec = (...answers) => {
    const queryBeaconApi = jest.fn();
    answers.forEach((a) => queryBeaconApi.mockResolvedValueOnce(a));
    return new Validators({ nodeConnection: {}, queryBeaconApi });
  };
  const ok = (data) => ({ code: 0, data: { api_reponse: { data } } });

  test("the shard committee period, Capella fork epoch, sync period and genesis time are read", async () => {
    const v = withSpec(
      ok({
        SLOTS_PER_EPOCH: "32",
        SECONDS_PER_SLOT: "12",
        SHARD_COMMITTEE_PERIOD: "64",
        CAPELLA_FORK_EPOCH: "256",
        DENEB_FORK_EPOCH: "512",
        EPOCHS_PER_SYNC_COMMITTEE_PERIOD: "512",
      }),
      ok({ genesis_time: "1742213400" })
    );
    expect(await v.getSpec("http://b")).toEqual({
      slotsPerEpoch: 32,
      secondsPerSlot: 12,
      shardCommitteePeriod: 64,
      capellaForkEpoch: 256,
      denebForkEpoch: 512,
      epochsPerSyncCommitteePeriod: 512,
      genesisTime: 1742213400,
    });
    expect(v.monitoring.queryBeaconApi).toHaveBeenCalledWith("http://b", "/eth/v1/beacon/genesis");
    await v.getSpec("http://b");
    expect(v.monitoring.queryBeaconApi).toHaveBeenCalledTimes(2);
  });

  test("missing values fall back, and a failed query is not cached", async () => {
    const v = withSpec({ code: 1, info: "down" }, ok({ genesis_time: "5" }), ok({}), ok({ genesis_time: "5" }));
    expect(await v.getSpec("http://b")).toEqual({
      slotsPerEpoch: 32,
      secondsPerSlot: 12,
      shardCommitteePeriod: 256,
      capellaForkEpoch: null,
      denebForkEpoch: null,
      epochsPerSyncCommitteePeriod: 256,
      genesisTime: 5,
    });
    await v.getSpec("http://b");
    expect(v.monitoring.queryBeaconApi).toHaveBeenCalledTimes(4);
  });

  test("without the genesis time the spec is returned but not cached", async () => {
    const v = withSpec(ok({ SLOTS_PER_EPOCH: "16" }), { code: 1, info: "down" }, ok({}), ok({ genesis_time: "7" }));
    expect(await v.getSpec("http://b")).toMatchObject({ slotsPerEpoch: 16, genesisTime: null });
    expect(await v.getSpec("http://b")).toMatchObject({ genesisTime: 7 });
    await v.getSpec("http://b");
    expect(v.monitoring.queryBeaconApi).toHaveBeenCalledTimes(4);
  });

  test("a reset drops the cache, since another server can use the same local beacon address", async () => {
    const v = withSpec(ok({}), ok({ genesis_time: "5" }), ok({}), ok({ genesis_time: "9" }));
    expect(await v.getSpec("http://b")).toMatchObject({ genesisTime: 5 });
    v.reset();
    expect(await v.getSpec("http://b")).toMatchObject({ genesisTime: 9 });
  });
});

describe("exits", () => {
  const SIG = "0x" + "cd".repeat(96);
  const DV = (n) => "0x" + String(n).padStart(96, "d");
  // epoch 1000 at the head; activation 0 is old enough, 800 is not (period 256)
  const stateOf = (index, status = "active_ongoing", activationEpoch = 0, credentials = "0x01ab") => ({
    index: String(index),
    status,
    activationEpoch,
    withdrawalCredentials: credentials,
    slashed: false,
  });
  const synced = { is_syncing: false, is_optimistic: false, el_offline: false };

  // answers curl config blocks like the validator client and beacon node would
  const fakeNode = ({ signIndex = (index) => index, signStatus = () => 200, beacon = () => [200, ""] } = {}) => {
    const received = [];
    const exec = jest.fn(async (cmd) => {
      const config = cmd.slice(cmd.indexOf("\n") + 1, cmd.lastIndexOf("\n"));
      const out = config.split("\nnext\n").map((block) => {
        const url = block.match(/^url = "(.*)"$/m)[1];
        const sign = url.match(/\/eth\/v1\/validator\/(0x[0-9a-f]{96})\/voluntary_exit/);
        if (sign) {
          const index = parseInt(sign[1].slice(-3).replace(/a/g, "")) || 0;
          const status = signStatus(sign[1]);
          const body =
            status === 200
              ? JSON.stringify({ data: { message: { epoch: "1", validator_index: String(signIndex(index)) }, signature: SIG } })
              : JSON.stringify({ code: status, message: "not found" });
          return body + `\n=====STEREUM_HTTP ${status}\n`;
        }
        const data = JSON.parse(block.match(/^data = "(.*)"$/m)[1].replace(/\\(.)/g, "$1"));
        received.push(data);
        const [status, body] = beacon(data);
        return body + `\n=====STEREUM_HTTP ${status}\n`;
      });
      return { rc: 0, stdout: out.join(""), stderr: "" };
    });
    return { exec, received };
  };

  const exiter = ({
    role = "validator",
    state = "running",
    listed = [],
    byPubkey = {},
    syncing = synced,
    dvs = [],
    node = fakeNode(),
    service = "LighthouseValidatorService",
    command = [],
    spec = { capellaForkEpoch: 50 },
  } = {}) => {
    const taskManager = { otherTasksHandler: jest.fn() };
    const monitoring = {
      nodeConnection: {
        sshService: { exec: node.exec },
        taskManager,
        readServiceConfiguration: jest.fn().mockResolvedValue({ id: "lh", service, command }),
        ensureCurlImage: jest.fn().mockResolvedValue("8.11.0"),
      },
      validatorAccountManager: {
        getApiToken: jest.fn().mockResolvedValue("SECRET_TOKEN"),
        getDVTKeys: jest.fn().mockResolvedValue(dvs),
      },
      queryBeaconApi: jest.fn().mockResolvedValue({ code: 0, data: { api_reponse: { data: syncing } } }),
    };
    const v = new Validators(monitoring);
    v.getValidatorHolders = jest.fn().mockResolvedValue([
      { id: "lh", role, state, service, dvtVia: role === "share" ? "charon" : undefined },
      { id: "charon", role: "distributed", state: "running" },
    ]);
    v.listHolderKeys = jest.fn().mockResolvedValue({ code: 0, keys: listed.map((pubkey) => ({ pubkey, remote: false })) });
    v.getValidatorStates = jest.fn().mockResolvedValue({
      code: 0,
      byPubkey,
      base: "http://127.0.0.1:5052",
      source: "local",
      headSlot: 32 * 1000,
      slotsPerEpoch: 32,
      secondsPerSlot: 12,
    });
    v.getSpec = jest.fn().mockResolvedValue({ slotsPerEpoch: 32, secondsPerSlot: 12, shardCommitteePeriod: 256, ...spec });
    return { v, exec: node.exec, received: node.received, taskManager };
  };

  // Prysm over REST signs with the fork at the requested epoch instead of Capella's (prysm#17691)
  describe("Prysm's exit domain", () => {
    const prysm = (extra) =>
      exiter({
        listed: [key(1)],
        byPubkey: { [key(1)]: stateOf(1) },
        service: "PrysmValidatorService",
        command: ["--enable-beacon-rest-api", "--beacon-rest-api-provider=http://stereum-bn:3500"],
        ...extra,
      });
    const signUrls = (exec) =>
      exec.mock.calls
        .map((c) => c[0])
        .join("\n")
        // the signing requests only, not the beacon node's pool/voluntary_exits
        .match(/\/voluntary_exit(\?epoch=\d+)?(?=")/g);

    test("on a network where Capella comes before Deneb it signs at the Capella epoch, in-app and for export", async () => {
      const { v, exec } = prysm({ spec: { capellaForkEpoch: 194048, denebForkEpoch: 269568 } });
      expect((await v.prepareExit("lh", [key(1)])).signEpoch).toEqual(194048);
      await v.exitKeys("lh", [key(1)]);
      await v.exportExitMessages("lh", [key(1)]);
      expect(signUrls(exec)).toEqual(["/voluntary_exit?epoch=194048", "/voluntary_exit?epoch=194048"]);
    });

    test("where Deneb starts with Capella (Hoodi) the exit is blocked before anything is signed", async () => {
      const { v, exec } = prysm({ spec: { capellaForkEpoch: 0, denebForkEpoch: 0 } });
      expect(await v.prepareExit("lh", [key(1)])).toMatchObject({ code: 1, reason: "prysmExitDomain" });
      expect((await v.exitKeys("lh", [key(1)])).reason).toEqual("prysmExitDomain");
      expect((await v.exportExitMessages("lh", [key(1)])).reason).toEqual("prysmExitDomain");
      expect(exec).not.toHaveBeenCalled();
    });

    test("Prysm over gRPC and other clients keep the epoch to themselves", async () => {
      const grpc = prysm({ command: ["--beacon-rpc-provider=stereum-bn:4000"], spec: { capellaForkEpoch: 0, denebForkEpoch: 0 } });
      expect((await grpc.v.prepareExit("lh", [key(1)])).signEpoch).toBeNull();
      const lighthouse = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1) }, spec: { capellaForkEpoch: 0, denebForkEpoch: 0 } });
      expect((await lighthouse.v.prepareExit("lh", [key(1)])).signEpoch).toBeNull();
    });
  });

  describe("preflight", () => {
    test("keys are sorted into eligible, too young and exited", async () => {
      const { v } = exiter({
        listed: [key(1), key(2), key(3)],
        byPubkey: {
          [key(1)]: stateOf(1, "active_ongoing", 0, "0x00ab"),
          [key(2)]: stateOf(2, "active_ongoing", 800),
          [key(3)]: stateOf(3, "exited_unslashed"),
        },
      });

      const result = await v.prepareExit("lh", [key(1), key(2), key(3)]);

      expect(result).toMatchObject({
        code: 0,
        role: "validator",
        eligible: [key(1)],
        exportable: [key(1), key(2)],
        blsCredentials: [key(1)],
        beacon: { base: "http://127.0.0.1:5052", source: "local", blocker: null },
        currentEpoch: 1000,
        shardCommitteePeriod: 256,
        secondsPerEpoch: 384,
        signEpoch: null,
        target: { prefix: "curl", base: "http://127.0.0.1:5052" },
      });
      expect(result.keys[key(2)].blocker).toEqual({ reason: "tooYoung", eligibleEpoch: 1056 });
      expect(result.keys[key(3)].blocker).toEqual({ reason: "exited" });
    });

    test("a syncing or optimistic beacon node blocks the exit", async () => {
      const listed = [key(1)];
      const byPubkey = { [key(1)]: stateOf(1) };
      const syncing = await exiter({ listed, byPubkey, syncing: { ...synced, is_syncing: true } }).v.prepareExit("lh", listed);
      const optimistic = await exiter({ listed, byPubkey, syncing: { ...synced, is_optimistic: "true" } }).v.prepareExit("lh", listed);
      expect(syncing.beacon.blocker).toEqual("syncing");
      expect(optimistic.beacon.blocker).toEqual("optimistic");
    });

    test("signers, SSV, Charon and stopped clients cannot exit", async () => {
      for (const role of ["signer", "ssv", "distributed"]) {
        expect(await exiter({ role, listed: [key(1)] }).v.prepareExit("lh", [key(1)])).toMatchObject({ code: 1 });
      }
      const stopped = await exiter({ state: "exited", listed: [key(1)] }).v.prepareExit("lh", [key(1)]);
      expect(stopped).toMatchObject({ code: 1, reason: "notRunning", info: "the validator client is not running" });
    });

    test("a beacon node without a head fails instead of making every key too young", async () => {
      const { v } = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1) } });
      v.getValidatorStates.mockResolvedValueOnce({ code: 0, byPubkey: { [key(1)]: stateOf(1) }, headSlot: null, slotsPerEpoch: 32 });
      expect(await v.prepareExit("lh", [key(1)])).toMatchObject({ code: 1, reason: "noHead" });
    });

    test("pending keys with an index can be exported but not exited", async () => {
      const { v } = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1, "pending_queued") } });
      const result = await v.prepareExit("lh", [key(1)]);
      expect(result).toMatchObject({ eligible: [], exportable: [key(1)] });
      expect(result.keys[key(1)].blocker).toEqual({ reason: "pending" });
    });

    test("keys the holder does not list are blocked and never queried", async () => {
      const { v } = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1) } });
      const result = await v.prepareExit("lh", [key(1), key(4)]);
      expect(result.keys[key(4)].blocker).toEqual({ reason: "notOnChain" });
      expect(result.eligible).toEqual([key(1)]);
      expect(v.getValidatorStates).toHaveBeenCalledWith([key(1)], "lh");
    });

    test("a share is checked through its distributed validator and exits through Charon", async () => {
      const { v } = exiter({
        role: "share",
        listed: [key(1), key(2)],
        dvs: [{ distributed_public_key: DV(1), public_shares: [key(1).toUpperCase().replace("0X", "0x")] }],
        byPubkey: { [DV(1)]: stateOf(21) },
      });

      const result = await v.prepareExit("lh", [key(1), key(2)]);

      expect(v.getValidatorStates).toHaveBeenCalledWith([DV(1)], "lh");
      expect(result.keys[key(1)]).toMatchObject({ index: "21", dvPubkey: DV(1), blocker: null });
      expect(result.keys[key(2)].blocker).toEqual({ reason: "notInCluster" });
      expect(result).toMatchObject({ eligible: [key(1)], exportable: [], signEpoch: 50 });
      expect(result.target).toEqual({
        prefix: "docker run --rm -i --network=stereum curlimages/curl:8.11.0",
        base: "http://stereum-charon:3600",
      });
    });
  });

  describe("exit", () => {
    test("only eligible, listed and valid keys reach a command", async () => {
      const { v, exec } = exiter({
        listed: [key(1), key(2)],
        byPubkey: { [key(1)]: stateOf(1), [key(2)]: stateOf(2, "active_ongoing", 800) },
      });

      const result = await v.exitKeys("lh", [key(1), key(2), key(9), "0x1234'; rm -rf /"]);

      const commands = exec.mock.calls.map((c) => c[0]).join("\n");
      expect(commands).not.toContain("rm -rf");
      expect(commands).not.toContain(key(9));
      expect(commands).not.toContain(key(2));
      expect(exec).toHaveBeenCalledTimes(2);
      expect(result.results).toEqual({
        [key(1)]: { status: "submitted" },
        [key(2)]: { status: "skipped", reason: "tooYoung", eligibleEpoch: 1056 },
        [key(9)]: { status: "skipped", reason: "notOnChain" },
      });
      expect(result).toMatchObject({ code: 0, partial: false, signEpoch: null });
    });

    test("validator clients choose the epoch, shares sign for the Capella fork", async () => {
      const own = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1) } });
      await own.v.exitKeys("lh", [key(1)]);
      expect(own.exec.mock.calls[0][0]).toContain(`/eth/v1/validator/${key(1)}/voluntary_exit"`);
      expect(own.exec.mock.calls[1][0]).toMatch(/^curl -K - /);
      expect(own.exec.mock.calls[1][0]).toContain('url = "http://127.0.0.1:5052/eth/v1/beacon/pool/voluntary_exits"');

      const share = exiter({
        role: "share",
        listed: [key(1)],
        dvs: [{ distributed_public_key: DV(1), public_shares: [key(1)] }],
        byPubkey: { [DV(1)]: stateOf(1) },
      });
      const result = await share.v.exitKeys("lh", [key(1)]);
      expect(share.exec.mock.calls[0][0]).toContain(`/eth/v1/validator/${key(1)}/voluntary_exit?epoch=50"`);
      expect(share.exec.mock.calls[1][0]).toContain('url = "http://stereum-charon:3600/eth/v1/beacon/pool/voluntary_exits"');
      expect(result).toMatchObject({ partial: true, signEpoch: 50 });
    });

    test("the token only appears in the config on stdin", async () => {
      const { v, exec } = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1) } });
      await v.exitKeys("lh", [key(1)]);
      const sign = exec.mock.calls[0][0];
      expect(sign.indexOf("SECRET_TOKEN")).toBeGreaterThan(sign.indexOf("<<'=====CURLCFG'"));
      expect(sign.slice(0, sign.indexOf("-K -"))).not.toContain("SECRET_TOKEN");
      expect(exec.mock.calls[1][0]).not.toContain("SECRET_TOKEN");
    });

    test("an exit signed for another validator is not broadcast", async () => {
      const node = fakeNode({ signIndex: (index) => index + 1 });
      const { v, exec } = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1) }, node });
      const result = await v.exitKeys("lh", [key(1)]);
      expect(exec).toHaveBeenCalledTimes(1);
      expect(result.results[key(1)]).toEqual({ status: "signFailed", message: "signed for another validator", error: "wrongIndex" });
    });

    test("the beacon node's answer is reported per key", async () => {
      const node = fakeNode({
        beacon: (data) =>
          data.message.validator_index === "2" ? [400, JSON.stringify({ code: 400, message: "invalid exit" })] : [200, ""],
      });
      const { v, received, taskManager } = exiter({
        listed: [key(1), key(2)],
        byPubkey: { [key(1)]: stateOf(1), [key(2)]: stateOf(2) },
        node,
      });

      const result = await v.exitKeys("lh", [key(1), key(2)]);

      expect(result.results[key(1)]).toEqual({ status: "submitted" });
      expect(result.results[key(2)]).toEqual({ status: "rejected", message: "invalid exit" });
      expect(received[0]).toEqual({ message: { epoch: "1", validator_index: "1" }, signature: SIG });

      // the panel shows the beacon node's answer per key, but a signed exit must never end up there
      const panel = taskManager.otherTasksHandler.mock.calls.map((c) => c[3] ?? "").join("\n");
      expect(panel).toContain(`${key(1)} (index 1): submitted - HTTP 200`);
      expect(panel).toContain(`${key(2)} (index 2): rejected - HTTP 400, answer: {"code":400,"message":"invalid exit"}`);
      expect(panel).not.toContain(SIG);
    });

    test("many keys are signed and sent in chunks of 100", async () => {
      const keys = Array.from({ length: 250 }, (_, i) => key(i + 1));
      const { v, exec, taskManager } = exiter({ listed: keys, byPubkey: Object.fromEntries(keys.map((k, i) => [k, stateOf(i + 1)])) });

      const result = await v.exitKeys("lh", keys);

      const commands = exec.mock.calls.map((c) => c[0]);
      expect(commands.filter((c) => c.includes('voluntary_exit"'))).toHaveLength(3);
      expect(commands.filter((c) => c.includes("/eth/v1/beacon/pool/voluntary_exits"))).toHaveLength(3);
      expect(Object.values(result.results).every((r) => r.status === "submitted")).toBe(true);
      expect(taskManager.otherTasksHandler.mock.calls.map((c) => c[1])).toEqual([
        "Exiting 250 validators",
        "Sent 100 of 250",
        "Sent 200 of 250",
        "Sent 250 of 250",
        "Result",
        undefined,
      ]);
    });

    test("the task panel entry is closed even when the exec fails", async () => {
      const node = { exec: jest.fn().mockRejectedValue(new Error("Not connected")), received: [] };
      const { v, taskManager } = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1) }, node });
      const result = await v.exitKeys("lh", [key(1)]);
      expect(result).toMatchObject({ code: 2, info: "Not connected" });
      const calls = taskManager.otherTasksHandler.mock.calls;
      expect(calls[0][1]).toEqual("Exiting 1 validators");
      expect(calls[calls.length - 1]).toHaveLength(1);
    });

    test("nothing is sent through a beacon node that is not ready", async () => {
      const { v, exec } = exiter({ listed: [key(1)], byPubkey: { [key(1)]: stateOf(1) }, syncing: { ...synced, el_offline: true } });
      expect(await v.exitKeys("lh", [key(1)])).toEqual({ code: 1, beaconBlocker: "elOffline", info: "beacon node elOffline" });
      expect(exec).not.toHaveBeenCalled();
    });
  });

  describe("export", () => {
    test("shares cannot export partial exits", async () => {
      const { v, exec } = exiter({ role: "share", listed: [key(1)] });
      expect((await v.exportExitMessages("lh", [key(1)])).code).toEqual(1);
      expect(exec).not.toHaveBeenCalled();
    });

    test("signed exits come back in order, with too young keys and failures", async () => {
      const node = fakeNode({ signStatus: (pubkey) => (pubkey === key(6) ? 404 : 200) });
      const { v, exec } = exiter({
        listed: [key(1), key(2), key(3), key(6)],
        byPubkey: {
          [key(1)]: stateOf(1),
          [key(2)]: stateOf(2, "active_ongoing", 800),
          [key(3)]: stateOf(3, "exited_unslashed"),
          [key(6)]: stateOf(6),
        },
        node,
      });

      const result = await v.exportExitMessages("lh", [key(2), key(1), key(6), key(3)]);

      expect(result.messages.map((m) => m.message.validator_index)).toEqual(["2", "1"]);
      expect(result.failed).toEqual([{ pubkey: key(6), message: "not found" }]);
      expect(result.skipped).toEqual({ [key(3)]: "exited" });
      expect(exec).toHaveBeenCalledTimes(1);
      expect(exec.mock.calls[0][0]).not.toContain("?epoch=");
    });
  });
});

describe("remote keys", () => {
  const W3S = "http://stereum-w3s:9000";
  const PRYSM_FLAGS = [
    `--validators-external-signer-url=${W3S}`,
    "--validators-external-signer-key-file=/opt/app/data/wallets/remote-keys.txt",
  ];

  describe("signer listing", () => {
    const lister = (stdout, rc = 0) => {
      const exec = jest.fn().mockResolvedValue({ rc, stdout, stderr: "" });
      const v = new Validators({ nodeConnection: { sshService: { exec }, ensureCurlImage: jest.fn().mockResolvedValue("8.11.0") } });
      v.getValidatorHolders = jest.fn().mockResolvedValue([
        { id: "w3s", role: "signer" },
        { id: "lh", role: "validator" },
      ]);
      return { v, exec };
    };

    test("a local signer is read through the stdin config, never on argv", async () => {
      const { v, exec } = lister(JSON.stringify([key(1)]) + "\n200");
      expect(await v.listSignerKeys({ signerId: "w3s" })).toEqual({ code: 0, url: W3S, keys: [key(1)] });
      const cmd = exec.mock.calls[0][0];
      const argv = cmd.slice(0, cmd.indexOf("<<"));
      expect(argv).toEqual("docker run --rm -i --network=stereum curlimages/curl:8.11.0 -K - ");
      expect(cmd).toContain(`url = "${W3S}/api/v1/eth2/publicKeys"`);
      expect(cmd).toContain('proto = "=http,https"');
      expect(cmd).not.toContain("insecure");
    });

    test("unknown signers and invalid urls never reach a command", async () => {
      const { v, exec } = lister("");
      expect(await v.listSignerKeys({ signerId: "lh" })).toEqual({ code: 1, info: "no Web3Signer lh" });
      expect(await v.listSignerKeys({ signerId: "gone" })).toMatchObject({ code: 1 });
      expect(await v.listSignerKeys({ url: "http://h';id;'" })).toEqual({ code: 1, info: "invalid url: host" });
      expect(await v.listSignerKeys({ url: "http://$(id):9000" })).toEqual({ code: 1, info: "invalid url: host" });
      expect(await v.listSignerKeys({})).toEqual({ code: 1, info: "invalid url: empty" });
      expect(exec).not.toHaveBeenCalled();
    });

    test("keys are lowercased, deduplicated and invalid ones dropped", async () => {
      const upper = key(1).toUpperCase().replace("0X", "0x");
      const { v, exec } = lister(JSON.stringify([upper, "0x12", key(1), key(2), 7]) + "\n200");
      const result = await v.listSignerKeys({ url: "HTTP://Signer.Example.com:9000/" });
      expect(result).toEqual({ code: 0, url: "http://signer.example.com:9000", keys: [key(1), key(2)] });
      expect(exec.mock.calls[0][0]).toContain('url = "http://signer.example.com:9000/api/v1/eth2/publicKeys"');
    });

    test("a failed answer is reported with its reason and the url, so keys can be added by hand", async () => {
      expect(await lister(JSON.stringify({ message: "boom" }) + "\n500").v.listSignerKeys({ signerId: "w3s" })).toEqual({
        code: 2,
        info: "boom",
        url: W3S,
      });
      expect(await lister(JSON.stringify({ data: [] }) + "\n200").v.listSignerKeys({ signerId: "w3s" })).toEqual({
        code: 2,
        info: "HTTP 200",
        url: W3S,
      });
      expect(await lister("000", 7).v.listSignerKeys({ url: "http://10.0.0.5:9000/" })).toEqual({
        code: 2,
        info: "connection refused",
        url: "http://10.0.0.5:9000",
      });
    });
  });

  test("curl failures are named by exit code", () => {
    expect(Validators.curlFailure(6, 0, null)).toEqual("host not found");
    expect(Validators.curlFailure(28, 0, null)).toEqual("timed out");
    expect(Validators.curlFailure(60, 0, null)).toEqual("TLS error");
    expect(Validators.curlFailure(52, 0, null)).toEqual("validator client ran out of memory");
    expect(Validators.curlFailure(0, 400, { message: "bad" })).toEqual("bad");
    expect(Validators.curlFailure(0, 404, null)).toEqual("HTTP 404");
  });

  test("a keymanager request still builds the same command", async () => {
    const exec = jest.fn().mockResolvedValue({ rc: 0, stdout: '{"data":[]}\n200', stderr: "" });
    const v = new Validators({ nodeConnection: { sshService: { exec } } });
    v.keymanagerTarget = jest.fn().mockResolvedValue({ base: "http://stereum-lh:5062", token: "TOKEN", tls: false, curlTag: "8.11.0" });

    const result = await v.keymanagerRequest("lh", { method: "GET", path: "/eth/v1/remotekeys" });

    expect(exec).toHaveBeenCalledWith(
      "docker run --rm -i --network=stereum curlimages/curl:8.11.0 -K - <<'=====KEYMANAGER'\n" +
        'url = "http://stereum-lh:5062/eth/v1/remotekeys"\nrequest = "GET"\n' +
        'header = "Authorization: Bearer TOKEN"\nsilent\nwrite-out = "\\n%{http_code}"\n=====KEYMANAGER'
    );
    expect(result).toEqual({
      status: 200,
      rc: 0,
      body: { data: [] },
      raw: '{"data":[]}',
      stderr: "",
      method: "GET",
      url: "http://stereum-lh:5062/eth/v1/remotekeys",
    });
  });

  describe("import", () => {
    const remoteImporter = ({
      role = "validator",
      service = "LighthouseValidatorService",
      command = [],
      listed = [],
      ready = () => 200,
    } = {}) => {
      const taskManager = { otherTasksHandler: jest.fn() };
      const exec = jest.fn().mockResolvedValue({ rc: 0, stdout: "", stderr: "" });
      const config = {
        id: "vc",
        service,
        command,
        volumes: ["/opt/stereum/prysm-vc/data/db:/opt/app/data/db", "/opt/stereum/prysm-vc/data/wallets:/opt/app/data/wallets"],
      };
      const nodeConnection = {
        sshService: { exec },
        taskManager,
        readServiceConfiguration: jest.fn().mockResolvedValue(config),
        writeServiceConfiguration: jest.fn().mockResolvedValue(),
      };
      const serviceManager = { manageServiceState: jest.fn().mockResolvedValue() };
      const v = new Validators({ nodeConnection, serviceManager });
      v.getValidatorHolders = jest.fn().mockResolvedValue([{ id: "vc", role, service }]);
      v.listHolderKeys = jest.fn().mockResolvedValue({ code: 0, keys: listed });
      v.initClient = jest.fn().mockResolvedValue();
      v.keymanagerRequest = jest.fn(async (id, request) =>
        request.method === "GET"
          ? { status: ready(), rc: 0, body: null }
          : { status: 200, rc: 0, body: { data: request.body.remote_keys.map(() => ({ status: "imported" })) } }
      );
      const posts = () => v.keymanagerRequest.mock.calls.filter((c) => c[1].method === "POST");
      return { v, exec, nodeConnection, serviceManager, taskManager, posts };
    };
    const closedTask = (taskManager) => {
      const calls = taskManager.otherTasksHandler.mock.calls;
      expect(calls[calls.length - 1]).toEqual([calls[0][0]]);
    };

    test("keys are imported in chunks of 100 with the signer url, in their order", async () => {
      const keys = Array.from({ length: 250 }, (_, i) => key(i));
      const { v, posts, taskManager } = remoteImporter();
      v.keymanagerRequest.mockImplementationOnce(async () => ({
        status: 200,
        rc: 0,
        body: { data: keys.slice(0, 100).map(() => ({ status: "imported" })) },
      }));
      v.keymanagerRequest.mockImplementationOnce(async () => ({
        status: 200,
        rc: 0,
        body: { data: [{ status: "duplicate" }, { status: "error", message: "bad key" }] },
      }));

      const result = await v.importRemoteKeys(
        "vc",
        [...keys, "0xnope", keys[0].toUpperCase().replace("0X", "0x")],
        "http://Stereum-W3S:9000/"
      );

      expect(posts().map((c) => c[1].body.remote_keys.length)).toEqual([100, 100, 50]);
      expect(posts()[0][1]).toEqual({
        method: "POST",
        path: "/eth/v1/remotekeys",
        body: { remote_keys: keys.slice(0, 100).map((pubkey) => ({ pubkey, url: W3S })) },
      });
      expect(result.code).toEqual(0);
      expect(result.restarted).toBe(false);
      expect(result.results.map((r) => r.pubkey)).toEqual(keys);
      expect(result.results[100]).toEqual({ pubkey: keys[100], status: "duplicate", message: "" });
      expect(result.results[101]).toEqual({ pubkey: keys[101], status: "error", message: "bad key" });
      expect(result.results[102]).toEqual({ pubkey: keys[102], status: "error", message: "HTTP 200" });
      expect(taskManager.otherTasksHandler.mock.calls[0][1]).toEqual("Importing 250 remote keys");
      closedTask(taskManager);
    });

    test("only validator clients get remote keys, and nothing invalid is sent", async () => {
      for (const role of ["share", "signer", "ssv", "distributed"]) {
        const { v, taskManager } = remoteImporter({ role });
        expect((await v.importRemoteKeys("vc", [key(1)], W3S)).code).toEqual(1);
        expect(v.keymanagerRequest).not.toHaveBeenCalled();
        expect(taskManager.otherTasksHandler).not.toHaveBeenCalled();
      }
      const { v } = remoteImporter();
      expect(await v.importRemoteKeys("vc", ["0xnope"], W3S)).toEqual({ code: 1, info: "no valid keys" });
      expect(await v.importRemoteKeys("vc", [key(1)], "http://h/;id")).toEqual({ code: 1, info: "invalid url: path" });
      expect(v.keymanagerRequest).not.toHaveBeenCalled();
    });

    test("a Prysm with local keys is not touched", async () => {
      const { v, exec, nodeConnection, serviceManager, taskManager } = remoteImporter({
        service: "PrysmValidatorService",
        listed: [{ pubkey: key(9), remote: false }],
      });

      const result = await v.importRemoteKeys("vc", [key(1)], W3S);

      expect(result).toMatchObject({ code: 1, info: "localKeys" });
      expect(nodeConnection.writeServiceConfiguration).not.toHaveBeenCalled();
      expect(serviceManager.manageServiceState).not.toHaveBeenCalled();
      expect(exec).not.toHaveBeenCalled();
      expect(v.keymanagerRequest).not.toHaveBeenCalled();
      closedTask(taskManager);
    });

    test("a Prysm already using this signer imports without a restart", async () => {
      const { v, nodeConnection, posts } = remoteImporter({ service: "PrysmValidatorService", command: ["--x", ...PRYSM_FLAGS] });
      const result = await v.importRemoteKeys("vc", [key(1)], W3S);
      expect(result).toMatchObject({ code: 0, restarted: false });
      expect(nodeConnection.writeServiceConfiguration).not.toHaveBeenCalled();
      expect(posts()).toHaveLength(1);
    });

    test("a Prysm without keys is switched to the signer, restarted and polled until ready", async () => {
      jest.useFakeTimers();
      try {
        let polls = 0;
        const { v, exec, nodeConnection, serviceManager, taskManager, posts } = remoteImporter({
          service: "PrysmValidatorService",
          command: ["--accept-terms-of-use=true", "--remote-signer-url=http://old:9000"],
          ready: () => (++polls < 3 ? 0 : 200),
        });

        const pending = v.importRemoteKeys("vc", [key(1)], W3S);
        await jest.advanceTimersByTimeAsync(10000);
        const result = await pending;

        expect(exec).toHaveBeenCalledWith("touch '/opt/stereum/prysm-vc/data/wallets/remote-keys.txt'");
        expect(nodeConnection.writeServiceConfiguration.mock.calls[0][0].command).toEqual(["--accept-terms-of-use=true", ...PRYSM_FLAGS]);
        expect(serviceManager.manageServiceState.mock.calls).toEqual([
          ["vc", "stopped"],
          ["vc", "started"],
        ]);
        expect(polls).toEqual(3);
        expect(posts()).toHaveLength(1);
        // the import only starts once Prysm answers again
        expect(v.keymanagerRequest.mock.calls.findIndex((c) => c[1].method === "POST")).toEqual(3);
        expect(result).toMatchObject({ code: 0, restarted: true });
        expect(taskManager.otherTasksHandler.mock.calls.map((c) => c[1])).toContain("Restarted Prysm for signer");
        closedTask(taskManager);
      } finally {
        jest.useRealTimers();
      }
    });

    test("a Prysm that does not come back fails the import and closes the task", async () => {
      jest.useFakeTimers();
      try {
        const { v, taskManager, posts } = remoteImporter({ service: "PrysmValidatorService", ready: () => 0 });

        const pending = v.importRemoteKeys("vc", [key(1)], W3S);
        await jest.advanceTimersByTimeAsync(100000);
        const result = await pending;

        // the config was written and Prysm restarted, so the page reloads its holders anyway
        expect(result).toMatchObject({ code: 2, info: "Prysm did not come back with its keymanager API", restarted: true });
        expect(posts()).toHaveLength(0);
        closedTask(taskManager);
      } finally {
        jest.useRealTimers();
      }
    });

    test("remote keys of a Prysm without key file are imported again after the switch", async () => {
      jest.useFakeTimers();
      try {
        const { v, posts } = remoteImporter({
          service: "PrysmValidatorService",
          command: [`--validators-external-signer-url=${W3S}`],
          listed: [
            { pubkey: key(5), remote: true, url: W3S },
            { pubkey: key(1), remote: true, url: W3S },
          ],
        });
        const pending = v.importRemoteKeys("vc", [key(1), key(2)], W3S);
        await jest.advanceTimersByTimeAsync(1000);
        const result = await pending;

        expect(posts()[0][1].body.remote_keys).toEqual([key(1), key(2), key(5)].map((pubkey) => ({ pubkey, url: W3S })));
        expect(result).toMatchObject({ code: 0, restarted: true });
      } finally {
        jest.useRealTimers();
      }
    });

    test("a Teku without signer url gets it, is restarted and polled before the import", async () => {
      const { v, nodeConnection, serviceManager, taskManager, posts } = remoteImporter({
        service: "TekuValidatorService",
        command: ["--network=hoodi"],
      });

      const result = await v.importRemoteKeys("vc", [key(1)], W3S);

      expect(nodeConnection.writeServiceConfiguration.mock.calls[0][0].command).toEqual([
        "--network=hoodi",
        `--validators-external-signer-url=${W3S}`,
      ]);
      expect(serviceManager.manageServiceState.mock.calls).toEqual([
        ["vc", "stopped"],
        ["vc", "started"],
      ]);
      expect(v.keymanagerRequest.mock.calls.map((c) => c[1].method)).toEqual(["GET", "POST"]);
      expect(posts()).toHaveLength(1);
      expect(result).toMatchObject({ code: 0, restarted: true });
      expect(taskManager.otherTasksHandler.mock.calls.map((c) => c[1])).toContain("Restarted Teku for signer");
      closedTask(taskManager);
    });

    test("a Teku with any signer url imports without a restart", async () => {
      const { v, nodeConnection, serviceManager } = remoteImporter({
        service: "TekuValidatorService",
        command: ["--validators-external-signer-url=http://other:9000"],
      });
      expect(await v.importRemoteKeys("vc", [key(1)], W3S)).toMatchObject({ code: 0, restarted: false });
      expect(nodeConnection.writeServiceConfiguration).not.toHaveBeenCalled();
      expect(serviceManager.manageServiceState).not.toHaveBeenCalled();
    });
  });

  describe("prepare", () => {
    const preparer = (service, command = [], listed = []) => {
      const monitoring = {
        nodeConnection: {},
        queryBeaconApi: jest.fn().mockResolvedValue({ code: 1 }),
        getServiceInfos: jest.fn().mockResolvedValue([{ service, config: { serviceID: "vc", command } }]),
      };
      const v = new Validators(monitoring);
      v.findHolderBeacon = jest.fn().mockResolvedValue({ code: 1, info: "none" });
      v.getValidatorHolders = jest.fn().mockResolvedValue([{ id: "vc", role: "validator", service }]);
      v.listHolderKeys = jest.fn().mockResolvedValue({ code: 0, keys: listed });
      v.getValidatorStates = jest.fn().mockResolvedValue({ code: 0, byPubkey: {} });
      return v;
    };

    test("the remote signer plan is reported per client", async () => {
      expect((await preparer("LighthouseValidatorService").prepareImport("vc", [key(1)], { remoteUrl: W3S })).remoteSigner).toEqual({
        mode: "ready",
      });
      expect((await preparer("PrysmValidatorService").prepareImport("vc", [key(1)], { remoteUrl: W3S })).remoteSigner.mode).toEqual(
        "switch"
      );
      const local = preparer("PrysmValidatorService", [], [{ pubkey: key(2), remote: false }]);
      expect((await local.prepareImport("vc", [key(1)], { remoteUrl: W3S })).remoteSigner).toMatchObject({
        mode: "blocked",
        reason: "localKeys",
      });
      expect((await preparer("LighthouseValidatorService").prepareImport("vc", [key(1)])).remoteSigner).toBeUndefined();
      expect((await preparer("TekuValidatorService").prepareImport("vc", [key(1)], { remoteUrl: W3S })).remoteSigner).toEqual({
        mode: "switch",
        current: null,
      });
      const teku = preparer("TekuValidatorService", [`--validators-external-signer-url=${W3S}`]);
      expect((await teku.prepareImport("vc", [key(1)], { remoteUrl: W3S })).remoteSigner.mode).toEqual("ready");
    });

    test("an invalid url or a keystore import into a remote Prysm is refused", async () => {
      expect(await preparer("LighthouseValidatorService").prepareImport("vc", [key(1)], { remoteUrl: "ftp://x" })).toEqual({
        code: 1,
        info: "invalid url: protocol",
      });
      const remote = preparer("PrysmValidatorService", PRYSM_FLAGS);
      expect(await remote.prepareImport("vc", [key(1)])).toEqual({
        code: 1,
        info: "Prysm runs in remote signer mode and cannot import keystores",
      });
      expect((await remote.prepareImport("vc", [key(1)], { remoteUrl: W3S })).remoteSigner.mode).toEqual("ready");
    });
  });

  test("a Prysm in remote signer mode lists only its remote keys, with their signer", async () => {
    const keymanagerAPI = jest.fn().mockResolvedValue({ rc: 0, stdout: JSON.stringify({ data: [{ pubkey: key(1), url: W3S }] }) });
    const monitoring = {
      nodeConnection: {
        readServiceConfiguration: jest.fn().mockResolvedValue({ id: "vc", service: "PrysmValidatorService", command: PRYSM_FLAGS }),
      },
      getServiceInfos: jest.fn().mockResolvedValue([info("PrysmValidatorService", "vc")]),
      validatorAccountManager: { keymanagerAPI },
    };

    const result = await new Validators(monitoring).listHolderKeys("vc");

    expect(keymanagerAPI.mock.calls.map((c) => c[2])).toEqual(["/eth/v1/remotekeys"]);
    expect(result.keys).toEqual([{ pubkey: key(1), remote: true, url: W3S }]);
  });

  test("a Prysm with local keys never asks for remote keys, which it answers with an error", async () => {
    const keymanagerAPI = jest.fn(async (client, method, path) => ({
      rc: 0,
      stdout: JSON.stringify(
        path === "/eth/v1/keystores"
          ? { data: [{ validating_pubkey: key(1), readonly: false }] }
          : { code: 500, message: "Prysm Wallet is not of type Web3Signer" }
      ),
    }));
    const monitoring = {
      nodeConnection: {
        readServiceConfiguration: jest.fn().mockResolvedValue({ id: "vc", service: "PrysmValidatorService", command: ["--x"] }),
      },
      getServiceInfos: jest.fn().mockResolvedValue([info("PrysmValidatorService", "vc")]),
      validatorAccountManager: { keymanagerAPI },
    };

    const result = await new Validators(monitoring).listHolderKeys("vc");

    expect(keymanagerAPI.mock.calls.map((c) => c[2])).toEqual(["/eth/v1/keystores"]);
    expect(result).toEqual({ code: 0, keys: [{ pubkey: key(1), remote: false }] });
  });

  test("a Web3Signer key Lighthouse also lists as readonly keystore gets its signer", async () => {
    const keymanagerAPI = jest
      .fn()
      .mockResolvedValueOnce({ rc: 0, stdout: JSON.stringify({ data: [{ validating_pubkey: key(1), readonly: true }] }) })
      .mockResolvedValueOnce({ rc: 0, stdout: JSON.stringify({ data: [{ pubkey: key(1), url: W3S }] }) });
    const monitoring = {
      nodeConnection: { readServiceConfiguration: jest.fn().mockResolvedValue({ id: "lh", service: "LighthouseValidatorService" }) },
      getServiceInfos: jest.fn().mockResolvedValue([info("LighthouseValidatorService", "lh")]),
      validatorAccountManager: { keymanagerAPI },
    };
    expect((await new Validators(monitoring).listHolderKeys("lh")).keys).toEqual([{ pubkey: key(1), remote: true, url: W3S }]);
  });

  test("Prysm holders carry their signer url", () => {
    const prysm = info("PrysmValidatorService", "prysm");
    prysm.config.command = ["--x", ...PRYSM_FLAGS];
    const holders = Validators.classifyHolders([prysm, info("PrysmValidatorService", "plain"), info("LighthouseValidatorService", "lh")]);
    expect(holders.map((h) => h.signerUrl)).toEqual([W3S, null, undefined]);
  });
});

describe("keys file", () => {
  const YAML = require("yaml");
  const lh = "lh";
  const entry = (fields = {}) => ({ keyName: "", groupName: "", groupID: null, validatorClientID: null, ...fields });
  // exec answers cat with the given file and every write with rc 0, unless overridden
  const validatorsWith = (file, { cat, write } = {}) => {
    const exec = jest.fn(async (cmd) => {
      if (cmd.startsWith("cat /etc/stereum/keys.yaml")) return cat ?? { rc: 0, stdout: file, stderr: "" };
      return write ?? { rc: 0, stdout: "", stderr: "" };
    });
    const v = new Validators({ nodeConnection: { sshService: { exec } } });
    v.getValidatorHolders = jest.fn().mockResolvedValue([{ id: lh }, { id: "teku" }]);
    return { v, exec };
  };
  const written = (exec) => {
    const writes = exec.mock.calls.map(([cmd]) => cmd).filter((cmd) => cmd.startsWith("cat >"));
    return YAML.parse(writes.map((cmd) => cmd.split("\n").slice(1, -1).join("\n")).join("\n"));
  };

  describe("commands", () => {
    test("a small file is written in one command and moved into place", () => {
      const cmds = Validators.keysYamlCommands("a: 1\nb: 2\n", "/tmp/k.yaml");
      expect(cmds).toEqual([
        "cat > /tmp/k.yaml.tmp <<'=====STEREUM_KEYS' && mv -f /tmp/k.yaml.tmp /tmp/k.yaml\na: 1\nb: 2\n=====STEREUM_KEYS",
      ]);
      expect(Validators.keysYamlCommands(YAML.stringify({}))).toHaveLength(1);
      expect(Validators.keysYamlCommands(YAML.stringify({}))[0]).toContain("\n{}\n");
    });

    test("large files are split into appended chunks below the argv limit", () => {
      const lines = Array.from({ length: 3000 }, (_, i) => `${key(i)}: { keyName: "k${i}", groupName: "" }`);
      const text = lines.join("\n") + "\n";
      expect(Buffer.byteLength(text)).toBeGreaterThan(300000);
      const cmds = Validators.keysYamlCommands(text);
      expect(cmds.length).toBeGreaterThan(4);
      expect(cmds[0].startsWith("cat > /etc/stereum/keys.yaml.tmp <<")).toBe(true);
      expect(cmds.slice(1).every((c) => c.startsWith("cat >> /etc/stereum/keys.yaml.tmp <<"))).toBe(true);
      expect(cmds.filter((c) => c.includes("mv -f"))).toEqual([cmds[cmds.length - 1]]);
      expect(cmds.every((c) => Buffer.byteLength(c) < 70000)).toBe(true);
      const chunks = cmds.map((c) => c.split("\n").slice(1, -1).join("\n"));
      expect(chunks.join("\n")).toEqual(text.replace(/\n$/, ""));
    });

    test("a line equal to a heredoc marker is refused", () => {
      expect(() => Validators.keysYamlCommands("a: 1\n=====STEREUM_KEYS\n")).toThrow();
      expect(() => Validators.keysYamlCommands("=====EOF")).toThrow();
    });
  });

  test("patches are validated field by field", () => {
    const ids = [lh];
    expect(Validators.validateKeyPatch({ "0x12": { keyName: "a" } }, ids).error).toBeDefined();
    expect(Validators.validateKeyPatch({ [key(1)]: { other: "a" } }, ids).error).toBeDefined();
    expect(Validators.validateKeyPatch({ [key(1)]: { groupName: "a\nb" } }, ids).error).toBeDefined();
    expect(Validators.validateKeyPatch({ [key(1)]: { groupID: "a b;" } }, ids).error).toBeDefined();
    expect(Validators.validateKeyPatch({ [key(1)]: { validatorClientID: "geth" } }, ids).error).toBeDefined();
    expect(Validators.validateKeyPatch([], ids).error).toBeDefined();
    const upper = "0x" + "B".repeat(96);
    expect(Validators.validateKeyPatch({ [upper]: { groupName: "", groupID: null, validatorClientID: null } }, ids)).toEqual({
      entries: { [upper.toLowerCase()]: { groupName: "", groupID: null, validatorClientID: null } },
    });
  });

  test("a patch is merged per entry and other entries stay", async () => {
    const file = YAML.stringify({
      [key(1)]: entry({ keyName: "one" }),
      [key(2)]: entry({ keyName: "two", groupName: "g", groupID: "id1" }),
    });
    const { v, exec } = validatorsWith(file);

    const result = await v.writeKeyEntries({
      [key(2)]: { groupName: "h" },
      [key(3)]: { groupName: "g", groupID: "id9", validatorClientID: lh },
    });

    expect(result.code).toEqual(0);
    const expected = {
      [key(1)]: entry({ keyName: "one" }),
      [key(2)]: entry({ keyName: "two", groupName: "h", groupID: "id1" }),
      [key(3)]: entry({ groupName: "g", groupID: "id9", validatorClientID: lh }),
    };
    expect(result.aliases).toEqual(expected);
    expect(written(exec)).toEqual(expected);
    expect(exec.mock.calls[exec.mock.calls.length - 1][0]).toContain("&& mv -f /etc/stereum/keys.yaml.tmp /etc/stereum/keys.yaml\n");
  });

  test("an existing mixed-case entry is updated in place", async () => {
    const mixed = "0x" + "A".repeat(96);
    const { v } = validatorsWith(YAML.stringify({ [mixed]: entry({ keyName: "old" }) }));

    const result = await v.writeKeyEntries({ [mixed.toLowerCase()]: { keyName: "new" } });

    expect(result.aliases).toEqual({ [mixed]: entry({ keyName: "new" }) });
  });

  test("a missing file is empty", async () => {
    const { v } = validatorsWith("", { cat: { rc: 1, stdout: "", stderr: "cat: /etc/stereum/keys.yaml: No such file or directory" } });

    const result = await v.writeKeyEntries({ [key(1)]: { keyName: "one" } });

    expect(result).toEqual({ code: 0, aliases: { [key(1)]: entry({ keyName: "one" }) } });
  });

  test("an unreadable or broken file is never overwritten", async () => {
    for (const setup of [
      validatorsWith("a: [1\n"),
      validatorsWith("- 1\n- 2\n"),
      validatorsWith("", { cat: { rc: 1, stdout: "", stderr: "Permission denied" } }),
    ]) {
      const result = await setup.v.writeKeyEntries({ [key(1)]: { keyName: "one" } });
      expect(result.code).toEqual(1);
      expect(setup.exec).toHaveBeenCalledTimes(1);
    }
  });

  test("a failed chunk stops before the file is replaced", async () => {
    const big = Object.fromEntries(Array.from({ length: 1500 }, (_, i) => [key(i), entry({ keyName: "k" + i })]));
    const { v, exec } = validatorsWith(YAML.stringify(big), { write: { rc: 1, stdout: "", stderr: "No space left on device" } });

    const result = await v.writeKeyEntries({ [key(1)]: { keyName: "one" } });

    expect(result.code).toEqual(1);
    expect(result.info).toContain("No space left");
    // the read and the first chunk only; the move rides on the last chunk
    expect(exec).toHaveBeenCalledTimes(2);
    expect(exec.mock.calls.some(([cmd]) => cmd.includes("mv -f"))).toBe(false);
  });

  test("invalid patches are refused before anything is read", async () => {
    const { v, exec } = validatorsWith("");
    const result = await v.writeKeyEntries({ [key(1)]: { keyName: "a b" } });
    expect(result.code).toEqual(1);
    expect(exec).not.toHaveBeenCalled();
  });

  test("concurrent writes run one after another and keep both changes", async () => {
    let file = "";
    const order = [];
    const exec = jest.fn(async (cmd) => {
      if (cmd.startsWith("cat /etc/stereum/keys.yaml")) {
        order.push("read");
        return { rc: 0, stdout: file, stderr: "" };
      }
      await new Promise((r) => setTimeout(r, 5));
      file = cmd.split("\n").slice(1, -1).join("\n");
      order.push("write");
      return { rc: 0, stdout: "", stderr: "" };
    });
    const v = new Validators({ nodeConnection: { sshService: { exec } } });
    v.getValidatorHolders = jest.fn().mockResolvedValue([{ id: lh }]);

    const [first, second] = await Promise.all([
      v.writeKeyEntries({ [key(1)]: { keyName: "one" } }),
      v.writeKeyEntries({ [key(2)]: { groupName: "g", groupID: "id1", validatorClientID: lh } }),
    ]);

    expect(order).toEqual(["read", "write", "read", "write"]);
    expect(first.code).toEqual(0);
    expect(Object.keys(second.aliases)).toEqual([key(1), key(2)]);
  });

  test("the old keys writer waits in the same queue", async () => {
    const { ValidatorAccountManager } = require("../../ValidatorAccountManager");
    const order = [];
    const { v } = validatorsWith("");
    const vam = new ValidatorAccountManager(v.nodeConnection, {});
    vam.writeKeysNow = jest.fn(async () => {
      order.push("old start");
      await new Promise((r) => setTimeout(r, 5));
      order.push("old end");
    });
    v.readKeyEntries = jest.fn(async () => (order.push("new"), {}));

    await Promise.all([vam.writeKeys([key(1)]), v.writeKeyEntries({ [key(2)]: { keyName: "two" } })]);

    expect(order).toEqual(["old start", "old end", "new"]);
  });
});

describe("duties and rewards", () => {
  const BASE = "http://10.0.0.5:5052";
  const MARKER = "=====STEREUM_BEACON_BATCH";
  const GENESIS = 1742213400;
  const KEY5 = "0x" + "5".repeat(96);

  // a fake beacon node behind execShared: every curl line is answered by handler(path, postedIds)
  const beaconNode = (handler) =>
    jest.fn(async (cmd) => ({
      rc: 0,
      stderr: "",
      stdout: cmd
        .split("\n")
        .map((line) => {
          const url = line.match(/'(http[^']+)'$/)?.[1] ?? line.match(/'(http[^']+)';/)[1];
          const data = line.match(/-d '([^']*)'/);
          const { status, body } = handler(url.replace(BASE, ""), data ? JSON.parse(data[1]) : null);
          return `${body === undefined ? "" : JSON.stringify(body)}\n${status}\n${MARKER}\n`;
        })
        .join(""),
    }));
  const setup = (handler, role = "validator") => {
    const execShared = beaconNode(handler);
    const v = new Validators({ nodeConnection: { sshService: { execShared } } });
    v.getValidatorHolders = jest.fn().mockResolvedValue([{ id: "lh", role, service: "LighthouseValidatorService" }]);
    v.findHolderBeacon = jest.fn().mockResolvedValue({ code: 0, data: { url: BASE, source: "local" } });
    v.getSpec = jest
      .fn()
      .mockResolvedValue({ slotsPerEpoch: 32, secondsPerSlot: 12, epochsPerSyncCommitteePeriod: 256, genesisTime: GENESIS });
    return { v, execShared };
  };
  const paths = (execShared) =>
    execShared.mock.calls.flatMap(([cmd]) => cmd.split("\n").map((line) => line.match(/'http[^']+?(\/eth[^']*)'/)[1]));
  const head = (slot) => ({ status: 200, body: { data: { header: { message: { slot: String(slot), proposer_index: "1" } } } } });

  // wall clock in epoch 1000, slot 32005
  beforeEach(() => jest.spyOn(Date, "now").mockReturnValue((GENESIS + 32005 * 12 + 3) * 1000));
  afterEach(() => jest.restoreAllMocks());

  const dutiesNode = (path, ids) => {
    if (path === "/eth/v1/beacon/headers/head") return head(32004);
    if (path === "/eth/v1/beacon/states/head/finality_checkpoints") return { status: 200, body: { data: { finalized: { epoch: "998" } } } };
    if (path === "/eth/v1/validator/duties/proposer/1000") {
      return {
        status: 200,
        body: {
          data: [
            { pubkey: KEY5.toUpperCase().replace("0X", "0x"), validator_index: "5", slot: "32010" },
            { pubkey: "0x" + "9".repeat(96), validator_index: "77", slot: "32011" },
          ],
        },
      };
    }
    if (path === "/eth/v1/validator/duties/proposer/999") {
      return { status: 200, body: { data: [{ pubkey: KEY5, validator_index: "5", slot: "31990" }] } };
    }
    if (path === "/eth/v1/validator/duties/proposer/1001") return { status: 500, body: { message: "not ready" } };
    if (path === "/eth/v1/validator/duties/sync/1000")
      return { status: 200, body: { data: ids.includes("5") ? [{ validator_index: "5" }] : [] } };
    if (path === "/eth/v1/validator/duties/sync/1024") return { status: 200, body: { data: [{ validator_index: "6" }] } };
    return { status: 404, body: { message: "unexpected " + path } };
  };

  describe("duties", () => {
    test("all requests go out in one batch and only own proposals are kept", async () => {
      const { v, execShared } = setup(dutiesNode);

      const result = await v.getDuties("lh", ["5", "6", "5"]);

      expect(execShared).toHaveBeenCalledTimes(1);
      expect(paths(execShared)).toEqual([
        "/eth/v1/beacon/headers/head",
        "/eth/v1/beacon/states/head/finality_checkpoints",
        "/eth/v1/validator/duties/proposer/999",
        "/eth/v1/validator/duties/proposer/1000",
        "/eth/v1/validator/duties/proposer/1001",
        "/eth/v1/validator/duties/sync/1000",
        "/eth/v1/validator/duties/sync/1024",
      ]);
      expect(result).toMatchObject({
        code: 0,
        epoch: 1000,
        slot: 32005,
        headSlot: 32004,
        finalizedEpoch: 998,
        genesisTime: GENESIS,
        slotsPerEpoch: 32,
        secondsPerSlot: 12,
        // the previous epoch's proposal is kept for its rewards, the failed next-epoch request is left out
        proposals: [
          { slot: 31990, index: "5", pubkey: KEY5 },
          { slot: 32010, index: "5", pubkey: KEY5 },
        ],
        sync: { current: ["5"], next: ["6"], periodStart: 768, nextPeriodStart: 1024 },
      });
    });

    test("indices that are not plain numbers never reach the command", async () => {
      const { v, execShared } = setup(dutiesNode);

      await v.getDuties("lh", ["5", "6; rm -rf /", "abc", 7, "1".repeat(13)]);

      const cmd = execShared.mock.calls[0][0];
      expect(cmd).not.toMatch(/rm -rf|abc|1111111111111/);
      expect(cmd).toContain(`-d '["5","7"]'`);
    });

    test("no indices run nothing, and shares have no duties", async () => {
      const { v, execShared } = setup(dutiesNode);
      expect(await v.getDuties("lh", [])).toEqual({ code: 0, empty: true });
      expect(await v.getDuties("lh", ["x"])).toEqual({ code: 0, empty: true });
      expect(v.getValidatorHolders).not.toHaveBeenCalled();

      const share = setup(dutiesNode, "share");
      expect((await share.v.getDuties("lh", ["5"])).code).toEqual(1);
      expect(execShared).not.toHaveBeenCalled();
      expect(share.execShared).not.toHaveBeenCalled();
    });

    test("a beacon node without a head answers code 2", async () => {
      const { v } = setup((path) =>
        path === "/eth/v1/beacon/headers/head" ? { status: 503, body: { message: "syncing" } } : dutiesNode(path, [])
      );
      expect((await v.getDuties("lh", ["5"])).code).toEqual(2);
    });

    test("without the genesis time the epoch comes from the head", async () => {
      const { v, execShared } = setup(dutiesNode);
      v.getSpec.mockResolvedValue({ slotsPerEpoch: 32, secondsPerSlot: 12, epochsPerSyncCommitteePeriod: 256, genesisTime: null });

      const result = await v.getDuties("lh", ["5"]);

      expect(execShared).toHaveBeenCalledTimes(2);
      expect(result).toMatchObject({ code: 0, epoch: 1000, slot: 32004 });
    });
  });

  test("a beacon batch over the exec budget is split and keeps the answer order", async () => {
    const { v, execShared } = setup((path, ids) => ({ status: 200, body: { data: { path, count: ids?.length ?? 0 } } }));
    const ids = Array.from({ length: 1000 }, (_, i) => String(100000000000 + i));
    const requests = Array.from({ length: 20 }, (_, i) => ({ path: `/eth/v1/beacon/rewards/attestations/${i}`, ids }));

    const answers = await v.beaconBatch(BASE, requests);

    expect(execShared.mock.calls.length).toBeGreaterThan(1);
    for (const [cmd] of execShared.mock.calls) expect(Buffer.byteLength(cmd)).toBeLessThanOrEqual(64 * 1024);
    expect(answers.map((a) => a.body.data.path)).toEqual(requests.map((r) => r.path));
    expect(answers.every((a) => a.status === 200 && a.body.data.count === 1000)).toBe(true);
  });

  test("missing parts of a batch answer as status 0", async () => {
    const execShared = jest.fn().mockResolvedValue({ rc: 255, stdout: "", stderr: "connection lost" });
    const v = new Validators({ nodeConnection: { sshService: { execShared } } });
    expect(await v.beaconBatch(BASE, [{ path: "/a" }, { path: "/b" }])).toEqual([
      { status: 0, body: null },
      { status: 0, body: null },
    ]);
    await expect(v.beaconBatch("http://x' ; rm -rf /'", [{ path: "/a" }])).rejects.toThrow("invalid beacon node address");
  });

  describe("rewards", () => {
    const attestationAnswer = {
      status: 200,
      body: {
        data: {
          ideal_rewards: [{ effective_balance: "32000000000", head: "10", target: "20", source: "10" }],
          total_rewards: [{ validator_index: "5", head: "10", target: "20", source: "10", inactivity: "0" }],
        },
      },
    };
    const rewardsNode = (path) => {
      if (path === "/eth/v1/beacon/headers/head") return head(32004);
      if (path.startsWith("/eth/v1/beacon/rewards/attestations/")) return attestationAnswer;
      if (path.startsWith("/eth/v1/beacon/rewards/sync_committee/")) {
        return path.endsWith("/31970")
          ? { status: 404, body: { code: 404 } }
          : { status: 200, body: { data: [{ validator_index: "5", reward: "3" }] } };
      }
      if (path === "/eth/v1/beacon/headers/32001")
        return { status: 200, body: { data: { header: { message: { slot: "32001", proposer_index: "5" } } } } };
      if (path === "/eth/v1/beacon/headers/32002") return { status: 404, body: { code: 404, message: "not found" } };
      if (path === "/eth/v1/beacon/rewards/blocks/32001")
        return { status: 200, body: { data: { proposer_index: "5", total: "41000000" } } };
      return { status: 404, body: { code: 404 } };
    };

    test("a missing header means missed, an own header means proposed with its reward", async () => {
      const { v, execShared } = setup(rewardsNode);

      const result = await v.getRewards("lh", {
        proposals: [
          { slot: 32001, index: "5" },
          { slot: 32002, index: "5" },
          { slot: 32010, index: "5" }, // after the head
          { slot: 32003, index: "x; ls" },
        ],
      });

      expect(execShared.mock.calls[0][0]).not.toContain("x; ls");
      expect(result.blocks).toEqual([
        { slot: 32001, index: "5", result: "proposed", reward: 41000000 },
        { slot: 32002, index: "5", result: "missed", reward: 0 },
      ]);
      expect(result.attestation).toBeNull();
      expect(result.sync).toBeNull();
    });

    test("sync committee rewards are only asked with sync indices", async () => {
      const without = setup(rewardsNode);
      await without.v.getRewards("lh", { indices: ["5"], attestationEpoch: 998, epoch: 999, syncIndices: [] });
      expect(paths(without.execShared).some((p) => p.includes("sync_committee"))).toBe(false);

      const { v, execShared } = setup(rewardsNode);
      const result = await v.getRewards("lh", { indices: ["5"], attestationEpoch: 998, epoch: 999, syncIndices: ["5"] });
      const syncPaths = paths(execShared).filter((p) => p.includes("sync_committee"));
      expect(syncPaths).toHaveLength(32);
      expect(syncPaths[0]).toEqual("/eth/v1/beacon/rewards/sync_committee/31968");
      // 31 slots of 3 gwei, slot 31970 had no block
      expect(result.sync).toEqual({ epoch: 999, total: 93, missedCount: 0, missedSlots: [31970] });
      expect(result.attestation).toMatchObject({ epoch: 998, total: 40, ideal: 40, effectiveness: 1, missedCount: 0 });
      expect(result.unsupported).toEqual({ attestation: false, sync: false });
    });

    test("endpoints a beacon node does not serve are reported as unsupported", async () => {
      const { v } = setup((path) =>
        path === "/eth/v1/beacon/headers/head"
          ? head(32004)
          : path.startsWith("/eth/v1/beacon/headers/")
            ? { status: 200, body: { data: { header: { message: { proposer_index: "5" } } } } }
            : { status: path.includes("sync") ? 501 : 404, body: { code: 404, message: "Not Found" } }
      );

      const result = await v.getRewards("lh", {
        indices: ["5"],
        attestationEpoch: 998,
        epoch: 999,
        syncIndices: ["5"],
        proposals: [{ slot: 32001, index: "5" }],
      });

      expect(result.unsupported).toEqual({ attestation: true, sync: true, block: true });
      expect(result.attestation).toBeNull();
      expect(result.sync).toBeNull();
      expect(result.blocks).toEqual([{ slot: 32001, index: "5", result: "proposed", reward: null }]);
    });

    test("at most 64 proposals are asked", async () => {
      const { v, execShared } = setup(rewardsNode);
      await v.getRewards("lh", { proposals: Array.from({ length: 100 }, (_, i) => ({ slot: 31000 + i, index: "5" })) });
      expect(paths(execShared).filter((p) => p.startsWith("/eth/v1/beacon/headers/3"))).toHaveLength(64);
    });

    test("shares have no rewards", async () => {
      const { v, execShared } = setup(rewardsNode, "share");
      expect((await v.getRewards("lh", { proposals: [{ slot: 1, index: "5" }] })).code).toEqual(1);
      expect(execShared).not.toHaveBeenCalled();
    });
  });
});

describe("cluster stats", () => {
  const withHolders = (monitoring) => {
    const v = new Validators({ nodeConnection: {}, ...monitoring });
    v.getValidatorHolders = jest.fn().mockResolvedValue([
      { id: "charon", role: "distributed", service: "CharonService" },
      { id: "teku", role: "share", dvtVia: "charon", service: "TekuValidatorService" },
      { id: "ssv", role: "ssv", service: "SSVNetworkService" },
      { id: "lh", role: "validator", service: "LighthouseValidatorService" },
    ]);
    return v;
  };

  test("Obol stats for Charon, and for a share through its Charon", async () => {
    const getObolClusterInformation = jest.fn().mockResolvedValue({ peerName: "peer", operators: 4 });
    const v = withHolders({ getObolClusterInformation });

    expect(await v.getClusterStats("charon")).toEqual({
      code: 0,
      kind: "obol",
      service: "CharonService",
      stats: { peerName: "peer", operators: 4 },
      empty: false,
    });
    expect(await v.getClusterStats("teku")).toMatchObject({ code: 0, kind: "obol", service: "CharonService" });
    expect(getObolClusterInformation.mock.calls).toEqual([["charon"], ["charon"]]);
  });

  test("SSV stats, empty answers and rejected API calls", async () => {
    const getSSVClusterInformation = jest
      .fn()
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("Request failed with status code 404"));
    const v = withHolders({ getSSVClusterInformation });

    expect(await v.getClusterStats("ssv")).toMatchObject({ code: 0, kind: "ssv", stats: {}, empty: true });
    expect(await v.getClusterStats("ssv")).toEqual({ code: 1, info: "Request failed with status code 404" });
    expect((await v.getClusterStats("lh")).code).toEqual(1);
  });
});

describe("Lido CSM keys", () => {
  const PK = "0x" + "c".repeat(96);
  const withLcom = (installed = true) =>
    new Validators({ nodeConnection: {}, getServiceInfos: jest.fn().mockResolvedValue(installed ? [{ service: "LCOMService" }] : []) });
  beforeEach(() => getSigningKeysWithQueueInfo.mockReset());
  afterEach(() => jest.restoreAllMocks());

  test("without LCOM nothing is asked", async () => {
    const v = withLcom(false);
    expect(await v.getCsmKeys()).toEqual({ code: 0, installed: false, keys: {} });
    expect(v.monitoring.getServiceInfos).toHaveBeenCalledWith("LCOMService");
    expect(getSigningKeysWithQueueInfo).not.toHaveBeenCalled();
  });

  test("concurrent calls share one lookup", async () => {
    let resolve;
    getSigningKeysWithQueueInfo.mockReturnValue(new Promise((r) => (resolve = r)));
    const v = withLcom();

    const both = Promise.all([v.getCsmKeys(), v.getCsmKeys()]);
    await new Promise((r) => setTimeout(r, 0));
    resolve([{ key: PK.toUpperCase().replace("0X", "0x"), queuePosition: 2n }]);
    const [a, b] = await both;

    expect(getSigningKeysWithQueueInfo).toHaveBeenCalledTimes(1);
    expect(a).toEqual({ code: 0, installed: true, keys: { [PK]: 2 } });
    expect(b).toEqual(a);
  });

  test("results are cached for 5 minutes unless forced", async () => {
    getSigningKeysWithQueueInfo.mockResolvedValue([{ key: PK, queuePosition: 0n }]);
    const now = jest.spyOn(Date, "now").mockReturnValue(1000000);
    const v = withLcom();

    await v.getCsmKeys();
    await v.getCsmKeys();
    expect(getSigningKeysWithQueueInfo).toHaveBeenCalledTimes(1);
    await v.getCsmKeys(true);
    expect(getSigningKeysWithQueueInfo).toHaveBeenCalledTimes(2);
    now.mockReturnValue(1000000 + 6 * 60000);
    await v.getCsmKeys();
    expect(getSigningKeysWithQueueInfo).toHaveBeenCalledTimes(3);
    // another server must not get this one's keys
    v.reset();
    await v.getCsmKeys();
    expect(getSigningKeysWithQueueInfo).toHaveBeenCalledTimes(4);
  });

  test("the old staking page's lookup shares the run of the new page", async () => {
    let resolve;
    getSigningKeysWithQueueInfo.mockReturnValue(new Promise((r) => (resolve = r)));
    const v = withLcom();

    const both = Promise.all([v.csmSigningKeys(), v.getCsmKeys()]);
    await new Promise((r) => setTimeout(r, 0));
    resolve([]);
    const [list, result] = await both;

    expect(getSigningKeysWithQueueInfo).toHaveBeenCalledTimes(1);
    expect(list).toEqual([]);
    expect(result).toEqual({ code: 0, installed: true, keys: {} });
  });

  test("a failed lookup answers code 1 and is not cached", async () => {
    getSigningKeysWithQueueInfo.mockResolvedValue(null);
    const v = withLcom();
    expect(await v.getCsmKeys()).toMatchObject({ code: 1, installed: true });
    await v.getCsmKeys();
    expect(getSigningKeysWithQueueInfo).toHaveBeenCalledTimes(2);
  });
});
