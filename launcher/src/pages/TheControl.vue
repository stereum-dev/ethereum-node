<template>
  <ControlScreen />
</template>
<script>
import { useRefreshMetrics } from "@/composables/monitoring";
import ControlScreen from "../components/UI/control-page/ControlScreen.vue";

export default {
  components: { ControlScreen },

  mounted() {
    this.refresh();
    this.polling = setInterval(this.refresh, 2000); // each metric is skipped while its last request still runs
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods: {
    async refresh() {
      await useRefreshMetrics();
    },
  },
};
</script>
