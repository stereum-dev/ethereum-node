<template>
  <div class="keys-parent">
    <div class="keys-table-box">
      <div class="keys-table">
        <div class="table-header" v-if="importValidatorKeyActive">
          <span id="name">{{ $t("displayValidator.pk") }}</span>
          <span id="service">{{ $t("displayValidator.service") }}</span>
          <span id="active">{{ $t("displayValidator.active") }}</span>
          <span id="state">{{ $t("displayValidator.state") }}</span>
          <span id="balance">{{ $t("displayValidator.balance") }}</span>
          <span id="option">{{ $t("displayValidator.option") }}</span>
        </div>
        <key-modal v-if="riskWarning" @hide-modal="hideWDialog">
          <div class="warning-container">
            <div class="icon-part">
              <img
                src="/img/icon/the-staking/stereum-error.png"
                alt="warning"
              />
            </div>
            <div class="top-message">
              <p>
                {{ $t("displayValidator.warningMessage") }}
              </p>
            </div>
            <div class="warning-alarm">
              <span>{{ $t("displayValidator.warningAlarm") }}</span>
            </div>
            <div class="warning-question">
              <span> {{ $t("displayValidator.warningQuestion") }}</span>
            </div>
            <div class="button-box">
              <div class="sure-button" @click="riskAccepted">
                <span>{{ $t("displayValidator.sure") }}</span>
              </div>
              <div class="cancel-button" @click="hideWDialog">
                <span>{{ $t("displayValidator.cancel") }}</span>
              </div>
            </div>
          </div>
        </key-modal>
        <key-modal v-if="bDialogVisible" @hide-modal="hideBDialog">
          <div class="title-box">
            <span>{{ $t("displayValidator.importKey") }}</span>
          </div>
          <div class="processImg" v-if="importIsProcessing">
            <img src="/img/icon/the-staking/validator-import.gif" alt="icon" />
          </div>
          <div class="import-message" v-if="importIsProcessing">
            <span>{{ $t("displayValidator.waitMessage") }}</span>
            <span>{{ $t("displayValidator.waitForImport") }}</span>
          </div>
          <div class="import-message" v-if="importIsDone">
            <p :class="importingErrorMessage">{{ message }}</p>
          </div>
          <div class="confirm-btn" v-if="importIsDone">
            <div class="confirm-box" @click="hideBDialog">
              <span>OK</span>
            </div>
          </div>
        </key-modal>
        <ImportSlashingModal
          v-if="ImportSlashingActive"
          @remove-modal="removeImportSlashingHandler"
          @import-slashing="setSlashingDB"
        />
        <div
          class="table-content"
          v-if="importValidatorKeyActive"
          :class="{ dropActive: isDragOver }"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="isDragOver = false"
          @dragover.prevent.stop="isDragOver = true"
          @dragenter.prevent.stop="isDragOver = true"
          @dragleave.prevent.stop="isDragOver = false"
          @drop.prevent.stop="dropFileHandler"
        >
          <div class="tableRow" v-for="(item, index) in keys" :key="index">
            <div class="rowContent">
              <span class="circle"></span>
              <span class="category" v-if="item.displayName">{{
                item.displayName
              }}</span>

              <span class="category" @click="logEvent" v-else
                >{{ item.key.substring(0, 20) }}...{{
                  item.key.substring(item.key.length - 6, item.key.length)
                }}</span
              >
              <img class="service-icon" :src="item.icon" alt="icon" />
              <span class="since">{{ item.activeSince }}</span>
              <img
                class="state-icon"
                :src="stateIconHandler(item)"
                alt="icon"
              />
              <span class="balance">{{ item.balance }}</span>
              <div class="option-box">
                <div class="grafiti-box">
                  <img
                    :class="{ disabled: disable }"
                    @click="grafitiDisplayHandler(item)"
                    class="grafiti-icon"
                    src="../../../../public/img/icon/the-staking/option-graffiti.png"
                    alt="icon"
                  />
                </div>
                <div class="copy-box">
                  <img
                    @click="copyHandler(item)"
                    class="copy-icon"
                    src="../../../../public/img/icon/the-staking/copy6.png"
                    alt="icon"
                  />
                </div>
                <div class="rename-box">
                  <img
                    @click="renameDisplayHandler(item)"
                    class="rename-icon"
                    src="../../../../public/img/icon/the-staking/rename.png"
                    alt="icon"
                  />
                </div>
                <div class="remove-box">
                  <img
                    @click="removeModalDisplay(item)"
                    class="remove-icon"
                    src="../../../../public/img/icon/the-staking/option-remove.png"
                    alt="icon"
                  />
                </div>
                <div class="withdraw-box">
                  <img
                    :class="{ disabled: disable }"
                    @click="passwordBoxSingleExitChain(item)"
                    class="exit-icon"
                    src="../../../../public/img/icon/the-staking/withdraw.png"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
            <RenameValidator
              v-if="item.isRenameActive"
              @change-name="renameValidatorHandler"
              @close-rename="closeRenameHandler"
              :item="item"
            />
            <GrafitiValidator
              v-if="item.isGrafitiBoxActive"
              @confirm-change="grafitiConfirmHandler(item)"
            />
            <ExitValidator
              v-if="item.isExitBoxActive"
              @confirm-password="confirmPasswordSingleExitChain(item)"
            />
            <ExitValidatorsModal
              v-if="item.displayExitModal || exitChainModalForMultiValidators"
              :item="item"
              @exit-modal="closeExitChainModal(item)"
              @confirm-btn="confirmExitChainForValidators(item)"
            />
            <RemoveValidator
              v-if="
                item.toRemove ||
                exitChainForMultiValidatorsActive ||
                removeForMultiValidatorsActive
              "
            />
            <RemoveSingleModal
              v-if="item.isRemoveBoxActive"
              :item="item"
              @remove-modal="
                item.isRemoveBoxActive = false;
                item.toRemove = false;
              "
              @delete-key="validatorRemoveConfirm"
            />
          </div>
        </div>
        <div
          class="table-header"
          v-if="
            enterPasswordBox ||
            selectValidatorServiceForKey ||
            ImportSlashingActive
          "
        >
          <span id="pubkey_name">FILE NAME</span>
          <span id="validator-service">Service</span>
        </div>
        <div
          class="table-content"
          v-if="
            enterPasswordBox ||
            selectValidatorServiceForKey ||
            ImportSlashingActive
          "
        >
          <div
            class="key-tableRow"
            v-for="(item, index) in keyFiles"
            :key="index"
          >
            <span class="key-circle"></span>
            <span class="file-name">{{ item.name }}</span>
            <div class="chosenService" v-if="enterPasswordBox">
              <img :src="selectedService.icon" alt="icon" />
            </div>
            <div @click="removeKeyHandler(item)" class="key-remove-icon">
              <img
                src="../../../../public/img/icon/task-manager-icons/close3.png"
                alt="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Small search icons -->
    <SearchOptions
      :isPubkeyVisible="isPubkeyVisible"
      @toggle-pubkey="togglePubkeyView"
    />
    <!-- Click box to import key -->
    <InsertValidator
      v-if="insertKeyBoxActive"
      @open-upload="openUploadHandler"
      @upload-file="uploadFileHandler"
      :services="installedServices"
    />
    <!-- select specific validator service -->
    <SelectService
      v-if="selectValidatorServiceForKey"
      @select-service="checkSelectedService"
    />
    <!-- Password box for validator keys -->
    <EnterPassword
      v-if="enterPasswordBox"
      :activePassword="passwordInputActive"
      @confirm-password="confirmPasswordHandler"
      @import-key="importKey"
    />
    <!-- Fee Recipient box for validator keys -->
    <FeeRecipient
      v-if="feeRecipientBoxActive"
      @enter-fee="enterFeeHandler"
      :activeFee="feeInputActive"
      @confirm-btn="confirmFeeRecipientAddress"
    />
    <!-- Grafiti box for validator keys -->
    <GrafitiMultipleValidators
      v-if="grafitiForMultiValidatorsActive"
      @confirm-btn="confirmEnteredGrafiti"
    />
    <!-- Remove Box for validator keys -->
    <RemoveMultipleValidators
      v-if="removeForMultiValidatorsActive"
      @remove-modal="
        removeForMultiValidatorsActive = false;
        this.keys.forEach((k) => (k.toRemove = false));
      "
      @delete-key="confirmRemoveAllValidators"
    />

    <!-- Exit box for validator keys -->
    <ExitMultipleValidators
      v-if="exitChainForMultiValidatorsActive"
      @confirm-btn="confirmPasswordMultiExitChain"
    />
    <DisabledStaking v-if="stakingIsDisabled" />
  </div>
