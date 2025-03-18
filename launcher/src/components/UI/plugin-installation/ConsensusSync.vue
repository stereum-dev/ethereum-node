<template>
  <div class="syncRow">
    <div class="plugin-name">
      <div class="serviceIcon">
        <img :src="client.icon" alt="icon" />
      </div>
      <div class="serviceBox">
        <span>{{ client.name }}</span>
        <span>{{ client.displayCategory }}</span>
      </div>
    </div>
    <carousel ref="carousel" v-model="currentSlide" :items-to-show="1" :wrap-around="true" :transition="500">
      <slide v-for="(item, index) in syncType" :key="index">
        <div class="syncBox">
          <div v-if="item.name === 'genesis'" class="syncContent">
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>
          </div>
          <div v-else-if="item.type === 'custom source'" class="syncContent">
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>
            <div class="inputBox">
              <input v-model="checkPointSync" type="text" placeholder="https://example.cc/" class="placeholder:text-gray-500" />
            </div>
          </div>
          <div v-else-if="item.type === 'recommended'" class="syncContent">
            <div class="syncText">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </div>

            <div class="inputBox_select-box">
              <div v-if="selectedItem == '- SELECT A SOURCE -'" class="select-button" @click="toglDropDown">
                {{ selectedItem }}
              </div>
              <div v-else class="wrapper">
                <div v-if="selectedIcon !== ''" class="iconbox" @click="toglDropDown">
                  <img :src="selectedIcon" :alt="selectedItem" />
                </div>
                <div v-if="selectedIcon !== ''" class="selected-item" @click="toglDropDown">
                  {{ selectedItem }}
                </div>
                <div v-else class="w-selected" @click="toglDropDown">
                  {{ selectedItem }}
                </div>
                <div class="openURL" @click="openWindow">
                  <img src="/img/icon/service-modals-icons/internet.png" alt="Internet" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </slide>

      <template #addons>
        <navigation />
      </template>
    </carousel>
    <div v-if="dropdown" class="selection-column" @mouseleave="dropdown = false">
      <ul class="link-wapper">
        <li v-for="link in selectedLinks" :key="link" class="option-row" @click="linkPicker(link)">
          <div class="icon"><img :src="link.icon" alt="" /></div>
          <div class="name">
            <span>{{ link.name }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeManage } from "@/store/nodeManage";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
export default {
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  props: {
    client: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      dropdown: false,
      selectedItem: "- SELECT A SOURCE -", // selected link to use for resync
      currentSlide: 0,
      selectedLinks: [],
      prevVal: 0,
      selectedIcon: "",
    };
  },

  computed: {
    ...mapWritableState(useClickInstall, {
      syncType: "syncType",
      checkPointSync: "checkPointSync",
      btnActive: "btnActive",
      mainnet: "mainnet",
      sepolia: "sepolia",
      gnosis: "gnosis",
      holesky: "holesky",
      hoodi: "hoodi",
    }),
    ...mapWritableState(useNodeManage, {
      currentNetwork: "currentNetwork",
      configNetwork: "configNetwork",
    }),
  },
  watch: {
    currentSlide: function (val) {
      if (this.$route.path === "/sync" || this.$route.path === "/importingSyncing") {
        if (val != this.prevVal) {
          this.prevVal = val;
          this.checkPointSync = "";
          this.selectedItem = "- SELECT A SOURCE -";
        }

        if (val === 1 && this.checkPointSync === "") {
          this.btnActive = false;
        } else {
          this.btnActive = true;
        }
      }
    },
  },
  mounted() {
    this.currentNetwork = this.currentNetwork.hasOwnProperty("id") ? this.currentNetwork : this.configNetwork;
    this.setSelectedLinks();
  },
  methods: {
    openWindow() {
      let url = this.checkPointSync;
      window.open(url, "_blank");
    },
    toglDropDown() {
      if (this.selectedItem == "Validating...") {
        this.dropdown = false;
        return false;
      }
      this.dropdown = !this.dropdown;
    },
    async linkPicker(item) {
      this.selectedItem = "Validating...";
      this.selectedIcon = "/animation/loading/mushroom-spinner.gif";
      this.checkPointSync = "";
      this.dropdown = false;
      const isCheckpointValid = await ControlService.isCheckpointValid(item.url);
      if (!isCheckpointValid) {
        this.selectedItem = "INVALID";
        this.selectedIcon = item.icon;
        setTimeout(
          function (me) {
            me.selectedItem = "- SELECT A SOURCE -";
            me.selectedIcon = "";
          },
          1000,
          this
        );
        return;
      }
      this.selectedItem = item.name;
      this.selectedIcon = item.icon;
      this.checkPointSync = item.url;
    },
    setSelectedLinks() {
      switch (this.currentNetwork.id) {
        case 1:
          this.selectedLinks = this.mainnet;
          break;
        case 2:
          this.selectedLinks = this.sepolia;
          break;
        case 3:
          this.selectedLinks = this.gnosis;
          break;
        case 4:
          this.selectedLinks = this.holesky;
          break;
        case 5:
          this.selectedLinks = this.hoodi;
          break;
        default:
          break;
      }
    },
  },
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
  background: #151a1e;
  border: 2px solid rgb(161, 161, 161);
  border-radius: 10px;
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
  width: 72%;
  height: 100%;
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
  padding: 5px 0;
  height: 100% !important;
}

.carousel__prev {
  width: 5%;
  box-sizing: content-box;
  width: 40px;
  padding: 0;
  margin: 0;
}
.carousel__next {
  width: 5%;
  box-sizing: content-box;
  width: 40px;
  padding: 0;
  margin: 0;
}
.carousel button {
  width: 20px;
}
.carousel button .carousel__icon {
  width: 30px;
  height: 30px;
  color: #fff;
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
  width: 100%;
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
  height: 74%;
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
