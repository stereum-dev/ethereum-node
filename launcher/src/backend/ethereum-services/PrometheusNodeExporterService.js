import { NodeService } from "./NodeService";
import { ServicePortDefinition } from "./SerivcePortDefinition";
import { ServiceVolume } from "./ServiceVolume";

export class PrometheusNodeExporterService extends NodeService {
    static buildByConfiguration(config) {
        const service = new PrometheusNodeExporterService();

        service.initByConfig(config);

        return service;
    }
}