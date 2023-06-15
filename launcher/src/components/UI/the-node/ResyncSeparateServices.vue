<template>
  <div class="resync-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="resync-icon"><img src="/img/icon/plugin-menu-icons/resync.png" alt="" /></div>
      <div class="resync-message">
        <div>
          <span>by initiating resync you will delete the database of</span>
        </div>
        <div class="resync-message_nameId">
          <span>{{ item.name }} - [{{ item.config.serviceID }}]</span>
        </div>
        <div>
          <span>
            {{ item.category === "consensus" ? "choose what" : "genesis" }} source will be used for
            resynchronization</span
          >
        </div>
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
          <slide v-for="(Stype, index) in syncType" :key="index">
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
                <div class="inputBox">
                  <input
                    id="url-input"
                    v-model="checkPointSync"
                    type="text"
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
                <div class="inputBox_select-box">
                  <div v-if="selectedItem == '- SELECT A SOURCE -'" class="select-button" @click="tglDropdown">
                    {{ selectedItem }}
                  </div>
                  <div v-else class="wrapper">
                    <div v-if="selectedIcon !== ''" class="icon-box" @click="tglDropdown">
                      <img :src="selectedIcon" :alt="selectedItem" />
                    </div>
                    <div v-if="selectedIcon !== ''" class="selected-item" @click="tglDropdown">{{ selectedItem }}</div>
                    <div v-else class="w-selected" @click="tglDropdown">{{ selectedItem }}</div>
                    <div class="openURL" @click="handleOpenWindow">
                      <img src="/img/icon/service-icons/internet.png" alt="Internet" />
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
        <div v-if="drpDown" class="selection-column-modal">
          <ul class="link-wapper">
            <li v-for="link in selectedLinks" :key="link" class="option-row" @click="linkPicker(link)">
              <div class="iconSelector"><img :src="link.icon" alt="" /></div>
              <div class="nameSelector">
                <span>{{ link.name }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="error">
        <span v-if="error">{{ error }}</span>
      </div>
      <div class="resync-confirm deactive" :class="{ active: btnActive }" @click="resync(item)">resync</div>
      <span class="clickOut">click outside to close</span>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeManage } from "@/store/nodeManage";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import ControlService from "@/store/ControlService";

export default {
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentSlide: 0,
      btnActive: true,
      checkPointSync: "",
      serviceID: "",
      error: "",
      drpDown: false,
      selectedLinks: [],
      selectedItem: "- SELECT A SOURCE -", // selected link to use for resync
      prevVal: 0,
      selectedIcon: "",
    };
  },
  computed: {
    ...mapWritableState(useClickInstall, {
      syncType: "syncType",
      mainnet: "mainnet",
      georli: "georli",
      sepolia: "sepolia",
      gnosis: "gnosis",
    }),
    ...mapWritableState(useNodeManage, {
      currentNetwork: "currentNetwork",
      resyncSeparateModal: "resyncSeparateModal",
    }),
  },
  watch: {
    currentSlide(val) {
      if (val != this.prevVal) {
        this.prevVal = val;
        this.checkPointSync = "";
        this.selectedItem = "- SELECT A SOURCE -";
        this.selectedIcon = "";
      }
      this.btnActive = val === 0 || this.checkPointSync !== "";
      if (val === 2) {
        this.btnActive = true;
      }
    },

    checkPointSync(val) {
      this.btnActive = val !== "" || this.currentSlide === 0;
    },
  },
  mounted() {
    if (this.item.category === "execution") this.currentSlide = 2;
    this.setSelectedLinks();
  },
  methods: {
    handleOpenWindow() {
      let url = this.checkPointSync;
      window.open(url, "_blank");
    },
    async resync(el) {
      this.resyncSeparateModal = false;
      await ControlService.chooseServiceAction({
        action: "reSync",
        service: el.config.serviceID,
        data: this.checkPointSync,
      });
    },
    validateUrl() {
      const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!this.checkPointSync) {
        this.error = "";
      } else if (!regex.test(this.checkPointSync)) {
        this.error = "Please enter a valid URL without spaces";
        this.btnActive = false;
      } else {
        this.error = "";
      }
    },
    tglDropdown() {
      this.drpDown = !this.drpDown;
    },
    linkPicker(item) {
      this.selectedItem = item.name;
      this.selectedIcon = item.icon;
      this.checkPointSync = item.url;
      this.drpDown = false;
      this.btnActive = true;
    },
    setSelectedLinks() {
      switch (this.currentNetwork.id) {
        case 1:
          this.selectedLinks = this.mainnet;
          break;
        case 2:
          this.selectedLinks = this.georli;
          break;
        case 3:
          this.selectedLinks = this.sepolia;
          break;
        case 4:
          this.selectedLinks = this.gnosis;
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.inputBox_select-box {
  width: 59%;
  height: 120%;
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
  width: 50%;
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
.resync-icon img {
  width: 11%;
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
