<template>
  <div class="select-service-widget-parent flex flex-col w-full h-full justify-center items-center">
    <div v-if="servicePairs?.length === 0" class="wrapper flex w-full h-full justify-center items-center relative">
      <NoData />
    </div>

    <template v-else>
      <div class="h-1/2 w-full justify-center items-center flex p-1">
        <div class="selector-services w-full h-full flex rounded-md border border-gray-500" @click="toggleDropdown">
          <div class="selected-service-name flex justify-center items-center w-[90%] h-full text-gray-200 text-2xs font-semibold uppercase">
            {{ selectedServiceLabel }}
          </div>

          <div class="arrow-box flex justify-center items-center w-[10%] h-full text-gray-200 text-lg font-semibold uppercase">
            <ServiceArrow direction="next" :class="{ 'rotate-[270deg]': isOpen, 'rotate-90': !isOpen }" class="z-10" />
          </div>
        </div>

        <transition
          enter-active-class="fade-slide transition duration-500 ease-custom"
          enter-class="-translate-y-1/2 scale-y-0 opacity-0"
          enter-to-class="translate-y-0 scale-y-100 opacity-100"
          leave-active-class="fade-slide transition duration-300 ease-custom"
          leave-class="translate-y-0 scale-y-100 opacity-100"
          leave-to-class="-translate-y-1/2 scale-y-0 opacity-0"
        >
          <div
            v-if="isOpen"
            class="absolute top-[25%] z-20 min-h-20 mt-1 origin-top-right shadow-md bg-gray-200 transition-all duration-100 divide-y divide-gray-600 shadow-black rounded-md p-1 w-[24%]"
          >
            <DropdownOption text="EXECUTION & CONSENSUS CLIENTS" @select="servicePicker('exeCons')" />
            <DropdownOption text="VALIDATOR CLIENT" @select="servicePicker('vld')" />
            <DropdownOption v-if="selectedLCOMService" text="LIDO CSM OPERATOR" @select="servicePicker('csm')" />
          </div>
        </transition>
      </div>

      <div v-if="controlStore.pickedService === 'vld'" class="h-1/2 w-full flex justify-center items-center">
        <ServiceArrow v-if="filteredValidatorServices?.length > 1" direction="prev" class="z-10" @prev="prevValidator" />
        <div class="validator-info w-4/5 h-full flex justify-center items-center">
          <ServiceIcon
            :icon="selectedValidatorService?.icon || '/img/icon/stereum-icons/stereum-logo.png'"
            :alt-text="selectedValidatorService?.name || 'Stereum'"
          />
          <div class="vld-info h-full w-2/6 flex justify-center items-center flex-col">
            <div class="name-val h-full w-2/6 flex justify-center items-center text-2xs text-gray-200 font-semibold">
              {{ selectedValidatorService?.name || "" }}
            </div>
            <div class="id-val h-full w-2/6 flex justify-center items-center text-[60%] text-gray-200">
              {{ selectedValidatorService?.config?.serviceID ? formatServiceId(selectedValidatorService?.config?.serviceID) : "" }}
            </div>
          </div>
          <div class="vld-keys h-1/2 w-2/6 flex justify-center items-center text-gray-200 text-lg font-semibold uppercase">
            {{ formattedValidatorNo }}
          </div>
          <ServiceIcon icon="/img/icon/control-page-icons/key-eth.svg" alt-text="key" />
        </div>
        <ServiceArrow v-if="filteredValidatorServices?.length > 1" direction="next" class="z-10" @next="nextValidator" />
      </div>

      <div v-else-if="controlStore.pickedService === 'exeCons'" class="h-1/2 w-full flex justify-center items-center">
        <ServiceArrow v-if="servicePairs?.length > 1" direction="prev" class="z-10" @prev="prevPair" />
        <div class="pairs-info w-4/5 h-full flex justify-center items-center">
          <ServiceDetails :service="selectedPair?.executionService" service-type="exec" />
          <ServiceDetails :service="selectedPair?.consensusService" service-type="cons" />
        </div>
        <ServiceArrow v-if="servicePairs?.length > 1" direction="next" class="z-10" @next="nextPair" />
      </div>
      <div v-else class="h-1/2 w-full flex justify-center items-center">
        <ServiceArrow v-if="filteredLCOMServices?.length > 1" direction="prev" class="z-10" @prev="prevCSM" />
        <div class="icon-csm w-2/12 h-full flex justify-center items-center">
          <img class="w-3/4" :src="selectedLCOMService?.icon" :alt="selectedLCOMService?.name" />
        </div>
        <div class="id-csm h-full w-8/12 flex justify-center items-center text-[60%] text-gray-200 flex-col">
          <div class="title w-full h-1/2 flex justify-center items-center text-xs text-gray-200 font-semibold">
            {{ selectedLCOMService?.name }}
          </div>
          <div class="title w-full h-1/2 flex justify-center items-center text-xs text-gray-200 font-semibold">
            {{ selectedLCOMService?.config?.serviceID ? formatServiceId(selectedLCOMService.config?.serviceID) : "" }}
          </div>
        </div>
        <ServiceArrow v-if="filteredLCOMServices?.length > 1" direction="next" class="z-10" @next="nextCSM" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useControlStore } from "@/store/theControl";
