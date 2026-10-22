import * as log from "electron-log";
import YAML from "yaml";
import { SSHService } from "./SSHService.js";
import { StringUtils } from "./StringUtils.js";
import { isObolDVTService } from "@/share/ObolDVTServices";
import {
  BUILDER_CLIENTS,
  clientBuilderSettings,
  validateBuilderSettings,
  cleanBuilderSettings,
  builderSupport,
  builderConfiguration,
  applyBuilderFlags,
  mergeLighthouseBuilderFile,
  lighthouseFileInSync,
  mevBoostMinBid,
  currentBoost,
  builderUrl,
  EPBS_PROBE_PATH,
  EPBS_PROBE_CONTROL_PATH,
  epbsProbeResult,
} from "@/share/builders";
import {
  PROPOSER_CONFIG_PATH,
  charonBuilderFlags,
  applyCharonBuilderFlags,
  withBuilderSection,
  settingsFromProposerConfig,
  clusterSettingsProblems,
  charonVersionOf,
  parseRemoteProposerConfig,
  remoteBuilderApi,
  beaconUrlsOf,
  REMOTE_COPY_FILE,
} from "@/share/obolBuilders";
import { GLOAS_MIN_VERSIONS, compareVersions, gloasForkTime } from "@/share/gloasFork";

// separates the ePBS probe's two answers in one exec
const CONTROL_MARK = "--- control";

const SHORT_NAMES = {
  LodestarValidatorService: "Lodestar",
  PrysmValidatorService: "Prysm",
  TekuValidatorService: "Teku",
  NimbusValidatorService: "Nimbus",
  LighthouseValidatorService: "Lighthouse",
  CharonService: "Charon",
  PlutoService: "Pluto",
};

const LIGHTHOUSE_DATA = "/opt/app/validator";

// why a client was left out, for the task panel
function skipReason({ support, version }, network) {
  switch (support.reason) {
    case "update":
      return support.minimum
        ? `needs ${support.minimum} for the ${network} fork, runs ${version}`
        : `no release for the ${network} fork yet, runs ${version}`;
    case "after-fork":
      return "set after the fork, its beacon node has no MEV-Boost";
    case "dvt-update":
      return support.minimum
        ? `its cluster needs ${support.minimum} for the ${network} fork`
        : `its cluster's middleware has no release for the ${network} fork yet`;
    case "dvt-pending":
      return "Charon has not written its proposer config yet, start Charon 2.0 first";
    case "remote-pending":
      return "no copy of the proposer config of its Charon on another server yet";
    default:
      return `no Glamsterdam on ${network} yet`;
  }
}

/**
 * Builder settings (Glamsterdam / ePBS) per validator client, stored as "builders" in the setup's entry of
 * multisetup.yaml, and written to the validator clients as flags (Lighthouse: a file).
 */
export class BuilderSettings {
  constructor(serviceManager) {
    this.serviceManager = serviceManager;
    this.nodeConnection = serviceManager.nodeConnection;
  }

  async readSetups() {
    const raw = await this.serviceManager.configManager.readMultiSetup();
    return raw ? (YAML.parse(raw) ?? {}) : {};
  }

  // the validator clients of a setup with what decides about their builder settings
  validatorsOf(setup, services, running, remote = new Map()) {
    const ids = new Set(setup.services ?? []);
    return services
      .filter((s) => ids.has(s.id) && BUILDER_CLIENTS[s.service])
      .map((s) => {
        const connected = (s.dependencies?.consensusClients ?? []).map((c) => services.find((x) => x.id === c.id) ?? c);
        // a Charon here, or one on another server that its beacon node URL answers for
        const remoteUrl = this.remoteUrlsOf(s, services).find((url) => remote.has(url));
        const middleware =
          connected.find((c) => isObolDVTService(c.service)) ??
          (remoteUrl
            ? { id: `charon@${remoteUrl}`, service: "RemoteCharon", link: remoteUrl, remoteVersion: remote.get(remoteUrl) }
            : null);
        return {
          service: s,
          middleware,
          dvt: !!middleware,
          clusterId: middleware?.id ?? null,
          usesMevBoost: connected.some((c) => c.dependencies?.mevboost?.length > 0),
          beaconCommand: connected.find((c) => c.command)?.command ?? null,
          running: running.has(s.id),
        };
      });
  }

