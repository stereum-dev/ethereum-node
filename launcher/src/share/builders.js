// Builder settings (Glamsterdam / ePBS) of a setup and what each validator client gets for them.
// After the fork the validator client hands its builders to the beacon node with each proposal,
// so the relays are configured on the validator clients, not on the beacon node through MEV-Boost.

import { GLOAS_MIN_VERSIONS, compareVersions, gloasForkTime } from "./gloasFork";

export const DEFAULT_BUILDER_SETTINGS = {
  // "direct": the validator client asks each relay; "mevboost" (router) follows once MEV-Boost ships ePBS
  route: "direct",
  // [{ name, url, authData }], authData "0x.." hex or empty for the URL's hostname
  relays: [],
  // ETH as decimal strings
  minBid: "0",
  maxExecutionPayment: "0",
  // percent, null = the client's default
  boostFactor: null,
  // Nimbus takes a single builder: the URL of the relay it uses, empty = the first relay
  nimbusRelay: "",
};

// the flags (or file) each client takes, and the flags Stereum owns and replaces on every apply
export const BUILDER_CLIENTS = {
  LodestarValidatorService: {
    owned: [/^--builder\.(urls|minBid|boostFactor|maxExecutionPayment|selection)=/, /^--allowDangerousTrustedPayments$/],
  },
  PrysmValidatorService: { owned: [/^--builder-(urls|min-bid|boost-factor|max-execution-payment)=/] },
  TekuValidatorService: { owned: [/^--Xbuilder-(urls|min-bid|boost-factor|max-execution-payment)=/] },
  NimbusValidatorService: {
    owned: [/^--payload-builder-url=/, /^--builder-(boost-factor|min-bid|max-execution-payment)=/],
    singleRelay: true,
  },
  LighthouseValidatorService: { owned: [], file: "validators/builder_definitions.yml" },
};

// the first Nimbus release with a minimum bid and a max trusted payment; older ones count every promised payment
export const NIMBUS_BID_LIMITS = "26.10.1";
const nimbusLimits = (version) => [0, 1].includes(compareVersions(version, NIMBUS_BID_LIMITS));

// clients that take no auth_data of their own: they always sign the URL's hostname
export const HOSTNAME_AUTH_ONLY = ["TekuValidatorService", "NimbusValidatorService"];

/** "1.5" ETH -> "1500000000" gwei; null for anything that is not a non-negative decimal with up to 9 places */
export function ethToGwei(eth) {
  const match = String(eth ?? "")
    .trim()
    .match(/^(\d*)(?:\.(\d{0,9}))?$/);
  if (!match || (match[1] === "" && !match[2])) return null;
  const gwei = BigInt(match[1] || "0") * 1000000000n + BigInt((match[2] ?? "").padEnd(9, "0") || "0");
  return gwei.toString();
}

