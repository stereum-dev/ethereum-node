<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full bg-[#1b1b1d] rounded-md grid grid-cols-12 grid-rows-12 p-2 pt-0 gap-y-2"
  >
    <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-1 flex justify-start items-center py-1">
      <span class="text-md font-semibold text-gray-300">OPERATING SYSTEM UPDATES</span>
    </div>
    <div
      class="w-full h-full col-start-1 col-span-full row-start-2 row-end-4 grid grid-cols-6 grid-rows-2 items-center gap-x-1"
    >
      <div class="w-full h-full col-start-1 col-span-1 row-start-1 row-span-full flex justify-center items-center">
        <img class="w-full" src="/img/icon/control/ubuntuIco.svg" />
      </div>
      <div class="w-full h-full col-start-2 col-span-full row-start-1 row-span-1 flex justify-start items-center ml-2">
        <span class="text-lg font-semibold text-gray-400 uppercase">Ubuntu</span>
      </div>

      <div class="w-full h-full col-start-2 col-span-full row-start-2 row-span-1 ml-2 grid grid-cols-4 items-center">
        <span class="col-start-1 col-span-3 text-sm font-semibold text-gray-400 uppercase"
          >OPERATING SYSTEM VERSION</span
        >
        <span class="col-start-4 col-span-1 text-sm font-semibold text-amber-400 uppercase">{{
          osVersionCurrent
        }}</span>
      </div>
    </div>
    <div
      class="w-full h-full col-start-1 col-span-full row-start-4 row-span-full border-t border-gray-500 grid grid-cols-12 grid-rows-12 items-center p-2"
    >
      <div
        class="w-full h-full col-start-1 col-span-full row-start-1 row-span-2 grid grid-cols-6 items-center gap-x-2 px-1"
      >
        <div class="w-full col-start-1 col-span-1 bg-red-700 rounded-sm flex justify-center item-center">
          <span class="text-sm font-semibold text-gray-300 text-center">{{ headerStore.osVersionLatest }}</span>
        </div>

        <span class="col-start-2 col-span-full text-md font-semibold text-gray-300">AVAILABLE SERVER OS UPDATES</span>
      </div>

      <div
        class="w-full h-full col-start-1 col-span-full row-start-3 row-span-full border border-gray-500 rounded-md flex flex-col justify-start items-center p-1 space-y-1 bg-black overflow-x-hidden overflow-y-auto"
      >
        <UpdateRow v-for="item in updates" :key="item" :item="item" @update-server="updateServer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import UpdateRow from "./UpdateRow.vue";
import ControlService from "@/store/ControlService";
// import { useServers } from "@/store/servers";

import { ref, onMounted } from "vue";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";

// const serverStore = useServers();
const headerStore = useNodeHeader();
const serviceStore = useServices();

const osVersionCurrent = ref("");

const updates = ref([
  {
    name: "Ubuntu",
    version: "20.04",
  },
  {
    name: "Ubuntu",
    version: "20.03",
  },
  {
    name: "Ubuntu",
    version: "20.02",
  },
]);

onMounted(() => {
  getUpdatablePackagesCount();
  getOsVersion();
});

console.log(serviceStore.newUpdates);

const getUpdatablePackagesCount = async () => {
  try {
    const packagesCount = await ControlService.getCountOfUpdatableOSUpdate();
    const numPackages = Number(packagesCount);
    headerStore.osVersionLatest = isNaN(numPackages) || !numPackages ? 0 : numPackages;
    headerStore.isOsUpdateAvailable = headerStore.osVersionLatest ? true : false;
    return headerStore.osVersionLatest;
  } catch (error) {
    headerStore.osVersionLatest = 0;
    headerStore.isOsUpdateAvailable = false;
    console.log(error);
  }
};

const getOsVersion = async () => {
  try {
    const osVersion = await ControlService.getCurrentOsVersion();

    osVersionCurrent.value = osVersion;
  } catch (error) {
    console.log(error);
  }
};

const updateServer = async (item) => {
  console.log(item);
  // try {
  //   serverStore.isUpdateProcessing = true;
  //   await ControlService.updateOS(item.version);
  //   serverStore.isUpdateProcessing = false;
  // } catch (error) {
  //   serverStore.isUpdateProcessing = false;
  //   console.log(error);
  // }
};
</script>
