// EIP-3076 slashing protection reduced to the spec's minimal form: per key only the highest signed block
// slot and the highest attestation source and target, which every client takes as lower bounds. Full
// exports hold every signed message (megabytes per key after months), the minimal form ~200 bytes per key.

const normalizeKey = (key) => {
  const hex = String(key ?? "").toLowerCase();
  return hex.startsWith("0x") ? hex : "0x" + hex;
};

const toBig = (value, what) => {
  try {
    return BigInt(String(value));
  } catch (e) {
    throw new Error(`invalid ${what}: ${value}`, { cause: e });
  }
};

// Highest values per key plus what the full file held, fed entry by entry
function createAccumulator() {
  const metadata = {};
  const byKey = new Map();
  const stats = { blocks: 0, attestations: 0, maxSlot: null, maxTarget: null };
  const keyOf = (pubkey) => {
    const key = normalizeKey(pubkey);
    if (!byKey.has(key)) byKey.set(key, { slot: null, source: null, target: null });
    return byKey.get(key);
  };
  const higher = (a, b) => (a === null || b > a ? b : a);
  return {
    metadata,
    block(pubkey, slot) {
      const acc = keyOf(pubkey);
      const value = toBig(slot, "block slot");
      acc.slot = higher(acc.slot, value);
      stats.maxSlot = higher(stats.maxSlot, value);
      stats.blocks++;
    },
    attestation(pubkey, source, target) {
      const acc = keyOf(pubkey);
      const t = toBig(target, "target epoch");
      acc.source = higher(acc.source, toBig(source, "source epoch"));
      acc.target = higher(acc.target, t);
      stats.maxTarget = higher(stats.maxTarget, t);
      stats.attestations++;
    },
    key: keyOf,
    result() {
      const data = [...byKey].map(([pubkey, acc]) => ({
        pubkey,
        signed_blocks: acc.slot !== null ? [{ slot: String(acc.slot) }] : [],
        signed_attestations: acc.target !== null ? [{ source_epoch: String(acc.source), target_epoch: String(acc.target) }] : [],
      }));
      return {
        interchange: { metadata, data },
        stats: {
          validators: data.length,
          blocks: stats.blocks,
          attestations: stats.attestations,
          maxSlot: stats.maxSlot === null ? null : String(stats.maxSlot),
          maxTarget: stats.maxTarget === null ? null : String(stats.maxTarget),
        },
      };
    },
  };
}

/**
 * A parsed (or JSON text) EIP-3076 file in minimal form: { interchange, stats: { validators, blocks,
 * attestations, maxSlot, maxTarget } }. Throws on a file that is no interchange file.
 */
export function readSlashingProtection(input) {
  const json = typeof input === "string" ? JSON.parse(input) : input;
  if (!json?.metadata || !Array.isArray(json?.data)) throw new Error("not a slashing protection file");
  const acc = createAccumulator();
  Object.assign(acc.metadata, json.metadata);
  for (const entry of json.data) {
    acc.key(entry?.pubkey);
    for (const block of entry?.signed_blocks ?? []) acc.block(entry.pubkey, block.slot);
    for (const att of entry?.signed_attestations ?? []) acc.attestation(entry.pubkey, att.source_epoch, att.target_epoch);
  }
  return acc.result();
}

/**
 * The minimal form as JSON text, only for the given keys (all when pubkeys is null). input: JSON text or
 * an interchange object; one already in minimal form is only filtered.
 */
export function minimalSlashingProtection(input, pubkeys = null) {
  const { interchange } = readSlashingProtection(input);
  if (!pubkeys) return JSON.stringify(interchange);
  const wanted = new Set(pubkeys.map(normalizeKey));
  return JSON.stringify({ metadata: interchange.metadata, data: interchange.data.filter((d) => wanted.has(d.pubkey)) });
}

/**
 * Streaming reader for files too large to hold as one string (JavaScript stops at ~512 MB): write() the
 * text in pieces, finish() returns what readSlashingProtection returns. Only the values it keeps are
 * buffered, never the file.
 */
