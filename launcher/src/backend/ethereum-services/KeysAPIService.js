import { NodeService } from "./NodeService";

export class KeysAPIService extends NodeService {
  static buildByUserInput(network, ports, executionClients = [], consensusClients = []) {
    const service = new KeysAPIService();
    service.setId();

    const image = "lidofinance/lido-keys-api";

    service.init(
      "KeysAPIService",
      service.id, // id
      1, // configVersion
      image, // image
      "dev", // imageVersion
      [], // command
      [], // entrypoint
      {
        // App
        PORT: "3600",

        // The number of seconds that each request will last in storage
        GLOBAL_THROTTLE_TTL: "5",

        // The maximum number of requests within the TTL limit
        GLOBAL_THROTTLE_LIMIT: "100",

        // Cache expiration time in seconds
        GLOBAL_CACHE_TTL: "1",

        // Log level: debug, info, notice, warning or error
        LOG_LEVEL: "info",

        // Log format: simple or json
        LOG_FORMAT: "simple",

        PROVIDERS_URLS: executionClients[0]
          ? executionClients[0].buildExecutionClientHttpEndpointUrl()
          : "http://your_el_node1,http://your_el_node2",

        // chain id
        // for mainnet 1
        // for testnet 560048
        CHAIN_ID: network == "mainnet" ? "1" : "560048",

        DB_NAME: "node_operator_keys_service_db",
        DB_PORT: "5432",
        DB_HOST: "localhost",
        DB_USER: "postgres",
        DB_PASSWORD: "postgres",

        // It is possible to enable/disable collecting of validators
        // value below is default
        VALIDATOR_REGISTRY_ENABLE: "true",

        // CL api urls
        // if VALIDATOR_REGISTRY_ENABLE=false , there are no need to provide CL_API_URLS
        CL_API_URLS: consensusClients[0]
          ? consensusClients[0].buildConsensusClientHttpEndpointUrl()
          : "http://your_cl_node1,http://your_cl_node2",
      }, // env
      ports, // ports
      [], // volumes
      null, // user
      // network // network
      // // executionClients
      // // consensusClients
      network, // network
      executionClients[0] ? [executionClients[0]] : [], // executionClients
      consensusClients[0] ? [consensusClients[0]] : [], // consensusClients
      [], // MevBoost
      [] // otherServices
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new KeysAPIService();

    service.initByConfig(config);

    return service;
  }
}
