import fs from "fs";
import os from "os";
import path from "path";
import YAML from "yaml";
import { execFileSync } from "child_process";
import {
  charonBuilderFlags,
  applyCharonBuilderFlags,
  builderSection,
  withBuilderSection,
  settingsFromProposerConfig,
  clusterSettingsProblems,
  dvtConfiguration,
  charonVersionOf,
  parseRemoteProposerConfig,
  remoteProposerConfigCopy,
  remoteBuilderApi,
  beaconUrlsOf,
} from "@/share/obolBuilders";

const KEY = "0xb87f614580c8c94e9163afbc888815950c8430cc270cd541b8154a35728885a85563516d2d47fc63f562ac5f68a4ea8f";
// as Charon writes it: the majority fee recipient as default, entries only for keys that differ
const charonConfig = {
  version: 1,
  proposer_config: { [KEY]: { fee_recipient: "0x2222222222222222222222222222222222222222" } },
  default_config: { fee_recipient: "0x1111111111111111111111111111111111111111", gas_limit: "200000000" },
};
const cluster = {
  relays: [{ url: "https://0xaa@hoodi.titanrelay.xyz" }, { url: "https://relay-hoodi.ultrasound.money/" }],
  minBid: "0.01",
  maxExecutionPayment: "0.05",
  boostFactor: 90,
};

test("the cluster settings become Charon's builder flags in gwei, without auth or relay keys", () => {
  expect(charonBuilderFlags(cluster)).toEqual([
    "--builder-urls=https://hoodi.titanrelay.xyz,https://relay-hoodi.ultrasound.money",
    "--builder-min-bid=10000000",
    "--builder-boost-factor=90",
    "--builder-max-execution-payment=50000000",
  ]);
  // Charon refuses the bid flags without builders
  expect(charonBuilderFlags({ ...cluster, relays: [] })).toEqual([]);
  const command = ["run", "--builder-api", "--builder-urls=https://old.example", "--builder-min-bid=5"];
  expect(applyCharonBuilderFlags(command, ["--builder-urls=https://new.example"])).toEqual([
    "run",
    "--builder-api",
    "--builder-urls=https://new.example",
  ]);
  expect(clusterSettingsProblems({ boostFactor: 0 })).toHaveLength(1);
  expect(clusterSettingsProblems({ boostFactor: null })).toEqual([]);
});

test("the builder section matches what Charon writes for the same flags, and reads back into the dialog's settings", () => {
  expect(builderSection(cluster)).toEqual({
    min_bid: "10000000",
    builder_boost_factor: "90",
    max_execution_payment: "50000000",
    builders: [{ url: "https://hoodi.titanrelay.xyz" }, { url: "https://relay-hoodi.ultrasound.money" }],
  });
  // Charon's default boost factor is 100
  expect(builderSection({ ...cluster, boostFactor: null }).builder_boost_factor).toBe("100");
  const config = withBuilderSection(charonConfig, cluster);
  expect(config.proposer_config).toEqual(charonConfig.proposer_config);
  expect(settingsFromProposerConfig(config)).toMatchObject({ minBid: "0.01", maxExecutionPayment: "0.05", boostFactor: 90 });
  expect(withBuilderSection(config, { relays: [] }).default_config.builder).toBeUndefined();
});

