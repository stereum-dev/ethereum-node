<template>
  <div class="w-full h-full absolute inset-0 flex justify-center items-center">
    <div
      class="w-full h-full absolute indent-0 bg-black opacity-80 rounded-lg z-10"
      @click="$emit('closeWindow')"
    ></div>
    <div class="browser-modal">
      <div class="ssv-header">
        <!-- <div class="icon-box">
          <img src="/img/icon/service-icons/Other/ssv-network.png" alt="icon" />
        </div>
        <div class="network-icon">
          <img
            src="/img/icon/network-icons/ethereum-testnet-circle.png"
            alt="icon"
          />
        </div> -->

        <div class="flip-box icon-box">
          <div class="flip-box-inner">
            <img class="flip-box-front" src="/img/icon/service-icons/Other/ssv-network.png" alt="icon" />

            <img class="flip-box-back" src="/img/icon/network-icons/ethereum-testnet-icon.png" alt="icon" />
          </div>
        </div>

        <!--  -->
        <div class="title-box">
          <div class="service-name"><span>ssv.network</span></div>
          <div class="service-option">
            <img src="/img/icon/service-modals-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-modals-icons/github.png" alt="icon" @click="openGitHub" />
            <img src="/img/icon/service-modals-icons/discord.png" alt="icon" @click="openDiscord" />
          </div>
        </div>
      </div>

      <!-- <div v-if="dataLoading" class="spinnerBox"> -->
      <!-- start renew -->
      <div v-if="dataLoading" class="modal-content">
        <img src="/animation/services/ssv-network/ssv-network-animation.gif" alt="loading" />
      </div>
      <div v-else class="modal-content">
        <div class="browserBox">
          <ConfirmBox
            v-if="
              (!importRawOperatorKeyOldMethod && !importEncryptedKey && !switchEncryptedKeyGenerator) ||
              passGenerateEncryptKeyConfirmed ||
              lastStep
            "
            :class="[confirmPassToGenerateCheckForBackup && !lastStep ? 'disabled' : '']"
            btn-bg-color="#1ba5f8"
            :top-line="`${
              !passGenerateEncryptKeyConfirmed
                ? `${$t('serviceModal.genPair')}`
                : !lastStep
                ? `${$t('serviceModal.confWarning')}`
                : `${$t('serviceModal.opDash')}`
            }`"
            :bottom-line="`${
              !passGenerateEncryptKeyConfirmed
                ? `${$t('serviceModal.runOp')}`
                : !lastStep
                ? `${$t('serviceModal.dnldBackup')}`
                : `${$t('serviceModal.showPerformance')}`
            }`"
            :btn-name="`${
              !passGenerateEncryptKeyConfirmed
                ? `${$t('multiServer.gen')}`
                : !lastStep
                ? `${$t('exitMultipleValidator.confirm')}`
                : `${$t('serviceModal.openBrowser')}`
            }`"
            @confirmPluginClick="firstConfirmBtnHndlr"
          />
          <ImportBox
            v-else-if="!switchEncryptedKeyGenerator || (passGenerateEncryptKeyConfirmed && importEncryptedKey)"
            :btn-bg-color="`#1ba5f8`"
            :import-box-title="
              importRawOperatorKeyOldMethod
                ? `${$t('exitMultipleValidator.selPk')}`
                : `${$t('exitMultipleValidator.selEnc')}`
            "
            import-box-placeholder=""
            try-again="true"
            :btn-name="`${$t('exitMultipleValidator.sel')}`"
            @importBoxHandler="firstImportBoxHandler"
          />

          <PasswordBox
            v-else
            :btn-bg-color="`#1ba5f8`"
            :import-box-title="passControlGenerateEncryptKeyTitle"
            :import-box-placeholder="passControlGenerateEncryptKeyPlaceholder"
            :try-again="tryAgain"
            :btn-name="passControlGenerateEncryptKeyBtn"
            @password-box-handler="passConfirm"
          />
        </div>
        <div class="browserBox">
          <ConfirmBox
            v-if="!importEncryptedKey"
            :class="[
              (!confirmPassToGenerateCheckForBackup && switchEncryptedKeyGenerator) ||
              (importRawOperatorKeyOldMethod && !importBoxModel) ||
              (!importEncryptedKey && !passGenerateEncryptKeyConfirmed && switchEncryptedKeyGenerator)
                ? 'disabled'
                : '',
            ]"
            :btn-bg-color="`${!lastStep ? '#1ba5f8' : '#494949'}`"
            :top-line="!lastStep ? secondRowTitle : `${$t('serviceModal.copyKey')}`"
            :bottom-line="!lastStep ? secondRowExplain : `${$t('serviceModal.skPk')}`"
            :btn-name="!lastStep ? secondRowBtnName : `${$t('serviceModal.copy')}`"
            :img-url="!lastStep ? '' : '/img/icon/service-modals-icons/copy.png'"
            @confirmPluginClick="secondRowBtnHandler"
          />
          <PasswordBox
            v-else
            :btn-bg-color="`#1ba5f8`"
            :import-box-title="`${$t('serviceModal.dkKey')}`"
            import-box-placeholder=""
            :btn-name="`${$t('serviceModal.imp')}`"
            :class="[importBoxModel && selectedUncryptedKey ? '' : 'disabled']"
            @password-box-handler="secondRowBtnHandler"
          />
        </div>
        <div v-if="!importEncryptedKey" class="browserBox">
          <ConfirmBox
            :class="[
              (!confirmPassToGenerateOpenInBrowser && switchEncryptedKeyGenerator) ||
              (importRawOperatorKeyOldMethod && !importBoxModel) ||
              (!importEncryptedKey && !passGenerateEncryptKeyConfirmed && switchEncryptedKeyGenerator)
                ? 'disabled'
                : '',
            ]"
            btn-bg-color="#1ba5f8"
            :top-line="!lastStep ? thirdRowTitle : `${$t('serviceModal.dnldBk')}`"
            :bottom-line="!lastStep ? thirdRowExplain : `${$t('serviceModal.dlPk')}`"
            :btn-name="!lastStep ? thirdRowBtnName : `${$t('serviceModal.dl')}`"
            @confirmPluginClick="thirdRowBtnHandler"
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
      confirmPassToGenerateCheckForBackup: false,
      confirmPassToGenerateOpenInBrowser: false,
      tryAgain: false,
      passGenerateEncryptKeyConfirmed: false,
      importEncryptedKey: false,
      importRawOperatorKeyOldMethod: false,
      lastStep: false,
      selectedUncryptedKey: "",
      passwordToDecrypt: "",
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
    secondRowTitle() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator && !this.importRawOperatorKeyOldMethod) {
        return "DOWNLOAD BACKUP";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "MIGRATE TO ENCRYPTED KEY?";
      } else {
        return "COPY PUBLIC OPERATOR KEY";
      }
    },
    secondRowExplain() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "Use an existing operator private key to recover your existing node operator's  processes";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "Use an existing operator private key to recover your existing node operator's  processes";
      } else {
        return "Import an existing encrypted operator key";
      }
    },
    secondRowBtnName() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "DOWNLOAD";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "MIGRATE";
      } else {
        return "IMPORT";
      }
    },
    thirdRowTitle() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "REGISTER NEW OPERATOR";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "IMPORT UNENCRYPTED PRIVATE KEY";
      } else {
        return "IMPORT raw (OLD METHOD) Operator Keys";
      }
    },
    thirdRowExplain() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "Register your SSV node as a new operator in the browser";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "Use an existing operator private key to recover your existing node operator's  processes";
      } else {
        return "Use an existing operator private key to recover your existing node operator's  processes";
      }
    },
    thirdRowBtnName() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "OPEN IN BROWSER";
      } else {
        return "IMPORT";
      }
    },
  },

  mounted() {
    this.getKeys();
    this.passwordBoxModel = "";
    this.importBoxModel = "";
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
    firstConfirmBtnHndlr() {
      if (
        !this.switchEncryptedKeyGenerator &&
        !this.passGenerateEncryptKeyConfirmed &&
        !this.confirmPassToGenerateOpenInBrowser &&
        !this.lastStep
      ) {
        this.switchEncryptedKeyGenerator = true;
      } else if (
        this.switchEncryptedKeyGenerator &&
        this.passGenerateEncryptKeyConfirmed &&
        !this.confirmPassToGenerateOpenInBrowser &&
        !this.lastStep
      ) {
        this.confirmPassToGenerateCheckForBackup = true;
        console.log("confirmPassToGenerateCheckForBackup", this.confirmPassToGenerateCheckForBackup);
      } else if (
        this.switchEncryptedKeyGenerator &&
        this.passGenerateEncryptKeyConfirmed &&
        this.confirmPassToGenerateOpenInBrowser &&
        !this.lastStep
      ) {
        this.lastStep = true;
        console.log("last step", this.lastStep);
      } else if (this.passGenerateEncryptKeyConfirmed && this.lastStep) {
        console.log("mainnet operator dashboard is in the last step");
      }
    },
    firstImportBoxHandler() {
      this.selectedUncryptedKey = this.importBoxModel;
      console.log("selectedUncryptedKey", this.selectedUncryptedKey);
    },
    switchToGenerateEncryptedKeyPair() {
      this.switchEncryptedKeyGenerator = true;
    },
    passConfirm() {
      if (!this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck) {
        this.firstPassToGenerate = this.passwordBoxModel;
        this.passwordBoxModel = "";
        this.firstPassToGenerateCheck = true;
        this.confirmPassToGenerateCheck = false;
        console.log("first step to generate pass", this.firstPassToGenerate);
      } else if (this.firstPassToGenerateCheck && !this.confirmPassToGenerateCheck) {
        this.confirmPassToGenerate = this.passwordBoxModel;
        this.passwordBoxModel = "";
        this.firstPassToGenerateCheck = true;
        this.confirmPassToGenerateCheck = true;

        if (this.firstPassToGenerate === this.confirmPassToGenerate) {
          this.passGenerateEncryptKeyConfirmed = true;
          console.log("second step to generate pass", this.confirmPassToGenerate);
        } else if (this.firstPassToGenerate !== this.confirmPassToGenerate) {
          this.firstPassToGenerateCheck = true;
          this.confirmPassToGenerateCheck = false;
          this.confirmPassToGenerate = "";
          this.tryAgain = true;
        }
      } else if (this.firstPassToGenerateCheck && this.confirmPassToGenerateCheck) {
        console.log("hhhhh");
      }
    },
    secondRowBtnHandler() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator && !this.lastStep) {
        this.downloadBackup();
        this.confirmPassToGenerateOpenInBrowser = true;
        this.lastStep = true;
      } else if ((!this.importEncryptedKey && this.switchEncryptedKeyGenerator) || this.lastStep) {
        this.copyHandler();
        console.log("copy public key");
      } else if (this.importEncryptedKey && !this.lastStep) {
        this.passwordToDecrypt = this.passwordBoxModel;
        this.passwordBoxModel = "";
        this.importBoxModel = "";
        this.lastStep = true;
        this.importEncryptedKey = false;
        this.passGenerateEncryptKeyConfirmed = true;
        console.log("go to last step", this.passwordToDecrypt);
      } else if (this.importRawOperatorKeyOldMethod) {
        this.switchEncryptedKeyGenerator = true;
        this.importRawOperatorKeyOldMethod = false;
        this.selectedUncryptedKey = this.importBoxModel;
        console.log("merge selected key and selected key is", this.selectedUncryptedKey);
      } else {
        this.importEncryptedKey = true;
      }
    },
    downloadBackup() {
      console.log("download backup");
    },
    thirdRowBtnHandler() {
      if (this.lastStep) {
        this.downloadBackup();
      } else if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        console.log("open in browser");
      } else if (!this.lastStep) {
        this.importRawOperatorKeyOldMethod = true;
        console.log("import raw operator key");
      }
    },
    copyHandler() {
      let toCopy = "dummyyy value to test the copy btn";
      navigator.clipboard
        .writeText(toCopy)
        .then(() => {
          this.cursorLocation = this.copiedPub;
        })
        .catch(() => {
          console.log(`can't copy`);
        });
    },
  },
};
</script>
<style scoped>
.disabled {
  opacity: 0.5;
  box-shadow: none;
  pointer-events: none;
  cursor: not-allowed;
}
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
