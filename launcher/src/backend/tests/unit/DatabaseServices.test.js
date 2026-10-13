import { DatabaseServices } from "../../DatabaseServices";
import { PostgresService } from "../../ethereum-services/PostgresService";
import { Web3SignerService } from "../../ethereum-services/Web3SignerService";
import { KeysAPIService } from "../../ethereum-services/KeysAPIService";

const W3S = "475e4481-8229-8e0f-cafc-918cccf5fe35";
const SECRET = "SECRET_DB_PASSWORD";
const ROWS = "public.signed_attestations=5,public.validators=5";

const web3signer = () => {
  const service = Web3SignerService.buildByConfiguration({
    service: "Web3SignerService",
    id: W3S,
    configVersion: 1,
    image: "consensys/web3signer:26.9.0",
    command: [
      "eth2",
      "--slashing-protection-enabled=true",
      `--slashing-protection-db-url=jdbc:postgresql://slashingdb-${W3S}/web3signer`,
      "--slashing-protection-db-username=postgres",
      `--slashing-protection-db-password=${SECRET}`,
    ],
    entrypoint: [],
    env: {},
    ports: ["0.0.0.0:9000:9000/tcp"],
    volumes: [`/opt/stereum/web3signer-${W3S}/data:/opt/web3signer/data`],
    user: "2000",
    network: "hoodi",
    dependencies: {},
  });
  return service;
};

const inspect = (env = {}) =>
  JSON.stringify([
    {
      State: { Running: true },
      Config: {
        Image: "postgres",
        Env: [
          `POSTGRES_PASSWORD=${SECRET}`,
          "POSTGRES_USER=postgres",
          "POSTGRES_DB=web3signer",
          "PG_MAJOR=18",
          ...Object.entries(env).map(([k, v]) => `${k}=${v}`),
        ],
      },
      Mounts: [
        { Type: "bind", Source: `/opt/stereum/web3signer-${W3S}/postgresql`, Destination: "/opt/app/schemas" },
        { Type: "volume", Name: "bb39", Source: "/var/lib/docker/volumes/bb39/_data", Destination: "/var/lib/postgresql" },
      ],
    },
  ]);

// a server answering by command; rows: the counts the new database reports
const setup = ({ legacy = [`slashingdb-${W3S}`], rowsAfter = ROWS, parent = web3signer() } = {}) => {
  const commands = [];
  const tasks = [];
  const exec = jest.fn(async (cmd) => {
    commands.push(cmd);
    if (cmd.startsWith("docker ps -a")) return { rc: 0, stdout: legacy.join("\n") };
    if (cmd.startsWith("docker inspect slashingdb-")) return { rc: 0, stdout: inspect() };
    if (cmd.startsWith("docker inspect -f")) return { rc: 0, stdout: "true\n" };
    if (cmd.includes("psql -At")) return { rc: 0, stdout: (cmd.includes("slashingdb-") ? ROWS : rowsAfter) + "\n" };
    if (cmd.startsWith("mkdir -p")) return { rc: 0, stdout: "12M\n" };
    return { rc: 0, stdout: "" };
  });
  const nodeConnection = {
    sshService: { exec },
    taskManager: { otherTasksHandler: jest.fn((...args) => tasks.push(args)) },
    writeServiceConfiguration: jest.fn(),
    runPlaybook: jest.fn(),
    invalidateServiceConfigs: jest.fn(),
  };
  const serviceManager = {
    nodeConnection,
    manageServiceState: jest.fn(),
    readServiceConfigurations: jest.fn().mockResolvedValue([parent]),
    writeServiceConfigurationKeepingAutoupdate: jest.fn(),
    getWorkingDir: () => `/opt/stereum/web3signer-${W3S}`,
    configManager: { findSetupOf: jest.fn().mockResolvedValue("setup-1"), removeServiceFromAllSetups: jest.fn() },
  };
  return { databases: new DatabaseServices(serviceManager), serviceManager, nodeConnection, commands, tasks, parent };
};

