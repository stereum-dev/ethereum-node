import ClientButtons from 'launcher/src/components/UI/node-page/components/body/ClientButtons';
<template>
  <div class="col-start-2 col-span-2 grid grid-cols-3 grid-flow-row auto-rows-max gap-1 p-1" @pointerdown.prevent.stop>
    <button
      v-if="client.service === 'PrometheusService' || client.service === 'GrafanaService'"
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="docWindow"
    >
      <img
        v-if="client.service === 'PrometheusService'"
        src="/img/icon/plugin-icons/Other/prometheus.png"
        alt="icon"
        class="w-5 active:scale-95"
      />
      <img
        v-if="client.service === 'GrafanaService'"
        src="/img/icon/plugin-icons/Other/grafana-service.png"
        alt="icon"
        class="w-5 active:scale-95"
      />
    </button>
    <div class="p-1 col-span-1 flex justify-center items-center bg-gray-900 hover:bg-gray-600 rounded-md">
      <button v-if="client.serviceIsPending" class="w-full h-full transition-colors duration-200 rounded-md disabled">
        <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
      </button>
      <button
        v-else-if="client.state == 'running'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="button.action"
      >
        <img src="/img/icon/plugin-menu-icons/shutdown.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else-if="client.state == 'restarting'"
        class="w-full h-full transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="button.action"
      >
        <img src="/img/icon/plugin-menu-icons/pending.png" alt="icon" class="w-4 active:scale-95" />
      </button>
      <button
        v-else
        class="transition-colors duration-200 rounded-md flex justify-center items-center"
        @click="button.action"
      >
        <img src="/img/icon/plugin-menu-icons/turn-on.png" alt="icon" class="w-4 active:scale-95" />
      </button>
    </div>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="button.action"
    >
      <img src="/img/icon/plugin-menu-icons/restart.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md"
      @click="expertWindow"
    >
      <img src="/img/icon/plugin-menu-icons/setting2.png" alt="icon" class="w-8 active:scale-95" />
    </button>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="logWindow"
    >
      <img src="/img/icon/plugin-menu-icons/log-icon.png" alt="icon" class="w-4 active:scale-95" />
    </button>
    <button
      class="col-span-1 p-1 transition-colors duration-200 bg-gray-900 hover:bg-gray-600 rounded-md flex justify-center items-center"
      @click="docWindow"
    >
      <img src="/img/icon/plugin-menu-icons/doc.png" alt="icon" class="w-5 active:scale-95" />
    </button>
  </div>
</template>
<script>
export default {
  name: "ServiceButtons",
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
