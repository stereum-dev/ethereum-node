<template>
  <div class="control-parent">
    <node-bg>
      <control-grid></control-grid>
    </node-bg>
    <node-header id="head"> </node-header>
  </div>
</template>
<script>
import { useRefreshMetrics } from "@/composables/monitoring";
import ControlGrid from "../components/UI/the-control/ControlGrid.vue";

export default {
  components: { ControlGrid },

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

<style scoped>
#head {
  position: fixed;
  top: 0;
}
</style>
