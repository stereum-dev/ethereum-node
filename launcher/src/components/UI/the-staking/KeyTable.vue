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
            <span>{{ message }}</span>
          </div>
          <div class="confirm-btn" v-if="importIsDone">
            <div class="confirm-box" @click="hideBDialog">
              <span>Confirm</span>
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
            <span class="circle"></span>
            <span class="category"
              >{{ item.key.substring(0, 20) }}...{{
                item.key.substring(item.key.length - 4, item.key.length)
              }}</span
            >
            <img class="service-icon" :src="item.icon" alt="icon" />
            <span class="since">12d 11h 20m</span>
            <img class="state-icon" :src="stateIconHandler(item)" alt="icon" />
            <span class="balance">{{ item.balance }}</span>
            <div class="option-box">
              <div
                class="grafiti-box"
                @mouseover="item.showGrafitiText = true"
                @mouseleave="item.showGrafitiText = false"
              >
                <img
                  class="grafiti-icon"
                  src="../../../../public/img/icon/the-staking/option-graffiti.png"
                  alt="icon"
                />
              </div>
              <div
                class="copy-box"
                @mouseover="item.showCopyText = true"
                @mouseleave="item.showCopyText = false"
              >
                <img
                  class="copy-icon"
                  src="../../../../public/img/icon/the-staking/copy6.png"
                  alt="icon"
                />
              </div>
              <div
                class="remove-box"
                @mouseover="item.showRemoveText = true"
                @mouseleave="item.showRemoveText = false"
              >
                <img
                  class="remove-icon"
                  src="../../../../public/img/icon/the-staking/option-remove.png"
                  alt="icon"
                />
              </div>
              <div
                class="exit-box"
                @mouseover="item.showExitText = true"
                @mouseleave="item.showExitText = false"
              >
                <img
                  class="exit-icon"
                  src="../../../../public/img/icon/the-staking/redexit-icon.png"
                  alt="icon"
                />
              </div>
            </div>
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
    <div class="searchOptions">
      <img
        class="rename"
        src="../../../../public/img/icon/the-staking/rename-icon.png"
        alt="icon"
      />
      <img
        class="folder"
        src="../../../../public/img/icon/the-staking/newfolder-icon.png"
        alt="icon"
      />
      <img
        class="filter"
        src="../../../../public/img/icon/the-staking/staking-filter.png"
        alt="icon"
      />
    </div>
    <div class="insertBox" v-if="insertKeyBoxActive">
      <div class="insert-key" @click="openUploadHandler">
        <input
          type="file"
          @change="uploadFileHandler"
          style="display: none"
          ref="fileInput"
          multiple="multiple"
          accept="application/json"
        />
        <span>CLICK OR DRAG TO INSERT KEY</span>
        <img
          class="black-key"
          src="../../../../public/img/icon/the-staking/black-key.png"
          alt="icon"
        />
      </div>
    </div>
    <div class="passwordBox" v-if="enterPasswordBox">
      <div class="enter-password" @click="confirmPasswordHandler">
        <input v-model="password" v-if="passwordInputActive" type="password" />
        <button
          @keyup.enter="importKey"
          @click="importKey"
          v-if="passwordInputActive"
        >
          CONFIRM
        </button>
        <span v-else>ENTER PASSWORD & IMPORT</span>
      </div>
    </div>
    <div class="feeBox" v-if="feeRecipientBoxActive">
      <div class="enter-fee" @click="enterFeeHandler">
        <input
          placeholder="Enter a valid Ethereum address to send your block rewards to ... "
          v-model="password"
          v-if="feeInputActive"
          type="text"
        />
        <button
          @keyup.enter="confirmFeeRecipientAddress"
          @click="confirmFeeRecipientAddress"
          v-if="feeInputActive"
        >
          CONFIRM
        </button>
        <span v-else>SET A BLOCK FEE RECIPIENT ADDRESS</span>
      </div>
    </div>
  </div>
