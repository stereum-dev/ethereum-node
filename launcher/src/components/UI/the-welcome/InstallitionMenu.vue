<template>
  <div class="welcome-parent">
    <div class="header bg-zinc-900">
      <span>{{ $t("installitionMenu.welcome") }}</span>
    </div>

    <div class="btn-parent">
      <div class="serverName">
        Server: 
        <span>{{ ServerName }}</span>
      </div>
      <div class="serverIp">
        IP: 
        <span>{{ ipAddress }}</span>
      </div>
    </div>

    <div class="logout-parent">
      <button
        class="btn-logout"
        @click="logoutModalHandler"
        @mouseover="showTooltip = true"
        @mouseout="showTooltip = false"
      >
        <img src="/img/icon/header-icons/exit9.png" alt="logout Icon" />
      </button>
      <span v-if="showTooltip" class="logout-tooltip">Log Out</span>
    </div>

    <div class="textBox bg-zinc-900">
      <p>
        {{ $t("installitionMenu.installText") }}
      </p>
    </div>

    <div class="item-container">
      <div v-for="(install, index) in installation" :key="index" class="item-column">
        <router-link class="lintTtl" :class="{ disabled: isCompatible(install) }" :to="install.path"
          ><button-installation
            :img="install.display ? install.img : install.imgDisabled"
            :url="install.imgHover"
            @mousedown.prevent.stop
          ></button-installation
        ></router-link>
      </div>
    </div>
    <div v-if="active" class="message-box">
      <p class="msg-title">
        {{ $t("installitionMenu.osCheck") }}
        <span class="dot-flashing"></span>
      </p>
    </div>
    <div v-if="!active" class="result-box">
      <img v-if="isSupported" src="/img/icon/welcome-page/like.png" alt="icon" />
      <img v-else src="/img/icon/welcome-page/dislike.png" alt="icon" />
      <span class="check-msg" :class="{ supported: isSupported, notSupported: !isSupported }">
        {{ message }}
      </span>
    </div>
    <logout-modal v-if="logoutModalIsActive" @close-me="clickToCancelLogout" @confrim-logout="loggingOut">
    </logout-modal>
  </div>
