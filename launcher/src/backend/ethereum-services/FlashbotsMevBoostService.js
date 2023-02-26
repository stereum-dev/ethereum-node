import { NodeService } from "./NodeService";

export class FlashbotsMevBoostService extends NodeService {
  static buildByUserInput(network, relayLinks) {
    const image = "flashbots/mev-boost";
    const service = new FlashbotsMevBoostService();

    service.init(
      "FlashbotsMevBoostService",
      null, // id
      1, // configVersion
      image, // image
      "v0.8.2", // imageVersion
      null, // command
      ["/app/mev-boost", "-addr", "0.0.0.0:18550", `-${network}`, "-relay-check", "-relays", `${relayLinks}`], // entrypoint
      null, // env
      null, // ports
      null, // volumes
      null, // user
      network // network
      // executionClients
      // consensusClients
      // FlashbotsMevBoostService
    );
    return service;
  }

  static buildByConfiguration(config) {
    const service = new FlashbotsMevBoostService();

    service.initByConfig(config);

    return service;
  }

  buildMevboostEndpointURL() {
    return "http://stereum-" + this.id + ":18550";
  }
}
