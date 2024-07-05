<template>
  <div class="warning-modal-paren">
    <div class="modal-opacity" @click="$emit('cancelWarning')"></div>
    <div class="warning-modal-content">
      <div class="title-box">
        <img src="/img/icon/staking-page-icons/stereum-error.png" alt="icon" />
      </div>
      <div class="warningMessage">
        <p>
          {{ $t("prunningModal.prunningText") }}
        </p>
      </div>
      <div class="check-box">
        <label for="checkbox">
          <input id="checkbox" v-model="isChecked" type="checkbox" />
          {{ $t("prunningModal.prunningChecked") }}
        </label>
        <div class="confirmBtn" :class="{ disabled: !isChecked }" @click="startPruning">
          <span>{{ $t("prunningModal.prunningStart") }}</span>
        </div>
        <span class="close">{{ $t("prunningModal.close") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { useDeepClone } from "@/composables/utils";
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
  methods: {
    startPruning() {
      this.$emit("cancelWarning");
      ControlService.chooseServiceAction({
        action: "pruneGeth",
        service: useDeepClone(this.item),
        data: {},
      });
    },
  },
};
</script>
<style scoped>
.warning-modal-paren {
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
  background-color: rgb(3, 3, 3);
  border-radius: 0 0 10px 10px;
  position: fixed;
  left: 0;
  bottom: 0;
  opacity: 0.5;
  z-index: 501;
}
.warning-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 65px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 22%;
  background-color: #33393e;
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
  width: 23%;
  height: 100%;
}
.warningMessage {
  width: 95%;
  height: 35%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.warningMessage p {
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
  color: #1b8da4;
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
  background-color: #127a65;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}
.disabled {
  opacity: 0.7;
  pointer-events: none;
}
.confirmBtn:hover {
  transform: scale(1.08);
  transition-duration: 150ms;
  box-shadow: 0 1px 5px 1px rgb(35, 59, 53);
}
.confirmBtn:active {
  transform: scale(1);
  box-shadow: none;
}
.close {
  color: rgba(186, 71, 71, 0.826);
  font-size: 0.6rem;
  font-weight: 500;
  align-self: center;
}
</style>
