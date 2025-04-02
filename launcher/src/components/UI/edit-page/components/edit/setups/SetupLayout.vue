<template>
  <div
    class="w-full h-full col-start-1 col-span-full row-start-3 row-span-full grid grid-cols-2 grid-rows-12 items-center"
    :class="props.setup.isActive ? 'bg-black opacity-45 z-0 rounded-b-md' : ''"
    @pointerdown.prevent.stop
    @mousedown.prevent.stop
    @mouseenter="[(footerStore.cursorLocation = `${props.setup.setupName}`), (setupStore.isSetupMenuActive = true)]"
    @mouseleave="footerStore.cursorLocation = ''"
  >
    <img
      class="max-h-[60px] col-start-1 col-span-full row-start-2 row-end-10 justify-self-center self-start mt-1"
      :src="matchedNetworkIcon"
      alt="icon"
    />

    <div
      class="col-start-1 col-span-full row-start-10 row-span-full text-[8px] mt-2 text-center font-semibold overflow-hidden whitespace-nowrap truncate flex justify-center items-center text-gray-200"
    >
      <span>{{ setupType }}</span>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useFooter } from "@/store/theFooter";
import { useNodeManage } from "@/store/nodeManage";
import { useSetups } from "../../../../../../store/setups";

const footerStore = useFooter();
const manageStore = useNodeManage();
const setupStore = useSetups();

const props = defineProps({
  setup: Object,
});

// find the matching network and its icon
const matchedNetworkIcon = computed(() => {
  const matchedNetwork = manageStore.networkList.find((network) => network.network === props.setup.network);

  return matchedNetwork ? matchedNetwork.icon : "/img/icon/network-icons/devnet-circle.png";
});

const setupType = computed(() => {
  let shortName = "OP";
  const matchedNetwork = manageStore.networkList.find((network) => network.network === props.setup.network);
  if (matchedNetwork?.network.includes("op")) {
    shortName = "OP Node Config";
  } else {
    shortName = "ETH Node Config";
  }

  return shortName;
});
</script>
