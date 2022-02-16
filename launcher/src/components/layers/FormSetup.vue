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
              <select @change="setTunnelsSelect($event)">
                <option
                  v-for="tunnel in tunnels"
                  :key="tunnel.name"
                  :value="tunnel.name"
                  @click="completeFiled"
                >
                  {{ tunnel.name }}
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
          <div class="formGroup" :class="{ errors: !serverName.isValid }">
            <label for="servername">SERVERNAME</label>
            <input
              name="servername"
              id="servername"
              type="text"
              :ref="serverName.val"
              :value="serverName.val"
              @blur="clearValidity('serverName')"
            />
          </div>
          <div class="formGroup" :class="{ errors: !host.isValid }">
            <label for="host">IP or HOSTNAME</label>
            <input
              name="host"
              id="iporhostname"
              type="text"
              v-model="host.val"
              @blur="clearValidity('host')"
            />
          </div>
          <div class="formGroup" :class="{ errors: !userName.isValid }">
            <label for="user">USERNAME</label>
            <input
              name="user"
              id="username"
              v-model="userName.val"
              @blur="clearValidity('userName')"
            />
          </div>
        </div>
        <div id="keyLocation" :class="{ errors: !pass.isValid }">
          <label for="keylocation">{{ sourceBase }}</label>
          <input
            :type="passType"
            name="keylocation"
            id="keylocation"
            v-model="pass.val"
            @blur="clearValidity('pass')"
          />
        </div>
        <div class="ssh">
          <label id="lbl" for="" style="margin-right: 10px">USE SSH KEY</label>
          <label class="switch">
            <input
              type="checkbox"
              v-model="model.sshKeyAuth"
              name="check-button"
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

export default {
  components: { BaseDialog },
  name: "FormSetup",
  props: ["bDialogDis"],
  emits: ["page"],
  data() {
    return {
      source: false,
      link: "stereumLogoExtern.png",
      stereumVersions: {},
      tunnels: [
        { name: "-------None-------", localPort: 0, dstPort: 0 },
        { name: "web-cc", localPort: 9081, dstPort: 8000 },
      ],
      model: { sshAuthKey: false },
      bDialogVisible: false,
      selectTunnelName: "",
      serverName: {
        val: "",
        isValid: true,
      },
      host: {
        val: "",
        isValid: true,
      },
      userName: {
        val: "",
        isValid: true,
      },
      pass: {
        val: "",
        isValid: true,
      },
      passType: "text",
      imgTrash: "./Img/icon/TRASH CAN.png",
    };
  },
  //props: {
  //   model: Object,
  //},

  methods: {
    sourceBase() {
      if (this.model.sshKeyAuth) {
        this.passType = "file";
        return "KEYFILE";
      } else {
        this.passType = "password";
        return "PASSWORD";
      }
    },
    mouseOver(val) {
      if (val === "over") {
        this.imgTrash = "./Img/icon/Trash Can2.png";
      } else {
        this.imgTrash = "./Img/icon/Trash Can.png";
      }
    },
    completeFiled() {
      console.log("s");
    },
    clearValidity(input) {
      this[input].isValid = true;
    },
    addModel(val) {
      this.checkVisibleInput();
      if (!this.isValidInput) {
        return;
      }
      const check = this.tunnels.find((obj) => obj.name === val.name);
      if (!check) {
        this.tunnels.unshift(val);
      } else {
        alert("Ready");
      }
    },
    deleteRow() {
      var record = [];
      const r = this.tunnels.find(
        (tunel) => tunel.name != this.selectTunnelName
      );
      record.push(r);
      this.tunnels = record;
    },
    setTunnelsSelect(val) {
      const select = val.target.value;
      const active = this.tunnels.find((tunnel) => tunnel.name === select);
      this.selectTunnelName = select;
      this.serverName.val = active.name;
      this.host.val = "active";
      this.userName.val = "";
      this.pass.val = "";
      console.log(this.active);
    },
    checkVisibleInput() {
      this.isValidInput = true;

      if (this.serverName.val === "") {
        this.serverName.isValid = false;
        this.isValidInput = false;
      }
      if (this.host.val === "") {
        this.host.isValid = false;
        this.isValidInput = false;
      }
      if (this.userName.val === "") {
        this.userName.isValid = false;
        this.isValidInput = false;
      }
      if (this.pass.val === "" && !this.model.sshAuthKey) {
        this.pass.isValid = false;
        this.isValidInput = false;
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
      this.deleteRow();
    },
    login() {
      this.checkVisibleInput();
      this.$emit("page", "welcome-page");
      if (this.isValidInput) {
        return;
      }
    },
    //es
    // async connect(e) {
    //   this.tunnels = [{ name: "web-cc", localPort: 9081, dstPort: 8000 }];
    //   try {
    //     await ControlService.connect(this.model);
    //   } catch (ex) {
    //     console.log(ex);
    //     this.$toasted.show(
    //       "Error connecting to server! Level: " +
    //         ex.level +
    //         " Message: " +
    //         ex.message
    //     );
    //     return;
    //   }

    //   const stereumStatus = await ControlService.inquire(this.model);

    //   if (!stereumStatus.exists)
    //     await ControlService.setup(stereumStatus.latestRelease);
    //   else {
    //     this.$toasted.show("Multiple Stereum Versions found!");
    //     this.stereumVersions = stereumStatus;
    //   }

    //   await ControlService.openTunnels(this.tunnels);
    //   await ControlService.disconnect();
    //   e.preventDefault();
    // },
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
  outline-style: none;
  font-size: 20px;
  text-align: center;
  padding: 0 auto;
}
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
  font-weight:900;
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
