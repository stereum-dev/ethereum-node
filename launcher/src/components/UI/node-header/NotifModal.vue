<template>
  <div class="notif-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="notif-modal-content">
      <div v-if="qrPage && !beaconchaDashboard" class="content">
        <div class="notif-Title">
          <span>{{ $t("notifModal.addNotif") }}</span>
        </div>
        <div class="notif-message">
          <span>{{ $t("notifModal.chooseNotif") }}</span>
        </div>
        <ul class="notif-box">
          <li @click="qrPage = false">
            <div class="notif-row_icon">
              <img src="/img/icon/stereum-logo/stereum_logo_extern.png" alt="notif logo" />
            </div>
            <div class="notif-row_name">
              <span>{{ $t("notifModal.stereumMonitor") }} (Mobile App)</span>
            </div>
          </li>
          <!-- <li @click="(beaconchaDashboard = true), (qrPage = true)">
            <div class="notif-row_icon">
              <img src="/img/icon/service-icons/beaconchain.png" alt="notif logo" />
            </div>
            <div class="notif-row_name">
              <span>Beaconchain {{ $t("notifModal.dash") }} (Mobile App)</span>
            </div>
          </li> -->
        </ul>
        <span class="close">{{ $t("notifModal.close") }}</span>
      </div>
      <div v-if="!qrPage && !beaconchaDashboard" class="qrPage_content">
        <div class="banner" @click="qrViewer">
          <div class="banner_icon">
            <img src="/img/icon/stereum-logo/stereum_logo_extern.png" />
          </div>
          <div class="banner_title">
            <span>{{ $t("notifModal.stereumMonitor") }}</span>
          </div>
        </div>
        <div class="qrContent">
          <div class="qrCode-boxes">
            <span>1# {{ $t("notifModal.stepOne") }} </span>
            <span>2# {{ $t("notifModal.stepTwo") }}</span>
            <span>3# {{ $t("notifModal.stepThree") }}</span>
            <span>X# {{ $t("notifModal.stepFour") }}</span>
          </div>
          <div class="qrCode-boxes">
            <div class="qrCode-place-holder">
              <div class="qrCode">
                <img :src="qrCode" />
              </div>
            </div>
          </div>
        </div>
        <span class="close">{{ $t("notifModal.close") }}</span>
      </div>
      <div v-if="beaconchaDashboard" class="qrPage_content">
        <div class="banner" @click="beaconchaDashboard = false">
          <div class="banner_icon">
            <img src="/img/icon/service-icons/beaconchain.png" />
          </div>
          <div class="banner_title">
            <span>Beaconchain {{ $t("notifModal.dash") }}</span>
          </div>
        </div>
        <div class="qrContent">
          <div class="beaconcha-dash-container">
            <div class="choose-validator-title">{{ $t("notifModal.chooseVal") }}</div>
            <div class="choose-validator_validators">
              <div
                v-for="validator in installedValidators"
                :key="validator"
                class="choose-validator_validators_validator-box"
                @click="selectedValidator(validator)"
              >
                <img
                  :src="validator.icon"
                  alt=""
                  :class="{
                    'selected-val': validator.name == selectedVal ? true : false,
                  }"
                />
              </div>
            </div>
            <div class="go-to-link">
              {{ $t("notifModal.goTo") }}<span @click="openBeaconcha()">https://beaconcha.in/user/settings#app</span>
            </div>
            <div class="enter-box">
              <div class="enter-input">
                <div class="enter-input_title">{{ $t("notifModal.machinename") }}</div>
                <div class="enter-input_input">
                  <input v-model="machineName" type="text" />
                </div>
              </div>
              <div class="enter-input">
                <div class="enter-input_title">{{ $t("notifModal.apikey") }}</div>
                <div class="enter-input_input">
                  <input v-model="apiKey" type="text" />
                </div>
              </div>
            </div>
            <div class="apply-btn" @click="applyBeaconChain">
              {{ $t("notifModal.apply") }}
            </div>
          </div>
        </div>
        <span class="close">{{ $t("notifModal.close") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      qrPage: true,
      beaconchaDashboard: false,
      banner: "/img/icon/header-icons/monitor2.png",
      qrCode: "/img/icon/task-manager-icons/turning_circle_blue.gif",
      ErrorQRCode: "/img/icon/header-icons/dummyQR.png",
      selectedVal: "",
      machineName: "",
      apiKey: "",
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
    }),
    installedValidators() {
      const copyOfInstalledServices = [...this.installedServices];
      return copyOfInstalledServices.filter((obj) => obj.category === "validator");
    },
  },
  mounted() {
    this.getqrcode();
  },
  methods: {
    selectedValidator(arg) {
      //to select the validator
      this.selectedVal = arg.config.serviceID;
    },
    async applyBeaconChain() {
      //to apply the beaconchain dashboard
      await ControlService.beaconchainMonitoringModification({
        machineName: this.machineName,
        apiKey: this.apiKey,
        selectedVal: this.selectedVal,
      });
    },
    qrViewer() {
      this.qrPage = !this.qrPage;
    },
    async getqrcode() {
      const response = await ControlService.getQRCode();
      if (response instanceof Error) {
        console.log(response);
        this.qrCode = this.ErrorQRCode;
      } else {
        this.qrCode = response;
      }
    },
    openBeaconcha() {
      let url = "https://beaconcha.in/user/settings#app";
      window.open(url, "_blank");
      console.log("test");
    },
  },
};
</script>
<style scoped>
.selected-val {
  border: 5px solid #3e8f8f;
  border-radius: 50%;
}
.notif-Title {
  display: flex;
  width: 90%;
  height: 15%;
  justify-content: flex-start;
  align-items: center;
}
.notif-Title span {
  font-size: 150%;
  font-weight: 600;
  text-transform: uppercase;
}
.notif-message {
  display: flex;
  width: 90%;
  height: 12%;
  justify-content: flex-start;
  align-items: center;
}
.notif-message span {
  font-size: 80%;
  font-weight: 500;
}
.notif-box {
  display: flex;
  width: 90%;
  height: 65%;
  border: 1px solid #3e3d3d;
  background: #2a2a2a;
  box-shadow: 1px 1px 10px 1px #171717, inset 1px 1px 5px 1px #1e1e1e;
  border-radius: 10px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2% 0;
}
.notif-box li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #3e3d3d;
  width: 95%;
  height: 20%;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 1.5%;
}
.notif-box li:hover {
  background: #313131;
}
.notif-box li:active {
  border: none;
  box-shadow: none;
}
.notif-row_icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  height: 100%;
}
.notif-row_icon img {
  max-width: 70%;
}
.notif-row_name {
  display: flex;
  width: 87%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
}
.notif-row_name span {
  font-size: 100%;
  font-weight: 600;
}
.qrCode {
  width: 70%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.qrCode-place-holder {
  background: #1d1d1d;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border: 1px solid grey;
  border-radius: 10px;
  box-shadow: 1px 1px 5px 1px #001717;
  position: relative;
}
.qrCode-boxes {
  width: 40%;
  height: 90%;
  display: flex;
  flex-direction: column;
  color: #c3c3c3;
  font-size: 90%;
  font-weight: 600;
  justify-content: space-around;
}

.qrContent {
  height: 68%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.beaconcha-dash-container {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
.choose-validator-title {
  color: #c3c3c3;
  font-size: 70%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 1.3%;
  width: 90%;
  height: 7%;
  letter-spacing: 0.7px;
}
.choose-validator_validators {
  width: 90%;
  height: 25%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.choose-validator_validators_validator-box {
  width: 12.5%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.choose-validator_validators_validator-box img {
  width: 70%;
  height: 70%;
  cursor: pointer;
}
.go-to-link {
  width: 90%;
  height: 7%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #c3c3c3;
  font-size: 90%;
  font-weight: 600;
  letter-spacing: 0.8px;
}
.go-to-link span {
  margin-left: 1%;
  font-weight: 700;
  letter-spacing: 0.7px;
  cursor: pointer;
  font-size: 110%;
}
.go-to-link span:hover {
  color: #3e8f8f;
}
.enter-box {
  width: 90%;
  height: 45%;
}
.enter-input {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.enter-input_title {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #c3c3c3;
  font-size: 90%;
  font-weight: 600;
  text-transform: uppercase;
}
.enter-input_input {
  width: 75%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
.enter-input_input input {
  width: 100%;
  height: 60%;
  border-radius: 10px;
  border: none;
  padding-left: 2%;
}
.apply-btn {
  width: 30%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eee;
  font-size: 150%;
  text-transform: uppercase;
  font-weight: 700;
  background: #316464;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 0.5%;
}
.apply-btn:hover {
  background: rgba(49, 100, 100, 0.8);
}
.apply-btn:active {
  background: #316464;
  transform: scale(0.95);
}
.qrPage_content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.banner {
  width: 90%;
  height: 12%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #1d1d1d;
  border: 1px solid grey;
  border-radius: 10px;
  box-shadow: 1px 1px 5px 1px #001717;
  cursor: pointer;
}
.banner:active {
  box-shadow: none;
  border: none;
}
.banner:hover {
  background: #292727;
}
.banner_icon {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner_icon img {
  width: 50%;
}
.banner_title {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #c3c3c3;
}
.banner_title span {
  font-size: 140%;
  font-weight: 600;
}
.notif-modal-parent {
  cursor: default;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 5%;
  z-index: 310;
}
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 311;
}
.notif-modal-content {
  width: 55%;
  height: 70%;
  border-radius: 1rem;
  background-color: #343434;
  border: 4px solid rgb(171, 170, 170);
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: 5%;
  left: 18%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  position: relative;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.text {
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text p {
  padding: 5px;
  margin: 0;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 400;
  color: #c3c3c3;
}
.title-box {
  width: 100%;
  height: 15%;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box span {
  font-size: 1.6rem;
  font-weight: 700;
  color: #c6c6c6;
  text-align: center;
  text-transform: uppercase;
}
.messageContent {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}
.messageContent img {
  width: 80%;
  height: 40%;
}
.messageContent .question {
  color: rgb(195, 195, 195);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}
.confrimBtn {
  width: 90%;
  height: 35%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.confrimBox {
  width: 30%;
  height: 35px;
  border-radius: 10px;
  border: 2px solid gray;
  box-shadow: 0 1px 3px 1px rgb(43, 44, 44);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.confrimBox span {
  font-size: 0.9rem;
  font-weight: 700;
  color: #bf3a3a;
  text-transform: uppercase;
}
.confrimBox:hover span {
  color: #c9c9c9;
}
.confrimBox:hover {
  background-color: #bf3a3a;
  border: 2px solid #c9c9c9;
  transform: scale(1.05);
  transition: all 100ms;
  color: #d6d6d6;
}

.confrimBox:active {
  transform: scale(1);
  box-shadow: none;
}

.close {
  color: #bf3a3a;
  font-size: 70%;
  font-weight: 400;
  align-self: center;
  position: absolute;
  bottom: 1%;
}
</style>
