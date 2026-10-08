import { configuredBeaconUrls, normalizeBeaconUrl, ssvBeaconAddr } from "../../BeaconEndpoints";

const svc = (service, command, env) => ({ service, config: { command, env } });

test("urls are normalized and unsafe values rejected", () => {
  expect(normalizeBeaconUrl(" http://10.0.0.5:5052/ ")).toEqual("http://10.0.0.5:5052");
  expect(normalizeBeaconUrl("https://beacon.example.com")).toEqual("https://beacon.example.com");
  expect(normalizeBeaconUrl("http://x:5052'; rm -rf /")).toBeNull();
  expect(normalizeBeaconUrl("ftp://x")).toBeNull();
});

test("beacon endpoints are read from every validator and DV client flag", () => {
  const services = [
    svc("LighthouseValidatorService", ["--beacon-nodes=http://lh:5052"]),
    svc("PrysmValidatorService", ["--beacon-rpc-provider=grpc:4000", "--beacon-rest-api-provider=http://prysm:3500"]),
    svc("TekuValidatorService", ["--beacon-node-api-endpoint=http://a:5051,http://b:5051"]),
    svc("NimbusValidatorService", ["--beacon-node", "http://nimbus:5052"]),
    svc("LodestarValidatorService", ["--beaconNodes=http://lodestar:9596"]),
    svc("CharonService", ["--beacon-node-endpoints=http://charon-upstream:5052"]),
  ];

  expect(configuredBeaconUrls(services)).toEqual([
    "http://lh:5052",
    "http://prysm:3500",
    "http://a:5051",
    "http://b:5051",
    "http://nimbus:5052",
    "http://lodestar:9596",
    "http://charon-upstream:5052",
  ]);
});

// Curl runs on the host, where container names and a container's loopback mean nothing
test("container hosts and loopback are skipped", () => {
  const services = [
    svc("LighthouseValidatorService", ["--beacon-nodes=http://stereum-6bc6f0d4-6df2-4d21-9a0d-b7a5e0b4a111:5052"]),
    svc("TekuValidatorService", ["--beacon-node-api-endpoint=http://127.0.0.1:5051"]),
    svc("LodestarValidatorService", ["--beaconNodes=http://localhost:9596"]),
    svc("NimbusValidatorService", ["--beacon-node=http://remote:5052"]),
  ];

  expect(configuredBeaconUrls(services)).toEqual(["http://remote:5052"]);
});

test("ssv addresses come before the external consensus link and duplicates are dropped", () => {
  const services = [
    svc("ExternalConsensusService", [], { link: "http://external:5052" }),
    svc("LighthouseValidatorService", ["--beacon-nodes=http://remote:5052"]),
  ];

  expect(configuredBeaconUrls(services, ["http://ssv-beacon:5052", "http://remote:5052"])).toEqual([
    "http://remote:5052",
    "http://ssv-beacon:5052",
    "http://external:5052",
  ]);
});

test("BeaconNodeAddr is read from an ssv config", () => {
  const config = "eth2:\n  Network: hoodi\n  BeaconNodeAddr: http://remote:5052 # comment\n  ETH1Addr: ws://x\n";
  expect(ssvBeaconAddr(config)).toEqual("http://remote:5052");
  expect(ssvBeaconAddr("eth2:\n  Network: hoodi\n")).toBeNull();
});
