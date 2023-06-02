import { LighthouseBeaconService } from "./ethereum-services/LighthouseBeaconService";
import { LighthouseValidatorService } from "./ethereum-services/LighthouseValidatorService";
import { LodestarBeaconService } from "./ethereum-services/LodestarBeaconService";
import { LodestarValidatorService } from "./ethereum-services/LodestarValidatorService";
import { GethService } from "./ethereum-services/GethService";
import { ErigonService } from "./ethereum-services/ErigonService";
import { BesuService } from "./ethereum-services/BesuService";
import { SSVNetworkService } from "./ethereum-services/SSVNetworkService";
import { CharonService } from "./ethereum-services/CharonService";
import { NimbusBeaconService } from "./ethereum-services/NimbusBeaconService";
import { NimbusValidatorService } from "./ethereum-services/NimbusValidatorService";
import { PrometheusService } from "./ethereum-services/PrometheusService";
import { PrometheusNodeExporterService } from "./ethereum-services/PrometheusNodeExporterService";
import { GrafanaService } from "./ethereum-services/GrafanaService";
import { PrysmBeaconService } from "./ethereum-services/PrysmBeaconService";
import { PrysmValidatorService } from "./ethereum-services/PrysmValidatorService";
import { TekuBeaconService } from "./ethereum-services/TekuBeaconService";
import { TekuValidatorService } from "./ethereum-services/TekuValidatorService";
import { NethermindService } from "./ethereum-services/NethermindService";
import { FlashbotsMevBoostService } from "./ethereum-services/FlashbotsMevBoostService";
import { ServicePort, servicePortProtocol, changeablePorts } from "./ethereum-services/ServicePort";
import { StringUtils } from "./StringUtils";
import { ServiceVolume } from "./ethereum-services/ServiceVolume";
import { Web3SignerService } from "./ethereum-services/Web3SignerService";
import { NotificationService } from "./ethereum-services/NotificationService";
import { ValidatorEjectorService } from "./ethereum-services/ValidatorEjectorService";
import { KeysAPIService } from "./ethereum-services/KeysAPIService";
import YAML from "yaml";

const log = require("electron-log");

async function Sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * desired states of a service
 */
export const serivceState = {
  restarted: "restarted",
  started: "started",
  stopped: "stopped",
};

export class ServiceManager {
  constructor(nodeConnection) {
    this.nodeConnection = nodeConnection;
  }

  /**
   * Set the desired state of a service.
   *
   * @param serviceId service's id
   * @param state a string with the desired state, see serivceState
   * @returns an object containing a reference to the ansible process output, usable with NodeConnection.playbookStatus
   */
  manageServiceState(serviceId, state) {
    const extraVars = {
      stereum_role: "manage-service",
      stereum_args: {
        manage_service: {
          state: state,
          configuration: {
            id: serviceId,
          },
        },
      },
    };
    return this.nodeConnection.runPlaybook(state.replace("ed", "ing Service"), extraVars);
  }

  /**
   * Read the service configurations.
   *
   * @returns an array of all service configurations
   */
  async readServiceConfigurations() {
    return this.nodeConnection
      .listServicesConfigurations()
      .then(async (services) => {
        const serviceConfigurations = new Array();
        for (let i = 0; i < services.length; i++) {
          const service = services[i];
          await this.nodeConnection.readServiceConfiguration(service).then((config) => {
            serviceConfigurations.push(config);
          });
        }

        return serviceConfigurations;
      })
      .then((serviceConfigurations) => {
        const services = new Array();

        for (let i = 0; i < serviceConfigurations.length; i++) {
          const config = serviceConfigurations[i];

          if (config.service) {
            if (config.service == "LighthouseBeaconService") {
              services.push(LighthouseBeaconService.buildByConfiguration(config));
            } else if (config.service == "LighthouseValidatorService") {
              services.push(LighthouseValidatorService.buildByConfiguration(config));
            } else if (config.service == "LodestarBeaconService") {
              services.push(LodestarBeaconService.buildByConfiguration(config));
            } else if (config.service == "LodestarValidatorService") {
              services.push(LodestarValidatorService.buildByConfiguration(config));
            } else if (config.service == "GethService") {
              services.push(GethService.buildByConfiguration(config));
            } else if (config.service == "ErigonService") {
              services.push(ErigonService.buildByConfiguration(config));
            } else if (config.service == "BesuService") {
              services.push(BesuService.buildByConfiguration(config));
            } else if (config.service == "NethermindService") {
              services.push(NethermindService.buildByConfiguration(config));
            } else if (config.service == "SSVNetworkService") {
              services.push(SSVNetworkService.buildByConfiguration(config));
            } else if (config.service == "NimbusBeaconService") {
              services.push(NimbusBeaconService.buildByConfiguration(config));
            } else if (config.service == "NimbusValidatorService") {
              services.push(NimbusValidatorService.buildByConfiguration(config));
            } else if (config.service == "PrometheusService") {
              services.push(PrometheusService.buildByConfiguration(config));
            } else if (config.service == "PrometheusNodeExporterService") {
              services.push(PrometheusNodeExporterService.buildByConfiguration(config));
            } else if (config.service == "GrafanaService") {
              services.push(GrafanaService.buildByConfiguration(config));
            } else if (config.service == "PrysmBeaconService") {
              services.push(PrysmBeaconService.buildByConfiguration(config));
            } else if (config.service == "PrysmValidatorService") {
              services.push(PrysmValidatorService.buildByConfiguration(config));
            } else if (config.service == "TekuBeaconService") {
              services.push(TekuBeaconService.buildByConfiguration(config));
            } else if (config.service == "TekuValidatorService") {
              services.push(TekuValidatorService.buildByConfiguration(config));
            } else if (config.service == "FlashbotsMevBoostService") {
              services.push(FlashbotsMevBoostService.buildByConfiguration(config));
            } else if (config.service == "Web3SignerService") {
              services.push(Web3SignerService.buildByConfiguration(config));
            } else if (config.service == "NotificationService") {
              services.push(NotificationService.buildByConfiguration(config));
            } else if (config.service == "ValidatorEjectorService") {
              services.push(ValidatorEjectorService.buildByConfiguration(config));
            } else if (config.service == "KeysAPIService") {
              services.push(KeysAPIService.buildByConfiguration(config));
            } else if (config.service == "CharonService") {
              services.push(KeysAPIService.buildByConfiguration(config));
            }
          } else {
            log.error("found configuration without service!");
            log.error(config);
            throw new Error("configuration without service specified");
          }
        }
        //retrieve full service out of minimal config
        services.forEach((service) => {
          if (service.dependencies.executionClients.length > 0) {
            service.dependencies.executionClients = service.dependencies.executionClients.map((client) => {
              return services.find((dependency) => dependency.id === client.id);
            });
          }
          if (service.dependencies.consensusClients.length > 0) {
            service.dependencies.consensusClients = service.dependencies.consensusClients.map((client) => {
              return services.find((dependency) => dependency.id === client.id);
            });
          }
          if (service.dependencies.mevboost.length > 0) {
            service.dependencies.mevboost = service.dependencies.mevboost.map((client) => {
              return services.find((dependency) => dependency.id === client.id);
            });
          }
        });
        return services;
      })
      .catch((err) => {
        log.error(err);
        return [];
      });
  }

