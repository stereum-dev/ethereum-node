<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <CustomHeader />
    <div class="w-full h-full col-start-1 col-span-full row-start-3 row-end-11 grid grid-cols-12 grid-rows-7 p-2 mx-auto">
      <div class="w-full h-full col-start-3 col-end-11 row-start-1 row-span-full bg-[#1E2429] rounded-md grid grid-cols-12 grid-rows-7 p-4">
        <div class="col-start-1 col-span-full row-start-1 row-span-2 flex justify-center items-center p-2">
          <span class="text-left text-gray-300 text-md font-sans font-semibold">
            {{ $t("customInstallation.customInstallationText") }}</span
          >
        </div>
        <div class="col-start-1 col-span-full row-start-3 row-span-full grid grid-cols-12 grid-rows-7 relative duration-500">
          <!-- <div
            class="col-start-3 col-span-8 row-start-1 row-span-1 bg-gray-200 rounded-md grid grid-cols-6 cursor-pointer"
            @click="networkListDropdown = !networkListDropdown"
          >
            <img
              v-if="displayItem?.icon"
              class="col-start-1 col-span-1 w-7 h-7 justify-self-center self-center"
              :src="displayItem?.icon"
              alt="Arrow icon"
            />
            <span
              class="col-start-2 col-end-6 justify-self-center self-center text-center text-gray-800 text-lg font-semibold"
              >{{ displayItem?.name ? displayItem?.name : displayItem }}</span
            >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="col-start-6 col-span-1 justify-self-center self-center w-5 h-5 text-gray-900"
              :class="{ 'transform rotate-180': networkListDropdown }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-width="2" d="M5 10l7 7 7-7"></path>
            </svg>
          </div>
          <TransitionGroup
            v-if="networkListDropdown"
            tag="ul"
            name="slide-fade"
            class="col-start-3 col-span-8 row-start-2 row-span-full max-h-[200px] bg-gray-700 rounded-lg shadow-lg pb-1 w-full z-10 divide-y overflow-y-auto flex flex-col justify-start items-center mt-2"
            :duration="500"
          >
            <li
              v-for="item in manageStore.networkList"
              :key="item.name"
              class="w-full min-h-[40px] max-h-[40px] grid grid-cols-6 px-4 hover:bg-blue-400"
              :class="item?.state === 'disabled' ? 'pointer-events-none opacity-50' : ''"
              @click="selectNetwork(item)"
            >
              <img
                class="h-[30px] col-start-1 col-end-2 self-center justify-self-center"
                :src="item.icon"
                alt="service Icon"
              />
              <span
                class="col-start-3 col-end-6 px-4 py-1 flex justify-start items-center outline-0 whitespace-nowrap cursor-pointer text-lg text-gray-200 font-semibold"
                >{{ item.name }}</span
              >
            </li>
          </TransitionGroup> -->
          <div class="w-full col-start-1 col-span-full row-start-2 row-span-full mx-auto flex flex-col justify-start items-center px-2">
            <div class="w-full h-10 flex justify-center items-center">
              <span class="text-center text-gray-200 text-md">{{ inputTitle }}:</span>
            </div>

            <div class="w-full h-20 flex justify-center items-center p-4 bg-[#3d4449] rounded-full">
              <div class="w-full h-full bg-gray-300 rounded-full flex justify-start items-center">
                <input
                  v-model="userSelectedPath"
                  type="text"
                  placeholder="/opt/stereum"
                  class="w-full h-full bg-gray-300 rounded-full px-2 text-lg text-gray-800 font-semibold outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CustomFooter :disabled-btn="nextBtnDisabled" @prepare-stereum="prepareStereum" />
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeMount, watch, watchEffect } from "vue";
import CustomFooter from "./CustomFooter.vue";
import CustomHeader from "./CustomHead.vue";
import ControlService from "@/store/ControlService";
import { useRouter } from "vue-router";
import { useNodeHeader } from "@/store/nodeHeader";
import { useClickInstall } from "@/store/clickInstallation";

// Data

const headerStore = useNodeHeader();
const clickStore = useClickInstall();

const router = useRouter();
const userSelectedPath = ref("/opt/stereum");
const inputTitle = ref("Choose your installation path where Stereum will be installed");
const nextBtnDisabled = ref(false);
const displayItem = ref("Click to select a network");

watch(userSelectedPath, (newValue) => {
  clickStore.installationPath = newValue;
});

