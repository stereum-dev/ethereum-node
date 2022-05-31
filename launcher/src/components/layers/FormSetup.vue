<template>
  <div class="server-parent">
    <div class="error-box" v-if="errorMsgExisting"></div>
    <div class="error-modal" v-if="errorMsgExisting">
      <div class="title-box">
        <img src="../../../public/img/icon/no-connection.png" alt="icon" />
      </div>
      <div class="description">
        <span>{{ this.error }}</span>
      </div>
      <div class="btn-box">
        <button @click="closeErrorDialog">OK</button>
      </div>
    </div>
    <div class="anim" v-if="connectingAnimActive">
      <p>C</p>
      <p>O</p>
      <p>N</p>
      <p>N</p>
      <p>E</p>
      <p>C</p>
      <p>T</p>
      <p>I</p>
      <p>N</p>
      <p>G</p>
      <p>.</p>
      <p>.</p>
      <p>.</p>
    </div>
    <div class="server-box" style="border-style: none">
      <section id="header">
        <h2>{{ $t("formsetup.server") }}</h2>
      </section>

      <base-dialog
        v-if="bDialogVisible"
        @bDialogDis="hideBDialog"
        @bDialogOk="baseDialogDelete"
      >
        <template v-slot:title><h4 id="dialTitle">Warning!</h4></template>
        <template v-slot:des><h5>Are you sure recode Delete ?</h5></template>
        <template v-slot:cancel>Cancel</template>
        <template v-slot:ok>Delete</template>
      </base-dialog>
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
              <img src="../../../public/img/icon/PLUS_ICON.png" alt="icon" />
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
          <div class="formGroup" :class="{ errors: !model.name.isFilled }">
            <label for="servername">SERVERNAME</label>
            <input
              name="servername"
              id="servername"
              type="text"
              v-model="model.name.value"
              @blur="checkInput(model.name)"
            />
          </div>
          <div class="formGroup" :class="{ errors: !model.host.isFilled }">
            <label for="host">IP / HOSTNAME</label>
            <input
              name="host"
              id="iporhostname"
              type="text"
              v-model="model.host.value"
              @blur="checkInput(model.host)"
            />
          </div>
          <div class="formGroup" :class="{ errors: !model.user.isFilled }">
            <label for="user">USERNAME</label>
            <input
              name="user"
              id="username"
              v-model="model.user.value"
              @blur="checkInput(model.user)"
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
          <label v-if="keyAuth">KEYLOCATION</label>
          <label v-if="!keyAuth">PASSWORD</label>
          <input
            v-if="keyAuth"
            type="text"
            name="keylocation"
            id="keylocation"
            v-model="model.keylocation.value"
            @blur="checkInput(model.keylocation)"
          />
          <input
            v-if="!keyAuth"
            type="password"
            name="keylocation"
            id="keylocation"
            v-model="model.pass.value"
            @blur="checkInput(model.pass)"
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
        <button id="login" @click="login">
          {{ $t("formsetup.login") }}
        </button>
      </form>
    </div>
    <!-- test dovom -->
  </div>
</template>

<script>
import BaseDialog from "./BaseDialog.vue";
import ControlService from "@/store/ControlService";
import { mapGetters } from "vuex";

