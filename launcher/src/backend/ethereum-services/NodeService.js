import { ServicePort } from "./ServicePort.js";
import { ServiceVolume } from "./ServiceVolume.js";
import { StringUtils } from "../StringUtils.js";
import * as path from "path";

export const networks = {
  mainnet: {
    name: "mainnet",
    dataEndpoint: "https://mainnet.beaconcha.in/api/v1",
  },
  goerli: {
    name: "goerli",
    dataEndpoint: "https://goerli.beaconcha.in/api/v1",
  },
  gnosis: {
    name: "gnosis",
    dataEndpoint: "https://beacon.gnosischain.com/api/v1",
  },
  sepolia: {
    name: "sepolia",
    dataEndpoint: "https://sepolia.beaconcha.in/api/v1",
  },
  holesky: {
    name: "holesky",
    dataEndpoint: "https://holesky.beaconcha.in/api/v1",
  },
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
      };
    } else {
      return {
        image: imageString,
        version: "latest",
      };
    }
  }

  init(
    service,
    id,
    configVersion,
    image,
    imageVersion,
    command,
    entrypoint,
    env,
    ports,
    volumes,
    user,
    network,
    executionClients,
    consensusClients,
    mevboost,
    otherServices
  ) {
    this.service = service;
    this.setId(id);
    this.configVersion = configVersion;
    this.image = image;
    this.imageVersion = imageVersion;
    this.command = command === undefined || command === null ? [] : command;
    this.entrypoint = entrypoint === undefined || entrypoint === null ? [] : entrypoint;
    this.env = env === undefined || env === null ? {} : env;
    this.ports = ports === undefined || ports === null ? [] : ports;
    this.volumes = volumes === undefined || volumes === null ? [] : volumes;
    this.user = user === undefined || user === null ? "2000" : user;
    this.network = network === undefined || network === null ? "goerli" : network;

    this.dependencies = {
      executionClients: executionClients,
      consensusClients: consensusClients,
      mevboost: mevboost,
      otherServices: otherServices,
    };
  }

  initByConfig(config) {
    const imageInformation = NodeService.parseImageString(config.image);

    this.setId(config.id);
    this.service = config.service;
    this.configVersion = config.configVersion;
    this.image = imageInformation.image;
    this.imageVersion = imageInformation.version;
    this.command = config.command;
    this.entrypoint = config.entrypoint;
    this.env = config.env;
    this.ports = (config.ports || []).map((portString) => ServicePort.buildByConfig(portString));
    this.volumes = (config.volumes || []).map((volumeString) => ServiceVolume.buildByConfig(volumeString));
    this.user = config.user;
    this.network = config.network;
    config.dependencies = config.dependencies ? config.dependencies : {};
    this.dependencies = {
      executionClients: config.dependencies.executionClients ? config.dependencies.executionClients : [],
      consensusClients: config.dependencies.consensusClients ? config.dependencies.consensusClients : [],
      mevboost: config.dependencies.mevboost ? config.dependencies.mevboost : [],
      otherServices: config.dependencies.otherServices ? config.dependencies.otherServices : [],
    };
  }

  setId(id) {
    this.id = id || StringUtils.createRandomString();
  }

  buildConfiguration() {
    return {
      service: this.service,
      id: this.id,
      configVersion: this.configVersion,
      command: this.command,
      entrypoint: this.entrypoint,
      env: this.env,
      image: this.image + ":" + this.imageVersion,
      ports: (this.ports || new Array()).map((port) => {
        return port.buildPortMapping();
      }),
      restart_policy: this.restartPolicy,
      volumes: (this.volumes || new Array()).map((volume) => {
        return volume.buildVolumeMapping();
      }),
      user: this.user,
      autoupdate: true,
      network: this.network,

      dependencies: {
        executionClients: (this.dependencies.executionClients || []).map((service) => service.buildMinimalConfiguration()),
        consensusClients: (this.dependencies.consensusClients || []).map((service) => service.buildMinimalConfiguration()),
        mevboost: (this.dependencies.mevboost || []).map((service) => service.buildMinimalConfiguration()),
        otherServices: (this.dependencies.otherServices || []).map((service) => service.buildMinimalConfiguration()),
      },
    };
  }

  buildMinimalConfiguration() {
    return {
      service: this.service,
      id: this.id,
    };
  }

  buildWorkingDir(dir) {
    if (!dir) dir = "/opt/stereum";
    dir = path.posix.normalize(dir);
    if (!path.posix.isAbsolute(dir)) dir = "/" + dir;
    if (dir.endsWith("/")) return dir.slice(0, -1, "") + "-" + this.id;
    return dir + "-" + this.id;
  }

  getDataDir() {
    return this.volumes.find((volume) => volume.servicePath === "/opt/app/data")?.destinationPath;
  }
}

// EOF
