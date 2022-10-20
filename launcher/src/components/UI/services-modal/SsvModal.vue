<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="ssv-header">
        <div class="icon-box">
          <img src="/img/icon/service-icons/ssv-network.png" alt="icon" />
        </div>
        <div class="network-icon">
          <img src="/img/icon/click-installation/testnet-circle.png" alt="icon" />
        </div>
        <div class="title-box">
          <span class="service-name">ssv.network</span>
          <div class="service-option">
            <img src="/img/icon/service-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" @click="openGitHub" />
            <img src="/img/icon/service-icons/discord.png" alt="icon" @click="openDiscord" />
          </div>
        </div>
      </div>
      <div class="content-box">
        <frontpage-ssv v-if="pubkeyModalActive" @open-pubkey="operatorModalHandler"
          @open-secretkey="registerSecretkeyHandler" :pubkey="pubkey"></frontpage-ssv>
        <register-ssv v-if="registerModalActive" :pubkey="pubkey" :secretkey="secretkey"
          @register-pubkey="registerSsvPubkeyHandler"></register-ssv>
        <secretkey-register v-if="registerSecretkeyActive" :ssvService="ssvService"
          @login-secretkey="loginWithSecretkeyHandler"></secretkey-register>
        <ssv-dashboard :pubkey="pubkey" v-if="ssvDashboardActive"></ssv-dashboard>
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
  background-color: #1b1c20;
  border: 5px solid rgb(161, 161, 161);
  border-radius: 30px;
  position: absolute;
  top: 11%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 101;
}

.ssv-header {
  width: 100%;
  height: 20%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  position: relative;
  z-index: 102;
}

.icon-box {
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  margin-top: -1px;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.icon-box img {
  margin: 10px 0 0 15px;
  width: 58%;
  height: 86%;
}

.title-box {
  grid-column: 1/5;
  margin-left: 85px;
  grid-row: 1;
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}

.title-box span {
  width: 70%;
  height: 35%;
  text-align: center;
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.7rem;
  font-weight: 600;
}

.service-option {
  width: 60%;
  height: 35%;
  margin-left: 16px;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
}

.service-option img {
  width: 11%;
  height: 70%;
  margin-right: 15px;
  cursor: pointer;
}

.content-box {
  width: 100%;
  height: 70%;
  margin-top: 20px;
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
