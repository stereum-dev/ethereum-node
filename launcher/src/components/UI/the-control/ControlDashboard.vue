<template>
  <div class="ctrlParent gap-1 p-1">
    <div class="machineName_cell">
      <machine-name />
    </div>
    <div class="node-serve">
      <EpochSlot @mouseenter="footerSetter('current EPOCH & current SLOT')" @mouseleave="cursorLocation = ''" />
    </div>
    <div class="sandFull_cell">
      <TheBalance @mouseenter="footerSetter('Finalized EPOCH & Balance')" @mouseleave="cursorLocation = ''" />
    </div>
    <dashboard-card class="hard-disk">
      <the-hard @mouseenter="cursorLocation = `${storVol}`" @mouseleave="cursorLocation = ''" />
    </dashboard-card>
    <dashboard-card class="storage"
      ><the-storage @mouseenter="cursorLocation = `${stor}`" @mouseleave="cursorLocation = ''"
    /></dashboard-card>
    <dashboard-card class="disk-speed"
      ><disk-speed @mouseenter="cursorLocation = `${diskSpeed}`" @mouseleave="cursorLocation = ''"
    /></dashboard-card>
    <dashboard-card class="p2p">
      <peer-to-peer @mouseenter="footerSetter(p2p)" @mouseleave="cursorLocation = ''" />
      <!-- <newPeerToPeer /> -->
    </dashboard-card>
    <dashboard-card class="the-cpu">
      <the-cpu @mouseenter="cursorLocation = `${cpuUse}`" @mouseleave="cursorLocation = ''" />
    </dashboard-card>
    <dashboard-card class="amsterdam">
      <amsterdam-component />
    </dashboard-card>
    <dashboard-card class="sync-status"
      ><sync-status @mouseenter="cursorLocation = `${syncInfo}`" @mouseleave="cursorLocation = ''"
    /></dashboard-card>
    <dashboard-card class="validatorComment_cell">
      <the-staking />
    </dashboard-card>
    <dashboard-card class="the-ram">
      <the-ram @mouseenter="cursorLocation = `${ramUse}`" @mouseleave="cursorLocation = ''"
    /></dashboard-card>
    <dashboard-card class="the-network"
      ><the-network @mouseenter="cursorLocation = `${netSpeed}`" @mouseleave="cursorLocation = ''"
    /></dashboard-card>
    <dashboard-card class="portlist_card">
      <port-list @mouseenter="cursorLocation = `${listPort}`" @mouseleave="cursorLocation = ''" />
      <!-- <SubscribedSubnets /> -->
    </dashboard-card>
    <div class="half-card">
      <rpc-endpoint @mouseenter="cursorLocation = `RPC ${endPoint}`" @mouseleave="cursorLocation = ''" />
    </div>
    <div class="half-card2">
      <ws-endpoint @mouseenter="cursorLocation = `WS ${endPoint}`" @mouseleave="cursorLocation = ''" />
    </div>

    <div class="half-card3">
      <data-api @mouseenter="cursorLocation = `${data} API`" @mouseleave="cursorLocation = ''" />
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
import TheStorage from "./TheStorage.vue";
import DataApi from "./DataApi.vue";
import SyncStatus from "./SyncStatus.vue";
import EpochSlot from "./EpochSlot.vue";
import TheCpu from "./TheCpu.vue";
import TheHard from "./TheHard.vue";
import MachineName from "./MachineName.vue";
import DashboardCard from "./DashboardCard.vue";
import AmsterdamComponent from "./AmsterdamComponent.vue";
import TheRam from "./TheRam.vue";
import PeerToPeer from "./PeerToPeer.vue";
import TheNetwork from "./TheNetwork.vue";
import TheBalance from "./TheBalance";
import RpcEndpoint from "./RpcEndpoint.vue";
import WsEndpoint from "./WsEndpoint.vue";
import DiskSpeed from "./DiskSpeed.vue";
import PortList from "./PortList.vue";
import TheStaking from "./TheStaking.vue";

// import NewPeerToPeer from "./NewPeerToPeer.vue";
// import SubscribedSubnets from "./SubscribedSubnets.vue";
export default {
  components: {
    PortList,
    TheStorage,
    DataApi,
    SyncStatus,
    TheHard,
    DashboardCard,
    AmsterdamComponent,
    MachineName,
    TheRam,
    // NewPeerToPeer,
    // SubscribedSubnets,
    PeerToPeer,
    TheCpu,
    TheNetwork,
    TheBalance,
    EpochSlot,
    RpcEndpoint,
    WsEndpoint,
    DiskSpeed,
    TheStaking,
  },
  data() {
    return {
      machineName: this.$t("controlPage.machineName"),
      storVol: this.$t("controlPage.storVol"),
      stor: this.$t("controlPage.stor"),
      diskSpeed: this.$t("controlPage.diskSpeed"),
      p2p: this.$t("controlPage.p2p"),
      cpuUse: this.$t("controlPage.cpuUse"),
      syncInfo: this.$t("controlPage.syncInfo"),
      ramUse: this.$t("controlPage.ramUse"),
      netSpeed: this.$t("controlPage.netSpeed"),
      listPort: this.$t("controlPage.listPort"),
      endPoint: this.$t("controlPage.endPoint"),
      data: this.$t("controlPage.data"),
    };
  },
  computed: {
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
      nodataMessage: "nodataMessage",
    }),
  },

  methods: {
    footerSetter(arg) {
      this.cursorLocation = this.nodataMessage === "" ? arg : this.nodataMessage;
    },
  },
};
</script>

<style scoped>
.portlist_card {
  grid-column: 2/3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
}
.link {
  text-decoration: none;
  color: #eee;
}

.ctrlParent {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 10% repeat(5, 80px);
  position: relative;
  box-sizing: border-box;
  cursor: default;
}
.card a {
  width: 100%;
  height: 100%;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.machineName_cell {
  grid-column: 1/2;
  grid-row: 1/2;
  color: aliceblue;
  border-radius: 15px 0 0 0;
}

.node-serve {
  grid-column: 2/3;
  grid-row: 1/2;
}

.sandFull_cell {
  grid-column: 3/4;
  grid-row: 1/2;
  border-radius: 0 15px 0 0;
  display: flex;
}

.hard-disk {
  grid-column: 1/2;
  grid-row: 2/3;
}
.storage {
  grid-column: 1/2;
  grid-row: 3/4;
}
.disk-speed {
  grid-column: 1/2;
  grid-row: 4/5;
}
.amsterdam {
  grid-row: 3/4;
  grid-column: 2/3;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.the-cpu {
  grid-row: 5/6;
  grid-column: 1/2;
}
.sync-status {
  grid-column: 2/3;
  grid-row: 4/5;
}

.validatorComment_cell {
  grid-column: 3/4;
  grid-row: 2/3;
}

.the-ram {
  grid-column: 1/2;
  grid-row: 6/7;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.the-network {
  grid-row: 2/3;
  grid-column: 2/3;
}
.half-card {
  grid-row: 3/4;
  grid-column: 3/4;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.half-card2 {
  grid-row: 4/5;
  grid-column: 3/4;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.half-card3 {
  grid-row: 5/6;
  grid-column: 3/4;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.p2p {
  grid-row: 5/6;
  grid-column: 2/3;
}
</style>
