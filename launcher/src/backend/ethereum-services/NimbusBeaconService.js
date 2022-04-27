import { NodeService } from "./NodeService.js";
import { ServicePortDefinition } from "./SerivcePortDefinition.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class NimbusBeaconService extends NodeService {
    static buildByUserInput(network, ports, workingDir, executionClients) {
        const image = "stereum/nimbus"

        const gethServices = executionClients.map(client => {return client.buildExecutionClientWsEndpointUrl()});
        
        const dataDir = "/opt/app/beacon";
        const validatorsDir = "/opt/app/validators";
        const secretsDir = "/opt/app/secrets";
        const launchpadDir = "/opt/app/launchpad";
        const volumes = [
            new ServiceVolume(workingDir + "/beacon", dataDir),
            new ServiceVolume(workingDir + "/validator/validators", validatorsDir),
            new ServiceVolume(workingDir + "/validator/secrets", secretsDir),
            new ServiceVolume(workingDir + "/launchpad", launchpadDir),
            new ServiceVolume("/opt/app/import", "/opt/app/import")
        ];

        const service = new NimbusBeaconService();
        service.init(
            "NimbusBeaconService",
            null,       //id,
            image,      //image,
            "v1.6.0-55", //imageVersion,
            [
                `--network=${network}`,
                "--data-dir=/opt/app/beacon",
                "--validators-dir=/opt/app/validators",
                "--secrets-dir=/opt/app/secrets",
                `--web3-url=${gethServices}`,
                "--tcp-port=9000",
                "--udp-port=9000",
                "--rpc",
                "--rpc-port=9190",
                "--metrics",
                "--metrics-port=8008",
                "--metrics-address=0.0.0.0",
                "--rest",
                "--rest-address=0.0.0.0",
                "--graffiti=\"stereum.net\""
            ],          //command,
            ["/opt/app/build/nimbus_beacon_node"],      //entrypoint,
            null,       //env,
            ports,      //ports,
            volumes,    //volumes,
            null,       //user,
            network,    //network,
            executionClients,       //executionClients,
            //consensusClients
            );

        return service;
    }

    static buildByConfiguration(config) {
        const service = new NimbusBeaconService();

        service.initByConfig(config);

        return service;
    }

    buildConsensusClientHttpEndpointUrl() {
        return "http://stereum-" + this.id + ":9190";
    }

    getAvailablePorts() {
        return [
            new ServicePortDefinition(9000, "tcp", "P2P connections"),
            new ServicePortDefinition(9000, "udp", "P2P connections"),
            new ServicePortDefinition(9190, "tcp", "Consensus Client API")
        ]
    }
}