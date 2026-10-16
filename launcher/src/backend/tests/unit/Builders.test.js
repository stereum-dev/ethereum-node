import {
  ethToGwei,
  builderUrl,
  normalizeAuthData,
  effectiveBuilderSettings,
  validateBuilderSettings,
  builderSupport,
  builderConfiguration,
  applyBuilderFlags,
  mergeLighthouseBuilderFile,
  cleanBuilderSettings,
  DEFAULT_BUILDER_SETTINGS,
  bidOutcome,
  mevBoostMinBid,
  currentBoost,
} from "@/share/builders";
import { gloasForkTime } from "@/share/gloasFork";

const TITAN = {
  name: "Titan",
  url: "https://0xaa58208899c6105603b74396734a6263cc7d947f444f396a90f7b7d3e65d102aec7e5e5291b27e08d02c50a050825c2f@hoodi.titanrelay.xyz",
};
const OTHER = { name: "Other", url: "https://relay.example/", authData: "0x0123" };
const settings = (over = {}) => ({ ...DEFAULT_BUILDER_SETTINGS, relays: [TITAN, OTHER], ...over });
const HOODI_FORK = gloasForkTime("hoodi");

test("ethToGwei converts exactly and refuses what is not an amount", () => {
  expect(ethToGwei("0")).toBe("0");
  expect(ethToGwei("1.5")).toBe("1500000000");
  expect(ethToGwei("0.000000001")).toBe("1");
  expect(ethToGwei(".25")).toBe("250000000");
  expect(ethToGwei("0.0000000001")).toBeNull();
  expect(ethToGwei("-1")).toBeNull();
  expect(ethToGwei("1e3")).toBeNull();
  expect(ethToGwei("")).toBeNull();
});

test("builderUrl drops the relay key and the trailing slash", () => {
  expect(builderUrl(TITAN.url)).toBe("https://hoodi.titanrelay.xyz");
  expect(builderUrl("https://relay.example/")).toBe("https://relay.example");
  expect(builderUrl("ftp://relay.example")).toBeNull();
  expect(builderUrl("not a url")).toBeNull();
});

test("auth data is hex or empty", () => {
  expect(normalizeAuthData("")).toBe("");
  expect(normalizeAuthData("0xABcd")).toBe("0xabcd");
  expect(normalizeAuthData("0xabc")).toBeNull();
  expect(normalizeAuthData("relay.example")).toBeNull();
});

test("a validator client uses the setup's settings unless it has its own", () => {
  const builders = { ...settings(), clients: { vc1: { own: true, relays: [], boostFactor: 0 }, vc2: { own: false, relays: [] } } };
  expect(effectiveBuilderSettings(builders, "vc1")).toMatchObject({ own: true, relays: [], boostFactor: 0 });
  expect(effectiveBuilderSettings(builders, "vc2").relays).toHaveLength(2);
  expect(effectiveBuilderSettings(builders, "vc3").own).toBe(false);
  expect(effectiveBuilderSettings(undefined, "vc3")).toMatchObject({ relays: [], minBid: "0" });
});

test("validation names every bad value", () => {
  expect(validateBuilderSettings(settings())).toEqual([]);
  const problems = validateBuilderSettings(
    settings({ relays: [{ url: "x", authData: "zz" }], minBid: "a", maxExecutionPayment: "-1", boostFactor: "1.5" })
  );
  expect(problems).toHaveLength(5);
});

test("each client gets the relays in its own syntax, without the relay key", () => {
  const s = settings();
  expect(builderConfiguration("LodestarValidatorService", s).flags).toEqual([
    "--builder.urls=https://hoodi.titanrelay.xyz,https://relay.example#0x0123",
  ]);
  expect(builderConfiguration("PrysmValidatorService", s).flags).toEqual([
    "--builder-urls=https://hoodi.titanrelay.xyz,https://relay.example#0x0123",
  ]);
  const teku = builderConfiguration("TekuValidatorService", s);
  expect(teku.flags).toEqual(["--Xbuilder-urls=https://hoodi.titanrelay.xyz,https://relay.example"]);
  expect(teku.notes).toContain("auth-ignored");
  const nimbus = builderConfiguration("NimbusValidatorService", s);
  expect(nimbus.flags).toEqual(["--payload-builder-url=https://hoodi.titanrelay.xyz"]);
  expect(nimbus.notes).toContain("single-relay");
  expect(builderConfiguration("NimbusValidatorService", settings({ nimbusRelay: "https://relay.example" })).flags).toEqual([
    "--payload-builder-url=https://relay.example",
  ]);
  expect(builderConfiguration("LighthouseValidatorService", s).file).toEqual({
    min_bid: 0,
    builders: [
      { enabled: true, url: "https://hoodi.titanrelay.xyz", max_execution_payment: 0 },
      { enabled: true, url: "https://relay.example", max_execution_payment: 0, auth_data: "0x0123" },
    ],
  });
});