  async chooseServiceAction(action, service, data) {
    switch (action) {
      case "pruneGeth":
        if (service.service === "GethService") {
          let data = service.yaml + "\nisPruning: true";
          await this.nodeConnection.writeServiceYAML({
            id: service.config.serviceID,
            data: data,
            service: service.service,
          });
          this.nodeConnection.runPlaybook("Pruning Geth", {
            stereum_role: "prune-geth",
            geth_service: service.config.serviceID,
          });
        }
        break;

      case "reSync":
        await this.resyncService(service, data);
        break;

      default:
        break;
    }
  }

  async resyncService(serviceID, checkpointUrl) {
    let services = await this.readServiceConfigurations();
    let client = services.find((service) => service.id === serviceID);

    const dataDir = client.volumes.find(
      (vol) =>
        vol.servicePath === "/opt/app/beacon" ||
        vol.servicePath === "/opt/app/data" ||
        vol.servicePath === "/opt/data/geth" ||
        vol.servicePath === "/opt/data/erigon"
    ).destinationPath;
    await this.manageServiceState(client.id, "stopped");

    if (dataDir.length > 0) {
      await this.deleteDataVolume(dataDir);
    }

    this.updateSyncCommand(client, checkpointUrl);

    await this.nodeConnection.writeServiceConfiguration(client.buildConfiguration());
    await this.manageServiceState(client.id, "started");
  }

  updateSyncCommand(client, checkpointUrl) {
    const checkpointCommands = {
      LighthouseBeaconService: "--checkpoint-sync-url=",
      LodestarBeaconService: "--checkpointSyncUrl=",
      PrysmBeaconService: "--checkpoint-sync-url=",
      NimbusBeaconService: "--trusted-node-url=",
      TekuBeaconService: "--initial-state=",
    };
    //if command is string
    if (typeof client.command === "string") {
      //remove old checkpoint command
      if (client.command.includes(checkpointCommands[client.service])) {
        let commands = client.command.replaceAll(/\n/gm, "").replaceAll(/\s\s+/gm, " ").split(" ");
        let includesCommand = commands.filter((c) => c.includes(checkpointCommands[client.service]));
        commands = commands.filter((c) => !includesCommand.includes(c));
        client.command = commands.concat().join(" ").trim();
      }
      //add checkpointSync if Url was send
      if (checkpointUrl) {
        client.command += " " + checkpointCommands[client.service] + checkpointUrl;
      }
    } else {
      //check if command is used
      const checkpointSyncIndex = client.command.findIndex((c) => c.includes(checkpointCommands[client.service]));
      //delete checkpointSync if used
      if (checkpointSyncIndex > -1) {
        client.command.splice(checkpointSyncIndex, 1);
      }
      //add checkpointSync if Url was send
      if (checkpointUrl) {
        client.command.push(checkpointCommands[client.service] + checkpointUrl);
      }
    }
  }

  async deleteDataVolume(dataDir) {
    await this.nodeConnection.sshService.exec(`rm -r ${dataDir}/*`);
  }

  getWorkindDir(service) {
    if (service.volumes.length > 0) {
      let volumeWithID = service.volumes.find((v) => v.destinationPath.includes(service.id));
      if (volumeWithID && volumeWithID.destinationPath)
        return volumeWithID.destinationPath.replace(new RegExp(`(?<=${service.id}).*`), "");
    }
    return undefined;
  }

  changePort(service, port) {
    let portIndex = service.ports.findIndex((p) => p.servicePort == changeablePorts[service.service]);
    if (portIndex != -1) {
      service.ports[portIndex].destinationPort = port;
    }
    return service;
  }

