<template>
  <div class="import-modal-parent">
    <div class="modal-opacity" @click="$emit('removeModal')"></div>
    <div class="import-modal-content">
      <div v-if="remoteURLInputActive" class="modal-content">
        <div class="title-box">
          <img src="../../../../public/img/icon/the-staking/stereum-error.png" alt="icon" />
        </div>
        <div class="remote-url-message">
          <span>Put in the URL of your Remote Signer or Choose a local one</span>
          <input v-model="urlInput" type="text" placeholder="http://My-Remote-Signer:1324" @focus="clearSelected" />
        </div>
        <div v-if="installedServices.filter((i) => i.service === 'Web3SignerService').length > 0" class="selectBox">
          <div class="display-service">
            <div
              v-for="service in installedServices.filter((i) => i.service === 'Web3SignerService')"
              :key="service.id"
              :class="{ selected: picked?.config?.serviceID === service?.config?.serviceID }"
              class="serviceBox"
              @click="selectWeb3Signer(service)"
            >
              <div class="service-icon">
                <img :src="service.icon" alt="icon" />
              </div>
              <div class="serviceDetails">
                <span class="name">{{ service.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-content">
        <div v-if="!remoteURLInputActive" class="modal-content-list">
          <div v-for="(item, index) in keyFiles" :key="index" class="key-tableRow">
            <span class="key-circle"></span>
            <span class="file-name">{{ item.substring(0, 16) + "..." + item.substring(item.length - 15) }}</span>
            <div class="key-remove-icon" @click="removeKeyHandler(index)">
              <img src="/img/icon/task-manager-icons/close3.png" alt="icon" />
            </div>
          </div>
        </div>
        <div v-if="!remoteURLInputActive" class="keyInput">
          <span>{{ keyFiles.length }} Keys</span>
          <input v-model="keyInput" />
          <div class="key-add-icon" @click="addKeyHandler">
            <img src="/img/icon/form-setup/plus.png" alt="icon" />
          </div>
        </div>
      </div>
      <div class="import-box">
        <div class="import-btn" :class="{ disabled: btnDisabled }" @click="switchhandler">
          <span>Submit</span>
        </div>
        <span class="close">{{ $t("exitValidatorModal.clickClose") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      keyFiles: [],
      picked: {},
      urlInput: "",
      keyInput: "",
      remoteURLInputActive: true,
      remoteSignerStats: {},
      btnDisabled: true,
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapWritableState(useStakingStore, {
      selectedValdiatorService: "selectedValdiatorService",
    }),
  },
  watch: {
    urlInput(val) {
      if (val) {
        this.btnDisabled = false;
      } else {
        this.btnDisabled = true;
      }
    },
    picked(val) {
      if (val.id) {
        this.btnDisabled = false;
      } else {
        this.btnDisabled = true;
      }
    },
  },
  methods: {
    async switchhandler() {
      if (this.remoteURLInputActive) {
        this.btnDisabled = true;
        this.remoteSignerStats = await ControlService.checkRemoteKeys({
          url: this.urlInput,
          serviceID: this.picked?.config?.serviceID,
        });
        this.btnDisabled = false;
        if (this.remoteSignerStats.error) {
          console.log(this.remoteSignerStats.error);
        } else {
          this.keyFiles = this.remoteSignerStats.keys;
        }
        this.remoteURLInputActive = false;
      } else {
        let args = structuredClone({
          serviceID: this.selectedValdiatorService.config.serviceID,
          pubkeys: this.keyFiles,
          url: this.remoteSignerStats.url,
        });
        this.$emit("importRemoteKey", args);
      }
    },
    removeKeyHandler(index) {
      this.keyFiles.splice(index, 1);
    },
    addKeyHandler() {
      const pubkey = this.keyInput.trim();
      if (pubkey && /^0x[a-fA-F0-9]{96}$/g.test(pubkey) && !this.keyFiles.includes(pubkey)) {
        this.keyFiles.push(pubkey);
      }
      this.keyInput = "";
    },
    selectWeb3Signer(service) {
      if (this.picked.id) {
        this.picked = {};
      } else {
        this.picked = structuredClone(service);
      }
      this.urlInput = "";
    },
    clearSelected() {
      this.picked = {};
    },
  },
};
</script>
<style scoped>
.selectBox {
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selectBox .display-service {
  width: 100%;
  height: 95%;
  background-color: #3b3b3b;
  border-radius: 5px;
  padding: 2px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.selectBox .display-service .serviceBox {
  width: 30%;
  height: 90%;
  background-color: #1c2023;
  border: 1px solid #1c2023;
  box-sizing: border-box;
  margin-left: 4px;
  padding: 2px;
  border-radius: 3px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.selectBox .display-service .selected {
  border: 3px solid #98bfdf;
}

.display-service .serviceBox .service-icon {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.selectBox .display-service .serviceBox:hover {
  background-color: #272c30;
  border: 1px solid #98bfdf;
  transition-duration: 0.1s;
}

.selectBox .display-service .serviceBox:active {
  background-color: #1c2023;
  border: 1px solid #1c2023;
}

.display-service .serviceBox .serviceDetails {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.display-service .serviceBox .serviceDetails .name {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgb(179, 179, 179);
}

.import-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 0;
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-opacity {
  width: 100%;
  height: 91%;
  background-color: black;
  border-radius: 0 20px 0 0;
  position: fixed;
  left: 0;
  bottom: 0;
  opacity: 0.7;
  z-index: 501;
}

.import-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 22%;
  background-color: #336666;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 1000;
}

.title-box {
  width: 100%;
  height: 35%;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-box img {
  margin-top: 5%;
  width: 25%;
}

.remote-url-message {
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.remote-url-message p {
  width: 85%;
  color: rgb(156, 156, 156);
  font-size: 0.7rem;
  font-weight: 700;
  word-break: break-all;
  text-align: center;
}

.remote-url-message span {
  color: rgb(197, 197, 197);
  font-size: 1rem;
  font-weight: 700;
  margin-top: 5px;
  text-align: center;
  text-transform: uppercase;
}

.remote-url-message input {
  height: 100%;
  width: 95%;
  margin-top: 5px;
  text-align: left;
  border-radius: 10px;
  color: #1c2023;
  padding-left: 2%;
}

/* .remote-url-message span {
  color: rgb(195, 195, 195);
  font-size: 1rem;
  font-weight: 700;
} */
.import-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 502;
}

.import-btn {
  width: 30%;
  height: 50%;
  border-radius: 10px;
  border: 1px solid #8f8f8f;
  background-color: #1c2023;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.import-btn:hover {
  transform: scale(1.08);
  transition-duration: 150ms;
  box-shadow: 0 1px 5px 1px rgb(35, 59, 53);
}

.import-btn:active {
  transform: scale(1);
  box-shadow: none;
}

.close {
  color: rgba(136, 6, 6, 0.588);
  font-size: 0.7rem;
  font-weight: 500;
  align-self: center;
}

.modal-content {
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.modal-content .keyInput {
  width: 100%;
  display: grid;
  grid-template-columns: 10% 75% 1%;
}

.modal-content .keyInput input {
  width: 100%;
  grid-column: 2/3;
}

.modal-content .keyInput span {
  width: 100%;
  grid-column: 2/3;
  color: rgb(197, 197, 197);
}

.modal-content .keyInput .key-add-icon {
  grid-column: 4/4;
  width: 30%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #8f8f8f;
  background-color: #d4d4d4;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.modal-content .keyInput .key-add-icon img {
  width: 90%;
}

.modal-content .keyInput input {
  height: 100%;
  padding-left: 2%;
  border-radius: 30px;
  background-color: #d4d4d4;
}

.modal-content-list {
  margin-top: 5px;
  padding: 0 5px;
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #7a7a7a;
  border-radius: 10px;
}

.key-tableRow {
  width: 100%;
  margin: 5px auto 0 auto;
  display: grid;
  grid-template-columns: 4% 64% 28% 4%;
  grid-template-rows: 100%;
  background-color: #d4d4d4;
  border-radius: 30px;
  padding: 1px;
  padding-right: 5px;
}

.key-tableRow .key-remove-icon {
  cursor: pointer;
  grid-column: 4/5;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  border: 1px solid #4a4a4a !important;
  border-radius: 50px !important;
  width: 100% !important;
  height: 90% !important;
  padding: 1px;
  background-color: #343434;
  justify-self: center;
  align-self: center;
}

.key-tableRow .key-remove-icon img {
  width: 60% !important;
  height: 60% !important;
}
</style>
