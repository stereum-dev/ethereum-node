<template>
  <div class="server-parent">
    <div class="error-box" v-if="errorMsgExists"></div>
    <div class="error-modal" v-if="errorMsgExists">
      <div class="title-box">
        <img
          src="../../../../public/img/icon/form-setup/form-error.png"
          alt="icon"
        />
      </div>
      <div class="description">
        <span>{{ this.error }}</span>
      </div>
      <div class="btn-box">
        <button @click="closeErrorDialog">OK</button>
      </div>
    </div>
    <div class="anim" v-if="connectingAnimActive">
      <img src="../../../../public/img/icon/form-setup/anim3.gif" alt="anim" />
    </div>
    <div class="server-box" style="border-style: none">
      <section id="header">
        <span>{{ $t("formsetup.server") }}</span>
      </section>

      <delete-modal
        v-if="bDialogVisible"
        @delete-server="baseDialogDelete"
        @remove-modal="hideBDialog"
      ></delete-modal>
      <form @submit.prevent.stop="login">
        <div id="container">
          <div id="one">
            <div class="select-wrapper">
              <select
                v-model="selectedName"
                @change="setSelectedConnection($event)"
              >
                <option value="" disabled>Select your Server-Connection</option>
                <option
                  v-for="connection in connections"
                  :key="connection.name"
                  :value="connection.name"
                >
                  {{ connection.name }}
                </option>
              </select>
            </div>
            <div class="three plus" @click.prevent="addModel">
              <img src="../../../../public/img/icon/PLUS_ICON.png" alt="icon" />
            </div>
            <div
              class="three trash"
              @click.prevent="showBDialog"
              @mouseover="mouseOver('over')"
              @mouseleave="mouseOver('leave')"
            >
              <img :src="imgTrash" alt="" />
            </div>
          </div>
          <div class="server-group" :class="{ errors: !model.name.isFilled }">
            <label for="servername">SERVERNAME</label>
            <input
              :class="{
                notFilled: !model.host.isFilled,
                isFilled: model.host.isFilled,
              }"
              name="servername"
              id="servername"
              type="text"
              v-model="model.name.value"
              @blur="checkInput(model.name)"
            />
          </div>
          <div class="server-group" :class="{ errors: !model.host.isFilled }">
            <label for="host">IP / HOSTNAME</label>
            <input
              :class="{
                notFilled: !model.host.isFilled,
                isFilled: model.host.isFilled,
              }"
              name="host"
              id="iporhostname"
              type="text"
              v-model="model.host.value"
              @blur="checkInput(model.host)"
              required
            />
          </div>
          <div
            class="server-group"
            :class="{
              errors: !model.user.isFilled,
              isFilled: model.user.isFilled,
            }"
          >
            <label for="user">USERNAME</label>
            <input
              :class="{
                notFilled: !model.user.isFilled,
                isFilled: model.user.isFilled,
              }"
              type="text"
              name="user"
              id="username"
              v-model="model.user.value"
              @blur="checkInput(model.user)"
              required
            />
          </div>
        </div>
        <div
          id="keyLocation"
          :class="{
            errors: keyAuth
              ? !model.keylocation.isFilled
              : !model.pass.isFilled,
          }"
        >
          <label class="keyLocation_title" v-if="keyAuth">KEYLOCATION</label>
          <label class="keyLocation_title" v-if="!keyAuth">PASSWORD</label>
          <label for="keylocation" class="ssvFile-label" v-if="keyAuth">
            {{ labelView }}
            <input
              type="file"
              name="keylocation"
              class="ssvBtn"
              id="keylocation"
              @change="previewFiles"
              @blur="checkInput(model.keylocation)"
              required
          /></label>
          <input
            :class="{
              notFilled: !model.pass.isFilled,
              isFilled: model.pass.isFilled,
            }"
            v-else
            type="password"
            name="keylocation"
            id="keylocation"
            v-model="model.pass.value"
            @blur="checkInput(model.pass)"
            required
          />
        </div>
        <div class="ssh">
          <label class="switch">
            <input
              type="checkbox"
              v-model="model.useAuthKey"
              name="check-button"
              @change="changeLabel"
            />
            <span class="slider round"></span>
          </label>
          <label id="lbl" for="" style="margin-right: 10px">USE SSH KEY</label>
        </div>
        <button id="login">
          {{ $t("formsetup.login") }}
        </button>
      </form>
    </div>
    <!-- test dovom -->
  </div>
</template>

<script>
import DeleteModal from "./DeleteModal.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";
import { useControlStore } from "../../../store/theControl";

