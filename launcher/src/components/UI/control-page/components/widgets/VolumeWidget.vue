<template>
  <div class="volume-Parent flex w-full h-full justify-center items-center">
    <div class="volume-Ico w-1/3 h-full flex flex-col justify-center items-center">
      <div class="volume-Ico-container flex justify-center items-center w-full h-4/5">
        <img class="w-3/4" src="/img/icon/control-page-icons/hdd.svg" />
      </div>
      <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-2xs font-semibold uppercase">volume</span>
    </div>
    <div class="volume-box w-2/3 h-full flex flex-col justify-center items-center p-1">
      <div class="volume_services p-1 gap-1 flex w-full h-2/3 border rounded-md border-gray-500 overflow-x-scroll">
        <div
          v-for="item in storagestatus"
          :key="item.id"
          :class="getDynamicClass(item.percentage)"
          class="squa flex-shrink-0 border border-gray-500 rounded-none flex justify-center items-center"
        >
          <!-- Display service icon -->
          <img :src="item.icon" alt="Service Icon" class="w-4/5 h-4/5" />
        </div>
      </div>
      <div class="hdd-services w-full h-1/3 flex">
        <div class="left-side w-3/5 h-full flex justify-center items-center text-[40%] text-green-500 uppercase">
          <span>{{ availDisk }} GB {{ $t("controlPage.free") }} </span
          ><span class="text-gray-400"> / {{ totalDisk }} GB {{ $t("controlPage.total") }}</span>
        </div>
        <div class="right-side w-2/5 h-full flex justify-center items-center uppercase">
          <div class="ttl-box w-1/4 h-full flex flex-col justify-center items-center">
            <div class="title w-full text-[40%] h-1/2 flex justify-center items-center text-gray-200 uppercase">write</div>
            <div class="title w-full text-[40%] h-1/2 flex justify-center items-center text-gray-200 uppercase">read</div>
          </div>
          <div class="val-box w-3/4 h-full flex flex-col text-[60%] justify-center font-semibold items-center">
            <div class="title w-full h-1/2 flex justify-center items-center text-orange-500 uppercase">
              {{ convertWriteValueToMb }}
              {{ controlStore.writeValue / 1024 < 1 && controlStore.writeValue / 1024 > 0 ? "KB" : "MB" }}
            </div>
            <div class="title w-full h-1/2 flex justify-center items-center text-teal-700 uppercase">
              {{ convertReadValueToMb }}
              {{ controlStore.readValue / 1024 < 1 && controlStore.writeValue / 1024 > 0 ? "KB" : "MB" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useControlStore } from "@/store/theControl";
import { useServices } from "@/store/services";

const controlStore = useControlStore();
const serviceStore = useServices();

const totalDisk = computed(() => controlStore.totalDisk);

const storagestatus = computed(() => {
  if (!serviceStore.installedServices.length) {
    return [];
  }

  return controlStore.storagestatus.map((item) => {
    let valueInGB = parseFloat(item.storageValue);
    if (item.storageValue.includes("MB")) {
      valueInGB /= 1024;
    } else if (item.storageValue.includes("KB")) {
      valueInGB /= 1024 * 1024;
    }

    const percentage = (valueInGB / totalDisk.value) * 100;

    const matchingService = serviceStore.installedServices.find((service) => service.service === item.service);
    const serviceIcon = matchingService ? matchingService.icon : "/path/to/default/icon.png";

    return {
      ...item,
      percentage: parseFloat(percentage.toFixed(2)),
      icon: serviceIcon,
    };
  });
});

const availDisk = computed(() => controlStore.availDisk);

const writeValue = computed(() => controlStore.writeValue);

const readValue = computed(() => controlStore.readValue);

const getDynamicClass = (percentage) => {
  if (percentage < 10) {
    return "w-[8%] h-[30%]";
  } else if (percentage < 25) {
    return "w-[20%] h-[50%]";
  } else if (percentage < 40) {
    return "w-[30%] h-[70%]";
  } else if (percentage < 75) {
    return "w-[40%] h-[90%]";
  } else {
    return "w-[50%] h-[100%]";
  }
};

const convertWriteValueToMb = computed(() => {
  const mbValue = writeValue.value / 1024;
  if (mbValue < 1 && mbValue > 0) {
    return Math.floor(writeValue.value);
  }
  return Math.floor(mbValue);
});

const convertReadValueToMb = computed(() => {
  const mbValue = readValue.value / 1024;
  if (mbValue < 1 && mbValue > 0) {
    return Math.floor(readValue.value);
  }
  return Math.floor(mbValue);
});
</script>

<style scoped>
.volume_services {
  white-space: nowrap;
  overflow-x: scroll;
  scrollbar-width: none;
}

.volume_services::-webkit-scrollbar {
  display: none;
}

.squa {
  flex-shrink: 0;
}
</style>
