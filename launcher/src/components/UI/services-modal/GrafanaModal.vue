<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="grafana-header">
        <div class="icon-box">
          <img :src="grafanaService.icon" alt="icon" />
        </div>
        <div class="title-box">
          <div class="service-name"><span>GRAFANA</span></div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import { useNodeStore } from "@/store/theNode";
import ConfirmBox from "./plugin/ConfirmBox.vue";
export default {
  components: {
    ConfirmBox,
  },
  data() {
    return {
      grafanaService: {},
      isGrafanaAvailable: false,
    };
  },

  computed: {
    ...mapState(useNodeHeader, {
      runningServices: "runningServices",
    }),
    ...mapWritableState(useNodeStore, {
      hideConnectedLines: "hideConnectedLines",
    }),
  },
  mounted() {
    this.filterGrafanaService();
  },
  methods: {
    filterGrafanaService() {
      this.runningServices.forEach((item) => {
        if (item.name === "Grafana") this.grafanaService = item;
      });
      this.isGrafanaAvailable = true;
    },
    openBrowser() {
      let url = "https://grafana.com/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/grafana/grafana";
      window.open(url, "_blank");
    },
    openLocalApp() {
      let url = this.grafanaService.linkUrl;
      window.open(url, "_blank");
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
  border: 5px solid rgb(161, 161, 161);
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

.grafana-header {
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
