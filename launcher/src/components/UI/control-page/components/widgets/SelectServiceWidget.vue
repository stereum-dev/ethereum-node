<template>
  <div class="select-service-widget-parent flex flex-col w-full h-full justify-center items-center">
    <div class="h-1/2 w-full justify-center items-center flex p-1">
      <div class="selector-services w-full h-full flex rounded-md border border-gray-500" @click="toggleDropdown">
        <div class="selected-service-name flex justify-center items-center w-[90%] h-full text-gray-200 text-2xs font-semibold uppercase">
          {{ selectedServiceLabel }}
        </div>

        <div class="arrow-box flex justify-center items-center w-[10%] h-full text-gray-200 text-lg font-semibold uppercase">
          <ServiceArrow direction="next" :class="{ 'rotate-[270deg]': isOpen, 'rotate-90': !isOpen }" />
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
        </div>
      </transition>
    </div>

    <div v-if="controlStore.pickeedService === 'vld'" class="h-1/2 w-full flex justify-center items-center">
      <ServiceArrow v-if="filteredValidatorServices.length > 1" direction="prev" @prev="prevValidator" />
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
            {{ selectedValidatorService?.config?.serviceID ? formatServiceId(selectedValidatorService.config.serviceID) : "" }}
          </div>
        </div>
        <div class="vld-keys h-1/2 w-2/6 flex justify-center items-center text-gray-200 text-lg font-semibold uppercase">
          {{ formattedValidatorNo }}
        </div>
        <ServiceIcon icon="/img/icon/control-page-icons/key-eth.svg" alt-text="key" />
      </div>
      <ServiceArrow v-if="filteredValidatorServices.length > 1" direction="next" @next="nextValidator" />
    </div>
    <div v-else class="h-1/2 w-full flex justify-center items-center">
      <ServiceArrow v-if="servicePairs.length > 1" direction="prev" @prev="prevPair" />

      <div class="pairs-info w-4/5 h-full flex justify-center items-center">
        <ServiceDetails :service="selectedPair?.executionService" service-type="exec" />
        <ServiceDetails :service="selectedPair?.consensusService" service-type="cons" />
      </div>

      <ServiceArrow v-if="servicePairs.length > 1" direction="next" @next="nextPair" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useControlStore } from "@/store/theControl";
import { useSetups } from "@/store/setups";
import { useStakingStore } from "@/store/theStaking";

import DropdownOption from "../fragments/DropdownOption.vue";
import ServiceArrow from "../fragments/ServiceArrow.vue";
import ServiceIcon from "../fragments/ServiceIcon.vue";
import ServiceDetails from "../fragments/ServiceDetails.vue";

const controlStore = useControlStore();
const setupStore = useSetups();
const stakingStore = useStakingStore();

const isOpen = ref(false);
const currentIndex = ref(0);

const selectedServiceLabel = computed(() =>
  controlStore.pickeedService === "exeCons" ? "EXECUTION & CONSENSUS CLIENTS" : "VALIDATOR CLIENT"
);

const servicePairs = computed(() => {
  const setup = setupStore.selectedSetup;
  if (!setup || !setup.services) return [];

  return setup.services
    .filter((service) => service.category === "consensus")
    .flatMap((consensusService) =>
      (consensusService.config?.dependencies?.executionClients || []).map((executionClient) =>
        createServicePair(consensusService, executionClient, setup.services)
      )
    );
});

const createServicePair = (consensusService, executionClient, services) => {
  const executionDetails = services.find(
    (service) => service.service === executionClient.service && service.config?.serviceID === executionClient.id
  ) || { name: executionClient.service, config: { serviceID: executionClient.id } };

  const consensusDetails =
    services.find(
      (service) => service.service === consensusService.service && service.config?.serviceID === consensusService.config?.serviceID
    ) || {};

  return {
    consensusService: formatServiceDetails(consensusService, consensusDetails),
    executionService: { ...executionDetails, id: executionClient.id },
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
  return (
    setupStore.selectedSetup?.services.filter(
      (service) =>
        service.category === "validator" &&
        service.config?.dependencies?.consensusClients?.some(
          (dependency) =>
            dependency.service === selectedPair.value.consensusService.service && dependency.id === selectedPair.value.consensusService.id
        )
    ) || []
  );
});

const filteredValidatorServices = computed(() => {
  const setup = setupStore.selectedSetup;
  return setup?.services.filter((service) => service.category === "validator") || [];
});

const selectedValidatorService = computed(() => filteredValidatorServices.value[currentIndex.value] || null);

const formattedValidatorNo = computed(() => stakingStore.keys.length.toString().padStart(3, "0"));

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const servicePicker = (type) => {
  controlStore.pickeedService = type === "vld" ? "vld" : "exeCons";
  toggleDropdown();
};

const prevPair = () => {
  if (servicePairs.value.length) {
    setupStore.currentPairIndex = (setupStore.currentPairIndex - 1 + servicePairs.value.length) % servicePairs.value.length;
  }
};

const nextPair = () => {
  if (servicePairs.value.length) {
    setupStore.currentPairIndex = (setupStore.currentPairIndex + 1) % servicePairs.value.length;
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
  (newPair) => {
    setupStore.selectedServicePairs = newPair;
  },
  { immediate: true }
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
    if (setupStore.currentPairIndex >= newLength) {
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
