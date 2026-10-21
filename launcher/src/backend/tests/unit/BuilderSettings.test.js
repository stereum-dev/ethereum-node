import YAML from "yaml";
import { BuilderSettings } from "../../BuilderSettings";
import { gloasForkTime, GLOAS_MIN_VERSIONS } from "@/share/gloasFork";

const SETUP = "setup-1";
const service = (id, name, version, command, extra = {}) => ({
  id,
  service: name,
  imageVersion: version,
  command,
  volumes: [],
  dependencies: { consensusClients: [{ id: "bn" }], executionClients: [], mevboost: [], otherServices: [] },
  ...extra,
});

function setup({ lodestarVersion = "v1.50.0", running = ["lodestar"], beaconMev = [] } = {}) {
  const services = [
    { id: "bn", service: "LighthouseBeaconService", dependencies: { mevboost: beaconMev, consensusClients: [] } },
    service("lodestar", "LodestarValidatorService", lodestarVersion, ["--network=hoodi", "--builder"]),
    service("teku", "TekuValidatorService", "26.10.0", ["--network=hoodi"]),
    service("prysm", "PrysmValidatorService", "v7.2.1", ["--hoodi"]),
    service("dvt", "LodestarValidatorService", "v1.50.0", ["--builder.selection=builderalways"], {
      dependencies: { consensusClients: [{ id: "charon" }], executionClients: [], mevboost: [], otherServices: [] },
    }),
    {
      id: "charon",
      service: "CharonService",
      imageVersion: "v1.11.1",
      command: ["run", "--builder-api"],
      volumes: [{ servicePath: "/opt/charon", destinationPath: "/opt/stereum/charon-charon" }],
      dependencies: { mevboost: [], consensusClients: [] },
    },
  ];
  let multisetup = { [SETUP]: { name: "ethSetup1", network: "hoodi", services: services.map((s) => s.id) } };
  const subtasks = [];
  const serviceManager = {
    nodeConnection: {
      sshService: { exec: jest.fn(() => Promise.resolve({ rc: 0, stdout: "", stderr: "" })) },
      listServices: jest.fn(() => Promise.resolve(running.map((id) => ({ Names: `stereum-${id}` })))),
      taskManager: {
        otherTasksHandler: jest.fn((ref, name, ok, data) => name && typeof ok === "boolean" && subtasks.push({ name, ok, data })),
      },
    },
    configManager: {
      readMultiSetup: jest.fn(() => Promise.resolve(YAML.stringify(multisetup))),
      writeMultiSetup: jest.fn((obj) => Promise.resolve((multisetup = obj))),
    },
    readServiceConfigurations: jest.fn(() => Promise.resolve(services)),
    writeServiceConfigurationKeepingAutoupdate: jest.fn(() => Promise.resolve()),
    manageServiceState: jest.fn(() => Promise.resolve()),
  };
  return { bs: new BuilderSettings(serviceManager), serviceManager, services, subtasks, multisetup: () => multisetup };
}

const titan = {
  relays: [{ name: "Titan", url: "https://0xaa@hoodi.titanrelay.xyz" }],
  minBid: "0",
  maxExecutionPayment: "0",
  boostFactor: null,
};
const builders = { clients: Object.fromEntries(["lodestar", "teku", "prysm", "dvt"].map((id) => [id, titan])) };

// one day before the Hoodi fork, with a Prysm release for it
const prysmMinimum = GLOAS_MIN_VERSIONS.hoodi.PrysmValidatorService;
beforeAll(() => {
  jest.useFakeTimers().setSystemTime((gloasForkTime("hoodi") - 86400) * 1000);
  GLOAS_MIN_VERSIONS.hoodi.PrysmValidatorService = "7.2.1";
});
afterAll(() => {
  jest.useRealTimers();
  GLOAS_MIN_VERSIONS.hoodi.PrysmValidatorService = prysmMinimum;
});

