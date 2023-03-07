<template>
  <div class="warning-modal-parent">
    <div class="modal-opacity" @click="$emit('closeModal')"></div>
    <div class="warning-modal-content">
      <div class="title-box">
        <img src="../../../../public/img/icon/the-staking/stereum-error.png" alt="icon" />
      </div>
      <div class="warningMessage">
        <p>{{ $t("warningModal.warningText") }}</p>
      </div>
      <div class="confirm-box">
        <span class="confirm-btn" @click="$emit('installBtn')">
          {{ $t("installOption.install") }}
        </span>
        <!-- <div class="confirm-btn" >
          <span>Confirm</span>
        </div> -->
        <span class="close">{{ $t("exitValidatorModal.clickClose") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style scoped>
.warning-modal-parent {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5002;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  bottom: 0;
  opacity: 0.8;
  z-index: 501;
}

.warning-modal-content {
  width: 54%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 15%;
  left: 23%;
  background-color: #272b2e;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 502;
}

.title-box {
  width: 100%;
  height: 40%;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-box img {
  width: 25%;
  height: 100%;
}

.warningMessage {
  width: 100%;
  height: 45%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.warningMessage p {
  width: 90%;
  font-size: 1rem;
  color: #b7b7b7;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

/* .warningMessage span {
    color: rgb(195, 195, 195);
    font-size: 1rem;
    font-weight: 700;
  } */
.confirm-box {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 502;
}

.confirm-link {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  outline-style: none;
  text-decoration: none;
}

.confirm-btn {
  width: 35%;
  height: 60%;
  border-radius: 10px;
  background-color: #409b94;
  box-shadow: 0 1px 2px 1px #1b403d;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.confirm-btn:hover {
  background-color: #2a6560;
}

.confirm-btn:active {
  transform: scale(0.95);
  box-shadow: none;
}

.close {
  color: rgb(237, 95, 95);
  font-size: 0.6rem;
  font-weight: 500;
  align-self: center;
}
</style>
