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
      null, // id
      1, // configVersion
      image, // image
      "dev", // imageVersion
      [], // command
      [], // entrypoint
      {
        EXECUTION_NODE: "http://foo-bar:8545",
        CONSENSUS_NODE: "http://foo-bar:5052",
        LOCATOR_ADDRESS: "<locator_address>",
        STAKING_MODULE_ID: "<staking_module_id>",
        OPERATOR_ID: "<operator_id>",
        MESSAGES_LOCATION: "/app/messages",
      }, // env
      null, // ports
      volumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
      // prometheusNodeExporterClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new ValidatorEjectorService();

    service.initByConfig(config);

    return service;
  }
}
