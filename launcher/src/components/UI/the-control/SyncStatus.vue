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
        <no-data v-if="noDataLayerShow"></no-data>
        <div class="activeWidget" v-else>
          <div class="consensusContainer">
            <div class="consensusName">
              <span>{{ consensusClientsData[0].name }}</span>
            </div>
            <div class="progressBox">
              <sync-circular-progress
                :color="consensusClientCurrentColor"
                :sync-percent="consensusPer"
              />
            </div>

            <div
              class="syncStatusStatus"
              v-if="consensusSyncstatus"
              :class="consensusSyncstatusClass"
            >
              <span>{{ displayConsensusPer }}% SYNCING</span>
            </div>
            <div
              class="syncStatusStatus"
              v-else
              :class="consensusSyncstatusClass"
            >
              <span>SYNCED</span>
            </div>
            <div
              class="consensusIconCons"
              :class="{ clientColor: clientColor }"
              :data-tooltip="
                consensusClientsData[0].name +
                ': ' +
                formatValues(consensusFirstVal) +
                ' / ' +
                formatValues(consensusSecondVal)
              "
            >
              <img
                src="/img/icon/plugin-icons/consensus/Nimbus.png"
                alt="consensus"
              />
            </div>
          </div>

          <div class="executionContainer">
            <div class="executionName">
              <span>{{ executionClientsData[0].name }}</span>
            </div>

            <div class="progressBox">
              <sync-circular-progress
                :color="exectionClientCurrentColor"
                :sync-percent="executionPer"
              />
            </div>

            <div
              class="syncStatusStatus"
              v-if="executionSyncstatus"
              :class="executionSyncstatusClass"
            >
              <span>{{ displayExecutionPer }}% SYNCING</span>
            </div>
            <div
              class="syncStatusStatus"
              v-else
              :class="executionSyncstatusClass"
            >
              <span>SYNCED</span>
            </div>
            <div
              class="executionIconCons"
              :data-tooltip="
                executionClientsData[0].name +
                ': ' +
                formatValues(executionFirstVal) +
                ' / ' +
                formatValues(executionSecondVal)
              "
            >
              <img :src="executionClientsData[0].img" alt="execution" />
            </div>
          </div>
        </div>
        <!--new form end-->
        <!--old form start-->
        <!-- <no-data v-if="noDataLayerShow"></no-data>
        <div class="sync-box_value" v-if="syncItemsShow">
          <div
            v-for="item in clients"
            :key="item.id"
            class="sync-box_row"
            :class="syncItemSytle(item)"
          >
            <div class="sync-box-row_title">
              <span>{{ item.title }}</span>
            </div>
            <div class="sync-box-row_val">
              <span
                >{{ formatValues(item.frstVal) }} /
                {{ formatValues(item.scndVal) }}</span
              >
            </div>
          </div>
        </div> -->
        <!--old form end-->
      </div>
    </div>
    <div class="arrowBox" v-if="isMultiService">
      <div class="arrowUp" @click="backPage">
        <img src="/img/icon/control/arrowIcon.png" alt="arrow" />
      </div>
      <div class="pageNumber">
        <span>{{ pageNumber }}</span>
      </div>
      <div class="arrowDown" @click="nextPage">
        <img src="/img/icon/control/arrowIcon.png" alt="arrow" />
      </div>
    </div>
  </div>
