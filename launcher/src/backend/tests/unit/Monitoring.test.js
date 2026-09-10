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
