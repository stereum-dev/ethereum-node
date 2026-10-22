import { defineStore } from "pinia";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { DEFAULT_BUILDER_SETTINGS, builderUrl } from "@/share/builders";

/**
 * A relay of the list as a builder entry for a network, or null when it serves no ePBS there yet.
 * Its ePBS address is the listed one, else its MEV-Boost host once the live check found it answering.
 * @param {Object} probes - live check results by builder url
 */
export function epbsRelay(relay, network, probes = {}) {
  const host = builderUrl(relay?.[network]);
  const url = relay?.epbs?.[network] ?? (host && probes[host]?.result === "ready" ? host : null);
  return url ? { name: relay.name, url, authData: "" } : null;
}

// live checks in flight by url, so a second caller can wait for them
const probesRunning = new Map();

export const useBuilders = defineStore("builders", {
  state: () => ({
    setups: [],
    loading: false,
    error: null,
    loadedAt: 0,
    // ePBS probe per builder url: { result, status, at }
    probes: {},
  }),
  getters: {
    // a setup's marker: amber for relays still to move or settings not on a client yet, red for a client too old for the fork
    markerOf: (state) => (setupId) => {
      const setup = state.setups.find((s) => s.setupId === setupId);
      if (!setup) return null;
      const configured = setup.saved
        ? Object.values(setup.builders.clients ?? {}).some((c) => c.relays?.length > 0)
        : setup.mevBoostRelays.length > 0;
      if (configured && setup.clients.some((c) => ["update", "dvt-update"].includes(c.support.reason))) return "red";
      if (!setup.saved && setup.mevBoostRelays.length) return "amber";
      if (setup.saved && setup.clients.some((c) => c.support.apply && c.inSync === false)) return "amber";
      if (setup.saved && (setup.clusters ?? []).some((c) => c.support.apply && c.inSync === false)) return "amber";
      return null;
    },
  },
  actions: {
    async load() {
      this.loading = true;
      this.error = null;
      try {
        this.setups = (await ControlService.getBuilderSettings()) ?? [];
        this.loadedAt = Date.now();
      } catch (err) {
        this.error = String(err?.message ?? err);
      } finally {
        this.loading = false;
      }
    },
    // asks the server once every 10 minutes per url whether a builder serves ePBS
    async probe(urls) {
      const now = Date.now();
      const wanted = [...new Set(urls.filter(Boolean))];
      const due = wanted.filter((url) => !this.probes[url] || now - this.probes[url].at > 600000);
      // checks another caller started for some of these urls
      const running = wanted.filter((url) => !due.includes(url) && probesRunning.has(url)).map((url) => probesRunning.get(url));
      if (!due.length) return Promise.all(running);
      for (const url of due) this.probes[url] = { result: "checking", status: 0, at: now };
      const run = (async () => {
        try {
          const results = (await ControlService.probeBuilders({ urls: due })) ?? [];
          const byUrl = new Map(results.map((r) => [r.url, r]));
          for (const url of due) {
            const r = byUrl.get(url);
            if (r) this.probes[url] = { result: r.result, status: r.status, at: now };
            else delete this.probes[url];
          }
        } catch {
          for (const url of due) delete this.probes[url];
        } finally {
          for (const url of due) probesRunning.delete(url);
        }
      })();
      for (const url of due) probesRunning.set(url, run);
      await Promise.all([run, ...running]);
    },
    async save(setupId, builders, { restart = true } = {}) {
      const result = await ControlService.setBuilderSettings({ setupId, builders: JSON.parse(JSON.stringify(builders)), restart });
      await this.load();
      return result;
    },
    /**
     * The settings to start the dialog with, one entry per validator client: the saved ones, or (fromSetup)
     * what the setup uses now: its MEV-Boost's relays and minimum bid and the boost each client is set to.
     * Relays count once they are listed with an ePBS address or answer the live check (probe them first).
     * @returns {{ builders: { route, clients }, missing: Array<string> }} missing: MEV-Boost relays without ePBS on this network yet
     */
    draftFor(setup, fromSetup = !setup.saved) {
      // a cluster's builders are what Charon's proposer config holds, also when changed outside the dialog;
      // before the first save a file without builders keeps the takeover as a start
      const fromFile = (builders, takeover) => {
        for (const c of setup.clusters ?? [])
          if (c.current && !(takeover && !c.current.relays?.length))
            builders.clients[c.id] = { ...JSON.parse(JSON.stringify(DEFAULT_BUILDER_SETTINGS)), ...JSON.parse(JSON.stringify(c.current)) };
        return builders;
      };
      if (!fromSetup) return { builders: fromFile(JSON.parse(JSON.stringify(setup.builders)), false), missing: [] };
      const list = useNodeManage().relaysList;
      const relays = [];
      const missing = [];
      for (const url of setup.mevBoostRelays) {
        const known = list.find((r) => builderUrl(r[setup.network]) === builderUrl(url));
        const entry = epbsRelay(known, setup.network, this.probes);
        if (entry) relays.push(entry);
        else missing.push(known?.name ?? builderUrl(url) ?? url);
      }
      const fromMevBoost = (boostFactor) => ({
        ...JSON.parse(JSON.stringify(DEFAULT_BUILDER_SETTINGS)),
        relays: JSON.parse(JSON.stringify(relays)),
        minBid: setup.mevBoostMinBid ?? "0",
        boostFactor,
      });
      const clients = Object.fromEntries(setup.clients.map((c) => [c.id, fromMevBoost(c.currentBoost ?? null)]));
      // a cluster without a proposer config yet starts like the setup's MEV-Boost (with Charon's own boost)
      for (const c of setup.clusters ?? []) clients[c.id] = fromMevBoost(null);
      return { builders: fromFile({ route: "direct", clients }, true), missing };
    },
  },
});
