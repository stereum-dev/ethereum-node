<template>
  <div class="Sync-parent">
    <div class="sync-box">
      <div class="sync-icon">
        <div class="sync-icon_container">
          <img :src="syncSituation()" />
        </div>
        <span>{{ $t("controlPage.syncStatus") }}</span>
      </div>
      <div class="wrapper">
        <!--new form start-->
        <no-data
          v-if="isConsensusMissing || prometheusIsOff"
          @mouseenter="cursorLocation = `${nodataMessage}`"
          @mouseleave="cursorLocation = ''"
        />
        <div v-if="syncItemsShow" class="activeWidget">
          <div class="consensusContainer">
            <div class="consensusName">
              <span>{{ consensusName }}</span>
            </div>
            <div class="progressBox">
              <sync-circular-progress :color="consensuColor" :sync-percent="consensusPer" />
            </div>
            <div class="syncStatusStatus" :class="consensusClass">
              <span>{{ consensusText }}</span>
            </div>
            <div
              class="consensusIconCons"
              @mouseenter="cursorLocation = `${consensusName} : ${consensusFirstVal} / ${consensusSecondVal}`"
              @mouseleave="cursorLocation = ''"
            >
              <img :src="clientImage(consensusName)" alt="consensus" />
            </div>
          </div>

          <div class="executionContainer">
            <div class="executionName">
              <span>{{ executionName }}</span>
            </div>
            <div class="progressBox">
              <sync-circular-progress :color="executionColor" :sync-percent="executionPer" />
            </div>
            <div class="syncStatusStatus" :class="executionClass">
              <span>{{ executionText }}</span>
            </div>
            <div
              class="executionIconCons"
              @mouseenter="cursorLocation = `${executionName} : ${executionFirstVal} / ${executionSecondVal}`"
              @mouseleave="cursorLocation = ''"
            >
              <img :src="clientImage(executionName)" alt="execution" />
            </div>
          </div>
        </div>
        <!--new form end-->
      </div>
    </div>
    <div v-if="isMultiService" v-show="syncItemsShow" class="arrowBox">
      <div class="arrowUp" @click="backPage">
        <img src="/img/icon/control-page-icons/arrow-up-small.png" alt="arrow" />
      </div>
      <div class="pageNumber">
        <span>{{ pageNumber }}</span>
      </div>
      <div class="arrowDown" @click="nextPage">
        <img src="/img/icon/control-page-icons/arrow-up-small.png" alt="arrow" />
      </div>
    </div>
  </div>
</template>
<script>
import SyncCircularProgress from "./SyncCircularProgress.vue";
import { mapState, mapWritableState } from "pinia";
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import NoData from "./NoData.vue";
import { useSetups } from "@/store/setups";

