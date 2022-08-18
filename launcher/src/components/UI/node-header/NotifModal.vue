<template>
  <div class="notif-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="notif-modal-content">
      <div class="content">
        <div class="title-box">
          <span>Notifications</span>
        </div>
        <div class="text">
          <p>
            You can set up different notification sources and the status you
            want to be notified of here
          </p>
        </div>
        <div class="messageContent">
          <img
            src="../../../../public/img/icon/header-icons/monitor2.png"
            alt="icon"
          />
        </div>
        <span class="close">Click outside to cancel</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
  width: 50%;
  height: 50%;
  border-radius: 1rem;
  background-color: #343434;
  border: 4px solid rgb(171, 170, 170);
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: 13%;
  left: 20%;
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
  background-color: #2e553b;
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