test("each validator client of a cluster gets its proposer settings rendered as Obol's node setup does", () => {
  const config = withBuilderSection(charonConfig, cluster);

  const lodestar = dvtConfiguration("LodestarValidatorService", config);
  expect(lodestar.flags).toEqual([
    "--proposerSettingsFile=/opt/app/validator/proposer-settings.yml",
    "--allowDangerousTrustedPayments",
    "--distributed",
    "--payloadLocal=true",
  ]);
  expect(JSON.parse(lodestar.files[0].content)).toEqual({
    proposer_config: { [KEY]: { fee_recipient: "0x2222222222222222222222222222222222222222", builder: { gas_limit: "200000000" } } },
    default_config: {
      fee_recipient: "0x1111111111111111111111111111111111111111",
      builder: {
        gas_limit: "200000000",
        min_bid: "10000000",
        boost_factor: "90",
        max_execution_payment: "50000000",
        builders: config.default_config.builder.builders,
      },
    },
  });

  const prysm = dvtConfiguration("PrysmValidatorService", config, { builderApi: true });
  expect(prysm.flags).toEqual(["--proposer-settings-file=/opt/app/data/db/proposer-settings.json", "--distributed"]);
  expect(JSON.parse(prysm.files[0].content).default_config.builder).toEqual({
    enabled: true,
    gas_limit: "200000000",
    ...config.default_config.builder,
  });

  const teku = dvtConfiguration("TekuValidatorService", config);
  expect(teku.flags).toContain("--validators-proposer-config=/opt/app/data/proposer-config.json");
  expect(teku.flags).toContain("--Xbuilder-urls=https://hoodi.titanrelay.xyz,https://relay-hoodi.ultrasound.money");
  expect(teku.flags).toContain("--Xobol-dvt-integration-enabled=true");

  // Nimbus takes the first builder only
  const nimbus = dvtConfiguration("NimbusValidatorService", config, { version: "multiarch-v26.10.1" });
  expect(nimbus.flags).toContain("--payload-builder-url=https://hoodi.titanrelay.xyz");
  expect(nimbus.flags).toContain("--suggested-gas-limit=200000000");
  expect(nimbus.keySettings).toEqual([{ pubkey: KEY, feeRecipient: "0x2222222222222222222222222222222222222222", gasLimit: "200000000" }]);

  const lighthouse = dvtConfiguration("LighthouseValidatorService", config);
  expect(lighthouse.flags).toEqual([
    "--suggested-fee-recipient=0x1111111111111111111111111111111111111111",
    "--gas-limit=200000000",
    "--distributed",
  ]);
  expect(lighthouse.lighthouseFile).toMatchObject({ min_bid: 10000000, builder_boost_factor: 90 });

  // without builders only fee recipients and gas limits are set
  expect(dvtConfiguration("TekuValidatorService", charonConfig).flags.some((f) => f.startsWith("--Xbuilder-urls="))).toBe(false);
});

test("Charon's default boost needs no flag, as the file holds 100 without it", () => {
  expect(charonBuilderFlags({ ...cluster, boostFactor: 100 })).not.toContain("--builder-boost-factor=100");
  expect(builderSection({ ...cluster, boostFactor: null }).builder_boost_factor).toBe("100");
});

// what Stereum renders when a validator client starts (manage-service, Python) and what the dialog previews (JS)
describe("the start-time rendering on the server matches the dialog's preview", () => {
  const script = path.resolve(__dirname, "../../../../../controls/roles/manage-service/library/obol_vc_config.py");
  const config = withBuilderSection(charonConfig, cluster);
  const clients = {
    LodestarValidatorService: ["/opt/app/validator"],
    PrysmValidatorService: ["/opt/app/data/db"],
    TekuValidatorService: ["/opt/app/data"],
    NimbusValidatorService: ["/opt/app/data", "/opt/app/validators"],
    LighthouseValidatorService: ["/opt/app/validator"],
  };
  test.each(Object.entries(clients))("%s", (service, dirs) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "obol-"));
    const volumes = dirs.map((d) => {
      fs.mkdirSync(root + d, { recursive: true });
      return `${root}${d}:${d}`;
    });
    if (service === "LighthouseValidatorService") {
      fs.mkdirSync(`${root}/opt/app/validator/validators`, { recursive: true });
      fs.writeFileSync(
        `${root}/opt/app/validator/validators/validator_definitions.yml`,
        `- enabled: true\n  voting_public_key: ${KEY}\n  type: local_keystore\n`
      );
    }
    if (service === "NimbusValidatorService") fs.mkdirSync(`${root}/opt/app/validators/${KEY}`, { recursive: true });
    const configPath = path.join(root, "proposer-config.json");
    fs.writeFileSync(configPath, JSON.stringify(config));
    const input = JSON.stringify({
      service,
      image: "client:multiarch-v26.10.1",
      command: ["start"],
      volumes,
      proposer_config_path: configPath,
      builder_api: true,
    });
    const out = JSON.parse(execFileSync("python3", [script], { input }).toString());

    const preview = dvtConfiguration(service, config, { builderApi: true, version: "multiarch-v26.10.1" });
    expect(out.command).toEqual(["start", ...(service === "NimbusValidatorService" ? ["--payload-builder"] : []), ...preview.flags]);
    for (const f of preview.files) expect(JSON.parse(fs.readFileSync(`${root}${f.dir}/${f.name}`, "utf8"))).toEqual(JSON.parse(f.content));
    if (preview.lighthouseFile) {
      expect(YAML.parse(fs.readFileSync(`${root}/opt/app/validator/validators/builder_definitions.yml`, "utf8"))).toEqual(
        preview.lighthouseFile
      );
      expect(fs.readFileSync(`${root}/opt/app/validator/validators/validator_definitions.yml`, "utf8")).toContain(
        `  voting_public_key: ${KEY}\n  type: local_keystore\n  suggested_fee_recipient: "0x2222222222222222222222222222222222222222"\n  gas_limit: 200000000`
      );
    }
    if (service === "NimbusValidatorService")
      expect(fs.readFileSync(`${root}/opt/app/validators/${KEY}/suggested_fee_recipient.hex`, "utf8").trim()).toBe(
        "0x2222222222222222222222222222222222222222"
      );
    // a second start changes nothing
    const again = JSON.parse(
      execFileSync("python3", [script], { input: JSON.stringify({ ...JSON.parse(input), command: out.command }) }).toString()
    );
    expect(again.changed).toBe(false);
    fs.rmSync(root, { recursive: true, force: true });
  });
});

