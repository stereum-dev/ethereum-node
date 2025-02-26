import { useNodeStore } from '@/store/theNode';
<template>
  <div class="col-start-2 col-span-1 grid grid-cols-3 grid-rows-3 gap-1 p-1" @pointerdown.prevent.stop>
    <div
      v-if="props.client.service !== 'ExternalExecutionService' && props.client.service !== 'ExternalConsensusService'"
      class="p-1 col-start-1 col-span-1 flex justify-center items-center bg-gray-900 hover:bg-gray-600 rounded-md"
    >
      <button v-if="props.client.serviceIsPending" type="button" class="w-full h-full rounded-md disabled">
        <img src="/img/icon/loading-icons/loading-circle.png" alt="icon" class="w-4 animate-spin" />
      </button>
      <button
        v-else-if="props.client.state == 'running'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
        @mouseenter="footerStore.cursorLocation = `${turnOff}`"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img src="/img/icon/node-page-icons/service-command-turn-off.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else-if="props.client.state == 'restarting'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="stateHandler"
      >
        <img src="/img/icon/node-page-icons/service-command-pending.png" alt="icon" class="w-4 active:scale-95" />
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
      v-if="props.client.service !== 'ExternalExecutionService' && props.client.service !== 'ExternalConsensusService'"
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
    <button
      v-if="props.client.service !== 'ExternalExecutionService' && props.client.service !== 'ExternalConsensusService'"
      class="col-start-1 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="openLog"
      @mouseenter="footerStore.cursorLocation = `${logs}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-page-icons/service-command-open-logs.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      v-if="props.client.service !== 'ExternalExecutionService' && props.client.service !== 'ExternalConsensusService'"
      class="col-start-2 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="openDoc"
      @mouseenter="footerStore.cursorLocation = `${docs}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-page-icons/service-command-open-docs.png" alt="icon" class="w-5 active:scale-95" />
    </button>
    <button
      v-if="
        props.client.category !== 'validator' &&
        props.client.service !== 'ExternalExecutionService' &&
        props.client.service !== 'ExternalConsensusService'
      "
      class="col-start-3 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="openResync"
      @mouseenter="footerStore.cursorLocation = `${resync}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-page-icons/service-command-resync-client.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      v-if="props.client.service == 'TekuValidatorService'"
      class="col-start-3 row-start-2 col-span-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="removeLock"
      @mouseenter="footerStore.cursorLocation = `${removeLockBtn}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-page-icons/service-command-delete-lockfile.png" alt="icon" class="w-4 h-4 active:scale-95" />
    </button>
    <!-- <button
      v-if="props.client.service == 'GethService'"
      class="col-start-1 row-start-3 col-span-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="openPruning"
      @mouseenter="footerStore.cursorLocation = `${pruning}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-page-icons/service-command-pruning.png" alt="icon" class="active:scale-95" />
    </button> -->
    <button
      v-if="props.client.category == 'execution' && props.client.service !== 'ExternalExecutionService'"
      class="row-start-3 col-span-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="copyJwt"
      @mouseenter="footerStore.cursorLocation = `${copyToken}`"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-page-icons/service-command-copy-jwt.png" alt="icon" class="w-4 h-4 active:scale-95" />
    </button>
    <slot></slot>
  </div>
</template>
<script setup>
import { useNodeStore } from "@/store/theNode";
import { useFooter } from "@/store/theFooter";
import i18n from "@/includes/i18n";

const t = i18n.global.t;

const turnOn = t("clientButtons.turnOn");
const turnOff = t("clientButtons.turnOff");
const restart = t("clientButtons.restart");
const resync = t("clientButtons.resync");
// const pruning = t("clientButtons.pruning");
const expert = t("clientButtons.settings");
const logs = t("clientButtons.logs");
const docs = t("clientButtons.docs");
const copyToken = "Copy JWT Token";
const removeLockBtn = t("clientButtons.removeLock");

const footerStore = useFooter();

const props = defineProps({
  client: Object,
});

const emit = defineEmits(["openExpert", "openLog", "openDoc", "stateHandler", "restartHandler", "openResync", "openPruning", "copyJwt"]);

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

const openLog = () => {
  nodeStore.isLineHidden = true;
  emit("openLog", props.client);
  footerStore.cursorLocation = "";
};

const openDoc = () => {
  nodeStore.isLineHidden = true;
  emit("openDoc", props.client);
  footerStore.cursorLocation = "";
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
  footerStore.cursorLocation = "";
};

// const openPruning = () => {
//   nodeStore.isLineHidden = true;
//   emit("openPruning", props.client);
//   footerStore.cursorLocation = "";
// };

const copyJwt = () => {
  emit("copyJwt", props.client);
  footerStore.cursorLocation = "";
};
</script>