</template>
<script>
import DropZone from "./DropZone.vue";
import KeyModal from "./KeyModal.vue";
import GrafitiValidator from "./GrafitiValidator.vue";
import RenameValidator from "./RenameValidator.vue";
import ExitValidator from "./ExitValidator.vue";
import ExitValidatorsModal from "./ExitValidatorsModal.vue";
import RemoveValidator from "./RemoveValidatore.vue";
import RemoveSingleModal from "./RemoveSingleModal.vue";
import SearchOptions from "./SearchOptions.vue";
import EnterPassword from "./EnterPassword.vue";
import SelectService from "./SelectService.vue";
import FeeRecipient from "./FeeRecipient.vue";
import InsertValidator from "./InsertValidator.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";
import axios from "axios";
import GrafitiMultipleValidators from "./GrafitiMultipleValidators.vue";
import RemoveMultipleValidators from "./RemoveMultipleValidators.vue";
import ExitMultipleValidators from "./ExitMultipleValidators.vue";
import ImportSlashingModal from "./ImportSlashingModal.vue";
import DisabledStaking from "./DisabledStaking.vue";
export default {
  components: {
    DropZone,
    KeyModal,
    FeeRecipient,
    GrafitiValidator,
    RenameValidator,
    ExitValidator,
    RemoveValidator,
    RemoveSingleModal,
    ExitValidatorsModal,
    SearchOptions,
    InsertValidator,
    EnterPassword,
    GrafitiMultipleValidators,
    RemoveMultipleValidators,
    ExitMultipleValidators,
    SelectService,
    ImportSlashingModal,
    DisabledStaking,
  },
  props: ["button"],
  data() {
    return {
      riskWarning: false,
      stakingIsDisabled: false,
      disable: true,
      message: "",
      messageIsError: false,
      bDialogVisible: false,
      isDragOver: false,
      keyFiles: [],
      importValidatorKeyActive: true,
      insertKeyBoxActive: true,
      selectValidatorServiceForKey: false,
      enterPasswordBox: false,
      passwordInputActive: false,
      feeRecipientBoxActive: false,
      feeInputActive: false,
      importIsProcessing: true,
      importIsDone: false,
      grafitiForMultiValidatorsActive: false,
      exitChainForMultiValidatorsActive: false,
      exitChainModalForMultiValidators: false,
      removeForMultiValidatorsActive: false,
      downloadForMultiValidatorsActive: false,
      password: this.enteredPassword,
      fileInput: "",
      displayRemoveValidatorModal: false,
      activeStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Active.png",
      slashedStatusIcon:
        "/img/icon/the-staking/Validatorkey_Status_Slashed.png",
      depositStatusIcon:
        "/img/icon/the-staking/Validatorkey_Status_Deposit.png",
      offlineStatusIcon:
        "/img/icon/the-staking/Validatorkey_Status_Offline.png",
      pendingStatusIcon:
        "/img/icon/the-staking/Validatorkey_Status_Pending_alternative.png",
      exitedStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Exited.png",
      apiProblems: "/img/icon/the-staking/State_Icon.png",
      apiLoading: "/img/icon/task-manager-icons/turning_circle.gif",
      selectedService: {},
      ImportSlashingActive: false,
      slashingDB: "",
      isPubkeyVisible: false,
    };
  },
  watch: {
    button: {
      deep: true,
      handler(val) {
        if (val.name === "grafiti") {
          this.insertKeyBoxActive = false;
          this.enterPasswordBox = false;
          this.exitChainForMultiValidatorsActive = false;
          this.removeForMultiValidatorsActive = false;
          this.grafitiForMultiValidatorsActive = true;
        } else if (val.name === "remove") {
          this.exitChainForMultiValidatorsActive = false;
          this.grafitiForMultiValidatorsActive = false;
          this.removeForMultiValidatorsActive = true;
          this.keys.forEach((k) => (k.toRemove = true));
        } else if (val.name === "withdraw") {
          this.insertKeyBoxActive = false;
          this.enterPasswordBox = false;
          this.grafitiForMultiValidatorsActive = false;
          this.removeForMultiValidatorsActive = false;
          this.exitChainForMultiValidatorsActive = true;
          this.keys.forEach((k) => (k.toRemove = true));
        }
      },
    },
    isPubkeyVisible: {
      deep: true,
      handler(val) {
        if (val) {
          this.keys.map((k) => (k.displayName = ""));
        } else {
          this.listKeys();
        }
      },
    },
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      network: "network",
    }),
    ...mapWritableState(useStakingStore, {
      totalBalance: "totalBalance",
      keys: "keys",
      forceRefresh: "forceRefresh",
    }),
    importingErrorMessage() {
      return {
        "text-danger": this.message.includes("Failed"),
      };
    },
  },
  beforeMount() {
    this.keys = this.keys.map((item) => {
      return {
        isGrafitiBoxActive: false,
        isRemoveBoxActive: false,
        isRemoveModalActive: false,
        isExitBoxActive: false,
        displayExitModal: false,
        isDownloadModalActive: false,
        isRenameActive: false,
        displayName: "",
        ...item,
      };
    });
  },
  mounted() {
    this.checkValidatorClientsExist();
    this.listKeys();
    this.polling = setInterval(this.updateValidatorStats, 384000); //refresh validator account stats
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  updated() {
    this.checkKeyExists();
  },

  methods: {
    checkValidatorClientsExist() {
      const clients = this.installedServices.filter(
        (service) =>
          service.category === "validator" && service.state === "running"
      );
      if (clients.length > 0) {
        this.stakingIsDisabled = false;
      } else {
        this.stakingIsDisabled = true;
      }
    },
    logEvent(event) {
      let url = event.target.baseURI;
      fetch(url)
        .then((res) => res.json())
        .then((out) => {
          console.log("Checkout this JSON! ", out);
        })
        .catch((err) => {
          throw err;
        });
    },
    grafitiDisplayHandler(el) {
      el.isGrafitiBoxActive = true;
      el.isRemoveModalActive = true;
    },

    grafitiConfirmHandler(el) {
      el.isGrafitiBoxActive = false;
    },
    renameDisplayHandler(el) {
      el.isRenameActive = true;
    },
    async renameValidatorHandler(el, name) {
      el.isRenameActive = false;
      el.displayName = name;
      const keys = await ControlService.readKeys();
      if (keys) {
        keys[el.key] = name;
        await ControlService.writeKeys(keys);
      } else {
        console.log("Couldn't read KeyFile!");
      }
    },
    togglePubkeyView() {
      this.isPubkeyVisible = !this.isPubkeyVisible;
    },
    closeRenameHandler(el) {
      el.isRenameActive = false;
    },
    removeModalDisplay(el) {
      el.toRemove = true;
      el.isRemoveBoxActive = true;
    },
    async validatorRemoveConfirm(item, picked) {
      item.isRemoveBoxActive = false;
      item.isDownloadModalActive = true;
      const returnVal = await this.deleteValidators(
        item.validatorID,
        [item.key],
        picked
      );
      if (picked === "yes") {
        this.downloadFile(returnVal);
      }
    },
    downloadFile(data) {
      let json = JSON.stringify(data);
      let blob = new Blob([json], { type: "application/json" });
      let url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "slashingDB");
      link.click();
      window.URL.revokeObjectURL(url);
    },
    confirmPasswordSingleExitChain(el) {
      el.displayExitModal = true;
    },
    confirmPasswordMultiExitChain() {
      this.exitChainForMultiValidatorsActive = false;
      this.exitChainModalForMultiValidators = true;
    },
    confirmExitChainForValidators(el) {
      if (el.displayExitModal || el.isExitBoxActive) {
        el.displayExitModal = false;
        el.isExitBoxActive = false;
      } else {
        this.exitChainModalForMultiValidators = false;
      }
      this.insertKeyBoxActive = true;
    },
    passwordBoxSingleExitChain(el) {
      el.isExitBoxActive = true;
    },
    closeExitChainModal(el) {
      if (el.displayExitModal || el.isExitBoxActive) {
        el.displayExitModal = false;
        el.isExitBoxActive = false;
        this.insertKeyBoxActive = true;
      } else {
        this.exitChainModalForMultiValidators = false;
        this.insertKeyBoxActive = true;
      }
    },
    stateIconHandler(item) {
      switch (item.status) {
        case "active_online":
          return this.activeStatusIcon;
        case "active":
          return this.activeStatusIcon;
        case "active_offline":
          return this.offlineStatusIcon;
        case "slashed":
          return this.slashedStatusIcon;
        case "pending":
          return this.pendingStatusIcon;
        case "exited":
          return this.exitedStatusIcon;
        case "withdrawal":
          return this.exitedStatusIcon;
        case "NA":
          return this.apiProblems;
        case "loading":
          return this.apiLoading;
        default:
          return this.depositStatusIcon;
      }
    },
    async deleteValidators(serviceID, keys, picked) {
      const result = await ControlService.deleteValidators({
        serviceID: serviceID,
        keys: keys,
        picked: picked === "yes" ? true : false,
      });
      this.forceRefresh = true;
      await this.listKeys();
      return result;
    },
    listKeys: async function () {
      let keyStats = [];
      let clients = this.installedServices.filter(
        (s) => s.category == "validator"
      );
      if (clients && clients.length > 0 && this.network != "") {
        for (let client of clients) {
          //if there is already a list of keys ()
          if (
            (client.config.keys === undefined ||
              client.config.keys.length === 0 ||
              this.forceRefresh) &&
            client.state === "running"
          ) {
            //refresh validaotr list
            let result = await ControlService.listValidators(
              client.config.serviceID
            );

            //update service config (pinia)
            client.config.keys = result.data
              ? result.data.map((e) => e.validating_pubkey)
              : [];

            //update service datasets in Pinia store
            this.installedServices = this.installedServices.map((service) => {
              if (service.id === client.id) {
                return client;
              }
              return service;
            });
          }
          if (client.config.keys) {
            keyStats = keyStats.concat(
              client.config.keys.map((key) => {
                return {
                  key: key,
                  validatorID: client.config.serviceID,
                  icon: client.icon,
                  activeSince: "-",
                  status: "loading",
                  balance: "-",
                };
              })
            );
          }
        }
        this.forceRefresh = false;
        let alias = await ControlService.readKeys();
        this.keys = keyStats.map((key) => {
          return {
            ...key,
            displayName: alias[key.key],
            showGrafitiText: false,
            showCopyText: false,
            showRemoveText: false,
            showExitText: false,
          };
        });
        if (this.keys && this.keys.length > 0) this.updateValidatorStats();
      }
    },
    async updateValidatorStats() {
      let totalBalance = 0;
      let data = [];
      let networkURls = {
        mainnet: "https://mainnet.beaconcha.in/api/v1",
        testnet: "https://goerli.beaconcha.in/api/v1",
        gnosis: "https://beacon.gnosischain.com/api/v1",
      };
      try {
        data = await ControlService.getValidatorState(
          this.keys.map((key) => key.key)
        );
        if (!data || data.length == 0) {
          data = [];
          let latestEpochResponse = await axios.get(
            networkURls[this.network] + "/epoch/latest"
          );
          var latestEpoch = latestEpochResponse.data.data.epoch;
          let buffer = this.keys.map((key) => key.key);
          const chunkSize = 50;
          for (let i = 0; i < buffer.length; i += chunkSize) {
            //split validator accounts into chunks of 50 (api url limit)
            const chunk = buffer.slice(i, i + chunkSize);
            let response = await axios.get(
              networkURls[this.network] + encodeURIComponent(chunk.join())
            );
            if (response.data.data) data = data.concat(response.data.data); //merge all gathered stats in one array
          }
        }
      } catch (err) {
        console.log("Couldn't fetch validator stats:\n", err);
        this.keys.forEach((key) => {
          key.status = "NA";
        });
        return;
      }

      this.keys.forEach((key) => {
        let info = data.find((k) => k.pubkey === key.key);
        if (info) {
          let d = new Date();
          let now = new Date();
          d.setMilliseconds(
            d.getMilliseconds() -
              (latestEpoch
                ? latestEpoch
                : info.latestEpoch - info.activationepoch) *
                384000
          );

          key.status = info.status;
          key.balance = info.balance / 1000000000;
          key.activeSince =
            ((now.getTime() - d.getTime()) / 86400000).toFixed(1) + " Days";
          totalBalance += key.balance;
        } else {
          key.status = "deposit";
          key.balance = "-";
        }
      });
      this.totalBalance = totalBalance;
    },
    importKey: async function (val) {
      this.bDialogVisible = true;
      this.importIsProcessing = true;
      this.importIsDone = false;
      this.password = val;
      this.message = await ControlService.importKey({
        files: this.keyFiles,
        password: this.password,
        service: this.selectedService.config.serviceID,
        slashingDB: this.slashingDB,
      });
      this.slashingDB = "";
      this.forceRefresh = true;
      this.keyFiles = [];
      await this.listKeys();
      this.importIsProcessing = false;
      this.importIsDone = true;
      this.password = "";
      this.importValidatorKeyActive = true;
      this.insertKeyBoxActive = true;
      this.enterPasswordBox = false;
      this.passwordInputActive = false;
      //this.feeRecipientBoxActive = true;
    },
    //FEE RECIPIENT
    confirmFeeRecipientAddress() {
      this.importValidatorKeyActive = true;
      this.enterPasswordBox = false;
      this.passwordInputActive = false;
      this.feeRecipientBoxActive = false;
      this.insertKeyBoxActive = true;
    },
    enterFeeHandler() {
      this.feeInputActive = true;
    },
    //Importing key
    uploadFileHandler(event) {
      let uploadedFiles = event.target.files;
      if (
        !this.keyFiles.includes(uploadedFiles[0]["name"]) &&
        uploadedFiles[0]["type"] === "application/json"
      ) {
        this.keyFiles.push(...uploadedFiles);
        this.importValidatorKeyActive = false;
        this.insertKeyBoxActive = false;
        this.selectValidatorServiceForKey = true;
        this.isDragOver = false;
      }
    },
    dropFileHandler(event) {
      let validator = this.installedServices.filter((s) =>
        s.service.includes("Validator")
      );
      if (validator && validator.map((e) => e.state).includes("running")) {
        let droppedFiles = event.dataTransfer.files;
        if (droppedFiles[0]["type"] === "application/json") {
          this.keyFiles.push(...droppedFiles);
          this.importValidatorKeyActive = false;
          this.insertKeyBoxActive = false;
          this.selectValidatorServiceForKey = true;
        }
      }
      this.isDragOver = false;
    },
    removeKeyHandler(item) {
      this.keyFiles = this.keyFiles.filter((el) => el.name != item.name);
      if (this.keyFiles.length === 0) {
        this.selectValidatorServiceForKey = false;
        this.enterPasswordBox = false;
        this.importValidatorKeyActive = true;
        this.insertKeyBoxActive = true;
      }
    },
    openUploadHandler() {
      this.$refs.fileInput.click();
    },
    //Confirm buttons functions
    confirmPasswordHandler() {
      this.passwordInputActive = true;
    },

    checkKeyExists() {
      if (this.keyFiles.length <= 0) {
        this.importValidatorKeyActive = true;
        this.enterPasswordBox = false;
      }
    },
    //Importing key modal
    hideBDialog() {
      this.bDialogVisible = false;
    },
    hideWDialog() {
      this.riskWarning = false;
    },
    riskAccepted() {
      this.riskWarning = false;
      this.bDialogVisible = true;
    },
    async confirmEnteredGrafiti(graffiti) {
      await ControlService.setGraffitis(graffiti);
      this.grafitiForMultiValidatorsActive = false;
      this.insertKeyBoxActive = true;
    },

    async confirmRemoveAllValidators(picked) {
      let keys = this.keys.map((key) => key.key);
      let id = "";
      let changed = 0;
      this.keys.forEach((key) => {
        if (id != key.validatorID) {
          id = key.validatorID;
          changed++;
        }
      });
      this.removeForMultiValidatorsActive = false;
      this.downloadForMultiValidatorsActive = true;
      if (changed === 1 && id) {
        const returnVal = await this.deleteValidators(id, keys, picked);
        if (picked === "yes") {
          this.downloadFile(returnVal);
        }
      } else if (changed === 0) {
        console.log("Nothing to delete!");
      } else {
        console.log("Multiple validator services are not supported yet!");
      }
    },
    checkSelectedService(service) {
      this.selectedService = service;
      this.selectValidatorServiceForKey = false;
      this.ImportSlashingActive = true;
    },

    copyHandler(item) {
      let toCopy = item.key;
      navigator.clipboard
        .writeText(toCopy)
        .then(() => {
          console.log("copied!");
        })
        .catch(() => {
          console.log(`can't copy`);
        });
    },
    removeImportSlashingHandler() {
      this.ImportSlashingActive = false;
      this.keyFiles = [];
      this.insertKeyBoxActive = true;
    },
    setSlashingDB(slashingDB, picked) {
      if (picked) {
        this.slashingDB = slashingDB;
      } else {
        this.slashingDB = "";
      }
      this.ImportSlashingActive = false;
      this.enterPasswordBox = true;
    },
  },
};
</script>
<style scoped>
.warning-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.icon-part {
  width: 40%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-part img {
  width: 55%;
}
.top-message {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 92%;
  height: 18%;
  color: #eee;
}
.warning-question {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 15%;
  font-size: 100%;
  font-weight: 800;
  color: #eee;
}
.warning-alarm {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
  width: 80%;
  background-color: #b22020;
  color: #eee;
  font-weight: 700;
  animation: blink 1s linear infinite;
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

.button-box {
  display: flex;
  height: 20%;
  width: 100%;
  position: relative;
  justify-content: space-around;
  align-items: center;
}
.keys-parent {
  width: 100%;
  height: 100%;
  margin-left: 5px;
  grid-column: 1/10;
  grid-row: 1/4;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 86% 7% 7%;
  z-index: 5;
}

.keys-table-box {
  grid-column: 1/13;
  grid-row: 1/3;
  width: 99%;
  height: 100%;
  margin: 10px 10px 0 0;
  border: 4px solid #bfbfbf;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sure-button {
  display: flex;
  width: 30%;
  height: 50%;
  background-color: #b22020;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-weight: 700;
  color: #eee;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 1px 1px 5px 0 #171610;
}
.sure-button:active {
  transform: scale(0.9);
  box-shadow: none;
}
.cancel-button {
  display: flex;
  width: 30%;
  height: 50%;
  border: 2px solid #eee;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-weight: 700;
  color: #eee;
  border-radius: 10px;
  cursor: pointer;
}
.cancel-button:hover {
  background-color: blue;
  border: none;
  box-shadow: 1px 1px 5px 0 #171610;
}
.cancel-button:active {
  transform: scale(0.9);
  box-shadow: none;
}
.keys-table {
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;
}

.dropActive {
  width: 100%;
  height: 92%;
  background-color: rgb(44, 151, 128);
  opacity: 0.2;
  border-radius: 20px;
}

.table-content {
  width: 100%;
  height: 86%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
}
remove-validator {
  z-index: 10000;
}
.tableRow {
  width: 99%;
  height: 30px;
  margin: 5px auto 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.tableRow .rowContent {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 3% 30% 7% 14% 6% 10% 30%;
  background-color: rgb(89, 89, 89);
  border-radius: 30px;
  padding: 1px;
  position: relative;
  box-sizing: border-box;
  z-index: 3;
}

.tableRow span {
  align-self: center;
  width: max-content;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  overflow: hidden;
  box-sizing: border-box;
}

.tableRow .circle {
  grid-column: 1;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background-color: #bebebe;
  margin: 0 5px;
  align-self: center;
}

.tableRow .category {
  width: 100%;
  grid-column: 2;
  font-size: 0.8rem;
  font-weight: 600;
  align-self: center;
  margin-left: 5px;
  color: #d7d7d7;
}

.tableRow .service-icon {
  width: 20px;
  grid-column: 3;
  justify-self: center;
  align-self: center;
}

.tableRow .since {
  grid-column: 4;
  font-size: 10px;
  justify-self: center;
  align-self: center;
}

.tableRow .state-icon {
  width: 24px;
  grid-column: 5;
  justify-self: center;
  align-self: center;
}

.tableRow .balance {
  grid-column: 6;
  justify-self: center;
  align-self: center;
}

.option-box {
  grid-column: 7;
  width: 90%;
  height: 95%;
  justify-self: center;
  align-self: center;
  border: 2px solid #bfbfbf;
  background-color: black;
  border-radius: 30px;
  position: absolute;
  right: 1px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
}

.option-box img {
  width: 17px;
  height: 18px;
  margin: 0 auto;
  cursor: pointer;
}

.option-box .copy-icon {
  width: 20px;
  height: 20px;
  margin: 0 auto;
  cursor: pointer;
}

.option-box img:hover,
.option-box .copy-icon:hover {
  transform: scale(1.1);
}

.option-box img:active,
.option-box .copy-icon:active {
  border: none;
  transform: scale(1);
}

.option-box .copy-box {
  width: max-content;
  height: 100%;
  grid-column: 1/2;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.option-box .grafiti-box {
  width: max-content;
  height: 100%;
  margin: 0 auto;
  grid-column: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.option-box .rename-box {
  width: max-content;
  height: 100%;
  margin: 0 auto;
  grid-column: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.rename-box img {
  width: 20px;
  height: 20px;
  margin: 0 auto;
  cursor: pointer;
}

.option-box .remove-box {
  width: max-content;
  height: 100%;
  margin: 0 auto;
  grid-column: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.option-box .withdraw-box {
  width: max-content;
  height: 100%;
  margin: 0 auto;
  grid-column: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.table-header {
  width: 100%;
  height: 30px;
  border-bottom: 7px solid #bfbfbf;
  display: grid;
  grid-template-columns: 3% 17% 13% 8% 13% 6% 10% 30%;
}
.table-header #pubkey_name {
  grid-column: 3;
}
.table-header #validator-service {
  grid-column: 8;
  justify-self: flex-start;
}
.table-header span {
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.table-header #name {
  grid-column: 2;
  text-transform: uppercase;
}

.table-header #service {
  grid-column: 4;
}

.table-header #active {
  grid-column: 5;
}

.table-header #state {
  grid-column: 6;
}

.table-header #balance {
  grid-column: 7;
}

.table-header #option {
  grid-column: 8;
}

.key-tableRow {
  width: 99%;
  height: 30px;
  margin: 5px auto 0 auto;
  display: grid;
  grid-template-columns: 4% 64% 28% 4%;
  grid-template-rows: 100%;
  background-color: rgb(89, 89, 89);
  border-radius: 30px;
  padding: 1px;
}

.key-tableRow .file-name {
  grid-column: 2/3;
  width: 100%;
  height: 95%;
  color: #fff !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  justify-self: center;
  align-self: center;
}

.key-tableRow .chosenService {
  grid-column: 3/4;
  width: 50%;
  height: 100%;
  display: flex;
  justify-self: flex-start;
  align-self: center;
  justify-self: flex-start;
  align-self: center;
}
.key-tableRow .chosenService img {
  width: 23%;
  height: 80%;
  margin-left: 22px;
  align-self: center;
}
.key-tableRow .key-remove-icon {
  grid-column: 4/5;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  border: 1px solid #4a4a4a !important;
  border-radius: 50px !important;
  width: 80% !important;
  height: 80% !important;
  padding: 1px;
  background-color: #343434;
  justify-self: center;
  align-self: center;
}

.key-tableRow .key-remove-icon img {
  width: 60% !important;
  height: 60% !important;
}

.key-tableRow .key-circle {
  grid-column: 1/2;
  width: 20px !important;
  height: 20px !important;
  border-radius: 50% !important;
  background-color: #fff !important;
  justify-self: center;
  align-self: center;
}

.title-box {
  width: 100%;
  height: 27%;
  background-color: rgb(55, 107, 102);
  border-radius: 75px 75px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title-box span {
  color: rgb(162, 162, 162);
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
}

.processImg {
  width: 80%;
  height: 30%;
  margin: 0 auto;
  position: relative;
  border-bottom: 1px solid gray;
}

.processImg img {
  width: 80px;
  height: 55px;
  position: absolute;
  animation: move 5s linear infinite;
}

@keyframes move {
  0% {
    left: 0%;
    bottom: -3px;
  }

  25% {
    left: 20%;
    bottom: -3px;
  }

  50% {
    left: 40%;
    bottom: -3px;
  }

  75% {
    left: 62%;
    bottom: -3px;
  }

  100% {
    left: 85%;
    bottom: -3px;
  }
}

.import-message {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.import-message span {
  width: 90%;
  height: 90%;
  margin: 0 auto;
  color: rgb(156, 156, 156);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  text-overflow: clip;
  word-wrap: break-word;
  text-align: center;
}
.import-message p {
  width: 85%;
  color: rgb(211, 211, 211);
  background-color: rgb(47, 51, 55);
  border: 1px solid rgb(211, 211, 211);
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 1rem;
  font-weight: 500;
  word-break: break-all;
  text-align: left;
  white-space: pre-wrap;
  overflow: scroll;
  font-family: "Courier New";
}

.text-danger {
  color: rgb(219, 77, 77) !important;
}

.confirm-btn {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.confirm-box {
  width: 50%;
  height: 45%;
  border-radius: 10px;
  border: 1px solid #8f8f8f;
  background-color: #8f8f8f;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.confirm-box:hover {
  border: 1px solid #d3d3d3;
  transition-duration: 100ms;
}

.confirm-box:active {
  transform: scale(0.98);
  box-shadow: none;
  transition-duration: 100ms;
}

.table-content::-webkit-scrollbar {
  width: 6px;
}

.table-content::-webkit-scrollbar-thumb {
  background-color: rgb(60, 152, 140);
  border-radius: 6px;
  border: 2px solid black;
  cursor: pointer;
}
.disabled {
  pointer-events: none;
  opacity: 0.3;
}
</style>
