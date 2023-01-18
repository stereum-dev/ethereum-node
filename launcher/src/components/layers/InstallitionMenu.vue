<template>
  <div class="welcome-parent">
    <div class="empty1"></div>
    <div class="empty2"></div>
    <div id="welcome-header">
      <h2 class="welcome-title">{{ $t("installitionMenu.welcome") }}</h2>
    </div>
    <div class="middle-box">
      <div id="txt">
        <p>
          {{ $t("installitionMenu.installText") }}
        </p>
      </div>
      <!-- <div class="progress-container">
        <div class="progress-bg">
          <circle-loading :open="running"></circle-loading>
        </div>
      </div> -->
    </div>
    <div class="item-container">
      <div
        class="item-column"
        v-for="(install, index) in installation"
        :key="index"
      >
        <router-link
          class="lintTtl"
          :class="{ disabled: !install.display || !isSupported }"
          :to="install.path"
          ><button-installation
            @mousedown.prevent.stop
            :img="install.display ? install.img : install.imgDisabled"
            :url="install.imgHover"
          ></button-installation
        ></router-link>
      </div>
    </div>
    <div class="message-box" v-if="active">
      <p class="msg-title">
        {{ $t("installitionMenu.osCheck") }}
        <span class="dot-flashing"></span>
      </p>
    </div>
    <div class="result-box" v-if="!active">
      <img
        src="/img/icon/welcome-page/like.png"
        alt="icon"
        v-if="isSupported"
      />
      <img src="/img/icon/welcome-page/dislike.png" alt="icon" v-else />
      <span
        class="check-msg"
        :class="{ supported: isSupported, notSupported: !isSupported }"
      >
        {{ message }}
      </span>
    </div>
  </div>
</template>
<script>
import ButtonInstallation from "./ButtonInstallation.vue";
import CircleLoading from "../UI/CircleLoading.vue";
import ControlService from "@/store/ControlService";
import { mapState } from "pinia";
import { useWelcomeStore } from "@/store/welcomePage";
export default {
  components: { ButtonInstallation, CircleLoading },
  data() {
    return {
      active: true,
      running: true,
      message: "",
      isSupported: false,
      value: 1,
      max: 100,
    };
  },
  created() {
    setTimeout(() => {
      this.active = false;
    }, 5000);
    this.checkOsRequirements();
    this.randomValue();
  },
  computed: {
    ...mapState(useWelcomeStore, { installation: "installation" }),
  },
  methods: {
    randomValue() {
      this.value = Math.random() * this.max;
    },
    display: async function (osResponse, suResponse) {
      const osData = await osResponse;
      const suData = await suResponse;
      if (osData == "Ubuntu" || osData == "CentOS") {
        this.message =
          osData.toUpperCase() + " " + this.$t("installitionMenu.osSupported");
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
            this.message +=
              " BUT MAKE SURE TO ENABLE PASSLESS SUDO (" + errnum + ")";
            this.isSupported = true;
          } else {
            // We could not check due to unknonw error - allow install but show a warning
            this.message +=
              " BUT MAKE SURE TO ENABLE PASSLESS SUDO (" + errnum + ")";
            this.isSupported = true;
          }
        } else {
          // OS supported, passless sudo avail - allow install :)
          this.isSupported = true;
        }
      } else if (
        osData &&
        osData.hasOwnProperty("name") &&
        osData.name !== undefined
      ) {
        this.message =
          osData.name.toUpperCase() + ": " + osData.message.toUpperCase();
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
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(15, 1fr);
}
.empty1 {
  grid-column: 1/7;
  grid-row: 1/2;
  height: 100%;
}
.empty2 {
  grid-column: 1/7;
  grid-row: 2/3;
  height: 100%;
}
.item-container {
  grid-column: 1/7;
  grid-row: 8/13;
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

#welcome-header {
  grid-column: 3/5;
  grid-row: 3/4;
  border: 5px solid #929292;
  width: 100%;
  max-width: 350px;
  height: 50px;
  margin: 50px auto;
  border-radius: 40px;
  background-color: #194747;
  opacity: 0.88;
  box-shadow: 0 1px 3px 1px #1f3737;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#welcome-header .welcome-title {
  width: 95%;
  max-width: auto;
  height: 100%;
  font-size: 1.8rem !important;
  font-weight: 700 !important;
  color: #cecece !important;
  border: none;
  background-color: transparent;
  box-shadow: none;
  text-transform: uppercase;
}
.middle-box {
  grid-column: 1/7;
  grid-row: 5/8;
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.message-box {
  grid-column: 1/7;
  grid-row: 14/16;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.result-box .check-msg {
  padding-bottom: 5px;
  border-bottom: 2px solid rgb(189, 189, 189);
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
}
.message-box .msg-title {
  width: 48%;
  height: 30%;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
.result-box {
  grid-column: 1/7;
  grid-row: 14/16;
  width: 100%;
  height: 50px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.result-box img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 100%;
  box-shadow: 1px 1px 3px 1px rgb(16, 60, 27);
}
.progress-container {
  width: 82%;
  height: 30%;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-bg {
  width: 59%;
  height: 70%;
  border: 3px solid #929292;
  background-color: #6e8582;
  border-radius: 40px;
  box-shadow: 0 0 3px 1px rgb(18, 20, 20), inset 1px 1px 5px rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}
#txt {
  width: 75%;
  height: 95%;
  border: 5px solid #929292;
  margin: 0 auto;
  background-color: #194747;
  border-radius: 20px;
  opacity: 0.8;
  box-shadow: 0 1px 3px 1px rgb(28, 52, 48);
  display: flex;
  justify-content: center;
  align-items: center;
}
#txt p {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(225, 225, 225);
  text-align: center;
}
.dot-flashing {
  position: relative;
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

@keyframes dotFlashing {
  0% {
    background-color: #1068a3;
  }
  50%,
  100% {
    background-color: #eee;
  }
}
.supported {
  color: #55b568;
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
</style>