  async modifyServices(tasks, services, newInstallTasks) {
    let modifiedServices = [];

    tasks.forEach((task) => {
      let service = services.find((s) => s.id === task.service.config.serviceID);
      let dependencies = task.data.executionClients.concat(task.data.beaconServices).map((s) =>
        services.find((e) => {
          if (e.id === s.config.serviceID) {
            return true;
          } else if (
            newInstallTasks &&
            newInstallTasks.length > 0 &&
            e.id === newInstallTasks.find((i) => i.service.id === s.id).service.config.serviceID
          ) {
            return true;
          }
          return false;
        })
      );

      if (service.service === "FlashbotsMevBoostService") {
        service.entrypoint[service.entrypoint.findIndex((e) => e === "-relays") + 1] = task.data.relays;
        modifiedServices.push(service);
        let dependenciesToRemove = services.filter((s) =>
          s.dependencies.mevboost.map((m) => m.id).includes(service.id)
        );
        dependenciesToRemove.forEach((dependency) => {
          modifiedServices.push(this.removeDependencies(dependency, service));
        });
      }

      if (task.data.port) {
        service = this.changePort(service, task.data.port);
      }
      let updated = this.addDependencies(service, dependencies);
      if (!Array.isArray(updated)) updated = [updated];
      updated.forEach((dep) => {
        let index = modifiedServices.findIndex((s) => s.id === dep.id);
        if (index != -1) {
          modifiedServices[index] = dep;
        } else {
          modifiedServices.push(dep);
        }
      });
    });

    await Promise.all(
      modifiedServices.map(async (service) => {
        await this.nodeConnection.writeServiceConfiguration(service.buildConfiguration());
      })
    );
  }

  addDependencies(service, dependencies) {
    let command = "";
    let filter;

    switch (service.service.replace(/(Beacon|Validator|Service)/gm, "")) {
      case "Lighthouse":
        if (service.service.includes("Beacon")) {
          filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();
          command = "--execution-endpoint=";
        }
        if (service.service.includes("Validator")) {
          filter = (e) => e.buildConsensusClientHttpEndpointUrl();
          command = "--beacon-nodes=";
        }
        break;
      case "Prysm":
        if (service.service.includes("Beacon")) {
          filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();
          command = "--execution-endpoint=";
        }
        if (service.service.includes("Validator")) {
          filter = (e) => e.buildConsensusClientEndpoint();
          command = "--beacon-rpc-provider=";
          service.command = this.addCommandConnection(service, command, dependencies, filter);
          filter = (e) => e.buildConsensusClientGateway();
          command = "--beacon-rpc-gateway-provider=";
        }
        break;
      case "Lodestar":
        if (service.service.includes("Beacon")) {
          filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();
          command = "--execution.urls=";
        }
        if (service.service.includes("Validator")) {
          filter = (e) => e.buildConsensusClientHttpEndpointUrl();
          command = "--beaconNodes=";
        }
        break;
      case "Nimbus":
        if (service.service.includes("Beacon")) {
          filter = (e) => e.buildExecutionClientEngineRPCWsEndpointUrl();
          command = "--web3-url=";
        }
        if (service.service.includes("Validator")) {
          filter = (e) => e.buildConsensusClientHttpEndpointUrl();
          command = "--beacon-node=";
        }
        break;
      case "Teku":
        if (service.service.includes("Beacon")) {
          filter = (e) => e.buildExecutionClientEngineRPCHttpEndpointUrl();
          command = "--ee-endpoint=";
        }
        if (service.service.includes("Validator")) {
          filter = (e) => e.buildConsensusClientHttpEndpointUrl();
          command = "--beacon-node-api-endpoint=";
        }
        break;
      case "FlashbotsMevBoost":
        return dependencies.map((client) => {
          client.command = this.addMevBoostConnection(service, client);
          client.dependencies.mevboost.push(service);
          return client;
        });
      default:
        return service;
    }
    service.command = this.addCommandConnection(service, command, dependencies, filter);

    if (service.service.includes("Beacon")) {
      service.dependencies.executionClients = dependencies;
      let volumes = dependencies.map(
        (client) =>
          new ServiceVolume(
            client.volumes.find((vol) => vol.servicePath === "/engine.jwt").destinationPath,
            "/engine.jwt"
          )
      );
      service.volumes = service.volumes.filter((v) => v.destinationPath.includes(service.id));
      service.volumes = service.volumes.concat(volumes);
    } else if (service.service.includes("Validator")) {
      service.dependencies.consensusClients = dependencies;
    }
    return service;
  }

  addCommandConnection(service, endpointCommand, dependencies, filter) {
    let isString = false;
    let command = service.command;
    if (typeof command === "string") {
      isString = true;
      command = command.replaceAll(/\n/gm, "").replaceAll(/\s\s+/gm, " ").split(" ");
    }
    let fullCommand = command.find((c) => c.includes(endpointCommand));
    command = command.filter((c) => !c.includes(endpointCommand));
    let newProps;
    if (fullCommand) {
      newProps = [this.formatCommand(fullCommand, endpointCommand, filter, dependencies)].filter(
        (c) => c !== undefined
      );
    } else {
      newProps = endpointCommand + dependencies.map(filter).join();
    }
    if (isString) {
      return command.concat(newProps).join(" ").trim();
    }
    return command.concat(newProps);
  }

  addMevBoostConnection(service, dependency) {
    let command = dependency.command;
    let isString = false;
    if (typeof command === "string") {
      isString = true;
      command = command.replaceAll(/\n/gm, "").replaceAll(/\s\s+/gm, " ").split(" ");
    }
    let builderCommand = "";
    switch (dependency.service) {
      case "LighthouseBeaconService":
        builderCommand = "--builder=";
        break;
      case "PrysmBeaconService":
        builderCommand = "--http-mev-relay=";
        break;
      case "LodestarBeaconService":
        builderCommand = "--builder.urls=";
        break;
      case "NimbusBeaconService":
        if (!command.includes("--payload-builder=true")) command.push("--payload-builder=true");
        builderCommand = "--payload-builder-url=";
        break;
      case "TekuBeaconService":
        builderCommand = "--builder-endpoint=";
        break;
    }
    let fullCommand = command.find((c) => c.includes(builderCommand));
    command = command.filter((c) => !c.includes(builderCommand));
    if (fullCommand) {
      fullCommand = this.formatCommand(fullCommand, builderCommand, undefined, [service.buildMevboostEndpointURL()]);
    } else {
      fullCommand = builderCommand + service.buildMevboostEndpointURL();
    }

    if (isString) return command.concat([fullCommand]).join(" ").trim();
    return command.concat([fullCommand]);
  }

