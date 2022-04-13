<template>
  <div class="progress-box">
    <div class="progress">
      <div class="color"></div>
      <span v-if="active"
        >CHECKING IF THE OS OF YOUR SERVER IS SUPPORTED...</span
      >
      <span v-if="!active">{{ this.message }}</span>
      <img src="/img/icon/icon-settings.svg" class="modal" v-if="open" />
    </div>
  </div>
</template>

<script>
export default {
  //emits: ["close"],
  props: {
    message: String,
    open: Boolean,
  },
  data() {
    return {
      active: true,
    };
  },
  created() {
    setTimeout(() => {
      this.active = false;
    }, 5000);
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
  background-color: white;
  z-index: 100;
  border: none;
}

.modal {
  animation: modal 5s linear infinite;
  position: relative;
  width: 4%;
}

@keyframes modal {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* TEST*/

.progress-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress {
  position: relative;
  height: 32%;
  width: 92%;
  border: 3px solid #6e8582;
  box-shadow: 0 1px 3px 1px rgb(28, 52, 48);
  border-radius: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.progress span {
  font-size: 0.7rem;
  font-weight: 800;
  color: rgb(255, 255, 255);
  position: relative;
  text-align: left;
  margin-left: 10px;
  margin: 2px 0 0 10px;
}

.progress .color {
  position: absolute;
  background-color: #0f558a;
  width: 0px;
  height: 100%;
  border-radius: 20px;
  animation: progres 5s linear;
  animation-fill-mode: forwards;
}

@keyframes progres {
  0% {
    width: 0%;
  }
  10% {
    width: 10%;
  }
  25% {
    width: 50%;
  }
  50% {
    width: 75%;
  }
  75% {
    width: 85%;
  }
  100% {
    width: 100%;
  }
} ;
</style>
