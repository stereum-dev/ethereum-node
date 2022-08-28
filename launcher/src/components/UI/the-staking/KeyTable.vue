<template>
  <div class="keys-parent">
    <div class="keys-table-box">
      <div class="keys-table">
        <div class="table-header" v-if="importValidatorKeyActive">
          <span id="name">Public Key</span>
          <span id="service">SERVICE</span>
          <span id="active">ACTIVE SINCE</span>
          <span id="state">STATE</span>
          <span id="balance">BALANCE</span>
          <span id="option">OPTIONS</span>
        </div>
        <key-modal v-if="bDialogVisible" @hide-modal="hideBDialog">
          <div class="title-box">
            <span>Importing validator key(s)</span>
          </div>
          <div class="processImg" v-if="importIsProcessing">
            <img src="/img/icon/the-staking/motor3.gif" alt="icon" />
          </div>
          <div class="import-message" v-if="importIsProcessing">
            <span>It may take some times</span>
            <span>Please wait until the key is imported</span>
          </div>
          <div class="import-message" v-if="importIsDone">
            <span :class="importingErrorMessage">{{ message }}</span>
          </div>
          <div class="confirm-btn" v-if="importIsDone">
            <div class="confirm-box" @click="hideBDialog">
              <span>OK</span>
            </div>
          </div>
        </key-modal>
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
          <div class="table-row" v-for="(item, index) in keys" :key="index">
            <div class="rowContent">
              <span class="circle"></span>
              <span class="category"
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
                <div class="grafiti-box" @click="grafitiDisplayHandler(item)">
                  <img
                    class="grafiti-icon"
                    src="../../../../public/img/icon/the-staking/option-graffiti.png"
                    alt="icon"
                  />
                </div>
                <div class="copy-box">
                  <img
                    class="copy-icon"
                    src="../../../../public/img/icon/the-staking/copy6.png"
                    alt="icon"
                  />
                </div>
                <div class="remove-box" @click="removeModalDisplay(item)">
                  <img
                    class="remove-icon"
                    src="../../../../public/img/icon/the-staking/option-remove.png"
                    alt="icon"
                  />
                </div>
                <div class="exit-box" @click="passwordBoxSingleExitChain(item)">
                  <img
                    class="exit-icon"
                    src="../../../../public/img/icon/the-staking/redexit-icon.png"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
            <grafiti-validator
              v-if="item.isGrafitiBoxActive"
              @confirm-change="grafitiConfirmHandler(item)"
            ></grafiti-validator>
            <exit-validator
              v-if="item.isExitBoxActive"
              @confirm-password="confirmPasswordSingleExitChain(item)"
            ></exit-validator>
            <exit-single-modal
              v-if="item.displayExitModal"
              :item="item"
              @exit-modal="closeModalSingleExitChain(item)"
              @confirm-btn="confirmSingleValidatorExitChain(item)"
            ></exit-single-modal>
            <remove-validator v-if="item.isRemoveBoxActive"> </remove-validator>
            <remove-single-modal
              v-if="item.isRemoveBoxActive"
              :item="item"
              @remove-modal="item.isRemoveBoxActive = false"
              @delete-key="validatorRemoveConfirm(item)"
            ></remove-single-modal>
          </div>
        </div>
        <div class="table-header" v-if="enterPasswordBox">
          <span id="active">FILE NAME</span>
        </div>
        <div class="table-content" v-if="enterPasswordBox">
          <div
            class="key-table-row"
            v-for="(item, index) in keyFiles"
            :key="index"
          >
            <span class="key-circle"></span>
            <span class="file-name">{{ item.name }}</span>
            <div @click="removeKeyHandler(item.name)" class="key-remove-icon">
              <img
                src="../../../../public/img/icon/task-manager-icons/close3.png"
                alt="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <search-options></search-options>
    <insert-validator
      v-if="insertKeyBoxActive"
      @open-upload="openUploadHandler"
      @upload-file="uploadFileHandler"
    ></insert-validator>
    <enter-password
      v-if="enterPasswordBox"
      :activePassword="passwordInputActive"
      @confirm-password="confirmPasswordHandler"
      @import-key="importKey"
    ></enter-password>
    <fee-recipient
      v-if="feeRecipientBoxActive"
      @enter-fee="enterFeeHandler"
      :activeFee="feeInputActive"
      @confirm-fee="confirmFeeRecipientAddress"
    ></fee-recipient>
    <grafiti-multiple-validators
      v-if="grafitiForMultiValidatorsActive"
      @confirm-grafiti="confirmEnteredGrafiti"
    ></grafiti-multiple-validators>
    <remove-multiple-validators
      v-if="removeForMultiValidatorsActive"
      @confirm-grafiti="confirmMultiRemove"
    ></remove-multiple-validators>
    <exit-multiple-validators
      v-if="exitChainForMultiValidatorsActive"
      @confirm-exit="confirmMultiExitChain"
    ></exit-multiple-validators>
  </div>
