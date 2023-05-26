<template>
  <div class="keys-parent">
    <div class="keys-table-box">
      <div class="keys-table">
        <div v-if="importValidatorKeyActive" class="table-header">
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
              <img src="/img/icon/the-staking/stereum-error.png" alt="warning" />
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
          <div :class="{ 'bg-blue': exitInfo }" class="title-box">
            <span>{{
              importIsProcessing === true || importIsDone === true ? $t("displayValidator.importKey") : ""
            }}</span>
            <span v-if="exitInfo">withdraw Logs </span>
          </div>
          <div v-if="importIsProcessing" class="processImg">
            <img src="/img/icon/the-staking/validator-import.gif" alt="icon" />
          </div>
          <div v-if="importIsProcessing" class="import-message">
            <span>{{ $t("displayValidator.waitMessage") }}</span>
            <span>{{ $t("displayValidator.waitForImport") }}</span>
          </div>

          <!-- start of new exit modal -->

          <div v-if="exitInfo" class="import-message">
            <p :class="importingErrorMessage">Status:{{ exitValidatorResponse.rc }}</p>
            <p v-if="exitValidatorResponse.stdout !== ''" :class="importingErrorMessage">
              <span> Output:</span><br />
              {{ exitValidatorResponse.stdout }}
            </p>
            <p v-if="exitValidatorResponse.stderr !== ''" :class="importingErrorMessage">
              <span> Error:</span><br />
              {{ exitValidatorResponse.stderr }}
            </p>
          </div>
          <div v-if="exitInfo" class="confirm-btn">
            <div class="confirm-box" @click="hideBDialog">
              <span>Close</span>
            </div>
          </div>

          <!-- end of new exit modal -->

          <div v-if="importIsDone" class="import-message">
            <p :class="importingErrorMessage">{{ message }}</p>
          </div>
          <div v-if="importIsDone" class="confirm-btn">
            <div class="confirm-box" @click="hideBDialog">
              <span>Close</span>
            </div>
          </div>
        </key-modal>
        <ImportSlashingModal
          v-if="ImportSlashingActive"
          @remove-modal="removeImportSlashingHandler"
          @import-slashing="setSlashingDB"
        />
        <div
          v-if="importValidatorKeyActive"
          class="table-content"
          :class="{ dropActive: isDragOver }"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="isDragOver = false"
          @dragover.prevent.stop="isDragOver = true"
          @dragenter.prevent.stop="isDragOver = true"
          @dragleave.prevent.stop="isDragOver = false"
          @drop.prevent.stop="dropFileHandler"
        >
          <div v-for="(item, index) in filteredKey" :key="index" class="tableRow">
            <div class="rowContent">
              <div class="circle"><img :src="keyIconPicker" alt="keyIcon" /></div>
              <span v-if="item.displayName" class="category">{{ item.displayName }}</span>

              <span v-else class="category" @click="logEvent"
                >{{ item.key.substring(0, 20) }}...{{ item.key.substring(item.key.length - 6, item.key.length) }}</span
              >
              <img class="service-icon" :src="item.icon" alt="icon" />
              <span class="since">{{ item.activeSince }}</span>
              <img class="state-icon" :src="stateIconHandler(item)" alt="icon" />
              <span class="balance">{{ item.balance }}</span>
              <div class="option-box">
                <div class="grafiti-box">
                  <img
                    :class="{ disabled: disable }"
                    class="grafiti-icon"
                    src="../../../../public/img/icon/the-staking/option-graffiti.png"
                    alt="icon"
                    @click="grafitiDisplayHandler(item)"
                  />
                </div>
                <div class="copy-box">
                  <img
                    class="copy-icon"
                    src="../../../../public/img/icon/the-staking/copy6.png"
                    alt="icon"
                    @click="copyHandler(item)"
                  />
                </div>
                <div class="rename-box">
                  <img
                    class="rename-icon"
                    src="../../../../public/img/icon/the-staking/rename.png"
                    alt="icon"
                    @click="renameDisplayHandler(item)"
                  />
                </div>
                <div class="remove-box">
                  <img
                    class="remove-icon"
                    src="../../../../public/img/icon/the-staking/option-remove.png"
                    alt="icon"
                    @click="removeModalDisplay(item)"
                  />
                </div>
                <div
                  class="withdraw-box"
                  :class="{ disabled: ['goerli', 'mainnet', 'sepolia'].indexOf(currentNetwork.network) === -1 }"
                >
                  <img
                    class="exit-icon"
                    src="../../../../public/img/icon/the-staking/withdraw.png"
                    alt="icon"
                    @click="passwordBoxSingleExitChain(item)"
                  />
                </div>
              </div>
            </div>
            <RenameValidator
              v-if="item.isRenameActive"
              :item="item"
              @change-name="renameValidatorHandler"
              @close-rename="closeRenameHandler"
            />
            <GrafitiValidator v-if="item.isGrafitiBoxActive" @confirm-change="grafitiConfirmHandler(item)" />
            <ExitValidator
              v-if="item.isExitBoxActive"
              @back-btn="(item.isExitBoxActive = false), (deactiveInsertValidator = false)"
              @confirm-password="
                (enteredPassword) => {
                  confirmPasswordSingleExitChain(item, enteredPassword);
                }
              "
            />

            <ExitValidatorsModal
              v-if="item.displayExitModal || exitChainModalForMultiValidators"
              :item="item"
              @exit-modal="closeExitChainModal(item)"
              @confirm-btn="confirmExitChainForValidators(item)"
            />
            <RemoveValidator
              v-if="item.toRemove || exitChainForMultiValidatorsActive || removeForMultiValidatorsActive"
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
        <div v-if="enterPasswordBox || selectValidatorServiceForKey || ImportSlashingActive" class="table-header">
          <span id="pubkey_name">FILE NAME</span>
          <span id="validator-service">Service</span>
        </div>
        <div v-if="enterPasswordBox || selectValidatorServiceForKey || ImportSlashingActive" class="table-content">
          <div v-for="(item, index) in keyFiles" :key="index" class="key-tableRow">
            <span class="key-circle"></span>
            <span class="file-name">{{ item.name }}</span>
            <div v-if="enterPasswordBox" class="chosenService">
              <img :src="selectedService.icon" alt="icon" />
            </div>
            <div class="key-remove-icon" @click="removeKeyHandler(item)">
              <img src="../../../../public/img/icon/task-manager-icons/close3.png" alt="icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Small search icons -->
    <SearchOptions
      :is-pubkey-visible="isPubkeyVisible"
      @toggle-pubkey="togglePubkeyView"
      @open-search="openSearchBox"
    />
    <!-- Click box to import key -->
    <InsertValidator
      v-if="insertKeyBoxActive"
      :class="{ deactive: deactiveInsertValidator === true ? true : false }"
      :services="installedServices"
      @open-upload="openUploadHandler"
      @upload-file="uploadFileHandler"
    />
    <!-- Search Input -->
    <search-box v-if="searchBoxActive">
      <form
        class="w-full flex justify-between items-center border-2 border-gray-700 rounded-full bg-slate-300 focus:ring-blue-500 focus:border-blue-500"
      >
        <label for="simple-search" class="sr-only text-gray-400 rounded-full">Search</label>
        <div class="w-full flex justify-evenly items-center px-5 rounded-full relative">
          <div class="flex items-center pointer-events-none">
            <svg
              aria-hidden="true"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            v-model="searchModel"
            type="search"
            class="z-10 text-gray-700 text-sm rounded-full block w-full pl-10 p-2.5 placeholder-gray-500 bg-transparent"
            placeholder="Search"
          />

          <!-- <img @click="$emit('close')" src="../../../../public/img/icon/task-manager-icons/close3.png" alt="icon" /> -->
        </div>
      </form>
    </search-box>
    <!-- select specific validator service -->
    <SelectService v-if="selectValidatorServiceForKey" @select-service="checkSelectedService" />
    <!-- Password box for validator keys -->
    <EnterPassword
      v-if="enterPasswordBox"
      :active-password="passwordInputActive"
      @confirm-password="confirmPasswordHandler"
      @import-key="checkRisk"
      @import-key-enter="checkRisk"
    />
    <!-- Fee Recipient box for validator keys -->
    <FeeRecipient
      v-if="feeRecipientBoxActive"
      :active-fee="feeInputActive"
      @enter-fee="enterFeeHandler"
      @confirm-btn="confirmFeeRecipientAddress"
    />
    <!-- Grafiti box for validator keys -->
    <GrafitiMultipleValidators v-if="grafitiForMultiValidatorsActive" @confirm-btn="confirmEnteredGrafiti" />
    <!-- Remove Box for validator keys -->
    <RemoveMultipleValidators
      v-if="removeForMultiValidatorsActive"
      @remove-modal="
        removeForMultiValidatorsActive = false;
        keys.filter((key) => key.icon === selectedIcon).forEach((k) => (k.toRemove = false));
      "
      @delete-key="confirmRemoveAllValidators"
    />

    <!-- Exit box for validator keys -->
    <ExitMultipleValidators v-if="exitChainForMultiValidatorsActive" @confirm-btn="confirmPasswordMultiExitChain" />
    <DisabledStaking v-if="stakingIsDisabled" />
  </div>
