<template>
  <div class="w-full h-full absolute inset-0 flex justify-center items-center">
    <div class="w-full h-full absolute indent-0 bg-black opacity-80 rounded-lg z-10" @click="$emit('closeWindow')"></div>
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

            <img
              class="flip-box-back"
              :src="`${
                currentNetwork.network == 'mainnet'
                  ? '/img/icon/network-icons/ethereum-mainnet.png'
                  : '/img/icon/network-icons/ethereum-testnet-icon.png'
              }`"
              alt="icon"
            />
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
                : `${$t('serviceModal.opDash', { network: network })}`
            }`"
            :bottom-line="`${
              !passGenerateEncryptKeyConfirmed
                ? `${$t('serviceModal.runOp')}`
                : !lastStep
                ? `${$t('serviceModal.dnldBackup')}`
                : !operatorData
                ? apiUnavailable
                  ? `${$t('serviceModal.apiUnavailable')}`
                  : `${$t('serviceModal.registerOperator')}`
                : `${$t('serviceModal.showPerformance', {
                    opid: operatorData?.id,
                    opname: operatorData?.name,
                    network: ucWord(network),
                  })}`
            }`"
            :btn-name="`${
              !passGenerateEncryptKeyConfirmed
                ? `${$t('multiServer.gen')}`
                : !lastStep
                ? `${$t('serviceModal.confirm')}`
                : `${$t('serviceModal.openBrowser')}`
            }`"
            @confirmPluginClick="firstConfirmBtnHndlr"
          />
          <ImportBox
            v-else-if="!switchEncryptedKeyGenerator || (passGenerateEncryptKeyConfirmed && importEncryptedKey)"
            :btn-bg-color="`#1ba5f8`"
            :import-box-title="importRawOperatorKeyOldMethod ? `${$t('serviceModal.selPk')}` : `${$t('serviceModal.selEnc')}`"
            import-box-placeholder=""
            :try-again="true"
            :empty-disabled="false"
            :btn-name="`${$t('serviceModal.sel')}`"
            @input="firstRowInputHandler"
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
            :bottom-line="!lastStep ? secondRowExplain : `${$t('serviceModal.copyKeyDesc')}`"
            :btn-name="!lastStep ? secondRowBtnName : `${$t('serviceModal.copy')}`"
            :img-url="!lastStep ? '' : '/img/icon/service-modals-icons/copy.png'"
            @confirmPluginClick="secondRowBtnHandler"
          />
          <PasswordBox
            v-else
            :btn-bg-color="`#1ba5f8`"
            :import-box-title="`${$t('serviceModal.dkKey')}`"
            import-box-placeholder=""
            :empty-disabled="false"
            :btn-name="`${$t('serviceModal.imp')}`"
            :class="[importBoxModel ? '' : 'disabled']"
            @input="secondRowInputHandler"
            @password-box-handler="secondRowBtnHandler"
          />
        </div>
        <div class="browserBox">
          <ConfirmBox
            :class="[
              (!confirmPassToGenerateOpenInBrowser && switchEncryptedKeyGenerator) ||
              (importRawOperatorKeyOldMethod && !importBoxModel) ||
              (!importEncryptedKey && !passGenerateEncryptKeyConfirmed && switchEncryptedKeyGenerator) ||
              (importEncryptedKey && !passwordToDecrypt)
                ? 'disabled'
                : '',
            ]"
            btn-bg-color="#1ba5f8"
            :top-line="!lastStep ? thirdRowTitle : `${$t('serviceModal.dnldBk')}`"
            :bottom-line="!lastStep ? thirdRowExplain : `${$t('serviceModal.dlBak')}`"
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
import ControlService from "@/store/ControlService";
import { mapWritableState, mapState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import axios from "axios";
import { toRaw } from "vue";
import ConfirmBox from "./plugin/ConfirmBox.vue";
import ImportBox from "./plugin/ImportBox.vue";
import PasswordBox from "./plugin/PasswordBox";
import { useRestartService } from "@/composables/services";
import { useNodeManage } from "@/store/nodeManage";
const JSZip = require("jszip");
const saveAs = require("file-saver");
const semver = require("semver");

const openFilePicker = async (read_content = false) => {
  try {
    return await ControlService.openFilePicker(
      {
        properties: ["openFile", "multiSelections"],
        // filters: [
        //   { name: "ZIP Files", extensions: ["zip"] },
        //   { name: "Text Files", extensions: ["txt"] },
        // ],
      },
      read_content
    );
  } catch (error) {
    console.error("Error picking files:", error);
  }
};

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
      // newly added during wiring
      network: null,
      pubkey: null,
      apiUnavailable: null,
      ssvTotalConfig: null,
      ssvServiceConfig: null,
      ssvNetworkConfig: null,
      lastKnownPublicKey: null,
      keystoreExists: null,
      isModernOperator: null,
      isDownloading: false,
      selectedEncryptedKey: "",
    };
  },

  computed: {
    ...mapWritableState(useNodeHeader, {
      runningServices: "runningServices",
      operators: "operators",
      importBoxModel: "importBoxModel",
      passwordBoxModel: "passwordBoxModel",
    }),
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
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
      } else if (this.lastStep) {
        return "COPY PUBLIC OPERATOR KEY";
      } else {
        return "IMPORT ENCRYPTED OPERATOR KEY";
      }
    },
    secondRowExplain() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "Download a backup of the generated private key and password you used for encryption. Keep this files on a safe location!";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "Migrate the given secret key to an more secure encrypted private key during import and recover your existing node operator's processes.";
      } else {
        return "Import an existing encrypted operator private key";
      }
    },
    secondRowBtnName() {
      console.log("TODO: secondRowBtnName has wrong val on import keystore page!");
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "DOWNLOAD";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "MIGRATE";
      } else if (this.importEncryptedKey) {
        return "SELECT";
      } else {
        return "IMPORT";
      }
    },
    thirdRowTitle() {
      if (this.importEncryptedKey && !this.lastStep) {
        return "IMPORT ENCRYPTED PRIVATE KEY AND PASSWORD";
      } else if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "OPEN OPERATOR DASHBOARD";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "IMPORT AS IS - UNENCRYPTED SECRET KEY";
      } else {
        return "IMPORT RAW (OLD METHOD) OPERATOR KEY";
      }
    },
    thirdRowExplain() {
      if (this.importEncryptedKey && !this.lastStep) {
        return "Import the given encrypted private key and password to your SSV node";
      } else if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "Open the local dahsboard to check your SSV operator status";
      } else if (this.importRawOperatorKeyOldMethod && !this.importEncryptedKey && !this.switchEncryptedKeyGenerator) {
        return "Import the given secret key as is (thus unencrypted) to recover your existing node operator's processes";
      } else {
        return "Import an existing unencrypted operator secret key";
      }
    },
    thirdRowBtnName() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        return "CONTINUE";
      } else {
        return "IMPORT";
      }
    },
  },

  mounted() {
    console.log(this.currentNetwork.network);
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
    isMinimumVersion(imageTag, minimumVersion) {
      const version = semver.clean(imageTag.split(":")[1]);
      if (!version) {
        console.error("Invalid image tag:", imageTag);
        return false;
      }
      return semver.gte(version, minimumVersion);
    },
    getKeys: async function () {
      this.ssvService = this.runningServices.find((service) => service.service === "SSVNetworkService");
      this.ssvTotalConfig = await ControlService.getSSVTotalConfig(this.ssvService.config.serviceID);

      // TODO: check image min version
      // const imageTag = 'bloxstaking/ssv-node:v1.0.1-hotfix';
      // const minimumVersion = '1.1.0';
      const imageTag = this.ssvTotalConfig.ssvServiceConfig.image;
      const minimumVersion = "v1.3.0";
      if (this.isMinimumVersion(imageTag, minimumVersion)) {
        console.log(`The image ${imageTag} meets the minimum version requirement of ${minimumVersion}`);
      } else {
        console.log(`The image ${imageTag} does not meet the minimum version requirement of ${minimumVersion}`);
      }

      this.ssvServiceConfig = this.ssvTotalConfig.ssvServiceConfig;
      this.ssvNetworkConfig = this.ssvTotalConfig.ssvNetworkConfig;
      this.network = this.ssvServiceConfig.network;
      this.lastKnownPublicKey = this.ssvTotalConfig.lastKnownPublicKeyFileData;

      // By default assume pk/sk are defined in ssvServiceConfig (unencrypted & deprecated by SSV)
      this.pubkey = this.ssvTotalConfig.deprecatedPublicKey;
      this.secretkey = this.ssvTotalConfig.deprecatedSecretKey;

      // Unencrypted key specified in ssvNetworkConfig (unencrypted & deprecated by SSV)
      if (this.ssvTotalConfig.deprecatedOperatorPrivateKey) {
        console.log("Unencrypted key specified in ssvNetworkConfig");
        this.secretkey = this.ssvTotalConfig.deprecatedOperatorPrivateKey;
      }

      // Encrypted keystore/password specified in ssvNetworkConfig (modern)
      if (this.ssvTotalConfig?.privateKeyFileData?.publicKey) {
        this.keystoreExists = true;
        this.secretkey = null; // encrypted via encrypted_private_key.json/password
        this.pubkey = this.ssvTotalConfig.privateKeyFileData.publicKey;
        this.isModernOperator = true;
      }

      // console.log("this.ssvService", this.ssvService);
      // console.log("this.ssvTotalConfig", this.ssvTotalConfig);
      // console.log("this.ssvServiceConfig", this.ssvServiceConfig);
      // console.log("this.ssvNetworkConfig", this.ssvNetworkConfig);
      // console.log("this.secretkey", this.secretkey);
      // console.log("this.pubkey", this.pubkey);
      // console.log("this.lastKnownPublicKey", this.lastKnownPublicKey);

      // console.log("this.ssvTotalConfig.lastBackedPublicKey", this.ssvTotalConfig.lastBackedPublicKey);
      // console.log("this.ssvTotalConfig.lastKnownOperatorId", this.ssvTotalConfig.lastKnownOperatorId);

      // Get last backed public key from backend (TODO: take this from backend outtput of ssvTotalConfig)
      // const getSSVOperatorDataFromApi = await this.sendSSVCommand({
      //   command: "getSSVOperatorDataFromApi",
      //   arguments: [this.network, this.pubkey],
      // });
      // console.log("getSSVOperatorDataFromApi", getSSVOperatorDataFromApi);

      // Get last backed public key from backend (TODO: take this from backend outtput of ssvTotalConfig)
      const lastBackedPublicKey = await this.sendSSVCommand({
        command: "getSSVLastBackedPublicKey",
        arguments: [this.ssvService.config.serviceID],
      });
      // console.log("lastBackedPublicKey", lastBackedPublicKey);

      // Get last known operator id from backend (TODO: take this from backend outtput of ssvTotalConfig)
      const lastKnownOperatorId = await this.sendSSVCommand({
        command: "getSSVLastKnownOperatorId",
        arguments: [this.ssvService.config.serviceID],
      });
      // console.log("lastKnownOperatorId", lastKnownOperatorId);

      // If pubkey was already generated/imported at least once by the end-user via "generate/import" buttons
      if (this.lastKnownPublicKey) {
        console.log("pubkey already generated");

        if (lastBackedPublicKey != this.pubkey) {
          console.log("Current Key was never backed up, enforce backup state");
          // Enforce download backup state if windows is re-opened after key was already generated
          this.dataLoading = false;
          this.confirmPassToGenerateCheck = true;
          this.confirmPassToGenerateCheckForBackup = true;
          this.firstPassToGenerateCheck = true;
          this.passGenerateEncryptKeyConfirmed = true;
          this.switchEncryptedKeyGenerator = true;
        } else {
          console.log("Current Key was backed up at least once, get operator data from SSV API");

          // Get operator ID from SSV
          try {
            const response = await axios.get(`https://api.ssv.network/api/v4/${this.network}/operators/public_key/` + this.pubkey);
            if (response && response?.data?.data?.id) {
              // Get operator metadata from SSV
              const operator_id = response?.data?.data?.id;
              const opurl = `https://api.ssv.network/api/v4/${this.network}/operators/` + operator_id;
              const opresp = await axios.get(opurl);
              console.log("opurl", opurl);
              if (opresp && opresp?.data?.id) {
                this.operatorData = opresp.data;
                console.log("Operator registered");
                console.log("SSV: this.operatorData", this.operatorData);
                // Set last known operator data to have it handy for SSVDKGService
                if (lastKnownOperatorId != this.operatorData.id) {
                  // Ignore any errors because its monitored in ssvWatch -> watchSSVDKG anyway
                  try {
                    await this.sendSSVCommand({
                      command: "setSSVLastKnownOperatorId",
                      arguments: [this.ssvService.config.serviceID, this.operatorData.id, false, true],
                    });
                  } catch (e) {}
                }
              } else {
                this.apiUnavailable = true;
                console.log(`SSV API did not respond metadata for operator ${operator_id}`);
              }
            } else {
              console.log("SSV API reported unknown operator");
              // this.operatorData = { name: "FakeNameTesting", id: 60 };
            }
          } catch (e) {
            this.apiUnavailable = true;
            console.log("Could not request operator data from SSV-API: ", e);
          }

          this.dataLoading = false;
          this.lastStep = true;
          this.passGenerateEncryptKeyConfirmed = true;
          console.log("SSV: this.lastStep", this.lastStep);
          console.log("SSV: this.passGenerateEncryptKeyConfirmed", this.passGenerateEncryptKeyConfirmed);
        }
      } else {
        if (this.isModernOperator && this.ssvTotalConfig.ssvSecretsDirFallback) {
          // D1) if encrypted key exists in fallback directory it must have user generated on an old node (automatically or mahually)
          console.log(
            "D1) if encrypted key exists in fallback directory it must have user generated on an old node (automatically or mahually)"
          );
          console.log("this.ssvTotalConfig.ssvSecretsDirFallback", this.ssvTotalConfig.ssvSecretsDirFallback);
          const result = await this.sendSSVCommand(
            {
              command: "writeSSVLastKnownPublicKeyFile",
              arguments: [
                this.ssvTotalConfig.serviceID,
                this.pubkey,
                toRaw(this.ssvTotalConfig.getSsvServiceConfig),
                toRaw(this.ssvTotalConfig.getSsvNetworkConfig),
              ],
            },
            false,
            true,
            true
          );
          // ----
          console.log("D1 :: result", result);
          // console.log("refreshing keys after writing LKPK");
          // await this.getKeys();
          // console.log("set confirmPassToGenerateCheckForBackup to true to enable next step: backup download");
          // this.confirmPassToGenerateCheckForBackup = true;

          // Optionally also write lastback and send him straight to endscree
          // Tell the backend that a backup was downloaded at least once
          await this.sendSSVCommand({
            command: "setSSVLastBackedPublicKey",
            arguments: [this.ssvService.config.serviceID, this.pubkey],
          });
          // ----
          await this.getKeys();
          this.lastStep = true;
          this.dataLoading = false;
        } else {
          // Key must at least once generated/imported by the user since key encryption exists
          // This gives the user the option to encrypt also an existing key that is registered.
          console.log("pubkey never generated/imported since key encryption exists");
          console.log("this.isModernOperator", this.isModernOperator);
          console.log("this.ssvTotalConfig.ssvSecretsDirFallback", this.ssvTotalConfig.ssvSecretsDirFallback);
          console.log("this.lastKnownPublicKey", this.lastKnownPublicKey);
          this.ssvDashboardActive = false;
          this.pubkeyModalActive = true;
          this.dataLoading = false;
        }
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
    openOperatorPage(operatorID, network) {
      if (!operatorID) {
        throw new Error("openOperatorPage -> Operaor ID unknown");
      }
      if (!network) {
        throw new Error("openOperatorPage -> Network unknown");
      }
      let net = network == "mainnet" ? "" : network + ".";
      let url = `https://${net}explorer.ssv.network/operators/${operatorID}`;
      window.open(url, "_blank");
    },
    openRegisterPage(network) {
      if (!network) {
        throw new Error("openRegisterPage -> Network unknown");
      }
      //let url = `https://app.ssv.network/join/${network}`;
      let url = `https://app.ssv.network/join`;
      window.open(url, "_blank");
    },

    //new ssv start hereeeeeeeeeeee
    async firstConfirmBtnHndlr() {
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
        console.log("generate/import key finished by the user (migrate/overwrite the key in  backend now)!");
        try {
          let result = null;
          if (this.selectedUncryptedKey) {
            // B -> B1
            console.log("B) clicked import old keys");
            console.log("B1) clicked migrate: overwrite existing stuff with given stuff and migrate to encrypted keystore");
            result = await this.sendSSVCommand(
              {
                command: "migrateToSSVEncryptedKeys",
                arguments: [this.ssvService.config.serviceID, this.confirmPassToGenerate, this.selectedUncryptedKey],
              },
              true,
              true
            );
          } else {
            console.log("A) clicked generate");
            if (this.keystoreExists) {
              if (!this.ssvTotalConfig.ssvSecretsDirFallback && !this.lastKnownPublicKey) {
                console.log(
                  "A1-FIX) encrypted kestore/password exists on server in '/secrets' dir -> must be ansible generated -> renew now!"
                );
                console.log("this.ssvTotalConfig.ssvSecretsDirFallback", this.ssvTotalConfig.ssvSecretsDirFallback);
                result = await this.sendSSVCommand(
                  {
                    command: "createSSVEncryptedKeys",
                    arguments: [this.ssvTotalConfig.serviceID, this.confirmPassToGenerate],
                  },
                  true,
                  true
                );
              } else {
                console.log("this case must not happen!");
              }
            } else if (this.ssvTotalConfig.deprecatedSecretKey) {
              console.log("A2) unencryted (deprecated) secret key exists on server -> migrate to encrypted keystore");
              result = await this.sendSSVCommand(
                {
                  command: "migrateToSSVEncryptedKeys",
                  arguments: [this.ssvService.config.serviceID, this.confirmPassToGenerate],
                },
                true,
                true
              );
            }
          }
          // ----
          console.log("X1 :: result", result);
          console.log("refreshing keys after genrate/migrate");
          await this.getKeys();
          console.log("set confirmPassToGenerateCheckForBackup to true to enable next step: backup download");
          this.confirmPassToGenerateCheckForBackup = true;
        } catch (e) {
          console.log("Could not generate/import key: ", e);
        }
      } else if (
        this.switchEncryptedKeyGenerator &&
        this.passGenerateEncryptKeyConfirmed &&
        this.confirmPassToGenerateOpenInBrowser &&
        !this.lastStep
      ) {
        this.lastStep = true;
        console.log("last step", this.lastStep);
      } else if (this.passGenerateEncryptKeyConfirmed && this.lastStep) {
        console.log("operator dashboard is in the last step");
        if (this.operatorData) {
          console.log(`open url to existing ssv ${this.network} operator ${this.operatorData.id}`);
          this.openOperatorPage(this.operatorData.id, this.network);
        } else {
          console.log(`open url to register new ssv ${this.network} operator`);
          this.openRegisterPage(this.network);
        }
      }
    },
    async firstRowInputHandler() {
      if (this.importEncryptedKey) {
        console.log("text typed in first row encrypted kesytore import");
        this.selectedEncryptedKey = this.importBoxModel;
      } else {
        console.log("text typed in first row unencrypted private key import");
        this.selectedUncryptedKey = this.importBoxModel;
        console.log("selectedUncryptedKey", this.selectedUncryptedKey);
      }
    },
    async firstImportBoxHandler() {
      if (this.importEncryptedKey) {
        console.log("button clicked in first row encrypted kesytore import");
        let selectedfiles = await openFilePicker(true);
        console.log("selectedfiles", selectedfiles);
        if (selectedfiles.length) this.importBoxModel = selectedfiles[0].content;
        this.selectedEncryptedKey = this.importBoxModel;
        //console.log("selectedEncryptedKey", this.selectedEncryptedKey);
      } else {
        console.log("button clicked in first row unencrypted private key import");
        let selectedfiles = await openFilePicker(true);
        console.log("selectedfiles", selectedfiles);
        if (selectedfiles.length) this.importBoxModel = selectedfiles[0].content;
        this.selectedUncryptedKey = this.importBoxModel;
        //console.log("selectedUncryptedKey", this.selectedUncryptedKey);
      }
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
    async secondRowInputHandler() {
      if (this.importEncryptedKey && !this.lastStep) {
        console.log("text typed in second row password for encrypted kesytore import");
        this.passwordToDecrypt = this.passwordBoxModel;
      }
    },
    async secondRowBtnHandler() {
      if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator && !this.lastStep) {
        console.log("disable second row and goto open dashboard confirmation third row");
        this.downloadBackupBttnOnClick();
        setTimeout(() => {
          console.log("enabled third row - user can now continue to dashboard");
          this.confirmPassToGenerateOpenInBrowser = true;
        }, 1000);
      } else if ((!this.importEncryptedKey && this.switchEncryptedKeyGenerator) || this.lastStep) {
        this.copyHandler();
        console.log("copy public key");
      } else if (this.importEncryptedKey && !this.lastStep) {
        console.log("button clicked in second row encrypted kesytore import");
        let selectedfiles = await openFilePicker(true);
        console.log("selectedfiles", selectedfiles);
        if (selectedfiles.length) this.passwordBoxModel = selectedfiles[0].content;
        this.passwordToDecrypt = this.passwordBoxModel;
        // console.log("this.passwordToDecrypt", this.passwordToDecrypt);
      } else if (this.importRawOperatorKeyOldMethod) {
        console.log("button clicked in second row migrate unencrypted (old) imported key");
        this.switchEncryptedKeyGenerator = true;
        this.importRawOperatorKeyOldMethod = false;
        this.selectedUncryptedKey = this.importBoxModel;
        console.log("merge selected key and selected key is", this.selectedUncryptedKey);
      } else {
        console.log("import encrypted key set to true");
        this.importEncryptedKey = true;
      }
    },
    async thirdRowBtnHandler() {
      if (this.lastStep) {
        this.downloadBackupBttnOnClick();
      } else if (!this.importEncryptedKey && this.switchEncryptedKeyGenerator) {
        console.log("continue to dashboard");
        this.lastStep = true;
      } else if (this.importEncryptedKey && !this.lastStep) {
        console.log("import encrypted operator key and password");
        console.log("this.importEncryptedKey", this.importEncryptedKey);
        console.log("this.selectedEncryptedKey", this.selectedEncryptedKey);
        console.log("this.passwordToDecrypt", this.passwordToDecrypt);
        if (this.selectedEncryptedKey) {
          // C -> C1
          console.log("C) clicked import encrypted keys (keystore)");
          console.log("C1) overwrite existing stuff with given stuff and remove unencrypted keys (if they exist)");
          const result = await this.sendSSVCommand(
            {
              command: "importSSVEncryptedKeys",
              arguments: [this.ssvService.config.serviceID, this.selectedEncryptedKey, this.passwordToDecrypt],
            },
            true,
            true
          );
          console.log("X2 :: result", result);
          console.log("refreshing keys after import");
          await this.getKeys();
          // move to dashoard (last dialog)
          console.log("move to dashoard (last dialog)");
          this.ssvDashboardActive = true;
          this.pubkeyModalActive = false;
          this.dataLoading = false;
          this.lastStep = true;
          this.passGenerateEncryptKeyConfirmed = true;
          this.importEncryptedKey = false;
          console.log("last step", this.lastStep);
        }
      } else if (!this.lastStep) {
        this.importRawOperatorKeyOldMethod = true;
        console.log("import raw operator key");
        console.log(this.selectedUncryptedKey);
        if (this.selectedUncryptedKey) {
          // B -> B2
          console.log("B) clicked import old keys");
          console.log("B2) clicked as-is: overwrite existing stuff with given stuff and keep unencrypted okeys");
          const result = await this.sendSSVCommand(
            {
              command: "importSSVUnencryptedKeys",
              arguments: [this.ssvService.config.serviceID, this.selectedUncryptedKey],
            },
            true,
            true
          );
          console.log("X3 :: result", result);
          console.log("refreshing keys after import");
          await this.getKeys();
          // move to dashoard (last dialog)
          console.log("move to dashoard (last dialog)");
          this.ssvDashboardActive = true;
          this.pubkeyModalActive = false;
          this.dataLoading = false;
          this.lastStep = true;
          this.passGenerateEncryptKeyConfirmed = true;
          console.log("last step", this.lastStep);
        }
      }
    },
    copyHandler() {
      //let toCopy = "dummyyy value to test the copy btn";
      let toCopy = this.pubkey;
      navigator.clipboard
        .writeText(toCopy)
        .then(() => {
          this.cursorLocation = this.copiedPub;
        })
        .catch(() => {
          console.log(`can't copy public operator key`);
        });
    },
    getFilenameFromPath(filePath) {
      const parts = filePath.split(/[\\/]/);
      return parts[parts.length - 1];
    },
    getCurrentDateTimeString(now = new Date(), human = false) {
      //const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const humanString = now.toLocaleString("en-US", { timeZoneName: "short" });

      return human ? humanString : `${year}${month}${day}${hours}${minutes}${seconds}`;
    },
    ucWord(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    formatReadmeContent(str) {
      return str
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim();
    },
    async downloadBackupBttnOnClick() {
      console.log("download backup");
      if (this.isModernOperator) {
        return await this.downloadModernBackup();
      }
      return await this.downloadUnencryptedBackup();
    },
    async downloadUnencryptedBackup() {
      if (!this.isDownloading) {
        try {
          this.isDownloading = true;
          const now = new Date();

          // Create array of objects to download
          const downloadObjects = [];
          let pkFileName = "public_key.txt";
          downloadObjects.push({
            filename: pkFileName,
            content: this.pubkey,
          });
          let skFileName = "secret_key.txt";
          downloadObjects.push({
            filename: skFileName,
            content: this.secretkey,
          });
          let backupFileName = "";
          if (this.operatorData) {
            backupFileName =
              this.getCurrentDateTimeString(now) + `_ssv_unencrypted_operator_${this.operatorData.id}_${this.network}_backup.zip`;
            downloadObjects.push({
              filename: "readme.txt",
              content: this.formatReadmeContent(`
                This is a backup of your registered SSV Operator keys!
                -----------------------------------------------------------------
                Backup Date    : ${this.getCurrentDateTimeString(now, true)}
                Service-ID     : ${this.ssvService.config.serviceID}
                Network        : ${this.ucWord(this.network)}
                Operator Name  : ${this.operatorData.name}
                Operator ID    : ${this.operatorData.id}
                Public Key File: ${pkFileName}
                Secret Key File: ${skFileName}
                -----------------------------------------------------------------
                Important!
                ==========
                Keep this ZIP and all files included on a safe location!
                If you loose those files your are not able to restore your SSV Operator.
                The file "${pkFileName}" holds your SSV Public Key.
                The file "${skFileName}" holds your SSV Secret Key (also known as SSV Private Key).
              `),
            });
          } else if (this.apiUnavailable) {
            backupFileName = this.getCurrentDateTimeString(now) + `_ssv_unencrypted_operator_unavailable_${this.network}_backup.zip`;
            downloadObjects.push({
              filename: "readme.txt",
              content: this.formatReadmeContent(`
                This is a backup of your SSV Operator keys!
                -----------------------------------------------------------------
                Backup Date    : ${this.getCurrentDateTimeString(now, true)}
                Service-ID     : ${this.ssvService.config.serviceID}
                Network        : ${this.ucWord(this.network)}
                Operator Name  : N/A (SSV API unavailable)
                Operator ID    : N/A (SSV API unavailable)
                Public Key File: ${pkFileName}
                Secret Key File: ${skFileName}
                -----------------------------------------------------------------
                Important!
                ==========
                Keep this ZIP and all files included on a safe location!
                If you loose those files your are not able to restore your SSV Operator.
                The file "${pkFileName}" holds your SSV Public Key.
                The file "${skFileName}" holds your SSV Secret Key (also known as SSV Private Key).
              `),
            });
          } else {
            backupFileName = this.getCurrentDateTimeString() + `_ssv_unencrypted_operator_unregistered_${this.network}_backup.zip`;
            downloadObjects.push({
              filename: "readme.txt",
              content: this.formatReadmeContent(`
                This is a backup of your unregistered SSV Operator keys!
                -----------------------------------------------------------------
                Backup Date    : ${this.getCurrentDateTimeString(now, true)}
                Service-ID     : ${this.ssvService.config.serviceID}
                Network        : ${this.ucWord(this.network)}
                Operator Name  : N/A (Not registered yet)
                Operator ID    : N/A (Not registered yet)
                Public Key File: ${pkFileName}
                Secret Key File: ${skFileName}
                -----------------------------------------------------------------
                Important!
                ==========
                Keep this ZIP and all files included on a safe location!
                You have not yet registered an SSV Operator with these keys. However, if you decide to do this later and then lose these files, you will not be able to recover your SSV Operator. Therefore, keep them safe.
                The file "${pkFileName}" holds your SSV Public Key.
                The file "${skFileName}" holds your SSV Secret Key (also known as SSV Private Key).
              `),
            });
          }

          // Add all objects from array to zip file and show saveAs dialog to the user
          const zip = new JSZip();
          downloadObjects.forEach((item) => {
            zip.file(item.filename, item.content);
          });
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, backupFileName);
          });

          // Tell the backend that a backup was downloaded at least once
          await this.sendSSVCommand({
            command: "setSSVLastBackedPublicKey",
            arguments: [this.ssvService.config.serviceID, this.pubkey],
          });
        } catch (err) {
          console.log("Failed downloading backup: ", err);
        } finally {
          console.log("Successfully downloaded backup");
          this.isDownloading = false;
        }
      }
    },
    async downloadModernBackup() {
      if (!this.isDownloading) {
        try {
          this.isDownloading = true;
          const now = new Date();

          // Create array of objects to download
          const downloadObjects = [];
          let pkFileName = "public_key.txt";
          downloadObjects.push({
            filename: pkFileName, // "public_key.txt"
            content: this.pubkey,
          });
          let pwdFileName = this.getFilenameFromPath(this.ssvTotalConfig.passwordFilePath);
          downloadObjects.push({
            filename: pwdFileName, // "password"
            content: this.ssvTotalConfig.passwordFileData,
          });
          let keyFileName = this.getFilenameFromPath(this.ssvTotalConfig.privateKeyFilePath);
          let keyFileData = this.ssvTotalConfig.privateKeyFileData;
          if (typeof this.ssvTotalConfig.privateKeyFileData === "object" && this.ssvTotalConfig.privateKeyFileData !== null) {
            // SSV generated keystore uses "pubKey" since v1.3.3, previously it was "publicKey"
            // If we have both here then the backend attached "publicKey" for consistency -> remove it from the backup
            if (keyFileData?.publicKey && keyFileData?.pubKey) {
              delete keyFileData["publicKey"];
            }
            // Convert object to string for backup
            keyFileData = JSON.stringify(this.ssvTotalConfig.privateKeyFileData);
          }
          downloadObjects.push({
            filename: keyFileName, // "encrypted_private_key.json"
            content: keyFileData,
          });
          let backupFileName = "";
          if (this.operatorData) {
            backupFileName = this.getCurrentDateTimeString(now) + `_ssv_operator_${this.operatorData.id}_${this.network}_backup.zip`;
            downloadObjects.push({
              filename: "readme.txt",
              content: this.formatReadmeContent(`
                This is a backup of your registered SSV Operator keys!
                -----------------------------------------------------------------
                Backup Date    : ${this.getCurrentDateTimeString(now, true)}
                Service-ID     : ${this.ssvService.config.serviceID}
                Network        : ${this.ucWord(this.network)}
                Operator Name  : ${this.operatorData.name}
                Operator ID    : ${this.operatorData.id}
                Public Key File: ${pkFileName}
                KeyStore File  : ${keyFileName}
                Password File  : ${pwdFileName}
                -----------------------------------------------------------------
                Important!
                ==========
                Keep this ZIP and all files included on a safe location!
                If you loose those files your are not able to restore your SSV Operator.
                The file "${pkFileName}" holds your SSV Public Key.
                The file "${keyFileName}" is a KeyStore that holds (inter alia) your encrypted SSV Private Key.
                The file "${pwdFileName}" holds the password required by the SSV-node to decrypt your SSV Private Key.
              `),
            });
          } else if (this.apiUnavailable) {
            backupFileName = this.getCurrentDateTimeString(now) + `_ssv_unencrypted_operator_unavailable_${this.network}_backup.zip`;
            downloadObjects.push({
              filename: "readme.txt",
              content: this.formatReadmeContent(`
                This is a backup of your SSV Operator keys!
                -----------------------------------------------------------------
                Backup Date    : ${this.getCurrentDateTimeString(now, true)}
                Service-ID     : ${this.ssvService.config.serviceID}
                Network        : ${this.ucWord(this.network)}
                Operator Name  : N/A (SSV API unavailable)
                Operator ID    : N/A (SSV API unavailable)
                Public Key File: ${pkFileName}
                KeyStore File  : ${keyFileName}
                Password File  : ${pwdFileName}
                -----------------------------------------------------------------
                Important!
                ==========
                Keep this ZIP and all files included on a safe location!
                If you loose those files your are not able to restore your SSV Operator.
                The file "${pkFileName}" holds your SSV Public Key.
                The file "${keyFileName}" is a KeyStore that holds (inter alia) your encrypted SSV Private Key.
                The file "${pwdFileName}" holds the password required by the SSV-node to decrypt your SSV Private Key.
              `),
            });
          } else {
            backupFileName = this.getCurrentDateTimeString(now) + `_ssv_operator_unregistered_${this.network}_backup.zip`;
            downloadObjects.push({
              filename: "readme.txt",
              content: this.formatReadmeContent(`
                This is a backup of your unregistered SSV Operator keys!
                -----------------------------------------------------------------
                Backup Date    : ${this.getCurrentDateTimeString(now, true)}
                Service-ID     : ${this.ssvService.config.serviceID}
                Network        : ${this.ucWord(this.network)}
                Operator Name  : N/A (Not registered yet)
                Operator ID    : N/A (Not registered yet)
                Public Key File: ${pkFileName}
                KeyStore File  : ${keyFileName}
                Password File  : ${pwdFileName}
                -----------------------------------------------------------------
                Important!
                ==========
                Keep this ZIP and all files included on a safe location!
                You have not yet registered an SSV Operator with these keys. However, if you decide to do this later and then lose these files, you will not be able to recover your SSV Operator. Therefore, keep them safe.
                The file "${pkFileName}" holds your SSV Public Key.
                The file "${keyFileName}" is a KeyStore that holds (inter alia) your encrypted SSV Private Key.
                The file "${pwdFileName}" holds the password required by the SSV-node to decrypt your SSV Private Key.
              `),
            });
          }

          // Add all objects from array to zip file and show saveAs dialog to the user
          const zip = new JSZip();
          downloadObjects.forEach((item) => {
            zip.file(item.filename, item.content);
          });
          zip.generateAsync({ type: "blob" }).then(function (blob) {
            saveAs(blob, backupFileName);
          });

          // Tell the backend that a backup was downloaded at least once
          await this.sendSSVCommand({
            command: "setSSVLastBackedPublicKey",
            arguments: [this.ssvService.config.serviceID, this.pubkey],
          });
        } catch (err) {
          console.log("Failed downloading backup: ", err);
        } finally {
          console.log("Successfully downloaded backup");
          this.isDownloading = false;
        }
      }
    },
    async sendSSVCommand(obj, restart = false, loader = false, keeploader = false, minloaderms = 1000) {
      if (loader) this.dataLoading = true;
      try {
        if (typeof obj !== "object") {
          throw new Error(`Param 1 requires to be an object with keys "command" and "arguments"`);
        }
        let def = { command: "N/A", arguments: [] };
        obj = { ...def, ...obj };
        const result = await ControlService.forwardSSVCommand(obj);
        if (restart && this.ssvService?.state == "running") {
          await useRestartService(this.ssvService);
        }
        return result;
      } finally {
        if (loader) {
          if (minloaderms) await new Promise((r) => setTimeout(r, minloaderms));
          if (!keeploader) this.dataLoading = false;
        }
      }
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
