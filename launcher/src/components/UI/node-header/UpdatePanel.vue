<template>
  <div class="panelParent">
    <div v-if="clickBg" class="clickOutside" @click="$emit('clickOut')"></div>
    <div class="panelContent">
      <div class="stereumUpdates">
        <div class="launcherUpdate"></div>

        <div class="stereum-updateBoxesWrapper">
          <div class="stereum-updateBoxWithIcon">
            <div class="icon">
              <img src="../../../../public/img/icon/control/ubuntuIco.svg" />
            </div>
            <div class="stereum-updateBox">
              <div class="nodeUpdate-title_row white">
                <span>{{ $t("updatePanel.osTitle") }}</span>
              </div>
              <div class="versionContainer">
                <div class="versionBox">
                  <div id="current">
                    <span>{{ $t("updatePanel.current") }}:</span>
                  </div>
                  <div id="latest">
                    <span>{{ $t("updatePanel.availableUpdates") }}:</span>
                  </div>
                  <div id="currentValue">
                    <span>{{ osVersionCurrent }}</span>
                  </div>
                  <div id="latestValue">
                    <span class="red-circle">{{ osVersionLatest }}</span>
                  </div>
                </div>
                <div class="btnBox">
                  <div class="searchBtn" @click="getUpdatablePackagesCount">
                    <img src="/img/icon/header-icons/search.png" alt="icon" />
                  </div>
                  <div class="downloadBtn" :class="{ disabled: osVersionLatest === 0 }" @click="updateOS">
                    <img src="/img/icon/node-journal-icons/download2.png" alt="icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="stereum-updateBoxWithIcon">
            <div class="icon">
              <img src="/img/icon/stereum-logo/stereum_logo_extern.png" />
            </div>
            <div class="stereum-updateBox">
              <div class="nodeUpdate-title_row">
                <span>{{ $t("updatePanel.launcherTitle") }}</span>
              </div>
              <div class="versionContainer">
                <div class="versionBox">
                  <div id="current">
                    <span>{{ $t("updatePanel.current") }}:</span>
                  </div>
                  <div id="currentValue">
                    <span>{{ launcherVersion }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="stereum-updateBoxWithIcon">
            <div class="icon">
              <img src="/img/icon/stereum-logo/stereum_logo_extern.png" />
            </div>
            <div class="stereum-updateBox">
              <div class="nodeUpdate-title_row">
                <span>{{ $t("updatePanel.nodeTitle") }}</span>
              </div>
              <div class="versionContainer">
                <div class="versionBox">
                  <div id="current">
                    <span>{{ $t("updatePanel.current") }}:</span>
                  </div>
                  <div id="latest">
                    <span>{{ $t("updatePanel.latest") }}:</span>
                  </div>

                  <div id="currentValue">
                    <span>{{ stereumUpdate.current }}</span>
                  </div>
                  <div id="latestValue">
                    <span>{{ stereumUpdate.version }}</span>
                  </div>
                </div>
                <div class="btnBox">
                  <div class="searchBtn" @click="searchUpdate">
                    <img src="/img/icon/header-icons/search.png" alt="icon" />
                  </div>
                  <div
                    class="downloadBtn"
                    :class="{ disabled: !checkStereumUpdate() || updating }"
                    @click="$emit('runUpdate', stereumUpdate)"
                  >
                    <img src="/img/icon/node-journal-icons/download2.png" alt="icon" />
                  </div>

                  <div v-if="checkStereumUpdate()" class="available">
                    <div class="updateIcon">
                      <img src="/img/icon/header-icons/update-green.png" alt="icon" />
                    </div>
                    <span class="availableText">{{ stereumUpdate.version }} {{ $t("updatePanel.available") }}</span>
                  </div>
                  <div v-if="forceUpdateCheck && !checkStereumUpdate()" class="available">
                    <span class="circle pulse"></span>
                    <span class="searchingText">{{ $t("updatePanel.searching") }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="serviceUpdates">
        <div class="serviceUpdates-titleWithIcon">
          <div class="icon">
            <img src="/img/icon/click-installation/mainnet-icon.png" />
          </div>
          <div class="serviceUpdates-title">
            <span class="title white">{{ $t("updatePanel.serviceTitle") }}</span>
            <span class="description">{{ $t("updatePanel.serviceDesc") }}</span>
          </div>
        </div>

        <div class="service-updateBox">
          <div class="availableTable">
            <div class="tableHeader">
              <div class="tableUpdateIcon">
                <img src="/img/icon/header-icons/update-green.png" alt="icon" />
              </div>
              <span>{{ $t("updatePanel.availablePlugin") }}</span>
            </div>
            <div class="tableContent">
              <div v-for="(item, index) in newUpdates" :key="index" class="tableRow">
                <div v-if="item.running || updating" class="downloadBtnDisabled">
                  <img src="/img/icon/node-journal-icons/download_disabled.png" alt="icon" />
                </div>
                <div v-else class="downloadBtn" @click="$emit('runUpdate', item)">
                  <img src="/img/icon/node-journal-icons/download2.png" alt="icon" />
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
      <div class="updateAllBtnBox">
        <div class="updateAllBtn">
          <div
            class="confirmUpdate"
            :class="{
              disabled: (!checkAvailableServicesNewUpdate() && !checkStereumUpdate()) || updating,
            }"
            @click.prevent.stop="$emit('updateConfirm')"
          >
            <span>{{ $t("updatePanel.all") }}</span>
            <img src="/img/icon/node-journal-icons/download2.png" alt="icon" />
          </div>
        </div>
        <div class="autoUpdateText">
          <span
            >{{ $t("updatePanel.auto") }} :
            <span class="autoUpdateText_status" :class="onOff">{{ stereumApp.autoUpdate }}</span></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services.js";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  props: {
    clickBg: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stereumApp: {
        current: "alpha",
        latest: "2.0",
        autoUpdate: "",
      },
      osVersionCurrent: "-",
      osVersionLatest: "-",
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      newUpdates: "newUpdates",
      launcherVersion: "launcherVersion",
    }),
    ...mapWritableState(useNodeHeader, {
      forceUpdateCheck: "forceUpdateCheck",
      stereumUpdate: "stereumUpdate",
      updating: "updating",
    }),
    onOff() {
      return {
        green: this.stereumApp.autoUpdate === "on",
        red: this.stereumApp.autoUpdate === "off",
      };
    },
  },

  updated() {
    this.getSettings();
  },
  async mounted() {
    await this.getOsVersion();
    await this.getUpdatablePackagesCount();
  },
  methods: {
    searchUpdate() {
      this.forceUpdateCheck = true;
    },
    testData() {
      console.log(this.updating);
    },
    async getSettings() {
      this.settings = await ControlService.getStereumSettings();
      if (this.settings.stereum?.settings.updates.unattended.install) {
        this.stereumApp.autoUpdate = "on";
      } else {
        this.stereumApp.autoUpdate = "off";
      }
    },
    checkStereumUpdate() {
      if (this.stereumUpdate && this.stereumUpdate.version) {
        // console.log(this.stereumUpdate.commit)  // commit hash of the newest newest release tag
        //console.log(this.stereumUpdate.current_commit); // current installed commit on the os
        return this.stereumUpdate.commit != this.stereumUpdate.current_commit ? true : false;
      }
      return false;
    },
    checkAvailableServicesNewUpdate() {
      if (this.newUpdates.length <= 0) {
        return false;
      }
      return true;
    },
    async getUpdatablePackagesCount() {
      try {
        const packagesCount = await ControlService.getCountOfUpdatableOSUpdate();

        this.osVersionLatest = Number(packagesCount);

        return this.getOsVersion();
      } catch (error) {
        console.log(error);
      }
    },
    async getOsVersion() {
      try {
        const osVersion = await ControlService.getCurrentOsVersion();

        this.osVersionCurrent = osVersion;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped>
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

  border-radius: 50%;
  width: 20px;
  height: 20px;
  padding: 4px;
  text-align: center;
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
  color: #375b5c;
  margin-left: 1.5%;
  text-transform: uppercase;
}

.serviceUpdates-titleWithIcon {
  display: flex;
  padding: 0 10px;
  align-items: center;
}

.serviceUpdates-titleWithIcon > .icon > img,
.stereum-updateBoxWithIcon > .icon > img {
  width: 25px;
}

.launcherUpdate,
.serviceUpdates-title {
  width: 100%;
  /* height: 20%; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 1% 0;
}
.launcherUpdate .title,
.serviceUpdates-title .title {
  font-size: 100%;
  font-weight: 800;
  color: #375b5c;
  margin-left: 15px;
  text-transform: uppercase;
}
.description,
.description {
  font-size: 0.6rem;
  font-weight: 400;
  color: #9f9f9f;
  margin-left: 15px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
}

.stereum-updateBoxWithIcon {
  display: flex;
  padding: 0 10px;
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
  width: 50%;
  height: 100%;
  display: grid;
  grid-template-columns: 46% 54%;
  grid-template-rows: repeat(2, 1fr);
  overflow: hidden;
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
  font-size: 0.7rem;
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
  width: max-content;
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
  width: 50%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(12, 1fr);
}
.btnBox .searchBtn {
  grid-column: 1/4;
  grid-row: 2/8;
  border-radius: 3px;
  margin-left: 20px;
  box-shadow: 0 1px 3px 1px rgb(42, 42, 42);
  width: 70%;
  height: 80%;
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
  border: none;
  box-shadow: none;
  transform: scale(0.95);
}
.btnBox .downloadBtn {
  grid-column: 4/7;
  grid-row: 2/8;
  margin-right: 20px;
  border: 1px solid #067c5a;
  border-radius: 3px;
  width: 70%;
  height: 80%;
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
  border: none;
  box-shadow: none;
  transform: scale(0.95);
}
.available {
  grid-column: 1/7;
  grid-row: 9/12;
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
  background: #17a2b8;
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
    box-shadow: 0 0 0 0px #637973;
  }
  100% {
    box-shadow: 0 0 0 10px #2e3533;
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
  background-color: #074634 !important;
  opacity: 0.5;
}
</style>
