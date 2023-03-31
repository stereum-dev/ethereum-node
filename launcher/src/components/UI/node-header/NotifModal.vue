<template>
  <div class="notif-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="notif-modal-content">
      <div v-if="qrPage" class="content">
        <div class="notif-Title"><span>add a notification channel</span></div>
        <div class="notif-message"><span>Choose what kind of Notification Channel you want to configure</span></div>
        <ul class="notif-box">
          <li @click="qrPage = !qrPage">
            <div class="notif-row_icon">
              <img src="/img/icon/stereum-logo/stereum_logo_extern.png" alt="notif logo" />
            </div>
            <div class="notif-row_name"><span>Stereum Node Monitor</span></div>
          </li>
        </ul>
        <span class="close">{{ $t("notifModal.cancelText") }}</span>
      </div>
      <div v-if="!qrPage" class="qrPage_content">
        <div class="banner" @click="qrViewer"><img :src="banner" /></div>
        <div class="qrContent">
          <div class="qrCode-boxes">
            <span>1. Visit the app store or our website to download "STEREUM Node Monitor" </span>
            <span>2. Open the app on your smartphone</span>
            <span>3. Scan the QR Code</span>
            <span>X. Send a test notification</span>
          </div>
          <div class="qrCode-boxes">
            <div class="qrCode-place-holder">
              <div class="qrCode">
                <img :src="qrCode" />
              </div>
            </div>
          </div>
        </div>
        <span class="close">{{ $t("notifModal.cancelText") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
export default {
  data() {
    return {
      qrPage: true,
      banner: "/img/icon/header-icons/monitor2.png",
      //BACKEND
      //qrCode is a dummy data
      qrCode: "/img/icon/task-manager-icons/turning_circle_blue.gif",
      ErrorQRCode: "/img/icon/header-icons/dummyQR.png",
    };
  },
  mounted() {
    this.getqrcode();
  },
  methods: {
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
  },
};
</script>
<style scoped>
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
  width: 90%;
  height: 25%;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  cursor: pointer;
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
  width: 20%;
  height: 100%;
}
.notif-row_icon img {
  max-width: 40%;
}
.notif-row_name {
  display: flex;
  width: 80%;
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
.qrPage_content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.banner {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.banner img {
  width: 60%;
  margin-left: 2%;
}
.notif-modal-parent {
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
  height: 55%;
  border-radius: 1rem;
  background-color: #343434;
  border: 4px solid rgb(171, 170, 170);
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: 13%;
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
  font-size: 50%;
  font-weight: 400;
  align-self: center;
  position: absolute;
  bottom: 1%;
}
</style>
