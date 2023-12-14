<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="ssv-header">
        <!-- <div class="icon-box">
          <img src="/img/icon/service-icons/ssv-network.png" alt="icon" />
        </div>
        <div class="network-icon">
          <img
            src="/img/icon/click-installation/testnet-circle.png"
            alt="icon"
          />
        </div> -->

        <div class="flip-box icon-box">
          <div class="flip-box-inner">
            <img class="flip-box-front" src="/img/icon/service-icons/ssv-network.png" alt="icon" />

            <img class="flip-box-back" src="/img/icon/click-installation/testnet-icon.png" alt="icon" />
          </div>
        </div>

        <!--  -->
        <div class="title-box">
          <div class="service-name"><span>ssv.network</span></div>
          <div class="service-option">
            <img src="/img/icon/service-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" @click="openGitHub" />
            <img src="/img/icon/service-icons/discord.png" alt="icon" @click="openDiscord" />
          </div>
        </div>
      </div>
      <!-- <div class="wrapper">
        <div v-if="dataLoading" class="spinnerBox">
          <img src="/img/icon/control/spinner.gif" alt="spinner" />
        </div>
        <div v-else class="content-box">
          <frontpage-ssv
            v-if="pubkeyModalActive"
            @open-pubkey="operatorModalHandler"
            @open-secretkey="registerSecretkeyHandler"
          ></frontpage-ssv>
          <register-ssv
            v-if="registerModalActive"
            :pubkey="pubkey"
            :secretkey="secretkey"
            @register-pubkey="registerSsvPubkeyHandler"
          ></register-ssv>
          <secretkey-register
            v-if="registerSecretkeyActive"
            :ssv-service="ssvService"
            @insert-key="insertSecretkeyHandler"
          ></secretkey-register>
          <ssv-dashboard v-if="ssvDashboardActive" :operator-data="operatorData" :pubkey="pubkey"></ssv-dashboard>
        </div>
      </div> -->

      <!-- start renew -->
      <div class="modal-content">
        <div class="browserBox">
          <ConfirmBox
            v-if="!switchEncryptedKeyGenerator || passGenerateEncryptKeyConfirmed"
            :btn-bg-color="`#1ba5f8`"
            :top-line="`${!passGenerateEncryptKeyConfirmed ? ' GENERATE ENCRYPTED PAIR' : 'CONFIRM WARNING'}`"
            :bottom-line="`${
              !passGenerateEncryptKeyConfirmed
                ? 'The most secure way to run your Operator node, is to generate an Encrypted key pair.'
                : 'Please make sure to write down your password & download the backup. Nobody can help you recover your password or secret key if you lose them!'
            }`"
            btn-name="GENERATE"
            @confirmPluginClick="switchEncryptedKeyGenerator = true"
          />

          <PasswordBox
            v-else
            :btn-bg-color="`#1ba5f8`"
            :import-box-title="passControlGenerateEncryptKeyTitle"
            :import-box-placeholder="passControlGenerateEncryptKeyPlaceholder"
            :try-again="tryAgain"
            :btn-name="passControlGenerateEncryptKeyBtn"
            @importBoxHandler="passConfirm"
          />
        </div>
        <div class="browserBox">
          <ConfirmBox
            btn-bg-color="#1ba5f8"
            top-line="IMPORT ENCRYPTED OPERATOR KEY"
            bottom-line="Import an existing encrypted operator key"
            btn-name="IMPORT"
            @confirmPluginClick="console.log('confirm 2nd row PluginClick')"
          />
        </div>
        <div class="browserBox">
          <ConfirmBox
            btn-bg-color="#1ba5f8"
            top-line="IMPORT raw (OLD METHOD) Operator Keys"
            bottom-line="Use an existing operator private key to recover your existing node operator's  processes"
            btn-name="IMPORT"
            @confirmPluginClick="console.log('confirm 3rd row PluginClick')"
          />
        </div>
      </div>

      <!-- end renew -->
    </div>
  </div>
