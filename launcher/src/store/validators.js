import { defineStore } from "pinia";
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { statusBucket } from "@/share/validatorStatus";
import { normalizeAliases, groupPatch, renameGroupPatch, ungroupPatch, groupMembers } from "@/share/keyGroups";
import { activeIndices, mergeRewardHistory } from "@/share/validatorDuties";

// Sum of the consensus rewards of own proposals in an epoch; undefined while one of them has no known outcome
function epochBlockReward(proposals, outcomes, epoch, slotsPerEpoch) {
  const slots = new Set(proposals.filter((p) => Math.floor(p.slot / slotsPerEpoch) === epoch).map((p) => p.slot));
  let total = 0;
  for (const slot of slots) {
    const outcome = outcomes[slot];
    if (!outcome || (outcome.result === "proposed" && !Number.isFinite(outcome.reward))) return undefined;
    total += outcome.reward ?? 0;
  }
  return total;
}

// Sync committee members of the holder in an epoch from its duties, null when no duties cover that period
function syncCommitteeOf(duties, epoch) {
  const sync = duties?.data?.sync;
  if (!sync) return null;
  if (!Number.isSafeInteger(sync.periodStart) || (epoch >= sync.periodStart && epoch < sync.nextPeriodStart)) return sync.current;
  const previous = duties.previousSync;
  if (previous?.nextPeriodStart === sync.periodStart && epoch >= previous.periodStart && epoch < previous.nextPeriodStart) {
    return previous.current;
  }
  return null;
}

// State of the validators page. Keys live here per holder and never on installedServices,
// so the 2s service refresh in the header cannot replace or drop them.
// a per-viewer convenience, so browser storage; it may be unavailable, the list then shows aliases
const SHOW_PUBKEYS = "validatorsPage.showPubkeys";
const readShowPubkeys = () => {
  try {
    return localStorage.getItem(SHOW_PUBKEYS) === "true";
  } catch {
    return false;
  }
};

