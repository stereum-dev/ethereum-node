// Pure helpers for key groups, Stereum-only metadata kept per pubkey in /etc/stereum/keys.yaml

export const GROUP_NAME_MAX = 30;
// randomUUID output and anything legacy-safe
export const GROUP_ID = /^[A-Za-z0-9_-]{1,64}$/;
const PUBKEY = /^0x[0-9a-f]{96}$/;
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001f\u007f]/;

const isPlainObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);

// keys.yaml by lowercased pubkey; on a case clash the entry already written in lowercase wins
export function normalizeAliases(raw) {
  if (!isPlainObject(raw)) return {};
  const result = {};
  for (const [key, entry] of Object.entries(raw)) {
    const lower = key.toLowerCase();
    if (!(lower in result) || key === lower) result[lower] = entry;
  }
  return result;
}

// group of a key on one holder, the old page shows a group only on the client it was made on
export function keyGroup(entry, holderId) {
  if (!entry?.groupName || !entry.groupID || entry.validatorClientID !== holderId) return null;
  return { id: entry.groupID, name: entry.groupName };
}

// "" is no error, the save button is disabled instead; names are unique across all clients like on the old page
export function groupNameError(name, groupID, aliases = {}) {
  if (!name) return null;
  if (/\s/.test(name)) return "spaces";
  if (name.length > GROUP_NAME_MAX) return "length";
  if (CONTROL.test(name)) return "invalid";
  const taken = Object.values(aliases || {}).some((e) => e?.groupID && e.groupName === name && e.groupID !== groupID);
  return taken ? "taken" : null;
}

// [{ id, name, count, balance }] of the grouped rows, balance in gwei
export function groupSummaries(rows) {
  const byId = new Map();
  for (const row of rows) {
    if (!row.group) continue;
    if (!byId.has(row.group.id)) byId.set(row.group.id, { id: row.group.id, name: row.group.name, count: 0, balance: 0 });
    const group = byId.get(row.group.id);
    group.count++;
    if (Number.isFinite(row.state?.balance)) group.balance += row.state.balance;
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// filter: "all" | "ungrouped" | groupID
export function filterByGroup(rows, filter) {
  if (!filter || filter === "all") return rows;
  if (filter === "ungrouped") return rows.filter((row) => !row.group);
  return rows.filter((row) => row.group?.id === filter);
}

// patches carry only the changed fields, so aliases survive group actions
export function groupPatch(pubkeys, { id, name, holderId }) {
  return Object.fromEntries(pubkeys.map((pk) => [pk, { groupName: name, groupID: id, validatorClientID: holderId }]));
}

export function groupMembers(aliases, groupID) {
  if (!groupID) return [];
  return Object.entries(aliases || {})
    .filter(([pk, entry]) => entry?.groupID === groupID && PUBKEY.test(pk))
    .map(([pk]) => pk);
}

// the whole group by id, including keys not listed right now
export function renameGroupPatch(aliases, groupID, name) {
  return Object.fromEntries(groupMembers(aliases, groupID).map((pk) => [pk, { groupName: name }]));
}

export function ungroupPatch(pubkeys) {
  return Object.fromEntries(pubkeys.map((pk) => [pk, { groupName: "", groupID: null, validatorClientID: null }]));
}
