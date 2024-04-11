<template>
  <div class="w-full h-full border-r border-gray-500">
    <div
      class="grid-col-1 col-span-1 relative w-full h-full grid grid-cols-6 grid-rows-4 items-center pr-2"
      style="cursor: default"
      @pointerdown.prevent.stop
      @mousedown.prevent.stop
      @mouseenter="footerStore.cursorLocation = `${props.setup.setupName}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <span
        class="col-start-1 col-span-full row-start-1 row-span-1 text-xs text-center font-semibold capitalize overflow-hidden whitespace-nowrap truncate"
        :class="textColor"
        >{{ props.setup.setupName }}</span
      >
      <img class="col-start-2 col-end-6 row-start-2 row-span-full self-start" :src="matchedNetworkIcon" alt="icon" />
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

const textColor = computed(() => {
  let color;
  if (props.setup.color === "default") {
    color = "text-[#336666]";
  } else {
    color = props.setup.color;
  }

  return color;
});
</script>
