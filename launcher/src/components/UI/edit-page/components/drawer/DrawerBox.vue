import { useServices } from '@/store/services';
<template>
  <div class="w-28 h-full flex flex-col justify-between items-center fixed right-0 top-0">
    <div
      class="grid grid-cols-1 grid-rows-15 w-full h-full px-2 py-4 overflow-hidden border-l border-gray-500 rounded-l-xl bg-[#2e5151]"
    >
      <DrawerFilter />
      <div
        class="h-7 col-start-1 col-span-full row-start-3 row-span-1 mb-1 self-end flex justify-start items-center relative"
      >
        <label for="Search" class="sr-only"> {{ $t("multiServer.serch") }} </label>

        <input
          id="Search"
          v-model="searchQuery"
          type="text"
          :placeholder="`${$t('multiServer.serchFor')}`"
          class="w-full h-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm px-2"
        />

        <span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
          <button type="button" class="text-gray-600 hover:text-gray-700">
            <span class="sr-only">{{ $t("multiServer.serch") }} </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </span>
      </div>

      <div
        class="col-span-1 row-start-4 row-span-full w-full h-[430px] flex flex-col items-center space-y-6 bg-[#151618] border border-gray-500 rounded-md overflow-y-scroll py-3 overflow-x-hidden"
      >
        <div
          v-for="service in filteredServers"
          :key="service.serviceID"
          class="w-full relative inline-block cursor-pointer"
          draggable="true"
          @dragstart="dragStart($event, service)"
          @dblclick="addServices(service)"
          @mouseenter="footerStore.cursorLocation = `${service.name} ${serv}`"
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
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import { computed, ref } from "vue";

const t = i18n.global.t;

const serv = t("serviceLay.srvice");
const searchQuery = ref("");

const footerStore = useFooter();
const serviceStore = useServices();
const props = defineProps({
  dragging: Function,
});

// eslint-disable-next-line vue/no-setup-props-destructure
const dragStart = props.dragging;

const emit = defineEmits(["addServices", "startDrag"]);

const filteredServers = computed(() => {
  if (!searchQuery.value) {
    return serviceStore.filteredServices;
  }
  return serviceStore.filteredServices.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function addServices(service) {
  emit("addServices", service);
}
</script>
