import * as log from "electron-log";
import { SSHService } from "./SSHService.js";
import { StringUtils } from "./StringUtils.js";
import { PostgresService, DATABASE_SERVICES, isDatabaseService } from "./ethereum-services/PostgresService.js";

const DB_LABELS = { SlashingDBService: "Slashing DB", CachingDBService: "Caching DB" };
const PARENT_LABELS = { Web3SignerService: "Web3Signer", KeysAPIService: "Keys API" };

// Exact row counts of every table, "table=count" sorted, to prove a copy is complete
const ROW_COUNTS_SQL = `select coalesce(string_agg(t || '=' || (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', schemaname, tablename), false, true, '')))[1]::text, ',' order by t), '')
from (select schemaname, tablename, schemaname || '.' || tablename as t from pg_tables where schemaname not in ('pg_catalog', 'information_schema')) s;`;

/**
 * Postgres databases that belong to one parent service (Web3Signer's slashing protection, Keys API's cache).
 * They are Stereum services of their own (config file, pinned image, data folder), created and deleted with
 * their parent, which lists them in dependencies.otherServices.
 */
export class DatabaseServices {
  constructor(serviceManager) {
    this.serviceManager = serviceManager;
    this.nodeConnection = serviceManager.nodeConnection;
    this.migration = null;
  }

  async exec(command) {
    const result = await this.nodeConnection.sshService.exec(command);
    if (SSHService.checkExecError(result, true)) throw new Error(SSHService.extractExecError(result));
    return result.stdout ?? "";
  }

  static databaseOf(parent) {
    return (parent.dependencies?.otherServices ?? []).find((s) => isDatabaseService(s.service));
  }

  static baseDir(parent) {
    // the database folder sits next to its parent's, e.g. /opt/stereum/slashingdb-<id> beside /opt/stereum/web3signer-<id>
    const volume = parent.volumes.find((v) => v.destinationPath?.includes(parent.id))?.destinationPath;
    if (!volume) return "/opt/stereum";
    const parentDir = volume.slice(0, volume.indexOf(parent.id) + parent.id.length);
    return parentDir.slice(0, parentDir.lastIndexOf("/")) || "/opt/stereum";
  }

  // Polls over TCP: the entrypoint's init server only listens on the socket, so it never counts as ready
  async waitUntilReady(db, seconds = 90) {
    await this.exec(
      `for i in $(seq 1 ${seconds}); do docker exec ${db.buildHost()} pg_isready -q -h 127.0.0.1 -U ${db.env.POSTGRES_USER} && exit 0; sleep 1; done; echo "${db.buildHost()} did not get ready in ${seconds}s" >&2; exit 1`
    );
  }

  async rowCounts(container, user, dbName) {
    const out = await this.exec(
      `docker exec -i ${container} psql -At -v ON_ERROR_STOP=1 -U ${user} -d ${dbName} <<'=====SQL'\n${ROW_COUNTS_SQL}\n=====SQL`
    );
    return out.trim();
  }

  /**
   * Creates, starts and waits for the database of a new parent service, and points the parent at it.
   * The parent's config is written by the caller.
   */
  async createFor(parent, setupId) {
    const type = Object.keys(DATABASE_SERVICES).find((t) => DATABASE_SERVICES[t].parent === parent.service);
    const db = PostgresService.buildByUserInput(
      type,
      parent.network,
      `${DatabaseServices.baseDir(parent)}/${DATABASE_SERVICES[type].dir}`,
      {
        password: StringUtils.createRandomString(),
      }
    );
    // the parent's config is written into its setup before this runs
    const setup = setupId ?? (await this.serviceManager.configManager.findSetupOf(parent.id));
    await this.nodeConnection.writeServiceConfiguration(db.buildConfiguration(), setup);
    try {
      await this.serviceManager.manageServiceState(db.id, "started");
      await this.waitUntilReady(db);
    } catch (err) {
      // no orphan: a database that never got ready goes again
      await this.removeService(db);
      throw err;
    }
    parent.dependencies.otherServices = [...(parent.dependencies.otherServices ?? []), db];
    return db;
  }

  async removeService(db) {
    await this.nodeConnection.sshService.exec(
      `docker rm -f ${db.buildHost()} 2>/dev/null; rm -rf ${db.volumes[0].destinationPath.replace(/\/data$/, "")}`
    );
    await this.nodeConnection.sshService.exec(`rm -f /etc/stereum/services/${db.id}.yaml`);
    this.nodeConnection.invalidateServiceConfigs?.();
    await this.serviceManager.configManager.removeServiceFromAllSetups(db.id);
  }