</template>
<script>
// import FrontpageSsv from "./FrontpageSsv.vue";
// import RegisterSsv from "./RegisterSsv.vue";
// import SsvDashboard from "./SsvDashboard.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
// import SecretkeyRegister from "./SecretkeyRegister.vue";
import axios from "axios";
import { toRaw } from "vue";
import ConfirmBox from "./plugin/ConfirmBox.vue";
import ImportBox from "./plugin/ImportBox.vue";
import PasswordBox from "./plugin/PasswordBox";
export default {
  components: {
    // FrontpageSsv,
    // RegisterSsv,
    // SsvDashboard,
    // SecretkeyRegister,
    ConfirmBox,
    ImportBox,
    PasswordBox,
  },
  data() {
    return {
      operatorData: null,
      ssvService: null,
      isSsvAvailable: false,
      pubkeyModalActive: true,
      registerModalActive: false,
      ssvDashboardActive: false,
      registerSecretkeyActive: false,
      enteredText: "",
      selectedOperator: null,
      accepted: "",
      secretkey: null,
      dataLoading: true,
      //new ssv start hereeeeeeeeeeee
      switchEncryptedKeyGenerator: false,
      firstPassToGenerate: "",
      confirmPassToGenerate: "",
      firstPassToGenerateCheck: false,
      confirmPassToGenerateCheck: false,
      tryAgain: false,
      passGenerateEncryptKeyConfirmed: false,
    };
  },

  computed: {
    ...mapWritableState(useNodeHeader, {
      runningServices: "runningServices",
      operators: "operators",
      importBoxModel: "importBoxModel",
      passwordBoxModel: "passwordBoxModel",
    }),
    //new ssv start hereeeeeeeeeeee
    passControlGenerateEncryptKeyTitle() {
      if (!this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck) {
        return "ENTER A PASSWORD TO GENERATE AN ENCRYPTED KEY PAIR";
      } else if (this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck) {
        return "CONFIRM YOUR PASSWORD";
      } else {
        return "CONFIRM WARNING";
      }
    },
    passControlGenerateEncryptKeyBtn() {
      if (!this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck) {
        return "Generate";
      } else if (this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck && !this.tryAgain) {
        return "Confirm";
      } else if (this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck && this.tryAgain) {
        return "Try Again";
      } else {
        return "";
      }
    },
    passControlGenerateEncryptKeyPlaceholder() {
      if (!this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck) {
        return "Set your password";
      } else if (this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck && !this.tryAgain) {
        return "Confirm your password";
      } else if (this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck && this.tryAgain) {
        return "Passwords do not match, please try again";
      } else {
        return "";
      }
    },
    borderForInput() {
      return this.tryAgain ? "1px solid red" : "none";
    },
  },

  mounted() {
    this.getKeys();
    this.passwordBoxModel = "";
  },
  created() {
    this.dataLoading = true;
  },
  methods: {
    handleImportBox(value) {
      this.test = value;
    },
    operatorModalHandler() {
      this.pubkeyModalActive = false;
      this.registerModalActive = true;
    },
    getKeys: async function () {
      let ssv = this.runningServices.find((service) => service.service === "SSVNetworkService");
      this.ssvService = ssv;
      let ssvConfig = await ControlService.getServiceConfig(ssv.config.serviceID);
      this.secretkey = ssvConfig.ssv_sk;
      this.pubkey = ssvConfig.ssv_pk;

      try {
        if (!this.pubkey) {
          let ssvKeystoreConfig = await ControlService.readSSVKeystoreConfig(ssv.config.serviceID);
          if (ssvKeystoreConfig.privateKeyFileData.publicKey) {
            this.pubkey = ssvKeystoreConfig.privateKeyFileData.publicKey;
          }
        }
        let network = ssvConfig.network === "goerli" ? "prater" : ssvConfig.network;
        let response = await axios.get(`https://api.ssv.network/api/v4/${network}/operators/public_key/` + this.pubkey);
        if (!response.data.data)
          response = await axios.get(`https://api.ssv.network/api/v3/${network}/operators/public_key/` + this.pubkey);
        if (response.data.data) {
          this.operatorData = response.data.data;
          this.ssvDashboardActive = true;
          this.pubkeyModalActive = false;
          this.dataLoading = false;
        } else {
          this.ssvDashboardActive = false;
          this.pubkeyModalActive = true;
          this.dataLoading = false;
        }
      } catch {
        console.log("Operator not registered");
        this.ssvDashboardActive = false;
        this.pubkeyModalActive = true;
        this.dataLoading = false;
      }
    },
    registerSsvPubkeyHandler() {
      this.registerModalActive = false;
      this.pubkeyModalActive = false;
      this.ssvDashboardActive = true;
      window.open("https://app.ssv.network/");
    },
    matchingSsvPublickeyHandler() {
      this.registerModalActive = false;
      this.pubkeyModalActive = false;
      this.ssvDashboardActive = true;
    },
    registerSecretkeyHandler() {
      this.registerModalActive = false;
      this.pubkeyModalActive = false;
      this.registerSecretkeyActive = true;
    },
    async insertSecretkeyHandler(data) {
      this.dataLoading = true;
      const result = await ControlService.insertSSVNetworkKeys({
        service: toRaw(this.ssvService),
        pk: data,
      });
      if (result && result.message && result.stack) {
        console.log("Failed Inserting Key", result.message);
      } else {
        await this.getKeys();
        this.registerModalActive = false;
        this.pubkeyModalActive = false;
        this.registerSecretkeyActive = false;
        this.ssvDashboardActive = true;
      }
      this.dataLoading = false;
    },
    openBrowser() {
      let url = "https://ssv.network/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/bloxapp/ssv";
      window.open(url, "_blank");
    },
    openDiscord() {
      let url = " https://discord.gg/AbYHBfjkDY";
      window.open(url, "_blank");
    },

    //new ssv start hereeeeeeeeeeee
    switchToGenerateEncryptedKeyPair() {
      this.switchEncryptedKeyGenerator = true;
    },
    passConfirm() {
      if (!this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck) {
        this.firstPassToGenerate = this.passwordBoxModel;
        console.log("this.firstPassToGenerate", this.firstPassToGenerate, this.passwordBoxModel);
        this.passwordBoxModel = "";
        this.firstPassToGenerateCheck = true;
        this.confirmPassToGenerateCheck = false;
      } else if (this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck) {
        this.confirmPassToGenerate = this.passwordBoxModel;
        this.passwordBoxModel = "";
        this.firstPassToGenerateCheck = true;
        this.confirmPassToGenerateCheck = true;

        console.log(this.confirmPassToGenerate, this.passwordBoxModel);
        if (this.firstPassToGenerate === this.confirmPassToGenerate) {
          this.passGenerateEncryptKeyConfirmed = true;
        } else if (this.firstPassToGenerate !== this.confirmPassToGenerate) {
          this.firstPassToGenerateCheck = true;
          this.confirmPassToGenerateCheck = false;
          console.log("pass conflict");
          this.confirmPassToGenerate = "";
          this.tryAgain = true;
        }
      }
    },
  },
};
</script>
<style scoped>
.flip-box {
  background-color: transparent;
  perspective: 1000px;
}