describe("postgres service", () => {
  test("a new database is pinned to its major, owned by the postgres user and keeps its data in its own folder", () => {
    const db = PostgresService.buildByUserInput("SlashingDBService", "hoodi", "/opt/stereum/slashingdb", { password: "pw" });
    const config = db.buildConfiguration();

    expect(config).toMatchObject({ service: "SlashingDBService", image: "postgres:18", user: "999", ports: [] });
    // the image's entrypoint creates the database on first start
    expect(config).toMatchObject({ entrypoint: ["docker-entrypoint.sh"], command: ["postgres"] });
    expect(config.env).toEqual({ POSTGRES_USER: "postgres", POSTGRES_PASSWORD: "pw", POSTGRES_DB: "web3signer" });
    expect(config.volumes).toEqual([`/opt/stereum/slashingdb-${db.id}/data:/var/lib/postgresql`]);
    expect(db.buildJdbcUrl()).toEqual(`jdbc:postgresql://stereum-${db.id}/web3signer`);
  });

  // the image moved PGDATA with 18, older data has to stay where its major expects it
  test("an older major mounts its data where that major keeps it", () => {
    const db = PostgresService.buildByUserInput("CachingDBService", "mainnet", "/opt/stereum/cachingdb", { password: "pw", major: "17" });

    expect(db.buildConfiguration().image).toEqual("postgres:17");
    expect(db.volumes[0].servicePath).toEqual("/var/lib/postgresql/data");
    expect(db.env.POSTGRES_DB).toEqual("node_operator_keys_service_db");
  });
});

