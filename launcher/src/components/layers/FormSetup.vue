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
        <div class="ssh" style="border-style: none">
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
  top: 81vh;
  left: 86%;
  width: 100px;
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
