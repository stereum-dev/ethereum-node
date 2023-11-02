<template>
  <div class="w-full h-full flex justify-center items-center">
    <Carousel
      ref="carousel relative"
      v-model="currentSlide"
      class="carousel"
      :items-to-show="1"
      :wrap-around="true"
      :transition="500"
      snap-align="center"
    >
      <slide v-for="(item, index) in installStore.syncType" :key="index" aria-current="0">
        <div class="w-full h-full flex justify-center items-center pl-2">
          <div v-if="item.name === 'genesis'" class="w-full h-full flex flex-col justify-center items-start">
            <span class="text-md text-gray-300 font-semibold text-left uppercase">{{ item.name }}</span>
            <span class="text-sm text-teal-600 font-semibold text-left">{{ item.type }}</span>
          </div>
          <div v-else-if="item.type === 'custom source'" class="w-full h-full flex justify-between items-center">
            <div class="w-fit h-full flex flex-col justify-center items-start">
              <span class="w-fit h-5 text-sm text-gray-300 font-semibold text-left uppercase">{{ item.name }}</span>
              <span class="w-fit text-xs text-teal-600 font-semibold text-left">{{ item.type }}</span>
            </div>
            <div class="w-[60%] h-full flex justify-center items-center">
              <input
                v-model="installStore.checkPointSync"
                type="text"
                placeholder="https://example.cc/"
                class="w-[230px] h-10 bg-[#1E2429] rounded-md pl-1 text-gray-300 placeholder:text-gray-500 text-xs"
              />
            </div>
          </div>
          <div v-else-if="item.type === 'recommended'" class="w-full h-full flex justify-between items-center">
            <div class="w-fit h-full flex flex-col justify-center items-start">
              <span class="w-fit h-5 text-sm text-gray-300 font-semibold text-left uppercase">{{ item.name }}</span>
              <span class="w-fit text-xs text-teal-600 font-semibold text-left">{{ item.type }}</span>
            </div>

            <div class="w-[60%] h-10 flex justify-center items-center">
              <div
                v-if="selectedItem == '- SELECT A SOURCE -'"
                class="w-full h-10 text-center bg-[#1E2429] text-gray-300 p-1 rounded-md flex justify-center items-center cursor-pointer"
                @click="openDropdown"
              >
                <span class="text-sm text-gray-300">{{ selectedItem }}</span>
              </div>
              <div
                v-else
                class="w-full h-10 bg-[#1E2429] grid grid-cols-6 rounded-md self-center px-2"
                @click="openDropdown"
              >
                <div class="col-start-1 col-span-1 self-center">
                  <img v-if="selectedIcon" class="w-6 ml-1" :src="selectedIcon" :alt="selectedItem" />
                </div>
                <div
                  v-if="selectedIcon"
                  class="extentions h-9 pt-5 col-start-2 col-end-6 text-md text-gray-300 flex justify-center items-center self-center"
                >
                  <span class="text-sm text-gray-300 text-center">{{ selectedItem }}</span>
                </div>
                <div
                  v-else
                  class="extentions h-9 pt-5 col-start-2 col-end-6 text-md text-gray-300 flex justify-center items-center self-center"
                >
                  <span class="text-sm text-gray-300 text-center">{{ selectedItem }}</span>
                </div>
                <div class="col-start-6 col-span-1 self-center justify-self-end" @click="openWindow">
                  <img class="w-6" src="/img/icon/service-icons/internet.png" alt="Internet" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </slide>

      <template #addons>
        <navigation />
      </template>
    </Carousel>
    <Transition name="slide-fade">
      <ul
        v-if="dropdown"
        class="absolute top-14 right-5 transition-all w-64 h-[150px] duration-400 ease-in-out bg-gray-700 rounded-b-lg shadow-lg pb-1 z-10 divide-y divide-gray-600 overflow-y-auto flex flex-col justify-start items-center"
      >
        <li
          v-for="link in selectedLinks"
          :key="link"
          class="w-full h-12 grid grid-cols-6 py-1 px-4 hover:bg-blue-400"
          @click="linkPicker(link)"
        >
          <img
            v-if="link.icon"
            class="w-6 h-6 col-start-1 col-end-2 self-center justify-self-center p-1"
            :src="link.icon"
            alt="service Icon"
          />
          <span
            class="col-start-3 col-end-6 px-4 py-1 flex justify-start links-center outline-0 whitespace-nowrap cursor-pointer text-sm text-gray-200 font-semibold"
            >{{ link.name }}</span
          >
        </li>
      </ul>
    </Transition>
  </div>
