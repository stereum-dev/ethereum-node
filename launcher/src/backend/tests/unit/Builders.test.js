import {
  ethToGwei,
  builderUrl,
  normalizeAuthData,
  clientBuilderSettings,
  validateBuilderSettings,
  builderSupport,
  builderConfiguration,
  applyBuilderFlags,
  mergeLighthouseBuilderFile,
  cleanBuilderSettings,
  DEFAULT_BUILDER_SETTINGS,
  bidOutcome,
  mevBoostMinBid,
  lighthouseFileInSync,
  capsTrustedPayments,
  epbsProbeResult,
  currentBoost,
} from "@/share/builders";
import { gloasForkTime, GLOAS_FORKS } from "@/share/gloasFork";

// as Hoodi's fork was scheduled before it was postponed (each test file has its own modules)
GLOAS_FORKS.hoodi.epoch = 132352;

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

test("each validator client has its own settings, and setups saved with a setup default keep working", () => {
  const perClient = { route: "direct", clients: { vc1: { ...settings(), boostFactor: 0 } } };
  expect(clientBuilderSettings(perClient, "vc1")).toMatchObject({ relays: [TITAN, OTHER], boostFactor: 0 });
  expect(clientBuilderSettings(perClient, "vc2")).toMatchObject({ relays: [], minBid: "0" });
  // the earlier layout: the setup's settings at the top, "own" for a client with its own
  const legacy = { ...settings(), clients: { vc1: { own: true, relays: [], boostFactor: 0 }, vc2: { own: false } } };
  expect(clientBuilderSettings(legacy, "vc1")).toMatchObject({ relays: [], boostFactor: 0 });
  expect(clientBuilderSettings(legacy, "vc2").relays).toHaveLength(2);
  expect(clientBuilderSettings(legacy, "vc3").relays).toHaveLength(2);
  expect(clientBuilderSettings(legacy, "vc1")).not.toHaveProperty("own");
  expect(clientBuilderSettings(undefined, "vc3")).toMatchObject({ relays: [], minBid: "0" });
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
  const first = applyBuilderFlags("NimbusValidatorService", ["--network=hoodi"], ["--payload-builder-url=https://r.example"], false);
  expect(first).toEqual(["--network=hoodi", "--payload-builder", "--payload-builder-url=https://r.example"]);
  // a second save sees the client in sync
  expect(applyBuilderFlags("NimbusValidatorService", first, ["--payload-builder-url=https://r.example"], false)).toEqual(first);
  // without a builder URL it keeps --payload-builder only for MEV-Boost
  expect(applyBuilderFlags("NimbusValidatorService", first, ["--builder-boost-factor=0"], false)).toEqual([
    "--network=hoodi",
    "--builder-boost-factor=0",
  ]);
  expect(applyBuilderFlags("NimbusValidatorService", first, [], true)).toEqual(["--network=hoodi", "--payload-builder"]);
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
  expect(builderSupport({ service: "PrysmValidatorService", version: "v7.2.1", network: "hoodi", now: before })).toMatchObject({
    reason: "update",
    minimum: "7.3.0-rc.1",
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
    clients: {
      vc1: {
        ...settings(),
        own: true,
        relays: [
          { name: "Titan $x", url: TITAN.url },
          { name: "Bad", url: "https://x/$(id)" },
        ],
      },
      vc2: { relays: [OTHER] },
    },
  });
  expect(cleaned.route).toBe("direct");
  expect(cleaned.clients.vc1.relays).toEqual([{ name: "Titan x", url: "https://hoodi.titanrelay.xyz", authData: "" }]);
  expect(cleaned.clients.vc1).not.toHaveProperty("own");
  expect(cleaned.clients.vc2).toMatchObject({ relays: [{ name: "Other", url: "https://relay.example", authData: "0x0123" }], minBid: "0" });
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

test("Lodestar gets a selection by name for local and most profit, and the boost factor only for other values", () => {
  const lodestar = (boostFactor) =>
    builderConfiguration("LodestarValidatorService", settings({ relays: [TITAN], boostFactor })).flags.slice(1);
  expect(lodestar(null)).toEqual([]);
  expect(lodestar(0)).toEqual(["--builder.selection=executionalways"]);
  expect(lodestar(100)).toEqual(["--builder.selection=maxprofit"]);
  expect(lodestar(80)).toEqual(["--builder.selection=maxprofit", "--builder.boostFactor=80"]);
  // switching from most profit to local replaces the selection
  const command = [
    "--network=hoodi",
    "--builder.urls=https://hoodi.titanrelay.xyz",
    "--builder.selection=maxprofit",
    "--builder.boostFactor=100",
  ];
  const flags = builderConfiguration("LodestarValidatorService", settings({ relays: [TITAN], boostFactor: 0 })).flags;
  expect(applyBuilderFlags("LodestarValidatorService", command, flags)).toEqual([
    "--network=hoodi",
    "--builder.urls=https://hoodi.titanrelay.xyz",
    "--builder.selection=executionalways",
  ]);
  expect(currentBoost("LodestarValidatorService", ["--builder.selection=executionalways"])).toBe(0);
  expect(currentBoost("LodestarValidatorService", ["--builder.selection=maxprofit"])).toBe(100);
});

test("the other clients take the block choice as a boost factor that each save replaces or removes", () => {
  const apply = (service, command, boostFactor) =>
    applyBuilderFlags(
      service,
      command,
      builderConfiguration(service, settings({ relays: [TITAN], boostFactor }), "multiarch-v26.10.1").flags
    );
  for (const [service, flag] of [
    ["PrysmValidatorService", "--builder-boost-factor"],
    ["TekuValidatorService", "--Xbuilder-boost-factor"],
    ["NimbusValidatorService", "--builder-boost-factor"],
  ]) {
    const profit = apply(service, ["--network=hoodi"], 100);
    const local = apply(service, profit, 0);
    const back = apply(service, local, null);
    expect(profit.filter((c) => c.startsWith(flag))).toEqual([`${flag}=100`]);
    expect(local.filter((c) => c.startsWith(flag))).toEqual([`${flag}=0`]);
    expect(back.filter((c) => c.startsWith(flag))).toEqual([]);
  }
  const file = (boostFactor) => builderConfiguration("LighthouseValidatorService", settings({ relays: [TITAN], boostFactor })).file;
  expect(mergeLighthouseBuilderFile(file(100), file(0)).builder_boost_factor).toBe(0);
  expect(mergeLighthouseBuilderFile(file(0), file(null))).not.toHaveProperty("builder_boost_factor");
});

test("an ePBS builder rejects the empty bid request, others don't know the route", () => {
  expect([200, 204, 400, 401, 415, 422].map(epbsProbeResult)).toEqual(Array(6).fill("ready"));
  expect([404, 405].map(epbsProbeResult)).toEqual(["no", "no"]);
  expect([0, 403, 500, 502, "x"].map(epbsProbeResult)).toEqual(Array(5).fill("unreachable"));
  // a builder that answers a route nobody has the same way says nothing about the bid route
  expect(epbsProbeResult(400, { status: 404, same: false })).toBe("ready");
  expect(epbsProbeResult(400, { status: 400, same: false })).toBe("ready");
  expect(epbsProbeResult(400, { status: 400, same: true })).toBe("no");
  expect(epbsProbeResult(400, { status: 0, same: false })).toBe("ready");
});

test("Lighthouse's builder file is compared by what it means, with its defaults filled in", () => {
  const own = { min_bid: 0, builder_boost_factor: 100, builders: [] };
  const empty = builderConfiguration("LighthouseValidatorService", settings({ relays: [] })).file;
  expect(lighthouseFileInSync(own, empty)).toBe(true);
  expect(lighthouseFileInSync(null, empty)).toBe(true);
  const titan = builderConfiguration("LighthouseValidatorService", settings({ relays: [{ url: "https://hoodi.titanrelay.xyz" }] })).file;
  expect(lighthouseFileInSync(own, titan)).toBe(false);
  expect(lighthouseFileInSync({ ...titan, builder_boost_factor: 100, validator_configs: { "0xab": {} } }, titan)).toBe(true);
  expect(lighthouseFileInSync({ ...titan, builder_boost_factor: 90 }, titan)).toBe(false);
});

test("only Nimbus before 26.10.1 counts every promised payment", () => {
  expect(capsTrustedPayments("LodestarValidatorService", "v1.50.0")).toBe(true);
  expect(capsTrustedPayments("NimbusValidatorService", "multiarch-v26.10.1")).toBe(true);
  expect(capsTrustedPayments("NimbusValidatorService", "multiarch-v26.10.0")).toBe(false);
});
