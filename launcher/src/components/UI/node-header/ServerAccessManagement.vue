<template>
  <div class="dashboard-parent">
    <GenerateKeyModal v-if="generateModalShow" @generateKey="addKey" />
    <div class="management-title">server access management</div>
    <div class="management-info">
      <div class="management-info_box">
        <div class="management-info_box_row">
          <span>SERVER NAME</span><span>{{ selectedConnection.name }}</span>
        </div>
        <div class="management-info_box_row">
          <span>IP or HOSTNAME</span><span>{{ ipAddress }}</span>
        </div>
        <div class="management-info_box_row">
          <span>USERNAME</span><span>{{ selectedConnection.user }}</span>
        </div>
      </div>
      <div class="management-info_box">
        <div class="management-info_box_row">
          <span>MACHINENAME</span><span>{{ ServerName }}</span>
        </div>
        <div class="management-info_box_row">
          <span>PORT</span><span>{{ selectedConnection.port ? selectedConnection.port : 22 }}</span>
        </div>
        <div class="management-info_box_row" />
      </div>
    </div>
    <div class="login-info-box">
      <div class="login-info-box_info-part">
        <div class="helf-part">
          <div class="half-part_row">
            <span>PASSWORD</span>
            <div v-if="!chngPassword" class="btn-part">
              <div class="login-info-btn" @click="chngPassword = true">CHANGE PASSWORD</div>
            </div>
            <div v-else class="btn-part">
              <input
                v-model="newPass"
                :class="['chng-password', controlPass]"
                type="password"
                :placeholder="passmessage"
              />
              <div class="pass-btn-part">
                <div class="pass-btn accept" @click="acceptChangePass">
                  <img src="/img/icon/access-management/done.png" alt="" />
                </div>
                <div class="pass-btn deny" @click="denyPassChange">
                  <img src="/img/icon/access-management/close.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="half-part_row">
            <span>SSH Key</span>
            <div class="btn-part">
              <div class="login-info-btn" @click="generateModal">create a new key</div>
              <div class="login-info-btn" @click="openUploadHandler">
                add an existing key
                <input ref="fileInput" type="file" style="display: none" @change="previewFiles" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="key-info-part">
        <div v-for="(key, index) in keys" :key="index" class="key-row">
          <div class="name">{{ confirmIndexDelete[index] ? onAreYouSure : formatKey(key) }}</div>
          <div class="btn-box">
            <KeyRowBtn
              @delete-key="confirmDelete(key)"
              @are-you-sure="confirmKeyIndex(index)"
              @cancel-delete="cancelKeyIndex(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useControlStore } from "@/store/theControl";
import ControlService from "@/store/ControlService";
import KeyRowBtn from "./KeyRowBtn";
import GenerateKeyModal from "./GenerateKeyModal";
export default {
  components: { KeyRowBtn, GenerateKeyModal },
  data() {
    return {
      selectedConnection: {},
      confirmIndex: null,
      keys: [],
      confirmIndexDelete: [],
      onAreYouSure: "Are you sure you want to remove this SSH Key?",
      chngPassword: false,
      newPass: "",
      comparePass: [],
      keyLocation: "",
      passmessage: "Please enter a password",
      acceptedPass: "",
      passChk: false,
    };
  },
  computed: {
    ...mapWritableState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
      generateModalShow: "generateModalShow",
      deleteKey: "deleteKey",
    }),
    passSSHRow() {
      return !this.selectedConnection.useAuthKey ? "pass" : "ssh";
    },
    controlPass() {
      return this.passChk ? "denyPass" : "";
    },
  },
  mounted() {
    this.loadStoredConnections();
    this.readSSHKeyFile();
  },
  methods: {
    async readSSHKeyFile() {
      const keys = await ControlService.readSSHKeyFile();
      this.keys = keys;
    },
    formatKey(key) {
      let keyArray = key.split(" ");
      return `${keyArray[0]} ... ${keyArray.pop()}`;
    },
    loadStoredConnections: async function () {
      const savedConnections = await ControlService.readConfig();
      let selectedConnection = savedConnections.savedConnections.find((item) => item.host === this.ipAddress);
      this.selectedConnection = selectedConnection;
    },
    addKey(keys) {
      this.keys = keys;
    },
    //confirm delete key method
    async confirmDelete(key) {
      await ControlService.writeSSHKeyFile(this.keys.filter((item) => item !== key));
      this.readSSHKeyFile();
      this.confirmIndexDelete = [];
      this.confirmIndex = null;
    },
    // end confirm delete key method
    confirmKeyIndex(index) {
      this.confirmIndexDelete[index] = true;
      this.confirmIndex = index;
    },
    cancelKeyIndex(index) {
      this.confirmIndexDelete[index] = false;
      this.confirmIndex = null;
    },
    generateModal() {
      this.generateModalShow = !this.generateModalShow;
    },
    denyPassChange() {
      this.chngPassword = false;
      this.newPass = "";
      this.comparePass = [];
    },
    async acceptChangePass() {
      if (this.newPass === "") {
        this.passmessage = "Please enter a password";
      } else {
        if (this.comparePass.length < 1) {
          this.comparePass.push(this.newPass);
          this.newPass = "";
          this.passmessage = "please enter the password again";
          this.passChk = false;
        } else {
          const passwordEqual = this.comparePass.every((item) => item === this.newPass);

          if (passwordEqual) {
            this.acceptedPass = this.newPass;
            this.chngPassword = false;
            this.newPass = "";
            this.comparePass = [];
            this.passChk = false;
            await ControlService.changePassword(this.acceptedPass);
          } else {
            this.newPass = "";
            this.passmessage = "The passwords do not match";
            this.comparePass = [];
            this.passChk = true;
          }
        }
      }
    },
    async previewFiles(event) {
      const Path = event.target.files[0].path;
      let pathString = new String(Path);
      let result = pathString.toString();
      this.keyLocation = result;
      await ControlService.AddExistingSSHKey(this.keyLocation);
      this.readSSHKeyFile();
    },
    openUploadHandler() {
      this.$refs.fileInput.click();
    },
  },
};
</script>

