<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-6 grid-rows-15 items-center gap-y-1 bg-[#292e32] p-1 rounded-md"
  >
    <span class="col-start-1 col-span-full row-start-1 row-span-1 text-xs text-center text-gray-100 font-sans uppercase"
      >ADD A CONFIG SERVICE</span
    >
    <DrawerFilter />
    <div class="h-7 col-start-1 col-span-full row-start-3 row-span-1 mb-1 self-end flex justify-start items-center relative">
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

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
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
      class="col-start-1 col-span-full row-start-4 row-end-14 w-full h-full flex flex-col justify-start items-center space-y-1 bg-[#151618] border border-gray-700 rounded-md overflow-y-scroll py-1 overflow-x-hidden"
    >
      <div
        v-for="service in filteredServices"
        :key="service.service"
        class="w-full h-10 border border-gray-800 rounded-sm cursor-pointer grid grid-cols-5 p-1 hover:bg-gray-700 transition-all duration-100"
        draggable="true"
        @dragstart="dragStart($event, service)"
        @click="addServices(service)"
        @mouseenter="footerStore.cursorLocation = `${service.name} ${serv}`"
      >
        <img :src="service.icon" alt="Client Icon" class="col-start-1 col-span-1 w-full mx-auto" />
        <span class="col-start-2 col-span-full w-full self-center text-xs text-gray-100 truncate ml-2">{{ service.name }}</span>
      </div>
    </div>
    <div
      class="col-start-1 col-span-full row-start-14 row-span-full w-full h-full bg-[#151618] rounded-md flex flex-col justify-between items-center p-1 shadow-sm shadow-black active:shadow-none border border-gray-700"
    >
      <span class="text-xs text-center text-gray-100 font-sans uppercase mt-1">CUSTOM SERVICE</span>

      <div
        class="w-full h-8 bg-teal-700 rounded-sm text-center p-1 cursor-pointer hover:bg-teal-900 transition-all duration-100"
        @click="addServices(customService)"
      >
        <span class="text-sm text-gray-200"> Create </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import DrawerFilter from "./DrawerFilter.vue";
import { useServices } from "@/store/services";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import { computed, onUnmounted, ref } from "vue";
import { useSetups } from "@/store/setups";

const t = i18n.global.t;

const serv = t("serviceLay.srvice");
const searchQuery = ref("");

const footerStore = useFooter();
const serviceStore = useServices();
const setupStore = useSetups();
const props = defineProps({
  dragging: Function,
});

// eslint-disable-next-line vue/no-setup-props-destructure
const dragStart = props.dragging;

const emit = defineEmits(["addServices", "startDrag"]);

const filteredServices = computed(() => {
  return serviceStore.filteredServices
    .filter((service) => {
      return !setupStore.serverServices.includes(service?.service);
    })
    .filter((service) => {
      return service?.service !== "CustomService";
    })
    .filter((service) => {
      return service?.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
});

const customService = computed(() => {
  return serviceStore.allServices.find((service) => service.service === "CustomService");
});

const addServices = (service) => {
  emit("addServices", service);
};

onUnmounted(() => {
  searchQuery.value = "";
});
</script>
