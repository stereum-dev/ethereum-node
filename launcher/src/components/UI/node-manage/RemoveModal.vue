<template>
  <div class="remove-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="remove-modal-content">
      <div class="title-box">
        <img
          src="../../../../public/img/icon/manage-node-icons/stop.png"
          alt=""
        />
      </div>
      <div class="remove-message">
        <span class="warning">All services will be removed.</span>
        <span class="question">Are you sure?</span>
      </div>
      <div class="remove-btn">
        <div class="yes-box" @click="$emit('removeItems')">
          <span>Remove</span>
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
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 17%;
  background-color: #33393e;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 502;
}
.title-box {
  width: 80%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.title-box img {
  width: 25%;
  height: 100%;
}
.remove-message {
  width: 90%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.remove-message .warning {
  color: rgb(195, 195, 195);
  font-size: 1.3rem;
  font-weight: 800;
  text-transform: uppercase;
}
.remove-message .question {
  color: rgb(195, 195, 195);
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: capitalize;
}
.remove-btn {
  width: 90%;
  height: 45%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.yes-box {
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
.yes-box span {
  font-size: 0.9rem;
  font-weight: 700;
  color: #e94949;
  text-transform: uppercase;
}
.yes-box:hover span {
  color: #c9c9c9;
}
.yes-box:hover {
  background-color: #e94949;
  border: 2px solid #c9c9c9;
  transform: scale(1.05);
  transition: all 100ms;
  color: #d6d6d6;
}

.yes-box:active {
  transform: scale(1);
  box-shadow: none;
}

.close {
  color: rgb(243, 74, 74);
  font-size: 0.7rem;
  font-weight: 500;
  align-self: center;
}
</style>
