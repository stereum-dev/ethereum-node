<template>
  <div class="relative w-full h-[60px] col-start-5 col-end-13 flex justify-center items-center gap-x-2">
    <Carousel
      ref="carousel"
      v-model="currentSlide"
      class="carousel"
      :items-to-show="1"
      :wrap-around="true"
      :transition="500"
      snap-align="center"
      :mouse-drag="getCategory !== 'execution'"
      :can-navigate="getCategory !== 'execution'"
    >
      <slide v-for="(item, index) in installStore.syncType" :key="index" aria-current="0">
        <div class="w-11/12 h-full bg-[#33393e] flex justify-center items-center border border-gray-600 rounded-lg">
          <div v-if="item.name === 'genesis'" class="w-full h-full flex justify-evenly items-center p-1">
            <div class="w-full h-full flex flex-col justify-evenly items-center text-gray-400 p-1">
              <span class="w-full font-semibold text-md uppercase">{{ item.name }}</span>
              <span class="w-full font-semibold text-md uppercase text-teal-600">{{ item.type }}</span>
            </div>
          </div>
          <div
            v-else-if="item.type === 'custom source' && getCategory !== 'execution'"
            class="w-full h-full flex justify-evenly items-center p-1"
          >
            <div class="w-1/3 h-full flex flex-col justify-evenly items-center">
              <span class="text-sm text-gray-400 capitalize">{{ item.name }}</span>
              <span class="text-xs font-semibold uppercase text-teal-600">{{ item.type }}</span>
            </div>
            <div class="w-2/3 h-full cursor-pointer">
              <input
                v-model="installStore.checkPointSync"
                type="text"
                placeholder="https://example.cc/"
                class="w-full h-full flex justify-center items-center bg-[#111315] rounded-md text-gray-400 placeholder:text-gray-500 pl-2 text-xs"
              />
            </div>
          </div>
          <div
            v-else-if="item.type === 'recommended' && getCategory !== 'execution'"
            class="w-full h-full flex justify-evenly items-center"
          >
            <div class="w-1/3 h-full flex flex-col justify-evenly items-center">
              <span class="text-sm text-gray-400 capitalize">{{ item.name }}</span>
              <span class="text-xs font-semibold uppercase text-teal-600">{{ item.type }}</span>
            </div>

            <div class="w-2/3 h-full cursor-pointer p-1">
              <div
                v-if="selectedItem == '- SELECT A SOURCE -'"
                class="w-full h-full flex justify-center items-center bg-[#111315] rounded-md text-gray-400"
                @click="openDropdown"
              >
                <span>{{ selectedItem }}</span>
              </div>
              <div v-else class="w-full h-full bg-[#191b1e] border border-gray-600 flex justify-between items-center rounded-md">
                <div v-if="selectedIcon !== ''" class="w-1/6" @click="openDropdown">
                  <img class="w-6 h-6 ml-2" :src="selectedIcon" :alt="selectedItem" />
                </div>
                <div v-if="selectedIcon !== ''" class="w-4/6 text-md text-gray-300 font-semibold" @click="openDropdown">
                  {{ selectedItem }}
                </div>
                <div v-else class="w-4/6 text-gray-500 text-sm" @click="openDropdown">
                  {{ selectedItem }}
                </div>
                <div class="w-1/6" @click="openWindow">
                  <img class="w-6" src="/img/icon/service-modals-icons/internet.png" alt="Internet" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </slide>

      <template #addons><navigation v-if="getCategory !== 'execution'" /> </template>
    </Carousel>

    <Transition name="slide">
      <ul
        v-show="dropdown"
        class="w-72 transition-all min-h-[100px] max-h-[110px] duration-400 ease-in-out absolute right-[20px] -bottom-25 bg-gray-700 border border-gray-700 rounded-lg shadow-lg pt-18 pb-1 z-10 mt-[9.5rem] divide-gray-400 overflow-y-auto flex flex-col justify-start items-center divide-y-[1px]"
        @mouseleave="colseDropdown"
      >
        <li
          v-for="link in selectedLinks"
          :key="link"
          class="w-full h-12 grid grid-cols-6 p-2 hover:bg-blue-400 bg-[#212225]"
          @click="linkPicker(link)"
        >
          <img v-if="link.icon" class="w-7 h-7 col-start-1 col-end-2 self-center justify-self-center" :src="link.icon" alt="service Icon" />
          <span
            class="col-start-3 col-end-6 px-4 py-1 flex justify-start links-center outline-0 whitespace-nowrap cursor-pointer text-md text-gray-200 font-normal font-sans"
            >{{ link.name }}</span
          >
        </li>
      </ul>
    </Transition>
  </div>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import ControlService from "@/store/ControlService";
