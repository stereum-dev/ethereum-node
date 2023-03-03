<template>
  <div class="restart-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="restart-icon">
        <img src="/img/icon/the-staking/stereum-error.png" alt="restart warning" />
      </div>
      <div class="restart-question">
        <span>{{ $t("restartModal.restarQ") }}</span>
      </div>
      <div class="nameId">
        <span class="service-name">{{ service.name }}</span>
        <span class="service-id">[ {{ service.config.serviceID }} ]</span>
      </div>
      <div class="restart-message">{{ $t("restartModal.restartMessage") }}</div>
      <div class="restart-button" :class="{ disabled: loading }" @click="$emit('restartConfirm', service)">
        <img v-if="loading" src="/img/icon/control/spinner.gif" alt="loading" />
        <span v-else>{{ $t("restartModal.restart") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["service", "loading"],
};
</script>

<style scoped>
.restart-modal_parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
}
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 102;
  cursor: default;
}
.browser-modal {
  width: 50%;
  height: 50%;
  background-color: #212122;
  border: 5px solid rgb(161, 161, 161);
  border-radius: 70px;
  position: absolute;
  top: 15%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 1050;
  cursor: default;
}
.restart-icon {
  width: 80%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2% 0;
}
.restart-icon img {
  width: 30%;
}
.restart-question {
  width: 90%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 100%;
}
.nameId {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 18%;
}
.service-name {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 120%;
}
.service-id {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 80%;
}
.restart-message {
  width: 90%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 100%;
}
.restart-button {
  width: 30%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 100%;
  background: rgb(255, 0, 25);
  border-radius: 10px;
  cursor: pointer;
  color: #eee;
}
.restart-button.disabled {
  background: rgba(255, 0, 25, 0.5);
  cursor: not-allowed;
  pointer-events: none;
}
.restart-button img {
  width: 35%;
}
.restart-button:active {
  transform: scale(0.9);
}
</style>
