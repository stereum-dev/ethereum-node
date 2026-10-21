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
  validatorsOf(setup, services, running) {
    const ids = new Set(setup.services ?? []);
    return services
      .filter((s) => ids.has(s.id) && BUILDER_CLIENTS[s.service])
      .map((s) => {
        const connected = (s.dependencies?.consensusClients ?? []).map((c) => services.find((x) => x.id === c.id) ?? c);
        const middleware = connected.find((c) => isObolDVTService(c.service)) ?? null;
        return {
          service: s,
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

  // the Obol middlewares (Charon, Pluto) the setup's validator clients sign through
  clustersOf(validators, services, running) {
    const ids = [...new Set(validators.filter((v) => v.clusterId).map((v) => v.clusterId))];
    return ids
      .map((id) => services.find((s) => s.id === id))
      .filter(Boolean)
      .map((service) => ({
        service,
        running: running.has(service.id),
        vcs: validators.filter((v) => v.clusterId === service.id).map((v) => v.service.id),
      }));
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

  proposerConfigPath(middleware) {
    return this.hostPath(middleware, `/opt/charon/${PROPOSER_CONFIG_PATH}`);
  }

  async readProposerConfig(middleware) {
    try {
      const raw = await this.readFile(this.proposerConfigPath(middleware));
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
  async describeCluster({ service, running, vcs }, builders, network) {
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

  /**
   * Whether a cluster's validator client runs with Charon's current proposer config: Stereum renders it into
   * its settings on every start (manage-service), so it has it when it started after the file last changed.
   * @returns {boolean|null} null when it doesn't run
   */
  async startedAfterProposerConfig(vc, middleware) {
    const path = this.proposerConfigPath(middleware);
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
    const result = [];
    for (const [setupId, setup] of Object.entries(setups)) {
      const validators = this.validatorsOf(setup, services, running);
      if (!validators.length) continue;
      // one entry per client, also for setups saved with the setup's settings at the top
      const clusterList = this.clustersOf(validators, services, running);
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
          support: described.support,
          proposerConfig: await this.readProposerConfig(c.service),
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
      else if (support.apply && !cluster.proposerConfig) support = { apply: false, reason: "dvt-pending", minimum: null };
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
      const validators = this.validatorsOf(setup, services, running);
      const clusterList = this.clustersOf(validators, services, running);
      problems = [...new Set(clusterList.flatMap((c) => clusterSettingsProblems(builders?.clients?.[c.service.id] ?? {})))];
      if (problems.length) return { code: 1, info: problems.join(", ") };
      tm?.otherTasksHandler(ref, `Set builders (${validators.length})`);

      const cleaned = cleanBuilderSettings(builders);
      // a client that was removed from the setup takes its settings with it
      const ids = new Set([...validators.map((v) => v.service.id), ...clusterList.map((c) => c.service.id)]);
      setup.builders = { route: cleaned.route, clients: Object.fromEntries(Object.entries(cleaned.clients).filter(([id]) => ids.has(id))) };
      await this.serviceManager.configManager.writeMultiSetup(setups);
      subtask("Saved settings", true, YAML.stringify(setup.builders));

      // the clusters first: their validator clients render their settings from the middleware's proposer config
      const clusterState = {};
      for (const c of clusterList) {
        clusterState[c.service.id] = await this.applyCluster(c, setup, restart, subtask, results);
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
