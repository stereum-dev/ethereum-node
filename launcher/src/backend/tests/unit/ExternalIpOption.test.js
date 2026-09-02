import { createPinia, setActivePinia } from "pinia";
import { useServices } from "@/store/services";

// Flag each client uses to advertise its address to peers. Seven clients already
// shipped an option for this before the detect button existed, and their command
// strings are kept as they were - Nimbus in particular carries the "extip:"
// scheme inside the command rather than as a valuePrefix.
const EXPECTED = {
  // pre-existing options, now with autoDetect added
  LighthouseBeaconService: ["--enr-address", ""],
  GrandineBeaconService: ["--enr-address", ""],
  PrysmBeaconService: ["--p2p-host-ip", ""],
  TekuBeaconService: ["--p2p-advertised-ip", ""],
  LodestarBeaconService: ["--enr.ip", ""],
  BesuService: ["--p2p-host", ""],
  NimbusBeaconService: ["--nat:extip:", ""],
  // added, geth derived: "--nat any|none|upnp|pmp|extip:<IP>"
  GethService: ["--nat", "extip:"],
  ErigonService: ["--nat", "extip:"],
  RethService: ["--nat", "extip:"],
  OpGethService: ["--nat", "extip:"],
  OpErigonService: ["--nat", "extip:"],
  OpRethService: ["--nat", "extip:"],
  // added, plain address
  NethermindService: ["--Network.ExternalIp", ""],
  EthrexService: ["--nat.extip", ""],
  OpNodeBeaconService: ["--p2p.advertise.ip", ""],
  PlutoService: ["--p2p-external-ip", ""],
};

// External EC/CC only point at a node someone else runs, and L2Geth replicates
// from the sequencer instead of speaking devp2p, so none of them advertise an
// address of their own.
const WITHOUT_P2P = ["ExternalExecutionService", "ExternalConsensusService", "L2GethService"];

let allServices;

beforeEach(() => {
  setActivePinia(createPinia());
  allServices = useServices().allServices;
});

const optionsFor = (service) => allServices.find((s) => s.service === service)?.expertOptions ?? [];

const externalIpOptionsOf = (service, command) => optionsFor(service).filter((o) => o.commands?.[0] === command);

test("every client that speaks p2p offers an external ip option", () => {
  const p2pServices = allServices
    .filter((s) => ["execution", "consensus"].includes(s.category))
    .map((s) => s.service)
    .filter((service) => !WITHOUT_P2P.includes(service));

  expect(p2pServices.length).toBeGreaterThan(0);

  // a client added to the catalog without its flag fails here rather than
  // silently shipping without the option
  for (const service of p2pServices) {
    expect(Object.keys(EXPECTED)).toContain(service);
  }
});

test("each client gets its own flag and value prefix", () => {
  for (const [service, [command, valuePrefix]] of Object.entries(EXPECTED)) {
    const [option] = externalIpOptionsOf(service, command);

    expect(option).toBeDefined();
    expect(option.type).toMatch("text");
    expect(option.valuePrefix ?? "").toBe(valuePrefix);
    // drives the detect button in ExpertWindow
    expect(option.autoDetect).toMatch("externalIp");
  }
});

test("exactly one option per client edits the external ip flag", () => {
  // seven clients already had an option for this; adding a second one gave them
  // two identical rows in expert mode
  for (const [service, [command]] of Object.entries(EXPECTED)) {
    expect(externalIpOptionsOf(service, command)).toHaveLength(1);
  }
});

test("no client has two options writing the same command", () => {
  for (const client of allServices) {
    const commands = (client.expertOptions ?? []).flatMap((o) => o.commands ?? []);
    expect(new Set(commands).size).toBe(commands.length);
  }
});

test("options are independent objects", () => {
  const geth = externalIpOptionsOf("GethService", "--nat")[0];
  const reth = externalIpOptionsOf("RethService", "--nat")[0];

  // both are built from the same factory with the same arguments, so a shared
  // reference would leak one client's entered address into the other
  expect(geth).not.toBe(reth);

  geth.changeValue = "80.249.121.1";
  expect(reth.changeValue).toBeNull();
});

test("flags containing dots are escaped in the pattern", () => {
  expect(externalIpOptionsOf("NethermindService", "--Network.ExternalIp")[0].pattern[0]).toMatch("(- --Network\\.ExternalIp=)(.*)(\\n)");

  // the escaped pattern still matches the line it describes
  const pattern = new RegExp(externalIpOptionsOf("EthrexService", "--nat.extip")[0].pattern[0]);
  expect("  - --nat.extip=80.249.121.1\n").toMatch(pattern);
  expect("  - --natXextip=80.249.121.1\n").not.toMatch(pattern);
});

test("lodestar can be given node runtime flags", () => {
  for (const service of ["LodestarBeaconService", "LodestarValidatorService"]) {
    const option = optionsFor(service).find((o) => o.commands?.[0] === "NODE_OPTIONS: ");

    expect(option).toBeDefined();
    // an environment variable, not a command flag: ExpertWindow needs isENV to
    // put it in the env block instead of appending it to the command list
    expect(option.isENV).toBe(true);
    expect(option.type).toMatch("text");
    // the command carries its own ": " separator
    expect(option.commands[0].endsWith(": ")).toBe(true);
    expect(option.placeholder).toMatch("--max-old-space-size=8192");
  }
});
