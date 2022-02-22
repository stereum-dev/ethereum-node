<template>
  <section>
    <!-- test dovom -->

    <div class="test" style="border-style: none">
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
      <form @submit.prevent="login">
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
            <div class="three" @click.prevent="addModel">
              <img src="Img/icon/+.png" alt="" />
            </div>
            <div
              class="three"
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
            <label for="host">IP or HOSTNAME</label>
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
          <label v-show="keyAuth">KEYLOCATION</label>
          <label v-show="!keyAuth">PASSWORD</label>
          <input
            v-show="keyAuth"
            type="text"
            name="keylocation"
            id="keylocation"
            v-model="model.keylocation.value"
            @blur="checkInput(model.keylocation)"
          />
          <input
            v-show="!keyAuth"
            type="password"
            name="keylocation"
            id="keylocation"
            v-model="model.pass.value"
            @blur="checkInput(model.pass)"
          />
        </div>
        <div class="ssh">
          <label id="lbl" for="" style="margin-right: 10px">USE SSH KEY</label>
          <label class="switch">
            <input
              type="checkbox"
              v-model="model.useAuthKey"
              name="check-button"
              @change="changeLabel"
            />
            <span class="slider round"></span>
          </label>
        </div>
        <base-button id="login" @click="login">{{
          $t("formsetup.login")
        }}</base-button>
      </form>
    </div>
    <!-- test dovom -->
  </section>
</template>

<script>
import BaseDialog from "./BaseDialog.vue";
import ControlService from "@/store/ControlService";

export default {
  components: { BaseDialog },
  name: "FormSetup",
  emits: ["page"],
  data() {
    return {
      keyAuth: false,
      link: "stereumLogoExtern.png",
      stereumVersions: {},
      connections: [],
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
      imgTrash: "./Img/icon/TRASH CAN.png",
    };
  },
  created() {
    this.loadStoredConnections();
  },
  methods: {
    changeLabel() {
      this.keyAuth = !this.keyAuth;
    },
    setSelectedConnection(event) {
      this.selectedConnection = this.connections.find(
        (obj) => obj.name === event.target.value
      );
      console.log(this.selectedConnection);
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
      console.log(newConnection);
      this.connections.push(newConnection);

      this.selectedConnection = newConnection;
      this.selectedName = this.selectedConnection.name;

      ControlService.writeConfig({
        savedConnections: this.getstorableConnections(),
      });
    },
    getstorableConnections() {
      let storableConnections = [];
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
    deleteModel() {
      console.log(this.selectedConnection);
      let currSelected = this.selectedConnection.name;
      this.connections = this.connections.filter(function (conn) {
        return currSelected != conn.name;
      });
      ControlService.writeConfig({
        savedConnections: this.getstorableConnections(),
      });
      this.model.name.value = "";
      this.model.host.value = "";
      this.model.user.value = "";
      this.model.pass.value = "";
      this.model.keylocation.value = "";
      this.model.useAuthKey = false;
      this.keyAuth = false;
      this.loadStoredConnections();
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
      console.log(savedConnections);
      this.connections = savedConnections;
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
        this.imgTrash = "./Img/icon/Trash Can2.png";
      } else {
        this.imgTrash = "./Img/icon/Trash Can.png";
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
    login: async function () {
      try {
        await ControlService.connect({
          host: this.model.host.value,
          user: this.model.user.value,
          password: this.model.pass.value,
          sshKeyAuth: this.model.useAuthKey,
          keyfileLocation: this.model.keylocation.value,
        });
      } catch (err) {
        console.log(`${err.name} occurred:\n ${err.message}`);
        //stay on page if error occurs
        //  return;
      }
      this.$emit("page", "welcome-page");
    },
  },
};
</script>
<style scoped>
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
#container {
  width: 100%;
  border: 5px solid #3a3939;
  height: auto;
  background-color: #264c4c;
  opacity: 0.9;
}
.priority {
  z-index: 200;
}
.select-wrapper {
  width: 80%;
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

#header {
  border: 5px solid rgb(58, 58, 58);
  text-align: center;
  margin: 10px auto;
  max-width: 30rem;
  border-radius: 40px;
  padding: 0.5rem;
  background-color: #264c4c;
  color: #fff;
  opacity: 0.9;
}

div {
  text-align: center;
  margin: 1rem auto;
  max-width: 50rem;
  border-radius: 20px;
  padding: 0.3rem;
  border: 2px solid grey;
  position: relative;
  opacity: 95%;
}
#one {
  margin: 0;
  border: none;
  border-radius: 40px;
  background-color: #1a3a33;
  justify-content: space-between;
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
  width: 45px;
  margin-right: 10px;
  border-radius: 50%;
  outline-style: none;
  box-shadow: 0 0 3px 1px rgb(47, 46, 46);
}
.three:active {
  box-shadow: none;
}
.formGroup {
  margin: 0;
  height: 50px;
  padding: 5px;
  display: flex;
  border: none;
  justify-content: space-between;
  font-weight: bold;
}

.formGroup label {
  clear: both;
  font-size: large;
  font-weight: 900;
  margin-left: 10px;
  color: #fff;
}
.formGroup input {
  width: 60%;
  height: 20px;
  border: 6px solid #3a3939;
  border-radius: 40px;
  padding-left: 10px;
  font-weight: bold;
  outline-style: none;
}
.formGroup input:hover {
  border: 3px solid rgb(190, 242, 190);
}
#keyLocation {
  border: 5px solid #3a3939;
  border-radius: 40px;
  max-width: 30rem;
  background-color: #264c4c;
  display: flex;
  justify-content: space-between;
  height: 45px;
}
#keyLocation label {
  clear: both;
  font-size: large;
  font-weight: bold;
  color: #fff;
}
#keyLocation input {
  width: 60%;
  border-radius: 40px;
  padding-left: 10px;
  font-size: large;
  font-weight: bold;
  outline-style: none;
  border: 5px solid #3a3939;
}

#login {
  width: 100px;
  height: 55px;
  outline-style: none;
  border: 5px solid #3a3939;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 97%;
  background-color: #264c4c;
  box-shadow: 0 2px 8px rgba(179, 179, 179, 0.26);
}
#login:hover {
  box-shadow: none;
  border: none;
  background-color: #1b3737;
}
#login:active {
  border: none;
  box-shadow: inset 0 2px 5px 5px #172424;
}
input {
  cursor: pointer;
}

.ssh {
  display: flex;
  justify-content: space-between;
  width: 170px;
  min-width: 170px;
  height: 25px;
  background-color: rgb(48, 47, 47);
  border: none;
  color: #fff;
  position: absolute;
  left: 157px;
  top: 95%;
}
#lbl {
  align-self: center;
  padding-left: 10px;
  clear: both;
  font-weight: bold;
  font-size: 16px;
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
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 1px;
  bottom: 1px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #4ad376;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.errors input {
  border-color: red;
}
</style>
