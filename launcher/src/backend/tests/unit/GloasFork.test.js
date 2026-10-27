import { compareVersions, gloasForkTime, gloasReadiness, GLOAS_FORKS } from "@/share/gloasFork";

const SEPOLIA_FORK = 1791294816; // 2026-10-06, epoch 353024
const HOODI_FORK = 1793036568; // 2026-10-26 17:42:48 UTC, epoch 132352

const service = (service, network, imageVersion, name = service) => ({ service, name, config: { network, imageVersion } });

// Hoodi's fork was postponed without a new date; the tests check it as it was scheduled
const HOODI_EPOCH = GLOAS_FORKS.hoodi.epoch;
beforeEach(() => (GLOAS_FORKS.hoodi.epoch = 132352));
afterEach(() => (GLOAS_FORKS.hoodi.epoch = HOODI_EPOCH));

test("hoodi's postponed fork is not scheduled", () => {
  expect(HOODI_EPOCH).toBeNull();
});

test("the fork time follows from genesis and epoch", () => {
  expect(gloasForkTime("sepolia")).toBe(SEPOLIA_FORK);
  expect(gloasForkTime("hoodi")).toBe(HOODI_FORK);
});

test("an unscheduled or unknown network has no fork time", () => {
  expect(GLOAS_FORKS.mainnet.epoch).toBeNull();
  expect(gloasForkTime("mainnet")).toBeNull();
  expect(gloasForkTime("gnosis")).toBeNull();
  expect(gloasForkTime(undefined)).toBeNull();
});

test.each([
  ["v8.2.2", "8.3.0-rc.0", -1],
  ["v8.3.0-rc.0", "8.3.0-rc.0", 0],
  ["v8.3.0-rc.1", "8.3.0-rc.0", 1],
  ["v8.3.0", "8.3.0-rc.0", 1],
  ["multiarch-v26.8.0", "26.10.0", -1],
  ["multiarch-v26.10.0", "26.10.0", 0],
  ["v1.17.10", "1.17.7", 1],
  ["1.12", "1.12.0", 0],
  ["v3.0.0-rc.10", "3.0.0-rc.9", 1],
])("compareVersions(%s, %s) = %d", (a, b, expected) => {
  expect(compareVersions(a, b)).toBe(expected);
});

test("tags that are not versions are not compared", () => {
  expect(compareVersions("latest", "1.0.0")).toBeNull();
  expect(compareVersions(undefined, "1.0.0")).toBeNull();
});

test("only services below the minimum are listed", () => {
  const result = gloasReadiness(
    [
      service("TekuBeaconService", "sepolia", "26.8.1", "Teku"),
      service("GethService", "sepolia", "v1.17.7", "Geth"),
      service("LighthouseValidatorService", "sepolia", "v8.3.0-rc.0", "Lighthouse"),
      service("NimbusBeaconService", "sepolia", "multiarch-v26.8.0", "Nimbus"),
    ],
    SEPOLIA_FORK - 86400
  );

  expect(result).toEqual([
    {
      network: "sepolia",
      forkTime: SEPOLIA_FORK,
      forked: false,
      outdated: [
        { name: "Teku", service: "TekuBeaconService", version: "26.8.1", minimum: "26.9.1" },
        { name: "Nimbus", service: "NimbusBeaconService", version: "multiarch-v26.8.0", minimum: "26.10.0" },
      ],
    },
  ]);
});

test("the result says when the fork has passed", () => {
  const [sepolia] = gloasReadiness([service("PrysmBeaconService", "sepolia", "v7.1.8")], SEPOLIA_FORK);

  expect(sepolia.forked).toBe(true);
});

test("networks without a schedule, unchecked services and unknown tags are skipped", () => {
  const result = gloasReadiness(
    [
      service("FlashbotsMevBoostService", "hoodi", "1.12"),
      service("TekuBeaconService", "mainnet", "26.8.1"),
      service("MetricsExporterService", "sepolia", "v1.0.0"),
      service("GethService", "sepolia", "latest"),
      { service: "GethService" },
    ],
    SEPOLIA_FORK
  );

  expect(result).toEqual([]);
});

test("a service without a compatible release is always listed", () => {
  const [sepolia] = gloasReadiness([service("CharonService", "sepolia", "v1.11.0", "Obol Charon")], SEPOLIA_FORK);

  expect(sepolia.outdated).toEqual([{ name: "Obol Charon", service: "CharonService", version: "v1.11.0", minimum: null }]);
});

test("on hoodi every client is checked against the first release that follows its fork", () => {
  const result = gloasReadiness(
    [
      service("LodestarBeaconService", "hoodi", "v1.49.0", "Lodestar"),
      service("LodestarValidatorService", "hoodi", "v1.50.0", "Lodestar VC"),
      service("TekuBeaconService", "hoodi", "26.10.0", "Teku"),
      service("NimbusBeaconService", "hoodi", "multiarch-v26.10.1", "Nimbus"),
      service("PrysmBeaconService", "hoodi", "v7.2.1", "Prysm"),
      service("BesuService", "hoodi", "26.9.0", "Besu"),
      service("GethService", "hoodi", "v1.17.8", "Geth"),
      service("RethService", "hoodi", "v2.7.0", "Reth"),
      service("RethService", "hoodi", "v2.8.0", "Reth new"),
      service("CharonService", "hoodi", "v1.11.1", "Obol Charon"),
      service("CharonService", "hoodi", "v2.0.0-rc2", "Obol Charon new"),
      service("CharonService", "hoodi", "v2.0.0-rc1", "Obol Charon rc1"),
      service("PlutoService", "hoodi", "v1.7.1", "Obol Pluto"),
      service("EthrexService", "hoodi", "30.0.0-rc.2", "Ethrex"),
      service("EthrexService", "hoodi", "29.0.1", "Ethrex old"),
    ],
    HOODI_FORK - 86400
  );

  expect(result).toEqual([
    {
      network: "hoodi",
      forkTime: HOODI_FORK,
      forked: false,
      outdated: [
        { name: "Lodestar", service: "LodestarBeaconService", version: "v1.49.0", minimum: "1.50.0" },
        { name: "Teku", service: "TekuBeaconService", version: "26.10.0", minimum: "26.10.1" },
        { name: "Prysm", service: "PrysmBeaconService", version: "v7.2.1", minimum: "7.3.0-rc.1" },
        { name: "Besu", service: "BesuService", version: "26.9.0", minimum: "26.10.0" },
        { name: "Geth", service: "GethService", version: "v1.17.8", minimum: "1.17.9" },
        { name: "Reth", service: "RethService", version: "v2.7.0", minimum: "2.8.0" },
        { name: "Obol Charon", service: "CharonService", version: "v1.11.1", minimum: "2.0.0-rc2" },
        { name: "Obol Charon rc1", service: "CharonService", version: "v2.0.0-rc1", minimum: "2.0.0-rc2" },
        { name: "Obol Pluto", service: "PlutoService", version: "v1.7.1", minimum: null },
        { name: "Ethrex old", service: "EthrexService", version: "29.0.1", minimum: "30.0.0-rc.1" },
      ],
    },
  ]);
});
