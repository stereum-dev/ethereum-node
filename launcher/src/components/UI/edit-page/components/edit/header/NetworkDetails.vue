<template>
  <div
    class="col-start-7 col-span-3 flex flex-col justify-between items-center bg-[#151618] border h-full border-gray-600 rounded-md px-2 py-1"
    style="cursor: default"
    @mouseenter="footerStore.cursorLocation = `${currIs} ${network}`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <div
      v-if="setupStore.isConfigViewActive || setupStore.isEditConfigViewActive"
      class="w-full self-start text-xs font-semibold text-teal-700"
    >
      {{ t("networkDetails.currentNet") }}
    </div>
    <div v-else class="w-full self-start text-xs font-semibold text-teal-700 overflow-hidden">TOTAL SETUPS ON SERVER</div>
    <div v-if="setupStore.isConfigViewActive || setupStore.isEditConfigViewActive" class="w-full flex justify-center items-center">
      <img v-if="getSetupNetwork" :src="getSetupNetwork?.icon" alt="Networks" class="w-5 mr-1" />
      <span class="text-md text-gray-300 text-left overflow-hidden whitespace-pre">{{ getSetupNetwork?.name }}</span>
    </div>
    <div v-else class="w-full flex justify-center items-center">
      <span class="text-md text-gray-300 text-left overflow-hidden whitespace-pre">{{ totalNetworks }}</span>
    </div>
  </div>
</template>
<script setup>
import { useNodeManage } from "@/store/nodeManage";
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import { useSetups } from "@/store/setups";

const t = i18n.global.t;

const currIs = t("networkDetails.currIs");

const footerStore = useFooter();
const manageStore = useNodeManage();
const setupStore = useSetups();

const totalNetworks = computed(() => {
  return setupStore.allSetups.filter((setup) => setup.setupName !== "commonServices").map((setup) => setup).length || 0;
});

const getSetupNetwork = computed(() => {
  let setupNet;
  const net = setupStore.selectedSetup?.network;
  if (net) {
    setupNet = manageStore.networkList.find((network) => network.network === net);
  }
  return setupNet;
});
</script>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
