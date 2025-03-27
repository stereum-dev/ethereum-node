import { ref, computed, watch } from "vue";

export function useSetupConnection(setupStore, serviceStore, emit) {
  const selectedOpNode = ref(null);
  const selectedSetup = ref(null);
  const currentStep = ref(1);
  const totalSteps = 3;
  const animateNextClicked = ref(false);
  const isLoading = ref(false);
  const selectedConsensusServices = ref([]);
  const selectedExecutionServices = ref([]);
  const initialConsensusServices = ref([]);
  const initialExecutionServices = ref([]);

  const getOpNodeFromOpSetup = computed(() => {
    return setupStore.selectedOPSetup?.services?.filter(
      (service) => service.category === "consensus" && service.service === "OpNodeBeaconService"
    );
  });

  const filteredSetups = computed(() => {
    return setupStore.allSetups.filter((setup) => {
      const setupNameLower = setup.setupName.toLowerCase();
      if (setupNameLower === "commonservices" || setupNameLower.includes("op")) return false;

      const hasExecution = setup.services.some((service) => service.category === "execution");
      const hasConsensus = setup.services.some((service) => service.category === "consensus");

      return hasExecution && hasConsensus;
    });
  });

  const serviceGroups = computed(() => {
    if (!selectedSetup.value || !selectedOpNode.value) return [];

    const groups = [];
    const consensusServices = selectedSetup.value.services.filter(
      (service) => service.category === "consensus" && service.service !== "OpNodeBeaconService"
    );

    consensusServices.forEach((consensus) => {
      const connectedExecutions = [];

      if (consensus.config?.dependencies?.executionClients) {
        consensus.config.dependencies.executionClients.forEach((execDep) => {
          const executionService = selectedSetup.value.services.find(
            (service) => service.category === "execution" && service.service === execDep.service && service.config?.serviceID === execDep.id
          );

          if (executionService) {
            connectedExecutions.push(executionService);
          }
        });
      }

      if (connectedExecutions.length === 0) {
        const executionServices = selectedSetup.value.services.filter((service) => service.category === "execution");
        connectedExecutions.push(...executionServices);
      }

      if (connectedExecutions.length > 0) {
        groups.push({
          consensus,
          executions: connectedExecutions,
          setupId: selectedSetup.value.setupId,
        });
      }
    });

    return groups;
  });

  const hasChanges = computed(() => {
    const initialConsensusIds = initialConsensusServices.value.map((service) => service.config.serviceID).sort();
    const currentConsensusIds = selectedConsensusServices.value.map((service) => service.config.serviceID).sort();

    const initialExecutionIds = initialExecutionServices.value.map((service) => service.config.serviceID).sort();
    const currentExecutionIds = selectedExecutionServices.value.map((service) => service.config.serviceID).sort();

    return !(
      initialConsensusIds.length === currentConsensusIds.length &&
      initialConsensusIds.every((value, index) => value === currentConsensusIds[index]) &&
      initialExecutionIds.length === currentExecutionIds.length &&
      initialExecutionIds.every((value, index) => value === currentExecutionIds[index])
    );
  });

  const canProceed = computed(() => {
    if (currentStep.value === 1) return !!selectedOpNode.value;
    if (currentStep.value === 2) return !!selectedSetup.value;
    if (currentStep.value === 3) return hasChanges.value;
    return false;
  });

  const currentSubTitle = computed(() => {
    if (currentStep.value === 1) return "Choose Operation Node";
    if (currentStep.value === 2) return "Choose Setup Configuration";
    if (currentStep.value === 3) return "Choose Services to Connect";
    return "";
  });

  const goBack = () => {
    if (currentStep.value > 1) {
      animateNextClicked.value = true;
      setTimeout(() => {
        currentStep.value--;
        setTimeout(() => {
          animateNextClicked.value = false;
        });
      }, 200);
    }
  };
  const handleNextOrConfirmAction = () => {
    if (currentStep.value === totalSteps) {
      if (!hasChanges.value) return;

      isLoading.value = true;

      const existingConsensusConnections = [];
      const existingExecutionConnections = [];

      if (selectedOpNode.value?.config?.dependencies) {
        const deps = selectedOpNode.value.config.dependencies;

        deps.consensusClients.forEach((client) => {
          const service = serviceStore.installedServices.find((s) => s.config.serviceID === client.id);

          if (service && service.setupId !== selectedSetup.value.setupId) {
            existingConsensusConnections.push(service);
          }
        });

        deps.executionClients.forEach((client) => {
          const service = serviceStore.installedServices.find((s) => s.config.serviceID === client.id);

          if (service && service.setupId !== selectedSetup.value.setupId) {
            existingExecutionConnections.push(service);
          }
        });
      }

      const restructuredData = {
        client: selectedOpNode.value,
        consensusClients: [...selectedConsensusServices.value, ...existingConsensusConnections],
        executionClients: [...selectedExecutionServices.value, ...existingExecutionConnections],
        otherServices: [],
      };

      setTimeout(() => {
        isLoading.value = false;
        setupStore.isConnectSetupModalActive = false;
        emit("confirmAction", restructuredData);
      }, 1000);
    } else {
      animateNextClicked.value = true;
      setTimeout(() => {
        if (currentStep.value < totalSteps && canProceed.value) {
          currentStep.value++;
          if (currentStep.value === 3) {
            initializeSelectedServices();
          }
        }
        setTimeout(() => {
          animateNextClicked.value = false;
        }, 100);
      }, 1000);
    }
  };

  const isOpNodeSelected = (node) => selectedOpNode.value?.id === node.id;

  const toggleOpNodeSelection = (node) => {
    selectedOpNode.value = isOpNodeSelected(node) ? null : node;
  };

  const isSetupSelected = (setup) => selectedSetup.value?.setupId === setup.setupId;

  const selectSetup = (setup) => {
    selectedSetup.value = setup;
  };

  const isServiceSelected = (service) => {
    if (service.category === "consensus") {
      return selectedConsensusServices.value.some((s) => s.config.serviceID === service.config.serviceID);
    } else if (service.category === "execution") {
      return selectedExecutionServices.value.some((s) => s.config.serviceID === service.config.serviceID);
    }
    return false;
  };

  const toggleConsensusSelection = (group) => {
    const consensus = group.consensus;
    const index = selectedConsensusServices.value.findIndex((s) => s.config.serviceID === consensus.config.serviceID);

    if (index === -1) {
      selectedConsensusServices.value.push(consensus);
    } else {
      selectedConsensusServices.value.splice(index, 1);

      group.executions.forEach((execution) => {
        const execIndex = selectedExecutionServices.value.findIndex((s) => s.config.serviceID === execution.config.serviceID);
        if (execIndex !== -1) {
          selectedExecutionServices.value.splice(execIndex, 1);
        }
      });
    }
  };

  const toggleExecutionSelection = (group, execution) => {
    if (!isServiceSelected(group.consensus)) return;

    const index = selectedExecutionServices.value.findIndex((s) => s.config.serviceID === execution.config.serviceID);

    if (index === -1) {
      selectedExecutionServices.value.push(execution);
    } else {
      selectedExecutionServices.value.splice(index, 1);
    }
  };

  const initializeSelectedServices = () => {
    selectedConsensusServices.value = [];
    selectedExecutionServices.value = [];
    initialConsensusServices.value = [];
    initialExecutionServices.value = [];

    if (!selectedOpNode.value || !selectedOpNode.value.config?.dependencies) return;

    const deps = selectedOpNode.value.config.dependencies;

    serviceGroups.value.forEach((group) => {
      const consensusInDeps = deps.consensusClients.some(
        (client) => client.service === group.consensus.service && client.id === group.consensus.config?.serviceID
      );

      if (consensusInDeps) {
        selectedConsensusServices.value.push(group.consensus);
        initialConsensusServices.value.push(group.consensus);
      }

      group.executions.forEach((execution) => {
        if (deps.executionClients.some((client) => client.service === execution.service && client.id === execution.config?.serviceID)) {
          selectedExecutionServices.value.push(execution);
          initialExecutionServices.value.push(execution);
        }
      });
    });
  };

  const closeWindow = () => {
    emit("closeWindow");
  };

  watch([selectedSetup, selectedOpNode], () => {
    if (selectedSetup.value && selectedOpNode.value && currentStep.value === 3) {
      initializeSelectedServices();
    }
  });

  return {
    selectedOpNode,
    selectedSetup,
    currentStep,
    animateNextClicked,
    isLoading,
    getOpNodeFromOpSetup,
    filteredSetups,
    serviceGroups,
    canProceed,
    currentSubTitle,
    hasChanges,
    isOpNodeSelected,
    toggleOpNodeSelection,
    isSetupSelected,
    selectSetup,
    isServiceSelected,
    toggleConsensusSelection,
    toggleExecutionSelection,
    handleNextOrConfirmAction,
    goBack,
    closeWindow,
  };
}
