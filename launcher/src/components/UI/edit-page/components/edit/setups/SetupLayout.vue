<template>
  <div class="w-full h-full flex justify-center items-center">
    <div
      class="relative w-full h-full grid grid-cols-6 grid-rows-4 items-center"
      :class="setupStore.isSetupMenuActive ? 'bg-black opacity-45 z-0' : ''"
      @pointerdown.prevent.stop
      @mousedown.prevent.stop
      @mouseenter="
        [
          (footerStore.cursorLocation = `${props.setup.setupName}`),
          (setupStore.isSetupMenuActive = true),
        ]
      "
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <div
        class="col-start-1 col-span-full row-start-1 row-span-1 text-[10px] text-center font-semibold capitalize overflow-hidden whitespace-nowrap truncate p-1"
        :class="[textColor, bgColor]"
      >
        <span>{{ props.setup.setupName }}</span>
      </div>

      <img
        class="max-h-[60px] col-start-2 col-end-6 row-start-2 row-span-full justify-self-center self-start mt-1"
        :src="matchedNetworkIcon"
        alt="icon"
      />
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
  const matchedNetwork = manageStore.networkList.find(
    (network) => network.network === props.setup.network
  );
  return matchedNetwork ? matchedNetwork.icon : "";
});

const textColor = computed(() => setupStore.getColor(props.setup.color, "text"));
const bgColor = computed(() => setupStore.getColor(props.setup.color, "background"));
</script>
