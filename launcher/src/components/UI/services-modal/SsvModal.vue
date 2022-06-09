<template>
  <div class="service-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="ssv-header">
        <div class="icon-box">
          <img src="/img/icon/service-icons/ssv.png" alt="icon" />
        </div>
        <div class="network-icon">
          <img
            src="/img/icon/click-installation/testnet-circle.png"
            alt="icon"
          />
        </div>
        <div class="title-box">
          <span class="service-name">SSV NETWORK</span>
          <div class="service-option">
            <img src="/img/icon/service-icons/internet.png" alt="icon" />
            <img src="/img/icon/service-icons/github1.png" alt="icon" />
            <img src="/img/icon/service-icons/discord.png" alt="icon" />
          </div>
        </div>
      </div>
      <div class="content-box">
        <pubkey-ssv
          v-if="pubkeyModalActive"
          @open-pubkey="operatorModalHandler"
          :pubkey="pubkey"
        ></pubkey-ssv>
        <register-ssv
          v-if="registerModalActive"
          :pubkey="pubkey"
          @register-pubkey="registerSsvPubkeyHandler"
        ></register-ssv>
        <ssv-dashboard
          :pubkey="pubkey"
          v-if="ssvDashboardActive"
        ></ssv-dashboard>
      </div>
    </div>
  </div>
</template>
<script>
import PubkeySsv from "./PubkeySsv.vue";
import RegisterSsv from "./RegisterSsv.vue";
import SsvDashboard from "./SsvDashboard.vue";
import { mapGetters } from "vuex";
export default {
  components: { PubkeySsv, RegisterSsv, SsvDashboard },
  data() {
    return {
      ssvService: [],
      isSsvAvailable: false,
      pubkeyModalActive: true,
      registerModalActive: false,
      ssvDashboardActive: false,
      enteredText: "",
      selectedOperator: null,
      accepted: "",
      secretkey: null,
      pubkey: "112gf1hj2fjh1f24jkhf4fhgfhad444",
    };
  },
  created() {
    this.filterSsvService();
  },
  computed: {
    ...mapGetters({
      services: "getServiceIcons",
      runningServices: "getRunningServices",
      operators: "getTheOperators",
    }),
  },
  methods: {
    filterSsvService() {
      this.services.forEach((service) => {
        if (service.serviceName.toLowerCase() == "ssv") {
          this.ssvService.push(service);
        }
      });
      this.isSsvAvailable = true;
    },
    operatorModalHandler() {
      this.pubkeyModalActive = false;
      this.registerModalActive = true;
    },
    registerSsvPubkeyHandler() {
      this.registerModalActive = false;
      this.pubkeyModalActive = false;
      this.ssvDashboardActive = true;
    },
    logItem(event) {
      console.log(event.target);
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
  background-color: #1b1b1b;
  border: 5px solid rgb(161, 161, 161);
  box-shadow: inset 2px 2px 15px rgb(0, 0, 0);
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
  margin-top: 5px;
  height: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.icon-box img {
  margin: 8px 10px;
  width: 58%;
  height: 86%;
}
.title-box {
  grid-column: 2/5;
  grid-row: 1;
  width: 90%;
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
.network-icon {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 41%;
  top: 52%;
}
.network-icon img {
  width: 73%;
  height: 73%;
}
</style>