test("on start Lighthouse's definitions get the per-key settings in place, without touching the rest of the file", () => {
  const script = path.resolve(__dirname, "../../../../../controls/roles/manage-service/library/obol_vc_config.py");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "obol-"));
  const validators = `${root}/opt/app/validator/validators`;
  fs.mkdirSync(validators, { recursive: true });
  const OTHER = "0xa1" + "0".repeat(94);
  fs.writeFileSync(
    `${validators}/validator_definitions.yml`,
    [
      "- enabled: true",
      `  voting_public_key: ${KEY}`,
      "  suggested_fee_recipient: 0x9999999999999999999999999999999999999999",
      "  gas_limit: 60000000",
      "  voting_keystore_password: secret",
      "- enabled: true",
      `  voting_public_key: ${OTHER}`,
      "  type: local_keystore",
      "",
    ].join("\n")
  );
  fs.writeFileSync(`${validators}/builder_definitions.yml`, 'min_bid: 0\nbuilders: []\nvalidator_configs:\n  "0xabc":\n    builders: []\n');
  const configPath = path.join(root, "proposer-config.json");
  fs.writeFileSync(configPath, JSON.stringify(withBuilderSection(charonConfig, cluster)));
  const input = {
    service: "LighthouseValidatorService",
    command: [],
    volumes: [`${root}/opt/app/validator:/opt/app/validator`],
    proposer_config_path: configPath,
  };
  execFileSync("python3", [script], { input: JSON.stringify(input) });

  const definitions = fs.readFileSync(`${validators}/validator_definitions.yml`, "utf8");
  // the unquoted key stays exactly as Lighthouse wrote it, and the values are replaced where they were
  expect(definitions).toContain(
    `  voting_public_key: ${KEY}\n  suggested_fee_recipient: "0x2222222222222222222222222222222222222222"\n  gas_limit: 200000000\n  voting_keystore_password: secret\n`
  );
  expect(definitions).toContain(`  voting_public_key: ${OTHER}\n  type: local_keystore\n`);
  expect(definitions.match(/gas_limit/g)).toHaveLength(1);
  // Lighthouse's own per-key builder settings stay in its builder file
  expect(fs.readFileSync(`${validators}/builder_definitions.yml`, "utf8")).toContain('validator_configs:\n  "0xabc":\n    builders: []');
  fs.rmSync(root, { recursive: true, force: true });
});

test("a remote Charon is told by its version answer, and a pasted copy is checked for what the validator client signs", () => {
  expect(charonVersionOf("obolnetwork/charon/v2.0.0-rc2-1a2b3c4/amd64-linux")).toBe("v2.0.0-rc2");
  expect(charonVersionOf("obolnetwork/charon/v1.11.1-abc/arm64-linux")).toBe("v1.11.1");
  expect(charonVersionOf("Lighthouse/v8.3.0-abc/x86_64-linux")).toBeNull();

  const copy = remoteProposerConfigCopy(withBuilderSection(charonConfig, cluster), false);
  const { config, error } = parseRemoteProposerConfig(copy);
  expect(error).toBeNull();
  expect(config.builder_api).toBe(false);
  expect(remoteBuilderApi(config)).toBe(false);
  // a copy from elsewhere, without the flag: the builder API is on when it has builders
  expect(remoteBuilderApi(withBuilderSection(charonConfig, cluster))).toBe(true);
  expect(remoteBuilderApi(charonConfig)).toBe(false);

  expect(parseRemoteProposerConfig("{").error).toBe("not JSON");
  expect(parseRemoteProposerConfig(JSON.stringify({ default_config: { fee_recipient: "0x12" } })).error).toMatch(/fee_recipient/);
  expect(
    parseRemoteProposerConfig(JSON.stringify({ ...charonConfig, proposer_config: { "0xabc": { fee_recipient: "0x1" } } })).error
  ).toMatch(/invalid key/);
});

