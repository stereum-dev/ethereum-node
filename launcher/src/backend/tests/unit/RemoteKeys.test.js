import {
  PRYSM_KEY_FILE,
  normalizeSignerUrl,
  parsePubkeyList,
  keysHeldElsewhere,
  prysmSignerFlags,
  prysmSignerPlan,
  withPrysmSignerFlags,
  tekuSignerPlan,
  withTekuSignerFlag,
} from "@/share/remoteKeys";

const key = (n) => "0x" + String(n).padStart(96, "a");
const SIGNER = "http://stereum-0c1f2a3b-1111-2222-3333-444455556666:9000";

describe("signer url", () => {
  test("valid urls are canonicalized", () => {
    expect(normalizeSignerUrl(SIGNER)).toEqual({ url: SIGNER });
    expect(normalizeSignerUrl(" https://signer.example.com/ ")).toEqual({ url: "https://signer.example.com" });
    expect(normalizeSignerUrl("http://10.0.0.5:9000")).toEqual({ url: "http://10.0.0.5:9000" });
    expect(normalizeSignerUrl("HTTP://Signer.EXAMPLE.com:9000")).toEqual({ url: "http://signer.example.com:9000" });
  });

  test.each([
    ["ftp://signer:9000", "protocol"],
    ["javascript:alert(1)", "protocol"],
    ["signer:9000", "protocol"],
    ["http://u:p@h:9000", "credentials"],
    ["http://h/path", "path"],
    ["http://h?x", "path"],
    ["http://h#x", "path"],
    ["http://h:0", "port"],
    ["http://h:70000", "port"],
    ["http://h\n:9000", "chars"],
    ["http://h\t:9000", "chars"],
    ["http://h';rm -rf /;'", "chars"],
    ["http://$(id):9000", "host"],
    ["http://[::1]:9000", "host"],
    ["", "empty"],
    ["   ", "empty"],
    ["http://" + "a".repeat(2050), "chars"],
  ])("%j is rejected as %s", (input, error) => {
    expect(normalizeSignerUrl(input)).toEqual({ error });
  });
});

test("pasted public keys are split, normalized and checked", () => {
  const raw = key(1).slice(2).toUpperCase();
  const { keys, invalid } = parsePubkeyList(`${key(1)}, ${raw};\n${key(2)}\t0x1234  nope`);
  expect(keys).toEqual([key(1), key(2)]);
  expect(invalid).toEqual(["0x1234", "nope"]);
  expect(parsePubkeyList("")).toEqual({ keys: [], invalid: [] });
});

test("keys held by another validator client are found, not those of signers or the own client", () => {
  const holders = [
    { id: "lh", role: "validator" },
    { id: "teku", role: "validator" },
    { id: "nimbus", role: "validator" },
    { id: "w3s", role: "signer" },
  ];
  const keysByHolder = {
    lh: { keys: [{ pubkey: key(1) }] },
    teku: { keys: [{ pubkey: key(1) }, { pubkey: key(2) }] },
    nimbus: { keys: [{ pubkey: key(1) }] },
    w3s: { keys: [{ pubkey: key(1) }, { pubkey: key(3) }] },
  };
  expect(keysHeldElsewhere([key(1), key(2), key(3)], keysByHolder, holders, "lh")).toEqual({
    [key(1)]: ["teku", "nimbus"],
    [key(2)]: ["teku"],
  });
});

