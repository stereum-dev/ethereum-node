<template>
  <div class="peer2peerParent">
    <div class="p2pBox">
      <div class="p2pIco">
        <div class="p2pIco-container">
          <img :src="p2pSituation()" />
        </div>
        <span>PEER NETWORK</span>
      </div>
      <div class="wrapper">
        <no-data v-if="noDataLayerShow"></no-data>
        <div v-show="p2pItemsShow" class="p2pBarBox">
          <div class="p2pBarCont">
            <div class="titleVal">
              <span>{{ consensusClient }}</span>
            </div>
            <div class="p2pVal">
              <div class="p2pVal_value" :style="firstBar"></div>
            </div>
            <div class="valNo">
              <span>{{ consensusNumPeer }}</span>
            </div>
          </div>
          <div class="p2pBarCont">
            <div class="titleVal">
              <span>{{ executionClient }}</span>
            </div>
            <div class="p2pVal">
              <div class="p2pVal_value" :style="secondBar"></div>
            </div>
            <div class="valNo">
              <span>{{ executionNumPeer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isMultiService" v-show="p2pItemsShow" class="arrowBox">
      <div class="arrowUp" @click="backPage">
        <img src="../../../../public/img/icon/control/arrowIcon.png" alt="arrow" />
      </div>
      <div class="pageNumber">
        <span>{{ pageNumber }}</span>
      </div>
      <div class="arrowDown" @click="nextPage">
        <img src="../../../../public/img/icon/control/arrowIcon.png" alt="arrow" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useControlStore } from "../../../store/theControl";
import NoData from "./NoData.vue";
export default {
  components: { NoData },
  data() {
    return {
      pageNumber: 1,
      isMultiService: false,
      p2pItemsShow: false,
      p2pIcoUnknown: true,
      noDataLayerShow: false,
      consensusClient: "CC",
      consensusNumPeer: "100",
      consensusValPeer: "0",
      executionClient: "EC",
      executionNumPeer: "100",
      executionValPeer: "0",
      p2pIco: [
        {
          id: 1,
          name: "default",
          icon: "/img/icon/control/PeerToPeerIcon.svg",
        },
        {
          id: 2,
          name: "unknown",
          icon: "/img/icon/control/spinner.gif",
        },
      ],
    };
  },
  computed: {
    ...mapState(useControlStore, {
      code: "code",
      p2pstatus: "p2pstatus",
    }),
    defaultIco() {
      return this.p2pIco[0].icon;
    },
    unknownIco() {
      return this.p2pIco[1].icon;
    },
    firstBar() {
      return { width: this.consensusValPeer + "%" };
    },
    secondBar() {
      return { width: this.executionValPeer + "%" };
    },
  },
  mounted() {
    this.p2pControler();
  },
  unmounted() {
    if (this.refresher) clearTimeout(this.refresher);
  },

  methods: {
    nextPage() {
      this.refresh(true, "next");
    },
    backPage() {
      this.refresh(true, "prev");
    },
    p2pSituation() {
      if (this.p2pIcoUnknown) {
        return this.unknownIco;
      }
      return this.defaultIco;
    },
    refresh(instant = false, loadPage = "") {
      if (this.refresher) clearTimeout(this.refresher);
      if (instant) return this.p2pControler(loadPage);
      this.refresher = setTimeout(() => {
        this.p2pControler(loadPage);
      }, 3000);
    },
    p2pControler(loadPage = "") {
      let pageNumber = this.pageNumber;
      if (loadPage == "next") {
        if (pageNumber >= 99) {
          pageNumber = 1; // cycle to first page
        } else {
          pageNumber++;
        }
      } else if (loadPage == "prev") {
        pageNumber--;
      }
      let gid = pageNumber - 1;
      let clients =
        this.p2pstatus.hasOwnProperty("data") && Array.isArray(this.p2pstatus.data) && gid in this.p2pstatus.data
          ? this.p2pstatus.data[gid]
          : false;
      if (!clients) {
        let clients_first =
          this.p2pstatus.hasOwnProperty("data") && Array.isArray(this.p2pstatus.data) && this.p2pstatus.data.length > 0
            ? this.p2pstatus.data[0]
            : false;
        let clients_last =
          this.p2pstatus.hasOwnProperty("data") && Array.isArray(this.p2pstatus.data) && this.p2pstatus.data.length > 0
            ? this.p2pstatus.data[this.p2pstatus.data.length - 1]
            : false;
        if (pageNumber < 1 && clients_last !== false) {
          // first page-1 reached when clicked on prev page, reset to last page
          pageNumber = this.p2pstatus.data.length;
          gid = pageNumber - 1;
          clients = this.p2pstatus.data[gid];
        } else if (clients_first) {
          // last page+1 reached when clicked on next page, reset to first page
          pageNumber = 1;
          gid = pageNumber - 1;
          clients = this.p2pstatus.data[gid];
        } else {
          // waiting for data on page load (or while invalid data is retrieved)
          if (this.p2pstatus.hasOwnProperty("data") && this.p2pstatus.data.hasOwnProperty("error")) {
            if (this.p2pstatus.data.error == "prometheus service not running") {
              this.p2pItemsShow = false;
              this.p2pIcoUnknown = true;
              this.noDataLayerShow = true;
              //this.pageNumber = 1;
              //this.isMultiService = false;
            }
          }
          this.refresh();
          return;
        }
      }
      let isMultiService = false;
      let p2pItemsShow = false;
      let p2pIcoUnknown = true;
      let noDataLayerShow = false;
      let consensusClient = this.consensusClient;
      let consensusNumPeer = this.consensusNumPeer;
      let consensusValPeer = this.consensusValPeer;
      let executionClient = this.executionClient;
      let executionNumPeer = this.executionNumPeer;
      let executionValPeer = this.executionValPeer;
      if (
        this.code === 0 &&
        this.p2pstatus.code === 0 &&
        Array.isArray(this.p2pstatus.data) &&
        //Array.isArray(this.p2pstatus.data[gid]) &&
        typeof this.p2pstatus.data[gid] === "object" &&
        this.p2pstatus.data[gid].hasOwnProperty("details")
      ) {
        isMultiService = this.p2pstatus.data.length > 1 ? true : false;
        p2pItemsShow = true;
        p2pIcoUnknown = false;
        consensusClient = clients.details.consensus.client;
        consensusNumPeer = clients.details.consensus.numPeer;
        consensusValPeer = clients.details.consensus.valPeer;
        executionClient = clients.details.execution.client;
        executionNumPeer = clients.details.execution.numPeer;
        executionValPeer = clients.details.execution.valPeer;
      }
      this.pageNumber = pageNumber;
      this.isMultiService = isMultiService;
      this.p2pItemsShow = p2pItemsShow;
      this.p2pIcoUnknown = p2pIcoUnknown;
      this.noDataLayerShow = noDataLayerShow;
      this.consensusClient = consensusClient;
      this.consensusNumPeer = consensusNumPeer;
      this.consensusValPeer = consensusValPeer;
      this.executionClient = executionClient;
      this.executionNumPeer = executionNumPeer;
      this.executionValPeer = executionValPeer;
      this.refresh();
    },
  },
};
</script>
<style scoped>
.valNo {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 65%;
  font-weight: 800;
  width: 12%;
  height: 100%;
  color: #c1c1c1;
}
.pageNumber {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 70%;
  width: 98%;
  height: 30%;
  color: #c1c1c1;
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
.p2pBarBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
}
.wrapper {
  width: 70%;
  height: 100%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}
.titleVal {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 40%;
  height: 100%;
  font-size: 42%;
  font-weight: 600;
  color: #c1c1c1;
}
.peer2peerParent {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}
.p2pTtl {
  width: 100%;
  height: 20%;
  background: #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
}

.p2pBox {
  width: 90%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: center;
}
.p2pIco {
  box-sizing: border-box;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.p2pIco span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
  color: #c1c1c1;
}
.p2pIco-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
}
.p2pIco-container img {
  width: 70%;
  height: 90%;
}

.p2pBarCont {
  width: 95%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 40%;
}
.p2pVal {
  width: 60%;
  height: 80%;
  margin-right: 5px;
  background: #33393e;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 1px 1px 11px 1px #1f1f1f;
}
.p2pVal_value {
  background: #568d50;
  height: 98%;
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
</style>
