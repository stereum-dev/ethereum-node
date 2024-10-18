<template>
  <div class="volume-Parent flex w-full h-full justify-center items-center flex-col p-1 gap-1 relative">
    <NoData v-if="!setupStore.selectedSetup" />
    <template v-else>
      <EndpointServiceLine
        v-if="setupStore?.selectedServicePairs?.executionService"
        name="RPC ENDPOINT"
        :service="setupStore.selectedServicePairs.executionService"
        :is-active="nodeHeaderStore.rpcState"
        :url="executionRpcUrl"
        :is-loading="rpcIsLoading"
        @toggle="rpcToggle"
        @copy="copyToClipboard"
      />

      <EndpointServiceLine
        v-if="setupStore?.selectedServicePairs?.consensusService"
        name="Data API"
        :service="setupStore.selectedServicePairs.consensusService"
        :is-active="nodeHeaderStore.dataState"
        :url="beaconDataUrl"
        :is-loading="beaconstatusIsLoading"
        @toggle="dataToggle"
        @copy="copyToClipboard"
      />

      <EndpointServiceLine
        v-if="setupStore?.selectedServicePairs?.executionService"
        name="WS ENDPOINT"
        :service="setupStore.selectedServicePairs.executionService"
        :is-active="nodeHeaderStore.wsState"
        :url="wsDataUrl"
        :is-loading="wsIsLoading"
        @toggle="wsToggle"
        @copy="copyToClipboard"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useControlStore } from "@/store/theControl";
import { useSetups } from "@/store/setups";
import { useNodeHeader } from "@/store/nodeHeader";
import ControlService from "@/store/ControlService";
import NoData from "./NoData.vue";
import EndpointServiceLine from "../fragments/EndpointServiceLine.vue";

const controlStore = useControlStore();
const setupStore = useSetups();
const nodeHeaderStore = useNodeHeader();

const portRegex = /http:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}:(\d+)/;

const extractPort = (url) => {
  const match = url.match(portRegex);
  return match ? match[1] : null;
};

// Toggle functions for RPC, Data API, and WS
const rpcToggle = async () => {
  nodeHeaderStore.rpcState = !nodeHeaderStore.rpcState;
  await (nodeHeaderStore.rpcState
    ? ControlService.openRpcTunnel(setupStore?.selectedServicePairs?.executionService?.config?.serviceID)
    : ControlService.closeRpcTunnel());
};

const dataToggle = async () => {
  nodeHeaderStore.dataState = !nodeHeaderStore.dataState;
  await (nodeHeaderStore.dataState
    ? ControlService.openBeaconTunnel(setupStore?.selectedServicePairs?.consensusService?.id)
    : ControlService.closeBeaconTunnel());
};

const wsToggle = async () => {
  nodeHeaderStore.wsState = !nodeHeaderStore.wsState;
  await (nodeHeaderStore.wsState
    ? ControlService.openWsTunnel(setupStore?.selectedServicePairs?.executionService?.config?.serviceID)
    : ControlService.closeWsTunnel());
};

const getServiceUrl = (serviceType, statusData) => {
  const serviceId =
    setupStore?.selectedServicePairs?.[serviceType]?.config?.serviceID || setupStore?.selectedServicePairs?.[serviceType]?.id;
  const matchedService = statusData?.find((service) => service.sid === serviceId);
  return matchedService ? matchedService.url : "";
};

const executionRpcUrl = computed(() => {
  return controlStore.rpcstatus?.data ? getServiceUrl("executionService", controlStore.rpcstatus.data) : "";
});

watch(executionRpcUrl, (newUrl) => {
  const port = extractPort(newUrl); // Extract the port using your regex function
  controlStore.rpcPort = port; // Set the extracted port in the store
});

const beaconDataUrl = computed(() => {
  return controlStore.beaconstatus?.data ? getServiceUrl("consensusService", controlStore.beaconstatus.data) : "";
});

const wsDataUrl = computed(() => {
  return controlStore.wsstatus?.data ? getServiceUrl("executionService", controlStore.wsstatus.data) : "";
});

const rpcIsLoading = computed(() => controlStore.rpcstatus.info !== "success: rpcstatus successfully retrieved");
const beaconstatusIsLoading = computed(() => controlStore.beaconstatus.info !== "success: beaconstatus successfully retrieved");
const wsIsLoading = computed(() => controlStore.wsstatus.info !== "success: wsstatus successfully retrieved");

// Function to copy URL to clipboard
const copied = ref(false);
const copyToClipboard = async (url) => {
  if (url) {
    try {
      await navigator.clipboard.writeText(url);
      copied.value = true;
      setTimeout(() => (copied.value = false), 2000); // Reset "copied" status after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
};
</script>