import { useSetups } from "@/store/setups";
import { useStakingStore } from "@/store/theStaking";

import DropdownOption from "../fragments/DropdownOption.vue";
import ServiceArrow from "../fragments/ServiceArrow.vue";
import ServiceIcon from "../fragments/ServiceIcon.vue";
import ServiceDetails from "../fragments/ServiceDetails.vue";
import NoData from "./NoData.vue";

const controlStore = useControlStore();
const setupStore = useSetups();
const stakingStore = useStakingStore();

const isOpen = ref(false);
const currentIndex = ref(0);
const currentCSMIndex = ref(0);

const selectedServiceLabel = computed(() => {
  return controlStore.pickedService === "exeCons"
    ? "EXECUTION & CONSENSUS CLIENTS"
    : controlStore.pickedService === "vld"
      ? "VALIDATOR CLIENT"
      : "LIDO CSM OPERATOR";
});

onMounted(() => {
  controlStore.pickedService = "exeCons";
});

const servicePairs = computed(() => {
  if (!setupStore.selectedSetup || !setupStore.selectedSetup?.services) {
    return setupStore.allSetups
      .filter((setup) => setup?.services && setup?.services?.length > 0)
      .flatMap((setup) =>
        setup.services
          .filter((service) => service.category === "consensus")
          .flatMap((consensusService) =>
            (consensusService.config?.dependencies?.executionClients || []).map((executionClient) =>
              createServicePair(consensusService, executionClient, setup.services, setup.network)
            )
          )
      );
  }

  const setup = setupStore.selectedSetup;
  if (!setup || !setup?.services) return [];

  return setup.services
    .filter((service) => service.category === "consensus")
    .flatMap((consensusService) =>
      (consensusService.config?.dependencies?.executionClients || []).map((executionClient) =>
        createServicePair(consensusService, executionClient, setup.services, setup.network)
      )
    );
});

const createServicePair = (consensusService, executionClient, services, network) => {
  const executionDetails = services.find(
    (service) => service?.service === executionClient?.service && service.config?.serviceID === executionClient?.id
  ) || { name: executionClient.service, config: { serviceID: executionClient?.id } };

  const consensusDetails =
    services.find(
      (service) => service?.service === consensusService?.service && service.config?.serviceID === consensusService.config?.serviceID
    ) || {};

  return {
    consensusService: formatServiceDetails(consensusService, consensusDetails),
    executionService: { ...executionDetails, id: executionClient.id },
    network,
  };
};

const formatServiceDetails = (service, details) => ({
  service: service.service,
  id: service.config?.serviceID || "",
  name: details.name || "",
  icon: details.icon || "",
  state: details.state || "",
  ports: service.config?.ports || [],
});

const formatServiceId = (id) => (id && id.length >= 7 ? `${id.slice(0, 5)}...${id.slice(-5)}` : id);

const selectedPair = computed(() => servicePairs.value[setupStore.currentPairIndex] || null);

const relatedValidators = computed(() => {
  if (!selectedPair.value?.consensusService) return [];

  const servicesToCheck = setupStore.selectedSetup?.services?.length
    ? setupStore.selectedSetup.services
    : setupStore.allSetups.flatMap((setup) => setup.services || []);

  return servicesToCheck.filter(
    (service) =>
      service.category === "validator" &&
      service.config?.dependencies?.consensusClients?.some(
        (dependency) =>
          dependency.service === selectedPair.value.consensusService.service && dependency.id === selectedPair.value.consensusService.id
      )
  );
});

const allValidatorPairs = computed(() => {
  try {
    const setupsToCheck = setupStore.selectedSetup
      ? [
          {
            network: setupStore.selectedSetup.network,
            services: setupStore.selectedSetup.services || [],
          },
        ]
      : setupStore.allSetups.map((setup) => ({
          network: setup.network,
          services: setup.services || [],
        }));

    const validators = setupsToCheck.flatMap(({ services, network }) => {
      if (!Array.isArray(services)) {
        console.warn(`Services list is missing or malformed in setup with network: ${network || "Unknown"}`);
        return [];
      }
      return services.filter((service) => service.category === "validator");
    });

    return validators.map((validator) => {
      const relatedPairs = servicePairs.value
        ? servicePairs.value.filter((pair) =>
            validator.config?.dependencies?.consensusClients?.some(
              (dependency) => dependency.service === pair.consensusService.service && dependency.id === pair.consensusService.id
            )
          )
        : [];

      if (relatedPairs.length === 0) {
        console.warn(`No related pairs found for validator ${validator.service} in network ${validator.network || "Unknown"}`);
      }

      return {
        validator,
        pairs: relatedPairs.map((pair) => ({
          ...pair,
          network: setupsToCheck.find((setup) => setup.services.includes(validator))?.network || "Unknown",
        })),
        network: setupsToCheck.find((setup) => setup.services.includes(validator))?.network || "Unknown",
      };
    });
  } catch (error) {
    console.error("Error computing allValidatorPairs:", error);
    return [];
  }
});