test("saving writes the setup's settings and the flags of the clients that can take them, and restarts the running ones", async () => {
  const { bs, serviceManager, services, subtasks, multisetup } = setup();

  const result = await bs.setBuilderSettings({ setupId: SETUP, builders });

  expect(result.code).toBe(0);
  expect(multisetup()[SETUP].builders.clients.lodestar.relays).toEqual([
    { name: "Titan", url: "https://hoodi.titanrelay.xyz", authData: "" },
  ]);
  expect(services[1].command).toEqual(["--network=hoodi", "--builder", "--builder.urls=https://hoodi.titanrelay.xyz"]);
  expect(serviceManager.writeServiceConfigurationKeepingAutoupdate).toHaveBeenCalledTimes(1);
  expect(serviceManager.manageServiceState).toHaveBeenCalledWith("lodestar", "restarted");
  // Teku has no Hoodi release yet, Prysm waits for the fork without MEV-Boost, the DVT client waits for Charon 2.0
  expect(services[2].command).toEqual(["--network=hoodi"]);
  expect(services[3].command).toEqual(["--hoodi"]);
  expect(services[4].command).toEqual(["--builder.selection=builderalways"]);
  expect(result.results).toEqual(
    expect.arrayContaining([
      { id: "teku", applied: false, reason: "update" },
      { id: "prysm", applied: false, reason: "after-fork" },
      { id: "dvt", applied: false, reason: "dvt-update" },
    ])
  );
  expect(subtasks.map((s) => s.name)).toEqual(
    expect.arrayContaining([
      "Saved settings",
      "Charon: update",
      "Lodestar: flags",
      "Lodestar: restarted",
      "Teku: update",
      "Prysm: after-fork",
      "Result",
    ])
  );
  expect(subtasks.every((s) => s.name.length <= 28)).toBe(true);
});

test("settings the clients already run with are not written again", async () => {
  const { bs, serviceManager } = setup();
  await bs.setBuilderSettings({ setupId: SETUP, builders });
  serviceManager.writeServiceConfigurationKeepingAutoupdate.mockClear();
  serviceManager.manageServiceState.mockClear();

  await bs.setBuilderSettings({ setupId: SETUP, builders });

  expect(serviceManager.writeServiceConfigurationKeepingAutoupdate).not.toHaveBeenCalled();
  expect(serviceManager.manageServiceState).not.toHaveBeenCalled();
});

test("a stopped client gets its flags but stays stopped, and Prysm takes them early while its beacon node has MEV-Boost", async () => {
  const { bs, serviceManager, services } = setup({ running: [], beaconMev: [{ id: "mev" }] });

  await bs.setBuilderSettings({ setupId: SETUP, builders });

  expect(services[1].command).toContain("--builder.urls=https://hoodi.titanrelay.xyz");
  expect(services[3].command).toContain("--builder-urls=https://hoodi.titanrelay.xyz");
  expect(serviceManager.manageServiceState).not.toHaveBeenCalled();
});

test("bad settings are refused before anything is written", async () => {
  const { bs, serviceManager } = setup();
  const result = await bs.setBuilderSettings({ setupId: SETUP, builders: { clients: { lodestar: { ...titan, minBid: "abc" } } } });
  expect(result).toEqual({ code: 1, info: "invalid minimum bid" });
  expect(serviceManager.configManager.writeMultiSetup).not.toHaveBeenCalled();
});

test("the dialog gets the setup's relays from MEV-Boost and what each client would get", async () => {
  const { bs, services } = setup();
  services.push({
    id: "mev",
    service: "FlashbotsMevBoostService",
    entrypoint: ["/app/mev-boost", "-relays", "https://0xaa@hoodi.titanrelay.xyz,https://0xbb@relay.example"],
  });
  bs.serviceManager.configManager.readMultiSetup = jest.fn(() =>
    Promise.resolve(YAML.stringify({ [SETUP]: { name: "ethSetup1", network: "hoodi", services: services.map((s) => s.id) } }))
  );

  const [entry] = await bs.getBuilderSettings();

  expect(entry).toMatchObject({ setupId: SETUP, network: "hoodi", saved: false, mevBoost: "mev" });
  expect(entry.mevBoostRelays).toEqual(["https://0xaa@hoodi.titanrelay.xyz", "https://0xbb@relay.example"]);
  expect(entry.clients.map((c) => [c.id, c.support.reason])).toEqual([
    ["lodestar", null],
    ["teku", "update"],
    ["prysm", "after-fork"],
    ["dvt", "dvt-update"],
  ]);
});

