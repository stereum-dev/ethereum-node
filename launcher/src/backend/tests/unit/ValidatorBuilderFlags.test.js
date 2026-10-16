import { ServiceManager } from "../../ServiceManager";
import { LighthouseBeaconService } from "../../ethereum-services/LighthouseBeaconService";
import { LighthouseValidatorService } from "../../ethereum-services/LighthouseValidatorService";
import { PrysmValidatorService } from "../../ethereum-services/PrysmValidatorService";
import { TekuValidatorService } from "../../ethereum-services/TekuValidatorService";
import { NimbusValidatorService } from "../../ethereum-services/NimbusValidatorService";
import { LodestarValidatorService } from "../../ethereum-services/LodestarValidatorService";
import { CharonService } from "../../ethereum-services/CharonService";
import { FlashbotsMevBoostService } from "../../ethereum-services/FlashbotsMevBoostService";

const FLAGS = {
  LighthouseValidatorService: "--builder-proposals",
  PrysmValidatorService: "--enable-builder=true",
  TekuValidatorService: "--validators-builder-registration-default-enabled=true",
  NimbusValidatorService: "--payload-builder",
  LodestarValidatorService: "--builder",
};
const VALIDATORS = [
  LighthouseValidatorService,
  PrysmValidatorService,
  TekuValidatorService,
  NimbusValidatorService,
  LodestarValidatorService,
];

// services read from their configs carry empty lists, freshly built ones null
const stored = (service) => {
  for (const key of ["executionClients", "consensusClients", "mevboost", "otherServices"]) service.dependencies[key] ??= [];
  service.volumes ??= [];
  return service;
};

const flagsOf = (service) => {
  const command = typeof service.command === "string" ? service.command.split(" ") : service.command;
  return command.filter((c) => c === FLAGS[service.service]);
};

function setup() {
  const nodeConnection = {
    readServiceConfiguration: jest.fn(() => Promise.resolve({ autoupdate: true })),
    writeServiceConfiguration: jest.fn(() => Promise.resolve()),
    runPlaybook: jest.fn(() => Promise.resolve({ playbookRunRef: "ref" })),
  };
  const sm = new ServiceManager(nodeConnection);
  const beacon = stored(LighthouseBeaconService.buildByUserInput("hoodi", [], "/opt/stereum/lh", [], []));
  const mevboost = stored(FlashbotsMevBoostService.buildByUserInput("hoodi", "https://relay.example"));
  sm.addDependencies(mevboost, [beacon]);
  const validators = VALIDATORS.map((Validator, i) => stored(Validator.buildByUserInput("hoodi", [], `/opt/stereum/vc${i}`, [beacon])));
  return { sm, nodeConnection, beacon, mevboost, validators };
}

const written = (nodeConnection, id) => nodeConnection.writeServiceConfiguration.mock.calls.map(([c]) => c).find((c) => c.id === id);

test("deleting MEV-Boost removes the builder flag of every validator client on its beacon node", async () => {
  const { sm, nodeConnection, beacon, mevboost, validators } = setup();

  await sm.deleteService({ service: { config: { serviceID: mevboost.id } } }, [], [beacon, mevboost, ...validators]);

  for (const validator of validators) {
    expect(flagsOf(validator)).toHaveLength(0);
    expect(written(nodeConnection, validator.id).command).not.toContain(FLAGS[validator.service]);
  }
});

test("disconnecting MEV-Boost removes the flag and connecting it again adds it back once", async () => {
  const { sm, nodeConnection, beacon, mevboost, validators } = setup();
  const services = [beacon, mevboost, ...validators];
  const task = (consensusClients) => ({
    service: { config: { serviceID: mevboost.id } },
    data: { executionClients: [], consensusClients, otherServices: [] },
  });

  await sm.modifyServices([task([])], services);
  expect(validators.map(flagsOf).flat()).toHaveLength(0);
  expect(written(nodeConnection, validators[0].id)).toBeDefined();

  nodeConnection.writeServiceConfiguration.mockClear();
  await sm.modifyServices([task([{ config: { serviceID: beacon.id } }])], services);
  for (const validator of validators) expect(flagsOf(validator)).toEqual([FLAGS[validator.service]]);
  expect(written(nodeConnection, validators[0].id).command).toContain("--builder-proposals");
});