  removeDependencies(service, serviceToDelete) {
    //update command
    service.command = this.removeCommandConnection(service.command, serviceToDelete.id);

    //update volumes
    service.volumes = service.volumes.filter((v) => !v.destinationPath.includes(serviceToDelete.id));

    //update dependencies arrays
    for (const dependency in service.dependencies) {
      service.dependencies[dependency] = service.dependencies[dependency].filter((s) => s.id != serviceToDelete.id);
    }
    return service;
  }

  removeCommandConnection(command, id) {
    let isString = false;
    if (typeof command === "string") {
      isString = true;
      command = command.replaceAll(/\n/gm, "").replaceAll(/\s\s+/gm, " ").split(" ");
    }
    let includesID = command.filter((c) => c.includes(id));
    command = command.filter((c) => !includesID.includes(c));

    let newProps = includesID
      .map((c) => {
        let command = c.match(/.*=/)[0];
        return this.formatCommand(c, command, (e) => !e.includes(id));
      })
      .filter((c) => c !== undefined);

    if (isString) return command.concat(newProps).join(" ").trim();
    return command.concat(newProps);
  }

  formatCommand(fullCommand, command, filter, dependencies) {
    let value = fullCommand.replace(command, "");
    let quotes = false;
    if (value.startsWith('"') && value.endsWith('"')) {
      quotes = true;
      value = value.substring(1, value.length - 1);
    }
    let newValue;
    if (dependencies && filter) {
      // it's intended that dependencies is only checked for truthy
      newValue = dependencies.map(filter).join();
    } else if (dependencies) {
      // same here.
      newValue = value.split(",").concat(dependencies).join();
    } else {
      newValue = value.split(",").filter(filter).join();
    }
    if (!newValue) {
      // if dependencies is an empty array it is caught here
      return undefined;
    }
    if (quotes) newValue = '"' + newValue + '"';
    return command + newValue;
  }

  async deleteService(task, tasks, services) {
    let serviceToDelete = services.find((service) => service.id === task.service.config.serviceID);
    let dependents = [];
    services.forEach((service) => {
      for (const dependency in service.dependencies) {
        service.dependencies[dependency].forEach((s) => {
          if (s.id === serviceToDelete.id) dependents.push(service);
        });
      }
    });
    dependents.forEach((service) => {
      service = this.removeDependencies(service, serviceToDelete);
      this.nodeConnection.writeServiceConfiguration(service.buildConfiguration());
    });
    if (serviceToDelete.service === "Web3SignerService") {
      await this.nodeConnection.sshService.exec(
        `docker stop slashingdb-${serviceToDelete.id} && docker rm slashingdb-${serviceToDelete.id}`
      );
    }
    if (serviceToDelete.service === "KeysAPIService") {
      await this.nodeConnection.sshService.exec(
        `docker stop cachingDB-${serviceToDelete.id} && docker rm cachingDB-${serviceToDelete.id}`
      );
    }
    await this.nodeConnection.runPlaybook("Delete Service", {
      stereum_role: "delete-service",
      service: task.service.config.serviceID,
    });
  }
  //args: network, installDir, port, executionClients, checkpointURL, beaconServices, mevboost, relays
  getService(name, args) {
    let ports;
    switch (name) {
      case "GethService":
        ports = [
          new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
          new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", args.port ? args.port : 8545, 8545, servicePortProtocol.tcp),
          new ServicePort("127.0.0.1", 8546, 8546, servicePortProtocol.tcp),
        ];
        return GethService.buildByUserInput(args.network, ports, args.installDir + "/geth");

      case "BesuService":
        ports = [
          new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
          new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", args.port ? args.port : 8545, 8545, servicePortProtocol.tcp),
          new ServicePort("127.0.0.1", 8546, 8546, servicePortProtocol.tcp),
        ];
        return BesuService.buildByUserInput(args.network, ports, args.installDir + "/besu");

      case "NethermindService":
        ports = [
          new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
          new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", args.port ? args.port : 8545, 8545, servicePortProtocol.tcp),
          new ServicePort("127.0.0.1", 8546, 8546, servicePortProtocol.tcp),
        ];
        return NethermindService.buildByUserInput(args.network, ports, args.installDir + "/nethermind");

      case "ErigonService":
        ports = [
          new ServicePort(null, 30303, 30303, servicePortProtocol.tcp),
          new ServicePort(null, 30303, 30303, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", args.port ? args.port : 8545, 8545, servicePortProtocol.tcp),
          new ServicePort("127.0.0.1", 8546, 8546, servicePortProtocol.tcp),
        ];
        return ErigonService.buildByUserInput(args.network, ports, args.installDir + "/erigon");

      case "LighthouseBeaconService":
        ports = [
          new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
          new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", args.port ? args.port : 5052, 5052, servicePortProtocol.tcp),
        ];
        return LighthouseBeaconService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/lighthouse",
          args.executionClients,
          args.mevboost ? args.mevboost : [],
          args.checkpointURL
        );

      case "LighthouseValidatorService":
        ports = [new ServicePort("127.0.0.1", args.port ? args.port : 5062, 5062, servicePortProtocol.tcp)];
        return LighthouseValidatorService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/lighthouse",
          args.beaconServices
        );

      case "PrysmBeaconService":
        ports = [
          new ServicePort(null, 13001, 13001, servicePortProtocol.tcp),
          new ServicePort(null, 12001, 12001, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", 4000, 4000, servicePortProtocol.tcp),
          new ServicePort("127.0.0.1", args.port ? args.port : 3500, 3500, servicePortProtocol.tcp),
        ];
        return PrysmBeaconService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/prysm",
          args.executionClients,
          args.mevboost ? args.mevboost : [],
          args.checkpointURL
        );

      case "PrysmValidatorService":
        ports = [new ServicePort("127.0.0.1", args.port ? args.port : 7500, 7500, servicePortProtocol.tcp)];
        return PrysmValidatorService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/prysm",
          args.beaconServices
        );

