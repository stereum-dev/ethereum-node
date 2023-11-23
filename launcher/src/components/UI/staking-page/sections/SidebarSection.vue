<template>
  <aside
    class="h-full col-start-1 col-span-1 row-start-1 row-span-full grid grid-cols-1 grid-rows-12 bg-[#33393E] items-center"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div class="w-full h-full row-start-2 row-span-full grid grid-rows-8 items-center justify-center">
      <div class="w-full h-9 row-start-1 row-span-1 relative">
        <!-- Main Button: Always visible -->
        <button
          class="w-9 h-9 row-start-1 row-span-1 p-1 rounded-md text-gray-700 bg-[#202123] flex justify-center items-center cursor-pointer border border-gray-600"
          @mouseenter="footerStore.cursorLocation = `Back to keys List`"
          @mouseleave="footerStore.cursorLocation = ''"
          @click="mouseHover"
        >
          <img class="w-5 h-5" src="/img/icon/the-staking/list2.png" alt="Back Icon" />
        </button>

        <button
          v-if="buttonHovered"
          class="animate__animated animate__slideInLeft w-36 h-9 row-start-1 row-end-2 py-1 px-2 rounded-md bg-gray-700 border border-gray-500 flex justify-start items-center z-10 space-x-2 absolute top-0 cursor-pointer"
          @click="backToList"
          @mouseleave="buttonHovered = false"
        >
          <img class="w-6 h-6" src="/img/icon/the-staking/list2.png" alt="Back Icon" />
          <span class="text-xs text-gray-200 font-semibold">Back To List</span>
        </button>
      </div>

      <div
        v-for="(item, index) in installedValidators"
        :key="item.service"
        class="w-9 h-9 row-span-1 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 flex justify-center items-center cursor-pointer"
        :class="{
          'bg-[#336666] shadow-md shadow-[#191a1b] animate__animated animate__slideInLeft animate__faster pointer-events-none':
            selectedService === item.service,
          'bg-[#202123] border border-gray-600': selectedService !== item.service,
        }"
        @click="getService(index)"
        @mouseenter="footerStore.cursorLocation = `Filter by ${item.name}`"
        @mouseleave="[(footerStore.cursorLocation = ''), (hoveredIndex = null)]"
      >
        <!-- Main Button: Always visible -->
        <img
          :src="item.sIcon"
          :alt="`${item.service} Icon`"
          :class="{
            'w-6': selectedService === item.service,
            'w-5': selectedService !== item.service,
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
import { ref, computed } from "vue";
import { useStakingStore } from "@/store/theStaking";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";

const emit = defineEmits(["filteredService"]);

const footerStore = useFooter();
const stakingStore = useStakingStore();
const serviceStore = useServices();
const selectedService = ref(null);
const buttonHovered = ref(false);
const hoveredIndex = ref(null);

const installedValidators = computed(() => {
  return serviceStore.installedServices
    .filter((s) => s.category === "validator")
    .map((service) => ({ ...service, hovered: false }));
});

const mouseHover = () => {
  buttonHovered.value = true;
};

const backToList = () => {
  stakingStore.isGroupListActive = false;
  buttonHovered.value = false;
  selectedService.value = null;
};

const getService = (index) => {
  hoveredIndex.value = null;
  hoveredIndex.value = index;
};

const filterByService = (item) => {
  selectedService.value = item.service;
  emit("filteredService", item.service); // Emitting the selected service
};
</script>

<style scoped>
/* button {
  --animate-duration: 500ms;
} */
</style>
