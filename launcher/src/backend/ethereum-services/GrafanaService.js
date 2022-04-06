import { NodeService } from "./NodeService";
import { ServicePortDefinition } from "./SerivcePortDefinition";
import { ServiceVolume } from "./ServiceVolume";

export class GrafanaService extends NodeService {
    static buildByConfiguration(config) {
        const service = new GrafanaService();

        service.initByConfig(config);

        return service;
    }
}