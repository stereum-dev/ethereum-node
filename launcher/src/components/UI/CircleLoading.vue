<template>
  <div class="progress-box">
    <div class="progress">
      <div class="color"></div>
      <img src="/img/icon/welcome-page/gear.png" class="gear" v-if="active" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    open: Boolean,
  },

};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.75);
}

dialog {
  position: fixed;
  top: 30vh;
  width: 30rem;
  left: calc(50% - 15rem);
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
  padding: 1rem;
  background-color: rgb(100, 100, 100);
  z-index: 100;
  border: none;
}

.progress .gear {
  animation: gear 5s linear infinite;
  position: absolute;
  right: 1px;
  width: 2.5%;
  float: right;
}

@keyframes gear {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* TEST*/

.progress-box {
  width: 435px !important;
  height: 15px !important;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.progress {
  position: relative;
  height: 83% !important;
  width: 99.8% !important;
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.progress span {
  font-size: 0.65rem;
  font-weight: 700;
  color: rgb(44, 44, 44);
  text-align: left;
  margin-left: 11px;
  z-index: 100;
}

.progress .color {
  position: absolute;
  left: 0;
  width: 0;
  background-color: #237fd5;
  height: 15px;
  border-radius: 20px;
  border: 1px solid rgb(37, 89, 113);
  animation: progres 5s linear;
  animation-fill-mode: forwards;
  box-shadow: inset 1px 2px 5px #acd5fc, 0 0 1px 1px rgb(52, 52, 52);
}

.check-msg {
  text-align: center;
}

@keyframes progres {
  0% {
    width: 0%;
  }

  10% {
    width: 10%;
  }

  25% {
    width: 25%;
  }

  50% {
    width: 50%;
  }

  75% {
    width: 85%;
  }

  100% {
    width: 100%;
  }
}

;
</style>
