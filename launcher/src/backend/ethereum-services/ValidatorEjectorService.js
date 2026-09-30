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
          '["0x73181107c8D9ED4ce0bbeF7A0b4ccf3320C41d12","0x4118DAD7f348A4063bD15786c299De2f3B1333F3","0x404335BcE530400a5814375E7Ec1FB55fAff3eA2","0x8dB977C13CAA938BC58464bFD622DF0570564b78","0x007DE4a5F7bc37E2F26c0cb2E8A95006EE9B89b5","0xc79F702202E3A6B0B6310B537E786B9ACAA19BAf","0x61c91ECd902EB56e314bB2D5c5C07785444Ea1c8","0xe57B3792aDCc5da47EF4fF588883F0ee0c9835C9","0x042a9e5acCfa17e28300F1b5967f20891E973922","0x5595033F304217aFDB8ffB35E42C22B72184730b","0x82A821E8a2585D1AC8f346BE7Da6995490d21Ca6","0x7abC999C7E1f22a7E12b2A1024bC17676FE18b4b","0x5416CAAb6f37BF81cb2dc7ce0a363AfB9DD92d57","0x565F04cB319EC2295E1fcbBbe5F708687FFcCE75","0x4D3aD7E8e591d389B612Fc063f53837E284d3F86","0x375ABa35EA2011Af97b51bd395494C827d1C39BD","0xC10258969442c7957351A0ddc8194D2685B2a2c2","0x2aE828F10DfeE5b4c42f6E61D3d30033D4520753"]';
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
          '["0xcA80ee7313A315879f326105134F938676Cfd7a9","0xAe13D937a042aeD48Eb67EFa935972b188578977","0xe9FCd8c6CA10414E1955a8366Ea72eD1BbAFC3Bf","0x3E32F6E0E9A2f55eF6Ee4075bb249c8E88a42A15","0x6070B31816E11A8b222Fa232266FFdDC02bED02b","0xcad8AeeEd49158E20F8429B28520541cFa2C27b1","0x049B1d2F7578Bb56F9B75fcE6a3ee5C40551e694","0xEDF5163607997899B91BEBD4feb1d5D78c896b57","0xBD9d87c5CAD402447408665E36b1e550a84E746B","0xad4C09E3cc0bCE7FF70bb23f624Cc9dE86eba556"]';
        break;
      default:
        break;
    }

    service.init(
      "ValidatorEjectorService",
      service.id, // id
      1, // configVersion
      image, // image
      "2.1.0", // imageVersion
      [], // command
      [], // entrypoint
      {
        EXECUTION_NODE: executionClients[0] ? executionClients[0].buildExecutionClientHttpEndpointUrl() : "",
        CONSENSUS_NODE: consensusClients[0] ? consensusClients[0].buildConsensusClientHttpEndpointUrl() : "",
        LOCATOR_ADDRESS: locatorAddress,
        EJECTOR_SCOPE: '{"1":[123456789]}',
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
