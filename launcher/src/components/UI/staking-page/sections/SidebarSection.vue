<template>
  <aside
    class="h-full col-start-1 col-span-1 row-start-1 row-span-full grid grid-cols-1 grid-rows-12 bg-[#33393E] items-center"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
  >
    <div class="w-full h-full row-start-2 row-span-full grid grid-rows-8 p-1 pl-0 items-center">
      <div class="w-full h-full row-start-1 row-span-1 flex justify-center items-center relative">
        <button
          v-if="stakingStore.isGroupListActive"
          class="w-8 h-8 row-start-1 row-span-1 p-1 rounded-md text-gray-700 focus:outline-nones transition-colors duration-200 bg-[#202123] flex justify-center items-center ml-1"
          @click="mouseHover"
          @mouseenter="footerStore.cursorLocation = `Back to keys List`"
          @mouseleave="footerStore.cursorLocation = ''"
        >
          <img class="w-6 h-4" src="/img/icon/manage-node-icons/backtonode.png" alt="Back Icon" />
        </button>

        <button
          v-if="buttonHovered"
          class="animate__animated animate__slideInLeft animate__faster w-36 h-9 absolute left-1 row-start-1 row-end-2 py-1 px-2 rounded-md duration-200 bg-gray-700 border border-gray-500 flex justify-start items-center z-10 space-x-2"
          @mouseleave="buttonHovered = false"
          @click="backToList"
        >
          <img class="w-6 h-4" src="/img/icon/manage-node-icons/backtonode.png" alt="Back Icon" />
          <span class="text-xs text-gray-200 font-semibold">Back To List</span>
        </button>
      </div>

      <div class="w-full h-full row-start-2 row-span-full grid grid-rows-8">
        <div
          v-for="(item, index) in installedValidators"
          :key="item.service"
          class="w-full h-9 row-span-1 flex justify-end items-center py-1 pr-1 rounded-r-full cursor-pointer relative"
          :class="{
            'bg-[#336666] shadow-md shadow-[#191a1b] animate__animated animate__slideInLeft animate__faster pointer-events-none':
              selectedService === item.service,
            'bg-[#202123] border-2  border-l-0 border-gray-600': selectedService !== item.service,
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
              'w-7': selectedService === item.service,
              'w-6': selectedService !== item.service,
            }"
            @mousedown.prevent
          />

          <!-- Detailed Button: Appears on hover -->

          <button
            v-if="hoveredIndex === index"
            class="w-36 h-9 absolute left-1 py-1 px-2 rounded-md bg-gray-700 border border-gray-500 flex justify-start items-center z-10 space-x-2 animate__animated animate__slideInLeft"
            @click="filterByService(item)"
          >
            <img class="w-6" :src="item.icon" :alt="`${item.name} Icon`" />
            <span class="text-xs text-gray-200 font-semibold">{{ item.name }}</span>
          </button>
        </div>
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
};

const getService = (index) => {
  hoveredIndex.value = index;
};

const filterByService = (item) => {
  selectedService.value = item.service;
  emit("filteredService", item.service); // Emitting the selected service
};
</script>

<style scoped>
button {
  --animate-duration: 500ms;
}
</style>