test("each client gets its own settings, and a client no longer in the setup is dropped", async () => {
  const { bs, services, multisetup } = setup({ beaconMev: [{ id: "mev" }] });

  await bs.setBuilderSettings({
    setupId: SETUP,
    builders: { clients: { lodestar: titan, prysm: { ...titan, relays: [] }, gone: titan } },
  });

  expect(services[1].command).toContain("--builder.urls=https://hoodi.titanrelay.xyz");
  expect(services[3].command.some((c) => c.startsWith("--builder-urls"))).toBe(false);
  expect(Object.keys(multisetup()[SETUP].builders.clients)).toEqual(["lodestar", "prysm"]);
});

test("a setup saved with a setup default is read as settings per client", async () => {
  const { bs, services } = setup();
  bs.serviceManager.configManager.readMultiSetup = jest.fn(() =>
    Promise.resolve(
      YAML.stringify({
        [SETUP]: {
          name: "ethSetup1",
          network: "hoodi",
          services: services.map((s) => s.id),
          builders: {
            ...titan,
            relays: [{ name: "Titan", url: "https://hoodi.titanrelay.xyz", authData: "" }],
            clients: { teku: { own: true, relays: [] } },
          },
        },
      })
    )
  );

  const [entry] = await bs.getBuilderSettings();

  expect(entry.saved).toBe(true);
  expect(entry.builders.clients.lodestar.relays).toHaveLength(1);
  expect(entry.builders.clients.teku.relays).toEqual([]);
});

test("without restart the flags are written and the running clients keep running until their next restart", async () => {
  const { bs, serviceManager, services, subtasks } = setup();

  const result = await bs.setBuilderSettings({ setupId: SETUP, builders, restart: false });

  expect(services[1].command).toContain("--builder.urls=https://hoodi.titanrelay.xyz");
  expect(serviceManager.manageServiceState).not.toHaveBeenCalled();
  expect(result.results).toEqual(expect.arrayContaining([{ id: "lodestar", applied: true, changed: true, restarted: false }]));
  expect(subtasks.map((s) => s.name)).toContain("Lodestar: not restarted");
});

test("the ePBS check asks every builder once from the server and reports each answer", async () => {
  const { bs, serviceManager, subtasks } = setup();
  const answers = { "hoodi.titanrelay.xyz": "bad request\n400", "relay-hoodi.ultrasound.money": "\n404", "down.example": "\n000" };
  serviceManager.nodeConnection.sshService.exec.mockImplementation((cmd) => {
    const host = Object.keys(answers).find((h) => cmd.includes(h));
    return Promise.resolve({ rc: 0, stdout: answers[host], stderr: "" });
  });

  const result = await bs.probeBuilders({
    urls: [
      "https://0xaa@hoodi.titanrelay.xyz",
      "https://hoodi.titanrelay.xyz/",
      "https://relay-hoodi.ultrasound.money",
      "https://down.example",
      "not a url",
    ],
  });

  expect(result).toEqual([
    { url: "https://hoodi.titanrelay.xyz", status: 400, result: "ready" },
    { url: "https://relay-hoodi.ultrasound.money", status: 404, result: "no" },
    { url: "https://down.example", status: 0, result: "unreachable" },
  ]);
  expect(serviceManager.nodeConnection.sshService.exec).toHaveBeenCalledTimes(3);
  expect(serviceManager.nodeConnection.sshService.exec.mock.calls[0][0]).toContain(
    "-X POST -H 'Content-Type: application/json' -H 'Eth-Consensus-Version: gloas'"
  );
  expect(subtasks.map((s) => [s.name, s.ok])).toEqual([
    ["hoodi.titanrelay.xyz", true],
    ["relay-hoodi.ultrasound.money", true],
    ["down.example", false],
    ["Result", true],
  ]);
  expect(subtasks[0].data).toContain("HTTP 400: ready\nbad request");
  expect(subtasks[3].data).toBe("1 of 3 answer ePBS");
});

