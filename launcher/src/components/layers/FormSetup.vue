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
              <select v-model="selectedName" @change="setSelectedConnection($event)">
                <option value= "" disabled>
                  Select your Server-Connection
                </option>
                <option
                  v-for="connection in connections"
                  :key="connection.name"
                  :value="connection.name"
                >
                  {{ connection.name }}
                </option>
              </select>
            </div>
            <input
              class="three"
              type="image"
              src="./img/icon/+.png"
              @click="addModel"
            />
            <input
              class="three"
              type="image"
              :src="imgTrash"
              @click="showBDialog"
              @mouseover="mouseOver('over')"
              @mouseleave="mouseOver('leave')"
            />
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
        <div id="keyLocation" :class="{ errors: keyAuth ? !model.keylocation.isFilled: !model.pass.isFilled }">
          <label v-show="keyAuth" >KEYLOCATION</label>
          <label v-show="!keyAuth" >PASSWORD</label>
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
        <div class="ssh" style="border-style: none">
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
      selectedName: '',
      bDialogVisible: false,
      model: {
        name: {value: "", isFilled: true},
        host: {value: "", isFilled: true},
        user: {value: "", isFilled: true},
        pass: {value: "", isFilled: true},
        keylocation: {value: "", isFilled: true},
        useAuthKey: false
      },
      imgTrash: "./Img/icon/TRASH CAN.png",
    };
  },
  created() {
    this.loadStoredConnections();
  },
  methods: {
    changeLabel() {
      this.keyAuth = !this.keyAuth
    },
    setSelectedConnection(event){
      this.selectedConnection = this.connections.find(obj => obj.name === event.target.value);
      console.log(this.selectedConnection);
      this.model.name.value = this.selectedConnection.name;
      this.model.host.value = this.selectedConnection.host;
      this.model.user.value = this.selectedConnection.user;
      this.model.keylocation.value = this.selectedConnection.keylocation;
      this.model.useAuthKey = this.selectedConnection.useAuthKey;
      this.keyAuth = this.selectedConnection.useAuthKey;
      this.model.pass.value = "";

    },
    addModel(){
      const newConnection = this.createConnection();
      console.log(newConnection);
      this.connections.push(newConnection);

      this.selectedConnection = newConnection;
      this.selectedName = this.selectedConnection.name;

      ControlService.writeConfig({ savedConnections: this.getstorableConnections() });
    },
    getstorableConnections() {
      let storableConnections = [];
      this.connections.forEach(e => {
        storableConnections.push(
          {
            name: e.name,
            host: e.host,
            user: e.user,
            keylocation: e.keylocation,
            useAuthKey: e.useAuthKey
          }
        );
      });
      return storableConnections;
    },
    deleteModel(){
      console.log(this.selectedConnection);
      let currSelected = this.selectedConnection.name;
      this.connections = this.connections.filter(function(conn) {
          return currSelected != conn.name;
      });
      ControlService.writeConfig({ savedConnections: this.getstorableConnections() })
      this.model.name.value = "";
      this.model.host.value = "";
      this.model.user.value = "";
      this.model.pass.value = "";
      this.model.keylocation.value = "";
      this.model.useAuthKey = false;
      this.keyAuth = false
      this.loadStoredConnections();
    },
    createConnection(){
      return {
        name: this.model.name.value,
        host: this.model.host.value,
        user: this.model.user.value,
        keylocation: this.model.keylocation.value,
        useAuthKey: this.model.useAuthKey
      }
    },
    loadStoredConnections: async function(){
      const storageSavedConnections = await ControlService.readConfig();
      let savedConnections = [];
      if(storageSavedConnections !== undefined && storageSavedConnections.savedConnections !== undefined) {
        savedConnections = savedConnections.concat(storageSavedConnections.savedConnections);
      }
      console.log(savedConnections);
      this.connections = savedConnections;
    },
    checkInput(model) {
      if(model.value == ''){
        model.isFilled = false;
      }else{
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
     try{
      await ControlService.connect({
        host: this.model.host.value,
        user: this.model.user.value,
        password: this.model.pass.value,
        sshKeyAuth: this.model.useAuthKey,
        keyfileLocation: this.model.keylocation.value
      });
     } catch (err) {
       console.log(`${err.name} occurred:\n ${err.message}`)
       //stay on page if error occurs
       return;
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
.priority {
  z-index: 200;
}
.select-wrapper {
  overflow: hidden;
  text-align: center;
  width: 70%;
  padding: 0;
  border-radius: 40px;
  float: left;
}

select {
  width: 100%;
  align-items: center;
  padding: 1rem;
  border-radius: 40px;
  cursor: pointer;
}
.select-wrapper::after {
  position: absolute;
  width: 50%;
}

#header {
  text-align: center;
  margin: 2rem auto;
  max-width: 35rem;
  border-radius: 40px;
  padding: 0.5rem;
  background-color: #567891;
  color: #fff;
  border: 2px solid grey;
}

div {
  text-align: center;
  margin: 1rem auto;
  max-width: 40rem;
  border-radius: 20px;
  padding: 0.3rem;
  border: 2px solid grey;
  position: relative;
  opacity: 95%;
}
#one {
  margin: 1rem auto;
  max-width: 40rem;
  border-radius: 40px;
  padding: 1rem;
  background-color: #567891;
  justify-content: center;
  align-items: center;
  display: flex;
}
#one select {
  text-align: center;
}
#two {
  width: 70%;
  padding: 1rem;
  border-radius: 40px;
  float: left;
}
.three {
  width: 50px;
  float: left;
}
.formGroup {
  display: flex;
  background-color: #567891;
}

.formGroup label {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: auto;
  font-size: large;
  margin-left: 2px auto;
  color: #fff;
}
.formGroup input {
  width: 60%;
  border-radius: 40px;
  padding: 0.1rem;
  float: right;
  text-align: right;
}
#keyLocation {
  text-align: center;
  max-width: 35rem;
  border-radius: 20px;
  background-color: #567891;
  display: flex;
}
#keyLocation label {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: 40px;
  font-size: large;

  color: #fff;
}
#keyLocation input {
  width: 60%;
  border-radius: 40px;
  padding: 0.1rem;
  float: right;
  text-align: right;
  justify-content: center;
  display: flex;
}
#login {
  position: fixed;
  font-size: medium;
  top: 81vh;
  left: 86%;
  width: 100px;
  padding: 5px;
  resize: both;
}
input {
  cursor: pointer;
}

.ssh {
  margin-top: -20px;
  text-align: left;

  max-width: 35rem;
  border-radius: 40px;
  padding: 0.3rem;
  display: flex;
  color: #fff;
}
#lbl {
  /* Other styling... */
  text-align: right;
  clear: both;
  float: left;
  margin-right: 15px;
  font-weight: bold;
  font-size: 15pt;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
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
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
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
