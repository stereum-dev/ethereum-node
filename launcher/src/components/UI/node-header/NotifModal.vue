<template>
  <div class="notif-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="notif-modal-content">
      <div class="content" v-if="qrPage">
        <div class="title-box">
          <span>{{ $t("notifModal.notification") }}</span>
        </div>
        <div class="text">
          <p>
            {{ $t("notifModal.notifText") }}
          </p>
        </div>
        <div class="messageContent" @click="qrViewer">
          <img :src="banner" alt="icon" />
        </div>
        <span class="close">{{ $t("notifModal.cancelText") }}</span>
      </div>
      <div class="qrPage_content" v-if="!qrPage">
        <div class="banner" @click="qrViewer"><img :src="banner" /></div>
        <div class="qrContent">
          <div class="qrCode-boxes">
            <span
              >1- VISIT THE APPSTORE OR OUR WEBSITE & DOWNLOAD "STEREUM NODE
              MONITOR"
            </span>
            <span>2. OPEN "STEREUM MONITOR" ON YOUR SMARTPHONE </span>
            <span>3. SCAN THE QR CODE AT: </span>
            <span>4. SEND A TEST NOTIFICATION</span>
          </div>
          <div class="qrCode-boxes">
            <div class="qrCode-place-holder">
              <comming-soon></comming-soon>
              <div class="qrCode">
                <img :src="qrCode" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qrPage: true,
      banner: "/img/icon/header-icons/monitor2.png",
      //BACKEND
      //qrCode is a dummy data
      qrCode: "/img/icon/header-icons/dummyQR.png",
    };
  },
  methods: {
    qrViewer() {
      this.qrPage = !this.qrPage;
    },
  },
};
</script>
<style scoped>
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
  height: 70%;
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
  font-size: 0.7rem;
  font-weight: 400;
  align-self: center;
}
</style>
