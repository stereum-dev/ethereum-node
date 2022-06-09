<template>
  <div class="pubkey-parent" @click="$emit('registerHandler')">
    <div class="operator-box">
      <div class="pubkey-box">
        <div class="pubkey-title">
          <span> OPERATOR PUBLIC KEY</span>
        </div>
        <div class="pub-key">
          <input
            v-on:focus="$event.target.select()"
            type="password"
            class="pubkey-input"
            ref="pubkeyRef"
            v-model="pubkey"
            readonly
          />
          <div class="copy-icon" @click="copyPubKey">
            <img src="/img/icon/service-icons/copy1.png" alt="icon" />
            <span>copied!</span>
          </div>
        </div>
      </div>
      <div class="secretkey-box">
        <div class="secretkey-title">
          <span> OPERATOR SECRET KEY</span>
        </div>
        <div class="secret-key">
          <input
            type="password"
            class="secretkey-input"
            v-model="pubkey"
            disabled
          />
          <div class="copy-icon">
            <img src="/img/icon/service-icons/copy1.png" alt="icon" />
            <span>copied!</span>
          </div>
        </div>
      </div>
    </div>
    <div class="register-box">
      <div class="text-1">
        <span
          >Please make sure to store and backup your operator secret key in a
          safe place.Do not share this key with anyone.</span
        >
      </div>
      <div class="text-2">
        <span
          >Copy your public operator key into this field to confirm that you
          stored your keys!</span
        >
      </div>
      <div class="copy-pubkey">
        <input
          type="password"
          class="pubkey-input bg-red-500"
          ref="copyPub"
          @change="getPubkeyHandler"
          v-model="pubkeyCopy"
        />
      </div>
      <div class="btn-box">
        <button
          @click="$emit('registerPubkey')"
          :class="{ 'btn-disabled': isBtnDisabled }"
          :disabled="isBtnDisabled"
        >
          REGISTER
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["pubkey"],
  data() {
    return {
      pubkeyCopy: null,
      isBtnDisabled: true,
    };
  },
  computed: {
    getPubkeyHandler() {
      if (this.$refs.copyPub.value.length > 0) {
        this.isBtnDisabled = false;
      } else {
        this.$router.push("/node");
      }
    },
  },
  methods: {
    copyPubKey() {
      let pubkeyToCopy = this.$refs.pubkeyRef.value;
      this.$copyText(pubkeyToCopy)
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
  height: 65%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #373737;
  border: 1px solid #c3c3c3;
  box-shadow: 1px 1px 2px 1px rgb(21, 21, 21);
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
.secret-key .copy-icon {
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
  width: 50%;
  height: 10%;
  text-align: center;
  margin-bottom: 40px;
  line-height: 8px;
}
.text-1 span {
  color: aliceblue;
  overflow-wrap: break-word;
  font-size: 0.6rem;
  font-weight: 400;
}
.text-2 {
  width: 80%;
  height: 10%;
  text-align: center;
  line-height: 8px;
}
.text-2 span {
  color: rgb(201, 69, 46);
  overflow-wrap: break-word;
  font-size: 0.7rem;
  font-weight: 400;
}
.copy-pubkey {
  width: 90%;
  height: 18%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #373737;
  border: 1px solid #c3c3c3;
  box-shadow: 1px 1px 2px 1px rgb(21, 21, 21);
}
.copy-pubkey input {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: rgb(212, 212, 212);
  padding-left: 10px;
  font-size: 2rem;
  font-weight: 600;
  outline-color: #3294c5;
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
  height: 55%;
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
  transform: scale(0.99);
  border: none;
  background-color: #1f2d37;
  color: #5ba3cd;
  box-shadow: none;
}
</style>
