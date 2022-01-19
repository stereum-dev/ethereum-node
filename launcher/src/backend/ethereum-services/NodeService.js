import { ServicePort } from './ServicePort.js';
import { ServiceVolume } from './ServiceVolume.js';
import * as crypto from "crypto";

export const networks = {
    goerli: "goerli",
    prater: "prater",
    mainnet: "mainnet",
};

export class NodeService {
    static buildEmpty() {
        return new NodeService();
    }

    static parseImageString(imageString) {
        if (imageString && imageString.includes(":")) {
            const imageInformation = imageString.split(":");

            return {
                image: imageInformation[0],
                version: imageInformation[1],
            }
        } else {
            return {
                image: imageString,
                version: "latest",
            };
        }
    }

    init(id, image, imageVersion, command, entrypoint, env, ports, volumes, user, network, executionClients, consensusClients) {
        this.setId(id);
        this.image = image;
        this.imaveVersion = imageVersion;
        this.command = command ?? [];
        this.entrypoint = entrypoint ?? [];
        this.env = env ?? {STEREUM_DUMMY: "foobar"};
        this.ports = ports ?? [];
        this.volumes = volumes ?? [];
        this.user = user ?? "2000";
        this.network = network ?? networks.prater;

        this.dependencies = {
            executionClients: executionClients,
            consensusClients: consensusClients
        }
    }

    initByConfig(config) {
        const imageInformation = NodeService.parseImageString(config.image);

        this.setId(config.id);
        this.service = config.service;
        this.image = imageInformation.image;
        this.imageVersion = imageInformation.version;
        this.command = config.command;
        this.entrypoint = config.entrypoint;
        this.env = config.env;
        this.ports = (config.ports ?? []).map(portString => ServicePort.buildByConfig(portString));
        this.volumes = (config.volumes ?? []).map(volumeString => ServiceVolume.buildByConfig(volumeString));
        this.user = config.user;
        this.network = config.network;

        this.dependencies = {
            executionClients: config.dependencies ? config.dependencies.executionClients : [],
            consensusClients: config.dependencies ? config.dependencies.consensusClients : [],
        }
    }

    setId(id) {
        this.id = id ?? crypto.randomUUID();
    }

    buildConfiguration() {
        return {
            service: this.constructor.name,
            id: this.id,
            command: this.command,
            entrypoint: this.entrypoint,
            env: this.env,
            image: this.image + ":" + this.imaveVersion,
            ports: (this.ports ?? new Array()).map(port => {return port.buildPortMapping()}),
            restart_policy: this.restartPolicy,
            volumes: (this.volumes ?? new Array()).map(volume => {return volume.buildVolumeMapping()}),
            user: this.user,
            autoupdate: true,
            network: this.network,

            dependencies: {
                executionClients: (this.dependencies.executionClients ?? []).map(service => service.buildMinimalConfiguration()),
                consensusClients: (this.dependencies.consensusClients ?? []).map(service => service.buildMinimalConfiguration()),
            }
        };
    }

    buildMinimalConfiguration() {
        return {
            service: this.constructor.name,
            id: this.id,
        }
    }
}

// EOF
