<template>
  <custom-modal
    :client="props.item"
    icon="/img/icon/plugin-menu-icons/resync.png"
    bg-color="bg-[#151a1e]"
    :main-title="$t('resyncSeparateService.message')"
    :confirm-text="$t('resyncSeparateService.resync')"
    click-outside-text="Click outside to cancel"
    @close-window="closeWindow"
    @confirm-action="resync(item)"
  >
    <template #content>
      <div class="text-sm text-teal-500 font-semibold">
        <div class="uppercase text-lg">{{ item.name }}</div>
        <div>" {{ item.config.serviceID }} "</div>
      </div>
      <div>
        <span class="text-lg text-gray-200 font-semibold">
          {{ item.category === "consensus" ? "choose what" : "genesis" }}
          {{ $t("resyncSeparateService.msgPartTwo") }}</span
        >
      </div>

      <div class="resync-box">
        <carousel
          ref="carousel"
          v-model="currentSlide"
          :items-to-show="1"
          :wrap-around="true"
          :transition="500"
          :class="{ disabled: item.category === 'execution' }"
        >
          <slide v-for="(Stype, index) in clickInstallStore.syncType" :key="index">
            <div class="syncBox">
              <div v-if="Stype.type === 'Syncs from genesis' || item.category === 'execution'" class="syncContent">
                <div class="syncText">
                  <span>{{ Stype.name }}</span>
                  <span>{{ Stype.type }}</span>
                </div>
              </div>
              <div v-else-if="Stype.type === 'custom source' && item.category === 'consensus'" class="syncContent">
                <div class="syncText">
                  <span>{{ Stype.name }}</span>
                  <span>{{ Stype.type }}</span>
                </div>
                <div
                  class="inputBox_select-box min-h-[37px] bg-[#23272c] text-gray-100 rounded-sm flex justify-center items-center text-sm"
                >
                  <input
                    id="url-input"
                    v-model="checkPointSync"
                    type="text"
                    class="w-full h-full min-h-[37px] bg-[#23272c] text-gray-100 rounded-sm flex justify-center items-center text-sm px-2 overflow-hidden"
                    placeholder="https://example.cc/"
                    @input="validateUrl"
                  />
                </div>
              </div>
              <div v-else-if="Stype.type === 'recommended' && item.category === 'consensus'" class="syncContent">
                <div class="syncText">
                  <span>{{ Stype.name }}</span>
                  <span>{{ Stype.type }}</span>
                </div>
                <div class="inputBox_select-box min-h-[37px]">
                  <div
                    v-if="selectedItem == '- SELECT A SOURCE -'"
                    class="w-full h-full min-h-[37px] bg-[#23272c] text-gray-200 rounded-sm flex justify-center items-center text-sm cursor-pointer"
                    @click="tglDropdown"
                  >
                    {{ selectedItem }}
                  </div>
                  <div
                    v-else
                    class="w-full min-h-[37px] flex justify-between items-center px-1 bg-[#23272c]"
                    @click="tglDropdown"
                  >
                    <div v-if="selectedIcon !== ''" class="w-1/6 h-[37px] flex justify-center items-center">
                      <img class="w-[25px]" :src="selectedIcon" :alt="selectedItem" />
                    </div>
                    <div v-if="selectedIcon !== ''" class="text-sm text-center text-gray-200">
                      {{ selectedItem }}
                    </div>
                    <div v-else class="text-sm text-center text-gray-200">{{ selectedItem }}</div>
                    <div @click="handleOpenWindow">
                      <img
                        class="w-6 cursor-pointer hover:scale-95"
                        src="/img/icon/service-icons/internet.png"
                        alt="Internet"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </slide>

          <template v-if="item.category === 'consensus'" #addons>
            <navigation />
          </template>
        </carousel>
        <div
          v-if="drpDown"
          class="absolute right-[10.5rem] bottom-2 z-10 mt-2 w-56 h-32 origin-top-right divide-y divide-gray-300 rounded-md bg-gray-100 shadow-lg focus:outline-none overflow-y-scroll"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
          @mouseleave="drpDown = false"
        >
          <div
            v-for="link in selectedLinks"
            :key="link"
            class="py-2 flex justify-start items-center px-2 bg-gray-200 hover:bg-blue-500 cursor-pointer"
            role="none"
            @click="linkPicker(link)"
          >
            <img class="w-6" :src="link.icon" alt="" />
            <span class="text-gray-700 text-sm font-semibold ml-3" role="menuitem" tabindex="-1">{{ link.name }}</span>
          </div>
        </div>
      </div>
      <div class="error">
        <span v-if="error">{{ error }}</span>
      </div>
    </template>
  </custom-modal>
</template>
<script setup>
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeManage } from "@/store/nodeManage";
import CustomModal from "./CustomModal.vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import ControlService from "@/store/ControlService";
import { watch, ref, onMounted } from "vue";

//Props and Emits
const props = defineProps({
  item: Object,
});

const emit = defineEmits(["closeWindow"]);

//Refs
const currentSlide = ref(0);
const btnActive = ref(true);
const checkPointSync = ref("");
const error = ref("");
const drpDown = ref(false);
const selectedLinks = ref([]);
const selectedItem = ref("- SELECT A SOURCE -"); // selected link to use for resync
const prevVal = ref(0);
const selectedIcon = ref("");