      case "LodestarBeaconService":
        //LodestarBeaconService
        ports = [
          new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
          new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", args.port ? args.port : 9596, 9596, servicePortProtocol.tcp),
        ];
        return LodestarBeaconService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/lodestar",
          args.executionClients,
          args.mevboost ? args.mevboost : [],
          args.checkpointURL
        );

      case "LodestarValidatorService":
        //LodestarValidatorService
        ports = [new ServicePort("127.0.0.1", args.port ? args.port : 5062, 5062, servicePortProtocol.tcp)];
        return LodestarValidatorService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/lodestar",
          args.beaconServices
        );

      case "NimbusBeaconService":
        ports = [
          new ServicePort(null, 9000, 9000, servicePortProtocol.tcp),
          new ServicePort(null, 9000, 9000, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", args.port ? args.port : 5052, 5052, servicePortProtocol.tcp),
        ];
        return NimbusBeaconService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/nimbus",
          args.executionClients,
          args.mevboost ? args.mevboost : [],
          args.checkpointURL
        );

      case "NimbusValidatorService":
        ports = [];
        return NimbusValidatorService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/nimbus",
          args.beaconServices
        );

      case "TekuBeaconService":
        ports = [
          new ServicePort(null, 9001, 9001, servicePortProtocol.tcp),
          new ServicePort(null, 9001, 9001, servicePortProtocol.udp),
          new ServicePort("127.0.0.1", 5052, 5052, servicePortProtocol.tcp),
          new ServicePort("127.0.0.1", args.port ? args.port : 5051, 5051, servicePortProtocol.tcp),
        ];
        return TekuBeaconService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/teku",
          args.executionClients,
          args.mevboost ? args.mevboost : [],
          args.checkpointURL
        );

      case "TekuValidatorService":
        ports = [];
        return TekuValidatorService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/teku",
          args.beaconServices
        );

      case "PrometheusNodeExporterService":
        return PrometheusNodeExporterService.buildByUserInput(args.network);

      case "PrometheusService":
        ports = [new ServicePort("127.0.0.1", args.port ? args.port : 9090, 9090, servicePortProtocol.tcp)];
        return PrometheusService.buildByUserInput(args.network, ports, args.installDir + "/prometheus");

      case "GrafanaService":
        ports = [new ServicePort("127.0.0.1", args.port ? args.port : 3000, 3000, servicePortProtocol.tcp)];
        return GrafanaService.buildByUserInput(args.network, ports, args.installDir + "/grafana");

      case "FlashbotsMevBoostService":
        return FlashbotsMevBoostService.buildByUserInput(args.network, args.relays);

      case "Web3SignerService":
        return Web3SignerService.buildByUserInput(args.network, [], args.installDir + "/web3signer");

      case "NotificationService":
        return NotificationService.buildByUserInput(args.network, args.installDir + "/notification");

      case "ValidatorEjectorService":
        return ValidatorEjectorService.buildByUserInput(args.network, args.installDir + "/validatorejector");

      case "KeysAPIService":
        ports = [new ServicePort("127.0.0.1", 3600, 3600, servicePortProtocol.tcp)];
        return KeysAPIService.buildByUserInput(args.network, ports);

      case "SSVNetworkService":
        ports = [
          new ServicePort(null, 12000, 12000, servicePortProtocol.udp),
          new ServicePort(null, 13000, 13000, servicePortProtocol.tcp),
        ];
        return SSVNetworkService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/ssv_network",
          args.executionClients,
          args.beaconServices
        );
      case "CharonService":
        ports = [
          new ServicePort(null, 3610, 3610, servicePortProtocol.tcp),
        ];
        return CharonService.buildByUserInput(
          args.network,
          ports,
          args.installDir + "/charon",
          args.beaconServices
        );
    }
  }

  async createCachingDB(keyAPI) {
    try {
      const dbPass = StringUtils.createRandomString();
      const dbUser = "postgres";
      const dbName = "node_operator_keys_service_db";
      await this.nodeConnection.sshService.exec(
        `docker run --name=cachingDB-${keyAPI.id} --network=stereum -d -e POSTGRES_PASSWORD=${dbPass} -e POSTGRES_USER=${dbUser} -e POSTGRES_DB=${dbName} postgres`
      );
      keyAPI.env.DB_NAME = dbName;
      keyAPI.env.DB_USER = dbUser;
      keyAPI.env.DB_PASSWORD = dbPass;

      keyAPI.env.DB_HOST = `cachingDB-${keyAPI.id}`;
    } catch (err) {
      log.error("Creating CachingDB failed: ", err);
      await this.nodeConnection.sshService.exec(
        `docker stop cachingDB-${keyAPI.id} && docker rm cachingDB-${keyAPI.id}`
      );
    }
  }

  async initKeysAPI(services) {
    for (const service of services) {
      await this.createCachingDB(service);
      await this.nodeConnection.writeServiceConfiguration(service.buildConfiguration());
    }
  }

  async createSlashingDB(web3signer, workingDir) {
    try {
      const dbPass = StringUtils.createRandomString();
      const dbUser = "postgres";
      const dbName = "web3signer";
      await this.nodeConnection.sshService.exec(
        `docker run --name=slashingdb-${web3signer.id} --network=stereum -v ${workingDir}/postgresql:/opt/app/schemas -d -e POSTGRES_PASSWORD=${dbPass} -e POSTGRES_USER=${dbUser} -e POSTGRES_DB=${dbName} postgres`
      );
      const schemas = await this.nodeConnection.sshService.exec(`sleep 10s && ls -1 ${workingDir}/postgresql`);
      for (const schema of schemas.stdout.split("\n").filter((s) => s)) {
        log.info("loading " + schema + " schema...");
        const result = await this.nodeConnection.sshService.exec(
          `docker exec -u 0 -w /opt/app/schemas slashingdb-${web3signer.id} psql --echo-all --host=localhost --port=5432 --dbname=web3signer --username=postgres -f ${schema}`
        );
        log.info(`\nstdout: ${result.stdout}\nstderr: ${result.stderr}\n`);
      }
      web3signer.command.push(
        "--slashing-protection-enabled=true",
        `--slashing-protection-db-url=jdbc:postgresql://slashingdb-${web3signer.id}/${dbName}`,
        `--slashing-protection-db-username=${dbUser}`,
        `--slashing-protection-db-password=${dbPass}`,
        "--slashing-protection-pruning-enabled=true"
      );
    } catch (err) {
      log.error("Creating SlashingDB failed: ", err);
      await this.nodeConnection.sshService.exec(
        `docker stop slashingdb-${web3signer.id} && docker rm slashingdb-${web3signer.id}`
      );
    }
  }

  async initWeb3Signer(services) {
    for (const service of services) {
      await this.manageServiceState(service.id, "started");
      const workingDir = this.getWorkindDir(service);
      await this.nodeConnection.sshService.exec(
        "docker cp stereum-" + service.id + ":/opt/web3signer/migrations/postgresql " + workingDir
      );
      await this.manageServiceState(service.id, "stopped");
      service.command = service.command.filter((c) => c != "--slashing-protection-enabled=false");
      await this.createSlashingDB(service, workingDir);
      await this.nodeConnection.writeServiceConfiguration(service.buildConfiguration());
    }
  }

  async createKeystores(services) {
    for (const service of services) {
      if (service.service === "NimbusValidatorService" || (service.service === "NimbusBeaconService" && service.configVersion < 2)) {
        const valDir = service.volumes.find((vol) => vol.servicePath === "/opt/app/validators").destinationPath;
        const token = StringUtils.createRandomString();
        await this.nodeConnection.sshService.exec(`mkdir -p ${valDir}`);
        await this.nodeConnection.sshService.exec(`echo ${token} > ${valDir}/api-token.txt`);
      } else if (service.service === "TekuValidatorService" || (service.service === "TekuBeaconService" && service.configVersion < 2)) {
        const dataDir = service.volumes.find((vol) => vol.servicePath === "/opt/app/data").destinationPath;
        const password = StringUtils.createRandomString();
        await this.nodeConnection.sshService.exec("apt install -y openjdk-8-jre-headless");
        await this.nodeConnection.sshService.exec(`mkdir -p ${dataDir}`);
        await this.nodeConnection.sshService.exec(`echo ${password} > ${dataDir}/teku_api_password.txt`);
        await this.nodeConnection.sshService.exec(
          `cd ${dataDir} && keytool -genkeypair -keystore teku_api_keystore -storetype PKCS12 -storepass ${password} -keyalg RSA -keysize 2048 -validity 109500 -dname "CN=teku, OU=MyCompanyUnit, O=MyCompany, L=MyCity, ST=MyState, C=AU" -ext "SAN=DNS:stereum-${service.id}"`
        );
      } else if (service.service.includes("SSVNetwork")) {
        await this.nodeConnection.runPlaybook("ssv-key-generator", {
          stereum_role: "ssv-key-generator",
          ssv_key_service: service.id,
        });
        const config = await this.nodeConnection.readServiceConfiguration(service.id);
        let ssvConfig = service.getServiceConfiguration(
          service.network,
          service.dependencies.executionClients,
          service.dependencies.consensusClients
        );

        // prepare service's config file
        const dataDir = service.volumes.find((vol) => vol.servicePath === "/data").destinationPath;
        const escapedConfigFile = StringUtils.escapeStringForShell(
          ssvConfig.replace(/^OperatorPrivateKey.*/gm, 'OperatorPrivateKey: "' + config.ssv_sk + '"')
        );
        this.nodeConnection.sshService.exec(
          `mkdir -p ${dataDir} && echo ${escapedConfigFile} > ${dataDir}/config.yaml`
        );
      }
    }
  }

  async addServices(tasks, services) {
    let newServices = [];
    let ELInstalls = tasks.filter((t) => t.service.category === "execution");
    ELInstalls.forEach((t) => {
      let service = this.getService(t.service.service, t.data);
      t.service.config.serviceID = service.id;
      newServices.push(service);
    });
    let CLInstalls = tasks.filter((t) => t.service.category === "consensus");
    CLInstalls.forEach((t) => {
      if (t.data.executionClients.length > 0) {
        t.data.executionClients = t.data.executionClients.map((ec) => {
          let id = ec.config.serviceID;
          if (id) {
            return services.find((s) => s.id === id);
          }
          id = ELInstalls.find((el) => el.service.id === ec.id).service.config.serviceID;
          return newServices.find((s) => s.id === id);
        });
      }
      let service = this.getService(t.service.service, t.data);
      t.service.config.serviceID = service.id;
      newServices.push(service);
    });
    let VLInstalls = tasks.filter((t) => t.service.category === "validator");
    VLInstalls.forEach((t) => {
      if (t.data.beaconServices.length > 0) {
        t.data.beaconServices = t.data.beaconServices.map((bc) => {
          let id = bc.config.serviceID;
          if (id) {
            return services.find((s) => s.id === id);
          }
          id = CLInstalls.find((el) => el.service.id === bc.id).service.config.serviceID;
          return newServices.find((s) => s.id === id);
        });
      }
      let service = this.getService(t.service.service, t.data);
      t.service.config.serviceID = service.id;
      newServices.push(service);
    });
    let PInstalls = tasks.filter((t) => t.service.category === "service");
    PInstalls.forEach((t) => {
      if (t.data.beaconServices.length > 0 && t.service.service === "FlashbotsMevBoostService") {
        t.data.beaconServices = t.data.beaconServices.map((bc) => {
          let id = bc.config.serviceID;
          if (id) {
            return services.find((s) => s.id === id);
          }
          id = CLInstalls.find((el) => el.service.id === bc.id).service.config.serviceID;
          return newServices.find((s) => s.id === id);
        });
      }
      let service = this.getService(t.service.service, t.data);
      if (t.data.beaconServices.length > 0 && t.service.service === "FlashbotsMevBoostService") {
        let changed = this.addDependencies(service, t.data.beaconServices);
        changed.forEach((dep) => {
          let index = newServices.findIndex((s) => s.id === dep.id);
          if (index != -1) {
            newServices[index] = dep;
          } else {
            newServices.push(dep);
          }
        });
      }
      newServices.push(service);
    });

    let allPorts = services
      .map((s) => s.ports)
      .flat(1)
      .map((p) => p.destinationPort + "/" + p.servicePortProtocol);
    let changed;
    do {
      changed = false;
      newServices.forEach((service) => {
        service.ports.forEach((newPort) => {
          if (
            allPorts.includes(newPort.destinationPort + "/" + newPort.servicePortProtocol) &&
            !services.map((s) => s.id).includes(service.id)
          ) {
            newPort.destinationPort++;
            changed = true;
          }
        });
      });
    } while (changed === true);

    await this.createKeystores(
      newServices.filter(
        (s) => s.service.includes("Teku") || s.service.includes("Nimbus") || s.service.includes("SSVNetwork")
      )
    );
    let versions;
    try {
      versions = await this.nodeConnection.checkUpdates();
    } catch (err) {
      log.error(`Couldn't fetch versions in OneClickInstallation...
      Installing with predefined Versions
      ${err.name}: ${err.message}
      url: ${err.config.url}
      method: ${err.config.method}
      headers: ${err.config.headers}
      timeout: ${err.config.timeout}
      `);
    }
    newServices.forEach((service) => {
      if (versions[service.network] && versions[service.network][service.service]) {
        service.imageVersion = versions[service.network][service.service].slice(-1).pop();
      } else if (versions["mainnet"] && versions["mainnet"][service.service]) {
        service.imageVersion = versions["mainnet"][service.service].slice(-1).pop();
      } else if (versions["prater"] && versions["prater"][service.service]) {
        service.imageVersion = versions["prater"][service.service].slice(-1).pop();
      }
    });

    await Promise.all(
      newServices.map(async (service) => {
        await this.nodeConnection.writeServiceConfiguration(service.buildConfiguration());
      })
    );
    await this.initWeb3Signer(newServices.filter((s) => s.service === "Web3SignerService"));
    await this.initKeysAPI(newServices.filter((s) => s.service === "KeysAPIService"));
    return ELInstalls.concat(CLInstalls, VLInstalls);
  }

  //make sure there are no double tasks (for example: TekuBeaconService, TekuValidatorService share the same id)
  static uniqueByID(job) {
    return (value, index, self) =>
      self.map((t) => t.service.config.serviceID).indexOf(value.service.config.serviceID) === index &&
      value.content === job;
  }

  //remove all service data
  async removeServiceData(services) {
    services = [].concat(services);
    for (const service of services) {
      if (service.volumes.length > 0) {
        //get service data path
        let path = this.getWorkindDir(service);
        await this.nodeConnection.sshService.exec("rm -rf " + path);
      }
    }
  }

  changeNetworkCommand(newNetwork, service) {
    let command = service.command;
    let isString = false;
    if (typeof command === "string") {
      isString = true;
      command = command.replaceAll(/\n/gm, "").replaceAll(/\s\s+/gm, " ").split(" ");
    }
    if (service.service === "FlashbotsMevBoostService") {
      command = service.entrypoint;
      let index = command.findIndex((c) => /^-(mainnet|prater|goerli$)/.test(c));
      command[index] = "-" + newNetwork;
      index = command.findIndex((c) => c === "-relays") + 1;
      command[index] = '""';
    } else if (service.service === "PrysmBeaconService") {
      let index = command.findIndex((c) => /--(mainnet|prater|goerli)/.test(c));
      command[index] = "--" + newNetwork;
      if (newNetwork === "mainnet" && command.includes("--genesis-state=/opt/app/genesis/prysm-prater-genesis.ssz")) {
        command.splice(command.indexOf("--genesis-state=/opt/app/genesis/prysm-prater-genesis.ssz"), 1);
      } else if (
        !newNetwork === "mainnet" &&
        !command.includes("--genesis-state=/opt/app/genesis/prysm-prater-genesis.ssz")
      ) {
        command.push("--genesis-state=/opt/app/genesis/prysm-prater-genesis.ssz");
      }
    } else {
      command = command.map((c) => {
        if (/mainnet|prater|goerli/.test(c)) {
          c = c.replace(/mainnet|prater|goerli/, newNetwork);
        }
        return c;
      });
    }
    if (isString) return command.join(" ").trim();
    return command;
  }

  async changeNetwork(newNetwork, services) {
    await this.removeServiceData(services);
    for (let service of services) {
      if (service.service === "FlashbotsMevBoostService") {
        service.entrypoint = this.changeNetworkCommand(newNetwork, service);
      } else {
        service.command = this.changeNetworkCommand(newNetwork, service);
      }
      service.network = newNetwork;
    }
    await this.createKeystores(services);
    await Promise.all(
      services.map(async (service) => {
        await this.nodeConnection.writeServiceConfiguration(service.buildConfiguration());
      })
    );
  }

  async handleServiceChanges(tasks) {
    let jobs = tasks.map((t) => t.content);
    if (jobs.includes("DELETE")) {
      let services = await this.readServiceConfigurations();
      let before = this.nodeConnection.getTimeStamp();
      try {
        await Promise.all(
          tasks.filter(ServiceManager.uniqueByID("DELETE")).map((task, index, tasks) => {
            return this.deleteService(task, tasks, services);
          })
        );
      } catch (err) {
        log.error("Deleting Services Failed:", err);
      } finally {
        let after = this.nodeConnection.getTimeStamp();
        await this.nodeConnection.restartServices(after - before);
      }
    }
    let newInstallTasks = [];
    if (jobs.includes("INSTALL")) {
      try {
        let services = await this.readServiceConfigurations();
        let installTasks = tasks.filter((t) => t.content === "INSTALL");
        newInstallTasks = await this.addServices(installTasks, services);
      } catch (err) {
        log.error("Installing Services Failed:", err);
      }
    }
    if (jobs.includes("MODIFY")) {
      try {
        let services = await this.readServiceConfigurations();
        let modifyTasks = tasks.filter((t) => t.content === "MODIFY");
        await this.modifyServices(modifyTasks, services, newInstallTasks);
      } catch (err) {
        log.error("Modifying Services Failed:", err);
      }
    }
    if (jobs.includes("CHANGE NETWORK")) {
      let before = this.nodeConnection.getTimeStamp();
      let services = await this.readServiceConfigurations();
      try {
        let changeNetworkTask = tasks.find((t) => t.content === "CHANGE NETWORK");
        await this.changeNetwork(
          changeNetworkTask.data.network,
          services.filter((s) => s.service !== "SSVNetworkService")
        );
      } catch (err) {
        log.error("Changing Network Failed:", err);
      } finally {
        let after = this.nodeConnection.getTimeStamp();
        await this.nodeConnection.restartServices(after - before);
      }
    }
  }

  async exportConfig() {
    let arrayOfServices = await this.nodeConnection.listServicesConfigurations();
    let serviceNameConfig = [];
    console.log(arrayOfServices)
    for (let i = 0; i < arrayOfServices.length - 1; i++) {
      let serviceObject = await this.nodeConnection.readServiceYAML(arrayOfServices[i]);

      const exportObject = {
        filename: arrayOfServices[i],
        content: serviceObject,
      };
      serviceNameConfig.push(exportObject);
    }
    return serviceNameConfig;
  }

  async importConfig(configFiles, removedServices, checkPointSync) {
    let consensusClients = []
    //remove existing config files
    await this.nodeConnection.sshService.exec(`rm -rf /etc/stereum && mkdir -p /etc/stereum/services`);

    //write config files
    for (let file of configFiles.concat(removedServices)) {
      await this.nodeConnection.writeServiceYAML({ id: file.id, data: file.content, service: file.service });
      if (file.category === "consensus") {
        consensusClients.push(file.id)
      }
    }
    let services = await this.readServiceConfigurations();

    for (let serviceToDelete of removedServices) {
      let dependents = [];
      services.forEach((service) => {
        for (const dependency in service.dependencies) {
          service.dependencies[dependency].forEach((s) => {
            if (s.id === serviceToDelete.id) dependents.push(service);
          });
        }
      });
      dependents.forEach((service) => {
        this.removeDependencies(service, serviceToDelete);
      });
      services = services.filter(s => s.id !== serviceToDelete.id)
    }

    //Add or Remove Checkpoint Sync
    for (let service of services.filter(s => consensusClients.includes(s.id))) {
      this.updateSyncCommand(service, checkPointSync)
    }

    // create stereum config file
    await this.nodeConnection.sshService.exec(`rm -rf /etc/stereum && mkdir -p /etc/stereum/services`);
    const settings = {
      stereum_settings: {
        settings: {
          controls_install_path: "/opt/stereum",
          updates: {
            lane: "stable",
            unattended: {
              install: false,
            },
          },
        },
      },
    };
    await this.nodeConnection.sshService.exec(
      `echo -e ${StringUtils.escapeStringForShell(YAML.stringify(settings))} > /etc/stereum/stereum.yaml`
    );

    //prepare node
    await this.nodeConnection.findStereumSettings();
    await this.nodeConnection.prepareStereumNode(this.nodeConnection.settings.stereum.settings.controls_install_path);

    await Promise.all(
      services.map(async (service) => {
        await this.nodeConnection.writeServiceConfiguration(service.buildConfiguration());
      })
    );

    await this.createKeystores(services);

    // start service
    const runRefs = [];
    if (services[0] !== undefined) {
      await Promise.all(
        services.map(async (service, index) => {
          Sleep(index * 1000).then(() => runRefs.push(this.manageServiceState(service.id, "started")));
        })
      );
    }
    return runRefs;
  }
}