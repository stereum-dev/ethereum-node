import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class PrysmValidatorService extends NodeService {
  static buildByUserInput(network, ports, dir, consensusClients = []) {
    const service = new PrysmValidatorService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "prysmaticlabs/prysm-validator";

    const dataDir = network === "devnet" ? "/consensus" : "/opt/app/data/db";
    const walletDir = "/opt/app/data/wallets";
    const passwordDir = "/opt/app/data/passwords";
    const graffitiDir = "/opt/app/graffitis";
    const configYamlDir = "/consensus";
    network = network === "op-mainnet" ? "mainnet" : network === "op-sepolia" ? "sepolia" : network;

    const volumes =
      network === "devnet"
        ? []
        : [
            new ServiceVolume(workingDir + "/data/db", dataDir),
            new ServiceVolume(workingDir + "/data/wallets", walletDir),
            new ServiceVolume(workingDir + "/data/passwords", passwordDir),
            new ServiceVolume(workingDir + "/graffitis", graffitiDir),
          ];

    const provider = consensusClients
      .map((client) => {
        if (network === "devnet") {
          const consensusDir = client.volumes.find((vol) => vol.servicePath.includes("/consensus")).destinationPath;
          volumes.push(new ServiceVolume(consensusDir, configYamlDir));
          return client.buildConsensusClientEndpoint();
        } else {
          return client.buildConsensusClientHttpEndpointUrl();
        }
      })
      .join();

    const cmd = service.generatePrysmValidatorCommand(network, dataDir, walletDir, passwordDir, graffitiDir, configYamlDir, provider);

    service.init(
      "PrysmValidatorService", //service
      service.id, //id
      1, // configVersion
      image, //image
      "v5.0.4", //imageVersion
      cmd, //command
      ["/app/cmd/validator/validator"], // entrypoint
      null, // env
      ports, //ports
      volumes, //volumes
      null, //user
      network, //network
      null, //executionClients
      consensusClients //consensusClients
    );

    return service;
  }

  generatePrysmValidatorCommand(network, dataDir, walletDir, passwordDir, graffitiDir, configYamlDir, provider) {
    const commonCmd = ["--accept-terms-of-use=true", "--monitoring-host=0.0.0.0", "--monitoring-port=8081"];

    if (network === "devnet") {
      return [
        ...commonCmd,
        `--datadir=${dataDir}/validatordata`,
        "--interop-num-validators=64",
        "--interop-start-index=0",
        `--chain-config-file=${configYamlDir}/config.yml`,
        "--force-clear-db",
        `--beacon-rpc-provider=${provider}`,
      ];
    } else {
      return [
        ...commonCmd,
        "--web",
        `--${network}`,
        `--datadir=${dataDir}`,
        `--keymanager-token-file=${walletDir}/auth-token`,
        `--wallet-dir=${walletDir}`,
        `--wallet-password-file=${passwordDir}/wallet-password`,
        "--http-port=7500",
        "--http-host=0.0.0.0",
        '--http-cors-domain="*"',
        `--enable-beacon-rest-api`,
        `--beacon-rest-api-provider=${provider}`,
        "--suggested-fee-recipient=0x0000000000000000000000000000000000000000",
        `--graffiti-file=${graffitiDir}/graffitis.yaml`,
        "--enable-builder=true",
        "--enable-doppelganger=true",
      ];
    }
  }

  static buildByConfiguration(config) {
    const service = new PrysmValidatorService();

    service.initByConfig(config);

    return service;
  }

  buildValidatorClientMetricsEndpoint() {
    return "stereum-" + this.id + ":8081";
  }

  getAvailablePorts() {
    return [new ServicePortDefinition(7500, "tcp", "Validator Client API and Web Interface")];
  }
}
