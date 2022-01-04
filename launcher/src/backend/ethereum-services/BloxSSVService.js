import { networks, NodeService } from './NodeService.js'
import { StringUtils } from '../StringUtils.js';
import { ServicePortDefinition } from './SerivcePortDefinition.js';
import { ServiceVolume } from './ServiceVolume.js';

const YAML = require('yaml');

export class BloxSSVService extends NodeService {
    constructor(network, ports, workingDir, executionClients, consensusClients) {
        super();

        // stuff for service's config file
        this.network = network;
        this.consensusClients = consensusClients;

        // volumes
        this.workingDir = workingDir;

        const volumes = [
            new ServiceVolume(workingDir + "/data", "/data")
        ];

        // eth1 nodes
        this.executionClients = executionClients;

        const eth1Nodes = executionClients.map(client => {return client.buildExecutionClientHttpEndpointUrl()});

        // prepare service's config file
        const configFile = new YAML.Document();
        configFile.contents = this.getServiceConfiguration();
        const escapedConfigFile = StringUtils.escapeStringForShell(configFile.toString());

        // build service
        super.init(null,
            "bloxstaking/ssv-node",
            "ubuntu-latest",
            "echo " + escapedConfigFile + " > /config.yaml && make BUILD_PATH=/go/bin/ssvnode start-node && docker logs ssv_node",
            null,
            {
                CONFIG_PATH: "/config.yaml",
            },
            ports,
            volumes,
            "root");
    }

    getServiceConfiguration() {
        /*
eth2:
  Network: "prater"
  BeaconNodeAddr: "http://beacon:5052"
eth1:
  ETH1Addr: ""
  RegistryContractAddr: "0x687fb596F3892904F879118e2113e1EEe8746C2E"
OperatorPrivateKey: ""
global:
  LogLevel: "debug"
MetricsAPIPort: 15000
        */
        return {
            eth2: {
                Network: this.network,
                BeaconNodeAddr: this.consensusClients.map(client => {return client.buildConsensusClientHttpEntpointUrl()})[0],
            },
            eth1: {
                ETH1Addr: this.executionClients.map(client => {return client.buildExecutionClientHttpEndpointUrl()})[0],
                RegistryContractAddr: "0x687fb596F3892904F879118e2113e1EEe8746C2E",
            },
            OperatorPrivateKey: "", // somehow generate them?
            global: {
                LogLevel: "info",
            },
            MetricsAPIPort: 15000
        };
    }

    getAvailablePorts() {
        return [
            new ServicePortDefinition(13000, "tcp", "P2P connections"),
            new ServicePortDefinition(12000, "udp", "P2P connections"),
        ];
    }
}

// EOF
