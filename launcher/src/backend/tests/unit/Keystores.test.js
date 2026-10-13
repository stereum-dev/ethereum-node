import { parseKeystore, checkSlashingProtection, hasDoppelgangerProtection } from "@/share/keystores";
import { minimalSlashingProtection } from "@/share/slashingProtection";

const KEY = "a".repeat(96);
const keystore = (extra = {}) => JSON.stringify({ crypto: { kdf: {} }, pubkey: KEY, version: 4, path: "m/12381/3600/0/0/0", ...extra });
const ROOT = "0x" + "1".repeat(64);

test("keystores are recognised by their EIP-2335 shape", () => {
  expect(parseKeystore(keystore())).toEqual({ pubkey: "0x" + KEY, path: "m/12381/3600/0/0/0" });
  expect(parseKeystore(keystore({ pubkey: "0x" + KEY.toUpperCase() })).pubkey).toEqual("0x" + KEY);
  expect(parseKeystore("{ nope").error).toMatch(/JSON/);
  expect(parseKeystore(JSON.stringify({ pubkey: KEY, version: 4 })).error).toMatch(/crypto/);
  expect(parseKeystore(keystore({ version: 3 })).error).toMatch(/version 3/);
  expect(parseKeystore(keystore({ pubkey: "1234" })).error).toMatch(/public key/);
});

describe("slashing protection", () => {
  const file = (meta, data) => JSON.stringify({ metadata: meta, data });
  const meta = { interchange_format_version: "5", genesis_validators_root: ROOT };

  test("a matching file covering every key is fine", () => {
    const result = checkSlashingProtection(file(meta, [{ pubkey: "0x" + KEY }]), { genesisRoot: ROOT, pubkeys: ["0x" + KEY] });
    expect(result).toEqual({ ok: true, errors: [], missing: [] });
  });

  test("a file from another network or format is rejected", () => {
    const other = checkSlashingProtection(file({ ...meta, genesis_validators_root: "0x" + "2".repeat(64) }, []), {
      genesisRoot: ROOT,
      pubkeys: [],
    });
    expect(other.errors).toContain("it was exported on a different network");
    expect(checkSlashingProtection(file({ ...meta, interchange_format_version: "4" }, []), { genesisRoot: ROOT, pubkeys: [] }).ok).toBe(
      false
    );
    expect(checkSlashingProtection("nope", { genesisRoot: ROOT, pubkeys: [] }).ok).toBe(false);
  });

  test("keys the file does not cover are listed", () => {
    const other = "0x" + "b".repeat(96);
    const result = checkSlashingProtection(file(meta, [{ pubkey: KEY }]), { genesisRoot: ROOT, pubkeys: ["0x" + KEY, other] });
    expect(result.ok).toBe(true);
    expect(result.missing).toEqual([other]);
  });
});

test("doppelganger protection is read from each client's flag", () => {
  expect(hasDoppelgangerProtection("LighthouseValidatorService", ["--http", "--enable-doppelganger-protection"])).toBe(true);
  expect(hasDoppelgangerProtection("LighthouseValidatorService", ["--http"])).toBe(false);
  expect(hasDoppelgangerProtection("TekuValidatorService", ["--doppelganger-detection-enabled=true"])).toBe(true);
  expect(hasDoppelgangerProtection("NimbusValidatorService", ["--doppelganger-detection=false"])).toBe(false);
  expect(hasDoppelgangerProtection("LodestarValidatorService", ["--doppelgangerProtection=true"])).toBe(true);
  expect(hasDoppelgangerProtection("Web3SignerService", ["--doppelgangerProtection=true"])).toBe(false);
});

describe("minimal slashing protection", () => {
  const K = (n) => "0x" + String(n).repeat(96);
  const meta = { interchange_format_version: "5", genesis_validators_root: "0x" + "1".repeat(64) };
  const full = JSON.stringify({
    metadata: meta,
    data: [
      {
        pubkey: K(1).toUpperCase().replace("0X", "0x"),
        signed_blocks: [{ slot: "90" }, { slot: "100", signing_root: "0x" + "a".repeat(64) }],
        signed_attestations: [
          { source_epoch: "9", target_epoch: "12", signing_root: "0x" + "b".repeat(64) },
          { source_epoch: "11", target_epoch: "11" },
        ],
      },
      { pubkey: K(1), signed_blocks: [], signed_attestations: [{ source_epoch: "10", target_epoch: "13" }] },
      { pubkey: K(2), signed_blocks: [], signed_attestations: [{ source_epoch: "1", target_epoch: "2" }] },
      { pubkey: K(3), signed_blocks: [], signed_attestations: [] },
    ],
  });

  test("each key keeps only its highest block slot and attestation source and target, merged over entries", () => {
    expect(JSON.parse(minimalSlashingProtection(full, [K(1), K(3)]))).toEqual({
      metadata: meta,
      data: [
        { pubkey: K(1), signed_blocks: [{ slot: "100" }], signed_attestations: [{ source_epoch: "11", target_epoch: "13" }] },
        { pubkey: K(3), signed_blocks: [], signed_attestations: [] },
      ],
    });
  });

  test("keys outside the chunk are left out, and epochs beyond 2^53 stay exact", () => {
    const big = JSON.stringify({
      metadata: meta,
      data: [
        {
          pubkey: K(4),
          signed_blocks: [],
          signed_attestations: [{ source_epoch: "18446744073709551614", target_epoch: "18446744073709551615" }],
        },
      ],
    });
    expect(JSON.parse(minimalSlashingProtection(big, [K(4)])).data[0].signed_attestations[0].target_epoch).toEqual("18446744073709551615");
    expect(JSON.parse(minimalSlashingProtection(full, [K(9)])).data).toEqual([]);
  });

  test("a real export of 45 keys with 830 attestations each shrinks to a few KB", () => {
    const keys = Array.from({ length: 45 }, (_, i) => "0x" + i.toString(16).padStart(96, "0"));
    const att = (e) => ({ source_epoch: String(e), target_epoch: String(e + 1), signing_root: "0x" + "c".repeat(64) });
    const exported = JSON.stringify({
      metadata: meta,
      data: keys.map((pubkey) => ({
        pubkey,
        signed_blocks: [],
        signed_attestations: Array.from({ length: 830 }, (_, e) => att(128532 + e)),
      })),
    });
    expect(exported.length).toBeGreaterThan(5_000_000);
    expect(minimalSlashingProtection(exported, keys).length).toBeLessThan(10_000);
  });
});
