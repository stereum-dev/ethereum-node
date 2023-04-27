<template>
  <div class="bg-dark">
    <div v-if="rpcOne" :key="rpcOne" class="wrapper">
      <div class="header-node" @click.prevent="rpcStepOne">
        <div class="title">{{ $t("pagesnav.control") }}</div>
      </div>
      <img src="../../../../public/img/icon/arrows/curved-arrow.png" class="header-arrow" />
      <div class="step-one"><span>Lorem ipsum dolor, sit amet consectetur adipisicing.</span></div>
    </div>
    <div v-if="rpcTwo" class="wrapper">
      <transition name="modal">
        <div v-if="firstPoint" class="secondContainer"><RpcEndpoint class="big" /></div>
      </transition>
      <div v-if="secondPoint" class="point-wrapper">
        <div class="first-point">
          <div class="first-point_icon"><img src="../../../../public/img/icon/arrows/Pointer1.png" alt="" /></div>
          <div class="first-point_title">Lorem ipsum dolor sit</div>
        </div>
        <div class="first-border"></div>
      </div>
      <div v-if="thirdPoint" class="point-wrapper">
        <div class="second-point">
          <div class="second-point_title">Lorem ipsum dolor sit</div>
          <div class="second-point_icon"><img src="../../../../public/img/icon/arrows/Pointer1.png" alt="" /></div>
        </div>
        <div class="second-border"></div>
      </div>
      <div v-if="fixRPC" class="last-part">
        <div class="step-two"><span>Lorem ipsum dolor, sit amet consectetur adipisicing.</span></div>
        <img src="../../../../public/img/icon/arrows/rotated-right-arrow.png" class="comp-arrow" />
        <div class="fix-place"><RpcEndpoint /></div>
        <div class="exit"><div class="close" @click="close">x</div></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "../../../store/nodeHeader";
import RpcEndpoint from "../the-control/RpcEndpoint.vue";
export default {
  components: { RpcEndpoint },
  data() {
    return {
      firstPoint: false,
      secondPoint: false,
      thirdPoint: false,
      fixRPC: false,
      message: "Lorem ipsum dolor, sit amet consectetur adipisicing.",
      characters: [],
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      tutorial: "tutorial",
      rpcOne: "rpcOne",
      rpcTwo: "rpcTwo",
      activeRPC: "activeRPC",
    }),
  },
  watch: {
    activeRPC(newVal) {
      if (newVal === true) {
        this.pointScenario();
      }
    },
  },
  created() {
    if (this.rpcTwo === true) {
      this.bigComp();
    }
    if (this.activeRPC === true) {
      this.pointScenario();
    }
  },
  methods: {
    rpcStepOne() {
      this.rpcOne = false;
      setTimeout(() => {
        this.$router.push("/control");
      }, 10);
      this.rpcTwo = true;
    },
    bigComp() {
      // Set "one" to true after 1 second
      setTimeout(() => {
        this.firstPoint = true;
      }, 1000);
    },
    pointScenario() {
      setTimeout(() => {
        this.secondPoint = true;
      }, 3000);

      // Set "three" to true after 3 seconds
      setTimeout(() => {
        this.thirdPoint = true;
        // Set "two" to false when "three" is set to true
        this.secondPoint = false;

        // Set "one" and "three" to false after 3 seconds
        setTimeout(() => {
          this.firstPoint = false;
          this.thirdPoint = false;
          this.fixRPC = true;
        }, 5000);
      }, 5000);
    },
    close() {
      this.tutorial = false;
      this.rpcOne = true;
      this.rpcTwo = false;
    },
  },
};
</script>

<style scoped>
.close {
  width: 60%;
  height: 90%;
  border: 2px solid #eee;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 250%;
  border-radius: 50%;
  color: rgb(238, 238, 238);
}
.close:active {
  border: none;
  background: rgba(238, 238, 238, 0.2);
}
.exit {
  width: 10%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fix-place {
  width: 25%;
  height: 14%;
  position: absolute;
  left: 74%;
  top: 37%;
}
.last-part,
.wrapper {
  width: 100%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.first-border {
  width: 7%;
  height: 7%;
  display: flex;
  border: 3px dotted red;
  position: absolute;
  top: 39.5%;
  left: 56.7%;
  transform: translate(-50%, -50%);
}
.second-border {
  width: 20%;
  height: 7%;
  display: flex;
  border: 3px dotted red;
  position: absolute;
  top: 47%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.first-point {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 28%;
  height: 10%;
  position: absolute;
  top: 40%;
  left: 75%;
  transform: translate(-50%, -50%);
}
.second-point {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 28%;
  height: 10%;
  position: absolute;
  top: 48%;
  left: 25%;
  transform: translate(-50%, -50%);
}
.first-point_icon {
  transform: scaleY(-1);
  width: 20%;
  height: 100%;
  display: flex;
}
.first-point_icon img {
  width: 100%;
}
.second-point_icon {
  transform: rotate(180deg);
  width: 25%;
  height: 100%;
  display: flex;
}
.second-point_title,
.first-point_title {
  width: 75%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100;
  font-weight: 800;
  color: #eee;
}
.first-point_icon img {
  width: 100%;
}
.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 311;
}
.header-node {
  width: 11%;
  height: 7%;
  cursor: pointer;
  position: absolute;
  left: 16%;
  top: 1%;
  opacity: 1;
  color: #eee;
  text-transform: uppercase;
  font-weight: 800;
  z-index: 312;
}
.header-arrow {
  filter: invert(1);
  transform: rotate(180deg);
  width: 20%;
  position: absolute;
  left: 25%;
  top: 7%;
}
.comp-arrow {
  filter: invert(1);

  width: 20%;
  position: absolute;
  left: 52%;
  top: 37%;
}
.title {
  width: 100%;
  height: 100%;
  background: #264744;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.step-one {
  color: #eee;
  display: flex;
  width: 80%;
  height: 20%;
  font-size: 140%;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: absolute;
  top: 45%;
}
.step-two {
  color: #eee;
  display: flex;
  width: 80%;
  height: 20%;
  font-size: 140%;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: absolute;
  top: 20%;
  left: 10%;
}
.secondContainer {
  width: 20%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.big {
  width: 100%;
  height: 100%;
}
.modal-enter-active {
  animation: modal 0.2s ease-out;
}

.modal-leave-active {
  animation: modal 0.2s ease-in reverse;
}

@keyframes modal {
  from {
    opacity: 0;
    transform: translateX(100px) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
</style>
