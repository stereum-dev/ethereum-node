import { NodeService } from "./NodeService";
import { ServiceVolume } from "./ServiceVolume";
import { ServicePort } from "./ServicePort";

export class CustomService extends NodeService {
  static buildByUserInput(network, dir, imageString, entrypoint, command, ports, volumes) {
    const service = new CustomService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = CustomService.parseImageString(imageString);

    command = command.replace(/\s\s+/g, " ").trim();

    const finalPorts = ports.map((p) => {
      return ServicePort.buildByConfig(p);
    });

    const finalVolumes = volumes.map((v) => {
      if (v.includes("<iDir>")) {
        v = v.replace("<iDir>", workingDir);
      }
      return ServiceVolume.buildByConfig(v);
    });

    service.init(
      "CustomService", // service
      service.id, // id
      1, // configVersion
      image.image, // image
      image.version, // imageVersion
      command ? command.split(" ") : [], // command
      entrypoint ? [entrypoint] : [], // entrypoint
      null, // env
      finalPorts, // ports
      finalVolumes, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new CustomService();

    service.initByConfig(config);

    return service;
  }
}

// EOF
