<template>
  <div class="service-ports-parent w-full h-full flex flex-col justify-center items-center">
    <div class="widget-name w-full h-1/5 flex justify-center items-center text-gray-200 uppercase font-semibold text-[55%]">
      {{ t("controlPage.servicePort") }}
    </div>
    <div class="widget-box w-full h-4/5 flex flex-col gap-1 p-1 justify-start items-center">
      <div
        v-for="portData in matchingPorts"
        :key="portData.id"
        class="row-port w-full h-1/5 flex justify-start items-center border border-gray-400 rounded-sm pl-1 pr-1"
        @mouseenter="updateCursorLocation(portData)"
        @mouseleave="clearCursorLocation"
      >
        <span class="w-1/2 h-full flex items-center text-[40%] font-semibold text-gray-200 uppercase">
          {{ portData.name }}
        </span>
        <small class="text-gray-200 text-[30%] w-1/7 h-full flex justify-center items-center uppercase">
          {{ portData.prot }}
        </small>
        <span class="bg-red w-11 h-full flex justify-end items-center text-[60%] font-semibold text-gray-200 uppercase">
          {{ portData.port }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useControlStore } from "@/store/theControl";
import { useSetups } from "@/store/setups";
import { useFooter } from "@/store/theFooter";

import i18n from "@/includes/i18n";

const t = i18n.global.t;

const controlStore = useControlStore();
const setupStore = useSetups();
const footerStore = useFooter();

const portStatus = ref(controlStore.portstatus.data);

const matchingPorts = computed(() => {
  const { consensusService, executionService } = setupStore.selectedServicePairs || {};
  if (!consensusService || !executionService) return [];

  const consensusId = consensusService.id.trim();
  const executionId = executionService.config.serviceID.trim();
  const consensusName = consensusService.name.trim().toLowerCase();
  const executionName = executionService.name.trim().toLowerCase();

  return portStatus.value.filter((port) => {
    const portId = port.id.trim();
    const portName = port.name.trim().toLowerCase();
    return (portId === consensusId || portId === executionId) && (portName === consensusName || portName === executionName);
  });
});

const updateCursorLocation = (portData) => {
  footerStore.cursorLocation = `${t("controlPage.portIs", {
    name: portData.name,
    port: portData.port,
    prot: portData.prot,
  })}`;
};

const clearCursorLocation = () => {
  footerStore.cursorLocation = "";
};
</script>
