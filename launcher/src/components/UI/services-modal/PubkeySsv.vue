<template>
  <div class="pubkey-parent" @click="$emit('openPubkey')">
    <div class="operator-box">
      <div class="operator-btn">
        <span> Register New Operator</span>
      </div>
    </div>
    <div class="dashboard-box">
      <div class="dashboard-btn">
        <span>Insert Operator Key</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["pubkey"],
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
.dashboard-box {
  width: 90%;
  height: 42px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.operator-btn,
.dashboard-btn {
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
.dashboard-btn span {
  width: max-content;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(57, 57, 57);
  transition-duration: 50ms;
}
.operator-btn:hover,
.dashboard-btn:hover {
  transform: scale(1.01);
  background-color: rgb(9, 140, 216);
  border: 1px solid #91caf3;
  border-radius: 10px;
  transition-duration: 50ms;
}
.operator-btn:hover span,
.dashboard-btn:hover span {
  color: rgb(222, 222, 222);
}
.operator-btn:active,
.dashboard-btn:active {
  transform: scale(1);
  background-color: rgb(6, 116, 180);
  box-shadow: none;
  border: none;
}
.operator-btn:active span,
.dashboard-btn:active span {
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