test("amounts go out in gwei, a trusted payment needs Lodestar's danger flag and its boost the maxprofit selection", () => {
  const s = settings({ relays: [TITAN], minBid: "0.01", maxExecutionPayment: "0.5", boostFactor: 80 });
  expect(builderConfiguration("LodestarValidatorService", s).flags).toEqual([
    "--builder.urls=https://hoodi.titanrelay.xyz",
    "--builder.minBid=10000000",
    "--builder.maxExecutionPayment=500000000",
    "--allowDangerousTrustedPayments",
    "--builder.selection=maxprofit",
    "--builder.boostFactor=80",
  ]);
  expect(builderConfiguration("PrysmValidatorService", s).flags).toEqual([
    "--builder-urls=https://hoodi.titanrelay.xyz",
    "--builder-min-bid=10000000",
    "--builder-max-execution-payment=500000000",
    "--builder-boost-factor=80",
  ]);
  expect(builderConfiguration("NimbusValidatorService", s).notes).toContain("no-limits");
  expect(builderConfiguration("LighthouseValidatorService", s).file).toEqual({
    min_bid: 10000000,
    builder_boost_factor: 80,
    builders: [{ enabled: true, url: "https://hoodi.titanrelay.xyz", max_execution_payment: 500000000 }],
  });
});

test("no relays and defaults leave no flags", () => {
  for (const service of ["LodestarValidatorService", "PrysmValidatorService", "TekuValidatorService", "NimbusValidatorService"]) {
    expect(builderConfiguration(service, DEFAULT_BUILDER_SETTINGS).flags).toEqual([]);
  }
  expect(builderConfiguration("LighthouseValidatorService", DEFAULT_BUILDER_SETTINGS).file).toEqual({ min_bid: 0, builders: [] });
});

test("applying replaces Stereum's builder flags and keeps everything else", () => {
  const command = [
    "--network=hoodi",
    "--builder",
    "--builder.urls=https://old.example",
    "--builder.selection=maxprofit",
    "--allowDangerousTrustedPayments",
  ];
  expect(applyBuilderFlags("LodestarValidatorService", command, ["--builder.urls=https://new.example"])).toEqual([
    "--network=hoodi",
    "--builder",
    "--builder.urls=https://new.example",
  ]);
  expect(applyBuilderFlags("TekuValidatorService", "--network=hoodi --Xbuilder-urls=https://old.example", [])).toBe("--network=hoodi");
});

test("Nimbus gets --payload-builder with its builder URL", () => {
  expect(applyBuilderFlags("NimbusValidatorService", ["--network=hoodi"], ["--payload-builder-url=https://r.example"])).toEqual([
    "--network=hoodi",
    "--payload-builder-url=https://r.example",
    "--payload-builder",
  ]);
  expect(applyBuilderFlags("NimbusValidatorService", ["--payload-builder=true"], ["--payload-builder-url=https://r.example"])).toEqual([
    "--payload-builder=true",
    "--payload-builder-url=https://r.example",
  ]);
});

test("Lighthouse's per-key settings survive a rewrite of its builder file", () => {
  const existing = { min_bid: 5, builders: [{ url: "https://old.example" }], validator_configs: { "0xabc": { builders: [] } } };
  expect(mergeLighthouseBuilderFile(existing, { min_bid: 0, builders: [] })).toEqual({
    min_bid: 0,
    builders: [],
    validator_configs: { "0xabc": { builders: [] } },
  });
  expect(mergeLighthouseBuilderFile(null, { min_bid: 0, builders: [] })).toEqual({ min_bid: 0, builders: [] });
});

