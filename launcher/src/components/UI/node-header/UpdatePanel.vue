<template>
  <div class="w-screen h-screen absolute inset-0 flex justify-end items-center">
    <div class="w-full h-screen absolute inset-0 bg-black opacity-50 z-30 rounded-lg" @click="clickOutside"></div>
    <Transition name="slide-fade">
      <div
        v-if="show"
        class="w-[400px] delay-100 transition-transform h-full justify-self-end flex flex-col justify-between items-center border-y border-l border-gray-500 z-40 rounded-tl-lg rounded-bl-lg duration-300 bg-[#264744] p-4"
        @mouseleave="hidePanel"
      >
        <div class="max-h-full bg-[#171a1c] rounded-md grid grid-cols-2 grid-rows-12 py-2">
          <div class="col-start-1 col-span-3 row-start-1 row-span-6">
            <div class="w-full h-full grid grid-cols-3 grid-rows-4 p-1">
              <div class="w-full col-start-1 col-end-4 row-start-1 row-span-1 grid grid-cols-12 grid-rows-3">
                <div class="col-start-1 col-end-3 row-start-1 row-end-4 flex justify-center items-center p-1">
                  <img class="w-2/3" src="/img/icon/control/ubuntuIco.svg" />
                </div>
                <div class="col-start-3 col-end-13 row-start-1 row-end-4 grid grid-cols-12 grid-rows-3 p-1">
                  <span
                    class="col-start-1 col-end-10 row-start-1 row-span-1 self-center text-[18px] font-bold text-[#4B878D] text-left uppercase justify-self-start py-1"
                    >{{ $t("updatePanel.osTitle") }}</span
                  >
                  <div class="col-start-1 col-end-6 row-start-2 row-span-1 flex justify-between items-center">
                    <div class="col-start-1 col-span-3 row-start-1 row-span-1 text-[10px] text-gray-300 font-semibold">
                      <span>{{ $t("updatePanel.version") }}:</span>
                    </div>
                    <div
                      class="col-start-4 col-span-3 row-start-1 row-span-1 text-[10px] text-amber-400 font-semibold mr-3"
                    >
                      <span>{{ osVersionCurrent }}</span>
                    </div>
                  </div>
                  <div class="col-start-1 col-end-6 row-start-3 row-span-1 flex justify-between items-center">
                    <div class="col-start-1 col-span-3 row-start-1 row-span-1 text-[10px] text-gray-300 font-semibold">
                      <span>{{ $t("updatePanel.available") }}:</span>
                    </div>
                    <div
                      class="col-start-4 col-span-3 row-start-2 row-span-1 text-[10px] flex justify-center items-center mr-3"
                    >
                      <div
                        v-if="!nodeHeaderStore.searchingForOsUpdates || nodeHeaderStore.osUpdating"
                        class="w-[17px] h-[17px] bg-red-700 rounded-full p-1 text-[10px] text-gray-200 text-center flex justify-center items-center mr-2"
                      >
                        <span>{{ nodeHeaderStore.osVersionLatest ? nodeHeaderStore.osVersionLatest : 0 }}</span>
                      </div>
                      <img
                        v-if="nodeHeaderStore.searchingForOsUpdates && !nodeHeaderStore.osUpdating"
                        class="w-5 h-5 spinner mr-2"
                        src="/img/icon/control/loading_circle.gif"
                      />
                    </div>
                  </div>
                  <div
                    class="col-start-9 col-end-13 row-start-1 row-span-2 flex justify-between items-center space-x-1"
                  >
                    <div
                      class="w-[50px] h-[20px] bg-cyan-300 hover:bg-cyan-600 flex justify-center items-center p-1 rounded-sm cursor-pointer active:scale-95 transition-transform"
                      @click="searchOsUpdates"
                    >
                      <img class="w-4" src="/img/icon/header-icons/search.png" alt="icon" />
                    </div>
                    <div
                      class="w-[50px] h-[20px] bg-teal-600 hover:bg-teal-800 flex justify-center items-center p-1 rounded-sm cursor-pointer active:scale-95 transition-transform"
                      :class="{ disabled: nodeHeaderStore.osVersionLatest === 0 || nodeHeaderStore.osUpdating }"
                      @click="$emit('runOsUpdate')"
                    >
                      <img class="w-4" src="/img/icon/node-icons/download2.png" alt="icon" />
                    </div>
                  </div>
                  <div
                    v-if="
                      nodeHeaderStore.searchingForOsUpdates &&
                      nodeHeaderStore.searchingForOsUpdatesManual &&
                      !nodeHeaderStore.osUpdating
                    "
                    class="col-start-8 col-end-13 row-start-3 row-span-1 flex justify-start items-center"
                  >
                    <span class="circle pulse mr-2"></span>
                    <span class="text-[9px] text-gray-200">{{ $t("updatePanel.searching") }}</span>
                  </div>
                </div>
              </div>
              <div class="w-full col-start-1 col-end-4 row-start-2 row-span-1 grid grid-cols-12 grid-rows-3">
                <div class="col-start-1 col-end-3 row-start-1 row-end-4 flex justify-center items-center p-1">
                  <img class="w-2/3" src="/img/icon/stereum-logo/stereum_logo_extern.png" />
                </div>
                <div class="col-start-3 col-end-13 row-start-1 row-end-4 grid grid-cols-12 grid-rows-3 p-1">
                  <span
                    class="col-start-1 col-end-10 row-start-1 row-span-1 self-center text-[18px] font-bold text-[#4B878D] text-left uppercase justify-self-start py-1"
                    >{{ $t("updatePanel.launcherTitle") }}</span
                  >
                  <div class="col-start-1 col-end-6 row-start-2 row-span-1 grid grid-cols-">
                    <div class="col-start-1 col-span-3 row-start-1 row-span-1 text-[10px] text-gray-300 font-semibold">
                      <span>{{ $t("updatePanel.current") }}:</span>
                    </div>
                    <div
                      class="col-start-6 col-span-3 row-start-1 row-span-1 text-[10px] text-amber-400 font-semibold ml-2"
                    >
                      <span>{{ serviceStore?.launcherVersion }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full col-start-1 col-end-4 row-start-3 row-span-1 grid grid-cols-12 grid-rows-3">
                <div class="col-start-1 col-end-3 row-start-1 row-end-4 flex justify-center items-center p-1">
                  <img class="w-2/3" src="/img/icon/stereum-logo/stereum_logo_extern.png" />
                </div>
                <div class="col-start-3 col-end-13 row-start-1 row-end-4 grid grid-cols-12 grid-rows-3 p-1">
                  <span
                    class="col-start-1 col-end-10 row-start-1 row-span-1 self-center text-[18px] font-bold text-[#4B878D] text-left uppercase justify-self-start py-1"
                    >{{ $t("updatePanel.nodeTitle") }}</span
                  >
                  <div class="col-start-1 col-end-6 row-start-2 row-span-1 flex justify-between items-center">
                    <div class="col-start-1 col-span-3 row-start-1 row-span-1 text-[10px] text-gray-300 font-semibold">
                      <span>{{ $t("updatePanel.current") }}:</span>
                    </div>
                    <div class="col-start-4 col-span-3 row-start-1 row-span-1 text-[10px] text-amber-400 font-semibold">
                      <span>{{ nodeHeaderStore.stereumUpdate.current }}</span>
                    </div>
                  </div>
                  <div class="col-start-1 col-end-6 row-start-3 row-span-1 flex justify-between items-center">
                    <div class="col-start-1 col-span-3 row-start-1 row-span-1 text-[10px] text-gray-300 font-semibold">
                      <span>{{ $t("updatePanel.latest") }}:</span>
                    </div>
                    <div class="col-start-4 col-span-3 row-start-1 row-span-1 text-[10px] text-amber-400 font-semibold">
                      <span>{{ nodeHeaderStore.stereumUpdate?.version }}</span>
                    </div>
                  </div>
                  <div
                    class="col-start-9 col-end-13 row-start-1 row-span-2 flex justify-between items-center space-x-1"
                  >
                    <div
                      class="w-[50px] h-[20px] bg-cyan-300 hover:bg-cyan-600 flex justify-center items-center p-1 rounded-sm cursor-pointer active:scale-95 transition-transform"
                      @click="searchUpdate"
                    >
                      <img class="w-4" src="/img/icon/header-icons/search.png" alt="icon" />
                    </div>
                    <div
                      class="w-[50px] h-[20px] bg-teal-600 hover:bg-teal-800 flex justify-center items-center p-1 rounded-sm cursor-pointer active:scale-95 transition-transform"
                      :class="{ disabled: !checkStereumUpdate || nodeHeaderStore.updating }"
                      @click="$emit('runUpdate', nodeHeaderStore.stereumUpdate)"
                    >
                      <img class="w-4" src="/img/icon/node-icons/download2.png" alt="icon" />
                    </div>
                  </div>

                  <div
                    v-if="checkStereumUpdate"
                    class="col-start-8 col-end-13 row-start-3 row-span-1 flex justify-start items-center"
                  >
                    <div class="updateIcon">
                      <img src="/img/icon/header-icons/update-green.png" alt="icon" />
                    </div>
                    <span class="availableText"
                      >{{ nodeHeaderStore.stereumUpdate.version }} {{ $t("updatePanel.available") }}</span
                    >
                  </div>
                  <div
                    v-if="nodeHeaderStore.searchingForUpdates && !checkStereumUpdate"
                    class="col-start-8 col-end-13 row-start-3 row-span-1 flex justify-start items-center"
                  >
                    <span class="circle pulse mr-2"></span>
                    <span class="text-[9px] text-gray-200">{{ $t("updatePanel.searching") }}</span>
                  </div>
                </div>
              </div>
              <div class="w-full col-start-1 col-end-4 row-start-4 row-span-1 grid grid-cols-12 grid-rows-2">
                <div class="col-start-1 col-end-3 row-start-1 row-end-3 flex justify-center items-center p-1">
                  <img class="w-2/3" src="/img/icon/click-installation/mainnet-icon.png" />
                </div>
                <div class="col-start-3 col-end-13 row-start-1 row-end-3 grid grid-cols-12 grid-rows-2 p-1">
                  <span
                    class="col-start-1 col-end-10 row-start-1 row-span-1 self-center text-[18px] font-bold text-[#4B878D] text-left uppercase justify-self-start py-1"
                    >{{ $t("updatePanel.serviceTitle") }}</span
                  >
                  <span
                    class="col-start-1 col-end-13 row-start-2 row-span-1 self-start text-[10px] font-semibold text-gray-300 text-left uppercase justify-self-start py-1"
                    >{{ $t("updatePanel.serviceDesc") }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="col-start-1 col-span-3 row-start-7 row-span-5 flex flex-col justify-between items-center">
            <div class="w-full h-[200px] flex justify-center items-center mx-auto px-1">
              <div
                class="w-full h-full flex flex-col justify-start items-center bg-[#334d4d] border border-gray-500 rounded-sm"
              >
                <div
                  class="w-full h-[28px] flex justify-center items-center p-1 space-x-4 border-b border-gray-500 bg-teal-800"
                >
                  <div class="w-5 h-5 bg-[#243d36] rounded-full p-1">
                    <img class="w-3" src="/img/icon/header-icons/update-green.png" alt="icon" />
                  </div>
                  <span class="text-center text-sm text-gray-300 font-semibold">{{
                    $t("updatePanel.availablePlugin")
                  }}</span>
                </div>
                <div
                  class="w-full h-[170px] max-h-[170px] flex flex-col justify-start items-center bg-[#1c2021] overflow-x-hidden overflow-y-auto gap-1 pt-1"
                >
                  <div
                    v-for="(item, index) in serviceStore.newUpdates"
                    :key="index"
                    class="w-full h-[30px] flex justify-between items-center p-1 mx-auto bg-[#334d4d] text-gray-300 font-semibold text-md"
                  >
                    <div
                      v-if="item.running || nodeHeaderStore.updating"
                      class="w-[50px] h-[25px] p-1 flex justify-center items-center bg-gray-700 rounded-sm user-select-none pointer-events-none cursor-not-allowed"
                    >
                      <img class="w-5" src="/img/icon/node-icons/download_disabled.png" alt="icon" />
                    </div>
                    <div
                      v-else
                      class="w-[50px] h-[25px] p-1 flex justify-center items-center bg-[#4d7575] hover:bg-[#243535] rounded-sm cursor-pointer active:scale-95 transition-transform"
                      @click="$emit('runUpdate', item)"
                    >
                      <img class="w-5" src="/img/icon/node-icons/download2.png" alt="icon" />
                    </div>
                    <div class="serviceName">
                      <span>{{ item.name }}</span>
                    </div>
                    <div class="version">
                      <span>{{ item.version }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-start-1 col-span-3 row-start-12 row-end-13 w-full h-full flex justify-evenly items-center">
            <div class="w-1/2 h-full flex justify-center items-center p-1">
              <div
                class="w-2/3 h-full flex justify-evenly items-center bg-[#334d4d] border border-gray-500 rounded-sm text-gray-400 text-sm font-semibold hover:bg-[#243535] transition-colors cursor-pointer active:scale-95"
                :class="{
                  disabled: (!checkAvailableServicesNewUpdate && !checkStereumUpdate) || nodeHeaderStore.updating,
                }"
                @click.prevent.stop="$emit('updateConfirm')"
              >
                <span>{{ $t("updatePanel.all") }}</span>
                <img class="w-4" src="/img/icon/node-icons/download2.png" alt="icon" />
              </div>
            </div>
            <div class="w-1/2 h-full flex justify-center items-center p-1">
              <span class="text-gray-400 text-sm font-semibold"
                >{{ $t("updatePanel.auto") }} :
                <span class="autoUpdateText_status" :class="onOff">{{ stereumApp.autoUpdate }}</span></span
              >
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import ControlService from "@/store/ControlService";
import { useServices } from "@/store/services.js";
import { useNodeHeader } from "@/store/nodeHeader";
import { onMounted, computed, ref, watchEffect } from "vue";
import { useUpdateCheck } from "@/composables/version.js";

//Emits
const emit = defineEmits(["clickOutside"]);
//refs
const show = ref(false);
//Stores
const serviceStore = useServices();
const nodeHeaderStore = useNodeHeader();

//Data
const stereumApp = ref({
  current: "alpha",
  latest: "2.0",
  autoUpdate: "",
});
const osVersionCurrent = ref("-");

//Computed
const onOff = computed(() => {
  return {
    green: stereumApp.value.autoUpdate === "on",
    red: stereumApp.value.autoUpdate === "off",
  };
});

watchEffect(() => {
  if (nodeHeaderStore.displayUpdatePanel) {
    setTimeout(() => {
      show.value = true;
    });
  }
});

//on Mounted
onMounted(async () => {
  useUpdateCheck();
  getSettings();
  await getOsVersion();
  await searchOsUpdates();
});

//Methods

const hidePanel = () => {
  show.value = false;
  setTimeout(() => {
    nodeHeaderStore.displayUpdatePanel = false;
  }, 500);
};

const clickOutside = () => {
  emit("clickOutside");
};
const searchUpdate = () => {
  useUpdateCheck();
};

const checkStereumUpdate = computed(() => {
  if (nodeHeaderStore.stereumUpdate && nodeHeaderStore.stereumUpdate.version)
    return nodeHeaderStore.stereumUpdate.commit != nodeHeaderStore.stereumUpdate.current_commit ? true : false;
  return false;
});

const checkAvailableServicesNewUpdate = computed(() => {
  if (serviceStore.newUpdates.length <= 0) return false;
  return true;
});

const getSettings = async () => {
  let settings = await ControlService.getStereumSettings();
  if (settings.stereum?.settings.updates.unattended.install) {
    stereumApp.value.autoUpdate = "on";
  } else {
    stereumApp.value.autoUpdate = "off";
  }
};

const searchOsUpdates = async (manual = false) => {
  if (nodeHeaderStore.osUpdating) {
    nodeHeaderStore.searchingForOsUpdates = false;
    nodeHeaderStore.searchingForOsUpdatesManual = false;
    return;
  }
  if (nodeHeaderStore.searchingForOsUpdates) {
    return;
  }
  nodeHeaderStore.searchingForOsUpdates = true;
  if (manual) {
    nodeHeaderStore.searchingForOsUpdatesManual = true;
  }
  await getUpdatablePackagesCount();
  nodeHeaderStore.searchingForOsUpdates = false;
  nodeHeaderStore.searchingForOsUpdatesManual = false;
};

const getUpdatablePackagesCount = async () => {
  try {
    const packagesCount = await ControlService.getCountOfUpdatableOSUpdate();
    const numPackages = Number(packagesCount);
    nodeHeaderStore.osVersionLatest = isNaN(numPackages) || !numPackages ? 0 : numPackages;
    nodeHeaderStore.isOsUpdateAvailable = nodeHeaderStore.osVersionLatest ? true : false;
    return nodeHeaderStore.osVersionLatest;
  } catch (error) {
    nodeHeaderStore.osVersionLatest = 0;
    nodeHeaderStore.isOsUpdateAvailable = false;
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
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-in-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(405px);
  opacity: 0.5;
}
.slide-fade-leave-to {
  transform: translateX(405px);
  opacity: 0.5;
}
.no-events {
  pointer-events: none;
}
.green {
  color: #7bbb1a;
}
.red {
  color: #c70505;
}

.white {
  color: white !important;
}

.red-circle {
  color: white !important;
  background-color: #c70505;
  width: 20px;
  height: 20px;
  padding: 4px;
  border-radius: 30px;
  text-align: center;
  cursor: default;
}
.spinner {
  padding: 0px;
}

.panelParent {
  width: 36%;
  height: 91%;
  position: fixed;
  top: 10%;
  right: -37%;
  z-index: 310;
  transition-duration: 300ms;
}
.clickOutside {
  width: 100vw;
  height: 91vh;
  position: fixed;
  left: 0;
  top: 52px;
  border-radius: 0 35px 0 0;
  z-index: 311;
}
.panelContent {
  width: 100%;
  height: 100%;
  border-radius: 1rem 0 0 1rem;
  background-color: #2a2f32;
  border: 2px solid rgb(107, 107, 107);
  border-right: none;
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: -6px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stereumUpdates {
  width: 100%;
  height: 40%;
  padding: 10px;
}
.serviceUpdates {
  width: 100%;
  height: 53%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.nodeUpdate-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #375b5c;
  margin-left: 15px;
  margin-top: 10px;
  text-transform: uppercase;
}
.nodeUpdate-title_row {
  width: 100%;
  height: 20%;
  display: flex;
  font-size: 1.1rem;
  font-weight: 800;
  color: #4b8789;
  margin-left: 1.5%;
  text-transform: uppercase;
}

.serviceUpdates-titleWithIcon {
  display: flex;
  padding: 0 10px;
}

.serviceUpdates-titleWithIcon > .icon > img,
.stereum-updateBoxWithIcon > .icon > img {
  width: 25px;
  border: 1px solid #d6d6d6;
  border-radius: 50%;
  box-shadow: 1px 1px 5px 1px #252525;
}

.launcherUpdate,
.serviceUpdates-title {
  width: 100%;
  /* height: 20%; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.launcherUpdate .title,
.serviceUpdates-title .title {
  font-size: 100%;
  font-weight: 800;
  color: #4b8789;
  margin-left: 5px;
  text-transform: uppercase;
}
.description,
.description {
  font-size: 0.7rem;
  font-weight: 400;
  color: #c7c7c7;
  margin-left: 5px;
}

.launcherBox {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.launcherBox .currentLauncher {
  width: 17%;
  margin-left: 15px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #c6c6c6;
  align-self: center;
}
.launcherBox .valueLauncher {
  width: max-content;
  font-size: 0.8rem;
  font-weight: 400;
  margin-left: 33px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #b4b443;
  text-align: left;
}

.stereum-updateBoxesWrapper {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
}

.stereum-updateBoxWithIcon {
  display: flex;
  margin-top: 5px;
}
.stereum-updateBox {
  width: 94%;
  height: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
}
.versionContainer {
  display: flex;
  width: 100%;
  height: 40%;
  position: relative;
}
.stereum-updateBox .versionBox {
  width: 60%;
  height: 100%;
  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: repeat(2, 1fr);
  overflow: hidden;
  text-overflow: ellipsis;
}
.stereum-updateBox .versionBox #current {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 100%;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #c6c6c6;
  margin-left: 5px;
  justify-self: flex-start;
  align-self: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stereum-updateBox .versionBox #currentValue {
  width: 100%;
  height: 100%;
  grid-column: 2/3;
  grid-row: 1/2;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #b4b443;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: flex-start;
  align-self: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.stereum-updateBox .versionBox #latest {
  grid-column: 1/2;
  grid-row: 2/3;
  width: 100%;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #c6c6c6;
  margin-left: 5px;
  justify-self: flex-start;
  align-self: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.stereum-updateBox .versionBox #latestValue {
  width: 100%;
  max-width: max-content;
  height: 100%;
  grid-column: 2/3;
  grid-row: 2/3;
  font-size: 0.6rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #b4b443;
  justify-self: center;
  align-self: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#currentValue span,
#latestValue span {
  width: 100%;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #b4b443;
  justify-self: center;
  align-self: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
#latestValue .redCircle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ec110e;
  display: flex;
  justify-content: center;
  align-items: center;
}
#latestValue .redCircle span {
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
}
.stereum-updateBox .versionBox #autoUpdate {
  grid-column: 1/2;
  grid-row: 3/4;
  width: 100%;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #c6c6c6;
  margin-left: 5px;
  justify-self: flex-start;
  align-self: center;
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
}
.stereum-updateBox .versionBox #updateStatus {
  grid-column: 2/3;
  grid-row: 3/4;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #37614b;
  justify-self: center;
  align-self: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btnBox {
  width: 40%;
  height: 100%;
  max-height: 33px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(12, 1fr);
}
.btnBox .searchBtn {
  grid-column: 1/4;
  grid-row: 2/9;
  border-radius: 3px;
  margin-left: 10px;
  box-shadow: 0 1px 3px 1px rgb(42, 42, 42);
  width: 70%;
  height: 100%;
  min-height: 20px;
  border: 1px solid #17a2b8;
  background-color: #17a2b8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.btnBox .searchBtn img {
  width: 30%;
  height: 70%;
}
.btnBox .searchBtn:hover {
  background-color: #028397;
}
.btnBox .searchBtn:active {
  border-color: #028397;
  box-shadow: none;
}
.btnBox .downloadBtn {
  grid-column: 4/7;
  grid-row: 2/9;
  margin-right: 20px;
  border: 1px solid #067c5a;
  border-radius: 3px;
  width: 70%;
  height: 100%;
  min-height: 20px;
  background-color: #067c5a;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.btnBox .downloadBtn img {
  width: 40%;
  height: 90%;
}
.btnBox .downloadBtn:hover {
  background-color: rgb(3, 82, 60);
}
.btnBox .downloadBtn:active {
  border-color: rgb(3, 82, 60);
  box-shadow: none;
}
.available {
  grid-column: 1/7;
  grid-row: 10/12;
  margin-left: 0;
  width: 90%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.updateIcon {
  grid-column: 2/3;
  grid-row: 1;
  width: 75%;
  height: 100%;
  background-color: rgb(59, 103, 100);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  justify-self: flex-start;
}
.btnBox .available .updateIcon img {
  width: 50%;
  justify-self: flex-start;
}

.btnBox .available .availableText {
  grid-column: 3/7;
  grid-row: 1;
  width: max-content;
  font-size: 60%;
  font-weight: 600;
  color: #c6c6c6;
  align-self: center;
  text-align: left;
}
.available .searchingText {
  grid-column: 2/7;
  grid-row: 1;
  width: max-content;
  font-size: 45%;
  font-weight: 600;
  color: #c6c6c6;
  align-self: center;
  text-align: center;
  justify-self: center;
}
.circle {
  grid-column: 1/2;
  grid-row: 1;
  width: 10px;
  height: 10px;
  background: #17a3b8b3;
  border-radius: 50%;
  box-shadow: 0px 0px 1px 1px #666666;
  align-self: center;
  justify-self: flex-end;
}
.pulse {
  animation: pulse-animation 1s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px #6379737d;
  }
  100% {
    box-shadow: 0 0 0 10px #2e353363;
  }
}

.service-updateBox {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-self: center;
  padding: 5px;
}
.service-updateBox .availableTable {
  width: 100%;
  height: 100%;
  background-color: #334d4d;
  border: 2px solid #373737;
  padding: 5px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-self: center;
  position: relative;
}
.service-updateBox .availableTable .tableHeader {
  width: 100%;
  height: 11%;
  background-color: #356262;
  border-radius: 3px;
  padding: 2px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
}
.tableHeader .tableUpdateIcon {
  grid-column: 4/5;
  grid-row: 1;
  width: 48%;
  height: 100%;
  background-color: #2a4940;
  border-radius: 100%;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: center;
}
.tableHeader .tableUpdateIcon img {
  width: 80%;
  height: 80%;
}
.tableHeader span {
  grid-column: 5/10;
  grid-row: 1;
  width: max-content;
  font-size: 60%;
  font-weight: 600;
  color: #c6c6c6;
  text-transform: uppercase;
  align-self: center;
  justify-self: flex-start;
}
.service-updateBox .availableTable .tableContent {
  width: 100%;
  height: 89%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.tableContent::-webkit-scrollbar {
  width: 1px;
}
.availableTable .tableContent .tableRow {
  width: 100%;
  height: 30px;
  background-color: #2a2f32;
  margin-top: 3px;
  border: 2px solid rgb(107, 107, 107);
  border-radius: 5px;
  display: grid;
  grid-template-columns: 25% 45% 30%;
  /* display: flex;
  justify-content: space-between;
  align-items: center; */
}
.tableContent .tableRow .downloadBtn {
  grid-column: 1/2;
  width: 100%;
  height: 99%;
  margin: 0 auto;
  background-color: #067c5a;
  border-radius: 3px;
  border: 1px solid #0a5741;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.tableContent .tableRow .downloadBtnDisabled {
  grid-column: 1/2;
  width: 100%;
  height: 98%;
  margin: 0 auto;
  background-color: #7c7c7c;
  border-radius: 3px;
  border: 1px solid #4d4d4d;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tableContent .tableRow .downloadBtn:hover {
  background-color: rgb(3, 82, 60);
}
.tableContent .tableRow .downloadBtn:active {
  border: none;
  box-shadow: none;
  transform: scale(0.95);
}
.tableContent .tableRow .downloadBtn img {
  width: 25%;
  height: 80%;
}
.tableContent .tableRow .downloadBtnDisabled img {
  width: 25%;
  height: 80%;
}
.availableTable .tableContent .tableRow .serviceName {
  grid-column: 2/3;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.availableTable .tableContent .tableRow .serviceName span {
  font-size: 0.8rem;
  font-weight: 500;
  color: #c6c6c6;
  text-transform: uppercase;
}

.availableTable .tableContent .tableRow .version {
  grid-column: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.availableTable .tableContent .tableRow .version span {
  font-size: 0.8rem;
  font-weight: 500;
  color: #b4b443;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.updateAllBtnBox {
  width: 100%;
  height: 10%;
  background-color: transparent;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  bottom: 0;
}
.updateAllBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45%;
  height: 100%;
}
.updateAllBtnBox .confirmUpdate {
  width: 80%;
  height: 50%;
  background-color: #067c5a;
  border-radius: 3px;
  border: 2px solid #067c5a;
  box-shadow: 0 1px 3px 1px rgb(46, 46, 46);
  color: #c6c6c6;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  transition-duration: 50ms;
}
.autoUpdateText {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #c6c6c6;
  width: 45%;
  height: 100%;
  font-size: 80%;
}
.autoUpdateText_status {
  font-weight: 800;
  text-transform: uppercase;
}

.updateAllBtnBox .confirmUpdate img {
  width: 13%;
  height: 70%;
  max-width: 13px;
  max-height: 15px;
}
.updateAllBtnBox .confirmUpdate span {
  font-size: 73%;
  font-weight: 700;
  color: #c6c6c6;
  text-transform: uppercase;
}
.updateAllBtnBox .confirmUpdate:hover {
  background-color: rgb(3, 82, 60);
}
.updateAllBtnBox .confirmUpdate:active {
  border: none;
  box-shadow: none;
  transform: scale(0.95);
}
/* .btnBox .confirmUpdate:hover {
  transform: scale(1.05);
  color: #c6c6c6;
  border: 2px solid #63957d;
}
.btnBox .confirmUpdate:active {
  box-shadow: none;
  transform: scale(1);
  border: none;
} */

.disabled {
  pointer-events: none;
  background-color: #3d4244 !important;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
