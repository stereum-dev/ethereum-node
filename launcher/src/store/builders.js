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
  }),
  getters: {
    // a setup's marker: amber for relays still to move or settings not on a client yet, red for a client too old for the fork
    markerOf: (state) => (setupId) => {
      const setup = state.setups.find((s) => s.setupId === setupId);
      if (!setup) return null;
      const configured = setup.saved ? setup.builders.relays?.length > 0 : setup.mevBoostRelays.length > 0;
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
    async save(setupId, builders) {
      const result = await ControlService.setBuilderSettings({ setupId, builders: JSON.parse(JSON.stringify(builders)) });
      await this.load();
      return result;
    },
    /**
     * The settings to start the dialog with: the saved ones, or (fromSetup) what the setup uses now:
     * its MEV-Boost's relays and minimum bid and the boost its validator clients are set to.
     * @returns {{ builders: Object, missing: Array<string> }} missing: MEV-Boost relays without ePBS on this network yet
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
      const builders = {
        ...JSON.parse(JSON.stringify(DEFAULT_BUILDER_SETTINGS)),
        relays,
        minBid: setup.mevBoostMinBid ?? "0",
        clients: {},
      };
      // a boost the clients are set to now: shared by all of them it becomes the setup's, otherwise their own
      const boosts = setup.clients.filter((c) => c.currentBoost !== null && c.currentBoost !== undefined);
      const values = new Set(boosts.map((c) => c.currentBoost));
      if (values.size === 1 && boosts.length === setup.clients.length) builders.boostFactor = boosts[0].currentBoost;
      else
        for (const c of boosts)
          builders.clients[c.id] = {
            ...JSON.parse(JSON.stringify({ ...builders, clients: undefined })),
            boostFactor: c.currentBoost,
            own: true,
          };
      return { builders, missing };
    },
  },
});