const clickInstallStore = useClickInstall();
const nodeManageStore = useNodeManage();

//Watchers

watch(currentSlide, (newVal) => {
  if (newVal != prevVal.value) {
    prevVal.value = newVal;
    checkPointSync.value = "";
    selectedItem.value = "- SELECT A SOURCE -";
    selectedIcon.value = "";
  }
  btnActive.value = newVal === 0 || checkPointSync.value !== "";
  if (newVal === 2) {
    btnActive.value = true;
  }
});

watch(checkPointSync, (newVal) => {
  btnActive.value = newVal !== "" || currentSlide.value === 0;
});

//Lifecycle Hooks
onMounted(() => {
  if (props.item.category === "execution") currentSlide.value = 2;
  setSelectedLinks();
});

//Methods

const closeWindow = () => {
  emit("closeWindow");
};
const handleOpenWindow = () => {
  let url = checkPointSync.value;
  window.open(url, "_blank");
};
const resync = async (el) => {
  emit("closeWindow");
  await ControlService.chooseServiceAction({
    action: "reSync",
    service: el.config.serviceID,
    data: checkPointSync.value,
  });
};
const validateUrl = () => {
  const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  if (!checkPointSync.value) {
    error.value = "";
  } else if (!regex.test(checkPointSync.value)) {
    error.value = "Please enter a valid URL without spaces";
    btnActive.value = false;
  } else {
    error.value = "";
  }
};
const tglDropdown = () => {
  drpDown.value = !drpDown.value;
};
const linkPicker = (item) => {
  selectedItem.value = item.name;
  selectedIcon.value = item.icon;
  checkPointSync.value = item.url;
  drpDown.value = false;
  btnActive.value = true;
};
const setSelectedLinks = () => {
  switch (nodeManageStore.currentNetwork.id) {
    case 1:
      selectedLinks.value = clickInstallStore.mainnet;
      break;
    case 2:
      selectedLinks.value = clickInstallStore.georli;
      break;
    case 3:
      selectedLinks.value = clickInstallStore.sepolia;
      break;
    case 4:
      selectedLinks.value = clickInstallStore.gnosis;
      break;
    default:
      break;
  }
};
</script>

<style scoped>
.inputBox_select-box {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-box {
  width: 20%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #151a1e;
  border: 2px solid rgb(161, 161, 161);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}
.icon-box img {
  width: 92%;
  height: 95%;
}
.selected-item {
  width: 58%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #151a1e;
  border: 2px solid #a1a1a1;
  border-radius: 10px;
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
  background: #151a1e;
  border: 2px solid #c1c1c1;
  border-radius: 10px;
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
  width: 90%;
  height: 65%;
}
.openURL:active {
  transform: scale(0.9);
}
.select-button {
  border: none;
  width: 100%;
  height: 100%;
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

.select span {
  display: flex;
  width: 55%;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
}
.selected-icon {
  width: 40%;
  height: 120%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.selected-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.selection-column-modal {
  width: 32%;
  height: 50%;
  display: flex;
  background: #1258a2;
  color: #d5d5d5;
  font-weight: 400;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 75%;
  left: 46%;
  z-index: 500;
  border-radius: 0 0 10px 10px;
}
.link-wapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 0 0 10px 10px;
}
.option-row {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 600;
  padding: 1%;
  margin-bottom: 1%;
  border-bottom: 1px solid #d5d5d5;
  flex-shrink: 0;
  flex-grow: 0;
  overflow-x: auto;
  cursor: pointer;
  color: #c1c1c1;
}
.iconSelector {
  width: 25%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 2%;
}
.nameSelector {
  width: 75%;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 85%;
}
.iconSelector img {
  width: 70%;
}
.option-row:hover {
  background-color: #c1c1c1;
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
.error {
  color: red;
  width: 90%;
  height: 4%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
}
.disabled {
  pointer-events: none;
}
.clickOut {
  font-size: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6%;
  color: red;
  position: absolute;
  bottom: 0;
}
.resync-modal_parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 300;
}
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.3;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 202;
  cursor: default;
}
.browser-modal {
  width: 60%;
  height: 55%;
  background-color: #212122;
  border: 5px solid rgb(161, 161, 161);
  border-radius: 70px;
  position: absolute;
  top: 24%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  cursor: default;
}

.resync-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 25%;
}

.resync-message {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 30%;
  flex-direction: column;
  font-size: 80%;
  font-weight: 500;
  text-transform: uppercase;
  color: #eee;
}
.resync-message_nameId {
  font-size: 130%;
  font-weight: 800;
}
.resync-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 18%;
}
.resync-confirm {
  width: 40%;
  height: 12%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: red;
  font-size: 100%;
  text-transform: uppercase;
  font-weight: 700;
  border-radius: 15px;
  color: #eee;
  cursor: pointer;
}
.resync-confirm:active {
  transform: scale(0.9);
}
.deactive {
  opacity: 50%;
  pointer-events: none;
}
.active {
  opacity: 1;
  pointer-events: visible;
}
</style>