describe("prysm remote signer mode", () => {
  const URL = "http://stereum-w3s:9000";
  const base = ["--accept-terms-of-use=true", "--wallet-dir=/opt/app/data/wallets"];

  test("flags are read from string and array commands, with their aliases", () => {
    expect(prysmSignerFlags(base)).toEqual({ url: null, keyFile: null });
    expect(prysmSignerFlags([...base, `--validators-external-signer-url=${URL}`, `--validators-external-signer-key-file=/k`])).toEqual({
      url: URL,
      keyFile: "/k",
    });
    expect(prysmSignerFlags(`--accept-terms-of-use=true\n  --remote-signer-url=${URL}   --remote-signer-keys-file=/k`)).toEqual({
      url: URL,
      keyFile: "/k",
    });
  });

  test("the plan is blocked, ready or a switch", () => {
    const ready = [...base, `--validators-external-signer-url=${URL}`, `--validators-external-signer-key-file=${PRYSM_KEY_FILE}`];
    const other = [...base, "--validators-external-signer-url=http://other:9000", `--validators-external-signer-key-file=/k`];
    expect(prysmSignerPlan({ command: base, localCount: 2, remoteCount: 0, url: URL })).toMatchObject({
      mode: "blocked",
      reason: "localKeys",
    });
    expect(prysmSignerPlan({ command: other, localCount: 0, remoteCount: 1, url: URL })).toMatchObject({
      mode: "blocked",
      reason: "otherSigner",
    });
    expect(prysmSignerPlan({ command: ready, localCount: 0, remoteCount: 3, url: URL }).mode).toEqual("ready");
    expect(prysmSignerPlan({ command: base, localCount: 0, remoteCount: 0, url: URL }).mode).toEqual("switch");
    // another signer without keys, or the url without the key file, is switched
    expect(prysmSignerPlan({ command: other, localCount: 0, remoteCount: 0, url: URL }).mode).toEqual("switch");
    expect(prysmSignerPlan({ command: [...base, `--validators-external-signer-url=${URL}`], url: URL }).mode).toEqual("switch");
    // remote keys of a Prysm without key file are counted, so they are imported again after the restart
    expect(prysmSignerPlan({ command: [...base, `--validators-external-signer-url=${URL}`], remoteCount: 4, url: URL })).toEqual({
      mode: "switch",
      current: URL,
      kept: 4,
    });
  });

  test("the flags are replaced once and the command keeps its type and other args", () => {
    const array = withPrysmSignerFlags([...base, "--remote-signer-url=http://old:9000", "--validators-external-signer-key-file=/x"], URL);
    expect(array).toEqual([...base, `--validators-external-signer-url=${URL}`, `--validators-external-signer-key-file=${PRYSM_KEY_FILE}`]);
    const string = withPrysmSignerFlags(base.join(" ") + " --validators-external-signer-url=http://old:9000", URL);
    expect(typeof string).toEqual("string");
    expect(string).toEqual(
      `${base.join(" ")} --validators-external-signer-url=${URL} --validators-external-signer-key-file=${PRYSM_KEY_FILE}`
    );
    expect(withPrysmSignerFlags(array, URL)).toEqual(array);
  });
});

describe("teku remote signer url", () => {
  const URL = "http://stereum-w3s:9000";
  const base = ["--network=hoodi", "--validator-api-enabled=true"];

  test("a Teku without signer url is switched, any url is ready", () => {
    expect(tekuSignerPlan(base)).toEqual({ mode: "switch", current: null });
    expect(tekuSignerPlan([...base, "--validators-external-signer-url="])).toEqual({ mode: "switch", current: null });
    expect(tekuSignerPlan([...base, "--validators-external-signer-url=http://other:9000"])).toEqual({
      mode: "ready",
      current: "http://other:9000",
    });
    // Prysm's alias is not a Teku flag
    expect(tekuSignerPlan([...base, `--remote-signer-url=${URL}`]).mode).toEqual("switch");
  });

  test("the flag is added once, an existing url is kept and the command keeps its type", () => {
    expect(withTekuSignerFlag(base, URL)).toEqual([...base, `--validators-external-signer-url=${URL}`]);
    expect(withTekuSignerFlag([...base, "--validators-external-signer-url="], URL)).toEqual([
      ...base,
      `--validators-external-signer-url=${URL}`,
    ]);
    const other = [...base, "--validators-external-signer-url=http://other:9000"];
    expect(withTekuSignerFlag(other, URL)).toBe(other);
    expect(withTekuSignerFlag(base.join(" "), URL)).toEqual(`${base.join(" ")} --validators-external-signer-url=${URL}`);
  });
});
