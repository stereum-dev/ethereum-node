<template>
  <div class="key-modal-parent">
    <div class="modal-opacity"></div>
    <div class="key-modal-content">
      <div class="title-box" v-if="importIsProcessing">
        <span>Importing validator key(s)</span>
      </div>
      <div class="processImg" v-if="importIsProcessing">
        <img src="/img/icon/the-staking/bicycle2.gif" alt="icon" />
      </div>
      <div class="import-message" v-if="importIsProcessing">
        <span>It may take some times</span>
        <span>Please wait until the key is imported</span>
      </div>
      <div class="import-message" v-if="importIsDone">
        <span>{{ message }}</span>
      </div>
      <div class="confirm-btn" v-if="importIsDone">
        <div class="confirm-box" @click="$emit('hideModal')">
          <span>Confirm</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SandClock from "../the-control/SandClock.vue";
export default {
  components: { SandClock },
  props: ["message"],
  data() {
    return {
      importIsProcessing: true,
      importIsDone: false,
    };
  },
};
</script>
<style scoped>
.key-modal-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 10%;
  left: 5%;
  z-index: 310;
}
.modal-opacity {
  width: 100%;
  height: 100%;
  background-color: black;
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 311;
}
.key-modal-content {
  width: 50%;
  height: 50%;
  border-radius: 1rem;
  background-color: #363a41;
  border: 4px solid rgb(171, 170, 170);
  z-index: 312;
  opacity: 1;
  position: absolute;
  top: 13%;
  left: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 1px 5px 1px rgb(6, 6, 6);
}
.title-box {
  width: 100%;
  height: 50px;
  background-color: rgb(55, 107, 102);
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title-box span {
  color: rgb(162, 162, 162);
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
}
.processImg {
  width: 80%;
  height: 30%;
  margin: 0 auto;
  position: relative;
  border-bottom: 1px solid gray;
}
.processImg img {
  width: 40px;
  height: 27px;
  position: absolute;
  animation: move 5s linear infinite;
}
@keyframes move {
  0% {
    left: 0%;
    bottom: 5px;
  }
  25% {
    left: 25%;
    bottom: 5px;
  }
  50% {
    left: 50%;
    bottom: 5px;
  }
  75% {
    left: 75%;
    bottom: 5px;
  }
  100% {
    left: 90%;
    bottom: 5px;
  }
}
.import-message {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.import-message span {
  color: rgb(156, 156, 156);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  text-transform: unset;
}
.confirm-btn {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.confirm-box {
  width: 50%;
  height: 45%;
  border-radius: 10px;
  border: 1px solid #8f8f8f;
  background-color: #8f8f8f;
  box-shadow: 0 1px 3px 1px rgb(35, 59, 53);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(210, 210, 210);
  text-transform: uppercase;
}

.confirm-box:hover {
  transform: scale(1.1);
  transition-duration: 100ms;
  border: 1px solid #4e0a0a;
}
.confirm-box:active {
  transform: scale(1);
  box-shadow: none;
  transition-duration: 100ms;
}
.close {
  color: rgb(154, 154, 154);
  font-size: 0.55rem;
  font-weight: 500;
  align-self: center;
}
</style>