export function createSlashingReader() {
  const acc = createAccumulator();
  // containers from the root down: { object, key, expectKey } or { array }
  const stack = [];
  let entryKey = null;
  let pending = { blocks: [], attestations: [] };
  let item = {};
  let rootSeen = false;
  let sawData = false;
  // tokenizer state
  let inString = false;
  let escape = false;
  let unicode = null;
  let buffer = "";
  let literal = "";

  const fail = (message) => {
    throw new Error("not a slashing protection file: " + message);
  };
  const path = () => stack.map((c) => (c.object ? c.key : "[]"));

  const scalar = (value) => {
    const top = stack[stack.length - 1];
    if (!top) fail("no JSON object");
    if (top.object && top.expectKey) {
      if (typeof value !== "string") fail("object key is not a string");
      top.key = value;
      top.expectKey = false;
      return;
    }
    const p = path();
    if (p.length === 2 && p[0] === "metadata") acc.metadata[p[1]] = value;
    else if (p.length === 3 && p[0] === "data" && p[2] === "pubkey") entryKey = value;
    else if (p.length === 5 && p[0] === "data" && p[2] === "signed_blocks" && p[4] === "slot") item.slot = value;
    else if (p.length === 5 && p[0] === "data" && p[2] === "signed_attestations") {
      if (p[4] === "source_epoch") item.source = value;
      if (p[4] === "target_epoch") item.target = value;
    }
  };

  const open = (container) => {
    if (!rootSeen) {
      if (!container.object) fail("the file is no JSON object");
      rootSeen = true;
    } else {
      const top = stack[stack.length - 1];
      if (!top || (top.object && top.expectKey)) fail("unexpected bracket");
    }
    const p = path();
    if (container.array && p.length === 1 && p[0] === "data") sawData = true;
    // a data entry starts: its pubkey may come after its messages, so they wait for the closing brace
    if (container.object && p.length === 2 && p[0] === "data") {
      entryKey = null;
      pending = { blocks: [], attestations: [] };
    }
    if (container.object && p.length === 4 && p[0] === "data") item = {};
    stack.push(container);
  };

  const close = (array) => {
    const top = stack.pop();
    if (!top || !!top.array !== array) fail("brackets do not match");
    const p = path();
    if (!array && p.length === 4 && p[0] === "data" && p[2] === "signed_blocks") {
      if (item.slot === undefined) fail("block without slot");
      pending.blocks.push(item.slot);
    }
    if (!array && p.length === 4 && p[0] === "data" && p[2] === "signed_attestations") {
      if (item.source === undefined || item.target === undefined) fail("attestation without source or target");
      pending.attestations.push([item.source, item.target]);
    }
    if (!array && p.length === 2 && p[0] === "data") {
      if (!entryKey) fail("entry without pubkey");
      acc.key(entryKey);
      pending.blocks.forEach((slot) => acc.block(entryKey, slot));
      pending.attestations.forEach(([source, target]) => acc.attestation(entryKey, source, target));
    }
  };

  const flushLiteral = () => {
    if (!literal) return;
    const text = literal;
    literal = "";
    if (text === "true" || text === "false" || text === "null") return scalar(text === "null" ? null : text === "true");
    if (!/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(text)) fail("unexpected " + text.slice(0, 20));
    // epochs and slots stay exact as text, Number would round them
    scalar(text);
  };

  return {
    write(text) {
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inString) {
          if (unicode !== null) {
            unicode += c;
            if (unicode.length === 4) {
              buffer += String.fromCharCode(parseInt(unicode, 16));
              unicode = null;
            }
          } else if (escape) {
            escape = false;
            if (c === "u") unicode = "";
            else buffer += { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f" }[c] ?? c;
          } else if (c === "\\") escape = true;
          else if (c === '"') {
            inString = false;
            scalar(buffer);
            buffer = "";
          } else buffer += c;
          continue;
        }
        if (c === '"') {
          flushLiteral();
          inString = true;
        } else if (c === "{" || c === "[") {
          flushLiteral();
          open(c === "{" ? { object: true, key: null, expectKey: true } : { array: true });
        } else if (c === "}" || c === "]") {
          flushLiteral();
          close(c === "]");
        } else if (c === ",") {
          flushLiteral();
          const top = stack[stack.length - 1];
          if (top?.object) top.expectKey = true;
        } else if (c === ":" || c === " " || c === "\n" || c === "\r" || c === "\t") {
          flushLiteral();
        } else literal += c;
      }
    },
    finish() {
      flushLiteral();
      if (inString || stack.length) fail("the file ends early");
      if (!rootSeen || !sawData || !Object.keys(acc.metadata).length) fail("no metadata or data");
      return acc.result();
    },
  };
}

// Read a File/Blob through the streaming reader; onProgress(fraction) while reading
export async function readSlashingFile(file, onProgress = () => {}) {
  const reader = createSlashingReader();
  const decoder = new TextDecoder();
  const stream = file.stream().getReader();
  let read = 0;
  for (;;) {
    const { done, value } = await stream.read();
    if (done) break;
    reader.write(decoder.decode(value, { stream: true }));
    read += value.length;
    onProgress(file.size ? read / file.size : 1);
  }
  reader.write(decoder.decode());
  return reader.finish();
}
