import {
  normalizeAliases,
  keyGroup,
  groupNameError,
  groupSummaries,
  filterByGroup,
  groupPatch,
  renameGroupPatch,
  ungroupPatch,
  groupMembers,
} from "@/share/keyGroups";

const key = (n) => "0x" + String(n).padStart(96, "a");

test("aliases are keyed by lowercased pubkey, the lowercase entry wins a clash", () => {
  const upper = "0x" + "A".repeat(96);
  const lower = upper.toLowerCase();
  expect(normalizeAliases({ [upper]: { keyName: "x" } })).toEqual({ [lower]: { keyName: "x" } });
  expect(normalizeAliases({ [lower]: { keyName: "low" }, [upper]: { keyName: "up" } })).toEqual({ [lower]: { keyName: "low" } });
  expect(normalizeAliases({ [upper]: { keyName: "up" }, [lower]: { keyName: "low" } })).toEqual({ [lower]: { keyName: "low" } });
  expect(normalizeAliases(undefined)).toEqual({});
  expect(normalizeAliases("text")).toEqual({});
  expect(normalizeAliases([1])).toEqual({});
});

test("a key is in a group only with name, id and the holder's own id", () => {
  const entry = { keyName: "", groupName: "g", groupID: "id1", validatorClientID: "lh" };
  expect(keyGroup(entry, "lh")).toEqual({ id: "id1", name: "g" });
  expect(keyGroup(entry, "teku")).toBeNull();
  expect(keyGroup({ ...entry, groupName: "" }, "lh")).toBeNull();
  expect(keyGroup({ ...entry, groupID: null }, "lh")).toBeNull();
  expect(keyGroup(undefined, "lh")).toBeNull();
});

test("group names follow the old rules and reject control characters", () => {
  const aliases = {
    [key(1)]: { groupName: "lido", groupID: "id1", validatorClientID: "lh" },
    [key(2)]: { groupName: "other", groupID: "id2", validatorClientID: "teku" },
  };
  expect(groupNameError("", null, aliases)).toBeNull();
  expect(groupNameError("a b", null, aliases)).toEqual("spaces");
  expect(groupNameError("a".repeat(31), null, aliases)).toEqual("length");
  expect(groupNameError("a\u0007", null, aliases)).toEqual("invalid");
  // unique across every client
  expect(groupNameError("other", null, aliases)).toEqual("taken");
  expect(groupNameError("lido", "id1", aliases)).toBeNull();
  expect(groupNameError("new", null, aliases)).toBeNull();
});

test("group summaries count keys and sum finite balances, sorted by name", () => {
  const rows = [
    { pubkey: key(1), group: { id: "b", name: "beta" }, state: { balance: 32e9 } },
    { pubkey: key(2), group: { id: "b", name: "beta" }, state: { balance: NaN } },
    { pubkey: key(3), group: { id: "a", name: "alpha" }, state: { balance: 31e9 } },
    { pubkey: key(4), group: null, state: { balance: 1e9 } },
    { pubkey: key(5), group: { id: "a", name: "alpha" } },
  ];
  expect(groupSummaries(rows)).toEqual([
    { id: "a", name: "alpha", count: 2, balance: 31e9 },
    { id: "b", name: "beta", count: 2, balance: 32e9 },
  ]);
});

test("rows are filtered by group", () => {
  const rows = [{ group: { id: "a" } }, { group: null }, { group: { id: "b" } }];
  expect(filterByGroup(rows, "all")).toBe(rows);
  expect(filterByGroup(rows, "ungrouped")).toEqual([{ group: null }]);
  expect(filterByGroup(rows, "b")).toEqual([{ group: { id: "b" } }]);
});

describe("patches", () => {
  const aliases = {
    [key(1)]: { keyName: "one", groupName: "g", groupID: "id1", validatorClientID: "lh" },
    [key(2)]: { keyName: "", groupName: "g", groupID: "id1", validatorClientID: "lh" },
    [key(3)]: { keyName: "", groupName: "h", groupID: "id2", validatorClientID: "lh" },
    "not-a-key": { groupName: "g", groupID: "id1" },
  };
  const noKeyName = (patch) => Object.values(patch).every((fields) => !("keyName" in fields));

  test("group, rename and ungroup patches never carry the alias", () => {
    const grouped = groupPatch([key(1)], { id: "id9", name: "n", holderId: "lh" });
    expect(grouped).toEqual({ [key(1)]: { groupName: "n", groupID: "id9", validatorClientID: "lh" } });
    const ungrouped = ungroupPatch([key(1)]);
    expect(ungrouped).toEqual({ [key(1)]: { groupName: "", groupID: null, validatorClientID: null } });
    expect(noKeyName(grouped) && noKeyName(ungrouped) && noKeyName(renameGroupPatch(aliases, "id1", "x"))).toBe(true);
  });

  test("a rename covers every member of the group, listed or not, and no other group", () => {
    expect(renameGroupPatch(aliases, "id1", "x")).toEqual({ [key(1)]: { groupName: "x" }, [key(2)]: { groupName: "x" } });
  });

  test("members are all valid pubkeys with that group id", () => {
    expect(groupMembers(aliases, "id1")).toEqual([key(1), key(2)]);
    expect(groupMembers(aliases, "id2")).toEqual([key(3)]);
    expect(groupMembers(aliases, null)).toEqual([]);
  });
});
