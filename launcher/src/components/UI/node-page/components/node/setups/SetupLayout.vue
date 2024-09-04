<template>
  <div
    class="w-full h-full col-start-1 col-span-1 row-start-3 row-span-full border-r rounded-l-md border-gray-500 grid grid-cols-2 grid-rows-12"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
    @mouseenter="footerStore.cursorLocation = `${props.setup.setupName}`"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <img class="max-w-10 col-start-1 col-span-full row-start-2 row-end-9 mx-auto" :src="matchedNetworkIcon" alt="icon" />

    <div
      class="col-start-1 col-span-full row-start-9 row-span-1 text-[8px] text-center font-semibold overflow-hidden whitespace-nowrap truncate flex justify-center items-center text-gray-400"
    >
      <span>{{ setupType }}</span>
    </div>
    <div
      class="col-start-1 col-span-full row-start-10 row-span-full text-[8px] text-center font-semibold overflow-hidden whitespace-nowrap truncate flex justify-center items-center text-gray-400"
    >
      <span>Node Config</span>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";
import { useNodeManage } from "@/store/nodeManage";

const footerStore = useFooter();
const manageStore = useNodeManage();

const props = defineProps({
  setup: Object,
});

// find the matching network and its icon
const matchedNetworkIcon = computed(() => {
  const matchedNetwork = manageStore.networkList.find((network) => network.network === props.setup.network);
  return matchedNetwork ? matchedNetwork.icon : "";
});

const setupType = computed(() => {
  let shortName;
  const matchedNetwork = manageStore.networkList.find((network) => network.network === props.setup.network);

  if (
    matchedNetwork?.network === "mainnet" ||
    matchedNetwork?.network === "holesky" ||
    matchedNetwork?.network === "gnosis" ||
    matchedNetwork?.network === "goerli" ||
    matchedNetwork?.network === "sepolia"
  ) {
    shortName = "ETH ";
  } else if (matchedNetwork?.network === "optimism") {
    shortName = "OPT";
  }

  return shortName;
});
</script>
