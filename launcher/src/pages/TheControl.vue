<template>
  <ControlScreen />
</template>
<script>
import { useRefreshMetrics } from "@/composables/monitoring";
import ControlScreen from "../components/UI/the-control/ControlScreen.vue";

export default {
  components: { ControlScreen },

  mounted() {
    this.polling = setInterval(this.refresh, 100); //refresh services
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
