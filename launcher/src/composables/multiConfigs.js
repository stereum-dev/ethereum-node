import ControlService from "@/store/ControlService";
import { ref } from "vue";

export const useMultiConfigs = () => {
  const configs = ref([]);
  const services = ref([]);

  const loadConfigs = async () => {
    try {
      const data = await ControlService.readMultiConfigYaml();
      configs.value = parseYAMLData(data);
    } catch (e) {
      console.error("Couldn't read multi config yaml", e);
    }
  };

  const loadServices = async () => {
    try {
      services.value = await ControlService.getServices();
    } catch (e) {
      console.error("Couldn't read services", e);
    }
  };

  const parseYAMLData = (data) => {
    const parsedConfigs = [];
    const lines = data.split("\n");
    let currentConfig = null;

    lines.forEach((line) => {
      if (line.endsWith(":")) {
        if (currentConfig) parsedConfigs.push(currentConfig);
        const regex = /-(?=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
        const parts = line.slice(0, -1).split(regex);
        currentConfig = {
          configName: parts.slice(0, -1).join("-"),
          configId: parts[parts.length - 1],
          serviceIds: [],
        };
      } else if (line.trim().startsWith("-")) {
        currentConfig.serviceIds.push(line.trim().slice(2));
      }
    });

    if (currentConfig) parsedConfigs.push(currentConfig);
    return parsedConfigs;
  };

  const getAllConfigs = () => {
    return configs.value.map((config) => ({
      configId: config.configId,
      configName: config.configName,
      services: services.value.filter((service) => config.serviceIds.includes(service.id)),
    }));
  };

  return { loadConfigs, loadServices, getAllConfigs };
};
