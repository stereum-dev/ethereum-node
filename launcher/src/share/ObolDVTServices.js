// Obol DV middleware. Pluto is Nethermind's Rust reimplementation of Charon:
// same CLI, CHARON_* env vars, ".charon" layout and ports, so consumers treat
// them alike.
export const OBOL_DVT_SERVICES = ["CharonService", "PlutoService"];

export function isObolDVTService(serviceName) {
  return OBOL_DVT_SERVICES.includes(serviceName);
}