export default {
  components: { NoData, SyncCircularProgress },
  data() {
    return {
      isMultiService: false,
      // pageNumber: 1,
      clients: [],
      syncItemsShow: false,
      syncIcoUnknown: true,
      syncIcoSituation: false,
      syncIcoError: false,
      noDataLayerShow: false,
      executionName: "",
      consensusFirstVal: 0,
      consensusSecondVal: 0,
      executionFirstVal: 0,
      executionSecondVal: 0,
      consensuColor: "",
      executionColor: "",
      consensusClass: "",
      executionClass: "",
      consensusText: "",
      executionText: "",
      clientInfo: {
        clientred: {
          text: "ERROR",
          color: "#f84343",
        },
        clientorange: {
          text: "INITIALIZING",
          color: "#ff8c00",
        },
        clientgrey: {
          text: "ON-HOLD",
          color: "grey",
        },
        clientblue: {
          text: "SYNCING",
          color: "lightblue",
        },
        clientgreen: {
          text: "SYNCED",
          color: "#00be00",
        },
      },
      syncIco: [
        {
          id: 1,
          name: "error",
          icon: "/animation/synchronisation/synchronisation-icon-error.gif",
        },
        {
          id: 2,
          name: "active",
          icon: "/animation/synchronisation/synchronisation-icon-active.gif",
        },
        {
          id: 3,
          name: "synched",
          icon: "/animation/synchronisation/synchronisation-icon-sucess.gif",
        },
        {
          id: 4,
          name: "unknown",
          icon: "/animation/synchronisation/synchronisation-icon-unknown.gif",
        },
      ],
    };
  },

  computed: {
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      dialog: "dialog",
      epochType: "epochType",
      epoch: "epoch",
      slot: "slot",
      status: "status",
      title: "title",
      first: "first",
      second: "second",
      installedServicesController: "installedServicesController",
      missingServices: "missingServices",
      prometheusIsOff: "prometheusIsOff",
      isConsensusRunning: "isConsensusRunning",
      nodataMessage: "nodataMessage",
    }),
    ...mapState(useControlStore, {
      code: "code",
      syncstatus: "syncstatus",
      consensusClientsData: "consensusClientsData",
      executionClientsData: "executionClientsData",
      consensusName: "consensusName",
    }),
    ...mapWritableState(useControlStore, {
      consensusName: "consensusName",
      pageNumber: "pageNumber",
      synchronizationErrorControl: "synchronizationErrorControl",
      currentConsensusIcon: "currentConsensusIcon",
      currentExecutionIcon: "currentExecutionIcon",
    }),
    ...mapState(useSetups, {
      selectedSetup: "selectedSetup",
    }),
    isConsensusMissing() {
      return this.missingServices?.includes("consensus");
    },

    errorIco() {
      return this.syncIco[0].icon;
    },
    activeIco() {
      return this.syncIco[1].icon;
    },
    synchedIco() {
      return this.syncIco[2].icon;
    },
    unknownIco() {
      return this.syncIco[3].icon;
    },
    executionPer() {
      return this.getPer(this.executionFirstVal, this.executionSecondVal);
    },
    displayExecutionPer() {
      return Math.floor(this.executionPer);
    },
    consensusPer() {
      return this.getPer(this.consensusFirstVal, this.consensusSecondVal);
    },
    displayConsensusPer() {
      return Math.floor(this.consensusPer);
    },
    filteredSyncStatus() {
      if (!Array.isArray(this.syncstatus.data) || !this.selectedSetup) {
        return [];
      }

      const serviceMapping = {
        NIMBUS: "NimbusBeaconService",
        LIGHTHOUSE: "LighthouseBeaconService",
        PRYSM: "PrysmBeaconService",
        GETH: "GethService",
        RETH: "RethService",
        BESU: "BesuService",
        NETHERMIND: "NethermindService",
        TEKU: "TekuBeaconService",
        LODESTAR: "LodestarBeaconService",
      };

      const setupServices = this.selectedSetup.services.map((service) => service.service);

      return this.syncstatus.data.filter((status) => {
        if (status.length < 2) return false;

        const consensusTitle = status[0]?.title.toUpperCase();
        const executionTitle = status[1]?.title.toUpperCase();

        const consensusService = serviceMapping[consensusTitle] || null;
        const executionService = serviceMapping[executionTitle] || null;

        if (!consensusService || !executionService) {
          return false;
        }

        return setupServices.includes(consensusService) && setupServices.includes(executionService);
      });
    },
  },
  watch: {
    selectedSetup() {
      this.pageNumber = 1;
      this.syncControler();
    },
    filteredSyncStatus() {
      this.pageNumber = 1;
      this.syncControler();
    },
  },

  mounted() {
    this.syncControler();
  },
  unmounted() {
    if (this.refresher) clearTimeout(this.refresher);
  },
  methods: {
    clientImage(name) {
      if (!name) {
        return "";
      }
      const lowerCaseInputValue = name.toLowerCase();
      const clientData = [...this.consensusClientsData, ...this.executionClientsData];
      const matchingClient = clientData.find((client) => client.name.toLowerCase() === lowerCaseInputValue);

      if (name === this.consensusName) {
        this.currentConsensusIcon = matchingClient.img;
      } else if (name === this.executionName) {
        this.currentExecutionIcon = matchingClient.img;
      }

      return matchingClient ? matchingClient.img : "";
    },
    getPer(firstVal, secondVal) {
      return ((firstVal / secondVal) * 100).toFixed(5);
    },
    formatValues(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    nextPage() {
      this.refresh(true, "next");
    },
    backPage() {
      this.refresh(true, "prev");
    },
    syncItemSytle(item) {
      item = JSON.parse(JSON.stringify(item)); // toRaw()
      if (item && !item.hasOwnProperty("style")) {
        return "";
      }
      return item.style;
    },
    syncSituation() {
      if (this.syncIcoError) {
        this.synchronizationErrorControl = true;
        return this.errorIco;
      }
      if (this.syncIcoUnknown) {
        this.synchronizationErrorControl = false;
        return this.unknownIco;
      }
      if (this.syncIcoSituation) {
        this.synchronizationErrorControl = false;
        return this.activeIco;
      }
      this.synchronizationErrorControl = false;
      return this.synchedIco;
    },
    refresh(instant = false, loadPage = "") {
      if (this.refresher) clearTimeout(this.refresher);
      if (instant) return this.syncControler(loadPage);
      this.refresher = setTimeout(() => {
        this.syncControler(loadPage);
      }, 3000);
    },
    syncControler(loadPage = "") {
      let pageNumber = this.pageNumber;
      if (loadPage === "next") {
        pageNumber++;
        if (pageNumber > this.filteredSyncStatus.length) {
          pageNumber = 1; // cycle to first page
        }
      } else if (loadPage === "prev") {
        pageNumber--;
        if (pageNumber < 1) {
          pageNumber = this.filteredSyncStatus.length; // cycle to last page
        }
      }

      let gid = pageNumber - 1;
      let clients = this.filteredSyncStatus[gid] || false;

      if (!clients) {
        // console.log("No clients found for the current page.");
        this.syncItemsShow = false;
        return;
      }

      let isMultiService = this.filteredSyncStatus.length > 1;
      let syncItemsShow = true;
      let syncIcoUnknown = false;
      let syncIcoError = false;
      let syncIcoSituation = false;
      let noDataLayerShow = false;
      let fonts = {
        red: [], // client error (for example docker container not running) - icon red
        orange: [], // abnormal client data during init (for example: lowerslot > higherslot) - icon unknown
        grey: [], // zero client data: lowerslot and higherslot are zero (usually the case while the EC waits for the CC to go in sync)
        blue: [], // client not in-sync, thus currently synchronizing
        green: [], // client in-sync, thus synchronized
      };

      clients.forEach((client, index) => {
        let lo = parseInt(client.frstVal);
        let hi = parseInt(client.scndVal);
        let st = client.state;

        if (st !== "running") {
          fonts.red.push(index);
          syncIcoError = true;
        } else if (lo > hi) {
          fonts.orange.push(index);
          syncIcoUnknown = true;
        } else if (lo < 1 && hi < 1) {
          fonts.grey.push(index);
          syncIcoSituation = true;
        } else if (lo < hi) {
          fonts.blue.push(index);
          syncIcoSituation = true;
        } else {
          fonts.green.push(index);
        }
      });

      if (fonts.grey.length && fonts.grey.length === clients.length) {
        syncIcoUnknown = true; // all clients 0/0 -> show unknown icon
      }

      clients.forEach((client, index) => {
        if (fonts.red.includes(index)) {
          client.style = "clientred";
        } else if (fonts.orange.includes(index)) {
          client.style = "clientorange";
        } else if (fonts.grey.includes(index)) {
          client.style = "clientgrey";
        } else if (fonts.blue.includes(index)) {
          client.style = "clientblue";
        } else if (fonts.green.includes(index)) {
          client.style = "clientgreen";
        }
      });

      this.syncItemsShow = syncItemsShow;
      this.syncIcoUnknown = syncIcoUnknown;
      this.syncIcoError = syncIcoError;
      this.syncIcoSituation = syncIcoSituation;
      this.pageNumber = pageNumber;
      this.clients = clients;

      clients.forEach((item) => {
        if (item?.type === "consensus") {
          this.consensusName = item?.title;
          this.consensusFirstVal = item.frstVal;
          this.consensusSecondVal = item.scndVal;
          this.consensusClass = item.style;
          this.consensuColor = this.clientInfo[item.style]?.color;
          this.consensusText = this.clientInfo[item.style]?.text;
          if (item.style === "clientblue") {
            this.consensusText = this.displayConsensusPer + "% " + this.consensusText;
          }
        } else {
          this.executionName = item?.title;
          this.executionFirstVal = item.frstVal;
          this.executionSecondVal = item.scndVal;
          this.executionClass = item.style;
          this.executionColor = this.clientInfo[item.style]?.color;
          this.executionText = this.clientInfo[item.style]?.text;
          if (item.style === "clientblue") {
            this.executionText = this.displayExecutionPer + "% " + this.executionText;
          }
        }
      });

      this.isMultiService = isMultiService;
      this.noDataLayerShow = noDataLayerShow;
      this.refresh();
    },
  },
};
</script>

