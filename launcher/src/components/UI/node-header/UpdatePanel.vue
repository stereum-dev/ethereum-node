<template>
  <div class="panelParent">
    <div class="clickOutside" @click="$emit('clickOut')" v-if="clickBg"></div>
    <div class="panelContent">
      <div class="stereumUpdates">
        <div class="stereumUpdates-title">
          <span class="title">Stereum updates</span>
          <span class="description"
            >After downloading and installing the update Stereum will be
            restarted</span
          >
        </div>
        <div class="stereum-updateBox">
          <div class="versionBox">
            <div id="current">
              <span>current:</span>
            </div>
            <div id="latest">
              <span>latest:</span>
            </div>
            <div id="autoUpdate">
              <span>auto-update:</span>
            </div>
            <div id="currentValue">
              <span>{{ stereumUpdate.current }}</span>
            </div>
            <div id="latestValue">
              <span>{{ stereumUpdate.version }}</span>
            </div>
            <div id="updateStatus">
              <span>{{ stereumApp.autoUpdate }}</span>
            </div>
          </div>
          <div class="btnBox">
            <div class="searchBtn">
              <img src="/img/icon/header-icons/search.png" alt="icon" />
            </div>
            <div
              class="downloadBtn"
              :class="{ disabled: !checkStereumUpdate() }"
              @click="$emit('runUpdate', stereumUpdate)"
            >
              <img
                src="/img/icon/node-journal-icons/download2.png"
                alt="icon"
              />
            </div>

            <div v-if="checkStereumUpdate()" class="available">
              <div class="updateIcon">
                <img src="/img/icon/header-icons/update-green.png" alt="icon" />
              </div>
              <span class="availableText"
                >{{ stereumUpdate.version }} available</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="serviceUpdates">
        <div class="serviceUpdates-title">
          <span class="title">Service updates</span>
          <span class="description"
            >After an Service update the service in question will be
            restarted</span
          >
        </div>
        <div class="service-updateBox">
          <div class="availableTable">
            <div class="tableHeader">
              <div class="tableUpdateIcon">
                <img src="/img/icon/header-icons/update-green.png" alt="icon" />
              </div>
              <span>AVAILABLE PLUG-IN UPDATES</span>
            </div>
            <div class="tableContent">
              <div
                class="tableRow"
                v-for="(item, index) in newUpdates"
                :key="index"
              >
                <div v-if="item.running" class="downloadBtnDisabled">
                  <img
                    src="/img/icon/node-journal-icons/download_disabled.png"
                    alt="icon"
                  />
                </div>
                <div
                  v-else
                  class="downloadBtn"
                  @click="$emit('runUpdate', item)"
                >
                  <img
                    src="/img/icon/node-journal-icons/download2.png"
                    alt="icon"
                  />
                </div>
                <div class="serviceName">
                  <span>{{ item.name }}</span>
                </div>
                <div class="version">
                  <span>{{ item.version }}</span>
                </div>
              </div>
            </div>
            <div class="btnBox">
              <div
                class="confirmUpdate"
                @click="$emit('updateConfirm')"
                :class="{ disabled: !checkAvailableServicesNewUpdate() }"
              >
                <span>update all</span>
                <img
                  src="/img/icon/node-journal-icons/download2.png"
                  alt="icon"
                />
              </div>
              <div class="autoUpdateText">
                <span>auto-update: OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    £
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services.js";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  props: ["clickBg"],
  data() {
    return {
      stereumApp: {
        current: "alpha",
        latest: "2.0",
        autoUpdate: "off",
      },
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      newUpdates: "newUpdates",
    }),
    ...mapWritableState(useNodeHeader, {
      forceUpdateCheck: "forceUpdateCheck",
      stereumUpdate: "stereumUpdate",
    }),
  },
  methods: {
    checkStereumUpdate() {
      if (this.stereumUpdate && this.stereumUpdate.version) {
        // console.log(this.stereumUpdate.commit)  // commit hash of the newest newest release tag
        // console.log(this.stereumUpdate.current_commit)  // current installed commit on the os
        return this.stereumUpdate.commit != this.stereumUpdate.current_commit
          ? true
          : false;
      }
      return false;
    },
    checkAvailableServicesNewUpdate() {
      if (this.newUpdates.length <= 0) {
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.forceUpdateCheck = true;
    this.checkAvailableServicesNewUpdate();
  },
};
</script>
<style scoped>
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
  background-color: #343434;
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
  height: 30%;
}
.serviceUpdates {
  width: 100%;
  height: 68%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stereumUpdates-title,
.serviceUpdates-title {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.stereumUpdates-title .title,
.serviceUpdates-title .title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #c6c6c6;
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
.stereum-updateBox {
  width: 100%;
  height: 65%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stereum-updateBox .versionBox {
  width: 50%;
  height: 80%;
  display: grid;
  grid-template-columns: 46% 54%;
  grid-template-rows: repeat(3, 1fr);
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
  font-size: 0.7rem;
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
.stereum-updateBox .btnBox {
  width: 50%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
}
.btnBox .searchBtn {
  grid-column: 1/4;
  grid-row: 2/4;
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
  grid-row: 2/4;
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
.btnBox .available {
  grid-column: 1/7;
  grid-row: 4/5;
  margin-left: 0;
  width: 90%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.btnBox .available .updateIcon {
  grid-column: 1/2;
  grid-row: 1;
  width: 67%;
  height: 100%;
  margin: 0 auto 0 12px;
  background-color: rgb(59, 103, 100);
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
}
.btnBox .available .updateIcon img {
  width: 66%;
  justify-self: flex-start;
}
.btnBox .available .availableText {
  grid-column: 2/7;
  grid-row: 1;
  width: max-content;
  margin: 0 auto 0 8px;
  font-size: 0.6rem;
  font-weight: 600;
  color: #c6c6c6;
  align-self: center;
  text-align: left;
}
.service-updateBox {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-self: center;
  padding: 5px;
}
.service-updateBox .availableTable {
  width: 100%;
  height: 100%;
  background-color: #334d4d;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: center;
}
.service-updateBox .availableTable .tableHeader {
  width: 100%;
  height: 10%;
  background-color: #335959;
  border: 3px solid #434343;
  border-bottom: none;
  border-radius: 3px;
  padding: 2px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.tableHeader .tableUpdateIcon {
  grid-column: 2/3;
  grid-row: 1;
  width: 28%;
  height: 81%;
  background-color: #2a4940;
  border-radius: 100%;
  margin-right: 5px;
  margin-top: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: flex-end;
}
.tableHeader .tableUpdateIcon img {
  width: 10px;
  height: 10px;
}
.tableHeader span {
  grid-column: 3/6;
  grid-row: 1;
  width: 100%;
  font-size: 0.6rem;
  font-weight: 600;
  color: #c6c6c6;
  text-transform: uppercase;
  align-self: center;
}
.service-updateBox .availableTable .tableContent {
  width: 100%;
  height: 77%;
  border: 3px solid #434343;
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
  background-color: #343434;
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
  height: 98%;
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
.service-updateBox .availableTable .btnBox {
  width: 100%;
  height: 13%;
  background-color: #343434;
  display: grid;
  grid-template-columns: 35% 30% 35%;
  grid-template-rows: 1fr;
}
.availableTable .btnBox .confirmUpdate {
  grid-column: 1/2;
  grid-row: 1;
  width: 95%;
  height: 90%;
  margin: 0 auto;
  background-color: #067c5a;
  border-radius: 3px;
  border: 2px solid #067c5a;
  box-shadow: 0 1px 3px 1px rgb(46, 46, 46);
  color: #c6c6c6;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  align-self: center;
  cursor: pointer;
  transition-duration: 50ms;
}

.btnBox .confirmUpdate img {
  width: 13%;
  height: 70%;
  max-width: 13px;
  max-height: 15px;
}
.btnBox .confirmUpdate span {
  font-size: 0.7rem;
  font-weight: 700;
  color: #c6c6c6;
  text-transform: uppercase;
}
.btnBox .confirmUpdate:hover {
  background-color: rgb(3, 82, 60);
}
.btnBox .confirmUpdate:active {
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

.btnBox .autoUpdateText {
  grid-column: 3/4;
  grid-row: 1;
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}
.btnBox .autoUpdateText span {
  width: 100%;
  font-size: 0.8rem;
  font-weight: 600;
  color: #c6c6c6;
  text-transform: uppercase;
  margin-right: 5px;
}

.disabled {
  pointer-events: none;
  background-color: #074634 !important;
  opacity: 0.5;
}
</style>
