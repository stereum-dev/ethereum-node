<template>
  <div class="remove-modal-parent">
    <div class="modal-opacity" @click="$emit('removeModal')"></div>
    <div class="remove-modal-content">
      <div class="title-box">
        <img
          src="../../../../public/img/icon/header-icons/upgrade.png"
          alt=""
        />
      </div>
      <div class="update-message">
        <span>New version is now available.</span>
        <span>Do you want to update Stereum to the newest version?</span>
      </div>
      <div class="update-btn">
        <div class="confirm-box" @click="$emit('updateConfirm')">
          <span>Confirm</span>
        </div>
        <span class="close">Click outside to close.</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
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
  height: 40%;
  border-radius: 1rem;
  background-color: #324844;
  border: 4px solid rgb(171, 170, 170);
  z-index: 312;
  opacity: 1;
  position: fixed;
  top: 30%;
  left: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
}
.title-box {
  width: 100%;
  height: 50px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 45px;
  height: 45px;
}
.update-message {
  width: 90%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.update-message span:first-child {
  color: rgb(124, 162, 197);
  font-size: 0.9rem;
  font-weight: 700;
}
.update-message span:last-child {
  color: rgb(197, 197, 197);
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 10px;
}
/* .update-message span {
  color: rgb(195, 195, 195);
  font-size: 1rem;
  font-weight: 700;
} */
.update-btn {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
.confirm-box {
  width: 20%;
  height: 50%;
  margin-right: 20px;
  border-radius: 30px;
  border: 2px solid #8f8f8f;
  background-color: #32564d;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: .9rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.confirm-box:hover {
  color: #dadada;
  background-color: #2c433d;
  transform: scale(1.05);
  transition-duration:50ms;
}
.confirm-box:active {
  transform: scale(1);
  box-shadow: none;
}
.close {
  color: rgb(154, 154, 154);
  font-size: 0.55rem;
  font-weight: 500;
  align-self: center;
}
</style>
