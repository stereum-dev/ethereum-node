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
            <img src="/img/icon/service-modals-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-modals-icons/github.png" alt="icon" @click="openGitHub" />
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
        <div v-if="secondRowVisible" class="browserBox">
          <ConfirmBox
            v-if="!generationPage"
            :top-line="`${configured2fa ? $t('authenticatorModal.removeTitel') : $t('authenticatorModal.importTitel')}`"
            :bottom-line="`${
              configured2fa ? $t('authenticatorModal.removeText') : $t('authenticatorModal.importText')
            }`"
            :btn-name="`${
              configured2fa ? $t('authenticatorModal.removeButton') : $t('authenticatorModal.importButton')
            }`"
            :btn-bg-color="`${configured2fa ? '#ff0000' : '#A0A0A0'}`"
            @confirmPluginClick="importOrRemove"
          /><AuthContainer
            v-else
            :secret-key="secretKey"
            :verification-code="verificationCode"
            :qr-code="QRcode"
            :time-base="authKeyTimeBase"
            @save-click="saveScratch"
            @update="handleVerificationCode"
          />
        </div>
        <div v-if="setupPage || generationPage || setupConfirmPage" class="checkContainer">
          <checkContainer
            :title="`${checkContainer.title}`"
            :reset="`${checkContainer.reset}`"
            @update="handleCheckboxUpdate"
          />
        </div>
        <div v-if="setupConfirmPage" class="checkContainer">
          <checkContainer
            :title="`${$t('authenticatorModal.rateLimit')}`"
            reset="enableRateLimit"
            @update="handleRateLimit"
          />
        </div>
        <div v-if="setupPage || setupConfirmPage" class="btn-auth" @click="mainBtnClick">
          {{ mainBtnContent.btnName }}
        </div>
        <div v-if="generationPage" class="btn-auth" :class="{ disabled: !confirmSuccessAuth }" @click="mainBtnClick">
          {{ mainBtnContent.btnName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import ControlService from "@/store/ControlService";
import { saveAs } from "file-saver";
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
      configured2fa: false,
      setupConfirmPage: false,
      enableRateLimit: true,
      orginalGenerationTimeLimit: false,
      secretKey: "",
      QRcode: "/img/icon/header-icons/dummyQR.png", //dummy qr code
      authKeyTimeBase: true,
      confirmSuccessAuth: false,
    };
  },

  computed: {
    ...mapWritableState(useNodeHeader, {
      resetConfig: "resetConfig",
      runningServices: "runningServices",
      verificationCode: "verificationCode",
      validVerificationCode: "validVerificationCode",
      verificationOutput: "verificationOutput",
      checkConfigToReset: "checkConfigToReset",
    }),
    ...mapWritableState(useNodeStore, {
      hideConnectedLines: "hideConnectedLines",
    }),
    secondRowVisible() {
      if (!this.setupConfirmPage && this.generationPage && !this.setupPage && !this.configured2fa) {
        return true;
      } else if (!this.setupConfirmPage && !this.generationPage && !this.setupPage && !this.configured2fa) {
        return true;
      } else if (this.configured2fa && !this.setupConfirmPage && !this.generationPage && !this.setupPage) {
        return true;
      } else {
        return false;
      }
    },
    topConfirmBox() {
      if (!this.setupPage && !this.generationPage && !this.setupConfirmPage && !this.configured2fa) {
        return {
          topLine: `${this.$t("authenticatorModal.newSetupTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.newSetupText")}`,
          btnName: `${this.$t("authenticatorModal.newSetupButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      } else if (this.setupPage && !this.generationPage && !this.setupConfirmPage && !this.configured2fa) {
        return {
          topLine: `${this.$t("authenticatorModal.resetTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.resetText")}`,
          btnName: `${this.$t("authenticatorModal.resetButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      } else if (!this.setupPage && this.generationPage && !this.setupConfirmPage && !this.configured2fa) {
        return {
          topLine: `${this.$t("authenticatorModal.backupTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.backupText")}`,
          btnName: `${this.$t("authenticatorModal.backupButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      } else if (this.setupConfirmPage || (!this.setupPage && !this.generationPage && !this.configured2fa)) {
        return {
          topLine: `${this.$t("authenticatorModal.resetTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.resetText")}`,
          btnName: `${this.$t("authenticatorModal.resetButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      } else if (!this.setupPage && !this.generationPage && !this.setupConfirmPage && this.configured2fa) {
        return {
          topLine: `${this.$t("authenticatorModal.configureTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.configureText")}`,
          btnName: `${this.$t("authenticatorModal.configureButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      } else {
        return {
          topLine: `${this.$t("authenticatorModal.resetTitel")}`,
          bottomLine: `${this.$t("authenticatorModal.resetText")}`,
          btnName: `${this.$t("authenticatorModal.resetButton")}`,
          btnBgColor: `#A0A0A0`,
        };
      }
    },
    checkContainer() {
      if (this.setupPage || (!this.generationPage && !this.setupConfirmPage)) {
        return {
          title: `${this.$t("authenticatorModal.timedTokens")}`,
          reset: `authTimeBase`,
        };
      } else if (!this.setupPage && this.generationPage && !this.setupConfirmPage) {
        return {
          title: `${this.$t("authenticatorModal.confirmText")}`,
          reset: `confirmSuccessAuth`,
        };
      } else if (!this.setupPage && !this.generationPage && this.setupConfirmPage) {
        return {
          title: `${this.$t("authenticatorModal.increaseTime")}`,
          reset: `orginalGenerationTimeLimit`,
        };
      } else {
        return {
          title: `${this.$t("authenticatorModal.rateLimit")}`,
        };
      }
    },
    mainBtnContent() {
      if (this.setupPage && !this.generationPage) {
        return { btnName: `${this.$t("authenticatorModal.generateKeyButton")}` };
      } else if (!this.setupPage && this.generationPage) {
        return {
          btnName: `${this.$t("authenticatorModal.setupButton")}`,
        };
      } else if (!this.setupPage && !this.generationPage && this.setupConfirmPage) {
        return {
          btnName: `${this.$t("authenticatorModal.configureConfirmButton")}`,
        };
      } else {
        return {
          btnName: `${this.$t("authenticatorModal.setupButton")}`,
        };
      }
    },
  },
  mounted() {
    this.filterAuthenticatorService();
    ControlService.addListener("2FAEvents", this.authenticatorHandler);
  },
  unmounted() {
    ControlService.removeListener("2FAEvents", this.authenticatorHandler);
  },
  methods: {
    authenticatorHandler(event, data) {
      this.loadOutput(data);
    },
    handleCheckboxUpdate(value) {
      if (this.setupPage || (!this.generationPage && !this.setupConfirmPage)) {
        this.authKeyTimeBase = value;
        console.log("Checkbox updated:", value);
        console.log("auth key", this.authKeyTimeBase && !this.setupConfirmPage);
      } else if (!this.setupPage && this.generationPage) {
        console.log("testttt");
        this.confirmSuccessAuth = value;
        console.log("confirm", this.confirmSuccessAuth);
      } else if (!this.setupPage && !this.generationPage && this.setupConfirmPage) {
        this.orginalGenerationTimeLimit = value;
        console.log("orginal Generation Time Limit", this.orginalGenerationTimeLimit);
      }
    },
    async handleVerificationCode(value) {
      if (this.authKeyTimeBase && value.length == 6) {
        this.verificationOutput = await ControlService.authenticatorVerification(value);
        /*if(this.verificationOutput != "wrong code")
        {
          this.validVerificationCode = true;
        }*/
      }
    },
    handleRateLimit(value) {
      this.enableRateLimit = value;
      console.log("rate limit", this.enableRateLimit);
    },
    handleRateLimitPage(value) {
      this.rateLimitPage = value;
      console.log("rate limit", this.rateLimitPage);
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
    async topConfirmBoxClick() {
      if (!this.setupPage && this.generationPage && !this.setupConfirmPage) {
        //backup not needed anymore
        this.confirmSuccessAuth = true;
      } else if ((this.setupPage && !this.generationPage) || this.setupConfirmPage) {
        this.authKeyTimeBase = true;
        this.resetConfig = true;

        setTimeout(() => {
          this.resetConfig = false;
        }, 1000);
        this.orginalGenerationTimeLimit = false;
        this.enableRateLimit = true;
      } else if (!this.setupPage && !this.generationPage) {
        this.setupPage = true;
      }
    },
    async importOrRemove() {
      if (this.configurePage) {
        //import code
      } else {
        await ControlService.removeAuthenticator();
      }
    },
    async mainBtnClick() {
      if (this.setupPage) {
        this.generationPage = true;
        this.setupPage = false;
        this.validVerificationCode = "false"; //dummy valid code for the test
        //console.log("valid code", this.validVerificationCode);
        await ControlService.beginAuthSetup(this.authKeyTimeBase);
      } else if (this.generationPage && !this.setupPage) {
        console.log("setup");
        this.setupConfirmPage = true;
        this.generationPage = false;
        this.setupPage = false;
      } else if (!this.generationPage && !this.setupPage && this.setupConfirmPage) {
        console.log("configue");
        this.configured2fa = true;
        this.setupConfirmPage = false;
        this.generationPage = false;
        this.setupPage = false;
        await ControlService.finishAuthSetup(this.orginalGenerationTimeLimit, this.enableRateLimit);
      }
    },
    loadOutput(data) {
      console.log(data);
      this.QRcode = data[0].trim().replace("www.google", "chart.googleapis");
      this.secretKey = data[1].split(": ").pop();
      if (data.length > 5) {
        this.verificationCode = data[2].split("is ").pop();
        this.validVerificationCode = this.verificationCode;
        this.verificationOutput = data.slice(3, 9);
      }
    },
    saveScratch() {
      //console.log("save scratch");
      const blob = new Blob([this.verificationOutput], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "2FA_ScratchCodes.txt");
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
.disabled {
  opacity: 0.7;
  pointer-events: none;
}
</style>
