<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <grafana-modal :link="service.linkUrl"></grafana-modal>
      <ssv-modal :service="service" v-if="isSsvAvailable"></ssv-modal>
    </div>
  </div>
</template>
<script>
import GrafanaModal from "./GrafanaModal.vue";
import SsvModal from "./SsvModal.vue";
export default {
  components: { GrafanaModal, SsvModal },
  props: ["service"],
  data() {
    return {
      grafanaService: [],
      ssvService: [],
      isGrafanaAvailable: false,
      isSsvAvailable: false,
    };
  },
  created() {
    this.checkGrafanaAvailable();
  },
  methods: {
    checkGrafanaAvailable() {
      if (this.service.serviceName == "grafana") {
        this.grafanaService.push(this.service);
      }
      this.isGrafanaAvailable = true;
    },
  },
};
</script>
<style scoped>
.service-modal_parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
}
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.2;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 102;
}
.browser-modal {
  width: 60%;
  height: 80%;
  background-color: #1b1b1b;
  border: 5px solid rgb(161, 161, 161);
  box-shadow: inset 2px 2px 15px rgb(0, 0, 0);
  border-radius: 35px;
  position: absolute;
  top: 11%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 103;
}
grafana-modal {
  z-index: 105;
}
</style>
