<template>
  <div class="w-screen h-screen absolute inset-0 flex justify-end items-center">
    <div class="w-full h-full absolute inset-0 bg-black opacity-50 z-30 rounded-lg" @click="clickOutside"></div>
    <Transition name="slide-fade">
      <div
        v-if="show"
        class="w-[400px] delay-100 transition-transform h-full justify-self-end flex flex-col justify-between items-center z-40 rounded-md duration-300 bg-[#264744] p-4 mr-1 mb-1"
        @mouseleave="hidePanel"
      >
        <div class="max-h-full bg-[#171a1c] rounded-md grid grid-cols-2 grid-rows-12 py-2">
          <div class="col-start-1 col-span-3 row-start-1 row-span-6">
            <div class="w-full h-full grid grid-cols-3 grid-rows-4 p-1 gap-y-2">
              <div class="w-full col-start-1 col-end-4 row-start-1 row-span-1 grid grid-cols-12 grid-rows-3">
                <div class="col-start-1 col-end-3 row-start-1 row-end-4 flex justify-center items-center p-1">
                  <img class="w-4/5" src="/img/icon/base-header-icons/update-modal-os-update-icon.png" />
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
                    <div class="col-start-4 col-span-3 row-start-1 row-span-1 text-[10px] text-amber-400 font-semibold mr-3">
                      <span>{{ osVersionCurrent }}</span>
                    </div>
                  </div>
                  <div class="col-start-1 col-end-6 row-start-3 row-span-1 flex justify-between items-center">
                    <div class="col-start-1 col-span-3 row-start-1 row-span-1 text-[10px] text-gray-300 font-semibold">
                      <span>{{ $t("updatePanel.available") }}:</span>
                    </div>
                    <div class="col-start-4 col-span-3 row-start-2 row-span-1 flex justify-center items-center">
                      <img
                        v-if="searchingForOsUpdates"
                        class="w-5 h-5 spinner self-center justify-self-start mr-5"
                        src="/animation/loading/loading-circle.gif"
                      />
                      <div
                        v-else
                        class="w-4 h-4 bg-red-700 rounded-full p-1 text-[10px] text-gray-200 text-center flex justify-center items-center mr-5"
                      >
                        <span>{{ serverStore.numberOfUpdatablePackages }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-start-9 col-end-13 row-start-1 row-span-2 flex justify-between items-center space-x-1">
                    <div
                      class="w-[100px] h-[30px] bg-teal-800 hover:bg-teal-900 flex justify-center items-center p-1 rounded-md cursor-pointer active:scale-95 transition-transform"
                      @click="openOsUpdatePanel"
                    >
                      <img
                        class="w-5"
                        src="/img/icon/base-header-icons/update-modal-open-button.png"
                        alt="Open Icon"
                        @mousedown.prevent
                        @mouseenter="footerStore.cursorLocation = `${openButton}`"
                        @mouseleave="footerStore.cursorLocation = ''"
                      />
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full col-start-1 col-end-4 row-start-2 row-span-1 grid grid-cols-12 grid-rows-3">
                <div class="col-start-1 col-end-3 row-start-1 row-end-4 flex justify-center items-center p-1">
                  <img class="w-4/5" src="/img/icon/base-header-icons/update-modal-stereum-launcher-update-icon.png" />
                </div>
                <div class="col-start-3 col-end-13 row-start-1 row-end-4 grid grid-cols-12 grid-rows-3 p-1">
                  <span
                    class="col-start-1 col-end-10 row-start-1 row-span-1 self-center text-[18px] font-bold text-[#4B878D] text-left uppercase justify-self-start py-1"
                    >{{ $t("updatePanel.launcherTitle") }}</span
                  >
                  <div class="col-start-1 col-end-12 row-start-2 row-span-1 grid grid-cols-12">
                    <div class="col-start-1 col-span-3 row-start-1 row-span-1 text-[10px] text-gray-300 font-semibold">
                      <span>{{ $t("updatePanel.current") }}:</span>
                    </div>
                    <div class="col-start-4 col-span-3 row-start-1 row-span-1 text-[10px] text-amber-400 font-semibold ml-2">
                      <span>{{ serviceStore?.launcherVersion }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full col-start-1 col-end-4 row-start-3 row-span-1 grid grid-cols-12 grid-rows-3">
                <div class="col-start-1 col-end-3 row-start-1 row-end-4 flex justify-center items-center p-1">
                  <img class="w-4/5" src="/img/icon/base-header-icons/update-modal-stereum-launcher-update-icon.png" />
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
                      <span>{{ headerStore.stereumUpdate.current }}</span>
                    </div>
                  </div>
                  <div class="col-start-1 col-end-6 row-start-3 row-span-1 flex justify-between items-center">
                    <div class="col-start-1 col-span-3 row-start-1 row-span-1 text-[10px] text-gray-300 font-semibold">
                      <span>{{ $t("updatePanel.latest") }}:</span>
                    </div>
                    <div class="col-start-4 col-span-3 row-start-1 row-span-1 text-[10px] text-amber-400 font-semibold">
                      <span>{{ headerStore.stereumUpdate?.version }}</span>
                    </div>
                  </div>
                  <div class="col-start-9 col-end-13 row-start-1 row-span-2 flex justify-between items-center space-x-1">
                    <div
                      class="w-[50px] h-[20px] bg-cyan-300 hover:bg-cyan-600 flex justify-center items-center p-1 rounded-sm cursor-pointer active:scale-95 transition-transform"
                      @click="searchUpdate"
                    >
                      <img class="w-4" src="/img/icon/base-header-icons/update-modal-search-button.png" alt="icon" />
                    </div>
                    <div
                      class="w-[50px] h-[20px] bg-teal-600 hover:bg-teal-800 flex justify-center items-center p-1 rounded-sm cursor-pointer active:scale-95 transition-transform"
                      :class="{
                        'opacity-40 pointer-events-none bg-[#3d4244] scale-95': !checkStereumUpdate || headerStore.updating,
                      }"
                      @click="$emit('runUpdate', headerStore.stereumUpdate)"
                    >
                      <img class="w-4" src="/img/icon/base-header-icons/update-modal-download.png" alt="icon" />
                    </div>
                  </div>

                  <div v-if="checkStereumUpdate" class="col-start-8 col-end-13 row-start-3 row-span-1 flex justify-start items-center ml-4">
                    <div class="w-[15px] h-[15px] rounded-full bg-teal-600 flex justify-center items-center p-1">
                      <img class="w-2 h-2" src="/img/icon/base-header-icons/header-update-button-green.png" alt="icon" />
                    </div>
                    <span class="text-[8px] text-gray-200 font-semibold ml-2"
                      >{{ headerStore.stereumUpdate.version }} {{ $t("updatePanel.available") }}</span
                    >
                  </div>
                  <div
                    v-if="headerStore.searchingForUpdates && !checkStereumUpdate"
                    class="col-start-8 col-end-13 row-start-3 row-span-1 flex justify-start items-center"
                  >
                    <span class="circle pulse mr-2"></span>
                    <span class="text-[9px] text-gray-200">{{ $t("updatePanel.searching") }}</span>
                  </div>
                </div>
              </div>
              <div class="w-full col-start-1 col-end-4 row-start-4 row-span-1 grid grid-cols-12 grid-rows-2">
                <div class="col-start-1 col-end-3 row-start-1 row-end-3 flex justify-center items-center p-1">
                  <img class="w-4/5" src="/img/icon/base-header-icons/update-modal-plugin-update-icon.png" />
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
              <div class="w-full h-full flex flex-col justify-start items-center bg-[#334d4d] border border-gray-500 rounded-sm">
                <div class="w-full h-[28px] flex justify-center items-center p-1 space-x-4 border-b border-gray-500 bg-teal-800">
                  <div class="w-5 h-5 bg-[#243d36] rounded-full p-1">
                    <img class="w-3" src="/img/icon/base-header-icons/header-update-button-green.png" alt="icon" @click="copyUpdates" />
                  </div>
                  <span class="text-center text-sm text-gray-300 font-semibold">{{ $t("updatePanel.availablePlugin") }}</span>
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
                      v-if="item.running || headerStore.updating"
                      class="w-[50px] h-[25px] p-1 flex justify-center items-center bg-gray-700 rounded-sm user-select-none pointer-events-none cursor-not-allowed"
                    >
                      <img class="w-5" src="/img/icon/base-header-icons/update-modal-download-disabled.png" alt="icon" />
                    </div>
                    <div
                      v-else
                      class="w-[50px] h-[25px] p-1 flex justify-center items-center bg-[#4d7575] hover:bg-[#243535] rounded-sm cursor-pointer active:scale-95 transition-transform"
                      @click="$emit('runUpdate', item)"
                    >
                      <img class="w-5" src="/img/icon/base-header-icons/update-modal-download.png" alt="icon" />
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
                  'opacity-40 pointer-events-none bg-[#3d4244] scale-95':
                    (!checkAvailableServicesNewUpdate && !checkStereumUpdate) || headerStore.updating,
                }"
                @click.prevent.stop="updateConfirm"
              >
                <span>{{ $t("updatePanel.all") }}</span>
                <img class="w-4" src="/img/icon/base-header-icons/update-modal-download.png" alt="icon" />
              </div>
            </div>
            <div class="w-1/2 h-full flex justify-center items-center p-1">
              <span class="text-gray-400 text-md font-semibold"
                >{{ $t("updatePanel.auto") }} :
                <span class="text-md uppercase font-semibold" :class="onOff">{{ stereumApp.autoUpdate }}</span></span
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
import { useUpdateCheck, useUpgradablePackages } from "@/composables/version.js";
import { useServers } from "@/store/servers";
import { useFooter } from "@/store/theFooter";

