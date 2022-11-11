<template>
  <div class="logout-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="logout-modal-content">
      <div class="title-box">
        <span>LOG-OUT</span>
      </div>
      <div class="messageContent">
        <img
          src="../../../../public/img/icon/manage-node-icons/stop.png"
          alt=""
        />
        <span class="question"
          >ARE YOU SURE YOU WANT TO LOG OUT OF YOUR NODE SERVER?</span
        >
      </div>
      <div class="confrimBtn">
        <div class="confrimBox" @click="$emit('confrimLogout')">
          <span>Log out</span>
        </div>
      </div>
      <span class="close">Click outside to cancel</span>
    </div>
  </div>
</template>
<style scoped>
.logout-modal-parent {
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
.logout-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 22%;
  background-color: #bf3a3a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 1000;
}
.title-box {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box span {
  font-size: 2rem;
  font-weight: 800;
  color: #c6c6c6;
  text-align: center;
  text-transform: uppercase;
}
.messageContent {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.messageContent img {
  width: 20%;
  height: 72%;
}
.messageContent .question {
  width: 80%;
  color: rgb(195, 195, 195);
  font-size: 1rem;
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
  background-color: #c9c9c9;
  border-radius: 10px;
  border: 2px solid #c9c9c9;
  box-shadow: 0 1px 3px 1px rgb(43, 44, 44);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.confrimBox span {
  font-size: 1rem;
  font-weight: 700;
  color: #b22020;
  text-transform: uppercase;
}
.confrimBox:hover span {
  color: #c9c9c9;
}
.confrimBox:hover {
  background-color: #b22020;
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
