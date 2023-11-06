<template>
  <div class="col-start-2 col-span-1 grid grid-cols-3 grid-rows-2 gap-1 relative mt-1" @pointerdown.prevent.stop>
    <div class="p-1 col-start-1 col-span-1 flex justify-center items-center bg-gray-900 hover:bg-gray-600 rounded-md">
      <button v-if="client.serviceIsPending" type="button" class="w-full h-full rounded-md disabled">
        <img src="/img/icon/arrows/loading.png" alt="icon" class="w-4 animate-spin" />
      </button>
      <button
        v-else-if="props.client.state == 'running'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="$emit('handleState', props.client), (footerStore.cursorLocation = '')"
        @mouseenter="footerStore.cursorLocation = 'Turn off the service'"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img src="/img/icon/plugin-menu-icons/shutdown.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else-if="props.client.state == 'restarting'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
      >
        <img src="/img/icon/plugin-menu-icons/pending.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else
        class="transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="$emit('handleState', props.client), (footerStore.cursorLocation = '')"
        @mouseenter="footerStore.cursorLocation = 'Turn on the service'"
        @mouseleave="footerStore.cursorLocation = ''"
      >
        <img src="/img/icon/plugin-menu-icons/turn-on.png" alt="icon" class="w-4 active:scale-95" />
      </button>
    </div>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="$emit('restartService', props.client), (footerStore.cursorLocation = '')"
      @mouseenter="footerStore.cursorLocation = 'Restart the service'"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/plugin-menu-icons/restart.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md"
      @click="$emit('openExpert', props.client), (footerStore.cursorLocation = '')"
      @mouseenter="footerStore.cursorLocation = 'service settings'"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/plugin-menu-icons/setting2.png" alt="icon" class="w-8 active:scale-95" />
    </button>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="$emit('openLogs', props.client), (footerStore.cursorLocation = '')"
      @mouseenter="footerStore.cursorLocation = 'open logs'"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-icons/log-command.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="$emit('openDocs', props.client), (footerStore.cursorLocation = '')"
      @mouseenter="footerStore.cursorLocation = 'open docs'"
      @mouseleave="footerStore.cursorLocation = ''"
    >
      <img src="/img/icon/node-icons/plugin-docs.png" alt="icon" class="w-5 active:scale-95" />
    </button>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
import { useFooter } from "@/store/theFooter";

const footerStore = useFooter();
const props = defineProps({
  client: {
    type: Object,
    required: true,
  },
});
</script>
