import ClientButtons from 'launcher/src/components/UI/node-page/components/body/ClientButtons';
<template>
  <div class="col-start-2 col-span-1 grid grid-cols-3 grid-rows-3 gap-1 p-1 relative" @pointerdown.prevent.stop>
    <div class="p-1 col-start-1 col-span-1 flex justify-center items-center bg-gray-900 hover:bg-gray-600 rounded-md">
      <button v-if="client.serviceIsPending" type="button" class="w-full h-full rounded-md disabled">
        <img src="/img/icon/arrows/loading.png" alt="icon" class="w-4 animate-spin" />
      </button>
      <button
        v-else-if="client.state == 'running'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="$emit('stateHandler', client)"
      >
        <img src="/img/icon/plugin-menu-icons/shutdown.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else-if="client.state == 'restarting'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="$emit('stateHandler', client)"
      >
        <img src="/img/icon/plugin-menu-icons/pending.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else
        class="transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="$emit('stateHandler', client)"
      >
        <img src="/img/icon/plugin-menu-icons/turn-on.png" alt="icon" class="w-4 active:scale-95" />
      </button>
    </div>
    <button
      class="col-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="$emit('restartHandler', client)"
    >
      <img src="/img/icon/plugin-menu-icons/restart.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-start-3 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md"
      @click="expertWindow"
    >
      <img src="/img/icon/plugin-menu-icons/setting2.png" alt="icon" class="w-8 active:scale-95" />
    </button>
    <button
      class="col-start-1 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="logWindow"
    >
      <img src="/img/icon/plugin-menu-icons/log-icon.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-start-2 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="docWindow"
    >
      <img src="/img/icon/plugin-menu-icons/doc.png" alt="icon" class="w-5 active:scale-95" />
    </button>
    <button
      v-if="client.category !== 'validator'"
      class="col-start-3 row-start-2 col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="resyncWindow"
    >
      <img src="/img/icon/plugin-menu-icons/resync.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      v-if="client.service == 'GethService'"
      class="col-start-1 row-start-3 col-span-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="pruningWindow"
    >
      <img src="/img/icon/plugin-menu-icons/prunning.png" alt="icon" class="active:scale-95" />
    </button>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "ClientsLayout",
  components: {},
  props: {
    client: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },

  mounted() {},
  methods: {
    expertWindow() {
      this.$emit("openExpert", this.client);
    },
    logWindow() {
      this.$emit("openLog", this.client);
    },
    docWindow() {
      this.$emit("openDoc", this.client);
    },
    pruningWindow() {
      this.$emit("openPruning", this.client);
    },
    resyncWindow() {
      this.$emit("openResync", this.client);
    },
  },
};
</script>
