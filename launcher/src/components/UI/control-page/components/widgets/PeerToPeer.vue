<template>
  <div class="peer2peerParent">
    <no-data
      v-if="isConsensusMissing || !footerStore.isConsensusRunning"
      @mouseenter="footerStore.cursorLocation = footerStore.nodataMessage"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <template v-else>
      <div class="p2pBox">
        <div class="p2pIco">
          <div class="p2pIco-container">
            <img src="/img/icon/control-page-icons/PeerToPeerIcon.svg" alt="Peer to Peer Icon" />
          </div>
          <span>{{ t("controlPage.peerNetwork") }}</span>
        </div>
        <div class="wrapper">
          <div class="p2pBarBox">
            <ClientStatus
              :client-name="consensusClient"
              :client-val="consensusValPeer"
              :client-num="consensusNumPeer"
              @mouseenter="
                footerStore.cursorLocation = `${t('controlPage.connectedPairsTo', {
                  client: consensusClient,
                  peer: consensusValPeer,
                })} `
              "
              @mouseleave="footerStore.cursorLocation = ''"
            />
            <ClientStatus
              :client-name="executionClient"
              :client-val="executionValPeer"
              :client-num="executionNumPeer"
              @mouseenter="
                footerStore.cursorLocation = `${t('controlPage.connectedPairsTo', {
                  client: executionClient,
                  peer: executionValPeer,
                })} `
              "
              @mouseleave="footerStore.cursorLocation = ''"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useControlStore } from "@/store/theControl";
import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

import NoData from "./NoData.vue";
import ClientStatus from "../fragments/ClientStatus.vue";

const t = i18n.global.t;

const controlStore = useControlStore();
const setupStore = useSetups();
const footerStore = useFooter();

const consensusClient = computed(() => setupStore.selectedServicePairs?.consensusService?.name || "Unknown");
const executionClient = computed(() => setupStore.selectedServicePairs?.executionService?.name || "Unknown");

const findPeerDetails = (serviceType, id) => {
  const p2pData = Array.isArray(controlStore.p2pstatus?.data) ? controlStore.p2pstatus.data : [];

  return p2pData.find((pair) => pair.details[serviceType]?.serviceID === id)?.details[serviceType] || {};
};

const consensusValPeer = computed(() => findPeerDetails("consensus", setupStore.selectedServicePairs?.consensusService?.id).valPeer || 0);
const consensusNumPeer = computed(() => findPeerDetails("consensus", setupStore.selectedServicePairs?.consensusService?.id).numPeer || 0);

const executionValPeer = computed(() => findPeerDetails("execution", setupStore.selectedServicePairs?.executionService?.id).valPeer || 0);
const executionNumPeer = computed(() => findPeerDetails("execution", setupStore.selectedServicePairs?.executionService?.id).numPeer || 0);

const isConsensusMissing = computed(() => footerStore.missingServices?.includes("consensus"));
</script>

<style scoped>
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
</style>