</template>
<script>
import SyncCircularProgress from "./SyncCircularProgress.vue";
import { mapState } from "pinia";
import { useControlStore } from "../../../store/theControl";
import NoData from "./NoData.vue";
export default {
  components: { NoData, SyncCircularProgress },
  data() {
    return {
      //test values before wiring
      consensusFirstVal: 10000000,
      consensusSecondVal: 123456789,
      executionFirstVal: 901234444,
      executionSecondVal: 1234567899,

      //this two color are usable for the progress circle color dynamic
      consensusClientColor: "",
      executionClientColor: "",
      //----------------------------------
      clientRed: "#f84343",
      clientOrange: "#ff8c00",
      clientGrey: "grey",
      clientBlue: "#3c8de4",
      clientGreen: "#00be00",
      consensusClientsData: [
        {
          name: "lighthouse",
          img: "/img/icon/plugin-icons/consensus/LightHouse.png",
        },
        {
          name: "lodestar",
          img: "/img/icon/plugin-icons/consensus/Lodestar.png",
        },
        {
          name: "nimbus",
          img: "/img/icon/plugin-icons/consensus/Nimbus.png",
        },
        {
          name: "prysm",
          img: "/img/icon/plugin-icons/consensus/Prysm.png",
        },
        {
          name: "teku",
          img: "/img/icon/plugin-icons/consensus/Teku.png",
        },
      ],
      executionClientsData: [
        {
          name: "erigon",
          img: "/img/icon/plugin-icons/execution/Erigon.png",
        },
        {
          name: "geth",
          img: "/img/icon/plugin-icons/execution/Geth.png",
        },
        {
          name: "hyperLedger-besu",
          img: "/img/icon/plugin-icons/execution/hyperLedger-besu.png",
        },
        {
          name: "nethermind",
          img: "/img/icon/plugin-icons/execution/Nethermind.png",
        },
        {
          name: "openEthereum",
          img: "/img/icon/plugin-icons/execution/OpenEthereum.png",
        },
      ],

      //----------------------------
      isMultiService: false,
      pageNumber: 1,
      clients: [],
      syncItemsShow: false,
      syncIcoUnknown: true,
      syncIcoSituation: false,
      syncIcoError: false,
      noDataLayerShow: false,
      syncIco: [
        {
          id: 1,
          name: "error",
          icon: "/img/icon/arrows/SynchronisationIconError.gif",
        },
        {
          id: 2,
          name: "active",
          icon: "/img/icon/arrows/SynchronisationIconActive.gif",
        },
        {
          id: 3,
          name: "synched",
          icon: "/img/icon/arrows/SynchronisationIconSynchronized.gif",
        },
        {
          id: 4,
          name: "unknown",
          icon: "/img/icon/arrows/SynchronisationIconUnknown.gif",
        },
      ],
    };
  },
  mounted() {
    this.syncControler();
  },
  unmounted() {
    if (this.refresher) clearTimeout(this.refresher);
  },

  computed: {
    executionPer() {
      return this.getPer(this.executionFirstVal, this.executionSecondVal);
    },
    displayExecutionPer() {
      return Math.floor(this.executionPer);
    },
    executionSyncstatus() {
      return this.SyncStatus(this.executionPer);
    },
    executionSyncstatusClass() {
      return this.executionSyncstatus ? "blue" : "green";
    },
    consensusSyncstatus() {
      return this.SyncStatus(this.consensusPer);
    },
    consensusSyncstatusClass() {
      return this.consensusSyncstatus ? "blue" : "green";
    },
    consensusPer() {
      return this.getPer(this.consensusFirstVal, this.consensusSecondVal);
    },
    displayConsensusPer() {
      return Math.floor(this.consensusPer);
    },
    consensusClientCurrentColor() {
      this.consensusClientColor = this.clientGreen;
      return this.consensusClientColor;
    },
    exectionClientCurrentColor() {
      this.executionClientColor = this.clientBlue;
      return this.executionClientColor;
    },
    ...mapState(useControlStore, {
      code: "code",
      syncstatus: "syncstatus",
    }),
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
  },
  methods: {
    SyncStatus(val) {
      return val < 100 ? true : false;
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
      if (!item.hasOwnProperty("style")) {
        return "";
      }
      return item.style;
    },
    syncSituation() {
      if (this.syncIcoError) {
        return this.errorIco;
      }
      if (this.syncIcoUnknown) {
        return this.unknownIco;
      }
      if (this.syncIcoSituation) {
        return this.activeIco;
      }
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
      let pageNum = this.pageNumber;
      if (loadPage == "next") {
        if (pageNum >= 99) {
          pageNum = 1; // cycle to first page
        } else {
          pageNum++;
        }
      } else if (loadPage == "prev") {
        pageNum--;
      }
      let gid = pageNum - 1;
      let clients =
        Array.isArray(this.syncstatus.data) && gid in this.syncstatus.data
          ? this.syncstatus.data[gid]
          : false;
      if (!clients) {
        let clients_first =
          Array.isArray(this.syncstatus.data) && this.syncstatus.data.length > 0
            ? this.syncstatus.data[0]
            : false;
        let clients_last =
          Array.isArray(this.syncstatus.data) && this.syncstatus.data.length > 0
            ? this.syncstatus.data[this.syncstatus.data.length - 1]
            : false;
        if (pageNum < 1 && clients_last !== false) {
          // first page-1 reached when clicked on prev page, reset to last page
          pageNum = this.syncstatus.data.length;
          gid = pageNum - 1;
          clients = this.syncstatus.data[gid];
        } else if (clients_first) {
          // last page+1 reached when clicked on next page, reset to first page
          pageNum = 1;
          gid = pageNum - 1;
          clients = this.syncstatus.data[gid];
        } else {
          // waiting for data on page load (or while invalid data is retrieved)
          if (
            this.syncstatus.hasOwnProperty("data") &&
            this.syncstatus.data.hasOwnProperty("error")
          ) {
            if (
              this.syncstatus.data.error == "prometheus service not running"
            ) {
              this.syncItemsShow = false;
              this.syncIcoUnknown = true;
              this.syncIcoError = false;
              this.syncIcoSituation = false;
              this.noDataLayerShow = true;
              //this.pageNumber = 1;
              //this.clients = [];
              //this.isMultiService = false;
            }
          }
          this.refresh();
          return;
        }
      }
      //console.log('pageNum final',pageNum)
      let isMultiService = false;
      let syncItemsShow = false;
      let syncIcoUnknown = true;
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
      if (
        this.code === 0 &&
        this.syncstatus.code === 0 &&
        Array.isArray(this.syncstatus.data) &&
        Array.isArray(this.syncstatus.data[gid]) &&
        this.syncstatus.data[gid][0].hasOwnProperty("title")
      ) {
        isMultiService = this.syncstatus.data.length > 1 ? true : false;
        syncItemsShow = true;
        syncIcoUnknown = false;
        for (let k in this.syncstatus.data[gid]) {
          let lo = parseInt(this.syncstatus.data[gid][k].frstVal);
          let hi = parseInt(this.syncstatus.data[gid][k].scndVal);
          let st = this.syncstatus.data[gid][k].state;
          if (st != "running") {
            fonts.red.push(k);
            syncIcoError = true;
            continue;
          }
          if (lo > hi) {
            fonts.orange.push(k);
            syncIcoUnknown = true;
            continue;
          }
          if (lo < 1 && hi < 1) {
            fonts.grey.push(k);
            syncIcoSituation = true;
            continue;
          }
          if (lo < hi) {
            fonts.blue.push(k);
            syncIcoSituation = true;
            continue;
          }
          fonts.green.push(k);
        }
        if (
          fonts.grey.length &&
          fonts.grey.length == this.syncstatus.data[gid].length
        ) {
          syncIcoUnknown = true; // all clients 0/0 -> show unknown icon
        }
        for (let col in fonts) {
          if (fonts[col].length) {
            for (let i = 0; i < fonts[col].length; i++) {
              let k = fonts[col][i];
              // let ct = this.syncstatus.data[gid][k].type;
              // console.log(ct + " client (" + this.syncstatus.data[gid][k].title + ") needs color " + col + " by class: client" + col + "!)");
              this.syncstatus.data[gid][k].style = "client" + col;
            }
          }
        }
      }
      this.syncItemsShow = syncItemsShow;
      this.syncIcoUnknown = syncIcoUnknown;
      this.syncIcoError = syncIcoError;
      this.syncIcoSituation = syncIcoSituation;
      this.pageNumber = pageNum;
      this.clients = clients;
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
.blue {
  color: #add8e6;
}
.green {
  color: #00be00;
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
  font-size: 40%;
  font-weight: 600;
  text-shadow: 1px 2px 5px #4f5256;
  display: flex;
  width: 100%;
  height: 15%;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}
.consensusIconCons,
.executionIconCons {
  position: absolute;
  width: 52%;
  left: 0;
  top: -53%;
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
  margin-top: 7%;
}
.syncStatusStatus {
  width: 100%;
  height: 15%;
  display: flex;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 40%;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
}
[data-tooltip] {
  position: relative;
  cursor: default;
}
[data-tooltip]::after {
  position: absolute;
  width: max-content;
  left: -300%;
  text-align: center;
  content: attr(data-tooltip);
  background: black;
  border-radius: 5px;
  font-size: 70%;
  padding: 8% 20%;
  border: 1px solid #929292;
  text-transform: uppercase;
  visibility: hidden;
  opacity: 0;
  transform: translateY(-320%);
  transition: opacity 0.3s transform 0.2s;
  font-weight: 600;
}
[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
  transform: rotateY(50%);
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
  font-size: 43%;
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
  width: 60%;
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
  color: #3c8de4;
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
