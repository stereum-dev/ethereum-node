<template>
  <div class="remove-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="remove-modal-content">
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
.remove-modal-parent {
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
.remove-modal-content {
  width: 50%;
  height: 50%;
  border-radius: 1rem;
  background-color: #363a41;
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
.title-box {
  width: 100%;
  height: 15%;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #bf3a3a;
}
.title-box span {
  font-size: 1.8rem;
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
  height: 80%;
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
  color: #e94949;
  text-transform: uppercase;
}
.confrimBox:hover span {
  color: #c9c9c9;
}
.confrimBox:hover {
  background-color: #e94949;
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
  color: #bf5353;
  font-size: 0.7rem;
  font-weight: 500;
  align-self: center;
}
</style>