import { useNodeManage } from "@/store/nodeManage";
import { computed, onBeforeMount, ref, watch, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { useSetups } from "@/store/setups";

const props = defineProps({
  service: Object,
});

//Store
const setupStore = useSetups();
const installStore = useClickInstall();
const manageStore = useNodeManage();
const router = useRouter();

// Data
const carousel = ref(null);
const dropdown = ref(false);
const selectedItem = ref("- SELECT A SOURCE -");
const currentSlide = ref(null);
const prevVal = ref(0);
const selectedIcon = ref("");

// Computed properties

const getCategory = computed(() => {
  return props.service?.category || "";
});

const currentNetwork = computed(() => {
  let setupNetwork;
  let current;

  setupNetwork = setupStore.selectedSetup?.network;
  current = manageStore.networkList.find((network) => network.network === setupNetwork);
  return current;
});

const selectedLinks = computed(() => {
  return installStore[currentNetwork.value?.network];
});

watchEffect(() => {
  if (selectedLinks.value) {
    installStore.selectedLink = selectedLinks.value[0];
  }
});

// Watchers
watch(currentSlide, (val) => {
  if (router.currentRoute.value.path === "/sync" || router.currentRoute.value.path === "/importingSyncing") {
    if (val !== prevVal.value) {
      prevVal.value = val;
      installStore.checkPointSync = "";
      selectedItem.value = "- SELECT A SOURCE -";
    }
    if (installStore.selectedPreset.name === "archive") {
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
  installStore.checkPointSync = "";
});

onBeforeMount(() => {
  currentSlide.value = 2;
});

// Methods
const colseDropdown = () => {
  setTimeout(() => {
    dropdown.value = false;
  }, 200);
};

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
  selectedIcon.value = "/animation/loading/mushroom-spinner.gif";
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
</script>

<style scope>
.icon {
  width: 25%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5%;
}
.name {
  width: 75%;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 130%;
}
.icon img {
  width: 70%;
}
.inputBox_select-box {
  width: 59%;
  height: 120%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.select-button {
  border: none;
  width: 100%;
  height: 80%;
  border-radius: 10px;
  color: #c1c1c1;
  background: #151a1e;
  font-size: 80%;
  font-weight: 500;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.select-button:hover {
  border: none;
  color: #c1c1c1;
  box-sizing: border-box;
  border: 2px solid #c1c1c1;
}
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iconbox {
  width: 20%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
}
.iconbox img {
  width: 90% !important;
  height: 95% !important;
}
.selected-item {
  width: 58%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c1c1c1;
  font-size: 80%;
  font-weight: 600;
  cursor: pointer;
}
.w-selected {
  width: 80%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c1c1c1;
  font-size: 100%;
  font-weight: 600;
  cursor: pointer;
}
.openURL {
  width: 15%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.openURL img {
  width: 90% !important;
  height: 65% !important;
}
.openURL:active {
  transform: scale(0.9);
}
.syncRow {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}
.plugin-name {
  width: 25%;
  height: 80%;
  padding: 5px;
  text-transform: uppercase;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plugin-name .serviceIcon {
  width: 40%;
  height: 100%;
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.plugin-name .serviceIcon img {
  width: 80%;
}
.carousel {
  width: 100% !important;
  height: 100%;
  position: relative;
}
.carousel__viewport {
  height: 100% !important;
}
.carousel__track {
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
  justify-content: space-between;
  align-items: center;
}

.carousel__slide {
  width: 100%;
  padding: 5px 0;
  height: 100% !important;
}

.carousel__prev {
  width: 5%;
  box-sizing: content-box;
  width: 40px;
  padding: 0;
  margin-right: 5px;
  position: absolute;
  left: -20px;
}
.carousel__next {
  width: 5%;
  box-sizing: content-box;
  width: 40px;
  padding: 0;
  margin: 0;
  position: absolute;
  right: -20px;
}
.carousel button {
  width: 20px;
}
.carousel button .carousel__icon {
  width: 30px;
  height: 30px;
  color: #fff;
}
.carousel button .carousel__icon:hover {
  transition: all 0.3s ease-in-out;
  transform: scale(2);
}

.plugin-name .serviceBox {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
.plugin-name .serviceBox span:first-child {
  width: 100%;
  color: #d5d5d5;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}
.plugin-name .serviceBox span:last-child {
  width: 100%;
  color: #4d8384;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
}
.carouselBox {
  width: 90%;
  height: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.syncBox {
  width: 85%;
  height: 93%;
  padding: 5px;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: center;
  align-items: center;
}

.syncBox .syncContent {
  width: 100% !important;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.syncBox .syncContent .commingSoon {
  width: 100%;
  height: 30px;
  background-color: black;
  opacity: 0.5;
  color: gray;
  padding: 5px;
  font-size: 0.8rem;
  font-weight: 600;
}
.syncContent .syncText {
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 5px;
}

.syncContent .syncText span:first-child {
  width: 100%;
  height: max-content;
  color: #acaeae;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
}
.syncContent .syncText span:last-child {
  height: max-content;
  width: 100%;
  color: #4d8384;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: left;
  padding: 2px;
}

.syncContent .inputBox {
  width: 75%;
  height: 100%;
  border-radius: 10px;
  background-color: #1e2226;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inputBox_select_icon {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #151a1e;
}
.inputBox_select_name {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #151a1e;
}

.selection-column {
  width: 34%;
  height: 200%;
  display: flex;
  background-color: #1258a2;
  border-radius: 0 0 5px 5px;
  color: #d5d5d5;
  font-weight: 400;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  top: 80%;
  left: 59.2%;
}
.link-wapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  justify-content: flex-start;
  align-items: center;
}
.link-wapper::-webkit-scrollbar {
  width: none;
  background: transparent;
}

.link-wapper::-webkit-scrollbar-thumb {
  background: #cfdedf;
  border-radius: 5px;
  width: none;
}
.option-row {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 70%;
  font-weight: 600;
  padding: 5px;
  margin-bottom: 1%;
  border-bottom: 1px solid #d5d5d5;
  cursor: pointer;
}
.option-row:hover {
  background-color: #d5d5d5;
  color: #1258a2;
}
.option-row span {
  white-space: nowrap;
}
::-webkit-scrollbar-track {
  background: none;
}

::-webkit-scrollbar-thumb {
  background: none;
}

.inputBox input {
  width: 100%;
  height: 100%;
  border: 3px solid #23272c;
  border-radius: 5px;
  background-color: #151a1e;
  color: #d5d5d5;
  font-size: 0.6rem;
  font-weight: 400;
  text-align: left;
  padding: 5px;
  padding-left: 5px;
}
.sync-header {
  width: 100%;
  height: 34%;
  border: 1px solid #707070;
  border-radius: 15px 0 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.sync-header .headerTitle {
  width: 45%;
  height: 100%;
  border-radius: 15px 0 0 15px;
  background-color: #1a5443;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.headerTitle span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}
.sync-header .syncContent {
  width: 55%;
  height: 100%;
  border-radius: 0;
  padding: 0 5px;
  background-color: #33393e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.syncContent span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}

.content {
  width: 100%;
  height: 64%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content span {
  font-size: 0.5rem;
  font-weight: 400;
  color: #aaaaaa;
}
.content .inputBox {
  width: 96%;
  height: 100%;
  background-color: rgb(209, 209, 209);
  border: 5px solid rgb(104, 104, 104);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.content input {
  width: 100%;
  height: 100%;
  background-color: rgb(209, 209, 209);
  border: none;
  border-radius: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 7px;
  padding-bottom: 3px;
}
</style>
