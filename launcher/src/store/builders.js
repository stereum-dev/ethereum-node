import { defineStore } from "pinia";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { DEFAULT_BUILDER_SETTINGS, builderUrl } from "@/share/builders";

// a relay of the list as a builder entry for a network: { name, url } or null when it serves no ePBS there yet
export function epbsRelay(relay, network) {
  const url = relay?.epbs?.[network];
  return url ? { name: relay.name, url, authData: "" } : null;
}

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
      if (configured && setup.clients.some((c) => c.support.reason === "update")) return "red";
      if (!setup.saved && setup.mevBoostRelays.length) return "amber";
      if (setup.saved && setup.clients.some((c) => c.support.apply && c.inSync === false)) return "amber";
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
      const due = [...new Set(urls.filter(Boolean))].filter((url) => !this.probes[url] || now - this.probes[url].at > 600000);
      if (!due.length) return;
      for (const url of due) this.probes[url] = { result: "checking", status: 0, at: now };
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
      }
    },
    async save(setupId, builders, { restart = true } = {}) {
      const result = await ControlService.setBuilderSettings({ setupId, builders: JSON.parse(JSON.stringify(builders)), restart });
      await this.load();
      return result;
    },
    /**
     * The settings to start the dialog with, one entry per validator client: the saved ones, or (fromSetup)
     * what the setup uses now: its MEV-Boost's relays and minimum bid and the boost each client is set to.
     * @returns {{ builders: { route, clients }, missing: Array<string> }} missing: MEV-Boost relays without ePBS on this network yet
     */
    draftFor(setup, fromSetup = !setup.saved) {
      if (!fromSetup) return { builders: JSON.parse(JSON.stringify(setup.builders)), missing: [] };
      const list = useNodeManage().relaysList;
      const relays = [];
      const missing = [];
      for (const url of setup.mevBoostRelays) {
        const known = list.find((r) => builderUrl(r[setup.network]) === builderUrl(url));
        const entry = epbsRelay(known, setup.network);
        if (entry) relays.push(entry);
        else missing.push(known?.name ?? builderUrl(url) ?? url);
      }
      const clients = Object.fromEntries(
        setup.clients.map((c) => [
          c.id,
          {
            ...JSON.parse(JSON.stringify(DEFAULT_BUILDER_SETTINGS)),
            relays: JSON.parse(JSON.stringify(relays)),
            minBid: setup.mevBoostMinBid ?? "0",
            boostFactor: c.currentBoost ?? null,
          },
        ])
      );
      return { builders: { route: "direct", clients }, missing };
    },
  },
});