<style scoped>
.activeWidget {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.consensusContainer,
.executionContainer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 45%;
  height: 98%;
  flex-direction: column;
  position: relative;
}
.consensusName,
.executionName {
  font-size: 60%;
  font-weight: 600;
  text-shadow: 1px 2px 5px #4f5256;
  display: flex;
  width: 100%;
  height: 17%;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}
.executionIconCons {
  position: absolute;
  width: 51%;
  left: 24.5%;
  top: 28.5%;
}
.consensusIconCons {
  position: absolute;
  width: 51%;
  left: 24.5%;
  top: 28.5%;
}
.consensusPer {
  position: absolute;
  left: 10%;
  top: 85%;
  font-size: 30%;
  font-weight: 600;
  text-shadow: 1px 2px 5px #4f5256;
  text-transform: uppercase;
}
.progressBox {
  display: flex;
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.syncStatusStatus {
  width: 100%;
  height: 12%;
  display: flex;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 50%;
  justify-content: center;
  align-items: center;
  bottom: 0;
}
.pageNumber {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  width: 98%;
  height: 30%;
}
.arrowBox {
  width: 6%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.arrowUp,
.arrowDown {
  height: 30%;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
}
.arrowDown img {
  transform: rotate(180deg);
}
.Sync-parent {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  height: 100%;
}
.sync-box {
  width: 90%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.sync-icon {
  box-sizing: border-box;
  width: 31%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.sync-icon span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  color: #c1c1c1;
  font-weight: bold;
}
.sync-icon_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.sync-icon_container img {
  width: 70%;
  height: 90%;
}
.sync-box_value {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow-y: auto;
  color: #c1c1c1;
  overflow-y: auto;
  position: relative;
}
.wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 69%;
  height: 100%;
  position: relative;
}
.sync-box_row {
  display: flex;
  width: 95%;
  height: 27%;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #c1c1c1;
  border-radius: 5px;
  padding: 2% 2%;
  margin: 2% 0;
}
.sync-box-row_title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  font-weight: 600;
  font-size: 45%;
  margin-left: 1%;
}
.sync-box-row_val {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 62%;
  font-weight: 400;
  font-size: 50%;
  color: #94deff;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}

/* Client font colors */
.clientred * {
  color: #f84343;
}
.clientorange * {
  color: #ff8c00;
}
.clientgrey * {
  color: grey;
}
.clientblue * {
  color: lightblue;
}
.clientgreen * {
  color: #00be00;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}
</style>
