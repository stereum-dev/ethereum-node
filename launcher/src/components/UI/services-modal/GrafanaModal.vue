<template>
  <div class="w-full h-full absolute inset-0 flex justify-center items-center">
    <div class="w-full h-full absolute indent-0 bg-black opacity-80 rounded-lg z-10" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="grafana-header">
        <div class="icon-box">
          <img :src="grafanaService.icon" alt="icon" />
        </div>
        <div class="title-box">
          <div class="service-name"><span>GRAFANA</span></div>
          <div class="service-option">
            <img src="/img/icon/service-modals-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-modals-icons/github.png" alt="icon" @click="openGitHub" />
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

<script setup>
import { useNodeHeader } from "@/store/nodeHeader";

import ConfirmBox from "./plugin/ConfirmBox.vue";
import { ref, onMounted } from "vue";

const headerStore = useNodeHeader();

const grafanaService = ref({});
const isGrafanaAvailable = ref(false);
const refreshStereum = ref(false);

onMounted(() => {
  filterGrafanaService();
});

const filterGrafanaService = () => {
  headerStore.runningServices.forEach((item) => {
    if (item.name === "Grafana") grafanaService.value = item;
  });
  isGrafanaAvailable.value = true;
};

const openBrowser = () => {
  let url = "https://grafana.com/";
  window.open(url, "_blank");
};

const openGitHub = () => {
  let url = "https://github.com/grafana/grafana";
  window.open(url, "_blank");
};

const openLocalApp = () => {
  let url = grafanaService.value.linkUrl;
  window.open(url, "_blank");
};

const stereumRefresher = () => {
  refreshStereum.value = false;
  window.location.reload();
};
</script>

<style scoped>
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
  flex-direction: column;
}
</style>