/** the relay URL as builders use it: no "0x<pubkey>@" credentials (the clients ignore them), no trailing slash */
export function builderUrl(url) {
  // the setup file is written through a shell
  if (/[$`"'\\\s]/.test(String(url ?? "").trim())) return null;
  try {
    const parsed = new URL(String(url).trim());
    if (!/^https?:$/.test(parsed.protocol)) return null;
    parsed.username = "";
    parsed.password = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** auth data as the clients take it: "0x" hex, or "" for the default (the URL's hostname) */
export function normalizeAuthData(authData) {
  const value = String(authData ?? "").trim();
  if (!value) return "";
  return /^0x([0-9a-fA-F]{2})+$/.test(value) ? value.toLowerCase() : null;
}

/** settings as they are stored: relays with a clean name, the builder URL and their auth data */
export function cleanBuilderSettings(settings) {
  const clean = (s) => ({
    ...s,
    relays: (s.relays ?? [])
      .map((r) => ({
        name: String(r.name ?? "").replace(/[^\w .()-]/g, ""),
        url: builderUrl(r.url),
        authData: normalizeAuthData(r.authData) || "",
      }))
      .filter((r) => r.url),
    nimbusRelay: builderUrl(s.nimbusRelay) ?? "",
  });
  return {
    ...clean(settings),
    clients: Object.fromEntries(Object.entries(settings.clients ?? {}).map(([id, c]) => [id, c?.own ? clean(c) : { own: false }])),
  };
}

/** settings of one validator client: its own ones if it has them, otherwise the setup's */
export function effectiveBuilderSettings(builders, serviceID) {
  const own = builders?.clients?.[serviceID];
  const source = own?.own ? own : builders;
  return { ...DEFAULT_BUILDER_SETTINGS, ...(source ?? {}), own: !!own?.own };
}

/**
 * Checks settings before they are saved.
 * @returns {Array<string>} problems, empty when the settings are fine
 */
export function validateBuilderSettings(settings) {
  const problems = [];
  for (const relay of settings.relays ?? []) {
    if (!builderUrl(relay.url)) problems.push(`invalid URL: ${relay.url}`);
    if (normalizeAuthData(relay.authData) === null) problems.push(`invalid auth data for ${relay.url}`);
  }
  if (ethToGwei(settings.minBid) === null) problems.push("invalid minimum bid");
  if (ethToGwei(settings.maxExecutionPayment) === null) problems.push("invalid max trusted payment");
  const boost = settings.boostFactor;
  if (boost !== null && boost !== undefined && boost !== "" && !/^\d+$/.test(String(boost))) problems.push("invalid boost factor");
  return problems;
}

/**
 * Whether builder settings can be written to a validator client now.
 * @param {Object} args - { service, version, network, usesMevBoost, now }
 * @returns {{ apply: boolean, reason: string|null, minimum: string|null }} reason: "unsupported", "not-scheduled", "update", "after-fork"
 */
export function builderSupport({ service, version, network, usesMevBoost, now = Math.floor(Date.now() / 1000) }) {
  if (!BUILDER_CLIENTS[service]) return { apply: false, reason: "unsupported", minimum: null };
  const forkTime = gloasForkTime(network);
  if (forkTime === null) return { apply: false, reason: "not-scheduled", minimum: null };
  // a release that follows the network's fork knows the builder flags; older ones would not start with them
  const minimum = GLOAS_MIN_VERSIONS[network]?.[service] ?? null;
  if (minimum === null || compareVersions(version, minimum) === -1) return { apply: false, reason: "update", minimum };
  // before the fork Prysm's --builder-urls and Nimbus' --payload-builder also send registrations, which a beacon node without MEV-Boost refuses
  const registersEarly = service === "PrysmValidatorService" || service === "NimbusValidatorService";
  if (registersEarly && !usesMevBoost && now < forkTime) return { apply: false, reason: "after-fork", minimum };
  return { apply: true, reason: null, minimum };
}

function relayEntries(settings) {
  return (settings.relays ?? [])
    .map((relay) => ({ url: builderUrl(relay.url), authData: normalizeAuthData(relay.authData) || "" }))
    .filter((relay) => relay.url);
}

const withAuth = (relay) => (relay.authData ? `${relay.url}#${relay.authData}` : relay.url);

/**
 * The flags a validator client gets for its builder settings (Lighthouse gets a file instead).
 * @param {string} version - the client's image version, decides about Nimbus' bid limits
 * @returns {{ flags: Array<string>, file: Object|null, notes: Array<string> }}
 */
export function builderConfiguration(service, settings, version) {
  const relays = relayEntries(settings);
  const minBid = ethToGwei(settings.minBid) ?? "0";
  const maxPayment = ethToGwei(settings.maxExecutionPayment) ?? "0";
  const boost =
    settings.boostFactor === null || settings.boostFactor === undefined || settings.boostFactor === ""
      ? null
      : String(settings.boostFactor);
  const flags = [];
  const notes = [];
  let file = null;

  switch (service) {
    case "LodestarValidatorService":
      if (relays.length) flags.push(`--builder.urls=${relays.map(withAuth).join(",")}`);
      if (minBid !== "0") flags.push(`--builder.minBid=${minBid}`);
      if (maxPayment !== "0") flags.push(`--builder.maxExecutionPayment=${maxPayment}`, "--allowDangerousTrustedPayments");
      // Lodestar only applies a boost factor with the maxprofit selection
      if (boost !== null) flags.push("--builder.selection=maxprofit", `--builder.boostFactor=${boost}`);
      break;
    case "PrysmValidatorService":
      if (relays.length) flags.push(`--builder-urls=${relays.map(withAuth).join(",")}`);
      if (minBid !== "0") flags.push(`--builder-min-bid=${minBid}`);
      if (maxPayment !== "0") flags.push(`--builder-max-execution-payment=${maxPayment}`);
      if (boost !== null) flags.push(`--builder-boost-factor=${boost}`);
      break;
    case "TekuValidatorService":
      if (relays.length) flags.push(`--Xbuilder-urls=${relays.map((r) => r.url).join(",")}`);
      if (minBid !== "0") flags.push(`--Xbuilder-min-bid=${minBid}`);
      if (maxPayment !== "0") flags.push(`--Xbuilder-max-execution-payment=${maxPayment}`);
      if (boost !== null) flags.push(`--Xbuilder-boost-factor=${boost}`);
      if (relays.some((r) => r.authData)) notes.push("auth-ignored");
      break;
    case "NimbusValidatorService": {
      const picked = relays.find((r) => r.url === builderUrl(settings.nimbusRelay)) ?? relays[0];
      if (picked) flags.push(`--payload-builder-url=${picked.url}`);
      if (boost !== null) flags.push(`--builder-boost-factor=${boost}`);
      if (nimbusLimits(version)) {
        if (minBid !== "0") flags.push(`--builder-min-bid=${minBid}`);
        // its default is no limit, so 0 has to be set
        if (picked) flags.push(`--builder-max-execution-payment=${maxPayment}`);
      } else if (minBid !== "0" || maxPayment !== "0") notes.push("no-limits");
      if (relays.length > 1) notes.push("single-relay");
      if (picked?.authData) notes.push("auth-ignored");
      break;
    }
    case "LighthouseValidatorService":
      file = {
        min_bid: Number(minBid),
        ...(boost !== null && { builder_boost_factor: Number(boost) }),
        builders: relays.map((r) => ({
          enabled: true,
          url: r.url,
          max_execution_payment: Number(maxPayment),
          ...(r.authData && { auth_data: r.authData }),
        })),
      };
      break;
  }
  return { flags, file, notes };
}

/**
 * The command with Stereum's builder flags replaced. Nimbus needs --payload-builder for its builder URL.
 * @param {Array<string>|string} command
 * @returns {Array<string>|string} in the form it came in
 */
export function applyBuilderFlags(service, command, flags) {
  const isString = typeof command === "string";
  let list = isString ? command.replaceAll(/\n/gm, "").replaceAll(/\s\s+/gm, " ").split(" ") : [...command];
  const owned = BUILDER_CLIENTS[service]?.owned ?? [];
  list = list.filter((c) => !owned.some((pattern) => pattern.test(c))).concat(flags);
  if (
    service === "NimbusValidatorService" &&
    flags.some((f) => f.startsWith("--payload-builder-url=")) &&
    !list.some((c) => /^--payload-builder(=true)?$/.test(c))
  ) {
    list.push("--payload-builder");
  }
  return isString ? list.join(" ").trim() : list;
}

/** Lighthouse's builder file with Stereum's part replaced, keeping the per-key settings Lighthouse keeps in it */
export function mergeLighthouseBuilderFile(existing, file) {
  const merged = { ...file };
  if (existing?.validator_configs && Object.keys(existing.validator_configs).length) merged.validator_configs = existing.validator_configs;
  return merged;
}

// the boost factor a client uses when none is set
export const CLIENT_DEFAULT_BOOST = {
  LodestarValidatorService: 90,
  TekuValidatorService: 90,
  PrysmValidatorService: 100,
  NimbusValidatorService: 100,
  LighthouseValidatorService: 100,
};

const ethNumber = (eth) => (ethToGwei(eth) === null ? null : Number(ethToGwei(eth)) / 1e9);

/**
 * What a validator client does with one bid, as its beacon node decides after the fork.
 * @param {string} version - the client's image version, decides about Nimbus' bid limits
 * @param {Object} amounts - ETH as strings: local (the local block), paid (paid by the protocol), promised (paid inside the block)
 * @returns {{ winner: "builder"|"local", reason: string, counted: number, boost: number, needed: number|null }|null} null for invalid amounts
 */
export function bidOutcome(service, settings, { local, paid, promised }, version) {
  const [localEth, paidEth, promisedEth] = [local, paid, promised].map(ethNumber);
  if ([localEth, paidEth, promisedEth].includes(null)) return null;
  const nimbus = service === "NimbusValidatorService";
  const unlimited = nimbus && !nimbusLimits(version);
  const boostSet = settings.boostFactor !== null && settings.boostFactor !== undefined && settings.boostFactor !== "";
  const boost = boostSet ? Number(settings.boostFactor) : CLIENT_DEFAULT_BOOST[service];
  // Nimbus before 26.10.1 counts every promised payment and has no minimum bid
  const cap = unlimited ? Infinity : (ethNumber(settings.maxExecutionPayment) ?? 0);
  const minBid = unlimited ? 0 : (ethNumber(settings.minBid) ?? 0);
  const counted = paidEth + Math.min(promisedEth, cap);
  // the smallest counted bid that beats the local block (Nimbus takes the bid on a tie, the others keep the local block)
  const needed = boost > 0 ? Math.max((localEth * 100) / boost, minBid) : null;
  const result = (winner, reason) => ({ winner, reason, counted, boost, needed });
  if (counted < minBid) return result("local", "below-min");
  if (boost === 0) return result("local", "boost-zero");
  const boosted = (counted * boost) / 100;
  if (nimbus ? boosted >= localEth : boosted > localEth) return result("builder", "higher");
  return result("local", "lower");
}

/** MEV-Boost's -min-bid (ETH) from its entrypoint, "0" when it has none */
export function mevBoostMinBid(entrypoint) {
  const list = Array.isArray(entrypoint) ? entrypoint : [];
  for (let i = 0; i < list.length; i++) {
    const match = String(list[i]).match(/^--?min-bid(?:=(.*))?$/);
    if (!match) continue;
    const value = String(match[1] ?? list[i + 1] ?? "").trim();
    return ethToGwei(value) === null ? "0" : value;
  }
  return "0";
}

const flagValue = (command, name) => {
  const list = Array.isArray(command) ? command : String(command ?? "").split(/\s+/);
  const prefix = `${name}=`;
  const hit = list.find((c) => String(c).startsWith(prefix));
  return hit === undefined ? null : String(hit).slice(prefix.length);
};

/**
 * The boost factor a validator client is set to before the fork, carried over into its builder settings.
 * Teku sets it on its beacon node. Prysm's and Nimbus' local block boost are not carried over: they work the other way round.
 * @returns {number|null} null when it uses its default
 */
export function currentBoost(service, command, beaconCommand) {
  const number = (value) => (/^\d+$/.test(String(value ?? "")) ? Number(value) : null);
  switch (service) {
    case "LodestarValidatorService": {
      const selection = flagValue(command, "--builder.selection");
      if (selection === "maxprofit") return number(flagValue(command, "--builder.boostFactor")) ?? 100;
      if (selection === "executionalways") return 0;
      return null;
    }
    case "LighthouseValidatorService":
      return number(flagValue(command, "--builder-boost-factor"));
    case "NimbusValidatorService":
      return number(flagValue(command, "--builder-boost-factor"));
    case "TekuValidatorService":
      return number(flagValue(beaconCommand, "--builder-bid-compare-factor"));
    default:
      return null;
  }
}