const filteredValidatorServices = computed(() => {
  const servicesToCheck = setupStore.selectedSetup
    ? setupStore.selectedSetup.services
    : setupStore.allSetups.flatMap((setup) => setup.services || []);

  return servicesToCheck?.filter((service) => service?.category === "validator");
});

const selectedValidatorService = computed(() => {
  return filteredValidatorServices.value?.length > 0 ? filteredValidatorServices.value?.[currentIndex.value] : null;
});

const setupStoreRelatedValidatorPairs = computed(() => {
  if (!selectedValidatorService.value) return null;

  const relatedPairs = allValidatorPairs.value.find((pair) => pair.validator.id === selectedValidatorService.value.id);

  return relatedPairs || null;
});

const filteredLCOMServices = computed(() => {
  const servicesToCheck = setupStore.selectedSetup
    ? setupStore.selectedSetup.services
    : setupStore.allSetups.flatMap((setup) => setup.services || []);

  const filteredServices = servicesToCheck?.filter((service) => service?.service === "LCOMService");

  updateRunningServicesCount(filteredServices);

  return filteredServices;
});

const updateRunningServicesCount = (services) => {
  setupStore.runningServicesCount = services?.filter((service) => service?.state === "running")?.length;
};

const selectedLCOMService = computed(() => {
  return filteredLCOMServices.value?.length > 0 ? filteredLCOMServices.value?.[currentCSMIndex.value] : null;
});

watch(
  () => currentCSMIndex.value,
  (newIndex, oldIndex) => {
    if (newIndex !== oldIndex) {
      setupStore.selectedLCOMService = filteredLCOMServices.value?.[newIndex] || null;
    }
  },
  { immediate: true }
);

const prevCSM = () => {
  if (filteredLCOMServices.value.length) {
    currentCSMIndex.value = (currentCSMIndex.value - 1 + filteredLCOMServices.value.length) % filteredLCOMServices.value.length;
  }
};

const nextCSM = () => {
  if (filteredLCOMServices.value.length) {
    currentCSMIndex.value = (currentCSMIndex.value + 1) % filteredLCOMServices.value.length;
  }
};

watch(
  selectedLCOMService,
  (newPair, oldPair) => {
    if (JSON.stringify(newPair) !== JSON.stringify(oldPair)) {
      setupStore.selectedLCOMService = newPair;
    }
  },
  { immediate: true, deep: true }
);

watch(
  setupStoreRelatedValidatorPairs,
  (newPairs) => {
    setupStore.relatedValidatorPairs = newPairs;
  },
  { immediate: true }
);

watch(
  () => setupStore.selectedSetup,
  (newSetup) => {
    if (newSetup) {
      currentIndex.value = 0;
      currentCSMIndex.value = 0;
    }

    if (controlStore.pickedService === "csm" && !selectedLCOMService.value) {
      controlStore.pickedService = "exeCons";
      isOpen.value = false;
    }
  },
  { immediate: true }
);

const formattedValidatorNo = computed(() => stakingStore.keys.length.toString().padStart(3, "0"));

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (controlStore?.pickedService === "csm" && !selectedLCOMService.value) {
    controlStore.pickedService = "exeCons";
  }
};

const servicePicker = (type) => {
  controlStore.pickedService = type;
  toggleDropdown();
};

const prevPair = () => {
  if (servicePairs.value.length) {
    setupStore.currentPairIndex = (setupStore?.currentPairIndex - 1 + servicePairs.value.length) % servicePairs.value.length;
  }
};

const nextPair = () => {
  if (servicePairs.value.length) {
    setupStore.currentPairIndex = (setupStore?.currentPairIndex + 1) % servicePairs.value.length;
  }
};

const prevValidator = () => {
  if (filteredValidatorServices.value.length) {
    currentIndex.value = (currentIndex.value - 1 + filteredValidatorServices.value.length) % filteredValidatorServices.value.length;
  }
};

const nextValidator = () => {
  if (filteredValidatorServices.value.length) {
    currentIndex.value = (currentIndex.value + 1) % filteredValidatorServices.value.length;
  }
};

watch(
  selectedPair,
  (newPair, oldPair) => {
    if (JSON.stringify(newPair) !== JSON.stringify(oldPair)) {
      setupStore.selectedServicePairs = newPair;
    }
  },
  { immediate: true, deep: true }
);

watch(
  servicePairs,
  (newPairs) => {
    if (setupStore.currentPairIndex >= newPairs.length) {
      setupStore.currentPairIndex = 0;
    }
  },
  { immediate: true }
);

watch(
  () => servicePairs.value.length,
  (newLength) => {
    setupStore.clientPairsLength = newLength;
    if (setupStore?.currentPairIndex >= newLength) {
      setupStore.currentPairIndex = 0;
    }
  },
  { immediate: true }
);

watch(
  () => relatedValidators.value,
  (newValidators) => {
    setupStore.relatedValidators = newValidators;
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.ease-custom {
  transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
