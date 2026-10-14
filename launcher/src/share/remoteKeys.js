// Pure helpers for importing remote keys (Web3Signer), shared by the backend and the validators page

export const SIGNER_PATH_KEYS = "/api/v1/eth2/publicKeys";
// inside Prysm's wallets volume
export const PRYSM_KEY_FILE = "/opt/app/data/wallets/remote-keys.txt";

const PUBKEY = /^0x[0-9a-f]{96}$/;
// checked before new URL(), which silently strips tabs and newlines
const URL_CHARS = /^[\x21-\x7e]{1,2048}$/;
const HOSTNAME = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/;
const URL_FLAGS = ["--validators-external-signer-url", "--remote-signer-url"];
const KEY_FILE_FLAGS = ["--validators-external-signer-key-file", "--remote-signer-keys-file"];

/**
 * Canonical signer URL `${protocol}//${hostname}[:port]` or { error } with one of
 * "empty" | "chars" | "protocol" | "credentials" | "path" | "host" | "port".
 */
export function normalizeSignerUrl(input) {
  const raw = String(input ?? "").trim();
  if (!raw) return { error: "empty" };
  if (!URL_CHARS.test(raw)) return { error: "chars" };
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(raw);
  if (!scheme || !["http", "https"].includes(scheme[1].toLowerCase())) return { error: "protocol" };

  let url;
  try {
    url = new URL(raw);
  } catch (e) {
    // the parser rejects ports above 65535 too, everything else is a broken host
    const authority = raw
      .replace(/^[^:]+:\/\//, "")
      .split(/[/?#]/)[0]
      .split("@")
      .pop();
    return { error: authority.includes(":") && !authority.includes("]") ? "port" : "host" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return { error: "protocol" };
  if (url.username || url.password) return { error: "credentials" };
  // clients join the sign path differently, so a path prefix would break some of them
  if (!["", "/"].includes(url.pathname) || url.search || url.hash) return { error: "path" };
  if (url.hostname.length > 253 || !HOSTNAME.test(url.hostname)) return { error: "host" };
  if (url.port && !(/^\d+$/.test(url.port) && +url.port >= 1 && +url.port <= 65535)) return { error: "port" };
  return { url: `${url.protocol}//${url.hostname}${url.port ? ":" + url.port : ""}` };
}

// Pasted public keys (separated by spaces, commas, semicolons or lines): { keys: unique valid, invalid: raw }
export function parsePubkeyList(text) {
  const keys = [];
  const invalid = [];
  for (const entry of String(text ?? "")
    .split(/[\s,;]+/)
    .filter(Boolean)) {
    const lower = entry.toLowerCase();
    const pubkey = lower.startsWith("0x") ? lower : "0x" + lower;
    if (!PUBKEY.test(pubkey)) invalid.push(entry);
    else if (!keys.includes(pubkey)) keys.push(pubkey);
  }
  return { keys, invalid };
}

// { pubkey: [holderId] } for keys another validator client on this node lists already (each has its own slashing db)
export function keysHeldElsewhere(pubkeys, keysByHolder, holders, holderId) {
  const wanted = new Set(pubkeys);
  const result = {};
  for (const holder of holders || []) {
    if (holder.role !== "validator" || holder.id === holderId) continue;
    for (const key of keysByHolder?.[holder.id]?.keys ?? []) {
      if (!wanted.has(key.pubkey)) continue;
      result[key.pubkey] ??= [];
      if (!result[key.pubkey].includes(holder.id)) result[key.pubkey].push(holder.id);
    }
  }
  return result;
}

// same tokenising as the staking page's addRemoteSignerTags
const tokens = (command) =>
  Array.isArray(command)
    ? command
    : String(command ?? "")
        .replace(/\n/g, "")
        .replace(/\s\s+/g, " ")
        .split(" ")
        .filter(Boolean);
const flagValue = (args, flags) => {
  for (const arg of args) {
    const flag = flags.find((f) => String(arg).startsWith(f + "="));
    if (flag) return String(arg).slice(flag.length + 1) || null;
  }
  return null;
};

// Remote signer flags of a Prysm command: { url, keyFile }
export function prysmSignerFlags(command) {
  const args = tokens(command);
  return { url: flagValue(args, URL_FLAGS), keyFile: flagValue(args, KEY_FILE_FLAGS) };
}

/**
 * What importing remote keys from url means for a Prysm, which cannot mix local and remote keys and
 * uses one signer: { mode: "ready" | "switch" | "blocked", reason?, current? }.
 */
export function prysmSignerPlan({ command, localCount = 0, remoteCount = 0, url }) {
  const current = prysmSignerFlags(command);
  if (localCount > 0) return { mode: "blocked", reason: "localKeys", current: current.url };
  if (current.url && current.url !== url && remoteCount > 0) return { mode: "blocked", reason: "otherSigner", current: current.url };
  if (current.url === url && current.keyFile) return { mode: "ready", current: current.url };
  // remote keys of a Prysm without key file are not kept across the restart, so they are imported again
  return { mode: "switch", current: current.url, kept: remoteCount };
}

// Teku only accepts remote keys through the API once a signer url is configured (it is just the default)
export function tekuSignerPlan(command) {
  const url = flagValue(tokens(command), ["--validators-external-signer-url"]);
  return url ? { mode: "ready", current: url } : { mode: "switch", current: null };
}

// Command (same type as given) with the Teku signer url flag added unless it has one
export function withTekuSignerFlag(command, url) {
  if (tekuSignerPlan(command).current) return command;
  // an empty flag would leave Teku without a url, so it is replaced
  const args = tokens(command).filter((arg) => !String(arg).startsWith("--validators-external-signer-url="));
  args.push(`--validators-external-signer-url=${url}`);
  return Array.isArray(command) ? args : args.join(" ");
}

// Command (same type as given) with both remote signer flags set to url and the key file
export function withPrysmSignerFlags(command, url) {
  const flags = [...URL_FLAGS, ...KEY_FILE_FLAGS];
  const args = tokens(command).filter((arg) => !flags.some((f) => String(arg).startsWith(f + "=")));
  args.push(`--validators-external-signer-url=${url}`, `--validators-external-signer-key-file=${PRYSM_KEY_FILE}`);
  return Array.isArray(command) ? args : args.join(" ");
}