//Emits
const emit = defineEmits(["clickOutside", "updateConfirm"]);
//refs
const show = ref(false);
//Stores
const serviceStore = useServices();
const serverStore = useServers();
const headerStore = useNodeHeader();
const footerStore = useFooter();

const openButton = ref("Open OS Update Panel");

const { getUpgradablePackages } = useUpgradablePackages();

//Data
const stereumApp = ref({
  current: "alpha",
  latest: "2.0",
  autoUpdate: "",
});
const osVersionCurrent = ref("-");

const searchingForOsUpdates = ref(false);

//Computed
const onOff = computed(() => {
  if (stereumApp.value.autoUpdate == "on") {
    return "text-green-700";
  } else {
    return "text-red-700";
  }
});

watchEffect(() => {
  if (headerStore.displayUpdatePanel) {
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
    headerStore.displayUpdatePanel = false;
  }, 500);
};

const clickOutside = () => {
  emit("clickOutside");
};
const searchUpdate = () => {
  useUpdateCheck();
};

const copyUpdates = () => {
  let string = serviceStore.newUpdates.map((u) => "- " + u.name + " to " + u.version).join("\n");
  if (checkStereumUpdate.value) {
    string += "\n- Stereum to " + headerStore.stereumUpdate.version;
  }
  if (serverStore.numberOfUpdatablePackages && serverStore.numberOfUpdatablePackages > 0) {
    string += "\n- OS Updates";
  }
  navigator.clipboard.writeText(string);
};