export default {
  components: { DeleteModal },
  name: "FormSetup",
  emits: ["page"],
  data() {
    return {
      keyAuth: false,
      link: "stereumLogoExtern.png",
      connectingAnimActive: false,
      stereumVersions: {},
      connections: [],
      error: "",
      errorMsgExists: false,
      selectedName: "",
      bDialogVisible: false,
      model: {
        name: { value: "", isFilled: true },
        host: { value: "", isFilled: true },
        user: { value: "", isFilled: true },
        pass: { value: "", isFilled: true },
        keylocation: { value: "", isFilled: true },
        useAuthKey: false,
      },
      imgTrash: "./img/icon/TRASH_CAN.png",
    };
  },
  created() {
    this.loadStoredConnections();
  },
  computed: {
    ...mapWritableState(useClickInstall, {
      plugins: "presets",
      selectedPreset: "selectedPreset",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      allServices: "allServices",
    }),
    ...mapWritableState(useNodeHeader, {
      headerServices: "runningServices",
    }),
    ...mapWritableState(useControlStore, {
      ipAddress: "ipAddress",
    }),
    labelView() {
      if (this.model.keylocation.value === "") {
        return "";
      } else {
        return this.model.keylocation.value;
      }
    },
  },
  methods: {
    //path picker from the file input
    previewFiles(event) {
      const Path = event.target.files[0].path;
      let pathString = new String(Path);
      let result = pathString.toString();
      this.model.keylocation.value = result;
    },
    //finish
    changeLabel() {
      this.keyAuth = !this.keyAuth;
    },
    setSelectedConnection(event) {
      this.selectedConnection = this.connections.find(
        (obj) => obj.name === event.target.value
      );
      this.model.name.value = this.selectedConnection.name;
      this.model.host.value = this.selectedConnection.host;
      this.model.user.value = this.selectedConnection.user;
      this.model.keylocation.value = this.selectedConnection.keylocation;
      this.model.useAuthKey = this.selectedConnection.useAuthKey;
      this.keyAuth = this.selectedConnection.useAuthKey;
      this.model.pass.value = "";
    },
    addModel() {
      const newConnection = this.createConnection();
      if (
        !this.connections.find(
          (connection) => connection.name == this.model.name.value
        )
      ) {
        this.connections.push(newConnection);
        this.selectedConnection = newConnection;
        this.selectedName = this.selectedConnection.name;
        this.writeSettings();
      } else if (
        this.connections.find(
          (connection) => connection.name == this.model.name.value
        )
      ) {
        const index = this.connections.findIndex(
          (connection) => connection.name == this.model.name.value
        );
        this.connections[index] = newConnection;
        this.selectedConnection = newConnection;
        this.selectedName = this.selectedConnection.name;
        this.writeSettings();
      }
    },
    getstorableConnections() {
      const storableConnections = [];
      this.connections.forEach((e) => {
        storableConnections.push({
          name: e.name,
          host: e.host,
          user: e.user,
          keylocation: e.keylocation,
          useAuthKey: e.useAuthKey,
        });
      });
      return storableConnections;
    },
    deleteModel: async function () {
      const currSelected = this.selectedConnection.name;
      this.connections = this.connections.filter(function (conn) {
        return currSelected != conn.name;
      });
      await this.writeSettings();
      await this.loadStoredConnections();
      this.model.name.value = "";
      this.model.host.value = "";
      this.model.user.value = "";
      this.model.pass.value = "";
      this.model.keylocation.value = "";
      this.model.useAuthKey = false;
      this.keyAuth = false;
    },
    createConnection() {
      return {
        name: this.model.name.value,
        host: this.model.host.value,
        user: this.model.user.value,
        keylocation: this.model.keylocation.value,
        useAuthKey: this.model.useAuthKey,
      };
    },
    loadStoredConnections: async function () {
      const storageSavedConnections = await ControlService.readConfig();
      let savedConnections = [];
      if (
        storageSavedConnections !== undefined &&
        storageSavedConnections.savedConnections !== undefined
      ) {
        savedConnections = savedConnections.concat(
          storageSavedConnections.savedConnections
        );
      }
      this.connections = savedConnections;
    },
    writeSettings: async function () {
      const savedLanguage = (await ControlService.readConfig()).savedLanguage;
      ControlService.writeConfig({
        savedConnections: this.getstorableConnections(),
        savedLanguage: savedLanguage,
      });
    },
    checkInput(model) {
      if (model.value == "") {
        model.isFilled = false;
      } else {
        model.isFilled = true;
      }
    },

    mouseOver(val) {
      if (val === "over") {
        this.imgTrash = "./img/icon/TRASH_CAN2.png";
      } else {
        this.imgTrash = "./img/icon/TRASH_CAN.png";
      }
    },
    showBDialog() {
      this.bDialogVisible = true;
    },
    hideBDialog() {
      this.bDialogVisible = false;
    },
    hideDialog() {
      this.dialogVisible = false;
    },
    baseDialogDelete() {
      this.bDialogVisible = false;
      this.deleteModel();
    },
    closeErrorDialog() {
      this.error = "";
      this.errorMsgExists = false;
      this.$router.push("/");
    },
    // checkErrorMessage() {
    //   if (this.error.length > 0) {
    //     return true;
    //   }
    // },
    login: async function () {
      this.connectingAnimActive = true;
      try {
        await ControlService.connect({
          host: this.model.host.value,
          user: this.model.user.value,
          password: this.model.pass.value,
          sshKeyAuth: this.model.useAuthKey,
          keyfileLocation: this.model.keylocation.value,
        });
      } catch (err) {
        this.connectingAnimActive = false;
        this.errorMsgExists = true;
        this.error = "Connection refused, please try again.";
        if (
          typeof err === "string" &&
          new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(
            err.toLowerCase()
          )
        ) {
          this.error = "You need to change your password first";
        }
        return;
      }
      this.ipAddress = this.model.host.value;
      if (await ControlService.checkStereumInstallation()) {
        this.$router.push("/node");
      }
      this.$emit("page", "welcome-page");
    },
  },
};
</script>
<style scoped>
.ssvBtn {
  display: none;
}
.ssvFile-label {
  width: 57%;
  height: 80%;
  margin-right: 16px;
  border-radius: 40px;

  background: #dbdbdb;
  color: #242424 !important;
  font-size: 65%;
  font-weight: bold;
  outline-style: none;
  border: 2px solid #929292;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
}
.server-parent {
  width: 99%;
  height: 99%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.server-box {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 7% 14% 59% 20%;
}
#header {
  grid-column: 1/4;
  grid-row: 2/3;
  border: 5px solid #929292;
  margin: 0 auto;
  width: 40%;
  max-width: 50%;
  height: 59%;
  border-radius: 40px;
  background-color: #194747;
  opacity: 0.9;
  box-shadow: 0 1px 3px 1px #1f3737;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#header span {
  width: 95%;
  max-width: auto;
  height: 89%;
  font-size: 1.4rem !important;
  font-weight: 700 !important;
  color: #cecece !important;
  border: none;
  background-color: transparent;
  box-shadow: none;
  text-transform: uppercase;
}

