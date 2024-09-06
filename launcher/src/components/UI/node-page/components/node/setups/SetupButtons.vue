<template>
  <div class="col-start-2 col-span-1 row-start-3 row-span-full grid grid-cols-2 grid-rows-2 relative p-2 gap-2">
    <!-- <div
      class="p-1 w-8 h-8 col-start-1 col-span-1 row-start-1 row-span-1 flex justify-center items-center transition-colors duration-200 bg-gray-600 border border-gray-600 hover:border-gray-300 rounded-sm shadow-lg shadow-black active:shadow-none active:scale-95"
    >
      <button
        v-if="isConfigActive"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
        @mouseenter="footerStore.cursorLocation = `${turnOff}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          src="/img/icon/node-page-icons/service-command-turn-off.png"
          alt="icon"
          class="w-5 active:scale-95"
        />
      </button>

      <button
        v-else
        class="transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
        @mouseenter="footerStore.cursorLocation = `${turnOn}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img
          src="/img/icon/node-page-icons/service-command-turn-on.png"
          alt="icon"
          class="w-5 active:scale-95"
        />
      </button>
    </div> -->
    <button
      class="w-full h-7 col-start-1 col-span-1 row-start-2 row-span-1 p-1 transition-colors duration-200 bg-gray-600 hover:bg-gray-500 flex justify-center items-center active:scale-95 box-border rounded-sm shadow-md shadow-black active:shadow-none mx-auto self-center"
      @click="exportSetup"
      @mouseenter="footerStore.cursorLocation = `${exportConfig}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img class="w-5 active:scale-95" src="/img/icon/node-page-icons/export-config-icon.png" alt="Export Icon" @pointerdown.prevent.stop />
    </button>

    <button
      class="h-7 w-full row-start-1 row-span-1 col-start-1 col-span-full p-1 transition-colors duration-200 bg-teal-800 hover:bg-teal-700 rounded-sm active:shadow-none active:scale-95 shadow-md shadow-black text-xs text-gray-200 font-semibold uppercase"
      @click="openSetup"
      @mouseenter="footerStore.cursorLocation = `${openConfig}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      Open
    </button>
  </div>
</template>
<script setup>
import { useNodeStore } from "@/store/theNode";
import { useFooter } from "@/store/theFooter";
// import i18n from "@/includes/i18n";

const props = defineProps({
  setup: Object,
});

// const t = i18n.global.t;

const exportConfig = "Export Setup Config";
const openConfig = "Open Setup Config";

const footerStore = useFooter();

const emit = defineEmits(["exportSetup", "stateHandler", "openSetup"]);

const nodeStore = useNodeStore();

const exportSetup = () => {
  nodeStore.isLineHidden = true;
  emit("exportSetup", props.setup);
  footerStore.cursorLocation = "";
};

// const stateHandler = () => {
//   nodeStore.isLineHidden = true;
//   emit("stateHandler", props.setup);
//   footerStore.cursorLocation = "";
// };

const openSetup = () => {
  nodeStore.isLineHidden = true;
  emit("openSetup", props.setup);
  footerStore.cursorLocation = "";
};
</script>
