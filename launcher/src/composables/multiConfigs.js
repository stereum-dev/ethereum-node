import ControlService from "@/store/ControlService";
import { ref } from "vue";

export const useMultiConfigs = () => {
  // State to store the parsed configurations
  const configs = ref([]);

  // Function to get all services and filter them based on the config IDs
  const getAllServices = async () => {
    try {
      let services = await ControlService.getServices();

      services = services.filter((service) => {
        return configs.value.some((config) => config.serviceIds.includes(service.id));
      });

      console.log("Filtered Same Service Ids", services);
      return services;
    } catch (e) {
      console.error("Couldn't read services", e);
    }
  };

  // Function to load the configurations from the multiconfig.yaml
  const loadConfigs = async () => {
    try {
      const data = await ControlService.readMultiConfigYaml();

      let tempConfigs = parseYAMLData(data);

      configs.value = tempConfigs;
    } catch (e) {
      console.error("Couldn't read multi config yaml", e);
    }
  };

  // Function to parse the YAML-like string data
  const parseYAMLData = (data) => {
    const parsedConfigs = [];
    const lines = data.split("\n");
    let currentConfig = null;

    lines.forEach((line) => {
      if (line.endsWith(":")) {
        if (currentConfig) parsedConfigs.push(currentConfig); // Push the previous config if exists

        // Use a regular expression to find the last hyphen followed by a UUID
        const regex = /-(?=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
        const parts = line.slice(0, -1).split(regex); // Slice to remove the trailing colon, then split

        const configName = parts.slice(0, -1).join("-");
        const configId = parts[parts.length - 1];

        currentConfig = { configName, configId, serviceIds: [] };
      } else if (line.trim().startsWith("-")) {
        const serviceId = line.trim().slice(2); // Remove the '- ' from the start
        currentConfig.serviceIds.push(serviceId);
      }
    });

    if (currentConfig) parsedConfigs.push(currentConfig); // Push the last config if exists
    return parsedConfigs;
  };

  // Expose the configs state and the loadConfigs function
  return {
    configs,
    loadConfigs,
    getAllServices,
  };
};