</template>
<script>
import DropZone from "./DropZone.vue";
import ShowKey from "./ShowKey.vue";
import KeyModal from "./KeyModal.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";
import axios from "axios";
export default {
  components: { ShowKey, DropZone, KeyModal },
  props: ["button"],
  data() {
    return {
      message: "",
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
      password: "",
      forceRefresh: false,
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
    };
  },
  watch: {
    button: {
      deep: true,
      handler(val) {
        if (val.name === "fee") {
          this.insertKeyBoxActive = false;
          this.enterPasswordBox = false;
          this.feeRecipientBoxActive = true;
          this.feeInputActive = true;
        } else if (val.name === "grafiti") {
          console.log("This is grafiti");
        } else if (val.name === "remove") {
          console.log("this removes a key");
        } else {
          console.log("this is exit");
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
      keys: "",
    }),
  },
  mounted() {
    this.listKeys();
  },
  updated() {
    this.checkKeyExists();
  },
  methods: {
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
        default:
          return this.depositStatusIcon;
      }
    },
    listKeys: async function () {
      let keys = [];
      let totalBalance = 0;
      let clients = this.installedServices.filter((s) =>
        s.service.includes("Validator")
      );
      if (clients && clients.length > 0) {
        for (let client of clients) {
          //if there is already a list of keys ()
          if (
            client.config.keys &&
            client.config.keys.length > 0 &&
            !this.forceRefresh
          ) {
            //update validator stats
            keys = await this.updateValidatorStats(client);

            //update totalBalance
            keys.forEach((key) => {
              totalBalance += key.balance;
            });
          } else {
            //refresh validaotr list
            this.listKeysTriggered = true;
            let result = await ControlService.listValidators(
              client.config.serviceID
            );

            //update service config (pinia)
            client.config.keys = result.data
              ? result.data.map((e) => e.validating_pubkey)
              : [];

            if (client.config.keys && client.config.keys.length > 0) {
              //update validator stats
              keys = await this.updateValidatorStats(client);

              //update totalBalance
              keys.forEach((key) => {
                totalBalance += key.balance;
              });

              //update service datasets in Pinia store
              this.installedServices = this.installedServices.map((service) => {
                if (service.id === client.id) {
                  return client;
                }
                return service;
              });
            }
          }
        }
        this.keys = keys.map((key) => {
          return {
            ...key,
            showGrafitiText: false,
            showCopyText: false,
            showRemoveText: false,
            showExitText: false,
          };
        });
        this.totalBalance = totalBalance;
      }
    },
    async updateValidatorStats(client) {
      let keys = [];
      try {
        let response = await axios.get(
          "https://" +
            client.config.network +
            ".beaconcha.in/api/v1/validator/" +
            encodeURIComponent(client.config.keys.join())
        );
        let data = [];
        data = data.concat(response.data.data);

        client.config.keys.forEach((key) => {
          let info = data.find((k) => k.pubkey === key);
          if (info) {
            keys.push({
              key: key,
              validatorID: client.config.serviceID,
              icon: client.icon,
              status: info.status,
              balance: info.balance / 1000000000,
            });
          } else {
            keys.push({
              key: key,
              validatorID: client.config.serviceID,
              icon: client.icon,
              status: "NA",
              balance: 0,
            });
          }
        });
        return keys;
      } catch (err) {
        console.log("Couldn't fetch validator stats:\n", err);
        client.config.keys.forEach((key) => {
          keys.push({
            key: key,
            validatorID: client.config.serviceID,
            icon: client.icon,
            status: "NA",
            balance: 0,
          });
        });
        return keys;
      }
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
      this.listKeys();
      this.importIsProcessing = false;
      this.importIsDone = true;
      this.password = "";
      this.importValidatorKeyActive = false;
      this.insertKeyBoxActive = false;
      this.enterPasswordBox = false;
      this.passwordInputActive = false;
      this.feeRecipientBoxActive = true;
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
      if (
        !this.keyFiles.includes(droppedFiles[0]["name"]) &&
        droppedFiles[0]["type"] === "application/json"
      ) {
        this.keyFiles.push(...droppedFiles);
        this.importValidatorKeyActive = false;
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
.searchOptions {
  grid-column: 1/3;
  grid-row: 2/3;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.dropActive {
  width: 100%;
  height: 92%;
  background-color: rgb(44, 151, 128);
  opacity: 0.2;
  border-radius: 20px;
}

.table-content {
  height: 92%;
  overflow-x: hidden;
  overflow-y: auto;
}

.table-row {
  width: 99%;
  height: 30px;
  margin: 5px auto 0 auto;
  display: grid;
  grid-template-columns: 3% 30% 7% 14% 6% 10% 30%;
  background-color: rgb(89, 89, 89);
  border-radius: 30px;
  padding: 1px;
  position: relative;
  box-sizing: border-box;
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
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  margin: 0 auto;
  align-self: center;
}

.table-row .category {
  width: 100%;
  grid-column: 2;
  font-size: 13px;
  align-self: center;
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
  align-items: center;
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
  height: 100%;
  grid-column: 1/2;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.copy-box .copy-text {
  position: absolute;
  bottom: -17px;
  left: 6px;
  transition-duration: 500ms;
  z-index: 1;
}

.option-box .grafiti-box {
  height: 100%;
  grid-column: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.grafiti-box .grafiti-text {
  position: absolute;
  bottom: -17px;
  left: 0;
  transition-duration: 500ms;
  z-index: 1;
}

.option-box .remove-box {
  height: 100%;
  grid-column: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.remove-box .remove-text {
  position: absolute;
  bottom: -17px;
  left: -1px;
  transition-duration: 500ms;
  z-index: 1;
}

.option-box .exit-box {
  height: 100%;
  grid-column: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.exit-box .exit-text {
  position: absolute;
  bottom: -17px;
  right: 9px;
  transition-duration: 500ms;
  z-index: 1;
}

.keys-table {
  width: 100%;
  height: 100%;
}

.table-header {
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

.passwordBox,
.insertBox,
.feeBox {
  grid-column: 3/11;
  grid-row: 2/3;
  width: 100%;
  height: 40px;
  margin-top: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.searchOptions .rename,
.searchOptions .folder,
.searchOptions .filter {
  margin-top: 50px;
  width: 23px;
}

.insertBox .insert-key {
  width: 100%;
  height: 80%;
  margin: 0 auto;
  background-color: #bfbfbf;
  border-radius: 40px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.passwordBox .enter-password {
  width: 100%;
  height: 80%;
  background-color: #336666;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.passwordBox .enter-password span {
  color: rgb(227, 227, 227);
  font-size: 1rem;
  font-weight: 600;
}

.passwordBox .enter-password input {
  width: 80%;
  height: 80%;
  border-radius: 35px 0 0 35px;
  background-color: #002828;
  outline-style: none;
  padding: 0;
  padding-left: 10px;
  position: absolute;
  left: 5px;
  font-size: 1rem;
  color: #d5d5d5;
  font-weight: 500;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.passwordBox .enter-password button {
  width: 20%;
  height: 100%;
  border: none;
  padding: 7px;
  border-radius: 0 35px 35px 0;
  background-color: #3f4750;
  outline-style: none;
  position: absolute;
  right: 0;
  font-size: 0.8rem;
  color: #e0e0e0;
  font-weight: 600;
  cursor: pointer;
}

.passwordBox .enter-password button:hover {
  background-color: #23272a;
  box-shadow: none;
}

.passwordBox .enter-password button:active {
  background-color: #181b1d;
  box-shadow: inset 1px 1px 3px #070708;
}

.insertBox .insert-key span {
  color: #3a3a3a;
  font-size: 1.1rem;
  font-weight: 700;
}

.insertBox .insert-key img {
  width: 26px;
  height: 28px;
}
.feeBox .enter-fee {
  width: 100%;
  height: 80%;
  /* border: 1px solid #bfbfbf; */
  background-color: #266ad1;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.feeBox .enter-fee span {
  color: rgb(227, 227, 227);
  font-size: 1rem;
  font-weight: 600;
}

.feeBox .enter-fee input {
  width: 80%;
  height: 80%;
  border: 1px solid #96d6f3;
  border-radius: 35px 0 0 35px;
  background-color: #7cbbf6;
  outline-style: none;
  padding: 0;
  padding-left: 10px;
  position: absolute;
  left: 5px;
  font-size: 0.7rem;
  color: rgb(55, 55, 59);
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.feeBox .enter-fee button {
  width: 20%;
  height: 100%;
  border: none;
  padding: 7px;
  border-radius: 0 35px 35px 0;
  background-color: #3f4750;
  outline-style: none;
  position: absolute;
  right: 0;
  font-size: 0.8rem;
  color: #e0e0e0;
  font-weight: 600;
  cursor: pointer;
}

.feeBox .enter-fee button:hover {
  transition-duration: 100ms;
  background-color: #252f36;
  color: #9accfb;
  font-size: 0.85rem;
}

.feeBox .enter-fee button:active {
  transition-duration: 100ms;
  background-color: #3f4750;
  font-size: 0.8rem;
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
  color: rgb(156, 156, 156);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  text-transform: unset;
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