describe("database migration", () => {
  test("servers without old containers are left alone after one command", async () => {
    const { databases, commands, tasks } = setup({ legacy: [] });

    expect(await databases.migrate()).toEqual({ code: 0, migrated: [], failed: [] });
    expect(commands).toHaveLength(1);
    expect(tasks).toHaveLength(0);
  });

  test("the data is copied while nothing writes, checked row by row and the parent switched over", async () => {
    const { databases, serviceManager, nodeConnection, commands, tasks, parent } = setup();

    const result = await databases.migrate();

    expect(result.code).toEqual(0);
    const [{ id }] = result.migrated;
    const at = (prefix) => commands.findIndex((c) => c.startsWith(prefix));
    // parent and old container stop before the copy, the old container is removed only after the check
    expect(at(`docker stop -t 120 stereum-${W3S}`)).toBeLessThan(at("mkdir -p"));
    expect(at(`docker stop -t 120 slashingdb-${W3S}`)).toBeLessThan(at("mkdir -p"));
    expect(commands[at("mkdir -p")]).toContain(`cp -a /var/lib/docker/volumes/bb39/_data/. /opt/stereum/slashingdb-${id}/data/`);
    expect(at(`docker rm -v slashingdb-${W3S}`)).toBeGreaterThan(at(`docker exec -i stereum-${id} psql -At`));

    // same major and password, written into the parent's setup
    const [config, setupId] = nodeConnection.writeServiceConfiguration.mock.calls[0];
    expect(setupId).toEqual("setup-1");
    expect(config).toMatchObject({
      service: "SlashingDBService",
      id,
      image: "postgres:18",
      volumes: [`/opt/stereum/slashingdb-${id}/data:/var/lib/postgresql`],
    });
    expect(config.env.POSTGRES_PASSWORD).toEqual(SECRET);

    expect(parent.command).toContain(`--slashing-protection-db-url=jdbc:postgresql://stereum-${id}/web3signer`);
    expect(parent.dependencies.otherServices.map((s) => s.id)).toEqual([id]);
    expect(serviceManager.writeServiceConfigurationKeepingAutoupdate).toHaveBeenCalledWith(parent);
    expect(serviceManager.manageServiceState.mock.calls).toEqual([
      [id, "started"],
      [W3S, "started"],
    ]);

    const panel = tasks.map((t) => [t[1], t[3]].join(" ")).join("\n");
    expect(panel).toContain(`rows match: ${ROWS}`);
    expect(panel).not.toContain(SECRET);
    expect(tasks[0][1]).toEqual("Migrating database");
  });

  test("differing row counts roll back to the old container and leave the parent untouched", async () => {
    const { databases, serviceManager, commands, tasks, parent } = setup({ rowsAfter: "public.signed_attestations=4,public.validators=5" });
    const commandBefore = [...parent.command];

    const result = await databases.migrate();

    expect(result.code).toEqual(1);
    expect(result.failed[0].error).toContain("row counts differ");
    expect(parent.command).toEqual(commandBefore);
    expect(serviceManager.writeServiceConfigurationKeepingAutoupdate).not.toHaveBeenCalled();
    expect(commands).toEqual(expect.arrayContaining([`docker start slashingdb-${W3S}`, `docker start stereum-${W3S}`]));
    expect(commands.some((c) => c.startsWith(`docker rm -v slashingdb-`))).toBe(false);
    expect(commands.some((c) => /^rm -f \/etc\/stereum\/services\/.*\.yaml$/.test(c))).toBe(true);
    expect(serviceManager.configManager.removeServiceFromAllSetups).toHaveBeenCalled();
    expect(tasks.find((t) => t[1] === "Result")[2]).toBe(false);
  });

  test("a container without its parent service is skipped", async () => {
    const { databases, commands } = setup({ legacy: ["cachingDB-gone"] });

    const result = await databases.migrate();

    expect(result).toEqual({ code: 0, migrated: [], failed: [] });
    expect(commands.some((c) => c.startsWith("docker stop"))).toBe(false);
  });

  test("Keys API is pointed at its new database through DB_HOST", async () => {
    const keysApi = KeysAPIService.buildByConfiguration({
      service: "KeysAPIService",
      id: "kapi",
      image: "lidofinance/lido-keys-api:4.0.4",
      env: { DB_HOST: "cachingDB-kapi", DB_PASSWORD: SECRET },
      volumes: [],
      network: "hoodi",
      dependencies: {},
    });
    const { databases } = setup({ legacy: ["cachingDB-kapi"], parent: keysApi });
    databases.nodeConnection.sshService.exec.mockImplementation(async (cmd) => {
      if (cmd.startsWith("docker ps -a")) return { rc: 0, stdout: "cachingDB-kapi" };
      if (cmd.startsWith("docker inspect cachingDB-"))
        return { rc: 0, stdout: inspect().replace("POSTGRES_DB=web3signer", "POSTGRES_DB=node_operator_keys_service_db") };
      if (cmd.startsWith("docker inspect -f")) return { rc: 0, stdout: "false\n" };
      if (cmd.includes("psql -At")) return { rc: 0, stdout: "public.keys=3\n" };
      return { rc: 0, stdout: "" };
    });

    const result = await databases.migrate();

    expect(result.code).toEqual(0);
    expect(keysApi.env.DB_HOST).toEqual(`stereum-${result.migrated[0].id}`);
    expect(keysApi.env.DB_PASSWORD).toEqual(SECRET);
  });
});

describe("deleting a parent", () => {
  test("its database goes with it, unless it is deleted in the same run", async () => {
    const { databases, nodeConnection, commands, parent } = setup();
    parent.dependencies.otherServices = [{ service: "SlashingDBService", id: "db1" }];

    await databases.deleteFor(parent, []);
    expect(nodeConnection.runPlaybook).toHaveBeenCalledWith("Delete Service", { stereum_role: "delete-service", service: "db1" });
    expect(commands).toContain(`docker rm -f slashingdb-${W3S} 2>/dev/null || true`);

    nodeConnection.runPlaybook.mockClear();
    await databases.deleteFor(parent, ["db1"]);
    expect(nodeConnection.runPlaybook).not.toHaveBeenCalled();
  });
});