  /** Web3Signer: slashing protection in its own database, with the schema Web3Signer ships */
  async initWeb3Signer(service, setupId) {
    const workingDir = this.serviceManager.getWorkingDir(service);
    await this.serviceManager.manageServiceState(service.id, "started");
    await this.exec(`docker cp stereum-${service.id}:/opt/web3signer/migrations/postgresql ${workingDir}`);
    await this.serviceManager.manageServiceState(service.id, "stopped");

    const db = await this.createFor(service, setupId);
    try {
      const schemas = (await this.exec(`ls -1 ${workingDir}/postgresql`)).split("\n").filter((s) => s.endsWith(".sql"));
      for (const schema of schemas.sort()) {
        log.info("loading " + schema + " schema...");
        await this.exec(
          `docker exec -i ${db.buildHost()} psql -q -v ON_ERROR_STOP=1 -U ${db.env.POSTGRES_USER} -d ${db.env.POSTGRES_DB} < ${workingDir}/postgresql/${schema}`
        );
      }
    } catch (err) {
      await this.removeService(db);
      service.dependencies.otherServices = service.dependencies.otherServices.filter((s) => s.id !== db.id);
      throw err;
    }
    service.command = service.command.filter((c) => !c.startsWith("--slashing-protection-"));
    service.command.push(
      "--slashing-protection-enabled=true",
      `--slashing-protection-db-url=${db.buildJdbcUrl()}`,
      `--slashing-protection-db-username=${db.env.POSTGRES_USER}`,
      `--slashing-protection-db-password=${db.env.POSTGRES_PASSWORD}`,
      "--slashing-protection-pruning-enabled=true"
    );
  }

  /** Keys API: its cache database */
  async initKeysAPI(service, setupId) {
    const db = await this.createFor(service, setupId);
    Object.assign(service.env, {
      DB_HOST: db.buildHost(),
      DB_PORT: "5432",
      DB_NAME: db.env.POSTGRES_DB,
      DB_USER: db.env.POSTGRES_USER,
      DB_PASSWORD: db.env.POSTGRES_PASSWORD,
    });
  }

  /**
   * Deletes the database of a deleted parent, unless it is deleted in the same run anyway.
   * Parents from before the migration still have a plain container named after them.
   */
  async deleteFor(parent, deletedIds = []) {
    const db = DatabaseServices.databaseOf(parent);
    if (db && !deletedIds.includes(db.id)) {
      await this.serviceManager.configManager.removeServiceFromAllSetups(db.id);
      await this.nodeConnection.runPlaybook("Delete Service", { stereum_role: "delete-service", service: db.id });
    }
    const legacy = Object.values(DATABASE_SERVICES).find((d) => d.parent === parent.service);
    if (legacy) await this.nodeConnection.sshService.exec(`docker rm -f ${legacy.legacyPrefix}${parent.id} 2>/dev/null || true`);
  }

  /**
   * Turns the plain "slashingdb-<id>" / "cachingDB-<id>" containers of older installs into database services.
   * Per container: stop the parent and the container, copy the data into the service's folder, start the
   * service with the same image major and password, compare the row counts of every table, point the parent
   * at it. Any failure rolls back to the old container; after the check the old container and its volume go.
   * Runs once at a time; does nothing (one exec) on servers without old containers.
   */
  migrate() {
    if (!this.migration) this.migration = this.runMigration().finally(() => (this.migration = null));
    return this.migration;
  }

  async runMigration() {
    const prefixes = Object.values(DATABASE_SERVICES).map((d) => d.legacyPrefix);
    const filters = prefixes.map((p) => `--filter name=^${p}`).join(" ");
    const names = (await this.exec(`docker ps -a --format '{{.Names}}' ${filters}`)).split("\n").filter(Boolean);
    if (!names.length) return { code: 0, migrated: [], failed: [] };

    const ref = StringUtils.createRandomString();
    const task = this.nodeConnection.taskManager;
    task?.otherTasksHandler(ref, `Migrating ${names.length === 1 ? "database" : names.length + " databases"}`);
    const migrated = [];
    const failed = [];
    try {
      const services = await this.serviceManager.readServiceConfigurations();
      for (const name of names) {
        const type = Object.keys(DATABASE_SERVICES).find((t) => name.startsWith(DATABASE_SERVICES[t].legacyPrefix));
        const parentId = name.slice(DATABASE_SERVICES[type].legacyPrefix.length);
        const parent = services.find((s) => s.id === parentId && s.service === DATABASE_SERVICES[type].parent);
        if (!parent) {
          task?.otherTasksHandler(
            ref,
            `Skipped ${name.slice(0, 18)}`,
            true,
            `${name}: no ${DATABASE_SERVICES[type].parent} with id ${parentId}, left as it is`
          );
          continue;
        }
        try {
          migrated.push(await this.migrateOne(name, type, parent, ref));
        } catch (err) {
          log.error(`Migrating ${name} failed: `, err);
          failed.push({ name, error: String(err?.message || err) });
        }
      }
      const summary = [
        ...migrated.map((m) => `${m.name} -> ${m.service} ${m.id}`),
        ...failed.map((f) => `${f.name} failed, still in use: ${f.error}`),
      ].join("\n");
      task?.otherTasksHandler(ref, "Result", failed.length === 0, summary || "nothing to migrate");
      return { code: failed.length ? 1 : 0, migrated, failed };
    } finally {
      task?.otherTasksHandler(ref);
    }
  }