export default {
  components: { BaseDialog },
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
      errorMsgExisting: false,
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
    ...mapGetters({
      plugins: "installationPlugins",
      selectedPreset: "getSelectedPreset",
      allPlugins: "getAllPlugins",
    }),
  },
  methods: {
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
      this.errorMsgExisting = false;
      this.$router.push("/");
    },
    checkErrorMessage() {
      if (this.error.length > 0) {
        return true;
      }
    },
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
        this.errorMsgExisting = true;
        this.error = "Connection refused, please try again.";
        return;
      }

      if (await ControlService.checkStereumInstallation()) {
        let services = await ControlService.getServices();
        if (services && services.length > 0) {
          let constellation = services.map((service) => {
            return service.service
              .replace(/(Beacon|Validator|Service)/gm, "")
              .toUpperCase();
          });
          const includedPlugins = [];
          constellation.forEach((plugin) => {
            const buffer = this.allPlugins.filter(
              (element) => element.name === plugin
            );
            buffer.forEach((element) => includedPlugins.push(element));
          });
          this.$store.commit("mutatedSelectedPreset", {
            includedPlugins: includedPlugins,
          });
        }

        this.$router.push("/node");
      }

      this.$emit("page", "welcome-page");
    },
  },
};
</script>
<style scoped>
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
  border: 5px solid #686868;
  margin: 0 auto;
  width: 40%;
  max-width: 50%;
  height: 60%;
  border-radius: 40px;
  background-color: #234141;
  opacity: 0.9;
  box-shadow: 0 1px 3px 1px #1f3737;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#header h2 {
  width: 95%;
  max-width: auto;
  height: 50%;
  font-size: 1.4rem !important;
  font-weight: 800 !important;
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
  border: 5px solid #686868;
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
  margin: 0;
  border-radius: 40px;
  border: none;
}

select {
  width: 100%;
  height: 35px;
  border-radius: 40px;
  cursor: pointer;
  text-align-last: center;
  font-weight: bold;
}
.select-wrapper::after {
  position: absolute;
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
  padding: 0.5em 3.5em 0.5em 1em;
  /* reset */
  margin: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
}

/* arrows */
#one select {
  background-image: linear-gradient(
      45deg,
      transparent 50%,
      rgb(254, 254, 255) 50%
    ),
    linear-gradient(135deg, rgb(255, 255, 255) 50%, transparent 50%),
    linear-gradient(to right, #5d5d5d, #5d5d5d);
  background-position: calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px), 100% 0;
  background-size: 5px 5px, 5px 5px, 2.5em 2.5em;
  background-repeat: no-repeat;
}

select.classic:focus {
  background-image: linear-gradient(45deg, white 50%, transparent 50%),
    linear-gradient(135deg, transparent 50%, white 50%),
    linear-gradient(to right, gray, gray);
  background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em, 100% 0;
  background-size: 5px 5px, 5px 5px, 2.5em 2.5em;
  background-repeat: no-repeat;
  border-color: grey;
  outline: 0;
}
/* #one select {
  outline-style: none;
  font-size: 20px;
  text-align: center;
  padding: 0 auto;
} */
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
}
.formGroup {
  margin: 0;
  height: 50px;
  padding: 5px;
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
}

.formGroup label {
  clear: both;
  font-size: 1.1rem;
  font-weight: 700;
  margin-left: 10px;
  color: #cecece !important;
}
.formGroup input {
  width: 60%;
  height: 20px;
  background-color: #d8e1e1;
  border: 4px solid #3a3939;
  border-radius: 40px;
  padding-left: 10px;
  font-weight: bold;
  outline-style: none;
}
.formGroup input:hover {
  border: 4px solid gray;
}
#keyLocation {
  width: 67%;
  border: 5px solid #686868;
  border-radius: 18px;
  background-color: #234141;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 14%;
  box-shadow: 0 1px 3px 1px #182f2f;
  z-index: 95;
}
#keyLocation label {
  clear: both;
  font-size: 1.1rem;
  font-weight: 700;
  color: #cecece !important;
  margin-left: 24px;
}
#keyLocation input {
  width: 57%;
  margin-right: 16px;
  border-radius: 40px;
  padding-left: 10px;
  background-color: #b6c4c4;
  font-size: large;
  font-weight: bold;
  outline-style: none;
  border: 4px solid #363535;
}

#login {
  min-width: 120px;
  min-height: 50px;
  outline-style: none;
  padding: 10px;
  border: 5px solid #686868;
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
}

