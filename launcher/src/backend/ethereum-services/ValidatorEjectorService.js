import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class ValidatorEjectorService extends NodeService {
  static buildByUserInput(network, dir, executionClients = [], consensusClients = []) {
    const service = new ValidatorEjectorService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "lidofinance/validator-ejector";
    const messageDir = "/app/messages";

    const volumes = [new ServiceVolume(workingDir + "/messages", messageDir)];

    let locatorAddress = "0x0000000000000000000000000000000000000000";
    let oracleAllowList = '["0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"]';
    switch (network) {
      case "mainnet":
        locatorAddress = "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb"; //https://docs.lido.fi/deployed-contracts/#core-protocol
        oracleAllowList =
          '["0x73181107c8D9ED4ce0bbeF7A0b4ccf3320C41d12","0xA7410857ABbf75043d61ea54e07D57A6EB6EF186","0x404335BcE530400a5814375E7Ec1FB55fAff3eA2","0x946D3b081ed19173dC83Cd974fC69e1e760B7d78","0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5","0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf","0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8","0xe57B3792aDCc5da47EF4fF588883F0ee0c9835C9","0x285f8537e1dAeEdaf617e96C742F2Cf36d63CcfB"]';
        break;
      case "holesky":
        locatorAddress = "0x28FAB2059C713A7F9D8c86Db49f9bb0e96Af1ef8"; //https://docs.lido.fi/deployed-contracts/holesky#core-protocol
        oracleAllowList = '["0x12A1D74F8697b9f4F1eEBb0a9d0FB6a751366399","0xD892c09b556b547c80B7d8c8cB8d75bf541B2284"]';
        break;
      case "sepolia":
        locatorAddress = "0x8f6254332f69557A72b0DA2D5F0Bc07d4CA991E7"; //https://docs.lido.fi/deployed-contracts/sepolia#core-protocol
        break;
      case "hoodi":
        locatorAddress = "0xe2EF9536DAAAEBFf5b1c130957AB3E80056b06D8"; //https://docs.lido.fi/deployed-contracts/hoodi#core-protocol
        oracleAllowList =
          '["0xcA80ee7313A315879f326105134F938676Cfd7a9","0xf03B8DC8762B97F13Ac82e6F94bE3Ed002FF7459","0x1932f53B1457a5987791a40Ba91f71c5Efd5788F","0xf7aE520e99ed3C41180B5E12681d31Aa7302E4e5","0x99B2B75F490fFC9A29E4E1f5987BE8e30E690aDF","0x219743f1911d84B32599BdC2Df21fC8Dba6F81a2","0xD3b1e36A372Ca250eefF61f90E833Ca070559970","0x4c75FA734a39f3a21C57e583c1c29942F021C6B7","0xB1cC91878c1831893D39C2Bb0988404ca5Fa7918","0xfe43A8B0b481Ae9fB1862d31826532047d2d538c","0x43C45C2455C49eed320F463fF4f1Ece3D2BF5aE2"]';
        break;
      default:
        break;
    }

    service.init(
      "ValidatorEjectorService",
      service.id, // id
      1, // configVersion
      image, // image
      "dev", // imageVersion
      [], // command
      [], // entrypoint
      {
        EXECUTION_NODE: executionClients[0] ? executionClients[0].buildExecutionClientHttpEndpointUrl() : "",
        CONSENSUS_NODE: consensusClients[0] ? consensusClients[0].buildConsensusClientHttpEndpointUrl() : "",
        LOCATOR_ADDRESS: locatorAddress,
        STAKING_MODULE_ID: "1",
        OPERATOR_ID: "123456789",
        MESSAGES_LOCATION: "/app/messages",
        ORACLE_ADDRESSES_ALLOWLIST: oracleAllowList,
        HTTP_PORT: "8989",
        RUN_METRICS: "true",
        RUN_HEALTH_CHECK: "true",
        DRY_RUN: "false",
      }, // env
      null, // ports
      volumes, // volumes
      null, // user
      network, // network
      executionClients[0] ? [executionClients[0]] : [], // executionClients
      consensusClients[0] ? [consensusClients[0]] : [], // consensusClients
      [], // MevBoost
      [] // otherServices
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new ValidatorEjectorService();

    service.initByConfig(config);

    return service;
  }
}
