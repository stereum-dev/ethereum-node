<template>
  <div class="w-full h-full col-start-1 col-span-1 row-start-1 row-span-full overflow-x-hidden overflow-y-auto">
    <div
      class="w-full h-full row-start-2 row-span-full grid grid-flow-row auto-rows-min items-center justify-start pt-4 gap-y-1 overflow-x-hidden overflow-y-auto"
      style="grid-auto-rows: minmax(28px, auto)"
    >
      <div
        v-for="(item, index) in installedClients"
        :key="item.config?.serviceID"
        class="w-9 h-7 max-h-[35px] row-span-1 py-1 rounded-r-full text-gray-700 focus:outline-nones transition-colors duration-200 flex justify-center items-center cursor-pointer"
        :class="{
          'bg-[#336666] shadow-md shadow-[#191a1b] animate__animated animate__slideInLeft animate__faster pointer-events-none':
            currentService === item.config?.serviceID,
          ' bg-[#e8ebeb] border border-gray-600': currentService !== item.config?.serviceID,
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
            'w-6': currentService === item.config?.serviceID,
            'w-5': currentService !== item.config?.serviceID,
          }"
          @mousedown.prevent
        />

        <!-- Detailed Button: Appears on hover -->

        <button
          v-if="hoveredIndex === index"
          class="w-36 h-9 absolute left-1 py-1 px-2 rounded-md bg-[#caced1] border border-gray-500 flex justify-start items-center z-10 space-x-2 animate__animated animate__slideInLeft cursor-pointer"
          @click="filterByService(item)"
        >
          <img class="w-6" :src="item.icon" :alt="`${item.name} Icon`" />
          <span class="text-xs text-gray-700 font-semibold">{{ item.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";

import { useNodeStore } from "@/store/theNode";

const props = defineProps({
  client: {
    type: Object,
    default: null,
  },
});

const footerStore = useFooter();
const serviceStore = useServices();
const nodeStore = useNodeStore();
const currentService = ref(null);

const hoveredIndex = ref(null);

const installedClients = computed(() => {
  return serviceStore.installedServices.map((service) => ({ ...service, selected: false })).sort((a, b) => a.name.localeCompare(b.name));
});

watch(currentService, (newService) => {
  const selectedService = installedClients.value.find((service) => service.config?.serviceID === newService);
  if (selectedService) {
    nodeStore.clientToLogs = selectedService;
  }
});

onMounted(() => {
  currentService.value = props.client.config?.serviceID;
});

//Methods

const getService = (index) => {
  hoveredIndex.value = null;
  hoveredIndex.value = index;
};

const filterByService = (item) => {
  currentService.value = item.config?.serviceID;
};
</script>
