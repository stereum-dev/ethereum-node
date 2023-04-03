import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class ValidatorEjectorService extends NodeService {
  static buildByUserInput(network, dir) {
    const service = new ValidatorEjectorService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "lidofinance/validator-ejector";
    const messageDir = "/app/messages";

    const volumes = [new ServiceVolume(workingDir + "/messages", messageDir)];

    service.init(
      "ValidatorEjectorService",
      service.id, // id
      1, // configVersion
      image, // image
      "dev", // imageVersion
      [], // command
      [], // entrypoint
      {
        EXECUTION_NODE: "http://foo-bar:8545",
        CONSENSUS_NODE: "http://foo-bar:5052",
        LOCATOR_ADDRESS: "0x0000000000000000000000000000000000000000",
        STAKING_MODULE_ID: "123",
        OPERATOR_ID: "123",
        MESSAGES_LOCATION: "/app/messages",
        ORACLE_ADDRESSES_ALLOWLIST: '["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]',
        HTTP_PORT: "8989",
        RUN_METRICS: "true",
        RUN_HEALTH_CHECK: "true",
        DRY_RUN: "false",
      }, // env
      null, // ports
      volumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new ValidatorEjectorService();

    service.initByConfig(config);

    return service;
  }
}
