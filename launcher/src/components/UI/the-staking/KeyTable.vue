<template>
  <div class="keys-parent">
    <div class="keys-table-box">
      <div class="keys-table">
        <div class="table-header" v-if="insertFilePage">
          <span id="name">Public Key</span>
          <span id="service">SERVICE</span>
          <span id="active">ACTIVE SINCE</span>
          <span id="state">STATE</span>
          <span id="balance">BALANCE</span>
          <span id="option">OPTIONS</span>
        </div>
        <div class="table-content" v-if="insertFilePage" :class="{ dropActive: isDragOver }" @drag.prevent.stop=""
          @dragstart.prevent.stop="" @dragend.prevent.stop="isDragOver = false"
          @dragover.prevent.stop="isDragOver = true" @dragenter.prevent.stop="isDragOver = true"
          @dragleave.prevent.stop="isDragOver = false" @drop.prevent.stop="dropFileHandler">
          <div class="table-row" v-for="(item, index) in keys" :key="index">
            <span class="circle"></span>
            <span class="category">{{ item.key.substring(0, 20) }}...{{ item.key.substring(item.key.length - 4,
                item.key.length)
            }}</span>
            <img class="service-icon" :src="item.icon" alt="icon" />
            <span class="since">12d 11h 20m</span>
            <img class="state-icon" :src="stateIconHandler(item)" alt="icon" />
            <span class="balance">{{ item.balance }}</span>
            <div class="option-box">
              <div class="grafiti-box" @mouseover="item.showGrafitiText = true"
                @mouseleave="item.showGrafitiText = false">
                <img class="grafiti-icon" src="../../../../public/img/icon/the-staking/option-graffiti.png"
                  alt="icon" />
                <span v-if="item.showGrafitiText" class="grafiti-text">GRAFITI</span>
              </div>
              <div class="copy-box" @mouseover="item.showCopyText = true" @mouseleave="item.showCopyText = false">
                <img class="copy-icon" src="../../../../public/img/icon/the-staking/option-copy.png" alt="icon" />
                <span v-if="item.showCopyText" class="copy-text">COPY</span>
              </div>
              <div class="remove-box" @mouseover="item.showRemoveText = true" @mouseleave="item.showRemoveText = false">
                <img class="remove-icon" src="../../../../public/img/icon/the-staking/option-remove.png" alt="icon" />
                <span v-if="item.showRemoveText" class="remove-text">REMOVE</span>
              </div>
              <div class="exit-box" @mouseover="item.showExitText = true" @mouseleave="item.showExitText = false">
                <img class="exit-icon" src="../../../../public/img/icon/the-staking/redexit-icon.png" alt="icon" />
                <span v-if="item.showExitText" class="exit-text">EXIT</span>
              </div>
            </div>
          </div>
        </div>
        <div class="table-header" v-if="enterPasswordPage">
          <span id="active">FILE NAME</span>
        </div>
        <div class="table-content" v-if="enterPasswordPage">
          <div class="key-table-row" v-for="(item, index) in keyFiles" :key="index">
            <span class="key-circle"></span>
            <span class="file-name">{{ item.name }}</span>
            <div @click="removeKeyHandler(item.name)" class="key-remove-icon">
              <img src="../../../../public/img/icon/task-manager-icons/close3.png" alt="icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="middle-icon" v-if="insertFilePage">
      <img class="rename" src="../../../../public/img/icon/the-staking/rename-icon.png" alt="icon" />
      <img class="folder" src="../../../../public/img/icon/the-staking/newfolder-icon.png" alt="icon" />
      <img class="filter" src="../../../../public/img/icon/the-staking/staking-filter.png" alt="icon" />
      <div class="insert-key" @click="openUploadHandler">
        <input type="file" @change="uploadFileHandler" style="display: none" ref="fileInput" multiple="multiple"
          accept="application/json" />
        <span>CLICK OR DRAG TO INSERT KEY</span>
        <img class="black-key" src="../../../../public/img/icon/the-staking/black-key.png" alt="icon" />
      </div>
    </div>
    <div class="password-box" v-if="enterPasswordPage">
      <img class="rename" src="../../../../public/img/icon/the-staking/rename-icon.png" alt="icon" />
      <img class="folder" src="../../../../public/img/icon/the-staking/newfolder-icon.png" alt="icon" />
      <img class="filter" src="../../../../public/img/icon/the-staking/staking-filter.png" alt="icon" />
      <div class="enter-password" @click="confirmPasswordHandler">
        <input v-model="password" v-if="passwordInputActive" type="password" />
        <button @click="importKey" v-if="passwordInputActive">CONFIRM</button>
        <span v-else>ENTER PASSWORD & IMPORT</span>
      </div>
    </div>
  </div>
