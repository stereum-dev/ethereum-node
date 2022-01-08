import * as crypto from "crypto";

export const networks = {
    goerli: "goerli",
    prater: "prater",
    mainnet: "mainnet",
};

export class NodeService {
    init(id, image, imageVersion, command, entrypoint, env, ports, volumes, user, network) {
        this.id = id ?? crypto.randomUUID();
        this.image = image;
        this.imaveVersion = imageVersion;
        this.command = command ?? [];
        this.entrypoint = entrypoint ?? [];
        this.env = env ?? {STEREUM_DUMMY: "foobar"};
        this.ports = ports ?? [];
        this.volumes = volumes ?? [];
        this.user = user ?? "2000";
        this.network = network ?? networks.prater;
    }

    buildConfiguration() {
        return {
            service: this.constructor.name,
            id: this.id,
            command: this.command,
            entrypoint: this.entrypoint,
            env: this.env,
            image: this.image + ":" + this.imaveVersion,
            ports: this.ports.map(port => {return port.buildPortMapping()}),
            restart_policy: this.restartPolicy,
            volumes: this.volumes.map(volume => {return volume.buildVolumeMapping()}),
            user: this.user,
            autoupdate: true,
            network: this.network,
        };
    }
}

// EOF
