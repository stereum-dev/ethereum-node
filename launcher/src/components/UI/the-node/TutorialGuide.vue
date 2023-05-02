<template>
  <div class="bg-dark">
    <div v-if="rpcOne" :key="rpcOne" class="wrapper">
      <div class="header-node" @click.prevent="rpcStepOne">
        <div class="title">{{ $t("pagesnav.control") }}</div>
      </div>
      <img src="../../../../public/img/icon/arrows/curved-arrow.png" class="header-arrow" />
      <div class="step-one">
        <span>{{ $t("rpcGuide.clickNav") }}</span>
      </div>
    </div>
    <div v-if="rpcTwo" class="wrapper">
      <transition name="modal">
        <div v-if="firstPoint" class="secondContainer"><RpcEndpoint class="big" /></div>
      </transition>
      <div v-if="secondPoint" class="point-wrapper">
        <div class="first-point">
          <div class="first-point_icon">
            <img src="../../../../public/img/icon/arrows/Pointer1.png" alt="pointer" />
          </div>
          <div class="first-point_title">{{ $t("rpcGuide.toggleMessage") }}</div>
        </div>
        <div class="first-border"></div>
      </div>
      <div v-if="thirdPoint" class="point-wrapper">
        <div class="second-point">
          <div class="second-point_title">{{ $t("rpcGuide.clickExtention") }}</div>
          <div class="second-point_icon"><img src="/img/icon/arrows/Pointer1.png" alt="pointer" /></div>
        </div>
        <div class="second-border"></div>
      </div>
      <div v-if="fixRPC" class="last-part">
        <div v-if="explainRPC" class="fixExplain">
          <div class="step-two">
            <span>{{ mainMessage }}</span>
          </div>
          <img src="/img/icon/arrows/rotated-right-arrow.png" class="comp-arrow" />
        </div>
        <div class="fix-place"><RpcEndpoint /></div>
        <div class="exit"><div class="close" @click="close">x</div></div>
      </div>
    </div>
    <div v-if="explainModal" class="wrapper-modal">
      <div class="slider-modal">
        <div class="slider-modal_header">
          <span>{{ message }}</span>
        </div>
        <div class="slider-container">
          <div class="arrow"><div class="left" @click="prevSlide"></div></div>
          <div class="slider"><img :src="slide" alt="" /></div>
          <div class="arrow"><div class="right" @click="nextSlide"></div></div>
        </div>
        <div class="footer">
          <span>{{ $t("rpcGuide.clickCancel") }}</span>
        </div>
      </div>
      <div class="x-btn" @click="close"><span>x</span></div>
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
      explainRPC: false,
      explainModal: false,
      slide: "",
      message: "",
      firstMessage: this.$t("rpcGuide.firstMessage"),
      secondMessage: this.$t("rpcGuide.secondMessage"),
      mainMessage: "",
      sliderTutorial: [
        {
          id: 1,
          img: "/img/icon/tutorial-icons/two.png",
          text: this.$t("rpcGuide.firstSlide"),
        },
        {
          id: 2,
          img: "/img/icon/tutorial-icons/three.png",
          text: this.$t("rpcGuide.secondSlide"),
        },
        {
          id: 3,
          img: "/img/icon/tutorial-icons/four.png",
          text: this.$t("rpcGuide.thirdSlide"),
        },
        {
          id: 4,
          img: "/img/icon/tutorial-icons/five.png",
          text: this.$t("rpcGuide.fourthSlide"),
        },
        {
          id: 5,
          img: "/img/icon/tutorial-icons/six.png",
          text: this.$t("rpcGuide.fivethSlide"),
        },
        {
          id: 6,
          img: "/img/icon/tutorial-icons/seven.png",
          text: this.$t("rpcGuide.sixthSlide"),
        },
        {
          id: 7,
          img: "/img/icon/tutorial-icons/eight.png",
          text: this.$t("rpcGuide.seventhSlide"),
        },
        {
          id: 8,
          img: "/img/icon/tutorial-icons/nine.png",
          text: this.$t("rpcGuide.eightthSlide"),
        },
        {
          id: 9,
          img: "/img/icon/tutorial-icons/ten.png",
          text: this.$t("rpcGuide.ninethSlide"),
        },
      ],
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      tutorial: "tutorial",
      rpcOne: "rpcOne",
      rpcTwo: "rpcTwo",
      activeRPC: "activeRPC",
      nextStepFlag: "nextStepFlag",
    }),
  },
  watch: {
    activeRPC(newVal) {
      if (newVal === true) {
        this.pointScenario();
      }
    },
    nextStepFlag(newVal) {
      const currentSlide = this.sliderTutorial.find((slide) => slide.id === newVal - 1);
      if (currentSlide) {
        this.slide = currentSlide.img;
        this.message = currentSlide.text;
      }

      if (newVal === 1) {
        this.fixRPC = true;
        this.explainRPC = true;
        this.explainModal = false;
        this.firstPoint = false;
      } else if (newVal === 2) {
        this.fixRPC = false;
        this.firstPoint = false;
        this.explainRPC = false;
        this.explainModal = true;
      } else if (newVal === 11) {
        this.fixRPC = true;
        this.firstPoint = false;
        this.explainRPC = true;
        this.explainModal = false;
        this.mainMessage = this.secondMessage;
        setTimeout(() => {
          this.tutorial = false;
          this.rpcOne = true;
          this.rpcTwo = false;
          this.nextStepFlag = 0;
          this.explainModal = false;
          this.fixRPC = false;
        }, 5000);
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
    nextSlide() {
      this.nextStepFlag++;
    },
    prevSlide() {
      this.nextStepFlag--;
    },
    rpcStepOne() {
      this.rpcOne = false;
      setTimeout(() => {
        this.$router.push("/control");
      }, 10);
      this.rpcTwo = true;
    },
    bigComp() {
      setTimeout(() => {
        this.firstPoint = true;
      }, 900);
    },
    pointScenario() {
      setTimeout(() => {
        this.secondPoint = true;
      }, 2000);
      setTimeout(() => {
        this.thirdPoint = true;
        this.secondPoint = false;

        setTimeout(() => {
          this.firstPoint = false;
          this.thirdPoint = false;
          this.fixRPC = true;

          setTimeout(() => {
            this.nextStepFlag = 1;
            this.mainMessage = this.firstMessage;
            this.explainRPC = true;
          }, 1500);
        }, 3000);
      }, 4500);
    },
    close() {
      this.tutorial = false;
      this.rpcOne = true;
      this.rpcTwo = false;
      this.nextStepFlag = 0;
    },
  },
};
</script>

<style scoped>
.x-btn {
  width: 60%;
  height: 8%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 200%;
  color: #eeeeee;
}
.footer {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: red;
}
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
.wrapper-modal {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  flex-direction: column;
}
.slider-modal {
  width: 80%;
  height: 80%;
  background: #264744;
  border-radius: 20px;
  border: 4px solid grey;
  display: flex;
  flex-direction: column;
}
.slider-modal_header {
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eee;
  font-size: 100%;
  font-weight: 600;
}
.slider-container {
  display: flex;
  width: 100%;
  height: 75%;
  display: flex;
}
.arrow {
  display: flex;
  width: 10%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.slider {
  display: flex;
  width: 80%;
  height: 100%;
  border-radius: 20px;
  border: 5px solid grey;
}
.slider img {
  width: 100%;
  border-radius: 20px;
}
.left {
  width: 0;
  height: 0;
  border-top: 90px solid transparent;
  border-bottom: 90px solid transparent;
  border-right: 20px solid grey;
  cursor: pointer;
}
.right {
  width: 0;
  height: 0;
  border-top: 90px solid transparent;
  border-bottom: 90px solid transparent;
  border-left: 20px solid grey;
  cursor: pointer;
}
.left:active,
.right:active {
  transform: scale(0.9);
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
