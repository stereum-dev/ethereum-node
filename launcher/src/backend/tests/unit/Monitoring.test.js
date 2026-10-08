import { Monitoring } from "../../Monitoring";

// Electron adds this, and Monitoring names its cache file after it
if (!process.getCreationTime) process.getCreationTime = () => 0;

const executionInfo = (ports) => ({
  service: "GethService",
  state: "running",
  createdAt: null,
  config: {
    serviceID: "6bc6f0d4-6df2-4d21-9a0d-b7a5e0b4a111",
    instanceID: "stereum-6bc6f0d4-6df2-4d21-9a0d-b7a5e0b4a111",
    ports: ports,
    network: "hoodi",
  },
});

const rpcPort = (destinationIp) => ({
  destinationIp: destinationIp,
  destinationPort: "8545",
  servicePort: "8545",
  servicePortProtocol: "tcp",
});

const p2pPort = { destinationIp: "0.0.0.0", destinationPort: "30303", servicePort: "30303", servicePortProtocol: "tcp" };

function monitoringWith(serviceInfos) {
  const monitoring = new Monitoring({});
  monitoring.getServiceInfos = jest.fn().mockResolvedValue(serviceInfos);
  monitoring.queryRpcApi = jest.fn().mockResolvedValue({
    code: 0,
    info: "success",
    data: { api_reponse: "0x15a12b", api_httpcode: 200 },
  });
  return monitoring;
}

// The RPC query runs as curl on the node, so the api has to be addressed by the
// ip its port is published on. Overwriting that with 127.0.0.1 left the sync
// status of every execution client empty as soon as its port was published on
// one of the machine's own addresses instead of a wildcard.
test("the rpc api is queried on the address its port is published on", async () => {
  const monitoring = monitoringWith([executionInfo([p2pPort, rpcPort("192.168.178.24")])]);

  const result = await monitoring.getRpcData("eth_blockNumber", {});

  expect(monitoring.queryRpcApi).toHaveBeenCalledWith({ addr: "192.168.178.24", port: "8545" }, "eth_blockNumber");
  expect(result.code).toEqual(0);
  expect(result.data[0].query_result.data.api_reponse).toEqual("0x15a12b");
});

test("a wildcard binding is queried on localhost", async () => {
  const monitoring = monitoringWith([executionInfo([p2pPort, rpcPort("0.0.0.0")])]);

  await monitoring.getRpcData("eth_blockNumber", {});

  expect(monitoring.queryRpcApi).toHaveBeenCalledWith({ addr: "127.0.0.1", port: "8545" }, "eth_blockNumber");
});

test("a binding to localhost stays on localhost", async () => {
  const monitoring = monitoringWith([executionInfo([p2pPort, rpcPort("127.0.0.1")])]);

  await monitoring.getRpcData("eth_blockNumber", {});

  expect(monitoring.queryRpcApi).toHaveBeenCalledWith({ addr: "127.0.0.1", port: "8545" }, "eth_blockNumber");
});

test("an execution client that does not publish its rpc port is skipped", async () => {
  const monitoring = monitoringWith([executionInfo([p2pPort])]);

  const result = await monitoring.getRpcData("eth_blockNumber", {});

  expect(monitoring.queryRpcApi).not.toHaveBeenCalled();
  expect(result.code).toEqual(3);
});

test("service infos that were handed in are not read a second time", async () => {
  const monitoring = monitoringWith([]);

  await monitoring.getRpcData("eth_blockNumber", { serviceInfos: [executionInfo([rpcPort("0.0.0.0")])] });

  expect(monitoring.getServiceInfos).not.toHaveBeenCalled();
  expect(monitoring.queryRpcApi).toHaveBeenCalledWith({ addr: "127.0.0.1", port: "8545" }, "eth_blockNumber");
});