#dialTitle {
  animation: blink 1s 1000000 alternate;
  font-weight: bold;
}
@keyframes blink {
  from {
    background-color: red;
  }
  to {
    background-color: orange;
  }
}
form {
  grid-column: 1/4;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
#container {
  width: 65%;
  height: 69%;
  padding: 10px;
  border: 5px solid #929292;
  border-radius: 25px;
  background-color: #234141;
  opacity: 0.9;
  box-shadow: 0 1px 3px 1px #1f3737;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.priority {
  z-index: 200;
}
.select-wrapper {
  width: 82%;
  height: 100%;
  border-radius: 40px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.select-wrapper::after {
  width: 50%;
  height: 100%;
}

select {
  width: 100%;
  height: 65%;
  border-radius: 40px;
  outline-style: none;
  cursor: pointer;
  text-align-last: center;
  font-weight: bold;
  padding: 0;
}
.select::after {
  position: absolute;
  top: -5px;
  width: 50%;
}

#one {
  width: 100%;
  height: 50px;
  margin: 0;
  border: none;
  border-radius: 40px;
  background-color: #1a3a33;
  justify-content: space-evenly;
  align-items: center;
  display: flex;
}
#one select {
  /* styling */
  outline-style: none;
  background-color: white;
  border-radius: 40px;
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.5em;
  /* reset */
  margin: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  color: #393939;
  font-weight: 800;
  font-size: 1rem;
}

#two {
  width: 70%;
  padding: 1rem;
  border-radius: 40px;
  float: left;
}
.three {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  border-radius: 50%;
  outline-style: none;
  box-shadow: 0 0 3px 1px rgb(149, 149, 149);
}
.three:active {
  box-shadow: none;
}
.plus:hover {
  background-color: green;
}
.trash:hover {
  background-color: rgb(230, 84, 81);
}
.three img {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.three:hover img {
  transform: scale(1.1);
  transition-duration: 100ms;
}
.three:active img {
  transform: scale(1);
  transition-duration: 100ms;
}
.server-group {
  margin: 0;
  height: 50px;
  padding: 5px;
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
}

.server-group label {
  clear: both;
  font-size: 1.1rem;
  font-weight: 700;
  margin-left: 10px;
  color: #dfdfdf !important;
}
.server-group input {
  width: 60%;
  height: 30px;
  background-color: #eaeaea;
  border: 2px solid #979797;
  border-radius: 40px;
  padding-left: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  outline-style: none !important;
  color: #242424;
}
.server-group input:hover {
  border: 2px solid rgb(54, 54, 54);
}
#keyLocation {
  width: 65%;
  border: 5px solid #929292;
  border-radius: 18px;
  background-color: #234141;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 14%;
  box-shadow: 0 1px 3px 1px #182f2f;
  z-index: 95;
}
.keyLocation_title {
  clear: both;
  font-size: 1.1rem;
  font-weight: 700;
  color: #cecece !important;
  margin-left: 24px;
}
#keyLocation input {
  width: 57%;
  height: 80%;
  margin-right: 16px;
  border-radius: 40px;
  padding-left: 10px;
  background-color: #dbdbdb;
  font-size: large;
  font-weight: bold;
  outline-style: none;
  border: 2px solid #929292;
}

