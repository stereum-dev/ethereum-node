<template>
  <div class="support-modal-parent">
    <div class="modal-opacity" @click="$emit('closeMe')"></div>
    <div class="support-modal-content">
      <div class="content">
        <div class="supportBox">
          <div class="title">
            <span>support</span>
          </div>
          <div class="text">
            <p>
              The fastest way to reach a person for support is to join our
              Discord server!
            </p>
          </div>
          <div class="btnBox">
            <img
              src="../../../../public/img/icon/manage-node-icons/stop.png"
              alt=""
            />
            <span
              >or write an email to: <strong>support@stereum.net</strong></span
            >
          </div>
        </div>
        <div class="reportBox">
          <div class="title">
            <span>BUG REPORT</span>
          </div>
          <div class="text">
            <p>
              Please take the time and write out a issue on Github, with your
              help we can me Stereum better!
            </p>
          </div>
          <div class="btnBox">
            <img
              src="../../../../public/img/icon/manage-node-icons/stop.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <span class="close">Click outside to cancel</span>
    </div>
  </div>
</template>
<style scoped>
.support-modal-parent {
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
.support-modal-content {
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
  height: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content .supportBox,
.content .reportBox {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.content .supportBox .title,
.content .reportBox .title {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close {
  color: #bf3a3a;
  font-size: 0.7rem;
  font-weight: 400;
  align-self: center;
}
</style>