test("a cluster's builders go to Charon and its proposer config, and its validator client restarts to render them", async () => {
  const { bs, serviceManager, services, subtasks } = setup({ running: ["lodestar", "charon", "dvt"] });
  const charon = services.find((s) => s.id === "charon");
  charon.imageVersion = "v2.0.0-rc2";
  const dvt = services.find((s) => s.id === "dvt");
  const configPath = "/opt/stereum/charon-charon/.charon/vc-config/proposer-config.json";
  const files = {
    [configPath]: JSON.stringify({
      version: 1,
      proposer_config: {},
      default_config: { fee_recipient: "0x1111111111111111111111111111111111111111", gas_limit: "200000000" },
    }),
  };
  // the file's change time and when the validator client started, in seconds
  const times = { mtime: 1000, started: 900 };
  serviceManager.nodeConnection.sshService.exec.mockImplementation((cmd) => {
    // paths and contents come double-quoted with ", $, ` and \\ escaped
    const unescape = (text) => text.replace(/\\(["$`\\])/g, "$1");
    if (cmd.startsWith("stat -c %Y"))
      return Promise.resolve({ rc: 0, stdout: `${times.mtime}\ntrue ${new Date(times.started * 1000).toISOString()}\n`, stderr: "" });
    const read = cmd.match(/^cat "([^"]+)"/);
    if (read) return Promise.resolve({ rc: 0, stdout: files[read[1]] ?? "", stderr: "" });
    const write = cmd.match(/echo "((?:[^"\\]|\\.)*)" > "([^"]+)"$/);
    if (write) {
      files[write[2]] = unescape(write[1]);
      times.mtime = 2000;
    }
    return Promise.resolve({ rc: 0, stdout: "", stderr: "" });
  });
  const cluster = {
    relays: [{ name: "Titan", url: "https://hoodi.titanrelay.xyz" }],
    minBid: "0.01",
    maxExecutionPayment: "0",
    boostFactor: null,
  };

  const result = await bs.setBuilderSettings({ setupId: SETUP, builders: { clients: { ...builders.clients, charon: cluster } } });

  expect(result.code).toBe(0);
  expect(charon.command).toEqual(["run", "--builder-api", "--builder-urls=https://hoodi.titanrelay.xyz", "--builder-min-bid=10000000"]);
  expect(JSON.parse(files[configPath]).default_config.builder).toEqual({
    min_bid: "10000000",
    builder_boost_factor: "100",
    max_execution_payment: "0",
    builders: [{ url: "https://hoodi.titanrelay.xyz" }],
  });
  // the validator client is left to manage-service, which renders the file into its settings on start
  expect(dvt.command).toEqual(["--builder.selection=builderalways"]);
  expect(serviceManager.manageServiceState).toHaveBeenCalledWith("charon", "restarted");
  expect(serviceManager.manageServiceState).toHaveBeenCalledWith("dvt", "restarted");
  expect(subtasks.map((s) => s.name)).toEqual(expect.arrayContaining(["Charon: flags", "Charon: proposer config", "Lodestar: restarted"]));
  expect(subtasks.every((s) => s.name.length <= 28)).toBe(true);

  // after its restart it runs with the file, and the dialog shows what the file holds
  times.started = 3000;
  const [entry] = await bs.getBuilderSettings();
  expect(entry.clusters).toEqual([expect.objectContaining({ id: "charon", inSync: true, hasProposerConfig: true, vcs: ["dvt"] })]);
  expect(entry.clusters[0].current).toMatchObject({ minBid: "0.01", relays: [{ url: "https://hoodi.titanrelay.xyz" }] });
  expect(entry.clients.find((c) => c.id === "dvt")).toMatchObject({ support: { apply: true }, inSync: true });

  // a builder changed in the file outside the dialog: Charon's flags differ, and the validator client hasn't loaded it
  files[configPath] = JSON.stringify({
    ...JSON.parse(files[configPath]),
    default_config: {
      ...JSON.parse(files[configPath]).default_config,
      builder: { ...JSON.parse(files[configPath]).default_config.builder, min_bid: "0" },
    },
  });
  times.mtime = 4000;
  const [changed] = await bs.getBuilderSettings();
  expect(changed.clusters[0]).toMatchObject({ inSync: false, current: { minBid: "0" } });
  expect(changed.clients.find((c) => c.id === "dvt").inSync).toBe(false);
});

test("a cluster's validator client waits until Charon 2.0 wrote its proposer config", async () => {
  const { bs, services } = setup();
  services.find((s) => s.id === "charon").imageVersion = "v2.0.0-rc2";
  const [entry] = await bs.getBuilderSettings();
  expect(entry.clients.find((c) => c.id === "dvt").support.reason).toBe("dvt-pending");
  expect(entry.clusters[0]).toMatchObject({ support: { apply: true }, hasProposerConfig: false });
});