test("builder settings are only written to releases that follow the network's fork", () => {
  const before = HOODI_FORK - 86400;
  expect(builderSupport({ service: "LodestarValidatorService", version: "v1.50.0", network: "hoodi", now: before })).toMatchObject({
    apply: true,
  });
  expect(builderSupport({ service: "LodestarValidatorService", version: "v1.49.0", network: "hoodi", now: before })).toMatchObject({
    apply: false,
    reason: "update",
    minimum: "1.50.0",
  });
  expect(builderSupport({ service: "TekuValidatorService", version: "26.10.0", network: "hoodi", now: before })).toMatchObject({
    reason: "update",
    minimum: "26.10.1",
  });
  // no Hoodi release of Prysm yet
  expect(builderSupport({ service: "PrysmValidatorService", version: "v7.2.1", network: "hoodi", now: before })).toMatchObject({
    reason: "update",
    minimum: null,
  });
  expect(builderSupport({ service: "LodestarValidatorService", version: "v1.50.0", network: "mainnet", now: before })).toMatchObject({
    reason: "not-scheduled",
  });
  expect(builderSupport({ service: "ValidatorEjectorService", version: "1", network: "hoodi", now: before })).toMatchObject({
    reason: "unsupported",
  });
});

test("Prysm and Nimbus wait for the fork when their beacon node has no MEV-Boost", () => {
  const sepoliaFork = gloasForkTime("sepolia");
  const args = { service: "PrysmValidatorService", version: "v7.2.1", network: "sepolia" };
  expect(builderSupport({ ...args, usesMevBoost: false, now: sepoliaFork - 60 })).toMatchObject({ apply: false, reason: "after-fork" });
  expect(builderSupport({ ...args, usesMevBoost: true, now: sepoliaFork - 60 })).toMatchObject({ apply: true });
  expect(builderSupport({ ...args, usesMevBoost: false, now: sepoliaFork + 60 })).toMatchObject({ apply: true });
  expect(
    builderSupport({ ...args, service: "NimbusValidatorService", version: "v26.10.0", usesMevBoost: false, now: sepoliaFork - 60 })
  ).toMatchObject({
    reason: "after-fork",
  });
});

test("stored settings carry only clean names, builder URLs and auth data, and nothing a shell would expand", () => {
  expect(builderUrl("https://relay.example/$(id)")).toBeNull();
  expect(builderUrl("https://relay.example/`id`")).toBeNull();
  const cleaned = cleanBuilderSettings({
    ...settings(),
    relays: [
      { name: "Titan $x", url: TITAN.url },
      { name: "Bad", url: "https://x/$(id)" },
    ],
    clients: { vc1: { own: true, relays: [OTHER] }, vc2: { own: false, relays: [TITAN] } },
  });
  expect(cleaned.relays).toEqual([{ name: "Titan x", url: "https://hoodi.titanrelay.xyz", authData: "" }]);
  expect(cleaned.clients.vc1.relays).toEqual([{ name: "Other", url: "https://relay.example", authData: "0x0123" }]);
  expect(cleaned.clients.vc2).toEqual({ own: false });
});