.flip-box-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform-origin: 40%;
}

.flip-box:hover .flip-box-inner {
  transform: rotateY(180deg);
  transform-origin: 40%;
}

.flip-box-front,
.flip-box-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform-origin: 40%;
  position: absolute;
  left: 14%;
  top: 5%;
}

.flip-box-back {
  transform: rotateY(180deg);
}
/*animation */
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
  z-index: 100;
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

.ssv-header {
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
  position: relative;
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
/*.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.spinnerBox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.spinnerBox img {
  width: 50%;
}

.content-box {
  width: 100%;
  height: 100%;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 103;
}

.operator-parent,
.insert-parent {
  width: 95%;
  height: 45%;
  background-color: #32383e;
  border: 1px solid #32383e;
  box-shadow: 1px 1px 3px 1px #252525;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.network-icon {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 37%;
  top: 47%;
}

.network-icon img {
  width: 68%;
  height: 68%;
}*/
.modal-content {
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  cursor: default;
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
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.import-btn {
  width: 27%;
  height: 50%;
  background-color: #1ba5f8;
  text-decoration: none;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #dbdbdb;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
  position: absolute;
  right: 2%;
}
.import-btn:hover {
  transition-duration: 100ms;
  background-color: #1a2e32e6;
}
.import-btn:active {
  transition-duration: 100ms;
  background-color: #1a2e32e6;
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
.browserBox_import {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.import-title {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;
}
.enrImport {
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.enrImport input {
  width: 95%;
  height: 50%;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  padding-left: 10px;
}
</style>
