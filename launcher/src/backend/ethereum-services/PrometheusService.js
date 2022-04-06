import { NodeService } from "./NodeService";
import { ServicePortDefinition } from "./SerivcePortDefinition";
import { ServiceVolume } from "./ServiceVolume";

export class PrometheusService extends NodeService {
    static buildByConfiguration(config) {
        const service = new PrometheusService();

        service.initByConfig(config);

        return service;
    }
}