test("the calculator follows each client: its default boost, the minimum bid and the capped promised payment", () => {
  const amounts = { local: "0.05", paid: "0.054", promised: "0" };
  // 90% of 0.054 = 0.0486 < 0.05
  expect(bidOutcome("LodestarValidatorService", DEFAULT_BUILDER_SETTINGS, amounts)).toMatchObject({
    winner: "local",
    reason: "lower",
    boost: 90,
  });
  expect(bidOutcome("PrysmValidatorService", DEFAULT_BUILDER_SETTINGS, amounts)).toMatchObject({ winner: "builder", boost: 100 });
  expect(bidOutcome("TekuValidatorService", { ...DEFAULT_BUILDER_SETTINGS, boostFactor: 100 }, amounts).winner).toBe("builder");
  expect(bidOutcome("PrysmValidatorService", { ...DEFAULT_BUILDER_SETTINGS, boostFactor: 0 }, amounts).reason).toBe("boost-zero");
  expect(bidOutcome("PrysmValidatorService", { ...DEFAULT_BUILDER_SETTINGS, minBid: "0.06" }, amounts).reason).toBe("below-min");
  // a tie goes to the local block, for Nimbus to the bid
  const tie = { local: "0.05", paid: "0.05", promised: "0" };
  expect(bidOutcome("LighthouseValidatorService", DEFAULT_BUILDER_SETTINGS, tie).winner).toBe("local");
  expect(bidOutcome("NimbusValidatorService", DEFAULT_BUILDER_SETTINGS, tie).winner).toBe("builder");
  // the promised part counts up to the max trusted payment, for Nimbus all of it
  const promised = { local: "0.05", paid: "0.03", promised: "0.04" };
  expect(bidOutcome("PrysmValidatorService", DEFAULT_BUILDER_SETTINGS, promised)).toMatchObject({ winner: "local", counted: 0.03 });
  expect(bidOutcome("PrysmValidatorService", { ...DEFAULT_BUILDER_SETTINGS, maxExecutionPayment: "0.01" }, promised).counted).toBeCloseTo(
    0.04
  );
  expect(bidOutcome("NimbusValidatorService", DEFAULT_BUILDER_SETTINGS, promised)).toMatchObject({ winner: "builder" });
  expect(bidOutcome("LodestarValidatorService", DEFAULT_BUILDER_SETTINGS, { ...amounts, local: "x" })).toBeNull();
});

test("the first settings take over MEV-Boost's minimum bid and the boost the clients use now", () => {
  expect(mevBoostMinBid(["/app/mev-boost", "-relays", "https://r", "-min-bid", "0.05"])).toBe("0.05");
  expect(mevBoostMinBid(["/app/mev-boost", "-min-bid=0.1"])).toBe("0.1");
  expect(mevBoostMinBid(["/app/mev-boost", "-relays", "https://r"])).toBe("0");
  expect(currentBoost("LodestarValidatorService", ["--builder", "--builder.selection=maxprofit", "--builder.boostFactor=80"])).toBe(80);
  expect(currentBoost("LodestarValidatorService", ["--builder.selection=executionalways"])).toBe(0);
  expect(currentBoost("LodestarValidatorService", ["--builder"])).toBeNull();
  expect(currentBoost("LighthouseValidatorService", ["--builder-proposals", "--builder-boost-factor=95"])).toBe(95);
  expect(currentBoost("TekuValidatorService", "--network=hoodi", "--network=hoodi --builder-bid-compare-factor=85")).toBe(85);
  expect(currentBoost("TekuValidatorService", "--network=hoodi", "--builder-bid-compare-factor=BUILDER_ALWAYS")).toBeNull();
  expect(currentBoost("PrysmValidatorService", ["--enable-builder=true"], ["--local-block-value-boost=10"])).toBeNull();
});

test("Nimbus from 26.10.1 gets the minimum bid and an explicit max trusted payment, older ones a note", () => {
  const s = settings({ relays: [TITAN], minBid: "0.01" });
  expect(builderConfiguration("NimbusValidatorService", s, "multiarch-v26.10.1")).toMatchObject({
    flags: ["--payload-builder-url=https://hoodi.titanrelay.xyz", "--builder-min-bid=10000000", "--builder-max-execution-payment=0"],
    notes: [],
  });
  expect(builderConfiguration("NimbusValidatorService", s, "multiarch-v26.10.0")).toMatchObject({
    flags: ["--payload-builder-url=https://hoodi.titanrelay.xyz"],
    notes: ["no-limits"],
  });
  // without a relay there is nothing to cap
  expect(builderConfiguration("NimbusValidatorService", DEFAULT_BUILDER_SETTINGS, "multiarch-v26.10.1").flags).toEqual([]);
  expect(applyBuilderFlags("NimbusValidatorService", ["--builder-max-execution-payment=5", "--network=hoodi"], [])).toEqual([
    "--network=hoodi",
  ]);
  const promised = { local: "0.05", paid: "0.03", promised: "0.04" };
  expect(bidOutcome("NimbusValidatorService", DEFAULT_BUILDER_SETTINGS, promised, "multiarch-v26.10.1").winner).toBe("local");
  expect(bidOutcome("NimbusValidatorService", DEFAULT_BUILDER_SETTINGS, promised, "latest").winner).toBe("builder");
});
