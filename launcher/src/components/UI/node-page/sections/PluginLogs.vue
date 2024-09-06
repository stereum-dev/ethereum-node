<template>
  <div class="pluginLog-parent">
    <control-dialog :open="openDialog">
      <div class="dialogBox">
        <div class="dialogIcon"><img :src="dialogIcon" /></div>
        <div class="dialogMessage">
          <span>{{ dialogValue }}</span>
        </div>
      </div>
    </control-dialog>
    <div class="logsContainer">
      <div class="logsHeader">
        <div class="title">
          <div class="title-text">
            <span>{{ $t("pluginLogs.pageTitle") }}</span>
          </div>
          <div class="title-icon">
            <img src="/img/icon/service-log-icons/log-icon.png" alt="icon" />
          </div>
        </div>
        <div class="serviceDetails">
          <div class="serviceIcon">
            <img :src="logsItem.icon" alt="icon" />
          </div>
          <div class="serviceName">
            <span>{{ logsItem.name }}</span>
          </div>
        </div>
        <div class="categoryBox">
          <p class="category">{{ logsItem.category }}<span v-if="logsItem.category != 'service'" class="client"> client</span></p>
          <span id="serviceVersion">{{ logsItem.config.runningImageVersion }}</span>
        </div>
        <div class="closeBox" @click="$emit('closeLog')">
          <div class="closeBtn"><span>x</span></div>
        </div>
      </div>
      <div class="logBox">
        <div class="log-box_nav">
          <div v-for="service in sortedServices" :key="service" class="nav-button" @click="displayPluginLogPage(service)">
            <img :src="service.icon" :alt="service.name" />
          </div>
        </div>
        <div class="logsTable">
          <template v-if="logsList.length">
            <div v-for="(log, idx) in logsList.slice(-150).reverse()" :key="idx" class="tableRow">
              <div :id="'rowMsg-' + idx" class="rowMsg" @dblclick="copy">
                <span>#{{ logsList.length - idx }}</span>
                <span id="log">{{ log }}</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="tableRow">
              <span>{{ $t("pluginLogs.noLogFound") }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="logsFooter">
        <div class="logsText">
          <span class="animate-pulse duration-100">{{ $t("pluginLogs.clickCopy") }}</span>
        </div>
        <div class="searchBox">
          <input id="search" v-model="searchValue" type="search" placeholder="Search" />
          <img v-if="!searchValue" src="/img/icon/service-log-icons/search.png" alt="icon" />
        </div>
        <div class="export-log" data-tooltip="Export the log" @click="logExport">
          <img src="/img/icon/service-log-icons/150-log-export-button.png" alt="" />
        </div>
        <div class="serviceBox">
          <span>{{ $t("pluginLogs.serviceId") }}:</span>
          <span>{{ logsItem.config.serviceID }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ControlDialog from "../../the-control/ControlDialog.vue";
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
import { mapState } from "pinia";
import { useServices } from "@/store/services";
import { saveAs } from "file-saver";

export default {
  components: { ControlDialog },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      logs: [],
      logsItem: this.item,
      searchValue: "",
      logVal: "",
      //dialog datas
      openDialog: false,
      dialogValue: "",
      copyIcon: "/img/icon/control-page-icons/ok.png",
    };
  },

  computed: {
    logsList() {
      if (this.searchValue.length > 0) {
        return this.logs.filter((i) => i.toLowerCase().includes(this.searchValue.toLowerCase()));
      }
      return this.logs;
    },
    ...mapWritableState(useNodeStore, {
      serviceLogs: "serviceLogs",
    }),
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    sortedServices() {
      const copyOfInstalledServices = [...this.installedServices];

      return copyOfInstalledServices.sort((a, b) => {
        if (a.category === "execution") return -1;
        if (b.category === "execution") return 1;
        if (a.category === "consensus") return -1;
        if (b.category === "consensus") return 1;
        if (a.category === "validator") return -1;
        if (b.category === "validator") return 1;
        return 0;
      });
    },
  },
  watch: {
    logsList: function () {
      this.$nextTick(function () {
        const lastRowMsg = this.$el.querySelector(".tableRow:first-child");
        window.scrollTo({
          top: lastRowMsg.offsetTop,
          behavior: "smooth",
        });
      });
    },
  },
  mounted() {
    this.filteredServiceLogs();
  },
  updated() {
    this.filteredServiceLogs();
  },
  methods: {
    logExport() {
      const data = this.logsList.slice(-150).reverse();
      const fileName = this.logsItem.name;

      const lineByLine = data.map((line, index) => `#${data.length - index}: ${line}`).join("\n\n");

      const blob = new Blob([lineByLine], { type: "text/plain;charset=utf-8" });
      saveAs(blob, fileName);
    },
    displayPluginLogPage(el) {
      this.logsItem = el;
    },
    filteredServiceLogs() {
      this.serviceLogs.forEach((i) => {
        if (i.config.serviceID == this.logsItem.config.serviceID) {
          this.logs = i.logs;
        }
      });
    },
    copy(e) {
      const copyText = e.target.innerText;
      navigator.clipboard.writeText(copyText);
      this.openDialog = !this.openDialog;
      this.dialogValue = "Copied to clipboard!";
      this.dialogIcon = this.copyIcon;
      if (this.openDialog === true) {
        setTimeout(() => {
          this.openDialog = false;
        }, 700);
      }
    },
  },
};
</script>
<style scoped>
[data-tooltip] {
  position: relative;
  cursor: default;
}
[data-tooltip]::after {
  position: absolute;
  width: max-content;
  left: calc(50%-25%);

  text-align: center;
  content: attr(data-tooltip);
  color: #eee;
  background: black;
  border-radius: 5px;
  font-size: 70%;
  padding: 4% 20%;
  border: 1px solid #929292;
  text-transform: uppercase;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-250%);
  transition: opacity 0.3s transform 0.2s;
}
[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
  transform: translateY(-280%) translateX(-20%);
}
.dialogBox {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
}

