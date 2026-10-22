// Builder settings of Obol clusters (Glamsterdam / ePBS). Charon requests the bids and needs every node
// of the cluster to sign identical data, so the builders are set on Charon and written into the
// proposer-config.json it generates; each validator client then takes its proposer settings from that file,
// rendered the way Obol's charon-distributed-validator-node does it.

import { builderConfiguration, builderUrl, ethToGwei } from "./builders";

// relative to Charon's data dir: next to the cluster lock
export const PROPOSER_CONFIG_PATH = ".charon/vc-config/proposer-config.json";

// Charon's builder flags, replaced on every save
const CHARON_OWNED = [/^--builder-(urls|min-bid|boost-factor|max-execution-payment)=/];

const gwei = (eth) => ethToGwei(eth) ?? "0";
const toEth = (value) => {
  const digits = String(value ?? "0").replace(/^0+(?=\d)/, "");
  if (!/^\d+$/.test(digits)) return "0";
  const padded = digits.padStart(10, "0");
  const eth = `${padded.slice(0, -9).replace(/^0+(?=\d)/, "")}.${padded.slice(-9)}`.replace(/\.?0+$/, "");
  return eth || "0";
};

/** cluster settings as Charon takes them: builder URLs without auth data and a boost factor above 0 */
export function clusterSettingsProblems(settings) {
  const problems = [];
  const boost = settings.boostFactor;
  if (boost !== null && boost !== undefined && boost !== "" && Number(boost) === 0) problems.push("Charon needs a block choice above 0%");
  return problems;
}

/** Charon's builder flags for the cluster settings, none without builders */
export function charonBuilderFlags(settings) {
  const urls = (settings.relays ?? []).map((r) => builderUrl(r.url)).filter(Boolean);
  if (!urls.length) return [];
  const boost =
    settings.boostFactor === null || settings.boostFactor === undefined || settings.boostFactor === ""
      ? null
      : String(settings.boostFactor);
  const flags = [`--builder-urls=${urls.join(",")}`];
  if (gwei(settings.minBid) !== "0") flags.push(`--builder-min-bid=${gwei(settings.minBid)}`);
  // 100 is Charon's default, and what its proposer config holds without the flag
  if (boost !== null && boost !== "100") flags.push(`--builder-boost-factor=${boost}`);
  if (gwei(settings.maxExecutionPayment) !== "0") flags.push(`--builder-max-execution-payment=${gwei(settings.maxExecutionPayment)}`);
  return flags;
}

/** Charon's command with its builder flags replaced */
export function applyCharonBuilderFlags(command, flags) {
  return [...command].filter((c) => !CHARON_OWNED.some((p) => p.test(c))).concat(flags);
}

/** the builder section of the proposer config as Charon writes it for these flags, null without builders */
export function builderSection(settings) {
  const urls = (settings.relays ?? []).map((r) => builderUrl(r.url)).filter(Boolean);
  if (!urls.length) return null;
  const boost =
    settings.boostFactor === null || settings.boostFactor === undefined || settings.boostFactor === ""
      ? "100"
      : String(settings.boostFactor);
  return {
    min_bid: gwei(settings.minBid),
    builder_boost_factor: boost,
    max_execution_payment: gwei(settings.maxExecutionPayment),
    builders: urls.map((url) => ({ url })),
  };
}

/** the proposer config with Stereum's builder section; Charon never changes an existing file itself */
export function withBuilderSection(config, settings) {
  const next = JSON.parse(JSON.stringify(config));
  const section = builderSection(settings);
  if (section) next.default_config.builder = section;
  else delete next.default_config.builder;
  return next;
}