#login {
  width: 120px;
  min-width: 120px;
  height: 48px;
  min-height: 45px;
  outline-style: none;
  padding: 5px;
  border: 5px solid #929292;
  border-radius: 35px;
  cursor: pointer;
  position: absolute;
  right: 8%;
  bottom: 7%;
  background-color: #264c4c;
  box-shadow: 0 1px 3px 1px rgb(23, 38, 32);
  font-size: 1.4rem;
  font-weight: 800;
  color: #cecece;
  display: flex;
  justify-content: center;
  align-items: center;
}
#login:hover {
  box-shadow: none;
  border: 5px solid #464646;
  background-color: #1b3737;
}
#login:active {
  box-shadow: inset 0 1px 5px 2px rgb(23, 38, 32);
}
input {
  cursor: pointer;
  outline-style: none;
}

.ssh {
  width: 150px;
  min-width: 100px;
  height: 33px;
  background-color: #234141;
  border: 3px solid #929292;
  border-radius: 40px;
  color: rgb(235, 235, 235);
  position: absolute;
  left: 17.5%;
  bottom: 15%;
  box-shadow: 0 1px 3px 1px rgb(23, 38, 32);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#lbl {
  width: 68%;
  text-align: center;
  clear: both;
  font-weight: bold;
  font-size: 0.8rem;
}
.switch {
  position: relative;
  display: inline-block;
  width: 29%;
  height: 89%;
  margin-left: 2px;
  margin-top: 3px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  height: 90%;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: rgb(216, 216, 216);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 19px;
  border: 1px solid #228bb1;
  width: 19px;
  left: 1px;
  bottom: 1px;
  background-color: #25acde;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  box-shadow: inset 1px 1px 3px 1px #70bfdc;
}

input:checked + .slider {
  background-color: #e6e6e6;
}

input:checked + .slider:before {
  -webkit-transform: translateX(19px);
  -ms-transform: translateX(19px);
  transform: translateX(19px);
  background-color: #51a76e;
  border: 1px solid #329f55;
  box-shadow: inset 1px 1px 5px #91d8a9;
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

input:optional {
  border-color: gray;
}
input:required {
  border-color: rgb(222, 207, 93);
}
input:invalid {
  border-color: rgb(233, 100, 100);
}
.error-box {
  width: 100%;
  height: 100%;
  background-color: rgb(8, 8, 8);
  opacity: 0.7;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 96;
}
.error-modal {
  width: 35%;
  height: 40%;
  background-color: rgb(232, 232, 232);
  box-shadow: 0px 1px 3px 1px rgb(19, 19, 19);
  border-radius: 10px;
  position: absolute;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  z-index: 101;
}
.error-modal .title-box {
  grid-column: 1/2;
  grid-row: 1/4;
  width: 100%;
  height: 100%;
  border-radius: 9px 9px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 90%;
  height: 75%;
  margin-left: 10px;
}
.error-modal .description {
  grid-column: 2/4;
  grid-row: 1/3;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.error-modal .description span {
  width: 100%;
  height: 50%;
  margin-right: 10px;
  color: #e81f05;
  font-size: 1.2rem;
  font-weight: 800;
  text-transform: uppercase;
  text-align: center;
}

.error-modal .btn-box {
  grid-column: 2/4;
  grid-row: 3;
  width: 100%;
  height: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-box button {
  width: 60%;
  height: 80%;
  margin-right: 10px;
  outline-style: none;
  background-color: #e81f05;
  border: 1px solid rgb(178, 178, 178);
  border-radius: 10px;
  color: #eae9e9;
  font-size: 1rem;
  font-weight: 800;
  box-shadow: 0px 1px 3px 1px #811515;
  transition-duration: 100ms;
}
.btn-box button:hover {
  transform: scale(1.1);
  border: 1px solid rgb(59, 11, 11);
}
.btn-box button:active {
  transform: scale(1);
  box-shadow: none;
}
.anim {
  width: 100%;
  height: 100%;
  background-color: rgb(8, 8, 8);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.9;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.anim img {
  width: 35%;
  height: 45%;
}

.error {
  color: #e43e3e;
  border-color: #e43e3e !important;
  box-shadow: none;
}
.notFilled {
  color: rgb(51, 51, 51);
  border-color: rgb(226, 182, 86) !important;
  box-shadow: none;
}
</style>