.dialogIcon {
  display: flex;
  height: 100%;
  width: 20%;
  justify-content: center;
  align-items: center;
}

.dialogIcon img {
  width: 50%;
}

.dialogMessage {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  height: 100%;
  font-weight: 500;
  font-size: 100%;
  color: #eee;
}
.pluginLog-parent {
  width: 100%;
  height: 91%;
  background-color: #32564f;
  background-color: #242529;
  border-radius: 10px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.logsContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  border: 4px solid rgb(156, 156, 156);
  border-radius: 10px;
}
.logsHeader {
  width: 100%;
  height: 42px;
  border-bottom: 4px solid #9c9c9c;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.logsHeader .title {
  width: 28%;
  height: 90%;
  color: #cbcaca;
  background-color: #0761bb;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 5px 5px 0;
}
.title-icon {
  display: flex;
  width: 10%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.title-icon img {
  width: 100%;
}
.title-text {
  display: flex;
  width: 50%;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 100%;
  font-weight: 800;
}
.logsHeader .serviceDetails {
  width: 48%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logsHeader .serviceDetails .serviceIcon {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.serviceIcon img {
  width: 40%;
}
.logsHeader .serviceDetails .serviceName {
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: uppercase;
}
.serviceDetails .serviceName span {
  font-size: 120%;
  font-weight: 700;
  color: rgb(202, 205, 206);
}
.categoryBox {
  display: flex;
  width: 20%;
  height: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.logsHeader .closeBox {
  width: 4%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.closeBtn {
  display: grid;
  width: 70%;
  height: 80%;
  color: red;
  border: 2px solid #9c9c9c;
  place-items: center;
  font-size: 100%;
  font-weight: 800;
  border-radius: 10px;
  padding-bottom: 4%;
}
.closeBtn:hover {
  background: #313131;
}
.logsHeader .closeBox img {
  width: 93%;
  height: 100%;
}
.logsHeader .closeBox img:active {
  transform: scale(0.9);
}
.categoryBox .category {
  font-size: 70%;
  font-weight: 600;
  text-align: left;
  color: #cacdce;
  text-transform: uppercase;
}
.category .client {
  width: fit-content;
  height: fit-content;
  font-size: 0.7rem;
  font-weight: 500;
}
#serviceVersion {
  width: max-content;
  font-size: 70%;
  font-weight: 600;
  text-align: left;
  color: rgb(202, 205, 206);
}
.logBox {
  display: flex;
  width: 100%;
  height: 82%;
}
.log-box_nav {
  display: flex;
  width: 5%;
  height: 100%;
  background: #3b4146;
  flex-direction: column;
  overflow-y: scroll;
  justify-content: flex-start;
  align-items: flex-start;
}
.log-box_nav::-webkit-scrollbar {
  width: 4px;
}

/* Track */
.log-box_nav::-webkit-scrollbar-track {
  background: #3b4146;
  box-sizing: border-box;
  border-radius: 50%;
}

/* Handle */
.log-box_nav::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 50%;
}
.nav-button {
  width: 90%;
  min-height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #242529;
  font-weight: 800;
  text-transform: uppercase;
  border: 2px solid #787878;
  border-radius: 0 15px 15px 0;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.nav-button:hover {
  background-color: #050505;
}
.nav-button img {
  width: 70%;
}
.logsTable {
  width: 95%;
  height: 100%;
  background: #3b4146;
  display: flex;
  padding: 5px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}

.logsTable::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

.logsTable::-webkit-scrollbar-track {
  background: transparent;
}
.logsTable::-webkit-scrollbar-thumb {
  background-color: #32564f;
  border-radius: 10px;
  cursor: pointer;
}
.logsTable::-webkit-scrollbar-thumb:horizontal {
  background-color: #32564f;
  border-radius: 10px;
  cursor: pointer;
}
.logsTable::-webkit-scrollbar-thumb:hover {
  background-color: #4a7d73;
}
.logsTable::-webkit-scrollbar-thumb:hover {
  background-color: #4a7d73;
}
.logsTable::-webkit-scrollbar-corner {
  background: transparent;
}
.tableRow {
  width: 100%;
  min-height: 7%;
  margin-top: 5px;
  padding: 2px 5px;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;
  overflow-y: hidden;
  overflow-x: auto;
}
.tableRow::-webkit-scrollbar {
  height: 2px;
  background: transparent;
  padding: 0 20px;
}
.tableRow::-webkit-scrollbar-thumb {
  background-color: #3c6283;
  border-radius: 10px;
  cursor: pointer;
  margin: 0 20px;
}
.tableRow::-webkit-scrollbar-thumb:hover {
  background-color: #3e78ab;
}
.logsTable .tableRow:nth-child(odd) {
  background-color: #4c5157;
}
.tableRow:nth-child(even) {
  background-color: #2d2e34;
}
.rowMsg {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: normal;
  cursor: pointer;
}

.rowMsg span:last-child {
  width: 98%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: pre;
  font-size: 80%;
  font-weight: 500;
  color: rgb(203, 202, 202);
  margin-left: 10px;
}
.rowMsg span:first-child {
  min-width: 2%;
  max-width: max-content;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: pre;
  font-size: 0.8rem;
  font-weight: 600;
  color: #d9d9d6;
  margin: 0 5px;
}

.logsFooter {
  width: 100%;
  height: 50px;
  border-top: 4px solid rgb(156, 156, 156);
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 100%;
  align-items: center;
}
.logsFooter .logsText {
  grid-column: 1/5;
  grid-row: 1/2;
  width: 72%;
  height: 80%;
  border: 2px solid rgb(156, 156, 156);
  border-radius: 5px;
  background-color: #32564f;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.logsFooter .logsText span {
  font-size: 0.7rem;
  color: #d8d8d8;
  font-weight: 400;
}

.logsFooter .searchBox {
  grid-column: 9/13;
  grid-row: 1/2;
  width: 95%;
  height: 76%;
  background-color: #f4f4f4;
  border-radius: 5px;
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.export-log {
  grid-column: 8/9;
  grid-row: 1/2;
  justify-self: flex-end;
  cursor: pointer;
}
.export-log:active {
  transform: scale(0.9);
}
.searchBox img {
  width: 9%;
  margin-right: 1%;
  left: 90%;
  position: absolute;
}
.logsFooter .searchBox input {
  width: 100%;
  height: 90%;
  background-color: #eaeaea;
  border-radius: 5px;
  border: none;
  outline: none;
  color: rgb(101, 101, 101);
  font-size: 1rem;
  font-weight: 600;
  padding: 0 0.5rem;
}
.logsFooter .serviceBox {
  grid-column: 4/8;
  grid-row: 1/2;
  width: 100%;
  height: 80%;
  border: 2px solid rgb(156, 156, 156);
  border-radius: 5px;
  background-color: #32564f;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.logsFooter .serviceBox span:first-child {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #c4c4c4;
}
.logsFooter .serviceBox span:last-child {
  font-size: 0.7rem;
  font-weight: 400;
  color: #d8d8d8;
}
</style>
