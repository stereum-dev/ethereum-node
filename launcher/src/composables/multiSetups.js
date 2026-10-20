import YAML from "yaml";
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";
import { useNodeManage } from "@/store/nodeManage";
import { useDeepClone } from "@/composables/utils";

export const useMultiSetups = () => {
  const setupStore = useSetups();
  const serviceStore = useServices();
  const manageStore = useNodeManage();

  const loadSetups = async () => {
    try {
      const data = await ControlService.readMultiSetup();
      setupStore.serverSetups = parseYAMLData(data);
    } catch (e) {
      console.error("Couldn't read multi config yaml", e);
    }
  };

  // a setup's entry can hold nested settings (builders), so it is read as YAML and not line by line
  const parseYAMLData = (data) =>
    Object.entries(YAML.parse(data ?? "") ?? {}).map(([configId, setup]) => ({
      configId,
      name: setup?.name,
      network: setup?.network,
      color: setup?.color,
      serviceIds: Array.isArray(setup?.services) ? setup.services.map(String) : [],
      buildersSaved: !!setup?.builders,
    }));

  const getAllSetups = () => {
    let setups;
    setups = setupStore.serverSetups.map((config) => ({
      setupId: config.configId,
      setupName: config.name,
      setupType: config?.name.toLowerCase().includes("op") || config.network.toLowerCase().includes("op") ? "OP" : "ETH",
      network: config.network,
      color: config.color,
      buildersSaved: !!config.buildersSaved,
      isConnected: false,
      isSelected: false,
      services: serviceStore.installedServices
        .filter((service) => config.serviceIds.includes(service.config.serviceID))
        .map((s) => {
          return {
            ...s,
            setupId: config.configId,
            setupName: config.name,
          };
        }),

      isActive: false,
    }));

    return setups;
  };

  const getSelectedSetup = (setup, flag = false) => {
    setupStore.allSetups.forEach((s) => (s.isActive = false));
    setupStore.editSetups.forEach((s) => (s.isActive = false));
    setup.isActive = true;
    setupStore.selectedSetup = setup;
    setupStore.isEditConfigViewActive = flag;
    setupStore.isConfigViewActive = !flag;
  };

  const getServerView = () => {
    setupStore.allSetups.forEach((s) => (s.isActive = false));
    setupStore.editSetups.forEach((s) => (s.isActive = false));
    setupStore.isConfigViewActive = false;
    setupStore.isEditConfigViewActive = false;
    setupStore.selectedSetup = null;
  };

  const updateDom = async () => {
    setupStore.allSetups = getAllSetups();
    setupStore.editSetups = getAllSetups();
    manageStore.newConfiguration = useDeepClone(serviceStore.installedServices);
    setupStore.updateSelectedSetup();
  };

  return {
    loadSetups,
    getAllSetups,
    getSelectedSetup,
    getServerView,
    updateDom,
  };
};
