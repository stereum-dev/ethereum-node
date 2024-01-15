<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="authenticator-header">
        <div class="icon-box">
          <img :src="authenticatorService.icon" alt="icon" />
        </div>
        <div class="title-box">
          <div class="service-name"><span>Google Authenticator</span></div>
          <div class="service-option">
            <img src="/img/icon/service-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" @click="openGitHub" />
          </div>
        </div>
      </div>
      <div v-if="!setupPage && !generationPage && !configurePage" class="content">
        <div class="browserBox">
          <ConfirmBox
            :top-line="`${$t('authenticatorModal.newSetupTitel')}`"
            :bottom-line="`${$t('authenticatorModal.newSetupText')}`"
            :btn-name="`${$t('authenticatorModal.newSetupButton')}`"
            :btn-bg-color="`#f37625`"
            @confirmPluginClick="openSetup"
          />
        </div>
        <div class="browserBox">
          <ConfirmBox
            :top-line="`${$t('authenticatorModal.importTitel')}`"
            :bottom-line="`${$t('authenticatorModal.importText')}`"
            :btn-name="`${$t('authenticatorModal.importButton')}`"
            :btn-bg-color="`#f37625`"
            @confirmPluginClick="openLocalApp"
          />
        </div>
      </div>
      <div v-if="setupPage" class="content">
        <div class="browserBox">
          <ConfirmBox
            :top-line="`${$t('authenticatorModal.resetTitel')}`"
            :bottom-line="`${$t('authenticatorModal.resetText')}`"
            :btn-name="`${$t('authenticatorModal.resetButton')}`"
            :btn-bg-color="`#f37625`"
            @confirmPluginClick="openSetup"
          />
        </div>
        <div class="check-box">
          <label for="checkbox">
            {{ $t('authenticatorModal.timedTokens') }}
            <input id="checkbox" v-model="isChecked" type="checkbox" />
          </label>
        </div>
        
          <ConfirmBox
            :btn-name="`${$t('authenticatorModal.generateKeyButton')}`"
            :btn-bg-color="`#f37625`"
            @confirmPluginClick="openGeneration"
          />
        
      </div>
      <div v-if="generationPage" class="content">
        <div class="browserBox">
          <ConfirmBox
            :top-line="`${$t('authenticatorModal.backupTitel')}`"
            :bottom-line="`${$t('authenticatorModal.backupText')}`"
            :btn-name="`${$t('authenticatorModal.backupButton')}`"
            :btn-bg-color="`#f37625`"
            @confirmPluginClick="openSetup"
          />
        </div>
        
          <ConfirmBox
            :btn-name="`${$t('authenticatorModal.generateKeyButton')}`"
            :btn-bg-color="`#f37625`"
            @confirmPluginClick="open"
          />
        
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
      authenticatorService: {},
      isAuthenticatorAvailable: false,
      setupPage: false,
      generationPage: false,
      configurePage: false,
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
    this.filterAuthenticatorService();
  },
  methods: {
    filterAuthenticatorService() {
      this.runningServices.forEach((item) => {
        if (item.name === "Authenticator") this.authenticatorService = item;
      });
      this.isAuthenticatorAvailable = true;
    },
    openBrowser() {
      let url = "https://authenticator.com/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/authenticator/authenticator";
      window.open(url, "_blank");
    },
    openSetup() {
      this.setupPage = true;
    },
    openGeneration() {
      this.setupPage = false;
      this.generationPage = true;
    },
    openConfigure() {
      this.generationPage = false;
      this.configurePage = true;
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

.authenticator-header {
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

.check-box {
  width: 90%;
  height: 35%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 502;
}
.check-box label {
  width: 100%;
  height: 30%;
  margin: 0 auto;
  font-size: 0.7rem;
  font-weight: 600;
  color: #1b8da4;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.check-box #checkbox {
  width: 15px;
  height: 15px;
  margin-right: 10px;
  font-size: 0.6rem;
  font-weight: 300;
  color: #bfbfbf;
  justify-self: center;
  align-self: center;
  cursor: pointer;
  outline: none;
}
</style>