</template>
<script>
import ShowKey from "./DropZone.vue";
import DropZone from "./ShowKey.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services"
import { useStakingStore } from "@/store/theStaking"
import axios from "axios";
export default {
  components: { ShowKey, DropZone },
  data() {
    return {
      message: "",
      bDialogVisible: false,
      isDragOver: false,
      keyFiles: [],
      keys: [],
      insertFilePage: true,
      enterPasswordPage: false,
      passwordInputActive: false,
      password: "",
      forceRefresh: false,
      activeStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Active.png",
      slashedStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Slashed.png",
      depositStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Deposit.png",
      offlineStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Offline.png",
      pendingStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Pending_alternative.png",
      exitedStatusIcon: "/img/icon/the-staking/Validatorkey_Status_Exited.png",
    };
  },
  mounted() {
    this.listKeys()
  },
  updated() {
    this.checkKeyExists();
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      network: "network",
    }),
    ...mapWritableState(useStakingStore, {
      totalBalance: "totalBalance",
    }),
  },
  methods: {
    stateIconHandler(item) {
      switch (item.status) {
        case 'active_online':
          return this.activeStatusIcon
        case 'active_offline':
          return this.offlineStatusIcon
        case 'slashed':
          return this.slashedStatusIcon
        case 'pending':
          return this.pendingStatusIcon
        case 'exited':
          return this.exitedStatusIcon
        default:
          return this.depositStatusIcon
      }
    },
    listKeys: async function () {
      let keys = []
      let totalBalance = 0
      let clients = this.installedServices.filter(s => s.service.includes('Validator'))
      if(clients && clients.length > 0){
        for (let client of clients) {
          //if there is already a list of keys ()
          if (client.config.keys && client.config.keys.length > 0 && !this.forceRefresh) {

            //update validator stats
            keys = await this.updateValidatorStats(client)

            //update totalBalance
            keys.forEach(key => {
              totalBalance += key.balance
            })

          } else {  //refresh validaotr list 
            this.listKeysTriggered = true
            let result = await ControlService.listValidators(client.config.serviceID)

            //update service config (pinia)
            client.config.keys = result.data ? result.data.map(e => e.validating_pubkey) : []

            if (client.config.keys && client.config.keys.length > 0) {
              //update validator stats
              keys = await this.updateValidatorStats(client)

              //update totalBalance
              keys.forEach(key => {
                totalBalance += key.balance
              })

              //update service datasets in Pinia store
              this.installedServices = this.installedServices.map(service => {
                if (service.id === client.id) {
                  return client
                }
                return service
              })
            }
          }

        }
        this.keys = keys.map(key => {
          return {
            ...key,
            showGrafitiText: false,
            showCopyText: false,
            showRemoveText: false,
            showExitText: false
          }
        })
        this.totalBalance = totalBalance
      }
    },
    async updateValidatorStats(client) {
      let keys = []
      try {
        let response = await axios.get("https://" + client.config.network + ".beaconcha.in/api/v1/validator/" + encodeURIComponent(client.config.keys.join()))
        let data = []
        data = data.concat(response.data.data)

        client.config.keys.forEach(key => {
          let info = data.find(k => k.pubkey === key)
          if (info) {
            keys.push({ key: key, validatorID: client.config.serviceID, icon: client.icon, status: info.status, balance: info.balance / 1000000000 })
          } else {
            keys.push({ key: key, validatorID: client.config.serviceID, icon: client.icon, status: "NA", balance: 0 })
          }
        })
        return keys
      } catch (err) {
        console.log("Couldn't fetch validator stats:\n", err)
        client.config.keys.forEach(key => {
          keys.push({ key: key, validatorID: client.config.serviceID, icon: client.icon, status: "NA", balance: 0 })
        })
        return keys
      }

    },
    importKey: async function () {
      await ControlService.importKey({
        files: this.keyFiles,
        password: this.password,
      });
      this.forceRefresh = true
      this.listKeys()
      this.password = "";
      this.insertFilePage = true;
      this.enterPasswordPage = false;
      this.passwordInputActive = false;
    },
    uploadFileHandler(event) {
      let uploadedFiles = event.target.files;
      if (uploadedFiles[0]["type"] === "application/json") {
        this.keyFiles.push(...uploadedFiles);
        this.insertFilePage = false;
        this.enterPasswordPage = true;
        this.isDragOver = false;
      }
    },
    dropFileHandler(event) {
      let droppedFiles = event.dataTransfer.files;
      if (droppedFiles[0]["type"] === "application/json") {
        this.keyFiles.push(...droppedFiles);
        this.insertFilePage = false;
        this.enterPasswordPage = true;
        this.isDragOver = false;
      }
    },
    removeKeyHandler(key_name) {
      this.keyFiles = this.keyFiles.filter((item) => item.name != key_name);
    },
    openUploadHandler() {
      this.$refs.fileInput.click();
    },
    confirmPasswordHandler() {
      this.passwordInputActive = true;
    },
    checkKeyExists() {
      if (this.keyFiles.length <= 0) {
        this.insertFilePage = true;
        this.enterPasswordPage = false;
        this.passwordInputActive = false;
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
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.keys-table-box {
  width: 96%;
  height: 93%;
  margin: 10px 10px 0 0;
  border: 4px solid #bfbfbf;
  border-radius: 20px;
  display: flex;
  justify-content: center;
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
  width: 19px;
  height: 20px;
  margin: 0 auto;
  cursor: pointer;
}

.option-box img:hover {
  border: 1px solid #72cbf8;
  border-radius: 3px;
  transform: scale(1.1);
}

.option-box img:active {
  border: 1px solid #0c6e9f;
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

.password-box,
.middle-icon {
  width: 60%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 6%;
  left: 2%;
}

.password-box img,
.middle-icon img {
  width: 30px;
  height: 30px;
}

.password-box .rename,
.password-box .folder,
.middle-icon .rename,
.middle-icon .folder {
  margin-right: 10px;
}

.password-box .filter,
.middle-icon .filter {
  margin-right: 20px;
}

.middle-icon .insert-key {
  width: 70%;
  height: 32px;
  background-color: #bfbfbf;
  border-radius: 40px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.password-box .enter-password {
  width: 70%;
  height: 32px;
  border: 1px solid #bfbfbf;
  background-color: #336666;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.password-box .enter-password span {
  color: rgb(227, 227, 227);
  font-size: 1.1rem;
  font-weight: 500;
}

.password-box .enter-password input {
  width: 80%;
  height: 60%;
  border: 1px solid #878787;
  border-radius: 35px 0 0 35px;
  background-color: #002828;
  outline-style: none;
  padding: 0;
  padding-left: 10px;
  position: absolute;
  left: 5px;
  font-size: 1.5rem;
  color: #fff;
  font-weight: 300;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.password-box .enter-password button {
  width: 20%;
  height: 100%;
  border: none;
  border-right: 1px solid #bfbfbf;
  border-left: 1px solid #bfbfbf;
  border-radius: 0 35px 35px 0;
  background-color: #3f4449;
  outline-style: none;
  position: absolute;
  right: 0;
  font-size: 0.7rem;
  color: #fff;
  font-weight: 400;
  cursor: pointer;
  box-shadow: inset 1px 1px 10px #33393e;
}

.password-box .enter-password button:hover {
  background-color: #23272a;
  box-shadow: none;
}

.password-box .enter-password button:active {
  background-color: #181b1d;
  box-shadow: inset 1px 1px 3px #070708;
}

.middle-icon .insert-key span {
  color: #3a3a3a;
  font-size: 1.1rem;
  font-weight: 700;
}

.middle-icon .insert-key img {
  width: 26px;
  height: 28px;
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
</style>
