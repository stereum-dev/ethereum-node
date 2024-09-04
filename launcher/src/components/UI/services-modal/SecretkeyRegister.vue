<template>
  <div class="secretkey-parent">
    <div class="secretkey-box">
      <label for="secretKey"
        >{{ $t("secretKeyReg.modalLabel") }}
        <input id="secretKey" v-model="enteredSecretkey" name="secretkey" type="password" @mousedown.stop />
      </label>
    </div>
    <div class="btn-box">
      <button :class="{ 'btn-disabled': isBtnDisabled }" :disabled="isBtnDisabled" @click="$emit('insertKey', enteredSecretkey)">
        {{ $t("secretKeyReg.apply") }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ssvService: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isBtnDisabled: true,
      enteredSecretkey: "",
    };
  },
  updated() {
    this.checkSecretkeyHandler();
  },
  methods: {
    checkSecretkeyHandler() {
      if (this.enteredSecretkey != "") {
        this.isBtnDisabled = false;
      } else if (this.enteredSecretkey === "") {
        this.isBtnDisabled = true;
      } else {
        this.$router.push("/node");
      }
    },
  },
};
</script>
<style scoped>
.secretkey-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.secretkey-box {
  width: 90%;
  height: 60%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
}
.secretkey-box label {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 602;
  color: rgb(105, 169, 241);
}
.secretkey-box input {
  width: 100%;
  height: 37px;
  border-radius: 8px;
  margin-top: 8px;
  background-color: rgb(212, 212, 212);
  padding-left: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: rgb(51, 129, 239);
  z-index: 601;
}

.btn-box {
  width: 100%;
  height: 16%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-box button {
  width: 25%;
  height: 70%;
  border-radius: 10px;
  background-color: #364a59;
  box-shadow: 1px 1px 5px 1px rgb(12, 12, 12);
  color: #cccccc;
  font-size: 1rem;
  font-weight: 600;
  outline-style: none;
  transition-duration: 80ms;
}
.btn-box .btn-disabled {
  border: none;
  background-color: #1f2d37 !important;
  color: #2f383d;
  z-index: -1;
}
.btn-box button:hover {
  transform: scale(1.07);
  border: 2px solid #364a59;
  background-color: #283742;
  color: #5ba3cd;
}
.btn-box button:active {
  transform: scale(1);
  border: none;
  background-color: #1f2d37;
  color: #5ba3cd;
  box-shadow: none;
}
</style>
