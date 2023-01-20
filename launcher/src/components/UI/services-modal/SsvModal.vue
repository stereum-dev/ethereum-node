<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="ssv-header">
        <!-- <div class="icon-box">
          <img src="/img/icon/service-icons/ssv-network.png" alt="icon" />
        </div>
        <div class="network-icon">
          <img
            src="/img/icon/click-installation/testnet-circle.png"
            alt="icon"
          />
        </div> -->

        <div class="flip-box icon-box">
          <div class="flip-box-inner">
            <img
              class="flip-box-front"
              src="/img/icon/service-icons/ssv-network.png"
              alt="icon"
            />

            <img
              class="flip-box-back"
              src="/img/icon/click-installation/testnet-icon.png"
              alt="icon"
            />
          </div>
        </div>

        <!--  -->
        <div class="title-box">
          <div class="service-name"><span>ssv.network</span></div>
          <div class="service-option">
            <img
              src="/img/icon/service-icons/internet.png"
              alt="icon"
              @click="openBrowser"
            />
            <img
              src="/img/icon/service-icons/github1.png"
              alt="icon"
              @click="openGitHub"
            />
            <img
              src="/img/icon/service-icons/discord.png"
              alt="icon"
              @click="openDiscord"
            />
          </div>
        </div>
      </div>
      <div class="content-box">
        <frontpage-ssv
          v-if="pubkeyModalActive"
          @open-pubkey="operatorModalHandler"
          @open-secretkey="registerSecretkeyHandler"
          :pubkey="pubkey"
        ></frontpage-ssv>
        <register-ssv
          v-if="registerModalActive"
          :pubkey="pubkey"
          :secretkey="secretkey"
          @register-pubkey="registerSsvPubkeyHandler"
        ></register-ssv>
        <secretkey-register
          v-if="registerSecretkeyActive"
          :ssvService="ssvService"
          @login-secretkey="loginWithSecretkeyHandler"
        ></secretkey-register>
        <ssv-dashboard
          :pubkey="pubkey"
          v-if="ssvDashboardActive"
        ></ssv-dashboard>
      </div>
    </div>
  </div>
</template>
<script>
import FrontpageSsv from "./FrontpageSsv.vue";
import RegisterSsv from "./RegisterSsv.vue";
import SsvDashboard from "./SsvDashboard.vue";
import ControlService from "@/store/ControlService";
import { mapState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
import SecretkeyRegister from "./SecretkeyRegister.vue";
export default {
  components: {
    FrontpageSsv,
    RegisterSsv,
    SsvDashboard,
    SecretkeyRegister,
  },
  data() {
    return {
      ssvService: null,
      isSsvAvailable: false,
      pubkeyModalActive: true,
      registerModalActive: false,
      ssvDashboardActive: false,
      registerSecretkeyActive: false,
      enteredText: "",
      selectedOperator: null,
      accepted: "",
      secretkey: null,
      pubkey: null,
    };
  },
  mounted() {
    this.getKeys();
  },
  computed: {
    ...mapState(useNodeHeader, {
      runningServices: "runningServices",
      operators: "operators",
    }),
  },
  methods: {
    operatorModalHandler() {
      this.pubkeyModalActive = false;
      this.registerModalActive = true;
    },
    getKeys: async function () {
      let ssv = this.runningServices.find(
        (service) => service.service === "SSVNetworkService"
      );
      this.ssvService = ssv;
      let ssvConfig = await ControlService.getServiceConfig(
        ssv.config.serviceID
      );
      this.secretkey = ssvConfig.ssv_sk;
      this.pubkey = ssvConfig.ssv_pk;
    },
    registerSsvPubkeyHandler() {
      this.registerModalActive = false;
      this.pubkeyModalActive = false;
      this.ssvDashboardActive = true;
      window.open("https://app.ssv.network/");
    },
    registerSecretkeyHandler() {
      this.registerModalActive = false;
      this.pubkeyModalActive = false;
      this.registerSecretkeyActive = true;
    },
    loginWithSecretkeyHandler: async function () {
      await this.getKeys();
      this.registerModalActive = false;
      this.pubkeyModalActive = false;
      this.registerSecretkeyActive = false;
      this.ssvDashboardActive = true;
    },
    openBrowser() {
      let url = "https://ssv.network/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/bloxapp/ssv";
      window.open(url, "_blank");
    },
    openDiscord() {
      let url = " https://discord.gg/AbYHBfjkDY";
      window.open(url, "_blank");
    },
  },
};
</script>
<style scoped>
.flip-box {
  background-color: transparent;
  perspective: 1000px;
}

.flip-box-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform-origin: 40%;
}

.flip-box:hover .flip-box-inner {
  transform: rotateY(180deg);
  transform-origin: 40%;
}

.flip-box-front,
.flip-box-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform-origin: 40%;
  position: absolute;
  left: 14%;
  top: 5%;
}

.flip-box-back {
  transform: rotateY(180deg);
}
/*animation */
.service-modal_parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
}

.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
}

.browser-modal {
  width: 60%;
  height: 80%;
  background-color: #212122;
  border: 5px solid rgb(161, 161, 161);
  border-radius: 30px;
  position: absolute;
  top: 9%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 105;
  cursor: default;
}

.ssv-header {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: nowrap;
  position: relative;
  z-index: 102;
  margin-top: 1.5%;
}

.icon-box {
  width: 20%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box img {
  width: 70%;
  height: 90%;
}

.title-box {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.service-name {
  width: 100%;
  height: 45%;
  text-align: center;
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.service-option {
  width: 60%;
  height: 38%;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.service-option img {
  width: 8%;
  height: 72%;
  margin-right: 15px;
  cursor: pointer;
}

.content-box {
  width: 100%;
  height: 75%;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 103;
}

.operator-parent,
.insert-parent {
  width: 95%;
  height: 45%;
  background-color: #32383e;
  border: 1px solid #32383e;
  box-shadow: 1px 1px 3px 1px #252525;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.network-icon {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 37%;
  top: 47%;
}

.network-icon img {
  width: 68%;
  height: 68%;
}
</style>
