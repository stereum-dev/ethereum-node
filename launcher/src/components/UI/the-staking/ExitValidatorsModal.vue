<template>
  <div class="exit-modal-parent">
    <div class="modal-opacity" @click="$emit('exitModal')"></div>
    <div class="exit-modal-content">
      <div class="title-box">
        <img src="../../../../public/img/icon/the-staking/stereum-error.png" alt="icon" />
      </div>
      <div class="exitMessage">
        <p>
          {{ $t("exitValidatorModal.modalMessage") }}
        </p>
      </div>
      <div class="check-box">
        <label for="checkbox">
          <input id="checkbox" v-model="isChecked" type="checkbox" />
          {{ $t("exitValidatorModal.exitApprove") }}
        </label>
        <div class="confirmBtn" :class="{ disabled: !isChecked }" @click="$emit('confirmBtn')">
          <span>{{ $t("exitValidatorModal.exitChain") }}</span>
        </div>
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
  data() {
    return {
      checked: null,
      isButtonDisabled: false,
    };
  },
  computed: {
    isChecked: {
      // getter
      get: function () {
        return this.checked ? true : false;
      },
      // setter
      set: function (newValue) {
        this.checked = newValue;
      },
    },
  },
};
</script>
<style scoped>
.exit-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 0;
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-opacity {
  width: 100%;
  height: 91%;
  background-color: rgb(29, 29, 29);
  border-radius: 0 20px 0 0;
  position: fixed;
  left: 0;
  bottom: 0;
  opacity: 0.5;
  z-index: 501;
}
.exit-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 80px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 5%;
  left: 22%;
  background-color: #336666;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 502;
}
.title-box {
  width: 100%;
  height: 30%;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box img {
  width: 25%;
  height: 100%;
}
.exitMessage {
  width: 95%;
  height: 35%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.exitMessage p {
  width: 90%;
  color: rgb(156, 156, 156);
  font-size: 0.75rem;
  font-weight: 600;
  word-wrap: break-word;
  text-align: justify;
  text-transform: uppercase;
}
.check-box {
  width: 90%;
  height: 35%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 502;
}
.check-box label {
  width: 100%;
  height: 30%;
  margin: 0 auto;
  font-size: 0.7rem;
  font-weight: 600;
  color: #303030;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.check-box #checkbox {
  width: 15px;
  height: 15px;
  margin-right: 10px;
  font-size: 0.6rem;
  font-weight: 300;
  color: #bfbfbf;
  justify-self: center;
  align-self: center;
  cursor: pointer;
  outline: none;
}
#checkbox[type="checkbox"]:focus {
  outline: none !important;
}
.check-box .confirmBtn {
  width: 40%;
  height: 40%;
  border-radius: 10px;
  border: 1px solid #8f8f8f;
  background-color: #b81717;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
  transform: scale(0.9);
}
.disabled {
  opacity: 0.7;
  pointer-events: none;
}
.confirmBtn:hover {
  transform: scale(1);
  transition-duration: 150ms;
  box-shadow: 0 1px 5px 1px rgb(35, 59, 53);
}
.confirmBtn:active {
  transform: scale(0.9);
  box-shadow: none;
}
.close {
  color: rgba(136, 6, 6, 0.588);
  font-size: 0.6rem;
  font-weight: 500;
  align-self: center;
}
</style>