</template>
<script>
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
import { mapWritableState, mapState } from "pinia";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";
import { useNodeManage } from "@/store/nodeManage";
import axios from "axios";
import GrafitiMultipleValidators from "./GrafitiMultipleValidators.vue";
import RemoveMultipleValidators from "./RemoveMultipleValidators.vue";
import ExitMultipleValidators from "./ExitMultipleValidators.vue";
import ImportSlashingModal from "./ImportSlashingModal.vue";
import DisabledStaking from "./DisabledStaking.vue";
import SearchBox from "./SearchBox.vue";

export default {
  components: {
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
    SearchBox,
  },

  data() {
    return {
      deactiveInsertValidator: false,
      exitPassword: "",
      riskWarning: false,
      stakingIsDisabled: false,
      disable: true,
      message: "",
      messageIsError: false,
      bDialogVisible: false,
      isDragOver: false,
      keyFiles: [],
      importValidatorKeyActive: true,
      selectValidatorServiceForKey: false,
      passwordInputActive: false,
      feeRecipientBoxActive: false,
      feeInputActive: false,
      importIsProcessing: true, //it has to change to true
      exitInfo: false,
      importIsDone: false,
      exitChainModalForMultiValidators: false,
      downloadForMultiValidatorsActive: false,
      password: this.enteredPassword,
      fileInput: "",
      displayRemoveValidatorModal: false,
      activeStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Active.png",
      slashedStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Slashed.png",
      depositStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Deposit.png",
      offlineStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Offline.png",
      pendingStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Pending_alternative.png",
      exitedStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Exited.png",
      apiProblems: "/img/icon/the-staking/State_Icon.png",
      apiLoading: "/img/icon/task-manager-icons/turning_circle.gif",
      selectedService: {},
      ImportSlashingActive: false,
      slashingDB: "",
      keyIcon: {
        normalKey: "./img/icon/the-staking/normal-key.svg",
        remoteKey: "./img/icon/the-staking/remotekey.svg",
      },
      keyType: true,

      searchBoxActive: false,
      searchModel: "",
      isPubkeyVisible: false,
      isActiveRunning: [],
      checkActiveValidatorsResponse: [],
      exitValidatorResponse: {},
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      selectedIcon: "selectedIcon",
      buttonState: "buttonState",
    }),
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useStakingStore, {
      selectedValdiatorService: "selectedValdiatorService",
      totalBalance: "totalBalance",
      keys: "keys",
      forceRefresh: "forceRefresh",
      insertKeyBoxActive: "insertKeyBoxActive",
      enterPasswordBox: "enterPasswordBox",
      exitChainForMultiValidatorsActive: "exitChainForMultiValidatorsActive",
      removeForMultiValidatorsActive: "removeForMultiValidatorsActive",
      grafitiForMultiValidatorsActive: "grafitiForMultiValidatorsActive",
      display: "display",
    }),
    importingErrorMessage() {
      return {
        "text-danger": this.message.includes("Failed"),
      };
    },
    filteredKey() {
      if (this.searchModel.length > 0) {
        return this.keys.filter((k) => k.key.toLowerCase().includes(this.searchModel.toLowerCase()));
      }
      return this.keys;
    },

    keyIconPicker() {
      if (this.keyType === true) {
        return this.keyIcon.normalKey;
      } else {
        return this.keyIcon.remoteKey;
      }
    },
  },
  watch: {
    keys: {
      deep: true,
      immediate: true,
      handler(val) {
        const hasMatchingIcon = val.some((item) => item.icon === this.selectedIcon);

        this.display = !hasMatchingIcon;
      },
    },

    selectedIcon: {
      deep: true,
      immediate: true,
      handler(val) {
        const hasMatchingIcon = this.keys.some((item) => item.icon === val);

        this.display = !hasMatchingIcon;
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
    // filteredKey(out) {
    //   if (out !== "") {
    //     return this.keys.filter((k) => k.key.toLowerCase().includes(out.toLowerCase()));
    //   } else {
    //     return this.keys;
    //   }
    // },
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
        (service) => service.category === "validator" && service.state === "running"
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
    exitFormat(arg) {
      const lines = arg.split(/\r?\n/);

      const formattedLines = lines.map((line) => {
        const parts = line.split(" ");
        const time = parts.shift();
        const level = parts.shift();
        const message = parts.join(" ");

        return `${time}\n${level}\n${message}\n\n`;
      });

      const formattedData = formattedLines.join("");
      return formattedData || "";
    },
    async validatorRemoveConfirm(item, picked) {
      item.isRemoveBoxActive = false;
      item.isDownloadModalActive = true;
      const returnVal = await this.deleteValidators(item.validatorID, [item.key], picked);
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
    confirmPasswordSingleExitChain(el, val) {
      el.displayExitModal = true;
      this.exitPassword = val;
    },
    checkRisk: async function (val) {
      this.bDialogVisible = true;
      this.importIsProcessing = true;
      this.importIsDone = false;
      this.exitInfo = false;
      this.password = val;
      this.checkActiveValidatorsResponse = await ControlService.checkActiveValidators({
        files: this.keyFiles,
        password: this.password,
        serviceID: this.selectedService.config.serviceID,
        slashingDB: this.slashingDB,
      });
      this.keyFiles = [];
      if (
        this.checkActiveValidatorsResponse.length === 0 ||
        this.checkActiveValidatorsResponse.includes("Validator check error:\n")
      ) {
        this.importKey(val);
      } else {
        this.importIsProcessing = false;
        this.importIsDone = true;
        this.password = "";
        this.importValidatorKeyActive = true;
        this.insertKeyBoxActive = true;
        this.enterPasswordBox = false;
        this.passwordInputActive = false;
        this.riskWarning = true;
      }
    },
    confirmPasswordMultiExitChain() {
      this.exitChainForMultiValidatorsActive = false;
      this.exitChainModalForMultiValidators = true;
    },
    confirmExitChainForValidators: async function (el) {
      if (el.displayExitModal || el.isExitBoxActive) {
        el.displayExitModal = false;
        el.isExitBoxActive = false;
        this.deactiveInsertValidator = false;
      } else {
        this.exitChainModalForMultiValidators = false;
      }
      this.insertKeyBoxActive = true;
      try {
        this.exitValidatorResponse = await ControlService.exitValidator({
          pubkey: el.key,
          password: this.exitPassword,
          serviceID: el.validatorID,
        });
        this.importIsProcessing = false;
        this.exitInfo = true;
        this.bDialogVisible = true;
        this.importIsDone = false;
      } catch (error) {
        console.log(error);
      }
    },
    passwordBoxSingleExitChain(el) {
      el.isExitBoxActive = true;
      this.deactiveInsertValidator = true;
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
      let clients = this.installedServices.filter((s) => s.category == "validator");
      if (clients && clients.length > 0 && this.currentNetwork.network != "") {
        for (let client of clients) {
          //if there is already a list of keys ()
          if (
            (client.config.keys === undefined || client.config.keys.length === 0 || this.forceRefresh) &&
            client.state === "running"
          ) {
            //refresh validaotr list
            let result = await ControlService.listValidators(client.config.serviceID);

            //update service config (pinia)
            client.config.keys = result.data ? result.data.map((e) => e.validating_pubkey) : [];

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
      try {
        data = await ControlService.getValidatorState(this.keys.map((key) => key.key));
        if (!data || data.length == 0) {
          data = [];
          let latestEpochResponse = await axios.get(this.currentNetwork.dataEndpoint + "/epoch/latest", {
            validateStatus: function (status) {
              return status < 500;
            },
          });
          var latestEpoch = latestEpochResponse.data.data.epoch;
          let buffer = this.keys.map((key) => key.key);
          const chunkSize = 50;
          for (let i = 0; i < buffer.length; i += chunkSize) {
            //split validator accounts into chunks of 50 (api url limit)
            const chunk = buffer.slice(i, i + chunkSize);
            let response = await axios.get(
              this.currentNetwork.dataEndpoint + "/validator/" + encodeURIComponent(chunk.join()),
              {
                validateStatus: function (status) {
                  return status < 500;
                },
              }
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
          latestEpoch = latestEpoch ? parseInt(latestEpoch) : parseInt(info.latestEpoch);
          let activationEpoch = parseInt(info.activationepoch);
          if (this.currentNetwork.network === "gnosis") {
            d.setMilliseconds(d.getMilliseconds() - (latestEpoch - activationEpoch) * 80000);
          } else {
            d.setMilliseconds(d.getMilliseconds() - (latestEpoch - activationEpoch) * 384000);
          }
          key.status = info.status;
          key.balance = info.balance / 1000000000;
          key.activeSince = ((now.getTime() - d.getTime()) / 86400000).toFixed(1) + " Days";
          totalBalance += key.balance;
        } else {
          key.status = "deposit";
          key.balance = "-";
        }
      });
      this.totalBalance = totalBalance;
    },

    importKey: async function (val) {
      this.password = val;
      this.message = await ControlService.importKey(this.selectedService.config.serviceID);
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
      if (!this.keyFiles.includes(uploadedFiles[0]["name"]) && uploadedFiles[0]["type"] === "application/json") {
        this.keyFiles.push(...uploadedFiles);
        this.importValidatorKeyActive = false;
        this.insertKeyBoxActive = false;
        this.selectValidatorServiceForKey = true;
        this.isDragOver = false;
      }
    },
    dropFileHandler(event) {
      let validator = this.installedServices.filter((s) => s.service.includes("Validator"));
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
      this.insertKeyBoxActive = true;
    },
    hideWDialog() {
      this.riskWarning = false;
      this.insertKeyBoxActive = true;
    },
    riskAccepted() {
      this.riskWarning = false;
      this.bDialogVisible = true;
      this.importKey(this.password);
    },
    async confirmEnteredGrafiti(graffiti) {
      await ControlService.setGraffitis({ id: this.selectedValdiatorService.config.serviceID, graffiti: graffiti });
      this.grafitiForMultiValidatorsActive = false;
      this.insertKeyBoxActive = true;
    },

    async confirmRemoveAllValidators(picked) {
      let filteredKey = this.keys.filter((key) => key.icon === this.selectedIcon);
      let keys = filteredKey.map((key) => key.key);
      let id = "";
      let changed = 0;
      filteredKey.forEach((key) => {
        if (id != key.validatorID) {
          id = key.validatorID;
          changed++;
        }
      });
      this.downloadForMultiValidatorsActive = true;
      this.removeForMultiValidatorsActive = false;

      if (changed === 1 && id) {
        const returnVal = await this.deleteValidators(id, keys, picked);
        if (picked === "yes") {
          this.downloadFile(returnVal);
          this.updateValidatorStats();
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
    openSearchBox() {
      if (this.keys.length > 0) {
        this.searchBoxActive = !this.searchBoxActive;
      }
    },
    closeSearchBox() {
      this.insertKeyBoxActive = true;
      this.searchBoxActive = false;
    },
  },
};
</script>
<style scoped>
.bg-blue {
  background: #3180cf !important;
}
.deactive {
  opacity: 0.9;
  pointer-events: none;
}
.import-message::-webkit-scrollbar {
  width: none;
}

/* Track */
.import-message::-webkit-scrollbar-track {
  background: none;
  box-sizing: border-box;
}

/* Handle */
.import-message::-webkit-scrollbar-thumb {
  background: none;
  border-radius: none;
}

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
  width: 90%;
  height: 74%;
  border-radius: 50%;
  background-color: #bebebe;
  margin: 0 5px;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.circle img {
  width: 71%;
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
  border-radius: 71px 71px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title-box span {
  color: rgb(216, 216, 216);
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
  justify-content: flex-start;
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
  width: 96%;
  min-height: 35px;
  color: rgb(211, 211, 211);
  background-color: rgb(36, 40, 43);
  border: 1px solid rgb(147, 150, 152);
  border-radius: 5px;
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 1rem;
  font-weight: 500;
  word-break: break-all;
  text-align: left;
  white-space: pre-wrap;
  overflow: auto;
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
  background-color: #d63f3f;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(210, 210, 210);
  text-transform: capitalize;
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

.searchBox .textBox form {
  width: 100%;
  height: 100%;
  border-radius: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.searchBox .textBox form input {
  width: 100%;
  height: 100%;
  padding-left: 10px;
}
</style>