watchEffect(() => {
  if (userSelectedPath.value === "") {
    nextBtnDisabled.value = true;
  } else {
    nextBtnDisabled.value = false;
  }
});

// Lifecycle Hooks
onBeforeMount(() => {
  activeBtn();
});

onMounted(() => {
  displayItem.value = "Click to select a network";

  if (clickStore.installationPath === "") {
    getInstallPath();
  }
});

// Methods

const getInstallPath = async () => {
  let largestVolumePath = await ControlService.getLargestVolumePath();
  if (largestVolumePath === "/") largestVolumePath += "opt";
  const stereumInstallationPath = [largestVolumePath, "/stereum"].join("/").replace(/\/{2,}/, "/");
  clickStore.installationPath = stereumInstallationPath;
};

const prepareStereum = async () => {
  router.push("/custom/play");
  headerStore.refresh = false;
  await ControlService.prepareStereumNode(clickStore.installationPath);
  const restarted = await ControlService.restartServer();
  headerStore.refresh = true;
  if (restarted) await new Promise((resolve) => setTimeout(resolve, 5000));
  router.push("/node");
};

const activeBtn = () => {
  return clickStore.installationPath === "" ? "deactivated" : "";
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition-duration: 500;
  opacity: 0;
}

.slide-fade-leave-active {
  transition-duration: 500;
  opacity: 0;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transition-duration: 500;
  transform: translateY(-20px);
}
.custom-layer_parent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  cursor: default;
}

.customInstall_header {
  margin-top: 10px;
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.customInstall_header span {
  width: 60%;
  height: 55%;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  box-shadow: 0 1px 3px 1px rgb(46, 57, 55);
  border-radius: 15px;
  font-size: 2.2rem;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  color: #b4b4b4;
}

.container-box {
  display: flex;
  width: 100%;
  height: 75%;
  position: absolute;
  top: 15%;
  justify-content: center;
  align-items: center;
}

.custom-container {
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 85%;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  box-shadow: 0 1px 3px 1px #1f3737;
  color: #cecece;
  border-radius: 30px;
  justify-content: flex-start;
  align-items: center;
}

.text-container {
  width: 100%;
  height: 33%;
  padding: 3% 4%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: justify;
  font-weight: 400;
}

.path-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 35%;
  width: 100%;
}
.select-network {
  width: 100%;
  height: 28%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.network-selector {
  width: 95%;
  height: 35%;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #1258a2;
  cursor: pointer;
  text-transform: uppercase;
  overflow: hidden;
}
.network-selector:hover {
  background-color: #1258a2;
  transition-duration: 0.3s;
  color: #cecece;
}
.network-selector-icon {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.network-selector-icon img {
  width: 50%;
}
.network-selector-title {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 5%;
}
.network-dropdown {
  width: 55%;
  height: 40%;
  top: 55%;
  background: #1258a2;
  position: absolute;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
}
.networks {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.networks:hover {
  background-color: #cecece;
  transition-duration: 0.2s;
  color: #1258a2;
}
.icon-networks {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-networks img {
  width: 25%;
}
.networks-title {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 5%;
}

.path-title {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
  margin-bottom: 2%;
  margin-left: 8%;
  text-transform: uppercase;
}
.network {
  margin-top: 2%;
}

.textbox-cont {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 68%;
  flex-direction: column;
  border: 1px solid #525a64;
  background-color: #3d4449;
  box-shadow: 0 1px 3px 1px #282a2b;
  border-radius: 20px;
  padding: 10px 20px;
}

.textbox-cont_front {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 88%;
  width: 97%;
  border-radius: 10px;
  flex-direction: column;
}

.textbox-title {
  width: 100%;
  height: 35%;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  font-size: 80%;
  font-weight: 600;
}

.textbox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 65%;
}

.textbox input {
  border: none;
  width: 100%;
  height: 70%;
  padding: 0 2%;
  border-radius: 5px;
  color: #2a2a2a;
  font-weight: 600;
}

.back,
.install {
  width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #929292;
  background-color: #194747;
  box-shadow: 0 1px 3px 1px #1f3737;
  color: #cecece;
  padding: 0 2%;
  border-radius: 30px;
  position: absolute;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
}

.back {
  top: 85%;
  left: 5%;
}

.install {
  top: 85%;
  left: 83%;
}

.deactivated {
  opacity: 80%;
  box-shadow: none;
  pointer-events: none;
}

.back:active,
.install:active {
  transform: scale(0.9);
  box-shadow: none;
}
</style>