</template>
<script>
import DropZone from "./DropZone.vue";
import ShowKey from "./ShowKey.vue";
import KeyModal from "./KeyModal.vue";
import GrafitiValidator from "./GrafitiValidator.vue";
import ExitValidator from "./ExitValidator.vue";
import ExitSingleModal from "./ExitSingleModal.vue";
import RemoveValidator from "./RemoveValidatore.vue";
import RemoveSingleModal from "./RemoveSingleModal.vue";
import SearchOptions from "./SearchOptions.vue";
import EnterPassword from "./EnterPassword.vue";
import InsertValidator from "./InsertValidator.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";
import axios from "axios";
import GrafitiMultipleValidators from "./GrafitiMultipleValidators.vue";
import RemoveMultipleValidators from "./RemoveMultipleValidators.vue";
import ExitMultipleValidators from "./ExitMultipleValidators.vue";
export default {
  components: {
    ShowKey,
    DropZone,
    KeyModal,
    GrafitiValidator,
    ExitValidator,
    RemoveValidator,
    RemoveSingleModal,
    ExitSingleModal,
    SearchOptions,
    InsertValidator,
    EnterPassword,
    GrafitiMultipleValidators,
    RemoveMultipleValidators,
    ExitMultipleValidators,
  },
  props: ["button"],
  data() {
    return {
      message: "",
      messageIsError: false,
      bDialogVisible: false,
      isDragOver: false,
      keyFiles: [],
      importValidatorKeyActive: true,
      insertKeyBoxActive: true,
      enterPasswordBox: false,
      insertFilePage: true,
      enterPasswordPage: false,
      passwordInputActive: false,
      feeRecipientBoxActive: false,
      feeInputActive: false,
      importIsProcessing: false,
      importIsDone: false,
      grafitiForMultiValidatorsActive: false,
      exitChainForMultiValidatorsActive: false,
      removeForMultiValidatorsActive: false,
      password: "",
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
    };
  },
  watch: {},
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
  created() {
    this.keys = this.keys.map((item) => {
      return {
        isGrafitiBoxActive: false,
        isRemoveBoxActive: false,
        isRemoveModalActive: false,
        isExitBoxActive: false,
        displayExitModal: false,
        ...item,
      };
    });
  },
  mounted() {
    this.listKeys();
    this.polling = setInterval(this.updateValidatorStats, 384000); //refresh validator account stats
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  updated() {
    this.checkKeyExists();
    this.handler();
  },
  methods: {
    grafitiDisplayHandler(el) {
      el.isGrafitiBoxActive = true;
      el.isRemoveModalActive = true;
    },
    grafitiConfirmHandler(el) {
      el.isGrafitiBoxActive = false;
    },
    removeModalDisplay(el) {
      el.isRemoveBoxActive = true;
    },
    validatorRemoveConfirm(el) {
      el.isRemoveBoxActive = false;
    },
    confirmPasswordSingleExitChain(el) {
      el.displayExitModal = true;
    },
    confirmSingleValidatorExitChain(el) {
      el.displayExitModal = false;
      el.isExitBoxActive = false;
    },
    passwordBoxSingleExitChain(el) {
      el.isExitBoxActive = true;
    },
    closeModalSingleExitChain(el) {
      el.displayExitModal = false;
      el.isExitBoxActive = false;
    },
    // copyHandler(item) {
    //   let toCopy = item.key;
    //   this.$copyText(toCopy)
    //     .then(() => {
    //       console.log("copied!");
    //     })
    //     .catch(() => {
    //       console.log(`can't copy`);
    //     });
    // },
    stateIconHandler(item) {
      switch (item.status) {
        case "active_online":
          return this.activeStatusIcon;
        case "active_offline":
          return this.offlineStatusIcon;
        case "slashed":
          return this.slashedStatusIcon;
        case "pending":
          return this.pendingStatusIcon;
        case "exited":
          return this.exitedStatusIcon;
        case "NA":
          return this.apiProblems;
        case "loading":
          return this.apiLoading;
        default:
          return this.depositStatusIcon;
      }
    },
    listKeys: async function () {
      let keyStats = [];
      let clients = this.installedServices.filter((s) =>
        s.service.includes("Validator")
      );
      if (clients && clients.length > 0 && this.network != "") {
        for (let client of clients) {
          //if there is already a list of keys ()
          if (
            client.config.keys === undefined ||
            client.config.keys.length === 0 ||
            this.forceRefresh
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
        this.forceRefresh = false;
        this.keys = keyStats.map((key) => {
          return {
            ...key,
            showGrafitiText: false,
            showCopyText: false,
            showRemoveText: false,
            showExitText: false,
          };
        });
        this.updateValidatorStats();
      }
    },
    async updateValidatorStats() {
      let totalBalance = 0;
      let data = [];
      let network = this.network === "mainnet" ? "mainnet" : "prater";
      try {
        let buffer = this.keys.map((key) => key.key);
        const chunkSize = 100;
        for (let i = 0; i < buffer.length; i += chunkSize) {
          //split validator accounts into chunks of 100 (api limit)
          const chunk = buffer.slice(i, i + chunkSize);
          let response = await axios.get(
            "https://" +
              network +
              ".beaconcha.in/api/v1/validator/" +
              encodeURIComponent(chunk.join())
          );
          data = data.concat(response.data.data); //merge all gathered stats in one array
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
          key.status = info.status;
          key.balance = info.balance / 1000000000;
          totalBalance += key.balance;
        } else {
          key.status = "deposit";
          key.balance = "-";
        }
      });
      this.totalBalance = totalBalance;
    },
    importKey: async function () {
      this.bDialogVisible = true;
      this.importIsProcessing = true;
      this.importIsDone = false;
      this.message = await ControlService.importKey({
        files: this.keyFiles,
        password: this.password,
      });
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
        this.enterPasswordBox = true;
        this.isDragOver = false;
      }
    },
    dropFileHandler(event) {
      let droppedFiles = event.dataTransfer.files;
      if (droppedFiles[0]["type"] === "application/json") {
        this.keyFiles.push(...droppedFiles);
        this.importValidatorKeyActive = false;
        this.insertKeyBoxActive = false;
        this.enterPasswordBox = true;
        this.isDragOver = false;
      }
    },
    removeKeyHandler(key_name) {
      this.keyFiles = this.keyFiles.filter((item) => item.name != key_name);
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
    confirmEnteredGrafiti() {
      this.grafitiForMultiValidatorsActive = false;
      this.insertKeyBoxActive = true;
    },
    confirmMultiExitChain() {
      this.exitChainForMultiValidatorsActive = false;
      this.insertKeyBoxActive = true;
    },
    confirmMultiRemove() {
      this.removeForMultiValidatorsActive = false;
      this.insertKeyBoxActive = true;
    },
    handler() {
      if (this.button.name === "fee") {
        this.insertKeyBoxActive = false;
        this.enterPasswordBox = false;
        this.feeRecipientBoxActive = true;
        this.feeInputActive = true;
      } else if (this.button.name === "grafiti") {
        this.insertKeyBoxActive = false;
        this.enterPasswordBox = false;
        this.feeRecipientBoxActive = false;
        this.grafitiForMultiValidatorsActive = true;
      } else if (this.button.name === "remove") {
        this.insertKeyBoxActive = false;
        this.enterPasswordBox = false;
        this.feeRecipientBoxActive = false;
        this.removeForMultiValidatorsActive = true;
      } else {
        this.insertKeyBoxActive = false;
        this.enterPasswordBox = false;
        this.feeRecipientBoxActive = false;
        this.exitChainForMultiValidatorsActive = true;
      }
    },
  },
};
</script>
<style scoped>
.keys-parent {
  width: 100%;
  height: 100%;
  margin-left: 5px;
  grid-column: 1/10;
  grid-row: 1/4;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 86% 7% 7%;
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
.keys-table {
  width: 100%;
  height: 100%;
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
  height: 92%;
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
.table-row {
  width: 99%;
  height: 30px;
  margin: 5px auto 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.table-row .rowContent {
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

.table-row span {
  align-self: center;
  width: max-content;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  overflow: hidden;
  box-sizing: border-box;
}

.table-row .circle {
  grid-column: 1;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background-color: #bebebe;
  margin: 0 5px;
  align-self: center;
}

.table-row .category {
  width: 100%;
  grid-column: 2;
  font-size: 0.8rem;
  font-weight: 600;
  align-self: center;
  margin-left: 5px;
  color: #d7d7d7;
}

.table-row .service-icon {
  width: 20px;
  grid-column: 3;
  justify-self: center;
  align-self: center;
}

.table-row .since {
  grid-column: 4;
  font-size: 10px;
  justify-self: center;
  align-self: center;
}

.table-row .state-icon {
  width: 24px;
  grid-column: 5;
  justify-self: center;
  align-self: center;
}

.table-row .balance {
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

.option-box .exit-box {
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

.key-table-row {
  width: 99%;
  height: 30px;
  margin: 5px auto 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(89, 89, 89);
  border-radius: 30px;
  padding: 1px;
}

.key-table-row .file-name {
  width: 90%;
  color: #fff !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
}

.key-table-row .key-remove-icon {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  border: 1px solid #4a4a4a !important;
  border-radius: 50px !important;
  width: 20px !important;
  height: 20px !important;
  margin-right: 4px;
  padding: 1px;
  background-color: #343434;
  box-shadow: 0 0 3px 1px rgb(0, 0, 0);
}

.key-table-row .key-remove-icon img {
  width: 70% !important;
  height: 70% !important;
}

.key-table-row .key-circle {
  width: 20px !important;
  height: 20px !important;
  border-radius: 50% !important;
  background-color: #fff !important;
  margin-left: 5px;
}

.title-box {
  width: 100%;
  height: 50px;
  background-color: rgb(55, 107, 102);
  border-radius: 12px 12px 0 0;
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
  width: 65px;
  height: 60px;
  position: absolute;
  animation: move 5s linear infinite;
}

@keyframes move {
  0% {
    left: 0%;
    bottom: -10px;
  }

  25% {
    left: 20%;
    bottom: -10px;
  }

  50% {
    left: 40%;
    bottom: -10px;
  }

  75% {
    left: 62%;
    bottom: -10px;
  }

  100% {
    left: 85%;
    bottom: -10px;
  }
}

.import-message {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.import-message span {
  width: 90%;
  margin: 0 auto;
  color: rgb(156, 156, 156);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  display: inline-block;
  text-align: center;
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
</style>
