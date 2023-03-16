import { NodeService } from "./NodeService.js";
import { ServiceVolume } from "./ServiceVolume.js";

export class NotificationService extends NodeService {
  static buildByUserInput(network, dir) {
    const service = new NotificationService();
    service.setId();
    const workingDir = service.buildWorkingDir(dir);

    const image = "stereum/notifications";

    const dataDir = "/opt/app/qrcode";

    const volumes = [new ServiceVolume(workingDir + "/qrcode", dataDir)];

    service.init(
      "NotificationService", //service
      service.id, // id,
      1, // configVersion
      image, // image,
      "v1.1.0", // imageVersion,
      null, // command,
      null, // entrypoint,
      {
        STEREUM_SERVER_URL: "https://notifications.stereum.cloud",
        PORT: "3000",
        QRCODE_FILENAME: dataDir + "/qrcode.png",
        STEREUM_APIKEY: "4cTLZL8gcZ5knP49murPh2qaZSchryfHraHQHFDPuuA8jqJLrSdr7Bd4s4TSSVBW",
        KEY_FILENAME: dataDir + "/keys.json",
      }, // env,
      [], // ports,
      volumes, // volumes,
      null, // user,
      network // network,
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new NotificationService();

    service.initByConfig(config);

    return service;
  }
}
