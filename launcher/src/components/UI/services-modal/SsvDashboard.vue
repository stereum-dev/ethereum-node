<template>
  <div class="pubkey-parent" @click="$emit('openPubkey')">
    <div class="pubkey-box">
      <div class="pub-key">
        <span class="input-text"
          >Public operator key</span
        >
        <input
          type="hidden"
          class="pubkey-input"
          v-model="pubkey"
          disabled
          placeholder="Public Operator Key"
        />
        <div class="copy-icon" @click="copyPubKey">
          <img src="/img/icon/service-icons/copy1.png" alt="icon" />
          <span>copied!</span>
        </div>
      </div>
    </div>
    <div class="operator-box">
      <div class="operator-btn">
        <span>My Operator Page</span>
      </div>
    </div>

    <div class="insert-box">
      <div class="insert-btn">
        <span>SSV Node Grafana Dashboard</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["pubkey"],
  data() {
    return {};
  },
  methods: {
    copyPubKey() {
      let pubkeyToCopy = this.pubkey;
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
.operator-box,
.pubkey-box,
.insert-box {
  width: 90%;
  height: 42px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pub-key {
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
.pubkey-input {
  width: 100%;
  height: 100%;
  border-radius: 8px 0 0 8px;
  background-color: rgb(212, 212, 212);
  padding: 0;
  padding-left: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: rgb(51, 129, 239);
}
.input-text {
  width: 94%;
  font-size: .9rem;
  padding-left: 30px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  color: #71b1e1;
}
.pub-key .copy-icon {
  justify-self: end;
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
  top: -15px;
  right:0;
}
.operator-btn,
.insert-btn {
  width: 100%;
  height: 85%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #20a9f8;
  box-shadow: 1px 1px 2px 1px rgb(21, 21, 21);
  transition-duration: 50ms;
}
.operator-btn span,
.insert-btn span {
  width: max-content;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(57, 57, 57);
  transition-duration: 50ms;
}
.operator-btn:hover,
.insert-btn:hover {
  transform: scale(1.01);
  background-color: rgb(9, 140, 216);
  border: 1px solid #91caf3;
  border-radius: 10px;
  transition-duration: 50ms;
}
.operator-btn:hover span,
.insert-btn:hover span {
  color: rgb(222, 222, 222);
}
.operator-btn:active,
.insert-btn:active {
  transform: scale(1);
  background-color: rgb(6, 116, 180);
  box-shadow: none;
  border: none;
}
.operator-btn:active span,
.insert-btn:active span {
  color: rgb(222, 222, 222);
}

.pub-key {
  width: 100%;
  height: 85%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #373737;
  border: 1px solid #c3c3c3;
  box-shadow: 1px 1px 2px 1px rgb(21, 21, 21);
}
.pub-key .copy-icon {
  width: 5%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.copy-icon img {
  width: 20px;
  height: 20px;
}
.copy-icon span {
  position: absolute;
}
.pubkey-input {
  width: 100%;
  height: 100%;
  border-radius: 8px 0 0 8px;
  background-color: rgb(212, 212, 212);
  padding: 0;
  padding-left: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: rgb(51, 129, 239);
}
</style>
