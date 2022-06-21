<template>
  <div class="links-box">
    <div class="services" ref="service">
      <div
        class="service-icon"
        v-for="(service, idx) in runningServices"
        :key="idx"
      >
        <div class="icon-box" onmousedown="return false">
          <img
            @click="openServiceBrowser(service.serviceName)"
            v-show="isImgExists"
            :src="service.icon"
            alt="service-icon"
          />
        </div>
        <grafana-modal
          v-if="showGrafanaWindow"
          @close-window="closeServiceBrowser"
        ></grafana-modal>
        <ssv-modal
          @close-window="closeServiceBrowser"
          v-if="showSsvWindow"
        ></ssv-modal>
        <prometheus-modal
          @close-window="closeServiceBrowser"
          v-if="showPrometheusWindow"
        ></prometheus-modal>
      </div>
      <div class="arrow-box">
        <div class="right-arrow left-paddle paddle" @click="scrollRight">
          <img alt="update-icon" src="/img/icon/header-icons/right.png" />
        </div>
        <div class="left-arrow" @click="scrollLeft">
          <img alt="update-icon" src="/img/icon/header-icons/left.png" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useClickInstall } from "@/store/clickInstallation";
import GrafanaModal from "../services-modal/GrafanaModal.vue";
import SsvModal from "../services-modal/SsvModal.vue";
import PrometheusModal from "../services-modal/PrometheusModal.vue";
export default {
  components: { GrafanaModal, SsvModal, PrometheusModal },
  data() {
    return {
      isServiceAvailable: true,
      isImgExists: true,
      showGrafanaWindow: false,
      showSsvWindow: false,
      showPrometheusWindow: false,
    };
  },
  mounted() {},
  computed: {
    ...mapState(useNodeHeader, {
      runningServices: "runningServices",
    }),
    ...mapState(useClickInstall, {
      services: "services",
    }),
  },
  methods: {
    scrollRight() {
      let position = this.$refs.service;
      position.scrollLeft += 150;
    },
    scrollLeft() {
      let position = this.$refs.service;
      position.scrollLeft -= 150;
    },
    //open & close modal for each service
    openServiceBrowser(serviceName) {
      this.runningServices.filter((item) => {
        item.serviceName == serviceName;
        if (serviceName == "grafana") {
          this.showGrafanaWindow = true;
        } else if (serviceName == "ssv") {
          this.showSsvWindow = true;
        } else if (serviceName == "prometheus") {
          this.showPrometheusWindow = true;
        } else {
          return;
        }
      });
    },
    closeServiceBrowser() {
      this.showGrafanaWindow = false;
      this.showSsvWindow = false;
      this.showPrometheusWindow = false;
    },
  },
};
</script>
<style scoped>
.links-box {
  width: 29%;
  max-width: 300px;
  height: 90%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.arrow-box {
  width: 25px;
  height: 90%;
  padding: 0 3px;
  border-left: 2px solid #a5a5a5;
  border-right: 2px solid #a5a5a5;
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.right-arrow {
  width: 90%;
  height: 40%;
  background-color: #336666;
  box-shadow: 0 1px 3px 1px rgb(20, 53, 44);
  border: 1px solid #a5a5a5;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px 5px;
  cursor: pointer;
}
.left-arrow {
  width: 90%;
  height: 40%;
  background-color: #336666;
  box-shadow: 0 1px 3px 1px rgb(20, 53, 44);
  border: 1px solid #a5a5a5;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px 5px;
  cursor: pointer;
}
.left-arrow:hover,
.right-arrow:hover {
  background-color: rgb(28, 59, 51);
}
.left-arrow:active,
.right-arrow:active {
  border: 1px solid #616161;
  background-color: rgb(28, 59, 51);
  box-shadow: none;
}
.arrow-box img {
  width: 70%;
}
.services {
  width: max-content;
  max-width: 213px;
  height: 90%;
  overflow-x: auto;
  overflow-y: hidden;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.services::-webkit-scrollbar {
  height: 1px;
}
.service-icon {
  width: 37px;
  height: 37px;
  border: 1px solid #a5a5a5;
  box-shadow: 0 1px 5px 1px rgb(22, 42, 37);
  border-radius: 5px;
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.service-icon:hover {
  border: 1px solid #7ed6fc;
  box-shadow: none;
}
.service-icon .icon-box {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-icon img {
  width: 35px;
  height: 35px;
}
</style>
