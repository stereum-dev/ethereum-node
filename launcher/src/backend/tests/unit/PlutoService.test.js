import { PlutoService } from "../../ethereum-services/PlutoService.js";
import { CharonService } from "../../ethereum-services/CharonService.js";
import { ServicePort, servicePortProtocol } from "../../ethereum-services/ServicePort.js";

const buildBeaconMock = (service, endpoint) => {
  return {
    service: service,
    buildConsensusClientHttpEndpointUrl: jest.fn(() => endpoint),
    buildMinimalConfiguration: jest.fn(() => {
      return { id: service + "-id", service: service };
    }),
    command: [],
  };
};

test("buildConfiguration", () => {
  const ports = [new ServicePort(null, 3610, 3610, servicePortProtocol.tcp)];
  const beacon = buildBeaconMock("LighthouseBeaconService", "http://stereum-lh:5052");

  const pluto = PlutoService.buildByUserInput("hoodi", ports, "/opt/stereum/pluto", [beacon]).buildConfiguration();

  expect(pluto.service).toMatch("PlutoService");
  expect(pluto.image).toMatch("nethermindeth/pluto:v0.1.4");
  // pluto's binary is not where charon's is
  expect(pluto.entrypoint).toEqual(["/app/bin/pluto"]);
  expect(pluto.command).toContain("run");
  expect(pluto.command).toContain("--beacon-node-endpoints=http://stereum-lh:5052");
  expect(pluto.command).toContain("--validator-api-address=0.0.0.0:3600");
  expect(pluto.command).toContain("--monitoring-address=0.0.0.0:3620");
  expect(pluto.command).toContain("--builder-api");
  expect(pluto.network).toMatch("hoodi");
  expect(pluto.id).toHaveLength(36);
  expect(pluto.configVersion).toBe(1);
  // the image's working directory is /opt/charon, so the mount point has to be too
  expect(pluto.volumes).toContain("/opt/stereum/pluto-" + pluto.id + ":/opt/charon");
});

test("charon compatible command surface", () => {
  const ports = [new ServicePort(null, 3610, 3610, servicePortProtocol.tcp)];
  const beacon = buildBeaconMock("LighthouseBeaconService", "http://stereum-lh:5052");

  const pluto = PlutoService.buildByUserInput("hoodi", ports, "/opt/stereum/pluto", [beacon]);
  const charon = CharonService.buildByUserInput("hoodi", ports, "/opt/stereum/charon", [
    buildBeaconMock("LighthouseBeaconService", "http://stereum-lh:5052"),
  ]);

  // an in place swap carries the command over verbatim, so both clients have to
  // agree on every flag stereum sets
  expect(pluto.command).toEqual(charon.command);
});

test("nimbus needs json requests", () => {
  const ports = [new ServicePort(null, 3610, 3610, servicePortProtocol.tcp)];
  const beacon = buildBeaconMock("NimbusBeaconService", "http://stereum-nimbus:5052");

  const pluto = PlutoService.buildByUserInput("hoodi", ports, "/opt/stereum/pluto", [beacon]);

  expect(pluto.command).toContain("--feature-set-enable=json_requests");
});

test("teku graffiti append is disabled", () => {
  const ports = [new ServicePort(null, 3610, 3610, servicePortProtocol.tcp)];
  const beacon = buildBeaconMock("TekuBeaconService", "http://stereum-teku:5051");

  PlutoService.buildByUserInput("hoodi", ports, "/opt/stereum/pluto", [beacon]);

  expect(beacon.command).toContain("--validators-graffiti-client-append-format=DISABLED");
});

test("external ip is left to the user", () => {
  const ports = [new ServicePort(null, 3610, 3610, servicePortProtocol.tcp)];
  const beacon = buildBeaconMock("LighthouseBeaconService", "http://stereum-lh:5052");

  const pluto = PlutoService.buildByUserInput("hoodi", ports, "/opt/stereum/pluto", [beacon]);

  // the address cannot be derived from the configuration, so it is offered as
  // an expert option instead of being guessed at install time
  expect(pluto.command.some((c) => c.startsWith("--p2p-external-ip"))).toBe(false);
});

test("buildByConfiguration", () => {
  const pluto = PlutoService.buildByConfiguration({
    id: "pluto-id",
    service: "PlutoService",
    configVersion: 1,
    command: ["run", "--p2p-external-ip=80.249.121.1"],
    entrypoint: ["/app/bin/pluto"],
    image: "nethermindeth/pluto:v0.1.4",
    ports: ["0.0.0.0:3610:3610/tcp"],
    volumes: ["/opt/stereum/pluto-pluto-id:/opt/charon"],
    network: "hoodi",
  });

  expect(pluto).toBeInstanceOf(PlutoService);
  expect(pluto.id).toMatch("pluto-id");
  expect(pluto.imageVersion).toMatch("v0.1.4");
  expect(pluto.command).toContain("--p2p-external-ip=80.249.121.1");
});

test("inherits charon's data directory helpers", () => {
  const ports = [new ServicePort(null, 3610, 3610, servicePortProtocol.tcp)];
  const pluto = PlutoService.buildByUserInput("hoodi", ports, "/opt/stereum/pluto", []);
  const dataDir = "/opt/stereum/pluto-" + pluto.id;

  expect(pluto.getDataDir()).toMatch(dataDir);
  // "create enr" / "enr" / "dkg" all exist in pluto and read the same files
  expect(pluto.getCreateEnrCommand()).toMatch(`-v "${dataDir}:/opt/charon" nethermindeth/pluto:v0.1.4 create enr`);
  expect(pluto.getReadEnrCommand()).toMatch(`-v "${dataDir}:/opt/charon" nethermindeth/pluto:v0.1.4 enr`);
  expect(pluto.getDKGCommand("https://api.obol.tech/dv/abc")).toMatch(
    `nethermindeth/pluto:v0.1.4 dkg --definition-file=https://api.obol.tech/dv/abc --publish`
  );
  expect(pluto.getReadENRPrivateKeyCommand()).toMatch(`${dataDir}/.charon/charon-enr-private-key`);
  expect(pluto.getReadClusterLockCommand()).toMatch(`${dataDir}/.charon/cluster-lock.json`);
});

test("is reachable through the same endpoints as charon", () => {
  const ports = [new ServicePort(null, 3610, 3610, servicePortProtocol.tcp)];
  const pluto = PlutoService.buildByUserInput("hoodi", ports, "/opt/stereum/pluto", []);

  expect(pluto.buildConsensusClientHttpEndpointUrl()).toMatch("http://stereum-" + pluto.id + ":3600");
  expect(pluto.buildConsensusClientEndpoint()).toMatch("stereum-" + pluto.id + ":3600");
});
