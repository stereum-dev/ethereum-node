import ControlService from "@/store/ControlService";
import { ref } from "vue";
import { useSetups } from "@/store/setups";

export const useMultiSetups = () => {
  const services = ref([]);
  const setupStore = useSetups();

  const loadSetups = async () => {
    try {
      const data = await ControlService.readMultiSetup();
      setupStore.serverSetups = parseYAMLData(data);
      console.log("Configs", setupStore.serverSetups);
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
    let currentConfig = {};

    lines.forEach((line) => {
      // Check for UUID line indicating the start of a new config
      if (line.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:$/)) {
        if (Object.keys(currentConfig).length) parsedConfigs.push(currentConfig);
        currentConfig = { configId: line.slice(0, -1), serviceIds: [] }; // Remove ':' at the end
      } else if (line.includes("name:")) {
        currentConfig.name = line.split(":")[1].trim().replace(/"/g, ""); // Remove quotes and trim
      } else if (line.includes("network:")) {
        currentConfig.network = line.split(":")[1].trim().replace(/"/g, ""); // Remove quotes and trim
      } else if (line.includes("color:")) {
        // Handling color similarly
        currentConfig.color = line.split(":")[1].trim().replace(/"/g, ""); // Remove quotes and trim
      } else if (line.trim().startsWith("-")) {
        currentConfig.serviceIds.push(line.trim().slice(2)); // Assuming service IDs don't need quotes removed
      }
    });

    // Add the last config if exists
    if (Object.keys(currentConfig).length) parsedConfigs.push(currentConfig);

    return parsedConfigs;
  };

  const getAllSetups = () => {
    let setups = [];
    setups = setupStore.serverSetups.map((config) => ({
      setupId: config.configId,
      setupName: config.name,
      setupType: config.setupType,
      network: config.network,
      color: config.color,
      services: services.value.filter((service) => config.serviceIds.includes(service.id)),
      isActive: false,
    }));

    return setups;
  };

  return { loadSetups, loadServices, getAllSetups };
};