.ssh {
  width: 150px;
  min-width: 100px;
  height: 24px;
  background-color: #234141;
  border: 3px solid rgb(116, 116, 116);
  border-radius: 40px;
  color: #fff;
  position: absolute;
  left: 16.5%;
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
  width: 40px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
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
  height: 20px;
  border: 1px solid #228bb1;
  width: 20px;
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
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
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
  border-color: rgb(38, 38, 38);
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
  width: 30%;
  height: 40%;
  background-color: rgb(235, 235, 235);
  box-shadow: 0px 1px 3px 1px rgb(19, 19, 19);
  border-radius: 10px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 101;
}
.error-modal .title-box {
  width: 100%;
  height: 30%;
  background-color: rgb(213, 102, 102);
  border-radius: 9px 9px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 19%;
  height: 80%;
}
.error-modal .description {
  width: 80%;
  margin-top: 20px;
  text-align: center;
}
.error-modal .description span {
  width: 50%;
  color: rgb(55, 55, 55);
  font-size: 1.2rem;
  font-weight: 800;
  word-break: break-word;
  text-align: center;
}

.error-modal .btn-box {
  width: 100%;
  height: 30%;
  border-radius: 0 0 9px 9px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-box button {
  width: 30%;
  height: 60%;
  outline-style: none;
  border: 2px solid rgb(235, 115, 115);
  border-radius: 10px;
  color: #de897f;
  font-size: 1rem;
  font-weight: 800;
  box-shadow: 0px 1px 5px 1px rgb(97, 97, 97);
}
.btn-box button:hover {
  border: 2px solid rgb(235, 115, 115);
  box-shadow: 0px 0px 2px 1px rgb(97, 97, 97);
  color: #dd6456;
}
.btn-box button:active {
  box-shadow: none;
  background-color: #eb7373;
  color: #f7f7f7;
}
.anim {
  width: 100%;
  height: 100%;
  background-color: rgb(8, 8, 8);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
p {
  display: inline-block;
  text-transform: uppercase;
  text-align: center;
  font-size: 4em;
  font-family: arial;
  font-weight: 600;
  transform: scale(0.5);
  color: #121212;
  -webkit-text-stroke: 2px gray;
}
p:nth-child(1) {
  animation: hover 2s linear infinite;
  color: #44f2f2;
}

p:nth-child(2) {
  animation: hover 2s linear infinite 0.125s;
  color: #44f2f2;
}

p:nth-child(3) {
  animation: hover 2s linear infinite 0.25s;
  color: #44f2f2;
}

p:nth-child(4) {
  animation: hover 2s linear infinite 0.375s;
  color: #44f2f2;
}

p:nth-child(5) {
  animation: hover 2s linear infinite 0.5s;
  color: #44f2f2;
}

p:nth-child(6) {
  animation: hover 2s linear infinite 0.675s;
  color: #44f2f2;
}

p:nth-child(7) {
  animation: hover 2s linear infinite 0.75s;
  color: #44f2f2;
}

p:nth-child(8) {
  animation: hover 2s linear infinite 0.825s;
  color: #44f2f2;
}
p:nth-child(9) {
  animation: hover 2s linear infinite 0.9s;
  color: #44f2f2;
}
p:nth-child(10) {
  animation: hover 2s linear infinite 0.975s;
  color: #44f2f2;
}
p:nth-child(11) {
  animation: hover 2s linear infinite 1.125s;
  color: #44f2f2;
}
p:nth-child(12) {
  animation: hover 2s linear infinite 1.2s;
  color: #44f2f2;
}
p:nth-child(13) {
  animation: hover 2s linear infinite 1.275s;
  color: #44f2f2;
}

@keyframes hover {
  0% {
    transform: scale(0.5);
    color: #121212;
    -webkit-text-stroke: 2px #44f2f2;
  }

  20% {
    transform: scale(1);
    color: #121212;
    -webkit-text-stroke: 2px #e7da67;
  }

  50% {
    transform: scale(0.5);
    color: #121212;
    -webkit-text-stroke: 2px #60fbbb;
  }
}
</style>
