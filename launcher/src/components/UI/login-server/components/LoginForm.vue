<template>
  <div class="col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12">
    <div
      class="col-start-1 col-span-full row-start-1 row-span-1 bg-[#264744] flex justify-center items-center rounded-t-md"
    >
      <span class="text-2xl text-gray-300 font-bold">{{ $t("formsetup.server") }}</span>
    </div>

    <IpScanModal
      v-if="ipScanModal"
      :btn-state="btnSearchState"
      :scanned-ip="foundIp"
      @close-ipscan="ipScanModal = false"
      @btn-function="scanFunction"
    />
    <div v-if="alertBox" class="alert animate__animated animate__flipInX">
      {{ $t("formsetup.fillFields") }}
    </div>

    <div
      v-if="connectingAnimActive"
      class="col-start-1 col-span-full row-start-1 row-span-full flex flex-col justify-center items-center z-20"
    >
      <div class="w-full h-full absolute inset-0 bg-black rounded-md opacity-80"></div>
      <div class="w-full h-full flex flex-col justify-center items-center space-y-4 z-50">
        <img src="/img/icon/form-setup/anim3.gif" alt="anim" />
        <div
          class="w-[150px] h-12 bg-red-500 py-2 px-4 rounded-full shadow-md shadow-[#161515] hover:scale-110 active:scale-100 hover:bg-red-700 flex justify-center items-center cursor-pointer transition-all duration-200 ease-in-out"
          @click="cancelLogin"
        >
          <span class="text-gray-200 text-xl font-semibold uppercase">Cancel</span>
        </div>
      </div>
    </div>
    <div class="col-start-4 col-end-22 row-start-3 row-end-11 bg-[#1a2e2c] rounded-lg p-4">
      <RemoveModal v-if="bDialogVisible" @remove-handler="baseDialogDelete" @close-window="hideBDialog" />
      <ErrorModal v-if="errorMsgExists" :description="error" @close-window="closeErrorDialog" />
      <form
        class="w-full h-full p-1 bg-[#305c59] col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-12 grid-rows-7 gap-y-2"
        @submit.prevent.stop="login"
      >
        <div
          class="w-full col-start-1 col-span-full row-start-1 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full"
        >
          <div class="col-start-1 col-span-10 h-full">
            <select
              v-model="selectedName"
              class="w-full h-full rounded-full px-2 text-md text-gray-800 font-semibold"
              @change="setSelectedConnection($event)"
            >
              <option value="" disabled>Select your Server-Connection</option>
              <option v-for="connection in connections" :key="connection.name" :value="connection.name">
                {{ connection.name }}
              </option>
            </select>
          </div>
          <div
            class="w-8 h-8 bg-slate-500 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-400 justify-self-end"
            @click.prevent="addModel"
          >
            <img
              class="w-6 h-6 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200"
              src="/img/icon/PLUS_ICON.png"
              alt="icon"
              @mousedown.prevent
            />
          </div>
          <div
            class="w-8 h-8 bg-slate-500 rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-400 justify-self-end"
            @click.prevent="showBDialog"
            @mouseover="mouseOver('over')"
            @mouseleave="mouseOver('leave')"
          >
            <img
              class="w-6 h-6 hover:scale-110 active:scale-100 transition-all ease-in-out duration-200"
              :src="imgTrash"
              alt=""
              @mousedown.prevent
            />
          </div>
        </div>
        <div
          class="w-full col-start-1 col-span-full row-start-2 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full"
          :class="{ errors: !model.name.isFilled }"
        >
          <span class="w-full col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
            $t("formsetup.servername")
          }}</span>

          <input
            v-model="model.name.value"
            class="col-start-4 col-span-full w-full h-full rounded-full px-2"
            :class="{
              notFilled: !model.host.isFilled,
              isFilled: model.host.isFilled,
            }"
            name="servername"
            type="text"
            @blur="checkInput(model.name)"
          />
        </div>
        <div
          class="w-full col-start-1 col-span-full row-start-3 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full"
          :class="{ errors: !model.host.isFilled }"
        >
          <span class="w-full col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
            $t("formsetup.iphost")
          }}</span>

          <div
            class="col-start-4 col-span-1 w-8 h-8 rounded-full border-4 border-slate-500 bg-gray-200 flex justify-center items-center p-1 cursor-pointer hover:border-slate-400 shadow-md shadow-[#1c2122]"
            @click="ipScanModal = true"
          >
            <img class="w-4 h-4 hover:scale-110 active:scale-100" src="/img/icon/form-setup/local-lan.png" alt="" />
          </div>
          <input
            v-model="model.host.value"
            class="col-start-5 col-span-7 w-full h-full rounded-l-full border-r border-gray-400 px-2"
            :class="{
              notFilled: !model.host.isFilled,
              isFilled: model.host.isFilled,
            }"
            name="host"
            type="text"
            required
            @blur="checkInput(model.host)"
          />
          <input
            v-model="model.port.value"
            class="col-start-12 col-span-1 w-full h-full self-center flex justify-center items-center bg-gray-300 rounded-r-full cursor-pointer px-1"
            :class="{
              notFilled: !model.port.isFilled,
              isFilled: model.port.isFilled,
            }"
            type="text"
            placeholder="22"
            optional
            @blur="checkInput(model.port)"
          />
        </div>
        <div
          class="w-full col-start-1 col-span-full row-start-4 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full"
          :class="{
            errors: !model.user.isFilled,
            isFilled: model.user.isFilled,
          }"
        >
          <span class="w-full col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
            $t("formsetup.username")
          }}</span>

          <input
            v-model="model.user.value"
            class="col-start-4 col-span-full w-full h-full rounded-full px-2"
            :class="{
              notFilled: !model.user.isFilled,
              isFilled: model.user.isFilled,
            }"
            type="text"
            name="user"
            required
            @blur="checkInput(model.user)"
          />
        </div>

        <Transition name="slide-up">
          <div
            v-if="keyAuth"
            class="col-start-1 col-span-full row-start-5 row-span-2 gap-y-2 grid grid-cols-12 grid-rows-2"
          >
            <div
              class="w-full col-start-1 col-span-full row-start-1 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full cursor-default"
              :class="{
                errors: keyAuth ? !model.keylocation.isFilled : !model.pass.isFilled,
              }"
            >
              <span class="col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
                $t("formsetup.keylocation")
              }}</span>

              <input
                v-model="model.keylocation.value"
                class="col-start-4 col-span-8 w-full h-full rounded-l-full px-2"
                type="text"
                name="keylocation"
                required
                @blur="checkInput(model.keylocation)"
              />
              <div
                class="col-start-12 col-span-1 bg-gray-300 rounded-r-full flex justify-center items-center"
                @click="openUploadHandler"
              >
                <input ref="fileInput" type="file" style="display: none" @change="previewFiles" />
                <img class="w-4 h-4" src="/img/icon/form-setup/plus.png" />
              </div>
            </div>
            <div
              class="w-full col-start-1 col-span-full row-start-2 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full cursor-default"
              :class="{
                errors: keyAuth ? !model.keylocation.isFilled : !model.passphrase.isFilled,
              }"
            >
              <span class="col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
                $t("formsetup.KeyPassphrase")
              }}</span>
              <input
                v-model="model.passphrase.value"
                class="col-start-4 col-span-8 w-full h-full rounded-l-full px-2"
                :class="{
                  notFilled: !model.passphrase.isFilled,
                  isFilled: model.passphrase.isFilled,
                }"
                :type="inputType"
                name="passphrase"
                @blur="checkInput(model.passphrase)"
              />
              <div
                class="col-start-12 col-span-1 w-full h-full self-center flex justify-center items-center bg-gray-300 rounded-r-full cursor-pointer px-1"
                @click="toggleShowPassword"
              >
                <img class="w-6 h-6" src="/img/icon/form-setup/eye.png" alt="eyeIcon" />
              </div>
            </div>
          </div>
          <div
            v-else
            class="w-full col-start-1 col-span-full row-start-5 row-span-1 h-12 bg-[#1a2e2c] p-2 grid grid-cols-12 rounded-full cursor-default"
            :class="{
              errors: keyAuth ? !model.keylocation.isFilled : !model.pass.isFilled,
            }"
          >
            <span class="w-full col-start-1 col-span-3 text-sm text-gray-300 font-semibold self-center pl-2">{{
              $t("formsetup.password")
            }}</span>

            <input
              v-model="model.pass.value"
              class="col-start-4 col-span-8 w-full h-full rounded-l-full px-2"
              :class="{
                notFilled: !model.pass.isFilled,
                isFilled: model.pass.isFilled,
              }"
              :type="inputType"
              name="keylocation"
              required
              @blur="checkInput(model.pass)"
            />
            <div
              class="col-start-12 col-span-1 w-full h-full self-center flex justify-center items-center bg-gray-300 rounded-r-full cursor-pointer"
              @click="toggleShowPassword"
            >
              <img class="w-6 h-6" src="/img/icon/form-setup/eye.png" alt="eyeIcon" />
            </div>
          </div>
        </Transition>
        <div
          class="w-full h-8 col-start-5 col-span-4 justify-self-center self-end row-start-7 row-span-1 bg-[#1a2e2c] p-1 rounded-full flex justify-between items-center"
        >
          <span class="w-fit text-gray-300 font-semibold text-sm ml-1">{{ $t("formsetup.usessh") }}</span>

          <label
            for="AcceptConditions"
            class="relative h-6 w-12 cursor-pointer [-webkit-tap-highlight-color:_transparent]"
          >
            <input
              id="AcceptConditions"
              v-model="model.useAuthKey"
              type="checkbox"
              class="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
              @change="changeLabel"
            />

            <span
              class="absolute inset-y-0 start-0 z-10 m-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"
            >
              <svg
                data-unchecked-icon
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>

              <svg
                data-checked-icon
                xmlns="http://www.w3.org/2000/svg"
                class="hidden h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>

            <span class="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500"></span>
          </label>
        </div>
        <button
          class="w-[150px] h-14 absolute bottom-4 right-4 text-center bg-[#1a2e2c] rounded-full text-gray-200 font-semibold text-xl capitalize hover:bg-[#264744] transition-all hover:scale-105 active:scale-100 hover:shadow-md active:shadow-none hover:shadow-gray-800"
        >
          {{ $t("formsetup.login") }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import IpScanModal from "./IpScanModal.vue";
import RemoveModal from "./RemoveModal.vue";
import ErrorModal from "./ErrorModal.vue";
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeHeader } from "@/store/nodeHeader";
import { useServices } from "@/store/services";