<style scoped>
.denyPass {
  border: 2px solid #ff002a !important;
  background: rgba(255, 0, 42, 0.4);
}
.dashboard-parent {
  width: 100vw;
  height: 94.5vh;
  background-color: #33393e;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 49;
  border-radius: 10px;
  border: 5px solid #c1c1c1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.management-title {
  width: 85%;
  height: 14%;
  color: #eee;
  text-transform: uppercase;
  font-size: 300%;
  font-weight: 600;
  display: flex;
  border-bottom: 1px solid #c1c1c1;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2%;
}
.management-info {
  width: 95%;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #c1c1c1;
}
.management-info_box {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.management-info_box_row {
  width: 100%;
  height: 33%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2%;
  color: #eee;
}
.management-info_box_row span {
  width: 50%;
}
.management-info_box_row > span:nth-child(1) {
  font-size: 150%;
}
.login-info-box {
  width: 95%;
  height: 58%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.login-info-box_info-part {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 25%;
}

.helf-part {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

.half-part_row {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50%;
  color: #eee;
  padding-left: 1%;
}
.pass {
  height: 50%;
}
.ssh {
  height: 100%;
}
.half-part_row span {
  width: 25%;
}
.half-part_row > span:nth-child(1) {
  font-size: 150%;
}

.btn-part {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.chng-password {
  width: 85%;
  height: 70%;
  border-radius: 5px;
  border: none;
  font-size: 100%;
  padding-left: 2%;
  font-weight: 500;
  color: #000;
  margin-right: 2%;
}
.pass-btn-part {
  width: 10%;
  height: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border-radius: 5px;
}
.pass-btn {
  width: 45%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
}
.pass-btn:active {
  transform: scale(0.98);
}
.pass-btn img {
  width: 80%;
  height: 100%;
}
.accept {
  border: 1px solid #3ac4c4;
  background: #336666;
}
.deny {
  border: 1px solid #ff002a;
  background: #601616;
}
.login-info-btn {
  width: 20%;
  height: 60%;
  color: #eee;
  font-size: 70%;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 15px;
  background: #336666;
  text-transform: uppercase;
  box-shadow: 1px 1px 5px 1px rgb(45, 44, 44);
  margin-right: 2%;
}
.login-info-btn:hover {
  background: #35a835;
}
.login-info-btn:active {
  background: rgba(51, 102, 102, 0.6);
  border: none;
  box-shadow: none;
  transform: scale(0.98);
}
.key-info-part {
  width: 100%;
  height: 75%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  background: #242529;
  border: 1px solid grey;
  box-shadow: 1px 1px 6px 1px #001717;
  border-radius: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.name {
  font-size: 100%;
  font-weight: 500;
  overflow-x: scroll;
  white-space: nowrap;
}
.key-row {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 2%;
  color: #eee;
  background: #33393e;
  margin-top: 1%;
  border-radius: 5px;
  border: 1px solid #707070;
  box-shadow: 1px 1px 6px 1px #1d2525;
}
.btn-box {
  width: 7%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
</style>
