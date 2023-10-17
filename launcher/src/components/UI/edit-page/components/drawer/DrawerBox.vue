import { useServices } from '@/store/services';
<template>
  <div class="w-28 h-full flex flex-col justify-between items-center fixed right-0 top-0">
    <div
      class="grid grid-cols-1 grid-rows-12 w-full h-full px-2 py-4 overflow-hidden border-l border-gray-500 rounded-l-xl bg-[#2e5151]"
    >
      <DrawerFilter />
      <div class="col-span-1 row-start-2 row-span-1"></div>

      <div
        class="col-span-1 row-start-3 row-end-12 w-full h-[430px] flex flex-col items-center space-y-6 bg-[#151618] border border-gray-500 rounded-md overflow-y-scroll py-3 overflow-x-hidden mt-3"
      >
        <div
          v-for="service in serviceStore.filteredServices"
          :key="service.serviceID"
          class="w-full relative inline-block cursor-pointer"
          draggable="true"
          @dragstart="dragStart($event, service)"
          @dblclick="addServices(service)"
        >
          <img :src="service.sIcon" alt="Client Icon" class="w-14 mx-auto" />
          <p
            v-if="service.displayTooltip"
            class="min-w-[50px] h-[20px] absolute flex items-center justify-center p-1 text-gray-800 bg-white rounded-sm border border-gray-950 shadow-lg z-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 absolute rotate-45 right-4 -top-1 transform text-white fill-current"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path>
            </svg>
            <span class="text-xs truncate z-10">{{ service.name }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DrawerFilter from "./DrawerFilter.vue";
import { useServices } from "@/store/services";

const props = defineProps({
  dragging: Function,
});

// eslint-disable-next-line vue/no-setup-props-destructure
const dragStart = props.dragging;

const emit = defineEmits(["addServices", "startDrag"]);

const serviceStore = useServices();

function addServices(service) {
  emit("addServices", service);
}
</script>
