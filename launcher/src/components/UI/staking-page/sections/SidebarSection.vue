<template>
  <aside
    class="h-full col-start-1 col-span-1 row-start-1 row-span-full grid grid-cols-1 grid-rows-12 items-center custom-gradient"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div class="w-full h-full row-start-2 row-span-full grid grid-rows-12 items-center justify-start">
      <!-- All Keys Button -->
      <div
        v-if="showAllKeysButton"
        class="w-9 h-9 max-h-[35px] row-span-1 py-1 rounded-r-full text-gray-700 transition-colors duration-200 flex justify-center items-center cursor-pointer"
        :class="{
          'bg-[#336666] shadow-md shadow-[#191a1b] animate__animated animate__slideInLeft animate__faster pointer-events-none':
            stakingStore.displayAllKeysActive,
          'bg-[#202123] border border-gray-600': !stakingStore.displayAllKeysActive,
        }"
        @click="clearServiceFilter"
        @mouseenter="footerStore.cursorLocation = `All Keys`"
        @mouseleave="[(footerStore.cursorLocation = ''), (hoveredIndex = null)]"
      >
        <span class="w-7 h-7 rounded-full text-center text-xs text-gray-200 p-2">All</span>
      </div>

      <!-- Validator Buttons -->
      <div
        v-for="item in installedValidators"
        :key="item.config?.serviceID"
        class="w-9 h-9 max-h-[35px] row-span-1 py-1 rounded-r-full text-gray-700 transition-colors duration-200 flex justify-center items-center cursor-pointer"
        :class="[
          item.setupColor === 'default' ? 'bg-[#336666]' : setupStore.getBGColor(item.setupColor),
          currentService === item.config?.serviceID
            ? 'shadow-md shadow-[#191a1b] animate__animated animate__slideInLeft animate__faster pointer-events-none'
            : 'bg-[#202123] border border-gray-600',
        ]"
        @click="filterByService(item)"
        @mouseenter="footerStore.cursorLocation = `Filter by ${item.name}`"
        @mouseleave="[(footerStore.cursorLocation = ''), (hoveredIndex = null)]"
      >
        <img
          :src="item.icon"
          :alt="`${item.service} Icon`"
          :class="{
            'w-7': currentService === item.config?.serviceID,
            'w-6': currentService !== item.config?.serviceID,
          }"
          @mousedown.prevent
        />
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
import { useObolStats, useSSVStats } from "../../../../composables/validators";

const setupStore = useSetups();
const footerStore = useFooter();
const stakingStore = useStakingStore();
const serviceStore = useServices();

const currentService = ref(null);
const hoveredIndex = ref(null);

const installedValidators = computed(() => {
  if (!setupStore.selectedSetup) {
    return serviceStore.installedServices.filter((s) => s.category === "validator");
  }
  return serviceStore.installedServices
    .filter(
      (s) =>
        s.category === "validator" && setupStore.selectedSetup.services?.map((setup) => setup.config.serviceID).includes(s.config.serviceID)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
});

const showAllKeysButton = computed(() => installedValidators.value.length > 1);

const clearServiceFilter = () => {
  stakingStore.selectedServiceToFilter = null;
  currentService.value = null;
  stakingStore.displayAllKeysActive = true;
};

const selectSingleValidator = (validator) => {
  currentService.value = validator.config?.serviceID;
  stakingStore.selectedServiceToFilter = validator;
  stakingStore.displayAllKeysActive = false;
  filterKeys();
  useObolStats();
  useSSVStats();
};

const filterKeys = () => {
  stakingStore.keys =
    stakingStore.keys?.filter((key) =>
      stakingStore.displayAllKeysActive ? true : key.validatorID === stakingStore.selectedServiceToFilter?.config?.serviceID
    ) || [];
};

const filterByService = (item) => {
  currentService.value = item.config?.serviceID;
  stakingStore.selectedServiceToFilter = item;
  stakingStore.displayAllKeysActive = false;
  filterKeys();
  useObolStats();
  useSSVStats();
};

watch(
  () => installedValidators.value,
  (newValidators) => {
    if (newValidators.length === 1) {
      selectSingleValidator(newValidators[0]);
    } else {
      clearServiceFilter();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (installedValidators.value.length === 1) {
    selectSingleValidator(installedValidators.value[0]);
  } else {
    clearServiceFilter();
  }
});
</script>

<style scoped>
.custom-gradient {
  background: linear-gradient(to bottom, #264744 0%, #33393e 20%);
}
</style>