  lighthouseFilePath(service) {
    const dir = service.volumes.find((v) => v.servicePath === LIGHTHOUSE_DATA)?.destinationPath;
    return dir ? `${dir}/${BUILDER_CLIENTS.LighthouseValidatorService.file}` : null;
  }

  // the Obol middlewares (Charon, Pluto) the setup's validator clients sign through, here or on another server
  clustersOf(validators, services, running) {
    const ids = [...new Set(validators.filter((v) => v.clusterId).map((v) => v.clusterId))];
    return ids
      .map((id) => services.find((s) => s.id === id) ?? validators.find((v) => v.clusterId === id).middleware)
      .filter(Boolean)
      .map((service) => ({
        service,
        running: running.has(service.id),
        vcs: validators.filter((v) => v.clusterId === service.id).map((v) => v.service.id),
        vcServices: validators.filter((v) => v.clusterId === service.id).map((v) => v.service),
        // the release of a Charon on another server, from its version answer
        remoteVersion: service.remoteVersion ?? null,
      }));
  }

  // the setup's Charons without a validator client on this server: their builders are set here for the ones elsewhere
  standaloneClusters(setup, services, running, clusterList) {
    const ids = new Set(setup.services ?? []);
    const known = new Set(clusterList.map((c) => c.service.id));
    return services
      .filter((s) => ids.has(s.id) && s.service === "CharonService" && !known.has(s.id))
      .map((service) => ({ service, running: running.has(service.id), vcs: [], remoteVersion: null }));
  }

  // the beacon node URLs of a validator client outside Stereum: an external beacon node's, or set in its command
  remoteUrlsOf(vc, services) {
    const connected = (vc.dependencies?.consensusClients ?? []).map((c) => services.find((x) => x.id === c.id) ?? c);
    if (connected.some((c) => c.service && c.service !== "ExternalConsensusService")) return [];
    const links = connected
      .filter((c) => c.service === "ExternalConsensusService" && c.env?.link)
      .map((c) => String(c.env.link).trim().replace(/\/+$/, ""));
    return links.length ? links : beaconUrlsOf(vc.service, vc.command);
  }

  /**
   * The beacon node URLs of validator clients that are Charons on another server, by their answer to
   * /eth/v1/node/version, asked from the server.
   * @returns {Map<string, string>} URL to Charon's release
   */
  async remoteCharons(services) {
    const urls = [...new Set(services.filter((s) => BUILDER_CLIENTS[s.service]).flatMap((s) => this.remoteUrlsOf(s, services)))];
    const found = new Map();
    await Promise.all(
      urls.map(async (url) => {
        const result = await this.nodeConnection.sshService
          .exec(`curl -s -m 3 ${StringUtils.escapeStringForShell(`${url}/eth/v1/node/version`)} || true`)
          .catch(() => null);
        try {
          const version = charonVersionOf(JSON.parse(result?.stdout ?? "")?.data?.version);
          if (version) found.set(url, version);
        } catch {
          // not a beacon node answer
        }
      })
    );
    return found;
  }

  // a validator client's copy of its remote Charon's proposer config, in its folder (manage-service reads it there)
  remoteCopyPath(vc) {
    const first = vc.volumes?.[0]?.destinationPath;
    return first ? `${first.replace(/\/+$/, "").replace(/\/[^/]+$/, "")}/${REMOTE_COPY_FILE}` : null;
  }

  // a path inside a container on the host, through the volume that holds it
  hostPath(service, containerPath) {
    const volume = (service.volumes ?? [])
      .filter((v) => containerPath === v.servicePath || containerPath.startsWith(`${v.servicePath}/`))
      .sort((a, b) => b.servicePath.length - a.servicePath.length)[0];
    return volume ? `${volume.destinationPath}${containerPath.slice(volume.servicePath.length)}` : null;
  }

  async readFile(path) {
    if (!path) return null;
    const result = await this.nodeConnection.sshService.exec(`cat ${StringUtils.escapeStringForShell(path)} 2>/dev/null || true`);
    return result?.stdout ?? "";
  }

