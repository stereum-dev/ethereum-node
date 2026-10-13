// Glamsterdam (Gloas) fork schedule and the first client releases that follow it.

const SECONDS_PER_EPOCH = 32 * 12;

// epoch null = not scheduled yet
export const GLOAS_FORKS = {
  mainnet: { genesisTime: 1606824023, epoch: null },
  hoodi: { genesisTime: 1742213400, epoch: 132352 },
  sepolia: { genesisTime: 1655733600, epoch: 353024 },
};

// Minimum release per network that carries its fork epoch; null = no compatible release yet, unlisted = not checked
export const GLOAS_MIN_VERSIONS = {
  sepolia: {
    GethService: "1.17.7",
    NethermindService: "2.1.0",
    BesuService: "26.9.0",
    ErigonService: "3.7.1",
    RethService: "2.7.0",
    LighthouseBeaconService: "8.3.0-rc.0",
    LighthouseValidatorService: "8.3.0-rc.0",
    PrysmBeaconService: "7.2.1",
    PrysmValidatorService: "7.2.1",
    TekuBeaconService: "26.9.1",
    TekuValidatorService: "26.9.1",
    NimbusBeaconService: "26.10.0",
    NimbusValidatorService: "26.10.0",
    LodestarBeaconService: "1.49.0",
    LodestarValidatorService: "1.49.0",
    GrandineBeaconService: "3.0.0-rc.0",
    Web3SignerService: "26.9.0",
    CharonService: null,
  },
  hoodi: {
    LodestarBeaconService: "1.50.0",
    LodestarValidatorService: "1.50.0",
  },
};

// unix seconds of the fork, null when not scheduled
export function gloasForkTime(network) {
  const fork = GLOAS_FORKS[network];
  if (!fork || fork.epoch === null) return null;
  return fork.genesisTime + fork.epoch * SECONDS_PER_EPOCH;
}

// "multiarch-v26.10.0", "v8.3.0-rc.0", "1.12" -> { parts, pre }; null for tags like "latest"
export function parseVersion(tag) {
  const match = String(tag ?? "").match(/(\d+)\.(\d+)(?:\.(\d+))?(?:-([0-9A-Za-z.-]+))?/);
  if (!match) return null;
  return { parts: [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)], pre: match[4] ?? null };
}

function comparePre(a, b) {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  const x = a.split(".");
  const y = b.split(".");
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] === undefined) return -1;
    if (y[i] === undefined) return 1;
    const nx = /^\d+$/.test(x[i]) ? Number(x[i]) : null;
    const ny = /^\d+$/.test(y[i]) ? Number(y[i]) : null;
    if (nx !== null && ny !== null) {
      if (nx !== ny) return nx < ny ? -1 : 1;
    } else if (x[i] !== y[i]) {
      return x[i] < y[i] ? -1 : 1;
    }
  }
  return 0;
}

// -1, 0 or 1; null when either tag is not a version
export function compareVersions(a, b) {
  const x = parseVersion(a);
  const y = parseVersion(b);
  if (!x || !y) return null;
  for (let i = 0; i < 3; i++) {
    if (x.parts[i] !== y.parts[i]) return x.parts[i] < y.parts[i] ? -1 : 1;
  }
  return comparePre(x.pre, y.pre);
}

/**
 * Services that are too old for a scheduled Gloas fork, grouped per network.
 * @param {Array} services - installed services ({ service, name, config: { network, imageVersion } })
 * @param {number} now - unix seconds
 * @returns {Array<{ network, forkTime, forked, outdated: Array<{ name, service, version, minimum }> }>} - minimum null: no release yet
 */
export function gloasReadiness(services = [], now = Math.floor(Date.now() / 1000)) {
  const byNetwork = new Map();
  for (const service of services) {
    const network = service?.config?.network;
    const forkTime = gloasForkTime(network);
    const minimums = GLOAS_MIN_VERSIONS[network] ?? {};
    if (forkTime === null || !(service?.service in minimums)) continue;
    const minimum = minimums[service.service];
    const version = service.config.imageVersion;
    if (minimum !== null && compareVersions(version, minimum) !== -1) continue;
    if (!byNetwork.has(network)) byNetwork.set(network, { network, forkTime, forked: now >= forkTime, outdated: [] });
    byNetwork.get(network).outdated.push({ name: service.name, service: service.service, version, minimum });
  }
  return [...byNetwork.values()];
}
