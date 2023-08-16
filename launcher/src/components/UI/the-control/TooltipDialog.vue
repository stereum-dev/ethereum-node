<template>
  <div v-if="open" :class="['parent-dialog', animateClass]">
    <div class="wrapper">
      <div class="top-epoch"><span>epoch</span><span>12345</span></div>
      <div class="bottom-epoch"><span>slot</span><span>34567789</span></div>
    </div>
  </div>
</template>

<script>
import "animate.css";
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      animateClass: "",
    };
  },
  watch: {
    open(newVal) {
      if (newVal) {
        this.animateClass = "animate__animated animate__flipInX";
        setTimeout(() => {
          this.animateClass = "";
        }, 500); // Adjust this delay to match your animation-duration
      }
    },
  },
};
</script>

<style scoped>
.parent-dialog {
  border-radius: 10px;
  z-index: 100;
  position: fixed;
  top: 10%;
  left: 40%;
  height: 25%;
  width: 30%;
  border: 3px solid #929292;
  background: #000;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  animation-duration: 0.5s;
}
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top-epoch,
.bottom-epoch {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 150%;
  color: #eee;
  font-weight: 600;
  text-transform: uppercase;
}
.top-epoch > span:nth-child(2) {
  color: #568d50; /* Change this to the desired font color */
}
</style>
