import { readSlashingProtection, createSlashingReader, minimalSlashingProtection } from "@/share/slashingProtection";

const K = (n) => "0x" + String(n).repeat(96);
const meta = { interchange_format_version: "5", genesis_validators_root: "0x" + "1".repeat(64) };
const file = {
  metadata: meta,
  data: [
    {
      pubkey: K(1),
      signed_blocks: [{ slot: "90" }, { slot: "100", signing_root: "0x" + "a".repeat(64) }],
      signed_attestations: [
        { source_epoch: "9", target_epoch: "12", signing_root: "0x" + "b".repeat(64) },
        { source_epoch: "11", target_epoch: "11" },
      ],
    },
    // messages before the pubkey, numbers instead of strings, an escaped character in an unused field
    { signed_attestations: [{ source_epoch: 3, target_epoch: 4, note: 'a "quoted" \\u00e9 value' }], signed_blocks: [], pubkey: K(2) },
    { pubkey: K(3), signed_blocks: [], signed_attestations: [] },
  ],
};

const streamed = (text, size) => {
  const reader = createSlashingReader();
  for (let i = 0; i < text.length; i += size) reader.write(text.slice(i, i + size));
  return reader.finish();
};

test("a file is reduced to the highest values per key, with what the full file held", () => {
  expect(readSlashingProtection(JSON.stringify(file))).toEqual({
    interchange: {
      metadata: meta,
      data: [
        { pubkey: K(1), signed_blocks: [{ slot: "100" }], signed_attestations: [{ source_epoch: "11", target_epoch: "12" }] },
        { pubkey: K(2), signed_blocks: [], signed_attestations: [{ source_epoch: "3", target_epoch: "4" }] },
        { pubkey: K(3), signed_blocks: [], signed_attestations: [] },
      ],
    },
    stats: { validators: 3, blocks: 2, attestations: 3, maxSlot: "100", maxTarget: "12" },
  });
});

test.each([1, 7, 64, 100000])("the streaming reader gives the same result in pieces of %i characters", (size) => {
  const text = JSON.stringify(file, null, 2);
  expect(streamed(text, size)).toEqual(readSlashingProtection(text));
});

test("broken or foreign files are refused, by both readers", () => {
  const text = JSON.stringify(file);
  expect(() => streamed(text.slice(0, -5), 50)).toThrow(/ends early/);
  expect(() => streamed(JSON.stringify({ keystore: true }), 50)).toThrow(/no metadata or data/);
  expect(() => streamed("[1,2]", 50)).toThrow(/no JSON object/);
  expect(() => readSlashingProtection({ crypto: {} })).toThrow(/not a slashing protection file/);
  const noTarget = JSON.stringify({ metadata: meta, data: [{ pubkey: K(1), signed_attestations: [{ source_epoch: "1" }] }] });
  expect(() => streamed(noTarget, 50)).toThrow(/without source or target/);
});

test("a minimal file is only filtered for a chunk's keys", () => {
  const minimal = minimalSlashingProtection(JSON.stringify(file));
  expect(JSON.parse(minimalSlashingProtection(minimal, [K(2)])).data).toEqual([
    { pubkey: K(2), signed_blocks: [], signed_attestations: [{ source_epoch: "3", target_epoch: "4" }] },
  ]);
});

test("the streaming reader handles a full export of thousands of messages", () => {
  const att = (e) => ({ source_epoch: String(e), target_epoch: String(e + 1), signing_root: "0x" + "c".repeat(64) });
  const big = JSON.stringify({
    metadata: meta,
    data: Array.from({ length: 50 }, (_, i) => ({
      pubkey: "0x" + i.toString(16).padStart(96, "0"),
      signed_blocks: [],
      signed_attestations: Array.from({ length: 830 }, (_, e) => att(128532 + e)),
    })),
  });
  const result = streamed(big, 65536);
  expect(result.stats).toEqual({ validators: 50, blocks: 0, attestations: 41500, maxSlot: null, maxTarget: "129362" });
  expect(JSON.stringify(result.interchange).length).toBeLessThan(12000);
});
