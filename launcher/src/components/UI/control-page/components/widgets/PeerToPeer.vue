<template>
  <div class="peer2peerParent flex w-full h-full justify-center items-center relative">
    <no-data
      v-if="
        !setupStore?.selectedServicePairs ||
        isConsensusMissing ||
        !footerStore.isConsensusRunning ||
        setupStore?.selectedServicePairs?.network === 'devnet'
      "
      @mouseenter="footerStore.cursorLocation = footerStore.nodataMessage"
      @mouseleave="footerStore.cursorLocation = ''"
    />
    <template v-else>
      <div class="p2pIco w-1/4 h-full flex flex-col justify-center items-center">
        <div class="p2pIco-container flex justify-center items-center w-full h-4/5 p-2">
          <img class="w-full" src="/img/icon/control-page-icons/PeerToPeerIcon.svg" alt="Peer to Peer Icon" />
        </div>
        <span class="w-full h-1/5 flex justify-center items-center text-gray-200 text-[40%] font-semibold uppercase">{{
          t("controlPage.peerNetwork")
        }}</span>
      </div>

      <div class="p2pBarBox w-3/4 h-full flex justify-around items-center flex-col pt-1 pb-1">
        <ClientStatus
          :client-name="consensusClient"
          :client-val="consensusValPeer"
          :client-num="consensusNumPeer"
          :client-icon="reactiveServiceStates.consensus.icon"
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
          :client-icon="reactiveServiceStates.execution.icon"
          @mouseenter="
            footerStore.cursorLocation = `${t('controlPage.connectedPairsTo', {
              client: executionClient,
              peer: executionValPeer,
            })} `
          "
          @mouseleave="footerStore.cursorLocation = ''"
        />
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

const reactiveServiceStates = computed(() => ({
  execution: {
    name: setupStore.selectedServicePairs?.executionService?.name || "",
    icon: setupStore.selectedServicePairs?.executionService?.icon || "",
  },
  consensus: {
    name: setupStore.selectedServicePairs?.consensusService?.name || "",
    icon: setupStore.selectedServicePairs?.consensusService?.icon || "",
  },
}));
</script>

<style scoped>
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
</style>
