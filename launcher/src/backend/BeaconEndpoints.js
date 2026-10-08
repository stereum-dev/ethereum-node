// Beacon REST endpoints the node's own services are configured against. Used as a fallback
// when no local consensus client answers, e.g. a validator-only node pointing at a remote beacon.

// Flags as written by ServiceManager. Prysm's --beacon-rpc-provider is gRPC and can't answer REST.
export const BEACON_ENDPOINT_FLAGS = {
  LighthouseValidatorService: ["--beacon-nodes"],
  PrysmValidatorService: ["--beacon-rest-api-provider"],
  TekuValidatorService: ["--beacon-node-api-endpoint", "--beacon-node-api-endpoints"],
  NimbusValidatorService: ["--beacon-node"],
  LodestarValidatorService: ["--beaconNodes"],
  CharonService: ["--beacon-node-endpoints"],
  PlutoService: ["--beacon-node-endpoints"],
};

// Curl runs on the host, so container hostnames don't resolve and a container's loopback is not ours
const UNREACHABLE_HOST = /^(localhost|127(?:\.\d+){3}|\[?::1\]?|0\.0\.0\.0|stereum-[a-f0-9-]+)$/i;

// The URL ends up in a curl command, so only allow plain URL characters
export function normalizeBeaconUrl(url) {
  if (typeof url !== "string") return null;
  const trimmed = url.trim().replace(/\/+$/, "");
  return /^https?:\/\/[A-Za-z0-9._:/-]+$/i.test(trimmed) ? trimmed : null;
}

// Values of --flag=value and --flag value, comma-split since clients accept lists
function flagValues(command, flags) {
  const cmd = Array.isArray(command) ? command.map(String) : typeof command === "string" ? command.split(/\s+/) : [];
  const values = [];
  cmd.forEach((arg, i) => {
    for (const flag of flags) {
      let raw = null;
      if (arg === flag) raw = cmd[i + 1];
      else if (arg.startsWith(flag + "=")) raw = arg.slice(flag.length + 1);
      if (raw) values.push(...raw.split(",").map((v) => v.trim()));
    }
  });
  return values;
}

function hostOf(url) {
  const match = url.match(/^https?:\/\/([^/]+)/i);
  return match ? match[1].replace(/:\d+$/, "").toLowerCase() : "";
}

// BeaconNodeAddr from an SSV node config.yaml
export function ssvBeaconAddr(configYaml) {
  const match = String(configYaml || "").match(/^\s*BeaconNodeAddr:\s*["']?([^\s"'#]+)/m);
  return match ? match[1] : null;
}

// Candidates in order: validator clients and DV clients, then extra addresses (SSV), then an external consensus link
export function configuredBeaconUrls(serviceInfos = [], extra = []) {
  const raw = [];
  for (const info of serviceInfos) {
    const flags = BEACON_ENDPOINT_FLAGS[info?.service];
    if (flags) raw.push(...flagValues(info.config?.command, flags));
  }
  raw.push(...extra);
  for (const info of serviceInfos) {
    if (info?.service === "ExternalConsensusService" && info.config?.env?.link) raw.push(String(info.config.env.link));
  }

  const urls = [];
  for (const candidate of raw) {
    const url = normalizeBeaconUrl(candidate);
    if (url && !urls.includes(url) && !UNREACHABLE_HOST.test(hostOf(url))) urls.push(url);
  }
  return urls;
}
