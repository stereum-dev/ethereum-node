<template>
  <div class="resync-modal_parent">
    <div class="bg-dark" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="resync-icon">
        <img src="/img/icon/plugin-menu-icons/resync.png" alt="resync modal" />
      </div>
      <div class="resync-question">
        <span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse, et.</span>
      </div>
      <div class="nameId">
        <span class="service-name">{{ service.name }}</span>
        <span class="service-id">[ {{ service.config.serviceID }} ]</span>
      </div>
      <div class="resync-message">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, est!</div>
      <div class="resync-button" :class="{ disabled: loading }" @click="$emit('resyncConfirm', service)">
        <img v-if="resyncLoading" src="/img/icon/control/spinner.gif" alt="loading" />
        <span v-else>resync</span>
      </div>
      <span class="clickOut">click outside to close</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    service: {
      type: Object,
      required: true,
    },
    resyncLoading: {
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
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6%;
  color: red;
}
.resync-modal_parent {
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
.resync-icon {
  width: 80%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2% 0;
}
.resync-icon img {
  width: 15%;
}
.resync-question {
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
.resync-message {
  width: 90%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 100%;
}
.resync-button {
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
.resync-button.disabled {
  background: rgba(255, 0, 25, 0.5);
  cursor: not-allowed;
  pointer-events: none;
}
.resync-button img {
  width: 35%;
}
.resync-button:active {
  transform: scale(0.9);
}
</style>
