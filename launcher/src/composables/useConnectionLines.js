import { useServices } from "@/store/services";
import { ref } from "vue";

export function useConnectionLines() {
  const serviceStore = useServices();
  const activeConnections = ref([]);

  const createConnection = (from, to, fromPosition = "right", toPosition = "left") => ({
    start: {
      element: from,
      position: fromPosition,
    },
    end: {
      element: to,
      position: toPosition,
    },
  });

  const findDependenciesByType = (item) => {
    const filterByExecutionDependency = (service) =>
      service.config?.dependencies?.executionClients?.some((d) => d.id === item.config?.serviceID);

    const filterByConsensusDependency = (service) =>
      service.config?.dependencies?.consensusClients?.some((d) => d.id === item.config?.serviceID);

    const filterByItemExecutionDependency = (service) =>
      item.config?.dependencies?.executionClients?.some((d) => d.id === service.config?.serviceID);

    const filterByItemConsensusDependency = (service) =>
      item.config?.dependencies?.consensusClients?.some((d) => d.id === service.config?.serviceID);

    return {
      execution: () =>
        serviceStore.installedServices.filter(
          (s) => s.config?.dependencies?.executionClients?.length > 0 && filterByExecutionDependency(s)
        ),

      consensus: () =>
        serviceStore.installedServices.filter(
          (s) =>
            (s.config?.dependencies?.consensusClients?.length > 0 && filterByConsensusDependency(s)) || filterByItemExecutionDependency(s)
        ),

      validator: () =>
        serviceStore.installedServices.filter(
          (s) => filterByItemExecutionDependency(s) || filterByItemConsensusDependency(s) || filterByConsensusDependency(s)
        ),
    };
  };

  const handleConnectionsByCategory = {
    execution: (item, dependencies) => {
      return dependencies.filter((d) => d.category === "consensus").map((d) => createConnection(item.ref, d.ref));
    },

    consensus: (item, dependencies) => {
      return dependencies.flatMap((d) => {
        if (d.category === "validator") {
          return [createConnection(item.ref, d.ref)];
        }
        if (d.category === "execution") {
          return [createConnection(d.ref, item.ref)];
        }
        return [];
      });
    },

    validator: (item, dependencies) => {
      return dependencies.flatMap((d) => {
        if (d.category === "validator") {
          if (item.service === "CharonService") {
            return [createConnection(item.ref, d.ref, "left", "left")];
          }
          return [createConnection(d.ref, item.ref, "left", "left")];
        }
        if (d.category === "execution" || d.category === "consensus") {
          return [createConnection(d.ref, item.ref)];
        }
        return [];
      });
    },
  };

  const lineDrawHandler = (item) => {
    if (!item) return;

    if (item.displayPluginMenu) {
      removeConnectionLines();
      return;
    }

    try {
      const dependencyFinder = findDependenciesByType(item);
      const categoryHandler = handleConnectionsByCategory[item.category];

      if (!dependencyFinder || !categoryHandler) {
        console.warn(`Unsupported category: ${item.category}`);
        return;
      }

      const dependencies = dependencyFinder[item.category]();
      const connections = categoryHandler(item, dependencies);

      activeConnections.value = connections.map((conn, index) => ({
        id: `connection-${index}`,
        ...conn,
      }));
    } catch (error) {
      console.error("Error handling connection lines:", error);
      removeConnectionLines();
    }
  };

  const removeConnectionLines = () => {
    activeConnections.value = [];
  };

  return {
    activeConnections,
    lineDrawHandler,
    removeConnectionLines,
  };
}
