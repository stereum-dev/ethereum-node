// the host of a relay URL for display, the URL itself when it does not parse
export function relayHost(url) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
