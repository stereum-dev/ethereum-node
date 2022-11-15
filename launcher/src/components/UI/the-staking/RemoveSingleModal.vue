<template>
  <div class="remove-modal-parent">
    <div class="modal-opacity" @click="$emit('removeModal')"></div>
    <div class="remove-modal-content">
      <div class="title-box">
        <img
          src="../../../../public/img/icon/the-staking/stereum-error.png"
          alt="icon"
        />
      </div>
      <div class="removeMessage">
        <span>{{ $t("removeMultiModal.sure") }}</span>
        <p>{{ item.key }}</p>
        <span>{{ $t("removeMultiModal.from") }}</span>
      </div>
      <div class="slashingParent">
        <div class="pickSlashing">
          <label for="two">
            <input type="radio" id="two" value="Two" v-model="picked" />
            With out
          </label>

          <label for="one">
            <input type="radio" id="one" value="One" v-model="picked" />
            With
          </label>
        </div>
        <div class="pathBox" v-if="displayPathBox">
          <div class="pathBoxInput">
            <input
              type="text"
              v-model="path"
              placeholder="choose a path to save exported slashing db "
              @change="checkPath"
            />
          </div>
        </div>
      </div>

      <div class="remove-box" :class="{ disabled: !disabledBtn }">
        <div class="remove-btn" @click.stop="$emit('deleteKey')">
          <span>{{ $t("removeMultiModal.remove") }}</span>
        </div>
        <span class="close">{{ $t("exitValidatorModal.clickClose") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["item"],
  data() {
    return {
      picked: "",
      path: "",
      displayPathBox: false,
      disabledBtn: false,
    };
  },
  watch: {
    path: function () {
      if (this.path.trim().length > 0) {
        this.disabledBtn = true;
      } else {
        this.disabledBtn = false;
      }
    },
    picked: function () {
      if (this.picked === "Two") {
        this.displayPathBox = false;
        this.disabledBtn = true;
      } else {
        this.displayPathBox = true;
      }
    },
  },
};
</script>
<style scoped>
.remove-modal-parent {
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
  background-color: black;
  border-radius: 0 20px 0 0;
  position: fixed;
  left: 0;
  bottom: 0;
  opacity: 0.8;
  z-index: 501;
}
.remove-modal-content {
  width: 55%;
  height: 60%;
  border-radius: 75px;
  border: 3px solid #bfbfbf;
  position: absolute;
  top: 10%;
  left: 22%;
  background-color: #336666;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
  z-index: 1000;
}
.title-box {
  width: 100%;
  height: 35%;
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-box span {
  font-size: 4rem;
  font-weight: 900;
  color: #bfbfbf;
}
.title-box img {
  width: 27%;
  height: 100%;
}
.removeMessage,
.downloadMessage {
  width: 95%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.removeMessage p {
  width: 85%;
  color: rgb(156, 156, 156);
  font-size: 0.8rem;
  font-weight: 700;
  word-break: break-all;
  text-align: center;
}
.removeMessage span {
  color: rgb(197, 197, 197);
  font-size: 1rem;
  font-weight: 700;
  margin-top: 5px;
  text-align: center;
  text-transform: uppercase;
}
/* .removeMessage span {
  color: rgb(195, 195, 195);
  font-size: 1rem;
  font-weight: 700;
} */

.slashingParent {
  width: 95%;
  height: 20%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.pickSlashing {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.pickSlashing label {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: rgb(197, 197, 197);
  font-size: 0.7rem;
  font-weight: 700;
  margin-top: 5px;
  text-align: center;
  text-transform: uppercase;
}
.pickSlashing label input {
  width: 5%;
  height: 100%;
  margin-right: 5px;
}
.pathBox {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.remove-box {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 502;
}

.remove-btn {
  width: 30%;
  height: 50%;
  border-radius: 10px;
  border: 1px solid #8f8f8f;
  background-color: #c93d24;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.remove-btn:hover {
  transform: scale(1.08);
  transition-duration: 150ms;
  box-shadow: 0 1px 5px 1px rgb(35, 59, 53);
}
.remove-btn:active {
  transform: scale(1);
  box-shadow: none;
}
.close {
  color: rgba(136, 6, 6, 0.588);
  font-size: 0.65rem;
  font-weight: 500;
  align-self: center;
}
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
