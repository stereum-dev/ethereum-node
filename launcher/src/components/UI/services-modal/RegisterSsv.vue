<template>
  <div class="pubkey-parent" @click="$emit('registerHandler')">
    <div class="operator-box">
      <div class="pubkey-box">
        <div class="pub-key">
          <span class="pubkey-input_text">{{ $t("registerSSV.pubKey") }}</span>
          <input ref="pubkeyRef" v-model="localpubkey" type="hidden" class="pubkey-input" readonly @focus="$event.target.select()" />
          <div class="copy-icon" @click="copyPubKey">
            <img src="/img/icon/service-modals-icons/copy.png" alt="icon" />
            <span>{{ $t("registerSSV.copied") }}</span>
          </div>
        </div>
      </div>
      <div class="secretkey-box">
        <div class="secret-key">
          <span class="secretkey-input_text">{{ $t("registerSSV.secKey") }}</span>
          <input v-model="localsecretkey" type="hidden" class="secretkey-input" disabled />
          <div class="copy-icon" @click="copySecretKey">
            <img src="/img/icon/service-modals-icons/copy.png" alt="icon" />
            <span>{{ $t("registerSSV.copied") }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="register-box">
      <div class="text-1">
        <span>{{ $t("registerSSV.makeSureText") }}</span>
      </div>
      <div class="copiedPubKey">
        <label for="copyPubkey"
          >{{ $t("registerSSV.copyMessage") }}
          <input id="copyPubkey" v-model="model.copiedPubkey" name="copiedPubkey" type="password" @mousedown.stop />
        </label>
      </div>
      <div class="btn-box">
        <button :class="{ 'btn-disabled': isBtnDisabled }" :disabled="isBtnDisabled" @click="$emit('registerPubkey')">
          {{ $t("frontPageSsv.register") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pubkey: {
      type: String,
      required: true,
    },
    secretkey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      model: {
        copiedPubkey: "",
        copiedSecretkey: "",
      },
      localpubkey: this.pubkey,
      localsecretkey: this.secretkey,
      isBtnDisabled: true,
    };
  },
  updated() {
    this.getPubkeyHandler();
  },
  methods: {
    getPubkeyHandler() {
      if (this.model.copiedPubkey === this.localpubkey) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    },
    copyPubKey() {
      let pubkeyToCopy = this.localpubkey;
      navigator.clipboard
        .writeText(pubkeyToCopy)
        .then(() => {
          console.log("copied!");
        })
        .catch(() => {
          console.log(`can't copy`);
        });
    },
    copySecretKey() {
      let secretkeyToCopy = this.localsecretkey;
      navigator.clipboard
        .writeText(secretkeyToCopy)
        .then(() => {
          console.log("copied!");
        })
        .catch(() => {
          console.log(`can't copy`);
        });
    },
  },
};
</script>
<style scoped>
.pubkey-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.operator-box {
  width: 90%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.pubkey-box,
.secretkey-box {
  width: 100%;
  height: 40%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.pubkey-title,
.secretkey-title {
  width: 100%;
  height: 20px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 500;
  color: rgb(215, 215, 215);
}

.pub-key,
.secret-key {
  width: 100%;
  height: 68%;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #373737;
  border: 1px solid #c3c3c3;
  box-shadow: 1px 1px 2px 1px rgb(21, 21, 21);
}
.pubkey-input_text,
.secretkey-input_text {
  width: 94%;
  font-size: 0.9rem;
  padding-left: 30px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  color: #71b1e1;
}
.pubkey-input,
.secretkey-input {
  width: 100%;
  height: 100%;
  border-radius: 8px 0 0 8px;
  background-color: rgb(212, 212, 212);
  padding-left: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: rgb(51, 129, 239);
}
.pub-key .copy-icon,
.secret-key .copy-icon,
.copiedPubKey .copy-icon {
  width: 5%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.copy-icon img {
  width: 20px;
  height: 20px;
}
.copy-icon:active img {
  transform: scale(0.95);
}
.pub-key .copy-icon:active span {
  display: block;
}
.secret-key .copy-icon:active span {
  display: block;
}

.copy-icon span {
  display: none;
  background-color: transparent;
  color: rgb(96, 150, 120);
  font-size: 0.5rem;
  position: absolute;
  top: 0;
  right: -4%;
}
.register-box {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.text-1 {
  width: 70%;
  height: 12%;
  text-align: center;
  margin-bottom: 40px;
  line-height: 12px;
}
.text-1 span {
  color: aliceblue;
  overflow-wrap: break-word;
  font-size: 0.7rem;
  font-weight: 500;
}

.copiedPubKey label {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
  color: rgb(201, 69, 46);
  font-size: 0.7rem;
  font-weight: 500;
  z-index: 701;
}
.copiedPubKey {
  width: 90%;
  height: 45%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  z-index: 700;
}
.copiedPubKey input {
  width: 100%;
  height: 50%;
  overflow: hidden;
  border-radius: 8px;
  background-color: rgb(212, 212, 212);
  padding: 0;
  padding-left: 10px;
  margin-top: 10px;
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(51, 129, 239);
  z-index: 1000000;
}

.btn-box {
  width: 100%;
  height: 30%;
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
  border: 2px solid #364a59;
  background-color: #283742;
  color: #5ba3cd;
}
.btn-box button:active {
  box-shadow: 1px 1px 10px 1px #171717 inset !important;
  border: none;
  background-color: #1f2d37;
  color: #5ba3cd;
  box-shadow: none;
}
</style>
