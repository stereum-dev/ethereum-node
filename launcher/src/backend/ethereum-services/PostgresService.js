import { NodeService } from "./NodeService.js";
import { ServiceVolume } from "./ServiceVolume.js";

// Postgres major for new databases; a database keeps the major it was created with, the image never changes it
export const POSTGRES_MAJOR = "18";
// uid of the postgres user in the official image, so the data folder can be owned by it
const POSTGRES_UID = "999";

// The database each parent service needs, with the folder its data lives in
export const DATABASE_SERVICES = {
  SlashingDBService: { parent: "Web3SignerService", dbName: "web3signer", dir: "slashingdb", legacyPrefix: "slashingdb-" },
  CachingDBService: { parent: "KeysAPIService", dbName: "node_operator_keys_service_db", dir: "cachingdb", legacyPrefix: "cachingDB-" },
};

export const isDatabaseService = (service) => Object.hasOwn(DATABASE_SERVICES, service);

// The image moved its data from /var/lib/postgresql/data to a versioned folder below /var/lib/postgresql with 18
export const postgresDataPath = (major) => (Number(major) >= 18 ? "/var/lib/postgresql" : "/var/lib/postgresql/data");

export class PostgresService extends NodeService {
  /**
   * A Postgres database that belongs to one parent service (Web3Signer's slashing protection, Keys API's cache).
   * dir: base folder, e.g. "/opt/stereum/slashingdb"; dataPath: mount target of an existing data folder
   */
  static buildByUserInput(service, network, dir, { password, user = "postgres", major = POSTGRES_MAJOR, dataPath } = {}) {
    const db = new PostgresService();
    db.setId();
    const workingDir = db.buildWorkingDir(dir);

    db.init(
      service,
      db.id, // id
      1, // configVersion
      "postgres", // image
      String(major), // imageVersion
      ["postgres"], // command
      // spelled out: an empty entrypoint would replace the image's, which creates the database on first start
      ["docker-entrypoint.sh"], // entrypoint
      {
        POSTGRES_USER: user,
        POSTGRES_PASSWORD: password,
        POSTGRES_DB: DATABASE_SERVICES[service].dbName,
      }, // env
      [], // ports
      [new ServiceVolume(workingDir + "/data", dataPath ?? postgresDataPath(major))], // volumes
      POSTGRES_UID, // user
      network, // network
      [], // executionClients
      [], // consensusClients
      [], // mevboost
      [] // otherServices
    );
    return db;
  }

  static buildByConfiguration(config) {
    const db = new PostgresService();
    db.initByConfig(config);
    return db;
  }

  buildHost() {
    return "stereum-" + this.id;
  }

  buildJdbcUrl() {
    return `jdbc:postgresql://${this.buildHost()}/${this.env.POSTGRES_DB}`;
  }
}

// EOF