export const useValidatorsStore = defineStore("validators", {
  state: () => ({
    holders: [],
    selectedHolderId: null,
    holdersLoading: false,
    // per holder id: { keys: [{ pubkey, remote }], loading, error, loadedAt }
    keysByHolder: {},
    // per holder id: { byPubkey, chain: { headSlot, slotsPerEpoch, secondsPerSlot }, source, base, loading, error }
    statesByHolder: {},
    // lowercased pubkey -> alias entry of /etc/stereum/keys.yaml ({ keyName, groupName, groupID, validatorClientID })
    aliases: {},
    // "all" | "ungrouped" | groupID of the group the list and the cards are scoped to
    groupFilter: "all",
    search: "",
    statusFilter: "all",
    // the key list shows public keys instead of aliases
    showPubkeys: readShowPubkeys(),
    selectedPubkey: null,
    // pubkey -> { address, loading, error } of the key opened in the fee recipient modal
    feeRecipients: {},
    // open action modal: { type: "rename" | "feerecipient" | "graffiti" | "remove" | "import" | "remoteImport" | "exit" | "group" | "renameGroup" | "ungroup", pubkeys: [], groupID? }
    modal: null,
    // pubkey -> true for the keys checked in the list of the selected holder
    selection: {},
    // pubkey -> { graffiti, loading, error } as read for the modal
    graffitis: {},
    // pubkey -> { at, partial } for exits sent this session, shown until the beacon reports them exiting
    exitsSent: {},
    // section tab: "keys" | "duties" | "cluster"
    tab: "keys",
    // per holder id: { data, previousSync, loading, error, loadedAt }; previousSync is the sync of the period before data's
    dutiesByHolder: {},
    // per holder id: { history, attestation, loading, error, unsupported, accountedEpoch, proposals: { slot: { result, reward } } }
    rewardsByHolder: {},
    // per holder id: { kind, service, stats, empty, loading, error, loadedAt }
    clustersByHolder: {},
    // Lido CSM keys of this node: keys maps a pubkey to its deposit queue position (0: not queued)
    csm: { installed: false, keys: {}, loading: false, error: null, loadedAt: null },
  }),
  getters: {
    selectedHolder: (state) => state.holders.find((h) => h.id === state.selectedHolderId) ?? null,
  },
  actions: {
    async loadHolders() {
      this.holdersLoading = true;
      try {
        const holders = await ControlService.getValidatorHolders();
        if (Array.isArray(holders)) this.holders = holders;
        if (!this.holders.some((h) => h.id === this.selectedHolderId)) {
          // shares have no stats of their own, so open a holder of on-chain keys first
          this.selectedHolderId = (this.holders.find((h) => h.role !== "share") ?? this.holders[0])?.id ?? null;
        }
      } catch (err) {
        console.error("Couldn't load validator holders:", err);
      } finally {
        this.holdersLoading = false;
      }
    },

    async loadAliases() {
      try {
        const aliases = await ControlService.readKeys();
        this.aliases = normalizeAliases(aliases);
      } catch (err) {
        console.error("Couldn't read key aliases:", err);
      }
    },

    // Keys are listed once per holder unless forced; a failed listing keeps the keys it had
    async loadKeys(holderId, force = false) {
      // read back through the store, so writes to the entry are reactive (??= would hand out the raw object)
      if (!this.keysByHolder[holderId])
        this.keysByHolder[holderId] = { keys: [], walletMissing: false, loading: false, error: null, loadedAt: null };
      const entry = this.keysByHolder[holderId];
      if (entry.loading || (entry.loadedAt && !force)) return;
      entry.loading = true;
      try {
        const result = await ControlService.listHolderKeys(holderId);
        if (result?.code === 0) {
          entry.keys = result.keys;
          this.syncNodePageKeys(holderId, result.keys);
          entry.walletMissing = !!result.walletMissing;
          entry.error = null;
          entry.loadedAt = Date.now();
        } else {
          entry.error = result?.info || "listing failed";
        }
      } catch (err) {
        entry.error = String(err?.message || err);
      } finally {
        entry.loading = false;
      }
    },

    toggleShowPubkeys() {
      this.showPubkeys = !this.showPubkeys;
      try {
        localStorage.setItem(SHOW_PUBKEYS, String(this.showPubkeys));
      } catch {
        // not remembered, the toggle still works for this session
      }
    },

    // The node page counts keys from its own cache, which it only fills while empty; keep it in step
    syncNodePageKeys(holderId, keys) {
      const role = this.holders.find((h) => h.id === holderId)?.role;
      if (role !== "validator" && role !== "signer") return;
      const service = useServices().installedServices.find((s) => s.config?.serviceID === holderId);
      if (service) service.config.keys = keys.map((k) => ({ key: k.pubkey, isRemote: !!k.remote, dvt: false }));
    },

    // Merge fields into /etc/stereum/keys.yaml; the backend answers with the whole file, so no second read
    async writeKeyEntries(patch) {
      let result;
      try {
        // plain copy: patches can carry entries of the reactive aliases, which IPC cannot clone
        result = (await ControlService.writeKeyEntries(JSON.parse(JSON.stringify(patch)))) ?? { code: 1, info: "no answer" };
      } catch (err) {
        result = { code: 1, info: String(err?.message || err) };
      }
      if (result.code === 0) this.aliases = normalizeAliases(result.aliases);
      return result;
    },

    // Alias only, so the key's group stays as it is
    renameKey(pubkey, keyName) {
      return this.writeKeyEntries({ [pubkey]: { keyName } });
    },

    // New group (no id) or join an existing one; a key in another group moves, keys.yaml holds one group per key
    async groupKeys(pubkeys, { id, name }) {
      id ??= crypto.randomUUID();
      const result = await this.writeKeyEntries(groupPatch([...pubkeys], { id, name, holderId: this.selectedHolderId }));
      if (result.code === 0) this.selection = {};
      return result;
    },

    renameGroup(groupID, name) {
      return this.writeKeyEntries(renameGroupPatch(this.aliases, groupID, name));
    },

    ungroupKeys(pubkeys) {
      return this.writeKeyEntries(ungroupPatch([...pubkeys]));
    },

    // every key of the group, also those not listed right now
    async removeGroup(groupID) {
      const result = await this.ungroupKeys(groupMembers(this.aliases, groupID));
      if (result.code === 0 && this.groupFilter === groupID) this.groupFilter = "all";
      return result;
    },

    async loadFeeRecipient(holderId, pubkey) {
      this.feeRecipients[pubkey] = { ...this.feeRecipients[pubkey], loading: true, error: null };
      const result = await ControlService.getKeyFeeRecipient(holderId, pubkey);
      this.feeRecipients[pubkey] =
        result?.code === 0
          ? { address: result.address, loading: false, error: null }
          : { address: null, loading: false, error: result?.info };
    },

    async loadGraffiti(holderId, pubkey) {
      this.graffitis[pubkey] = { ...this.graffitis[pubkey], loading: true, error: null };
      const result = await ControlService.getKeyGraffiti(holderId, pubkey);
      this.graffitis[pubkey] =
        result?.code === 0
          ? { graffiti: result.graffiti, defaultUnknown: !!result.defaultUnknown, loading: false, error: null }
          : { graffiti: null, loading: false, error: result?.info };
    },

    /**
     * Set (or reset with value null) the graffiti or fee recipient of many keys in one go.
     * Returns { code, ok, failed } from the backend, or { code, info } when it was not applied at all.
     */
    async applyKeySetting(holderId, pubkeys, setting, value) {
      const result = await ControlService.setKeySetting(holderId, [...pubkeys], setting, value);
      // a single key shows its current value, so read it back
      if (pubkeys.length === 1) {
        if (setting === "feerecipient") await this.loadFeeRecipient(holderId, pubkeys[0]);
        else await this.loadGraffiti(holderId, pubkeys[0]);
      }
      return result ?? { code: 1, info: "no answer" };
    },

    // Remove keys, then list them again so the list matches what the validator client still holds
    async removeKeys(holderId, local, remote) {
      let result;
      try {
        result = (await ControlService.removeKeys(holderId, local, remote)) ?? { code: 1, info: "no answer" };
      } catch (err) {
        result = { code: 1, info: String(err?.message || err) };
      }
      this.selection = {};
      if ([...local, ...remote].includes(this.selectedPubkey)) this.selectedPubkey = null;
      await this.loadKeys(holderId, true);
      await this.loadStates(holderId);
      return result;
    },

    // Import keystores, then list the keys again so the new ones show up
    async importKeys(holderId, keystores, passwords, slashingProtection) {
      let result;
      try {
        result = (await ControlService.importValidatorKeys(holderId, keystores, passwords, slashingProtection)) ?? {
          code: 1,
          info: "no answer",
        };
      } catch (err) {
        result = { code: 1, info: String(err?.message || err) };
      }
      await this.loadKeys(holderId, true);
      await this.loadStates(holderId);
      return result;
    },

    // Import remote keys, then list again; a Prysm switched to remote signer mode was restarted, so its state is reloaded too
    async importRemoteKeys(holderId, pubkeys, url) {
      let result;
      try {
        result = (await ControlService.importValidatorRemoteKeys(holderId, [...pubkeys], url)) ?? { code: 1, info: "no answer" };
      } catch (err) {
        result = { code: 1, info: String(err?.message || err) };
      }
      if (result.restarted) await this.loadHolders();
      await this.loadKeys(holderId, true);
      await this.loadStates(holderId);
      return result;
    },

    // Exit preflight of the backend, { code, info } when it could not run
    async prepareExit(holderId, pubkeys) {
      try {
        return (await ControlService.prepareKeyExit(holderId, [...pubkeys])) ?? { code: 1, info: "no answer" };
      } catch (err) {
        return { code: 1, info: String(err?.message || err) };
      }
    },

    // Sign and submit exits, then remember the submitted keys until their state shows the exit
    async exitKeys(holderId, pubkeys) {
      let result;
      try {
        result = (await ControlService.exitValidatorKeys(holderId, [...pubkeys])) ?? { code: 1, info: "no answer" };
      } catch (err) {
        result = { code: 1, info: String(err?.message || err) };
      }
      const at = Date.now();
      for (const [pubkey, entry] of Object.entries(result.results ?? {})) {
        if (entry?.status === "submitted") this.exitsSent[pubkey] = { at, partial: !!result.partial };
      }
      this.selection = {};
      await this.loadStates(holderId);
      return result;
    },

    // signed exits are passed through and never kept in the store
    async exportExitMessages(holderId, pubkeys) {
      try {
        return (await ControlService.exportExitMessages(holderId, [...pubkeys])) ?? { code: 1, info: "no answer" };
      } catch (err) {
        return { code: 1, info: String(err?.message || err) };
      }
    },

    // Duties of the holder's active keys; returns the answer, or null when nothing was asked
    async loadDuties(holderId) {
      const holder = this.holders.find((h) => h.id === holderId);
      // shares are not on chain, so they have no duties
      if (!holder || holder.role === "share") return null;
      const indices = activeIndices(this.statesByHolder[holderId]?.byPubkey);
      if (!indices.length) return null;
      if (!this.dutiesByHolder[holderId])
        this.dutiesByHolder[holderId] = { data: null, previousSync: null, loading: false, error: null, loadedAt: null };
      const entry = this.dutiesByHolder[holderId];
      if (entry.loading) return null;
      entry.loading = true;
      try {
        const result = (await ControlService.getHolderDuties(holderId, indices)) ?? { code: 1, info: "no answer" };
        if (result.code === 0 && !result.empty) {
          // the last epoch of a period is accounted after the next one began, so its committee is kept
          if (entry.data?.sync && entry.data.sync.nextPeriodStart !== result.sync?.nextPeriodStart) entry.previousSync = entry.data.sync;
          entry.data = result;
          entry.error = null;
          entry.loadedAt = Date.now();
        } else if (result.code) {
          entry.error = result.info || "duties failed";
        }
        return result;
      } catch (err) {
        entry.error = String(err?.message || err);
        return { code: 1, info: entry.error };
      } finally {
        entry.loading = false;
      }
    },

    /**
     * Rewards of a completed epoch (epoch, attestationEpoch) and/or the outcome of proposals, merged into the
     * holder's history. Returns the answer, or null when skipped because another load is running.
     */
    async loadRewards(holderId, { epoch, attestationEpoch, proposals = [] } = {}) {
      if (!this.rewardsByHolder[holderId]) {
        this.rewardsByHolder[holderId] = {
          history: [],
          attestation: null,
          loading: false,
          error: null,
          unsupported: {},
          accountedEpoch: null,
          proposals: {},
        };
      }
      const entry = this.rewardsByHolder[holderId];
      if (entry.loading) return null;
      const byPubkey = this.statesByHolder[holderId]?.byPubkey ?? {};
      const withEpoch = Number.isSafeInteger(epoch);
      const duties = this.dutiesByHolder[holderId];
      const spe = duties?.data?.slotsPerEpoch ?? 32;
      // null: the committee of that epoch is not known, so its sync reward stays open
      const syncMembers = withEpoch ? syncCommitteeOf(duties, epoch) : null;
      const syncIndices = syncMembers ?? [];
      const request = {
        indices: Number.isSafeInteger(attestationEpoch) ? activeIndices(byPubkey) : [],
        attestationEpoch,
        epoch,
        syncIndices,
        proposals: proposals.map((p) => ({ slot: p.slot, index: p.index })),
        // matches each key with the ideal reward of its effective balance
        effectiveBalances: Object.fromEntries(
          Object.values(byPubkey)
            .filter((s) => Number.isSafeInteger(s?.effectiveBalance))
            .map((s) => [String(s.index), s.effectiveBalance])
        ),
      };
      entry.loading = true;
      try {
        // IPC cannot clone reactive proxies (the sync committee comes straight from dutiesByHolder), so send a plain copy
        const result = (await ControlService.getHolderRewards(holderId, JSON.parse(JSON.stringify(request)))) ?? {
          code: 1,
          info: "no answer",
        };
        if (result.code) {
          entry.error = result.info || "rewards failed";
          return result;
        }
        entry.error = null;
        entry.unsupported = { ...entry.unsupported, ...result.unsupported };
        for (const block of result.blocks ?? []) entry.proposals[block.slot] = { result: block.result, reward: block.reward };
        const known = [...(duties?.data?.proposals ?? []), ...proposals];
        if (withEpoch) {
          const row = { epoch, block: epochBlockReward(known, entry.proposals, epoch, spe) };
          // no committee membership means no sync reward, unless it could not be read
          if (result.sync) row.sync = result.sync.total;
          else if (syncMembers && !syncMembers.length) row.sync = 0;
          entry.history = mergeRewardHistory(entry.history, row);
          entry.accountedEpoch = epoch;
        }
        // an outcome that arrives after its epoch was accounted completes that row
        for (const e of new Set((result.blocks ?? []).map((b) => Math.floor(b.slot / spe)))) {
          const block = epochBlockReward(known, entry.proposals, e, spe);
          if (e !== epoch && Number.isFinite(block) && entry.history.some((row) => row.epoch === e)) {
            entry.history = mergeRewardHistory(entry.history, { epoch: e, block });
          }
        }
        // attestation rewards lag behind: their row is the finalized epoch, filled in when it arrives
        if (result.attestation) {
          entry.attestation = result.attestation;
          const row = { epoch: result.attestation.epoch, attestation: result.attestation.total };
          // an epoch from before the page was open has no sync reward booked; no committee membership means 0
          const existing = entry.history.find((r) => r.epoch === row.epoch);
          const members = syncCommitteeOf(duties, row.epoch);
          if (!Number.isFinite(existing?.sync) && members && !members.length) row.sync = 0;
          entry.history = mergeRewardHistory(entry.history, row);
        }
        return result;
      } catch (err) {
        entry.error = String(err?.message || err);
        return { code: 1, info: entry.error };
      } finally {
        entry.loading = false;
      }
    },

    // Obol or SSV cluster stats of a holder (a share shows its Charon/Pluto); a failure keeps the stats it had
    async loadClusterStats(holderId) {
      if (!this.clustersByHolder[holderId]) {
        this.clustersByHolder[holderId] = {
          kind: null,
          service: null,
          stats: {},
          empty: false,
          loading: false,
          error: null,
          loadedAt: null,
        };
      }
      const entry = this.clustersByHolder[holderId];
      if (entry.loading) return;
      entry.loading = true;
      try {
        const result = (await ControlService.getHolderClusterStats(holderId)) ?? { code: 1, info: "no answer" };
        if (result.code === 0) {
          entry.kind = result.kind;
          entry.service = result.service;
          entry.stats = result.stats ?? {};
          entry.empty = !!result.empty;
          entry.error = null;
          entry.loadedAt = Date.now();
        } else {
          entry.error = result.info || "cluster stats failed";
        }
      } catch (err) {
        entry.error = String(err?.message || err);
      } finally {
        entry.loading = false;
      }
    },

    // Lido CSM keys with their queue position; a failure keeps the keys it had
    async loadCsmKeys(force = false) {
      const csm = this.csm;
      if (csm.loading) return;
      csm.loading = true;
      try {
        const result = (await ControlService.getCsmKeys(force)) ?? { code: 1, info: "no answer" };
        if (typeof result.installed === "boolean") csm.installed = result.installed;
        if (result.installed === false) csm.keys = {};
        if (result.code === 0) {
          csm.keys = result.keys ?? {};
          csm.error = null;
          csm.loadedAt = Date.now();
        } else {
          csm.error = result.info || "CSM keys failed";
        }
      } catch (err) {
        csm.error = String(err?.message || err);
      } finally {
        csm.loading = false;
      }
    },

    // CSM keys of an earlier visit may be another server's: they stay shown, but count as unconfirmed until read again
    unconfirmCsm(installed) {
      if (installed) this.csm.installed = true;
      this.csm.loadedAt = null;
      this.csm.error = null;
    },

    toggleSelection(pubkey) {
      if (this.selection[pubkey]) delete this.selection[pubkey];
      else this.selection[pubkey] = true;
    },

    // Beacon states of a holder's keys; a failed query keeps the states it had so nothing flickers
    async loadStates(holderId) {
      const holder = this.holders.find((h) => h.id === holderId);
      const keys = this.keysByHolder[holderId]?.keys;
      if (!holder || holder.role === "share" || !keys?.length) return;
      if (!this.statesByHolder[holderId]) {
        this.statesByHolder[holderId] = { byPubkey: {}, chain: null, source: null, base: null, loading: false, error: null };
      }
      const entry = this.statesByHolder[holderId];
      if (entry.loading) return;
      entry.loading = true;
      try {
        const result = await ControlService.getHolderValidatorStates(
          keys.map((k) => k.pubkey),
          holderId
        );
        if (result?.code === 0) {
          entry.byPubkey = result.byPubkey;
          entry.chain = {
            headSlot: result.headSlot,
            slotsPerEpoch: result.slotsPerEpoch,
            secondsPerSlot: result.secondsPerSlot,
            genesisTime: result.genesisTime ?? null,
          };
          entry.source = result.source;
          entry.base = result.base;
          entry.error = null;
          // a sent exit shows until the beacon reports the key as no longer active
          for (const pubkey of Object.keys(this.exitsSent)) {
            if (result.byPubkey[pubkey] && statusBucket(result.byPubkey[pubkey]) !== "active") delete this.exitsSent[pubkey];
          }
        } else {
          entry.error = result?.info || "state query failed";
        }
      } catch (err) {
        entry.error = String(err?.message || err);
      } finally {
        entry.loading = false;
      }
    },
  },
});
