<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="prometheus-header">
        <div class="icon-box">
          <img :src="prometheusService.icon" alt="icon" />
        </div>
        <div class="title-box">
          <div class="service-name"><span>prometheus</span></div>
          <div class="service-option">
            <img src="/img/icon/service-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" @click="openGitHub" />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="browserBox">
          <ConfirmBox
            :top-line="`${$t('serviceModals.localApp')}`"
            :bottom-line="`${$t('serviceModals.localAppText')}`"
            :btn-name="`${$t('serviceModals.openBrowser')}`"
            :btn-bg-color="`#f37625`"
            @confirmPluginClick="openLocalApp"
          />
        </div>
        <div v-if="refreshStereum" class="browserBox">
          <ConfirmBox
            :top-line="`Oops! Something Went Wrong`"
            :bottom-line="`Something went wrong. Please click the refresh button and try again.`"
            :btn-name="`refresh`"
            :btn-bg-color="`#f37625`"
            @confirmPluginClick="stereumRefresher"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ConfirmBox from "./plugin/ConfirmBox.vue";
import { mapState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  components: {
    ConfirmBox,
  },
  data() {
    return {
      prometheusService: {},
      isprometheusAvailable: false,
      refreshStereum: false,
    };
  },

  computed: {
    ...mapState(useNodeHeader, {
      runningServices: "runningServices",
    }),
  },
  mounted() {
    this.filterprometheusService();
  },
  methods: {
    filterprometheusService() {
      this.runningServices.forEach((item) => {
        if (item.name === "Prometheus") this.prometheusService = item;
      });
      this.isprometheusAvailable = true;
    },
    openBrowser() {
      let url = "https://prometheus.io/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/prometheus/prometheus";
      window.open(url, "_blank");
    },
    openLocalApp() {
      if (this.prometheusService.linkUrl === "http://localhost:undefined") {
        this.refreshStereum = true;
      } else {
        console.log(this.prometheusService.linkUrl);
        let url = this.prometheusService.linkUrl;
        window.open(url, "_blank");
      }
    },
    stereumRefresher() {
      this.refreshStereum = false;
      window.location.reload();
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
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 102;
  cursor: default;
}
.browser-modal {
  width: 60%;
  height: 80%;
  background-color: #212122;
  border: 5px solid #a1a1a1;
  border-radius: 30px;
  position: absolute;
  top: 9%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 105;
  cursor: default;
}

.prometheus-header {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: nowrap;
  position: relative;
  z-index: 102;
  margin-top: 1.5%;
}
.icon-box {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 70%;
  height: 90%;
}
.title-box {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.service-name {
  width: 100%;
  height: 45%;
  text-align: center;
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.service-option {
  width: 60%;
  height: 38%;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.service-option img {
  width: 8%;
  height: 72%;
  margin-right: 15px;
  cursor: pointer;
}
.content {
  width: 100%;
  height: 75%;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.browserBox {
  width: 95%;
  height: 30%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2%;
}
</style>
