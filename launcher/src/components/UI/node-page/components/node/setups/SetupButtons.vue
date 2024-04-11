import { useNodeStore } from '@/store/theNode';
<template>
  <div class="col-start-2 col-span-1 grid grid-cols-2 grid-rows-3 gap-1 p-1 relative" @pointerdown.prevent.stop>
    <div class="p-1 col-start-1 col-span-1 flex justify-center items-center bg-gray-900 hover:bg-gray-600 rounded-md">
      <button
        v-if="isConfigActive"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
        @mouseenter="footerStore.cursorLocation = `${turnOff}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img src="/img/icon/node-page-icons/service-command-turn-off.png" alt="icon" class="w-4 active:scale-95" />
      </button>

      <button
        v-else
        class="transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
        @mouseenter="footerStore.cursorLocation = `${turnOn}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img src="/img/icon/node-page-icons/service-command-turn-on.png" alt="icon" class="w-4 active:scale-95" />
      </button>
    </div>
    <button
      class="col-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="restartHandler"
      @mouseenter="footerStore.cursorLocation = `${restart}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon//node-page-icons/service-command-restart.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md"
      :class="props.client.name === 'External' ? 'col-start-1' : 'col-start-3'"
      @click="openExpert"
      @mouseenter="footerStore.cursorLocation = `${expert}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-page-icons/service-command-open-settings.png" alt="icon" class="w-8 active:scale-95" />
    </button>

    <slot></slot>
  </div>
</template>
<script setup>
import { useNodeStore } from "@/store/theNode";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";
import { ref } from "vue";

const t = i18n.global.t;

const turnOn = t("clientButtons.turnOn");
const turnOff = t("clientButtons.turnOff");

const isConfigActive = ref(true);

const footerStore = useFooter();

const props = defineProps({
  client: Object,
});

const emit = defineEmits([
  "openExpert",
  "openLog",
  "openDoc",
  "stateHandler",
  "restartHandler",
  "openResync",
  "openPruning",
  "copyJwt",
]);

const nodeStore = useNodeStore();

const removeLock = () => {
  emit("removeLockfiles", props.client);

  footerStore.cursorLocation = "";
};

const openExpert = () => {
  nodeStore.isLineHidden = true;
  emit("openExpert", props.client);
  footerStore.cursorLocation = "";
};

const stateHandler = () => {
  nodeStore.isLineHidden = true;
  emit("stateHandler", props.client);
};
</script>
