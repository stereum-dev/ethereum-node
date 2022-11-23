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
        <span>{{ $t("removeMultipleValidators.sureText") }}</span>
        <span>{{
          $t("removeMultiModal.slashing")
        }}</span>
      </div>
      <div class="slashingParent">
        <!-- <Transition name="slide-up">
          <div class="pathBox" v-if="displayPathBox">
            <div class="pathBoxInput">
              <input
                class="form-input block w-full"
                type="text"
                v-model="path"
                placeholder="choose a path to save exported slashing db "
                @change="checkPath"
              />
            </div>
          </div> -->
          <div class="pickSlashing">
            <label for="no" class="inline-flex items-center">
              <input
                class="form-radio"
                type="radio"
                id="no"
                value="no"
                v-model="picked"
              />
              NO
            </label>

            <label for="yes" class="inline-flex items-center">
              <input
                class="form-radio"
                type="radio"
                id="yes"
                value="yes"
                v-model="picked"
              />
              YES
            </label>
          </div>
        <!-- </Transition> -->
      </div>
      <div class="remove-box">
        <div class="remove-btn" @click="$emit('deleteKey',picked)">
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
  data(){
    return{
      picked: "",
    }
  }
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
  opacity: 0.7;
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
.title-box img {
  width: 28%;
  height: 100%;
}
.removeMessage {
  width: 85%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.removeMessage p {
  width: 85%;
  color: rgb(156, 156, 156);
  font-size: 0.7rem;
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
  font-size: 1.1rem;
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
  font-size: 0.7rem;
  font-weight: 500;
  align-self: center;
}
.pickSlashing {
  width: 30%;
  height: max-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
}
.pickSlashing label {
  width: 30%;
  height: 40%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: rgb(209, 211, 210);
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 5px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
}
.pickSlashing label input {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.pickSlashing label input:hover {
  border: 2px solid rgb(17, 172, 255);
  border-radius: 100%;
}
.slashingParent {
  width: 95%;
  height: 20%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
