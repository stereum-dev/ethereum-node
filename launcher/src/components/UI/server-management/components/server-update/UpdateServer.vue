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
      class="w-full h-full col-start-1 col-span-full row-start-4 row-span-full border-t border-gray-500 grid grid-cols-12 grid-rows-12 items-center p-1"
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
        class="w-full h-full max-h-[200px] col-start-1 col-span-full row-start-3 row-end-11 border border-gray-500 rounded-md flex flex-col justify-start items-center p-1 space-y-1 bg-black overflow-x-hidden overflow-y-auto"
      >
        <UpdateRow
          v-for="item in updates"
          v-show="updates.length"
          :key="item"
          :item="item"
          @update-server="updateServer"
        />
        <ListRow v-for="task in updateTasks" v-show="!updates.length" :key="task.action" :task="task" />
      </div>
      <div class="col-start-1 col-span-full row-start-11 row-span-full w-full h-full grid grid-cols-12 py-2">
        <div class="w-full h-full col-start-1 col-end-6 flex justify-center items-center">
          <div
            class="w-full h-full flex justify-evenly items-center bg-[#4d7575] hover:bg-[#243535] rounded-sm active:scale-90 shadow-md shadow-black active:shadow-none transition-all duration-100 ease-in-out cursor-pointer"
            :class="{
              'opacity-40 pointer-events-none bg-[#3d4244] scale-95': updates.length === 0,
            }"
            @click.prevent.stop="updateServer"
          >
            <span class="text-gray-100 text-sm font-semibold uppercase">{{ $t("updatePanel.all") }}</span>
            <img class="w-4" src="/img/icon/node-icons/download2.png" alt="icon" />
          </div>
        </div>
        <div class="w-full h-full col-start-7 col-span-full flex justify-center items-center p-1">
          <span class="text-gray-200 text-md font-semibold"
            >{{ $t("updatePanel.auto") }} :
            <span class="text-md uppercase font-semibold" :class="onOff">{{ stereumApp.autoUpdate }}</span></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UpdateRow from "./UpdateRow.vue";
import ListRow from "./ListRow.vue";
import ControlService from "@/store/ControlService";

import { ref, onMounted, computed } from "vue";
import { useNodeHeader } from "@/store/nodeHeader";

const headerStore = useNodeHeader();

const osVersionCurrent = ref("");
const stereumApp = ref({
  current: "alpha",
  latest: "2.0",
  autoUpdate: "",
});

const updateTasks = ref([
  {
    action: "minor os update",
  },
  {
    action: "major os update",
  },
  {
    action: "patch os update",
  },
]);

const updates = ref([
  // {
  //   name: "Ubuntu",
  //   version: "20.04",
  // },
  // {
  //   name: "Ubuntu",
  //   version: "20.03",
  // },
  // {
  //   name: "Ubuntu",
  //   version: "20.02",
  // },
]);

const onOff = computed(() => {
  if (stereumApp.value.autoUpdate == "on") {
    return "text-green-700";
  } else {
    return "text-red-700";
  }
});

onMounted(() => {
  getUpdatablePackagesCount();
  getOsVersion();
  getSettings();
});

const getSettings = async () => {
  let settings = await ControlService.getStereumSettings();
  if (settings.stereum?.settings.updates.unattended.install) {
    stereumApp.value.autoUpdate = "on";
  } else {
    stereumApp.value.autoUpdate = "off";
  }
};

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

const updateServer = async () => {
  console.log("update os");
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