test("installing MEV-Boost adds the flag back to installed validator clients", () => {
  const { sm, beacon, mevboost, validators } = setup();
  sm.removeDependencies(beacon, mevboost);
  sm.syncValidatorBuilderFlags(validators, [beacon], [beacon.id]);
  expect(validators.map(flagsOf).flat()).toHaveLength(0);

  sm.addDependencies(mevboost, [beacon]);
  const changed = sm.syncValidatorBuilderFlags(validators, [beacon], [beacon.id]);

  expect(changed).toHaveLength(validators.length);
  for (const validator of validators) expect(flagsOf(validator)).toEqual([FLAGS[validator.service]]);
});

test("the flag stays while another beacon node of the validator client still uses MEV-Boost", () => {
  const { sm, beacon, mevboost } = setup();
  const other = stored(LighthouseBeaconService.buildByUserInput("hoodi", [], "/opt/stereum/lh2", [], []));
  const vc = stored(LighthouseValidatorService.buildByUserInput("hoodi", [], "/opt/stereum/vc", [beacon, other]));
  sm.removeDependencies(beacon, mevboost);
  sm.addDependencies(stored(FlashbotsMevBoostService.buildByUserInput("hoodi", "https://relay.example")), [other]);

  expect(sm.syncValidatorBuilderFlags([vc], [beacon, other], [beacon.id])).toHaveLength(0);
  expect(flagsOf(vc)).toHaveLength(1);
});

test("validator clients behind Charon and other beacon nodes are left alone", () => {
  const { sm, beacon, mevboost } = setup();
  const charon = stored(CharonService.buildByUserInput("hoodi", [], "/opt/stereum/charon", [beacon]));
  const dvt = stored(LodestarValidatorService.buildByUserInput("hoodi", [], "/opt/stereum/vc-dvt", [charon]));
  const elsewhere = stored(LighthouseBeaconService.buildByUserInput("hoodi", [], "/opt/stereum/lh2", [], []));
  const unrelated = stored(LighthouseValidatorService.buildByUserInput("hoodi", [], "/opt/stereum/vc2", [elsewhere]));
  sm.removeDependencies(beacon, mevboost);

  expect(sm.syncValidatorBuilderFlags([dvt, unrelated], [beacon, charon, elsewhere], [beacon.id, charon.id])).toHaveLength(0);
  expect(dvt.command).toContain("--builder");
  expect(dvt.command).toContain("--builder.selection=builderalways");
  expect(flagsOf(unrelated)).toHaveLength(1);
});

test("a command stored as a string keeps its form and loses only the builder flag", () => {
  const { sm, beacon, mevboost } = setup();
  const vc = stored(NimbusValidatorService.buildByUserInput("hoodi", [], "/opt/stereum/vc", [beacon]));
  vc.command = vc.command.join(" ").replace("--payload-builder", "--payload-builder=true");
  sm.removeDependencies(beacon, mevboost);

  sm.syncValidatorBuilderFlags([vc], [beacon], [beacon.id]);

  expect(typeof vc.command).toBe("string");
  expect(vc.command).not.toMatch(/--payload-builder/);
  expect(vc.command).toMatch(/--beacon-node=/);
});

test("Nimbus keeps --payload-builder for its Glamsterdam builder URL when MEV-Boost goes", () => {
  const { sm, beacon, mevboost } = setup();
  const vc = stored(NimbusValidatorService.buildByUserInput("hoodi", [], "/opt/stereum/vc", [beacon]));
  vc.command = [...vc.command, "--payload-builder-url=https://hoodi.titanrelay.xyz"];
  sm.removeDependencies(beacon, mevboost);

  expect(sm.syncValidatorBuilderFlags([vc], [beacon], [beacon.id])).toHaveLength(0);
  expect(vc.command).toContain("--payload-builder");
});