export default {
  name: "FormSetup",
  components: { RemoveModal, IpScanModal, ErrorModal },
  emits: ["page"],
  data() {
    return {
      abortController: new AbortController(),
      scannedCounter: 0,
      btnSearchState: "search",
      ipScanModal: false,
      devices: [],
      foundIp: this.$t("ipScanModal.clickSearch"),
      alertBox: false,
      sshPort: null,
      keyAuth: false,
      link: "stereumLogoExtern.png",
      connectingAnimActive: false,
      stereumVersions: {},
      connections: [],
      error: "",
      errorMsgExists: false,
      selectedName: "",
      bDialogVisible: false,
      showPassword: false,
      noIpFound: this.$t("ipScanModal.noIpFound"),
      model: {
        name: { value: "", isFilled: true },
        host: { value: "", isFilled: true },
        user: { value: "", isFilled: true },
        port: { value: "", isFilled: true },
        pass: { value: "", isFilled: true },
        keylocation: { value: "", isFilled: true },
        passphrase: { value: "", isFilled: true },
        useAuthKey: false,
      },
      imgTrash: "./img/icon/TRASH_CAN.png",
    };
  },

  computed: {
    inputType() {
      return this.showPassword ? "text" : "password";
    },
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
    labelView() {
      if (this.model.keylocation.value === "") {
        return "";
      } else {
        return this.model.keylocation.value;
      }
    },
  },

  watch: {
    devices() {
      if (this.devices.length < 1) {
        this.foundIp = this.noIpFound;
        this.btnSearchState = "search";
      } else if (this.devices.length == 1) {
        this.foundIp = this.devices[0].ip;
        this.btnSearchState = "copy";
      }
    },
  },
  created() {
    this.loadStoredConnections();
  },
  methods: {
    scanFunction() {
      if (this.scannedCounter == 0 && this.btnSearchState === "search") {
        this.scannedCounter++;
        this.startScaning();
      } else if (this.btnSearchState === "search") {
        this.startScaning();
      } else if (this.btnSearchState === "pending") {
        return "";
      } else if (this.btnSearchState === "copy") {
        this.copyIp(this.foundIp);
      }
      return "";
    },
    async copyIp(arg) {
      await navigator.clipboard.writeText(arg);
    },
    startScaning() {
      this.btnSearchState = "pending";
      this.foundIp = "Searching...";
      this.IpScanLan1();
    },
    async IpScanLan1() {
      try {
        let res = await ControlService.IpScanLan();
        this.devices = res;
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },

    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    openUploadHandler() {
      this.$refs.fileInput.click();
    },
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
      if (this.keyAuth === true) {
        this.model.pass.value = "";
      } else {
        this.model.keylocation.value = "";
      }
    },
    setSelectedConnection(event) {
      this.selectedConnection = this.connections.find((obj) => obj.name === event.target.value);
      this.model.name.value = this.selectedConnection.name;
      this.model.host.value = this.selectedConnection.host;
      this.model.user.value = this.selectedConnection.user;
      this.model.port.value = this.selectedConnection.port;
      this.model.keylocation.value = this.selectedConnection.keylocation;
      this.model.useAuthKey = this.selectedConnection.useAuthKey;
      this.keyAuth = this.selectedConnection.useAuthKey;
      this.model.pass.value = "";
      this.model.passphrase.value = "";
    },
    addModel() {
      const newConnection = this.createConnection();
      if (newConnection.name !== "" && newConnection.host !== "" && newConnection.user !== "") {
        if (!this.connections.find((connection) => connection.name == this.model.name.value)) {
          this.connections.push(newConnection);
          this.selectedConnection = newConnection;
          this.selectedName = this.selectedConnection.name;
          this.writeSettings();
        } else if (this.connections.find((connection) => connection.name == this.model.name.value)) {
          const index = this.connections.findIndex((connection) => connection.name == this.model.name.value);
          this.connections[index] = newConnection;
          this.selectedConnection = newConnection;
          this.selectedName = this.selectedConnection.name;
          this.writeSettings();
        }
      } else {
        this.alertBox = true;
        setTimeout(() => {
          this.alertBox = false;
        }, 1500);
      }
    },
    getstorableConnections() {
      const storableConnections = [];
      this.connections.forEach((e) => {
        storableConnections.push({
          name: e.name,
          host: e.host,
          user: e.user,
          port: e.port,
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
      this.model.port.value = "";
      this.model.pass.value = "";
      this.model.keylocation.value = "";
      this.model.useAuthKey = false;
      this.keyAuth = false;
      this.model.passphrase.value = "";
    },
    createConnection() {
      return {
        name: this.model.name.value,
        host: this.model.host.value,
        user: this.model.user.value,
        port: this.model.port.value,
        keylocation: this.model.keylocation.value,
        useAuthKey: this.model.useAuthKey,
      };
    },
    loadStoredConnections: async function () {
      const storageSavedConnections = await ControlService.readConfig();
      let savedConnections = [];
      if (storageSavedConnections !== undefined && storageSavedConnections.savedConnections !== undefined) {
        savedConnections = savedConnections.concat(storageSavedConnections.savedConnections);
      }
      this.connections = savedConnections;
    },
    writeSettings: async function () {
      const config = await ControlService.readConfig();
      ControlService.writeConfig({
        ...config,
        savedConnections: this.getstorableConnections(),
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
      this.abortController = new AbortController();
      this.connectingAnimActive = true;
      try {
        await ControlService.connect({
          host: this.model.host.value,
          user: this.model.user.value,
          port: this.model.port.value,
          password: this.model.pass.value,
          sshKeyAuth: this.model.useAuthKey,
          keyfileLocation: this.model.keylocation.value,
          passphrase: this.model.passphrase.value,
          signal: this.abortController.signal,
        });

        if (this.abortController.signal.aborted) return;
      } catch (err) {
        this.connectingAnimActive = false;
        this.errorMsgExists = true;
        this.error = "Connection refused, please try again.";
        this.model.pass.value = "";
        if (typeof err === "string" && new RegExp(/^(?=.*\bchange\b)(?=.*\bpassword\b).*$/gm).test(err.toLowerCase())) {
          this.error = "You need to change your password first";
        }
        return;
      }
      if (await ControlService.checkStereumInstallation()) {
        this.$router.push("/node");
      } else {
        this.$router.push("/welcome");
      }
    },
    cancelLogin() {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.connectingAnimActive = false;
      this.errorMsgExists = false;
      this.model.pass.value = "";
    },
  },
};
</script>
<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
select option {
  background-color: white;
  margin-bottom: 1px;
  cursor: pointer;
  padding: 0.5em;
  border-width: 0;
}
.alert {
  width: 40%;
  height: 20%;
  background-color: #1e2429;
  border-radius: 20px;
  position: absolute;
  z-index: 7;
  top: 30%;
  border: 3px solid #bb1010;
  color: #ddbfbf;
  font-size: 135%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
.passwordShow {
  display: flex;
  position: absolute;
  left: 92%;
  cursor: pointer;
}
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
  cursor: default;
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
  width: max-content;
  height: 59%;
  border-radius: 40px;
  background-color: #194747;
  opacity: 0.9;
  box-shadow: 0 1px 3px 1px #1f3737;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 0.7%;
}
#header span {
  width: max-content;
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
  height: 20%;
  width: 100%;
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  box-sizing: border-box;
}
.labelBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 30%;
  font-size: 100%;
  font-weight: 700;
  color: #dfdfdf !important;
}
.server-group_input {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.server-group_input input {
  width: 86%;
  height: 80%;
  background-color: #eaeaea;
  border: 2px solid #979797;
  border-radius: 40px;
  padding-left: 10px;
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  outline-style: none !important;
  color: #242424;
}
.server-group_input input:hover {
  border: 2px solid rgb(54, 54, 54);
}
#iporhostname {
  width: 60%;
  border-radius: 30px 0 0 30px;
}
.ip-scaner {
  width: 7.5%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eaeaea;
  margin-right: 2%;
  border: 2px solid #979797;
  border-radius: 50%;
  cursor: pointer;
}
.ip-scaner img {
  width: 80%;
  opacity: 90%;
}
.ip-scaner:active {
  transform: scale(0.95);
}
.ipPort {
  width: 16% !important;
  height: 80% !important;
  border-radius: 0 30px 30px 0 !important;
}
#keyLocation {
  width: 65%;
  border: 5px solid #929292;
  border-radius: 14px;
  background-color: #234141;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 14%;
  box-shadow: 0 1px 3px 1px #182f2f;
  z-index: 95;
  position: relative;
}
.keyLocation_title {
  clear: both;
  font-size: 90%;
  font-weight: 700;
  color: #cecece !important;
  margin-left: 24px;
}
.chooseFile {
  cursor: pointer;
  left: 41%;
  top: 17%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70%;
  width: 5%;
  position: absolute;
  box-sizing: border-box;
  border-right: 3px solid #929292;
}
.chooseFile img {
  width: 50%;
  opacity: 80%;
}
.chooseFile:active,
.chooseFile:focus {
  border: none;
  transform: scale(0.9);
}
#keyLocation input {
  width: 57%;
  height: 80%;
  margin-right: 16px;
  border-radius: 40px;
  padding-left: 10px;
  background-color: #dbdbdb;
  font-size: 80%;
  font-weight: 600;
  outline-style: none;
  border: 2px solid #929292;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.locationPicker {
  display: flex;
  height: 80%;
  width: 60%;
}
#keyInput {
  height: 100% !important;
  width: 96% !important;
  margin-left: 1%;
  padding-left: 9% !important;
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
}

.ssh {
  width: 150px;
  min-width: 100px;
  height: 34px;
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
  padding: 0 1px;
}
#lbl {
  width: max-content;
  text-align: center;
  clear: both;
  font-weight: bold;
  font-size: 70%;
  display: flex;
}
.switch {
  position: relative;
  display: inline-block;
  width: 30%;
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
  height: 22px;
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
  height: 18px;
  width: 18px;
  border: 1px solid #1b9dcc;
  left: 6%;
  bottom: 9%;
  background-color: #25acde;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #e6e6e6;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(10px);
  transform: translateX(19px);
  background-color: #51a76e;
  border: 1px solid #2d944f;
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
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
  background-color: rgba(8, 8, 8, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.anim img {
  width: 35%;
  height: 45%;
}
.cancl-btn {
  width: 20%;
  height: 10%;
  position: absolute;
  top: 80%;
  right: 40%;
  background-color: #eb5353;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 120%;
  font-weight: 800;
  color: #eae9e9;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
}
.cancl-btn:active {
  transform: scale(0.95);
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