const checkStereumUpdate = computed(() => {
  if (headerStore.stereumUpdate && headerStore.stereumUpdate.version)
    return headerStore.stereumUpdate.commit != headerStore.stereumUpdate.current_commit ? true : false;
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

const openOsUpdatePanel = () => {
  headerStore.displayUpdatePanel = false;
  serverStore.isServerAccessManagementActive = true;
  serverStore.isUpdatePanelActive = true;
};

const searchOsUpdates = async () => {
  if (headerStore.osUpdating) {
    headerStore.searchingForOsUpdates = false;
    headerStore.searchingForOsUpdatesManual = false;
    return;
  }

  searchingForOsUpdates.value = true;

  if (serverStore.numberOfUpdatablePackages === null || serverStore.upgradablePackages.value.length === 0) {
    setTimeout(async () => {
      await getUpgradablePackages();
      serverStore.numberOfUpdatablePackages = serverStore.upgradablePackages.value.length || 0;
      searchingForOsUpdates.value = false;
    }, 10);
  } else {
    searchingForOsUpdates.value = false;
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

const updateConfirm = async () => {
  let seconds = 0;
  try {
    headerStore.refresh = false;
    headerStore.updating = true;
    serviceStore.newUpdates.forEach((update) => (update.running = true));
    seconds = await ControlService.runAllUpdates({
      commit: headerStore.stereumUpdate.commit,
    });
  } catch (err) {
    console.log("Running All Updates Failed: ", err);
  } finally {
    headerStore.updating = false;
    serviceStore.versions = {};
    serviceStore.newUpdates = [];
    headerStore.refresh = true;
    // search for updates afterwards
    await ControlService.restartServices(seconds);
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
.serviceName {
  grid-column: 2/3;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.serviceName span {
  font-size: 0.8rem;
  font-weight: 500;
  color: #c6c6c6;
  text-transform: uppercase;
}

.version {
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
.version span {
  font-size: 0.8rem;
  font-weight: 500;
  color: #b4b443;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