  async migrateOne(name, type, parent, ref) {
    const step = (label, ok, data) => this.nodeConnection.taskManager?.otherTasksHandler(ref, label, ok, data);
    const dbLabel = DB_LABELS[type];
    const parentLabel = PARENT_LABELS[parent.service];

    const [info] = JSON.parse(await this.exec(`docker inspect ${name}`));
    const env = Object.fromEntries((info.Config?.Env ?? []).map((e) => [e.slice(0, e.indexOf("=")), e.slice(e.indexOf("=") + 1)]));
    const mount = (info.Mounts ?? []).find((m) => m.Type === "volume" && m.Destination?.startsWith("/var/lib/postgresql"));
    if (!env.PG_MAJOR || !env.POSTGRES_PASSWORD || !mount?.Source)
      throw new Error(`${name}: no Postgres major, password or data volume found`);
    const user = env.POSTGRES_USER || "postgres";
    const dbName = env.POSTGRES_DB || DATABASE_SERVICES[type].dbName;

    const wasRunning = info.State?.Running === true;
    if (!wasRunning) await this.exec(`docker start ${name}`);
    await this.waitUntilReady({ buildHost: () => name, env: { POSTGRES_USER: user } });
    const before = await this.rowCounts(name, user, dbName);
    step(
      `Read old ${dbLabel}`,
      true,
      [
        `container: ${name}`,
        `image: ${info.Config?.Image} (Postgres ${env.PG_MAJOR})`,
        `data: volume ${mount.Name} at ${mount.Destination}`,
        `rows: ${before || "-"}`,
      ].join("\n")
    );

    const db = PostgresService.buildByUserInput(
      type,
      parent.network,
      `${DatabaseServices.baseDir(parent)}/${DATABASE_SERVICES[type].dir}`,
      {
        password: env.POSTGRES_PASSWORD,
        user,
        major: env.PG_MAJOR,
        dataPath: mount.Destination,
      }
    );
    const dataDir = db.volumes[0].destinationPath;
    const workingDir = dataDir.replace(/\/data$/, "");
    const parentRunning =
      (await this.exec(`docker inspect -f '{{.State.Running}}' stereum-${parent.id} 2>/dev/null || echo false`)).trim() === "true";
    const setupId = await this.serviceManager.configManager.findSetupOf(parent.id);

    let written = false;
    try {
      // nothing may write while the data is copied
      if (parentRunning) await this.exec(`docker stop -t 120 stereum-${parent.id}`);
      await this.exec(`docker stop -t 120 ${name}`);
      const size = (await this.exec(`mkdir -p ${dataDir} && cp -a ${mount.Source}/. ${dataDir}/ && du -sh ${dataDir} | cut -f1`)).trim();
      step(`Copied data (${size})`, true, `${mount.Source} -> ${dataDir}`);

      await this.nodeConnection.writeServiceConfiguration(db.buildConfiguration(), setupId);
      written = true;
      await this.serviceManager.manageServiceState(db.id, "started");
      await this.waitUntilReady(db);
      const after = await this.rowCounts(db.buildHost(), user, dbName);
      if (after !== before) throw new Error(`row counts differ after the copy\nbefore: ${before}\nafter: ${after}`);
      step(`Started ${dbLabel}`, true, `${type} ${db.id}, image postgres:${env.PG_MAJOR}\nrows match: ${after || "-"}`);

      // the parent reaches the database by its container name
      const swap = (value) => (typeof value === "string" ? value.split(name).join(db.buildHost()) : value);
      parent.command = (parent.command ?? []).map(swap);
      parent.env = Object.fromEntries(Object.entries(parent.env ?? {}).map(([k, v]) => [k, swap(v)]));
      parent.dependencies.otherServices = [...(parent.dependencies.otherServices ?? []).filter((s) => !isDatabaseService(s.service)), db];
      await this.serviceManager.writeServiceConfigurationKeepingAutoupdate(parent);
    } catch (err) {
      step(`${dbLabel} rolled back`, false, String(err?.message || err));
      if (written) await this.removeService(db);
      else await this.nodeConnection.sshService.exec(`rm -rf ${workingDir}`);
      await this.nodeConnection.sshService.exec(`docker ${wasRunning ? "start" : "stop"} ${name}`);
      if (parentRunning) await this.nodeConnection.sshService.exec(`docker start stereum-${parent.id}`);
      throw err;
    }

    // switched over and verified: the old container goes with its volume, Stereum's prune would take it anyway
    const removed = await this.nodeConnection.sshService.exec(`docker rm -v ${name}`);
    if (SSHService.checkExecError(removed, true)) log.warn(`Removing ${name} failed: ${SSHService.extractExecError(removed)}`);
    if (parentRunning) await this.serviceManager.manageServiceState(parent.id, "started");
    step(
      `${parentLabel} uses ${dbLabel}`,
      true,
      `${parent.service} ${parent.id} now connects to ${db.buildHost()}${parentRunning ? ", restarted" : ""}\nold container and volume ${mount.Name} removed`
    );
    return { name, service: type, id: db.id };
  }
}

// EOF