test("rendered from a remote copy, the builder API comes from the copy", () => {
  const script = path.resolve(__dirname, "../../../../../controls/roles/manage-service/library/obol_vc_config.py");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "obol-"));
  fs.mkdirSync(`${root}/opt/app/data/db`, { recursive: true });
  const configPath = path.join(root, "proposer-config.json");
  const run = (config) => {
    fs.writeFileSync(configPath, JSON.stringify(config));
    const input = {
      service: "PrysmValidatorService",
      command: [],
      volumes: [`${root}/opt/app/data/db:/opt/app/data/db`],
      proposer_config_path: configPath,
    };
    execFileSync("python3", [script], { input: JSON.stringify(input) });
    return JSON.parse(fs.readFileSync(`${root}/opt/app/data/db/proposer-settings.json`, "utf8")).default_config.builder.enabled;
  };
  expect(run({ ...withBuilderSection(charonConfig, cluster), builder_api: false })).toBe(false);
  expect(run(withBuilderSection(charonConfig, cluster))).toBe(true);
  expect(run(charonConfig)).toBe(false);
  fs.rmSync(root, { recursive: true, force: true });
});

test("the beacon node URLs of a validator client set up by hand come from its command", () => {
  expect(beaconUrlsOf("LodestarValidatorService", ["validator", "--beaconNodes=http://10.12.7.1:3600/,http://b:3600"])).toEqual([
    "http://10.12.7.1:3600",
    "http://b:3600",
  ]);
  expect(beaconUrlsOf("NimbusValidatorService", ["--beacon-node=http://a:3600", "--beacon-node=http://b:3600"])).toEqual([
    "http://a:3600",
    "http://b:3600",
  ]);
  expect(beaconUrlsOf("TekuValidatorService", ["--beacon-node-api-endpoints=https://a:3600"])).toEqual(["https://a:3600"]);
  // Prysm's RPC provider has no scheme, its REST one does
  expect(beaconUrlsOf("PrysmValidatorService", ["--beacon-rpc-provider=a:4000", "--beacon-rest-api-provider=http://a:3600"])).toEqual([
    "http://a:3600",
  ]);
  expect(beaconUrlsOf("LighthouseValidatorService", ["--beacon-nodes=http://a:3600;rm -rf /"])).toEqual([]);
});

test("an older Nimbus behind Charon gets no minimum bid or max payment flags, which it doesn't know", () => {
  const script = path.resolve(__dirname, "../../../../../controls/roles/manage-service/library/obol_vc_config.py");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "obol-"));
  const configPath = path.join(root, "proposer-config.json");
  fs.writeFileSync(configPath, JSON.stringify(withBuilderSection(charonConfig, cluster)));
  const render = (image) =>
    JSON.parse(
      execFileSync("python3", [script], {
        input: JSON.stringify({ service: "NimbusValidatorService", image, command: [], volumes: [], proposer_config_path: configPath }),
      }).toString()
    ).command;
  const old = render("statusim/nimbus-validator-client:multiarch-v26.9.0");
  expect(old).toContain("--payload-builder-url=https://hoodi.titanrelay.xyz");
  expect(old.some((f) => /^--builder-(min-bid|max-execution-payment)=/.test(f))).toBe(false);
  // the same as the dialog's preview for that version
  const preview = dvtConfiguration("NimbusValidatorService", withBuilderSection(charonConfig, cluster), { version: "multiarch-v26.9.0" });
  expect(old).toEqual(["--payload-builder", ...preview.flags]);
  expect(render("statusim/nimbus-validator-client:multiarch-v26.10.1")).toContain("--builder-min-bid=10000000");
  fs.rmSync(root, { recursive: true, force: true });
});