  async writeFile(path, content) {
    const dir = StringUtils.escapeStringForShell(path.replace(/\/[^/]+$/, ""));
    const write = await this.nodeConnection.sshService.exec(
      `mkdir -p ${dir} && echo ${StringUtils.escapeStringForShell(content)} > ${StringUtils.escapeStringForShell(path)}`
    );
    if (SSHService.checkExecError(write)) throw new Error(SSHService.extractExecError(write));
  }

  // the proposer config a validator client renders: Charon's file, or for a Charon on another server its own copy
  proposerConfigPath(middleware, vc) {
    if (middleware.service === "RemoteCharon") return vc ? this.remoteCopyPath(vc) : null;
    return this.hostPath(middleware, `/opt/charon/${PROPOSER_CONFIG_PATH}`);
  }

  async readProposerConfig(middleware, vc) {
    try {
      const raw = await this.readFile(this.proposerConfigPath(middleware, vc));
      return raw?.trim() ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // whether a middleware runs a release that follows the network's fork
  middlewareSupport(service, network) {
    if (gloasForkTime(network) === null) return { apply: false, reason: "not-scheduled", minimum: null };
    const minimum = GLOAS_MIN_VERSIONS[network]?.[service.service] ?? null;
    // an unknown tag (like "latest") does not count as ready
    if (minimum === null || ![0, 1].includes(compareVersions(service.imageVersion, minimum)))
      return { apply: false, reason: "update", minimum };
    return { apply: true, reason: null, minimum };
  }

  /**
   * An Obol cluster as the dialog shows it. Its builders live in the proposer config Charon writes, which all
   * validator clients of the cluster read; Charon's builder flags have to match that file.
   */
  async describeCluster({ service, running, vcs, vcServices, remoteVersion }, builders, network) {
    if (remoteVersion) return this.describeRemoteCluster({ service, vcs, vcServices, remoteVersion }, network);
    const support = this.middlewareSupport(service, network);
    const proposerConfig = await this.readProposerConfig(service);
    // what the file holds is the cluster's setting, also when it was changed outside the dialog
    const current = proposerConfig ? settingsFromProposerConfig(proposerConfig) : null;
    const flags = charonBuilderFlags(current ?? clientBuilderSettings(builders, service.id));
    const inSync =
      support.apply && proposerConfig
        ? JSON.stringify(applyCharonBuilderFlags(service.command ?? [], flags)) === JSON.stringify(service.command ?? [])
        : null;
    return {
      id: service.id,
      service: service.service,
      version: service.imageVersion,
      running,
      vcs,
      support,
      hasProposerConfig: !!proposerConfig,
      // fee recipients and gas limits for the preview of what its validator clients get
      proposerConfig,
      builderApi: (service.command ?? []).includes("--builder-api"),
      current,
      flags,
      inSync,
    };
  }

  /** A cluster whose Charon runs on another server: its builders come from a copy of Charon's proposer config. */
  async describeRemoteCluster({ service, vcs, vcServices, remoteVersion }, network) {
    const support = this.middlewareSupport({ service: "CharonService", imageVersion: remoteVersion }, network);
    // every validator client of it gets the same copy
    const proposerConfig = await this.readProposerConfig(service, vcServices[0]);
    return {
      id: service.id,
      service: "CharonService",
      version: remoteVersion,
      remote: true,
      link: service.link,
      running: false,
      vcs,
      support,
      hasProposerConfig: !!proposerConfig,
      proposerConfig,
      builderApi: remoteBuilderApi(proposerConfig),
      current: proposerConfig ? settingsFromProposerConfig(proposerConfig) : null,
      flags: [],
      inSync: null,
    };
  }

  /**
   * Whether a cluster's validator client runs with Charon's current proposer config: Stereum renders it into
   * its settings on every start (manage-service), so it has it when it started after the file last changed.
   * @returns {boolean|null} null when it doesn't run
   */
  async startedAfterProposerConfig(vc, middleware) {
    const path = this.proposerConfigPath(middleware, vc);
    if (!path) return null;
    const result = await this.nodeConnection.sshService.exec(
      `stat -c %Y ${StringUtils.escapeStringForShell(path)} 2>/dev/null; docker inspect -f '{{.State.Running}} {{.State.StartedAt}}' stereum-${vc.id} 2>/dev/null`
    );
    const [mtime, state] = String(result?.stdout ?? "")
      .trim()
      .split("\n");
    const [running, startedAt] = String(state ?? "").split(" ");
    if (running !== "true" || !startedAt) return null;
    return Date.parse(startedAt) / 1000 >= Number(mtime);
  }

  async readLighthouseFile(path) {
    const result = await this.nodeConnection.sshService.exec(`cat ${StringUtils.escapeStringForShell(path)} 2>/dev/null || true`);
    try {
      return YAML.parse(result?.stdout ?? "") ?? null;
    } catch {
      return null;
    }
  }

  async runningIds() {
    try {
      return new Set((await this.nodeConnection.listServices()).map((s) => s.Names.replace("stereum-", "")));
    } catch (err) {
      log.warn("Couldn't list the running services:", err?.message ?? err);
      return new Set();
    }
  }

  /**
   * What the dialog shows: per setup with validator clients its settings, the relays its MEV-Boost uses
   * and per validator client whether and what it gets.
   */
  async getBuilderSettings() {
    const [setups, services, running] = await Promise.all([
      this.readSetups(),
      this.serviceManager.readServiceConfigurations(),
      this.runningIds(),
    ]);
    const remote = await this.remoteCharons(services);
    const result = [];
    for (const [setupId, setup] of Object.entries(setups)) {
      const validators = this.validatorsOf(setup, services, running, remote);
      const linked = this.clustersOf(validators, services, running);
      const standalone = this.standaloneClusters(setup, services, running, linked);
      if (!validators.length && !standalone.length) continue;
      // one entry per client, also for setups saved with the setup's settings at the top
      const clusterList = [...linked, ...standalone];
      const builders = {
        route: setup.builders?.route ?? "direct",
        clients: Object.fromEntries(
          [...validators.map((v) => v.service.id), ...clusterList.map((c) => c.service.id)].map((id) => [
            id,
            clientBuilderSettings(setup.builders, id),
          ])
        ),
      };
      const clusters = [];
      const clusterState = {};
      for (const c of clusterList) {
        const described = await this.describeCluster(c, builders, setup.network);
        clusters.push(described);
        clusterState[c.service.id] = {
          middleware: c.service,
          remote: !!c.remoteVersion,
          support: described.support,
          proposerConfig: described.proposerConfig,
        };
      }
      const mevBoost = services.find((s) => (setup.services ?? []).includes(s.id) && s.service === "FlashbotsMevBoostService");
      const relaysAt = mevBoost?.entrypoint?.indexOf("-relays") ?? -1;
      const mevBoostRelays =
        relaysAt >= 0
          ? String(mevBoost.entrypoint[relaysAt + 1] ?? "")
              .split(",")
              .filter((r) => r && r !== '""')
          : [];
      const clients = [];
      for (const v of validators) {
        clients.push(await this.describe(v, builders, setup.network, clusterState));
      }
      // a Charon without a validator client here is shown as one, to set its builders
      for (const c of standalone) {
        const d = clusters.find((x) => x.id === c.service.id);
        clients.push({
          id: d.id,
          service: d.service,
          version: d.version,
          running: d.running,
          usesMevBoost: false,
          clusterId: d.id,
          middleware: true,
          currentBoost: null,
          notes: [],
          support: d.support,
          flags: [],
          file: null,
          files: [],
          inSync: d.inSync,
        });
      }
      result.push({
        setupId,
        name: setup.name,
        network: setup.network,
        builders,
        saved: !!setup.builders,
        mevBoost: mevBoost?.id ?? null,
        mevBoostRelays,
        mevBoostMinBid: mevBoost ? mevBoostMinBid(mevBoost.entrypoint) : "0",
        clients,
        clusters,
      });
    }
    return result;
  }

  async describe({ service, dvt, clusterId, usesMevBoost, beaconCommand, running }, builders, network, clusters = {}) {
    const own = builderSupport({ service: service.service, version: service.imageVersion, network, usesMevBoost });
    const base = {
      id: service.id,
      service: service.service,
      version: service.imageVersion,
      running,
      usesMevBoost,
      clusterId,
      // the boost it is set to before the fork, for the first settings
      currentBoost: currentBoost(service.service, service.command, beaconCommand),
      notes: [],
    };
    if (dvt) {
      // its builders are the cluster's: Stereum renders its settings from the middleware's proposer config
      const cluster = clusters[clusterId];
      let support = own;
      if (own.apply || own.reason === "after-fork") support = { apply: true, reason: null, minimum: own.minimum };
      if (support.apply && !cluster?.support?.apply)
        support = {
          apply: false,
          reason: "dvt-update",
          minimum: cluster?.support?.minimum ?? null,
          middleware: cluster?.middleware?.service,
        };
      else if (support.apply && !cluster.proposerConfig)
        support = { apply: false, reason: cluster.remote ? "remote-pending" : "dvt-pending", minimum: null };
      if (!support.apply) return { ...base, support, flags: [], file: null, files: [], inSync: null };
      // Stereum renders its settings from Charon's proposer config on every start
      return {
        ...base,
        support,
        flags: [],
        file: null,
        files: [],
        inSync: await this.startedAfterProposerConfig(service, cluster.middleware),
      };
    }
    const settings = clientBuilderSettings(builders, service.id);
    const support = own;
    const { flags, file, notes } = builderConfiguration(service.service, settings, service.imageVersion);
    let inSync = null;
    if (support.apply) {
      if (file) {
        const path = this.lighthouseFilePath(service);
        const current = path ? await this.readLighthouseFile(path) : null;
        inSync = lighthouseFileInSync(current, file);
      } else {
        inSync =
          JSON.stringify(applyBuilderFlags(service.service, service.command, flags, usesMevBoost)) === JSON.stringify(service.command);
      }
    }
    return { ...base, support, flags, file, files: [], notes, inSync };
  }

  /**
   * Saves the builder settings of a setup's validator clients and writes them. Running ones are restarted
   * unless restart is false: then the settings take effect at their next restart.
   * @param {Object} args - { setupId, builders: { clients: { <service id>: settings } }, restart }
   * @returns {{ code: number, info?: string, results?: Array }} code 0 = saved
   */
  async setBuilderSettings({ setupId, builders, restart = true } = {}) {
    let problems = [...new Set(Object.values(builders?.clients ?? {}).flatMap((s) => validateBuilderSettings(s ?? {})))];
    if (problems.length) return { code: 1, info: problems.join(", ") };

    const ref = StringUtils.createRandomString();
    const tm = this.nodeConnection.taskManager;
    const subtask = (name, ok, data) => tm?.otherTasksHandler(ref, name, ok, data);
    const results = [];
    try {
      const setups = await this.readSetups();
      const setup = setups[setupId];
      if (!setup) return { code: 1, info: "setup not found" };
      const [services, running] = await Promise.all([this.serviceManager.readServiceConfigurations(), this.runningIds()]);
      const remote = await this.remoteCharons(services);
      const validators = this.validatorsOf(setup, services, running, remote);
      const linked = this.clustersOf(validators, services, running);
      const clusterList = [...linked, ...this.standaloneClusters(setup, services, running, linked)];
      // a remote Charon's builders come with the pasted copy, its flags are set on its own server
      problems = [
        ...new Set(
          clusterList.filter((c) => !c.remoteVersion).flatMap((c) => clusterSettingsProblems(builders?.clients?.[c.service.id] ?? {}))
        ),
      ];
      for (const [id, config] of Object.entries(builders?.proposerConfigs ?? {})) {
        const { error } = parseRemoteProposerConfig(JSON.stringify(config));
        if (error) problems.push(`proposer config for ${id}: ${error}`);
      }
      if (problems.length) return { code: 1, info: problems.join(", ") };
      tm?.otherTasksHandler(ref, `Set builders (${validators.length || clusterList.length})`);

      const cleaned = cleanBuilderSettings(builders);
      // a client that was removed from the setup takes its settings with it
      const ids = new Set([...validators.map((v) => v.service.id), ...clusterList.map((c) => c.service.id)]);
      setup.builders = { route: cleaned.route, clients: Object.fromEntries(Object.entries(cleaned.clients).filter(([id]) => ids.has(id))) };
      await this.serviceManager.configManager.writeMultiSetup(setups);
      subtask("Saved settings", true, YAML.stringify(setup.builders));

      // the clusters first: their validator clients render their settings from the middleware's proposer config
      const clusterState = {};
      for (const c of clusterList) {
        clusterState[c.service.id] = c.remoteVersion
          ? await this.applyRemoteCluster(c, setup, builders?.proposerConfigs?.[c.service.id], subtask, results)
          : await this.applyCluster(c, setup, restart, subtask, results);
      }

      for (const v of validators) {
        const name = SHORT_NAMES[v.service.service];
        const entry = await this.describe(v, setup.builders, setup.network, clusterState);
        // a cluster's validator client renders Charon's proposer config itself when it starts
        if (v.dvt && entry.support.apply) {
          if (entry.inSync === true) {
            subtask(`${name}: unchanged`, true, "runs with Charon's current proposer config");
            results.push({ id: v.service.id, applied: true, changed: false });
          } else if (v.running && restart) {
            await this.serviceManager.manageServiceState(v.service.id, "restarted");
            subtask(`${name}: restarted`, true, "restarted to load Charon's proposer config");
            results.push({ id: v.service.id, applied: true, changed: true, restarted: true });
          } else {
            subtask(`${name}: not restarted`, true, "takes Charon's proposer config at its next start");
            results.push({ id: v.service.id, applied: true, changed: true, restarted: false });
          }
          continue;
        }
        if (!entry.support.apply) {
          subtask(`${name}: ${entry.support.reason}`, true, skipReason(entry, setup.network));
          results.push({ id: v.service.id, applied: false, reason: entry.support.reason });
          continue;
        }
        if (entry.inSync) {
          subtask(`${name}: unchanged`, true, entry.file ? YAML.stringify(entry.file) : entry.flags.join("\n") || "no builder flags");
          results.push({ id: v.service.id, applied: true, changed: false });
          continue;
        }
        try {
          if (entry.file) {
            const path = this.lighthouseFilePath(v.service);
            const merged = mergeLighthouseBuilderFile(await this.readLighthouseFile(path), entry.file);
            const content = StringUtils.escapeStringForShell(YAML.stringify(merged));
            const dir = StringUtils.escapeStringForShell(path.replace(/\/[^/]+$/, ""));
            const write = await this.nodeConnection.sshService.exec(
              `mkdir -p ${dir} && echo ${content} > ${StringUtils.escapeStringForShell(path)}`
            );
            if (SSHService.checkExecError(write)) throw new Error(SSHService.extractExecError(write));
            subtask(`${name}: builder file`, true, YAML.stringify(merged));
          } else {
            v.service.command = applyBuilderFlags(v.service.service, v.service.command, entry.flags, v.usesMevBoost);
            await this.serviceManager.writeServiceConfigurationKeepingAutoupdate(v.service);
            subtask(`${name}: flags`, true, entry.flags.join("\n") || "no builder flags");
          }
          if (v.running && restart) {
            await this.serviceManager.manageServiceState(v.service.id, "restarted");
            subtask(`${name}: restarted`, true, "restarted to load the new settings");
          } else if (v.running) {
            subtask(`${name}: not restarted`, true, "takes effect at its next restart");
          }
          results.push({ id: v.service.id, applied: true, changed: true, restarted: v.running && restart });
        } catch (err) {
          log.error(`Writing the builder settings of ${v.service.id} failed:`, err);
          subtask(`${name}: failed`, false, err?.message ?? String(err));
          results.push({ id: v.service.id, applied: false, reason: "failed", error: err?.message ?? String(err) });
        }
      }
      const vcs = results.filter((r) => !r.cluster);
      const applied = vcs.filter((r) => r.applied).length;
      const failed = results.filter((r) => r.reason === "failed").length;
      subtask("Result", failed === 0, `${applied} of ${vcs.length} validator clients set${failed ? `, ${failed} failed` : ""}`);
      return { code: failed ? 2 : 0, results };
    } catch (err) {
      log.error("Setting the builder settings failed:", err);
      subtask("Result", false, err?.message ?? String(err));
      return { code: 1, info: err?.message ?? String(err) };
    } finally {
      tm?.otherTasksHandler(ref);
    }
  }

  /**
   * Stores a pasted copy of a remote Charon's proposer config in the folder of each of its validator clients,
   * where they render it from on every start. Without a new copy the stored ones stay.
   * @returns {{ middleware, remote, support, proposerConfig }} for the cluster's validator clients
   */
  async applyRemoteCluster({ service, vcServices, remoteVersion }, setup, pasted, subtask, results) {
    const name = "Charon copy";
    const support = this.middlewareSupport({ service: "CharonService", imageVersion: remoteVersion }, setup.network);
    if (!support.apply) {
      subtask(
        `${name}: update`,
        true,
        `${service.link} runs ${remoteVersion}, needs ${support.minimum ?? "a release"} for the ${setup.network} fork`
      );
      results.push({ id: service.id, cluster: true, applied: false, reason: "update" });
      return { middleware: service, remote: true, support, proposerConfig: null };
    }
    try {
      let proposerConfig = await this.readProposerConfig(service, vcServices[0]);
      if (pasted) {
        const written = [];
        for (const vc of vcServices) {
          const current = await this.readProposerConfig(service, vc);
          if (JSON.stringify(current) === JSON.stringify(pasted)) continue;
          await this.writeFile(this.remoteCopyPath(vc), JSON.stringify(pasted));
          written.push(this.remoteCopyPath(vc));
        }
        proposerConfig = pasted;
        const builders = (pasted.default_config.builder?.builders ?? []).map((b) => b.url);
        const keys = Object.keys(pasted.proposer_config ?? {}).length;
        subtask(
          `${name}: ${written.length ? "stored" : "unchanged"}`,
          true,
          [
            `Charon ${remoteVersion} at ${service.link}`,
            ...written,
            `builders: ${builders.join(", ") || "none"}`,
            `fee recipient: ${pasted.default_config.fee_recipient}, ${keys} keys with their own`,
            `gas limit: ${pasted.default_config.gas_limit}`,
          ].join("\n")
        );
      } else {
        subtask(
          `${name}: ${proposerConfig ? "unchanged" : "none"}`,
          true,
          proposerConfig ? "keeps the stored copy" : `paste the proposer config of Charon at ${service.link}`
        );
      }
      results.push({ id: service.id, cluster: true, applied: !!proposerConfig, changed: !!pasted });
      return { middleware: service, remote: true, support, proposerConfig };
    } catch (err) {
      log.error(`Storing the proposer config of ${service.id} failed:`, err);
      subtask(`${name}: failed`, false, err?.message ?? String(err));
      results.push({ id: service.id, cluster: true, applied: false, reason: "failed", error: err?.message ?? String(err) });
      return { middleware: service, remote: true, support: { apply: false, reason: "failed" }, proposerConfig: null };
    }
  }

  /**
   * Writes a cluster's builder settings to its middleware: Charon's flags, and the builder section of the
   * proposer config it wrote once and never changes itself. Charon restarts for new flags only.
   * @returns {{ middleware, support, proposerConfig }} for the cluster's validator clients
   */
  async applyCluster({ service, running }, setup, restart, subtask, results) {
    const name = SHORT_NAMES[service.service] ?? service.service;
    const support = this.middlewareSupport(service, setup.network);
    if (!support.apply) {
      subtask(
        `${name}: update`,
        true,
        support.minimum ? `needs ${support.minimum} for the ${setup.network} fork` : `no release for the ${setup.network} fork yet`
      );
      results.push({ id: service.id, cluster: true, applied: false, reason: "update" });
      return { middleware: service, support, proposerConfig: null };
    }
    const settings = clientBuilderSettings(setup.builders, service.id);
    try {
      const flags = charonBuilderFlags(settings);
      const command = applyCharonBuilderFlags(service.command, flags);
      const flagsChanged = JSON.stringify(command) !== JSON.stringify(service.command);
      if (flagsChanged) {
        service.command = command;
        await this.serviceManager.writeServiceConfigurationKeepingAutoupdate(service);
      }
      subtask(`${name}: ${flagsChanged ? "flags" : "flags unchanged"}`, true, flags.join("\n") || "no builder flags");
      let proposerConfig = await this.readProposerConfig(service);
      if (proposerConfig) {
        const next = withBuilderSection(proposerConfig, settings);
        if (JSON.stringify(next) !== JSON.stringify(proposerConfig)) {
          await this.writeFile(this.proposerConfigPath(service), JSON.stringify(next));
          proposerConfig = next;
          subtask(`${name}: proposer config`, true, JSON.stringify(next.default_config.builder ?? null, null, 2));
        }
      } else {
        subtask(`${name}: no proposer config`, true, "Charon writes it on its next start, then save again for its validator clients");
      }
      if (flagsChanged && running && restart) {
        await this.serviceManager.manageServiceState(service.id, "restarted");
        subtask(`${name}: restarted`, true, "restarted to load the new builder flags");
      } else if (flagsChanged && running) {
        subtask(`${name}: not restarted`, true, "takes effect at its next restart");
      }
      results.push({ id: service.id, cluster: true, applied: true, changed: flagsChanged });
      return { middleware: service, support, proposerConfig };
    } catch (err) {
      log.error(`Writing the builder settings of ${service.id} failed:`, err);
      subtask(`${name}: failed`, false, err?.message ?? String(err));
      results.push({ id: service.id, cluster: true, applied: false, reason: "failed", error: err?.message ?? String(err) });
      return { middleware: service, support: { apply: false, reason: "failed" }, proposerConfig: null };
    }
  }

  /**
   * Asks builders from the server whether they serve the ePBS (Gloas) builder API.
   * @param {Object} args - { urls: [builder url] }
   * @returns {Array<{ url: string, status: number, result: "ready"|"no"|"unreachable" }>}
   */
  async probeBuilders({ urls = [] } = {}) {
    const list = [...new Set(urls.map((u) => builderUrl(u)).filter(Boolean))];
    if (!list.length) return [];
    const ref = StringUtils.createRandomString();
    const tm = this.nodeConnection.taskManager;
    tm?.otherTasksHandler(ref, `Check relays (${list.length})`);
    try {
      const results = await Promise.all(
        list.map(async (url) => {
          const request = `${url}${EPBS_PROBE_PATH}`;
          const control = `${url}${EPBS_PROBE_CONTROL_PATH}`;
          // with the builder API's timing headers a builder gets past its header checks to the bid itself
          const curl = (target) =>
            `curl -s -m 5 -X POST -H 'Content-Type: application/json' -H 'Eth-Consensus-Version: gloas' -H "Date-Milliseconds: $(date +%s%3N)" -H 'X-Timeout-Ms: 1000' -d '{}' -w '\\n%{http_code}' ${StringUtils.escapeStringForShell(target)} || true`;
          const exec = await this.nodeConnection.sshService
            .exec(`${curl(request)}; echo; echo '${CONTROL_MARK}'; ${curl(control)}`)
            .catch((err) => ({ stdout: "", stderr: err?.message ?? String(err) }));
          const [probeOut, controlOut = ""] = String(exec?.stdout ?? "").split(`\n${CONTROL_MARK}\n`);
          const parse = (out) => {
            const lines = out.replace(/\n$/, "").split("\n");
            const code = Number(lines.pop()) || 0;
            return { status: code, body: lines.join("\n").trim() };
          };
          const probe = parse(probeOut);
          const check = parse(controlOut);
          const status = probe.status;
          const result = epbsProbeResult(status, { status: check.status, same: check.body === probe.body });
          const answer = (probe.body || String(exec?.stderr ?? "").trim()).slice(0, 500);
          tm?.otherTasksHandler(
            ref,
            new URL(url).host,
            result !== "unreachable",
            `POST ${request}\nHTTP ${status || "none"}: ${result}\n${answer}\nPOST ${control}\nHTTP ${check.status || "none"}\n${check.body.slice(0, 200)}`
          );
          return { url, status, result };
        })
      );
      const ready = results.filter((r) => r.result === "ready").length;
      tm?.otherTasksHandler(ref, "Result", true, `${ready} of ${results.length} answer ePBS`);
      return results;
    } catch (err) {
      log.error("Checking the builders failed:", err);
      tm?.otherTasksHandler(ref, "Result", false, err?.message ?? String(err));
      return [];
    } finally {
      tm?.otherTasksHandler(ref);
    }
  }
}
