<template>
  <aside
    class="h-full col-start-1 col-span-1 row-start-1 row-span-full grid grid-cols-1 grid-rows-12 items-center custom-gradient"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div class="w-full h-full row-start-2 row-span-full grid grid-rows-12 items-center justify-start">
      <div
        v-for="(item, index) in installedValidators"
        :key="item.config?.serviceID"
        class="w-9 h-9 max-h-[35px] row-span-1 py-1 rounded-r-full text-gray-700 focus:outline-nones transition-colors duration-200 flex justify-center items-center cursor-pointer"
        :class="{
          'bg-[#336666] shadow-md shadow-[#191a1b] animate__animated animate__slideInLeft animate__faster pointer-events-none':
            currentService === item.config?.serviceID,
          'bg-[#202123] border border-gray-600': currentService !== item.config?.serviceID,
        }"
        @click="getService(index)"
        @mouseenter="footerStore.cursorLocation = `Filter by ${item.name}`"
        @mouseleave="[(footerStore.cursorLocation = ''), (hoveredIndex = null)]"
      >
        <!-- Main Button: Always visible -->
        <img
          :src="item.icon"
          :alt="`${item.service} Icon`"
          :class="{
            'w-7': currentService === item.config?.serviceID,
            'w-6': currentService !== item.config?.serviceID,
          }"
          @mousedown.prevent
        />

        <!-- Detailed Button: Appears on hover -->

        <button
          v-if="hoveredIndex === index"
          class="w-36 h-9 absolute left-1 py-1 px-2 rounded-md bg-gray-700 border border-gray-500 flex justify-start items-center z-10 space-x-2 animate__animated animate__slideInLeft cursor-pointer"
          @click="filterByService(item)"
        >
          <img class="w-6" :src="item.icon" :alt="`${item.name} Icon`" />
          <span class="text-xs text-gray-200 font-semibold">{{ item.name }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>
<script setup>
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";
import { useStakingStore } from "@/store/theStaking";
import { computed, onMounted, ref, watch } from "vue";

const setupStore = useSetups();
const footerStore = useFooter();
const stakingStore = useStakingStore();
const serviceStore = useServices();
const currentService = ref(null);

const hoveredIndex = ref(null);

//Computed
const installedValidators = computed(() => {
  let services = [];
  if (setupStore.selectedSetup === null) {
    services = serviceStore.installedServices.filter((s) => s.category === "validator" && !/SSVNetwork|Charon/.test(s.service));
  } else {
    services = serviceStore.installedServices
      .filter(
        (s) =>
          s.category === "validator" &&
          !/SSVNetwork|Charon/.test(s.service) &&
          setupStore.selectedSetup?.services?.map((s) => s.config.serviceID).includes(s.config.serviceID)
      )
      .map((service) => ({ ...service, selected: false }));
  }
  return services.sort((a, b) => a.name.localeCompare(b.name));
});

//Lifecycle Hooks
onMounted(() => {
  getCurrentService();
  getActiveValidator();
});

//Methods

const getCurrentService = () => {
  if (setupStore.selectedSetup) {
    const matchingService = installedValidators.value.find((validator) =>
      setupStore.selectedSetup.services.some((service) => service.id === validator.config?.serviceID)
    );
    currentService.value = matchingService?.config?.serviceID;
  } else {
    currentService.value = installedValidators.value[0]?.config?.serviceID;
  }
};

const getActiveValidator = () => {
  if (setupStore.selectedSetup) {
    stakingStore.selectedServiceToFilter = installedValidators.value.find(
      (service) => service.setupId === setupStore.selectedSetup?.setupId
    );
  } else {
    stakingStore.selectedServiceToFilter = installedValidators.value[0];
  }
};

const getService = (index) => {
  hoveredIndex.value = null;
  hoveredIndex.value = index;
};

const filterByService = (item) => {
  currentService.value = item.config?.serviceID;
  stakingStore.selectedServiceToFilter = item;
  stakingStore.isGroupListActive = false;
  stakingStore.currentGroup = null;
};

watch(
  () => setupStore.selectedSetup,
  () => {
    getCurrentService();
    getActiveValidator();
  }
);
</script>

<style scoped>
.custom-gradient {
  background: linear-gradient(to bottom, #264744 0%, #33393e 20%);
}
</style>
