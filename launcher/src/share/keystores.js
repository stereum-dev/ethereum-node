// Checks for importing validator keys, shared by the page and the backend and testable without a node

const PUBKEY = /^0x[0-9a-f]{96}$/;
const ROOT = /^0x[0-9a-f]{64}$/;

// genesis_validators_root of the public networks, for setups without a beacon node to ask (a lone Web3Signer)
export const GENESIS_ROOTS = {
  mainnet: "0x4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95",
  sepolia: "0xd8ea171f3c94aea21ebc42a1ed61052acf3f9209c00e4efbaaddac09ed9b8078",
  hoodi: "0x212f13fc4df078b6cb7db228f1c8307566dcecf900867401a92023d7ba99cb5f",
  gnosis: "0xf5dcb5564e829aab27264b9becd5dfaa017085611224cb3036f573368dbb9d47",
};

const normalizeKey = (key) => {
  const hex = String(key ?? "").toLowerCase();
  return hex.startsWith("0x") ? hex : "0x" + hex;
};

/**
 * An EIP-2335 keystore as uploaded: { pubkey } with the 0x-prefixed public key, or { error }.
 * Only the shape is checked here; the validator client decrypts it with the password.
 */
export function parseKeystore(text) {
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    return { error: "not a JSON file" };
  }
  if (!json || typeof json !== "object" || !json.crypto) return { error: "not a keystore (no crypto section)" };
  if (json.version !== 4) return { error: `unsupported keystore version ${json.version}` };
  const pubkey = normalizeKey(json.pubkey);
  if (!PUBKEY.test(pubkey)) return { error: "keystore without a valid public key" };
  return { pubkey, path: json.path ?? null };
}

/**
 * EIP-3076 slashing protection checked against the chain and the keys about to be imported.
 * Returns { ok, errors: [], missing: [pubkeys not covered] }. Missing keys are no error of the file,
 * but each needs the user to confirm it has never signed.
 */
export function checkSlashingProtection(text, { genesisRoot, pubkeys }) {
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    return { ok: false, errors: ["not a JSON file"], missing: [] };
  }
  const errors = [];
  const meta = json?.metadata;
  if (String(meta?.interchange_format_version) !== "5") errors.push("only interchange format version 5 is supported");
  const root = String(meta?.genesis_validators_root ?? "").toLowerCase();
  if (!ROOT.test(root)) errors.push("no genesis validators root");
  else if (genesisRoot && root !== genesisRoot.toLowerCase()) errors.push("it was exported on a different network");
  if (!Array.isArray(json?.data)) errors.push("no validator data");
  const covered = new Set((json?.data ?? []).map((entry) => normalizeKey(entry?.pubkey)));
  const missing = pubkeys.filter((key) => !covered.has(key));
  return { ok: errors.length === 0, errors, missing };
}

// Flag that turns on doppelganger protection, per validator client; Lighthouse's is a plain switch
const DOPPELGANGER_FLAGS = {
  LighthouseValidatorService: "--enable-doppelganger-protection",
  PrysmValidatorService: "--enable-doppelganger",
  TekuValidatorService: "--doppelganger-detection-enabled",
  NimbusValidatorService: "--doppelganger-detection",
  LodestarValidatorService: "--doppelgangerProtection",
};

// Whether new keys wait a few epochs before validating (the flag is present and not set to false)
export function hasDoppelgangerProtection(service, command = []) {
  const flag = DOPPELGANGER_FLAGS[service];
  if (!flag) return false;
  const args = Array.isArray(command) ? command : String(command).split(/\s+/);
  return args.some((arg) => arg === flag || (arg.startsWith(flag + "=") && arg.slice(flag.length + 1) !== "false"));
}