</template>
<script>
import ButtonInstallation from "./ButtonInstallation.vue";
import ControlService from "@/store/ControlService";
import { mapState, mapWritableState } from "pinia";
import { useWelcomeStore } from "@/store/welcomePage";
import { useControlStore } from "../../../store/theControl";
import LogoutModal from "../node-header/LogoutModal.vue";
export default {
  components: { ButtonInstallation, LogoutModal },
  data() {
    return {
      logoutModalIsActive: false,
      showTooltip: false,
      active: true,
      running: true,
      message: "",
      isSupported: false,
      value: 1,
      max: 100,
      supportMessage: this.$t("installitionMenu.osSupported"),
    };
  },

  computed: {
    ...mapState(useWelcomeStore, { installation: "installation" }),
    ...mapWritableState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
  },
  mounted() {
    this.updateConnectionStats();
  },
  created() {
    setTimeout(() => {
      this.active = false;
    }, 5000);
    this.checkOsRequirements();
    this.randomValue();
  },
  methods: {
    async updateConnectionStats() {
      const stats = await ControlService.getConnectionStats();
      this.ServerName = stats.ServerName;
      this.ipAddress = stats.ipAddress;
    },
    clickToCancelLogout() {
      this.logoutModalIsActive = false;
    },
    async loggingOut() {
      this.refresh = false;
      await ControlService.logout();
      this.$router.push("/").then(() => {
        location.reload();
      });
    },
    logoutModalHandler() {
      this.logoutModalIsActive = true;
    },
    isCompatible(item) {
      if (process.env.NODE_ENV == "development") return !item.display;
      return !item.display || this.active;
    },
    randomValue() {
      this.value = Math.random() * this.max;
    },
    display: async function (osResponse, suResponse) {
      const osData = await osResponse;
      const suData = await suResponse;
      if (osData == "Ubuntu" || osData == "CentOS") {
        this.message = osData.toUpperCase() + " " + this.supportMessage;
        if (suData.rc) {
          // Description of return codes (suData.rc):
          // 1 = FAIL: user can not sudo at all because not in sudo group!
          // 2 = FAIL: user can not sudo without password!
          // 3 = ERROR: Executed code failed to run (<errmsg>)
          // There could also be unknown return codes that may happen on the OS!
          // Those are usually 127 but they could also overwrite the "known" codes
          // mentioned above. Therefore it's a good idea to parse stdout value in
          // addition to the return code.
          let errnum = parseInt(suData.rc);
          let errmsg = suData.stdout.toLowerCase();
          if (errnum === 1 && errmsg.indexOf("can not sudo without password")) {
            // User needs to added in the sudoers file with "%<username> ALL = (ALL) NOPASSWD: ALL"
            this.message += " BUT YOU NEED TO ENABLE PASSLESS SUDO";
          } else if (errnum === 2 && errmsg.indexOf("code failed to run")) {
            // We could not check due to interactive syntax error - allow install but show a warning
            this.message += " BUT MAKE SURE TO ENABLE PASSLESS SUDO (" + errnum + ")";
            this.isSupported = true;
          } else {
            // We could not check due to unknonw error - allow install but show a warning
            this.message += " BUT MAKE SURE TO ENABLE PASSLESS SUDO (" + errnum + ")";
            this.isSupported = true;
          }
        } else {
          // OS supported, passless sudo avail - allow install :)
          this.isSupported = true;
        }
      } else if (osData && osData.hasOwnProperty("name") && osData.name !== undefined) {
        this.message = osData.name.toUpperCase() + ": " + osData.message.toUpperCase();
      } else {
        this.message = "UNSUPPORTED OS";
      }
      this.running = false;
    },
    checkOsRequirements: async function () {
      const osResponse = ControlService.checkOS()
        .then((result) => {
          return result;
        })
        .catch((error) => {
          return error;
        });
      const suResponse = ControlService.checkSudo()
        .then((result) => {
          return result;
        })
        .catch((error) => {
          return error;
        });
      this.display(await osResponse, await suResponse);
    },
  },
};
</script>
<style scope>
.welcome-parent {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(10, 1fr);
}
.logout-parent {
  position: relative;
  grid-column: 6/7;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.btn-logout {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-color: #1e2429;
  border: 3px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 20px;
}
.btn-logout:hover {
  background-color: #336666;
  border: 3px solid #b4b4b4;
}
.btn-logout img {
  width: 20px;
  height: 20px;
}
.logout-tooltip {
  position: absolute;
  top: 10%;
  right: 10%;
  margin-top: 50px;
  margin-right: 20px;
  width: 100px;
  height: 30px;
  background-color: #1e2429;
  border: 1px solid #b4b4b4;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b4b4b4;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 100;
  transition: all 0.3s ease-in-out;
}
.header {
  grid-column: 2/6;
  grid-row: 2/3;
  margin: 0 auto;
  background-color: #1e2429;
  border: 3px solid #b4b4b4;
  border-radius: 15px;
  width: 80%;
  height: 90%;
  text-align: center;
  font-size: 1.5rem;
  color: rgb(214, 214, 214);
  font-weight: 700;
  position: relative;
  box-shadow: 0 1px 3px 1px rgb(46, 57, 55);
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
}

.header span {
  font-size: 2.2rem;
  font-weight: 700;
  color: #b4b4b4;
}

.btn-parent {
  grid-column: 2/6;
  grid-row: 3/4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-parent .serverName,
.btn-parent .serverIp {
  width: 100%;
  height: 30px;
  border:'2px solid white';
  background-color: "#33393E !important";
  display: flex;
  justify-content: center;
  align-items: center;
}

.serverName span,
.serverIp span {
  font-size: "1rem";
  font-weight: 500;
  color: yellow;
}

.textBox {
  grid-column: 1/7;
  grid-row: 4/6;
  margin: 0 auto;
  background-color: #1e2429;
  border: 3px solid #b4b4b4;
  border-radius: 15px;
  width: 75%;
  height: 90%;
  position: relative;
  box-shadow: 0 1px 3px 1px rgb(46, 57, 55);
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  margin-top: 5px;
}
.textBox p {
  font-size: 1rem;
  font-weight: 500;
  color: #b4b4b4;
  text-align: center;
  line-height: 1.5;
  padding: 5px 10px;
}

.item-container {
  grid-column: 1/7;
  grid-row: 6/10;
  width: 80% !important;
  height: 180px !important;
  margin: 0 auto !important;
  position: relative;
  border-radius: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.item-column {
  width: 28%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lintTtl {
  width: 100%;
  height: 85%;
  border-radius: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  z-index: 1;
  cursor: default;
}

.message-box {
  grid-column: 1/7;
  grid-row: 9/11;
  width: 500px;
  height: 50px;
  background-color: #1e2429;
  border: 1px solid #3b5a41;
  border-radius: 50px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.message-box .msg-title {
  width: 100%;
  height: 30%;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
.result-box {
  grid-column: 1/7;
  grid-row: 9/11;
  width: 500px;
  height: 50px;
  background-color: #1e2429;
  border: 1px solid #3b5a41;
  border-radius: 50px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.result-box img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 100%;
}

.result-box .check-msg {
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
}

.supported {
  color: #dcdcdc;
  font-size: 1rem;
  font-weight: 800;
  text-shadow: 1px 1px 1px rgb(19, 55, 36);
}
.notSupported {
  color: #c83e29;
  font-size: 1rem;
  font-weight: 800;
}
.disabled {
  pointer-events: none;
}
.dot-flashing {
  position: relative;
  top: -2px;
  width: 5px;
  height: 5px;
  align-self: flex-end;
  margin-left: 20px;
  border-radius: 5px;
  background-color: #262626;
  color: #2b2b2b;
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before,
.dot-flashing::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -15px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: #262626;
  color: #2b2b2b;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 15px;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: #262626;
  color: #2b2b2b;
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}
.button-new {
  background-color: rgb(52, 51, 51);
  border: none;
  color: white;
  padding: 35px 35px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  /* font-size: 16px; */
  width: 210px;
  height: 52px;
  font-size: 15px;
  border-radius: 10px;
  padding-top: 10px !important;
  font-weight: bold;
}
.btn-black {
  border: solid !important;
  border-color: white !important;
  border-radius: 10px;
}
.btn-font {
  padding-left: 10px;
  color: yellow;
}
@keyframes dotFlashing {
  0% {
    background-color: #1068a3;
  }
  50%,
  100% {
    background-color: #eee;
  }
}
</style>
