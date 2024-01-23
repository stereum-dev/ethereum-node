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
      <div class="content">
        <div class="browserBox">
          <ConfirmBox
            :top-line="`${topConfirmBox.topLine}`"
            :bottom-line="`${topConfirmBox.bottomLine}`"
            :btn-name="`${topConfirmBox.btnName}`"
            :btn-bg-color="`#A0A0A0`"
            @confirmPluginClick="topConfirmBoxClick"
          />
        </div>
        <div v-if="!setupPage || (!generationPage && !setupPage)" class="browserBox">
          <ConfirmBox
            v-if="!generationPage"
            :top-line="`${$t('authenticatorModal.importTitel')}`"
            :bottom-line="`${$t('authenticatorModal.importText')}`"
            :btn-name="`${$t('authenticatorModal.importButton')}`"
            :btn-bg-color="`#A0A0A0`"
            @confirmPluginClick="openLocalApp"
          /><AuthContainer
            v-else
            :secret-key="secretKey"
            :varification-code="varificationCode"
            :barcode="authBarcode"
            @save-click="saveScratch"
          />
        </div>
        <div v-if="setupPage || generationPage" class="checkContainer">
          <checkContainer :title="`${checkContainer.title}`" @update="handleCheckboxUpdate" />
        </div>
        <div v-if="false" class="checkContainer">
          <checkContainer :title="`${checkContainer.title}`" @update="handleCheckboxUpdate" />
        </div>
        <div v-if="setupPage || generationPage" class="btn-auth" @click="mainBtnClick">
          {{ mainBtnContent.btnName }}
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
import checkContainer from "./plugin/CheckContainer.vue";
import AuthContainer from "./plugin/AuthContainer.vue";
export default {
  components: {
    ConfirmBox,
    checkContainer,
    AuthContainer,
  },
  data() {
    return {
      authenticatorService: {},
      isAuthenticatorAvailable: false,
      setupPage: false,
      generationPage: false,
      configurePage: false,
      secretKey: "H6pGFVFBPDM2FSTD", //dummy key
      varificationCode: "123456", //dummy code
      authBarcode: "/img/icon/header-icons/dummyQR.png", //dummy barcode
      //check points for the check box
      authKeyTimeBase: false,
      confirmSuccessAuth: false,
    };
  },

  computed: {
    ...mapState(useNodeHeader, {
      runningServices: "runningServices",
    }),
    ...mapWritableState(useNodeStore, {
      hideConnectedLines: "hideConnectedLines",
    }),
    topConfirmBox() {
      if (!this.setupPage && !this.generationPage) {
        return {
          topLine: `${this.$t("authenticatorModal.newSetupTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.newSetupText")}`,
          btnName: `${this.$t("authenticatorModal.newSetupButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      } else if (this.setupPage && !this.generationPage) {
        return {
          topLine: `${this.$t("authenticatorModal.resetTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.resetText")}`,
          btnName: `${this.$t("authenticatorModal.resetButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      } else if (!this.setupPage && this.generationPage) {
        return {
          topLine: `${this.$t("authenticatorModal.backupTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.backupText")}`,
          btnName: `${this.$t("authenticatorModal.setupButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      } else {
        return {
          topLine: `${this.$t("authenticatorModal.setupTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.setupText")}`,
          btnName: `${this.$t("authenticatorModal.setupButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      }
    },
    checkContainer() {
      if (this.setupPage || !this.generationPage) {
        return {
          title: `${this.$t("authenticatorModal.timedTokens")}`,
        };
      } else if (!this.setupPage && this.generationPage) {
        return {
          title: `${this.$t("authenticatorModal.confirmText")}`,
        };
      } else {
        return {
          title: `${this.$t("authenticatorModal.timedTokens")}`,
        };
      }
    },
    mainBtnContent() {
      if (this.setupPage && !this.generationPage) {
        return { btnName: `${this.$t("authenticatorModal.generateKeyButton")}` };
      } else {
        return {
          btnName: `${this.$t("authenticatorModal.setupButton")}`,
        };
      }
    },
  },
  mounted() {
    this.filterAuthenticatorService();
  },
  methods: {
    handleCheckboxUpdate(value) {
      if (this.setupPage || !this.generationPage) {
        this.authKeyTimeBase = value;
        console.log("auth key", this.authKeyTimeBase);
      } else if (!this.setupPage && this.generationPage) {
        this.confirmSuccessAuth = value;
        console.log("confirm", this.confirmSuccessAuth);
      }
    },
    filterAuthenticatorService() {
      this.runningServices.forEach((item) => {
        if (item.name === "Google Authenticator") this.authenticatorService = item;
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
    topConfirmBoxClick() {
      if (!this.setupPage && this.generationPage) {
        //generation func have to be added
        console.log("generation");
      } else if (this.setupPage && !this.generationPage) {
        this.setupPage = false;
      } else if (!this.setupPage && !this.generationPage) {
        this.setupPage = true;
      }
    },
    mainBtnClick() {
      if (this.setupPage) {
        this.generationPage = true;
        this.setupPage = false;
      }
    },
    saveScratch() {
      console.log("save scratch");
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
  position: relative absolute;
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
.checkContainer {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
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
.btn-auth {
  width: 15%;
  height: 8%;
  background-color: #a0a0a0;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2%;
  cursor: pointer;
  position: absolute;
  bottom: 10%;
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}
.btn-auth:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
