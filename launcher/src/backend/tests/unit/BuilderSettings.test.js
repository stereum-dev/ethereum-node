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
    { id: "charon", service: "CharonService", dependencies: { mevboost: [], consensusClients: [] } },
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

const builders = {
  relays: [{ name: "Titan", url: "https://0xaa@hoodi.titanrelay.xyz" }],
  minBid: "0",
  maxExecutionPayment: "0",
  boostFactor: null,
};

// one day before the Hoodi fork, with a Prysm release for it
beforeAll(() => {
  jest.useFakeTimers().setSystemTime((gloasForkTime("hoodi") - 86400) * 1000);
  GLOAS_MIN_VERSIONS.hoodi.PrysmValidatorService = "7.2.1";
});
afterAll(() => {
  jest.useRealTimers();
  delete GLOAS_MIN_VERSIONS.hoodi.PrysmValidatorService;
});

test("saving writes the setup's settings and the flags of the clients that can take them, and restarts the running ones", async () => {
  const { bs, serviceManager, services, subtasks, multisetup } = setup();

  const result = await bs.setBuilderSettings({ setupId: SETUP, builders });

  expect(result.code).toBe(0);
  expect(multisetup()[SETUP].builders.relays).toEqual([{ name: "Titan", url: "https://hoodi.titanrelay.xyz", authData: "" }]);
  expect(services[1].command).toEqual(["--network=hoodi", "--builder", "--builder.urls=https://hoodi.titanrelay.xyz"]);
  expect(serviceManager.writeServiceConfigurationKeepingAutoupdate).toHaveBeenCalledTimes(1);
  expect(serviceManager.manageServiceState).toHaveBeenCalledWith("lodestar", "restarted");
  // Teku has no Hoodi release yet, Prysm waits for the fork without MEV-Boost, the DVT client is left alone
  expect(services[2].command).toEqual(["--network=hoodi"]);
  expect(services[3].command).toEqual(["--hoodi"]);
  expect(services[4].command).toEqual(["--builder.selection=builderalways"]);
  expect(result.results).toEqual(
    expect.arrayContaining([
      { id: "teku", applied: false, reason: "update" },
      { id: "prysm", applied: false, reason: "after-fork" },
      { id: "dvt", applied: false, reason: "dvt" },
    ])
  );
  expect(subtasks.map((s) => s.name)).toEqual(
    expect.arrayContaining([
      "Saved setup settings",
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
  const result = await bs.setBuilderSettings({ setupId: SETUP, builders: { ...builders, minBid: "abc" } });
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
    ["dvt", "dvt"],
  ]);
});
