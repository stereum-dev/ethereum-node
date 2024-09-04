<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-6 grid-rows-15 items-center gap-y-2">
    <div
      class="col-start-1 col-span-full row-start-1 row-end-3 w-full h-full bg-[#232428] rounded-md flex flex-col justify-between items-center p-1"
    >
      <span class="text-xs text-center text-gray-300 font-sans uppercase mt-1">Create a setup</span>

      <div
        class="w-full h-7 bg-teal-700 rounded-[5px] text-center cursor-pointer hover:bg-teal-900 hover:scale-95 active:scale-90 transition-all duration-100"
        @click="createSetup"
      >
        <span class="h-full text-xs text-gray-200 uppercase">Create</span>
      </div>
    </div>
    <div
      class="col-start-1 col-span-full row-start-3 row-end-5 w-full h-full bg-[#232428] rounded-md flex flex-col justify-between items-center p-1"
    >
      <span class="text-xs text-center text-gray-300 font-sans uppercase mt-1">IMPORT A SETUP</span>

      <div
        class="w-full h-7 bg-teal-700 rounded-[5px] text-center cursor-pointer hover:bg-teal-900 hover:scale-95 active:scale-90 transition-all duration-100"
        @click="importSetup"
      >
        <span class="text-xs h-full text-gray-200 uppercase">Import</span>
      </div>
    </div>
    <div
      class="col-start-1 col-span-full row-start-5 row-end-10 w-full h-full bg-[#232428] rounded-md grid grid-cols-6 grid-rows-6 items-start gap-y-1 p-1"
    >
      <span class="col-start-1 col-span-full row-start-1 row-span-1 text-xs text-center text-gray-300 font-sans uppercase self-center"
        >ADD A SERVER SERVICE</span
      >
      <div
        class="w-full h-full col-start-1 col-span-full row-start-2 row-span-full max-h-full overflow-x-hidden overflow-y-auto flex flex-col justify-start items-center space-y-1 bg-[#151618] p-1"
      >
        <div
          v-for="service in getServerServices"
          :key="service"
          class="w-full h-7 min-h-7 bg-[#282a2c] hover:bg-gray-700 rounded-sm border border-gray-600 mx-auto shadow-md shadow-black grid grid-cols-6 items-center p-[2px] cursor-pointer overflow-hidden"
          :class="service?.isDuplicated ? 'pointer-events-none opacity-50' : ''"
          @dblclick="addService(service)"
        >
          <img class="w-5 h-5 col-start-1 col-span-1 mx-auto self-center" :src="service.icon" alt="Service Icon" />
          <span class="col-start-2 col-span-full self-center text-xs text-gray-200 text-left font-sans truncate">{{
            service?.service
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useServices } from "@/store/services";
import { useSetups } from "../../../../../store/setups";
import { useNodeManage } from "../../../../../store/nodeManage";

const emit = defineEmits(["importSetup", "createSetup", "addService"]);

const serviceStore = useServices();
const setupStore = useSetups();
const manageStore = useNodeManage();
const allServices = ref([]);

const getServerServices = computed(() => {
  const newConfigServices = new Set(manageStore.newConfiguration.map((e) => e.service));
  const serverServices = new Set(setupStore?.serverServices.map((e) => e));

  return allServices.value
    .filter((e) => e.category === "service" && serverServices.has(e.service))
    .map((service) => ({
      ...service,
      isDuplicated: newConfigServices.has(service?.service),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

onMounted(() => {
  allServices.value = serviceStore.allServices.filter((e) => e.category === "service").map((e) => ({ ...e, isDuplicated: false }));
});

// Methods
const importSetup = () => {
  emit("importSetup");
};

const createSetup = () => {
  emit("createSetup");
};

const addService = (service) => {
  emit("addService", service);
};
</script>
