import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services";
import { useNodeHeader } from "@/store/nodeHeader";
import { useNodeManage } from "@/store/nodeManage";
import { useFooter } from "@/store/theFooter";
import { useDeepClone } from "@/composables/utils";

export async function useBackendServices(force = false) {
  const serviceStore = useServices();
  const currentTimestamp = Date.now();
  if (
    !serviceStore.backendServicesTimestamp ||
    serviceStore.backendServicesTimestamp < currentTimestamp - 10000 ||
    force
  ) {
    serviceStore.backendServicesTimestamp = currentTimestamp;
    serviceStore.backendServices = await ControlService.getServices();
    // when we get the services from the backend, we can update the frontend service format as well
  }
  return serviceStore.backendServices;
}

export async function useFrontendServices() {
  const serviceStore = useServices();
  const nodeHeaderStore = useNodeHeader();
  const nodeManageStore = useNodeManage();

  const allServices = JSON.parse(JSON.stringify(serviceStore.allServices));
  if (nodeHeaderStore.refresh) {
    if (await useConnectionCheck()) {
      let services;
      try {
        services = await ControlService.refreshServiceInfos();
      } catch (error) {
        console.log(error);
        return;
      }
      if (services && services.length != 0 && nodeHeaderStore.refresh) {
        let otherServices = [];
        let needForTunnel = [];
        const newServices = services.map((service) => {
          let oldService;
          if (
            serviceStore.installedServices &&
            serviceStore.installedServices.map((s) => s?.config.serviceID).includes(service?.config.serviceID)
          ) {
            oldService = serviceStore.installedServices.find(
              (s) =>
                s.service === service.service && s.config.serviceID && s.config.serviceID === service.config.serviceID
            );
          } else {
            oldService = allServices.find((s) => s.service === service.service);
            if (oldService?.tunnelLink) needForTunnel.push(oldService);
          }
          if (oldService?.config.keys) {
            oldService.config = {
              ...service?.config,
              keys: oldService?.config.keys,
            };
          } else {
            oldService.config = service?.config;
          }
          oldService.state = service.state;
          if (
            (oldService.service === "TekuBeaconService" || oldService.service === "NimbusBeaconService") &&
            oldService.config.configVersion &&
            oldService.config.configVersion < 2
          ) {
            let existing = serviceStore.installedServices.find(
              (s) =>
                s.config.serviceID === oldService.config.serviceID && s.service === oldService.name + "ValidatorService"
            );
            let vs;
            if (existing) {
              vs = existing;
            } else {
              vs = allServices.find((element) => element.service === oldService.name + "ValidatorService");
            }
            if (vs.service === "TekuValidatorService") {
              vs.icon = require("/public/img/icon/plugin-icons/validator/Teku-Validator-Linked-Circle.png");
              vs.sIcon = require("/public/img/icon/plugin-icons/validator/Teku-Validator-Linked-s.png");
            } else if (vs.service === "NimbusValidatorService") {
              vs.icon = require("/public/img/icon/plugin-icons/validator/Nimbus-Validator-Linked-Circle.png");
              vs.sIcon = require("/public/img/icon/plugin-icons/validator/Nimbus-Validator-Linked-s.png");
            }
            vs.config = oldService.config;
            vs.state = oldService.state;
            otherServices.push(vs);
          }
          return oldService;
        });
        serviceStore.installedServices = newServices.concat(otherServices).map((e, i) => {
          e.id = i;
          return e;
        });
        let network = serviceStore.installedServices[0]?.config.network;
        nodeManageStore.currentNetwork = nodeManageStore.networkList.find((item) => item.network === network);

        if (needForTunnel.length != 0 && nodeHeaderStore.refresh) {
          let localPorts = await ControlService.getAvailablePort({
            min: 9000,
            max: 9999,
            amount: needForTunnel.filter((s) => s?.headerOption && s.tunnelLink).length,
          });

          nodeHeaderStore.runningServices = serviceStore.installedServices
            .filter((service) => service?.headerOption)
            .map((service) => {
              if (service.tunnelLink) {
                service.linkUrl = "http://localhost:" + localPorts.pop();
              }
              return service;
            });

          let ports = nodeHeaderStore.runningServices
            .filter((service) => service.tunnelLink)
            .map((service) => {
              return {
                dstPort: service.config.ports[0].destinationPort,
                localPort: service.linkUrl.split(":").pop(),
              };
            });

          await ControlService.openTunnels(ports);
        } else if (nodeHeaderStore.refresh) {
          nodeHeaderStore.runningServices = serviceStore.installedServices.filter((service) => service?.headerOption);
        }
      } else {
        if (!nodeHeaderStore.updating) {
          serviceStore.installedServices = [];
          nodeHeaderStore.runningServices = [];
        }
      }
      if (!nodeManageStore.currentNetwork) {
        nodeManageStore.currentNetwork = nodeManageStore.networkList.find((item) => item.network === "goerli");
      }
    }
  }
}

async function useConnectionCheck() {
  const nodeHeaderStore = useNodeHeader();
  const footerStore = useFooter();

  if (!nodeHeaderStore.updating && nodeHeaderStore.refresh) {
    let connected = await ControlService.checkConnection();
    if (!connected) {
      console.log("Connection lost");
      nodeHeaderStore.refresh = false;
      footerStore.stereumStatus = false;
    } else {
      footerStore.stereumStatus = true;
    }
    return connected;
  }
  return false;
}

async function updateStates() {
  const serviceStore = useServices();
  let serviceInfos = await ControlService.listServices();
  serviceStore.installedServices.forEach((s, idx) => {
    let updated = false;
    serviceInfos.forEach((i) => {
      if (i.Names.replace("stereum-", "") === s.config.serviceID) {
        serviceStore.installedServices[idx].state = i.State;
        updated = true;
      }
    });
    if (!updated) {
      serviceStore.installedServices[idx].state = "exited";
    }
  });
}

export async function useStateHandler(client) {
  client.yaml = await ControlService.getServiceYAML(client.config.serviceID);
  if (!client.yaml.includes("isPruning: true")) {
    client.serviceIsPending = true;
    let state = "stopped";
    if (client.state === "exited") {
      state = "started";
    }
    try {
      await ControlService.manageServiceState({
        id: client.config.serviceID,
        state: state,
      });
    } catch (err) {
      console.log(state.replace("ed", "ing") + " service failed:\n", err);
    }
    client.serviceIsPending = false;
    updateStates();
  }
}

export async function useRestartService(client) {
  client.yaml = await ControlService.getServiceYAML(client.config.serviceID);
  if (!client.yaml.includes("isPruning: true")) {
    client.serviceIsPending = true;
    await ControlService.restartService(useDeepClone(client));
    client.serviceIsPending = false;
    updateStates();
  }
}