// A wrong "not installed" sends the user to the install screen for a node that already runs
// Stereum, so the check must separate "absent" from "could not tell".
describe("checkStereumInstallation", () => {
  const nodeConnectionWith = (execImpl) => ({
    sshService: { connected: true, exec: execImpl },
  });

  beforeAll(() => {
    Monitoring.INSTALL_CHECK_RETRY_MS = 1; // keep the retries instant
  });

  test("reports installed when the probe says the file is there", async () => {
    const monitoring = new Monitoring();
    const nc = nodeConnectionWith(async () => ({ rc: 0, stdout: "STEREUM_PRESENT\n", stderr: "" }));
    await expect(monitoring.checkStereumInstallation(nc)).resolves.toBe(true);
  });

  test("reports not installed only when the probe positively says so", async () => {
    const monitoring = new Monitoring();
    const nc = nodeConnectionWith(async () => ({ rc: 0, stdout: "STEREUM_ABSENT\n", stderr: "" }));
    await expect(monitoring.checkStereumInstallation(nc)).resolves.toBe(false);
  });

  test("ignores login-shell noise around the marker", async () => {
    const monitoring = new Monitoring();
    const nc = nodeConnectionWith(async () => ({
      rc: 0,
      stdout: "Welcome to Ubuntu\n*** System restart required ***\nSTEREUM_PRESENT\n",
      stderr: "mesg: ttyname failed",
    }));
    await expect(monitoring.checkStereumInstallation(nc)).resolves.toBe(true);
  });

  test("retries an inconclusive answer instead of reporting not installed", async () => {
    const monitoring = new Monitoring();
    let calls = 0;
    const nc = nodeConnectionWith(async () => {
      calls++;
      // the old code returned false here on the first hiccup
      if (calls < 3) return { rc: -1, stdout: "", stderr: "Connection lost!" };
      return { rc: 0, stdout: "STEREUM_PRESENT\n", stderr: "" };
    });
    await expect(monitoring.checkStereumInstallation(nc)).resolves.toBe(true);
    expect(calls).toBe(3);
  });

  test("retries a thrown exec instead of reporting not installed", async () => {
    const monitoring = new Monitoring();
    let calls = 0;
    const nc = nodeConnectionWith(async () => {
      calls++;
      if (calls < 2) throw new Error("channel closed");
      return { rc: 0, stdout: "STEREUM_PRESENT\n", stderr: "" };
    });
    await expect(monitoring.checkStereumInstallation(nc)).resolves.toBe(true);
  });

  test("does not probe a node it is not connected to", async () => {
    const monitoring = new Monitoring();
    const exec = jest.fn();
    const nc = { sshService: { connected: false, exec } };
    await expect(monitoring.checkStereumInstallation(nc)).resolves.toBe(false);
    expect(exec).not.toHaveBeenCalled();
  });
});

const tekuInfo = {
  service: "TekuBeaconService",
  state: "running",
  config: {
    serviceID: "teku-id",
    instanceID: "stereum-teku-id",
    command: ["--p2p-peer-upper-bound=100"],
    dependencies: { executionClients: [{ service: "GethService", id: "geth-id" }] },
  },
};

const gethInfo = {
  service: "GethService",
  state: "running",
  config: { serviceID: "geth-id", instanceID: "stereum-geth-id", command: ["--maxpeers=50"], dependencies: { executionClients: [] } },
};

const sample = (name, job, instance, value, labels = {}) => ({
  metric: { __name__: name, job, instance: instance + ":8008", ...labels },
  value: [0, String(value)],
});

// Teku reports beacon_peer_count per direction, so both series have to be summed
test("teku peers are summed across inbound and outbound", async () => {
  const monitoring = new Monitoring({});
  monitoring.getServiceInfos = jest.fn().mockResolvedValue([tekuInfo, gethInfo]);
  monitoring.queryPrometheus = jest.fn().mockResolvedValue({
    status: "success",
    data: {
      result: [
        sample("beacon_peer_count", "teku_beacon", "stereum-teku-id", 30, { direction: "inbound" }),
        sample("beacon_peer_count", "teku_beacon", "stereum-teku-id", 45, { direction: "outbound" }),
        sample("p2p_peers", "geth", "stereum-geth-id", 20),
      ],
    },
  });

  const result = await monitoring.getP2PStatus();

  expect(result.code).toEqual(0);
  expect(result.data[0].details.consensus.numPeer).toEqual(75);
  expect(result.data[0].details.execution.numPeer).toEqual(20);
});

// Like the rpc api, the beacon api has to be addressed by the ip its port is published on
test("the beacon api is queried on the address its port is published on", async () => {
  const monitoring = new Monitoring({});
  monitoring.getBeaconStatus = jest.fn().mockResolvedValue({
    code: 0,
    data: [{ beacon: { destinationIp: "192.168.178.24", destinationPort: "5051" } }],
  });
  monitoring.queryBeaconApi = jest.fn().mockImplementation(async (url, endpoint) => ({
    code: 0,
    data: {
      api_reponse: {
        data: endpoint.includes("genesis") ? { genesis_time: "0" } : { SLOTS_PER_EPOCH: "32", SECONDS_PER_SLOT: "12" },
      },
    },
  }));

  const result = await monitoring.getCurrentEpochandSlot();

  expect(monitoring.queryBeaconApi).toHaveBeenCalledWith("http://192.168.178.24:5051", "/eth/v1/beacon/genesis", [], "GET");
  expect(result.current_slot).toBeGreaterThan(0);
});

