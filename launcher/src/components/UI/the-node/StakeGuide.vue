<template>
  <div class="stake-guide-parent">
    <div v-if="stakeFirstStep" :key="stakeFirstStep" class="bg-dark">
      <div class="wrapper">
        <div class="header-node" @click.prevent="stakeGuideStep1">
          <div class="title">{{ $t("pagesnav.control") }}</div>
        </div>
        <img src="../../../../public/img/icon/arrows/curved-arrow.png" class="header-arrow" />
        <div class="step-one">
          <span>{{ $t("rpcGuide.clickNav") }}</span>
        </div>
      </div>
    </div>
    <div v-if="stakeSecondStep" class="wrapper">
      <h1>First Check if your Node is synced</h1>
      <img src="/img/icon/arrows/rotated-right-arrow.png" class="comp-arrow" />
      <div class="left-slide"></div>
      <div class="top-slide"></div>
      <div class="bottom-slide"></div>
      <div class="right-slide"></div>
    </div>
    <div v-if="stakeThirdStep" class="bg-dark">
      <div class="stake-modal">
        <div class="stake-modal_header">{{ slideID }}# {{ message }}</div>
        <div class="stake-modal_container">
          <div class="stake-modal-arr"><div class="left" @click="prevSlide"></div></div>
          <div class="stake-modal_slider-tutorial">
            <img :src="slide" alt="slide" />
          </div>
          <div class="stake-modal-arr"><div class="right" @click="nextSlide"></div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "../../../store/nodeHeader";
import { mapState } from "pinia";
import { useStakeSlide } from "../../../store/stakeSlide";

export default {
  data() {
    return {
      slideID: "",
      slide: "",
      message: "",
      nextStep: 0,
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      stakeFirstStep: "stakeFirstStep",
      stakeGuide: "stakeGuide",
      stakeSecondStep: "stakeSecondStep",
      stakeThirdStep: "stakeThirdStep",
    }),
    ...mapState(useStakeSlide, {
      sliderTutorial: "sliderTutorial",
    }),
  },
  watch: {
    stakeSecondStep(newVal) {
      if (newVal === true) {
        setTimeout(() => {
          this.stakeSecondStep = false;
          this.stakeThirdStep = true;
        }, 5000);
      }
    },
    nextStep(newVal) {
      const currentSlide = this.sliderTutorial.find((slide) => slide.id === newVal);
      if (currentSlide) {
        this.slideID = currentSlide.id;
        this.slide = currentSlide.img;
        this.message = currentSlide.text;
      }
    },
  },
  mounted() {
    this.nextStep++;
  },
  methods: {
    nextSlide() {
      this.nextStep++;
    },
    prevSlide() {
      this.nextStep--;
    },
    stakeGuideStep1() {
      this.stakeFirstStep = false;

      setTimeout(() => {
        this.$router.push("/control");
      }, 10);
      this.stakeSecondStep = true;
    },
  },
};
</script>
<style scoped>
.stake-guide-parent {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 311;
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
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
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
.title {
  width: 100%;
  height: 100%;
  background: #264744;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.header-arrow {
  filter: invert(1);
  transform: rotate(180deg);
  width: 20%;
  position: absolute;
  left: 25%;
  top: 7%;
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
.sync-status-widg {
  display: flex;
  width: 50%;
  height: 45%;
}
.left-slide {
  width: 49%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  left: 0;
}
.top-slide {
  width: 24.5%;
  height: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0;
  left: 49%;
}
.bottom-slide {
  width: 24.5%;
  height: 42%;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 65%;
  left: 49%;
}
.right-slide {
  width: 27%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0%;
  left: 73.5%;
}
.wrapper h1 {
  position: absolute;
  color: #eee;
  z-index: 400;
  font-size: 300%;
  font-weight: 800;
  top: 30%;
}
.comp-arrow {
  filter: invert(1);
  z-index: 400;
  width: 20%;
  position: absolute;
  left: 25%;
  top: 50%;
}
.stake-modal {
  width: 80%;
  height: 80%;
  background: #264744;
  border-radius: 20px;
  border: 4px solid grey;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stake-modal_header {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 120%;
  font-weight: 700;
  color: #eee;
}
.stake-modal_container {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 150%;
  font-weight: 700;
  color: #eee;
}
.stake-modal-arr {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.stake-modal_slider-tutorial {
  width: 80%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: blue;
  border-radius: 20px;
  border: 3px solid grey;
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
  border-top: 80px solid transparent;
  border-bottom: 90px solid transparent;
  border-left: 20px solid grey;
  cursor: pointer;
}
.left:active,
.right:active {
  transform: scale(0.9);
}
</style>
