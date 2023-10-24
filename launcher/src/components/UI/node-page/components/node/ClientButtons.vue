import { useNodeStore } from '@/store/theNode';
<template>
  <div class="col-start-2 col-span-1 grid grid-cols-3 grid-rows-3 gap-1 p-1 relative" @pointerdown.prevent.stop>
    <div class="p-1 col-start-1 col-span-1 flex justify-center items-center bg-gray-900 hover:bg-gray-600 rounded-md">
      <button v-if="props.client.serviceIsPending" type="button" class="w-full h-full rounded-md disabled">
        <img src="/img/icon/arrows/loading.png" alt="icon" class="w-4 animate-spin" />
      </button>
      <button
        v-else-if="props.client.state == 'running'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
      >
        <img src="/img/icon/plugin-menu-icons/shutdown.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else-if="props.client.state == 'restarting'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
      >
        <img src="/img/icon/plugin-menu-icons/pending.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else
        class="transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
      >
        <img src="/img/icon/plugin-menu-icons/turn-on.png" alt="icon" class="w-4 active:scale-95" />
      </button>
    </div>
    <button
      class="col-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="restartHandler"
    >
      <img src="/img/icon/plugin-menu-icons/restart.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-start-3 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md"
      @click="openExpert"
    >
      <img src="/img/icon/plugin-menu-icons/setting2.png" alt="icon" class="w-8 active:scale-95" />
    </button>
    <button
      class="col-start-1 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="openLog"
    >
      <img src="/img/icon/plugin-menu-icons/log-icon.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-start-2 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="openDoc"
    >
      <img src="/img/icon/plugin-menu-icons/doc.png" alt="icon" class="w-5 active:scale-95" />
    </button>
    <button
      v-if="props.client.category !== 'validator'"
      class="col-start-3 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="openResync"
    >
      <img src="/img/icon/plugin-menu-icons/resync.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      v-if="props.client.service == 'GethService'"
      class="col-start-1 row-start-3 col-span-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="openPruning"
    >
      <img src="/img/icon/plugin-menu-icons/prunning.png" alt="icon" class="active:scale-95" />
    </button>
    <slot></slot>
  </div>
</template>
<script setup>
import { useNodeStore } from "@/store/theNode";
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
]);

const nodeStore = useNodeStore();

const openExpert = () => {
  nodeStore.isLineHidden = true;
  emit("openExpert", props.client);
};

const openLog = () => {
  nodeStore.isLineHidden = true;
  emit("openLog", props.client);
};

const openDoc = () => {
  nodeStore.isLineHidden = true;
  emit("openDoc", props.client);
};

const stateHandler = () => {
  nodeStore.isLineHidden = true;
  emit("stateHandler", props.client);
};

const restartHandler = () => {
  nodeStore.isLineHidden = true;
  emit("restartHandler", props.client);
};

const openResync = () => {
  nodeStore.isLineHidden = true;
  emit("openResync", props.client);
};

const openPruning = () => {
  nodeStore.isLineHidden = true;
  emit("openPruning", props.client);
};
</script>
