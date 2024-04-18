import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";

export class ValidatorEjectorService extends NodeService {
  static buildByUserInput(network, dir, executionClients, consensusClients) {
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
        locatorAddress = "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb" //https://docs.lido.fi/deployed-contracts/#core-protocol
        oracleAllowList = '["0x140Bd8FbDc884f48dA7cb1c09bE8A2fAdfea776E","0xA7410857ABbf75043d61ea54e07D57A6EB6EF186","0x404335BcE530400a5814375E7Ec1FB55fAff3eA2","0x946D3b081ed19173dC83Cd974fC69e1e760B7d78","0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5","0xEC4BfbAF681eb505B94E4a7849877DC6c600Ca3A","0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8","0x1Ca0fEC59b86F549e1F1184d97cb47794C8Af58d","0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf"]'
        break;
      case "holesky":
        locatorAddress = "0x28FAB2059C713A7F9D8c86Db49f9bb0e96Af1ef8" //https://docs.lido.fi/deployed-contracts/holesky#core-protocol
        oracleAllowList = '["0x12A1D74F8697b9f4F1eEBb0a9d0FB6a751366399","0xD892c09b556b547c80B7d8c8cB8d75bf541B2284","0xf7aE520e99ed3C41180B5E12681d31Aa7302E4e5","0x31fa51343297FFce0CC1E67a50B2D3428057D1b1","0x81E411f1BFDa43493D7994F82fb61A415F6b8Fd4","0x4c75FA734a39f3a21C57e583c1c29942F021C6B7","0xD3b1e36A372Ca250eefF61f90E833Ca070559970"]'
        break;
      case "sepolia":
        locatorAddress = "0x8f6254332f69557A72b0DA2D5F0Bc07d4CA991E7" //https://docs.lido.fi/deployed-contracts/sepolia#core-protocol
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
        STAKING_MODULE_ID: "123",
        OPERATOR_ID: "123",
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