</template>
<script setup>
import ControlService from "@/store/ControlService";
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeManage } from "@/store/nodeManage";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import { ref, watch, onMounted, computed, watchEffect } from "vue";
import { useRouter } from "vue-router";

// Store
const installStore = useClickInstall();
const manageStore = useNodeManage();
const router = useRouter();

// Data

const dropdown = ref(false);
const selectedItem = ref("- SELECT A SOURCE -");
const currentSlide = ref(null);
const selectedLinks = ref([]);
const prevVal = ref(0);
const selectedIcon = ref("");
const incommingNetwork = ref(null);
const fullPath = router.currentRoute.value.fullPath;

// Computed properties

const currentNetwork = computed(() => {
  return manageStore.currentNetwork;
});

const configNetwork = computed(() => {
  return installStore.configNetwork;
});

// Watchers

watchEffect(() => {
  if (fullPath.startsWith("/config")) {
    incommingNetwork.value = configNetwork.value;
  } else {
    incommingNetwork.value = currentNetwork.value;
  }
});

watch(currentSlide, (val) => {
  if (router.currentRoute.value.path === "/oneClick/sync") {
    if (val !== prevVal.value) {
      prevVal.value = val;
      installStore.checkPointSync = "";
      selectedItem.value = "- SELECT A SOURCE -";
    }
    if (installStore.selectedPreset?.name === "archive") {
      val = 3;
    }

    if (val === 1 && installStore.checkPointSync === "") {
      installStore.btnActive = false;
    } else {
      installStore.btnActive = true;
    }
  }
});

// Lifecycle hooks

onMounted(() => {
  currentSlide.value = 3;
  setSelectedLinks();
});

// Methods

const openWindow = () => {
  const url = installStore.checkPointSync;
  window.open(url, "_blank");
};

const openDropdown = () => {
  if (selectedItem.value === "Validating...") {
    dropdown.value = false;
    return false;
  }
  dropdown.value = !dropdown.value;
};

const linkPicker = async (item) => {
  selectedItem.value = "Validating...";
  selectedIcon.value = "/img/icon/control/spinner.gif";
  installStore.checkPointSync = "";
  dropdown.value = false;
  const isCheckpointValid = await ControlService.isCheckpointValid(item.url);
  if (!isCheckpointValid) {
    selectedItem.value = "INVALID";
    selectedIcon.value = item.icon;
    setTimeout(() => {
      selectedItem.value = "- SELECT A SOURCE -";
      selectedIcon.value = "";
    }, 1000);
    return;
  }
  selectedItem.value = item.name;
  selectedIcon.value = item.icon;
  installStore.checkPointSync = item.url;
};

const setSelectedLinks = () => {

  if (configNetwork.value.id === 1 || currentNetwork.value.id === 1) {

    selectedLinks.value = installStore.mainnet;
  } else if (configNetwork.value.id === 2 || currentNetwork.value.id === 2) {
    selectedLinks.value = installStore.georli;
  } else if (currentNetwork.value.id === 3 || currentNetwork.value.id === 3) {
    selectedLinks.value = installStore.sepolia;
  } else if (configNetwork.value.id === 4 || currentNetwork.value.id === 4) {
    selectedLinks.value = installStore.gnosis;
  } else if (configNetwork.value.id === 5 || currentNetwork.value.id === 5) {
    selectedLinks.value = installStore.holesky;
  }
};

// const setSelectedLinks = () => {
//   switch (configNetwork.value.id) {
//     case 1:
//       selectedLinks.value = installStore.mainnet;
//       break;

//     case 2:
//       selectedLinks.value = installStore.georli;
//       break;
//     case 3:
//       selectedLinks.value = installStore.sepolia;
//       break;
//     case 4:
//       selectedLinks.value = installStore.gnosis;
//       break;
//     default:
//       break;
//   }
// };
</script>
<style scoped>
.extentions {
  width: 100% !important;
  grid-column: 2/6 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.carousel {
  grid-column: 4/13;
  grid-row: 2/3;
  width: 100%;
  height: 100% !important;
  position: relative !important;
}
.carousel__viewport {
  height: 100% !important;
  background: #be1212 !important;
}
.carousel__track {
  width: 100% !important;
  height: 100% !important;
}

.carousel__item {
  min-height: 200px;
  width: 100%;
  background-color: var(--vc-clr-primary);
  color: var(--vc-clr-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  width: 100%;
  height: 100% !important;
}

.carousel button {
  width: 20px;
}
.carousel button .carousel__icon {
  width: 30px;
  height: 30px;
  color: #fff;
}
</style>
