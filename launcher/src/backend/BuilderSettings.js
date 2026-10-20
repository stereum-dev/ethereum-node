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
  epbsProbeResult,
} from "@/share/builders";

const SHORT_NAMES = {
  LodestarValidatorService: "Lodestar",
  PrysmValidatorService: "Prysm",
  TekuValidatorService: "Teku",
  NimbusValidatorService: "Nimbus",
  LighthouseValidatorService: "Lighthouse",
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
    case "dvt":
      return "behind a DVT cluster";
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
        return {
          service: s,
          dvt: connected.some((c) => isObolDVTService(c.service)),
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
      const builders = {
        route: setup.builders?.route ?? "direct",
        clients: Object.fromEntries(validators.map((v) => [v.service.id, clientBuilderSettings(setup.builders, v.service.id)])),
      };
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
        clients.push(await this.describe(v, builders, setup.network));
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
      });
    }
    return result;
  }

  async describe({ service, dvt, usesMevBoost, beaconCommand, running }, builders, network) {
    const settings = clientBuilderSettings(builders, service.id);
    const support = dvt
      ? { apply: false, reason: "dvt", minimum: null }
      : builderSupport({ service: service.service, version: service.imageVersion, network, usesMevBoost });
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
    return {
      id: service.id,
      service: service.service,
      version: service.imageVersion,
      running,
      usesMevBoost,
      // the boost it is set to before the fork, for the first settings
      currentBoost: currentBoost(service.service, service.command, beaconCommand),
      support,
      flags,
      file,
      notes,
      inSync,
    };
  }

  /**
   * Saves the builder settings of a setup's validator clients and writes them. Running ones are restarted
   * unless restart is false: then the settings take effect at their next restart.
   * @param {Object} args - { setupId, builders: { clients: { <service id>: settings } }, restart }
   * @returns {{ code: number, info?: string, results?: Array }} code 0 = saved
   */
  async setBuilderSettings({ setupId, builders, restart = true } = {}) {
    const problems = [...new Set(Object.values(builders?.clients ?? {}).flatMap((s) => validateBuilderSettings(s ?? {})))];
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
      tm?.otherTasksHandler(ref, `Set builders (${validators.length})`);

      const cleaned = cleanBuilderSettings(builders);
      // a client that was removed from the setup takes its settings with it
      const ids = new Set(validators.map((v) => v.service.id));
      setup.builders = { route: cleaned.route, clients: Object.fromEntries(Object.entries(cleaned.clients).filter(([id]) => ids.has(id))) };
      await this.serviceManager.configManager.writeMultiSetup(setups);
      subtask("Saved settings", true, YAML.stringify(setup.builders));

      for (const v of validators) {
        const name = SHORT_NAMES[v.service.service];
        const entry = await this.describe(v, setup.builders, setup.network);
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
      const applied = results.filter((r) => r.applied).length;
      const failed = results.filter((r) => r.reason === "failed").length;
      subtask("Result", failed === 0, `${applied} of ${results.length} validator clients set${failed ? `, ${failed} failed` : ""}`);
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
          const exec = await this.nodeConnection.sshService
            .exec(
              `curl -s -m 5 -X POST -H 'Content-Type: application/json' -H 'Eth-Consensus-Version: gloas' -d '{}' -w '\\n%{http_code}' ${StringUtils.escapeStringForShell(request)} || true`
            )
            .catch((err) => ({ stdout: "", stderr: err?.message ?? String(err) }));
          const lines = String(exec?.stdout ?? "").split("\n");
          const status = Number(lines.pop()) || 0;
          const result = epbsProbeResult(status);
          const answer = (lines.join("\n").trim() || String(exec?.stderr ?? "").trim()).slice(0, 500);
          tm?.otherTasksHandler(
            ref,
            new URL(url).host,
            result !== "unreachable",
            `POST ${request}\nHTTP ${status || "none"}: ${result}\n${answer}`
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
