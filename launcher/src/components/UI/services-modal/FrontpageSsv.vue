<template>
  <div class="pubkey-parent">
    <div class="operator-box">
      <div class="operator-content">
        <span class="title">{{ $t("frontPageSsv.newRegistritionTitle") }}</span>
        <span class="description">{{ $t("frontPageSsv.newRegistritionText") }}</span>
      </div>
      <div class="operator-btn" @click="$emit('openPubkey')">
        <span> {{ $t("frontPageSsv.register") }}</span>
      </div>
    </div>
    <div class="insert-box">
      <div class="insert-content">
        <span class="title">{{ $t("frontPageSsv.insertTitle") }}</span>
        <span class="description">{{ $t("frontPageSsv.insertText") }}</span>
      </div>
      <div class="insert-btn" @click="$emit('openSecretkey')">
        <span>{{ $t("frontPageSsv.register") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props : {
    pubkey: {
      type: String,
      required: true,
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
.insert-box {
  width: 97%;
  height: 30%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 3px 1px #252525;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.operator-box .operator-content,
.insert-box .insert-content {
  width: 70%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.operator-box .operator-content .title,
.insert-box .insert-content .title {
  color: #c4c4c4;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}
.operator-box .operator-content .description,
.insert-box .insert-content .description {
  color: #c4c4c4;
  font-size: 0.7rem;
  font-weight: 500;
  margin-top: 10px;
}

.operator-btn,
.insert-btn {
  width: 25%;
  height: 100%;
  padding: 8px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  box-sizing: border-box;
}

.operator-btn span,
.insert-btn span {
  width: 90%;
  height: 42%;
  border-radius: 55px;
  padding: 5px;
  border: 2px solid #0b8fdc;
  background-color: #0b8fdc;
  box-shadow: 1px 1px 8px 1px rgb(28, 42, 60);
  font-size: 0.8rem;
  font-weight: 600;
  color: #dddddd;
  transition-duration: 50ms;
  text-align: center;
  text-transform: uppercase;
}
.operator-btn span:hover,
.insert-btn span:hover {
  background-color: #06669e;
  border: 2px solid #06669e;
  transition-duration: 0.2s;
}

.operator-btn span:active,
.insert-btn span:active {
  transform: scale(0.9);
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
  padding-left: 10px;
  font-size: 2rem;
  font-weight: 600;
  color: rgb(51, 129, 239);
}
</style>