/** Stereum settings from the builder section of a proposer config, for the dialog */
export function settingsFromProposerConfig(config) {
  const b = config?.default_config?.builder;
  if (!b) return { relays: [], minBid: "0", maxExecutionPayment: "0", boostFactor: null, nimbusRelay: "" };
  return {
    relays: (b.builders ?? []).map((e) => ({ name: e.url.replace(/^https?:\/\//, ""), url: e.url, authData: "" })),
    minBid: toEth(b.min_bid),
    maxExecutionPayment: toEth(b.max_execution_payment),
    boostFactor: b.builder_boost_factor === undefined ? null : Number(b.builder_boost_factor),
    nimbusRelay: "",
  };
}

// a key's setting: entries only carry fields that differ from default_config
const perKey = (config, pubkey, field) => config.proposer_config?.[pubkey]?.[field] ?? config.default_config[field];

// the flags each validator client owns in a cluster, replaced on every save
const DVT_OWNED = {
  LodestarValidatorService: [
    /^--proposerSettingsFile=/,
    /^--allowDangerousTrustedPayments$/,
    /^--builder\.(urls|minBid|boostFactor|maxExecutionPayment)=/,
    /^--suggestedFeeRecipient=/,
    /^--distributed$/,
    /^--payloadLocal(=.*)?$/,
  ],
  PrysmValidatorService: [
    /^--proposer-settings-file=/,
    /^--builder-(urls|min-bid|boost-factor|max-execution-payment)=/,
    /^--suggested-fee-recipient=/,
    /^--distributed$/,
  ],
  TekuValidatorService: [
    /^--validators-proposer-config=/,
    /^--validators-proposer-default-fee-recipient=/,
    /^--Xbuilder-(urls|min-bid|boost-factor|max-execution-payment)=/,
    /^--Xobol-dvt-integration-enabled(=.*)?$/,
  ],
  NimbusValidatorService: [
    /^--payload-builder-url=/,
    /^--builder-(boost-factor|min-bid|max-execution-payment)=/,
    /^--suggested-fee-recipient=/,
    /^--suggested-gas-limit=/,
    /^--distributed$/,
  ],
  LighthouseValidatorService: [/^--suggested-fee-recipient=/, /^--gas-limit=/, /^--distributed$/],
};

// where each client finds the files Stereum renders, inside its container
const FILES = {
  LodestarValidatorService: { dir: "/opt/app/validator", name: "proposer-settings.yml" },
  PrysmValidatorService: { dir: "/opt/app/data/db", name: "proposer-settings.json" },
  TekuValidatorService: { dir: "/opt/app/data", name: "proposer-config.json" },
};

/**
 * What a validator client of a cluster gets from Charon's proposer config.
 * @param {Object} config - proposer-config.json as Charon writes it (with Stereum's builder section)
 * @param {Object} options - builderApi: Charon runs with --builder-api; version: the client's image version
 * @returns {{ flags, owned, files: Array<{dir, name, content}>, lighthouseFile, keySettings }} keySettings: per key
 *   fee recipient and gas limit for clients that keep them per key (Lighthouse, Nimbus)
 */
export function dvtConfiguration(service, config, { builderApi = true, version } = {}) {
  const d = config.default_config;
  const settings = settingsFromProposerConfig(config);
  const flags = [];
  const files = [];
  let lighthouseFile = null;
  const keySettings = Object.keys(config.proposer_config ?? {}).map((pubkey) => ({
    pubkey,
    feeRecipient: perKey(config, pubkey, "fee_recipient"),
    gasLimit: perKey(config, pubkey, "gas_limit"),
  }));

  switch (service) {
    case "LodestarValidatorService": {
      const out = { proposer_config: {}, default_config: { fee_recipient: d.fee_recipient, builder: { gas_limit: d.gas_limit } } };
      if (d.builder)
        Object.assign(out.default_config.builder, {
          min_bid: d.builder.min_bid,
          boost_factor: d.builder.builder_boost_factor,
          max_execution_payment: d.builder.max_execution_payment,
          builders: d.builder.builders,
        });
      for (const [pubkey, entry] of Object.entries(config.proposer_config ?? {}))
        out.proposer_config[pubkey] = {
          fee_recipient: entry.fee_recipient ?? d.fee_recipient,
          builder: { gas_limit: entry.gas_limit ?? d.gas_limit },
        };
      files.push({ ...FILES[service], content: JSON.stringify(out) });
      flags.push(`--proposerSettingsFile=${FILES[service].dir}/${FILES[service].name}`);
      if ((d.builder?.max_execution_payment ?? "0") !== "0") flags.push("--allowDangerousTrustedPayments");
      // the stateful gloas block form, which Charon expects from distributed validators
      flags.push("--distributed", "--payloadLocal=true");
      break;
    }
    case "PrysmValidatorService": {
      const out = {
        version: 2,
        proposer_config: Object.fromEntries(
          Object.entries(config.proposer_config ?? {}).map(([pubkey, e]) => [
            pubkey,
            {
              fee_recipient: e.fee_recipient ?? d.fee_recipient,
              gas_limit: e.gas_limit ?? d.gas_limit,
              builder: { enabled: builderApi, gas_limit: e.gas_limit ?? d.gas_limit },
            },
          ])
        ),
        default_config: {
          fee_recipient: d.fee_recipient,
          gas_limit: d.gas_limit,
          builder: { enabled: builderApi, gas_limit: d.gas_limit, ...(d.builder ?? {}) },
        },
      };
      files.push({ ...FILES[service], content: JSON.stringify(out) });
      flags.push(`--proposer-settings-file=${FILES[service].dir}/${FILES[service].name}`, "--distributed");
      break;
    }
    case "TekuValidatorService": {
      const out = {
        proposer_config: Object.fromEntries(
          Object.entries(config.proposer_config ?? {}).map(([pubkey, e]) => [
            pubkey,
            { fee_recipient: e.fee_recipient ?? d.fee_recipient, builder: { enabled: builderApi, gas_limit: e.gas_limit ?? d.gas_limit } },
          ])
        ),
        default_config: { fee_recipient: d.fee_recipient, builder: { enabled: builderApi, gas_limit: d.gas_limit } },
      };
      files.push({ ...FILES[service], content: JSON.stringify(out) });
      flags.push(`--validators-proposer-config=${FILES[service].dir}/${FILES[service].name}`);
      // its builder settings are global, per-builder overrides don't apply
      flags.push(...builderConfiguration(service, settings, version).flags, "--Xobol-dvt-integration-enabled=true");
      break;
    }
    case "NimbusValidatorService":
      // a single builder: the first of Charon's
      flags.push(...builderConfiguration(service, settings, version).flags);
      flags.push(`--suggested-fee-recipient=${d.fee_recipient}`, `--suggested-gas-limit=${d.gas_limit}`, "--distributed");
      break;
    case "LighthouseValidatorService":
      flags.push(`--suggested-fee-recipient=${d.fee_recipient}`, `--gas-limit=${d.gas_limit}`, "--distributed");
      lighthouseFile = builderConfiguration(service, settings, version).file;
      break;
  }
  return { flags, owned: DVT_OWNED[service] ?? [], files, lighthouseFile, keySettings };
}

// Charon on another server: the validator client's server gets a copy of Charon's proposer config

/** Charon's release from its answer to /eth/v1/node/version, null for any other beacon node */
export function charonVersionOf(nodeVersion) {
  // its release, then "-" and the commit
  const match = /^obolnetwork\/charon\/(v\d+\.\d+\.\d+(?:-(?:rc|alpha|beta|dev)\d*)?)/.exec(String(nodeVersion ?? ""));
  return match ? match[1] : null;
}

/** what "Copy for a remote validator client" copies: the proposer config and whether Charon serves the builder API */
export function remoteProposerConfigCopy(proposerConfig, builderApi) {
  return JSON.stringify({ ...proposerConfig, builder_api: !!builderApi }, null, 2);
}

const ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const GAS = /^\d+$/;

/**
 * A pasted proposer config, checked for what the validator client signs with it.
 * @returns {{ config: Object|null, error: string|null }}
 */
export function parseRemoteProposerConfig(text) {
  let config;
  try {
    config = JSON.parse(String(text ?? "").trim());
  } catch {
    return { config: null, error: "not JSON" };
  }
  const d = config?.default_config;
  if (!d || !ADDRESS.test(d.fee_recipient ?? "") || !GAS.test(String(d.gas_limit ?? "")))
    return { config: null, error: "needs default_config with fee_recipient and gas_limit" };
  for (const [pubkey, entry] of Object.entries(config.proposer_config ?? {})) {
    if (!/^0x[0-9a-fA-F]{96}$/.test(pubkey)) return { config: null, error: `invalid key ${pubkey.slice(0, 12)}…` };
    if (entry?.fee_recipient !== undefined && !ADDRESS.test(entry.fee_recipient))
      return { config: null, error: `invalid fee recipient for ${pubkey.slice(0, 12)}…` };
  }
  if (d.builder && !Array.isArray(d.builder.builders)) return { config: null, error: "builder section without builders" };
  return { config, error: null };
}

/** whether a remote copy makes the validator client use the builder API: as Charon does, or when it has builders */
export function remoteBuilderApi(config) {
  return typeof config?.builder_api === "boolean" ? config.builder_api : !!config?.default_config?.builder?.builders?.length;
}

// the flags validator clients take their beacon node URLs from (Prysm's RPC provider has no scheme)
const BEACON_FLAGS = {
  LodestarValidatorService: ["--beaconNodes"],
  LighthouseValidatorService: ["--beacon-nodes"],
  TekuValidatorService: ["--beacon-node-api-endpoint", "--beacon-node-api-endpoints"],
  NimbusValidatorService: ["--beacon-node"],
  PrysmValidatorService: ["--beacon-rest-api-provider"],
};

/** the beacon node URLs set in a validator client's command, for one that has no beacon node in Stereum */
export function beaconUrlsOf(service, command) {
  const flags = BEACON_FLAGS[service] ?? [];
  return [
    ...new Set(
      (command ?? [])
        .map((c) => String(c))
        .filter((c) => flags.some((f) => c.startsWith(`${f}=`)))
        .flatMap((c) => c.slice(c.indexOf("=") + 1).split(","))
        .map((u) => u.trim().replace(/\/+$/, ""))
        .filter((u) => /^https?:\/\/[^\s"'`$\\]+$/.test(u))
    ),
  ];
}

// a validator client's copy of its remote Charon's proposer config, in its own folder
export const REMOTE_COPY_FILE = "charon-proposer-config.json";