// A validator-only node has no local beacon, but its validator client knows where one is
test("without a local beacon the configured endpoint that answers is used", async () => {
  const monitoring = new Monitoring({});
  monitoring.getBeaconStatus = jest.fn().mockResolvedValue({ code: 2, info: "no running consensus client", data: "" });
  monitoring.getServiceInfos = jest
    .fn()
    .mockResolvedValue([
      { service: "TekuValidatorService", config: { command: ["--beacon-node-api-endpoint=http://down:5051,http://up:5051"] } },
    ]);
  monitoring.queryBeaconApi = jest
    .fn()
    .mockImplementation(async (url) =>
      url === "http://up:5051" ? { code: 0, data: { api_reponse: { data: { is_syncing: false } } } } : { code: 5, info: "error" }
    );

  const result = await monitoring.findBeaconPort();

  expect(result.code).toEqual(0);
  expect(result.data.url).toEqual("http://up:5051");
  expect(result.data.source).toEqual("configured");
});

test("without any reachable beacon the lookup still fails", async () => {
  const monitoring = new Monitoring({});
  monitoring.getBeaconStatus = jest.fn().mockResolvedValue({ code: 2, info: "no running consensus client", data: "" });
  monitoring.getServiceInfos = jest
    .fn()
    .mockResolvedValue([{ service: "TekuValidatorService", config: { command: ["--beacon-node-api-endpoint=http://down:5051"] } }]);
  monitoring.queryBeaconApi = jest.fn().mockResolvedValue({ code: 5, info: "error" });

  const result = await monitoring.findBeaconPort();

  expect(result.code).toEqual(1);
});

// A VC behind Charon only holds key shares, so the attestation rewards have to be summed for the DV keys
test("the balance of a VC behind Charon is summed for the cluster's DV keys", async () => {
  const monitoring = new Monitoring({});
  monitoring.findBeaconPort = jest.fn().mockResolvedValue({ code: 0, data: { url: "http://127.0.0.1:5051" } });
  monitoring.getServiceInfos = jest.fn().mockResolvedValue([
    {
      service: "TekuValidatorService",
      config: { serviceID: "teku", dependencies: { consensusClients: [{ service: "CharonService", id: "charon" }] } },
    },
  ]);
  monitoring.getPublicKeys = jest.fn();
  monitoring.validatorAccountManager.getDVTKeys = jest
    .fn()
    .mockResolvedValue([{ distributed_public_key: "0xdv1" }, { distributed_public_key: "0xdv2" }]);
  monitoring.queryBeaconApi = jest.fn().mockImplementation(async (url, endpoint) =>
    endpoint.includes("finality")
      ? { code: 0, data: { api_reponse: { data: { finalized: { epoch: "100" } } } } }
      : {
          code: 0,
          data: {
            api_reponse: {
              data: {
                total_rewards: [
                  { validator_index: "1", head: "10", source: "20", target: "30" },
                  { validator_index: "2", head: "1", source: "2", target: "3" },
                ],
              },
            },
          },
        }
  );

  const result = await monitoring.getBalanceStatus();

  expect(monitoring.getPublicKeys).not.toHaveBeenCalled();
  expect(monitoring.queryBeaconApi).toHaveBeenCalledWith(
    "http://127.0.0.1:5051",
    "/eth/v1/beacon/rewards/attestations/100",
    ["0xdv1", "0xdv2"],
    "POST",
    expect.anything()
  );
  expect(result.data.balance).toEqual(66);
});

// null lets the staking page keep the stats it has instead of resetting every key
describe("validator state on a failed fetch", () => {
  const monitoringWithBeacon = (execResults) => {
    const monitoring = new Monitoring({});
    monitoring.findBeaconPort = jest.fn().mockResolvedValue({ code: 0, data: { url: "http://127.0.0.1:5051" } });
    monitoring.nodeConnection = { sshService: { exec: jest.fn() } };
    execResults.forEach((r) => monitoring.nodeConnection.sshService.exec.mockResolvedValueOnce(r));
    return monitoring;
  };
  const finality = { rc: 0, stderr: "", stdout: JSON.stringify({ data: { current_justified: { epoch: "99" } } }) };

  test("no reachable beacon returns null", async () => {
    const monitoring = new Monitoring({});
    monitoring.findBeaconPort = jest.fn().mockResolvedValue({ code: 1, info: "no beacon" });

    expect(await monitoring.getValidatorState(["0xa"])).toBeNull();
  });

  test("a failed curl returns null", async () => {
    const monitoring = monitoringWithBeacon([{ rc: 7, stderr: "", stdout: "" }, finality]);

    expect(await monitoring.getValidatorState(["0xa"])).toBeNull();
  });

  test("keys unknown to the beacon are an answer, not a failure", async () => {
    const monitoring = monitoringWithBeacon([{ rc: 0, stderr: "", stdout: JSON.stringify({ code: 404, message: "not found" }) }, finality]);

    expect(await monitoring.getValidatorState(["0xa"])).toEqual([]);
  });
});
