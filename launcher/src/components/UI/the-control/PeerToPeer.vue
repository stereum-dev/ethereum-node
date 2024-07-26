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
        <no-data
          v-if="isConsensusMissing || prometheusIsOff || !isConsensusRunning"
          @mouseenter="cursorLocation = `${nodataMessage}`"
          @mouseleave="cursorLocation = ''"
        />
        <div v-else class="p2pBarBox">
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
import { mapState } from "pinia";
import { useControlStore } from "@/store/theControl";
import { useFooter } from "@/store/theFooter";
import NoData from "./NoData.vue";
import { useSetups } from "@/store/setups";
export default {
  components: { NoData },
  data() {
    return {
      p2p: this.$t("controlPage.p2p"),
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
          icon: "/img/icon/control-page-icons/PeerToPeerIcon.svg",
        },
        {
          id: 2,
          name: "unknown",
          icon: "/animation/loading/mushroom-spinner.gif",
        },
      ],
    };
  },

  computed: {
    ...mapState(useSetups, {
      selectedSetup: "selectedSetup",
    }),
    ...mapState(useControlStore, {
      code: "code",
      p2pstatus: "p2pstatus",
    }),
    ...mapState(useFooter, {
      installedServicesController: "installedServicesController",
      missingServices: "missingServices",
      prometheusIsOff: "prometheusIsOff",
      isConsensusRunning: "isConsensusRunning",
      nodataMessage: "nodataMessage",
    }),
    filteredP2PStatus() {
      if (!Array.isArray(this.p2pstatus.data) || !this.selectedSetup) {
        return [];
      }

      const setupServices = this.selectedSetup?.services.map((service) => service.service);

      const filtered = this.p2pstatus.data.filter((status) => {
        const details = status.details;
        if (!details) {
          return false;
        }

        const consensusService = details.consensus?.service;
        const executionService = details.execution?.service;

        if (!consensusService || !executionService) {
          return false;
        }

        const consensusMatch = setupServices.includes(consensusService);
        const executionMatch = setupServices.includes(executionService);

        return consensusMatch && executionMatch;
      });

      return filtered;
    },
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
    isConsensusMissing() {
      return this.missingServices?.includes("consensus");
    },
  },
  watch: {
    selectedSetup() {
      this.pageNumber = 1;
      this.p2pControler();
    },
    filteredP2PStatus() {
      this.pageNumber = 1;
      this.p2pControler();
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
      if (loadPage === "next") {
        pageNumber++;
        if (pageNumber > this.filteredP2PStatus.length) {
          pageNumber = 1; // cycle to first page
        }
      } else if (loadPage === "prev") {
        pageNumber--;
        if (pageNumber < 1) {
          pageNumber = this.filteredP2PStatus.length; // cycle to last page
        }
      }

      let gid = pageNumber - 1;
      let clients = this.filteredP2PStatus[gid] || false;

      if (!clients) {
        // console.log("No clients found for the current page.");
        return;
      }

      let isMultiService = this.filteredP2PStatus.length > 1;
      let p2pItemsShow = true;
      let p2pIcoUnknown = false;
      let noDataLayerShow = false;
      let consensusClient = clients.details.consensus.client;
      let consensusNumPeer = clients.details.consensus.numPeer;
      let consensusValPeer = clients.details.consensus.valPeer;
      let executionClient = clients.details.execution.client;
      let executionNumPeer = clients.details.execution.numPeer;
      let executionValPeer = clients.details.execution.valPeer;

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
