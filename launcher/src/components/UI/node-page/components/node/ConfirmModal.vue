<template>
  <div class="restart-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="restart-icon">
        <img :src="mainIcon ? '/img/icon/node-page-icons/turn-on.png' : '/img/icon/node-page-icons/turn-off.png'" alt="restart warning" />
      </div>
      <div class="text-container">
        <div class="toggle-message">
          <span>{{ $t("restartModal.confirmMessage") }} {{ mainIcon ? "on" : "off" }}?</span>
        </div>
        <div class="toggle-message">
          <span>{{ $t("confirmModal.message") }}</span>
        </div>
      </div>

      <div v-if="mainIcon" class="toggle-button_on" @click="$emit('powerToggleOn')">
        {{ $t("confirmModal.turnOn") }}
      </div>
      <div v-else class="toggle-button_off" @click="$emit('powerToggleOff')">
        <span>{{ $t("confirmModal.turnOff") }}</span>
      </div>
      <span class="clickOut">{{ $t("confirmModal.close") }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    mainIcon: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.clickOut {
  font-size: 70%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 6%;
  color: red;
  flex-direction: column;
}
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
  justify-content: space-around;
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
  width: 15%;
}
.text-container {
  width: 90%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.toggle-message {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 100%;
}
.toggle-button_on,
.toggle-button_off {
  width: 30%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 100%;

  border-radius: 10px;
  cursor: pointer;
  color: #eee;
}
.toggle-button_on {
  background: green;
}
.toggle-button_off {
  background: rgb(255, 0, 25);
}
.toggle-button.disabled {
  background: rgba(255, 0, 25, 0.5);
  cursor: not-allowed;
  pointer-events: none;
}
.toggle-button img {
  width: 35%;
}
.toggle-button:active {
  transform: scale(0.9);
}
</style>
