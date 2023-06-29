<template>
  <div class="stake-guide-parent">
    <div v-if="stakeFirstStep" :key="stakeFirstStep" class="bg-dark">
      <div class="wrapper">
        <div class="header-node" @click.prevent="stakeGuideStep1">
          <div class="title">{{ $t("pagesnav.control") }}</div>
        </div>
        <img src="/img/icon/arrows/curved-arrow.png" class="header-arrow" />
        <div class="step-one">
          <span>{{ $t("rpcGuide.clickNav") }}</span>
        </div>
      </div>
    </div>
    <div v-if="stakeSecondStep" class="wrapper">
      <h1>{{ $t("stakeGuide.syncCheck") }}</h1>
      <img src="/img/icon/arrows/rotated-right-arrow.png" class="comp-arrow" />
      <div class="left-slide"></div>
      <div class="top-slide"></div>
      <div class="bottom-slide"></div>
      <div class="right-slide"></div>
    </div>
    <div v-if="stakeThirdStep" class="bg-dark">
      <div class="stake-modal">
        <div class="stake-modal_header">
          <div class="stake-modal_header_slideNo">
            <span>{{ slideID }}# </span>
          </div>
          <div class="stake-modal_header_slide-tex">
            <span>{{ message }}</span>
          </div>
        </div>
        <div ref="modalContainer" class="stake-modal_container" @wheel="handleScroll">
          <div class="stake-modal-arr">
            <div class="left" :data-tooltip="$t('stakeGuide.scrollMessage')" @click="prevSlide"></div>
          </div>
          <div class="stake-modal_slider-tutorial">
            <img :src="slide" alt="slide" />
          </div>
          <div class="stake-modal-arr">
            <div class="right" :data-tooltip="$t('stakeGuide.scrollMessage')" @click="nextSlide"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="goForStake" class="bg-dark">
      <div v-if="stakeBtn" class="wrapper">
        <div class="header-node-staking" @click.prevent="stakeGuideStep2">
          <div class="title">{{ $t("stakeGuide.stake") }}</div>
        </div>
        <img src="/img/icon/arrows/curved-arrow.png" class="header-arrow-staking" />
        <div class="staking-step-one">
          <span>{{ $t("stakeGuide.scrollClick") }}</span>
        </div>
      </div>
      <div v-if="insertVal" class="wrapper">
        <div v-if="!isDragOver && dragStep === false" class="message-stake-wrapper">
          <img src="/img/icon/arrows/drag.png" class="drag-icon" alt="" />
          <div class="drag-message">
            <span>{{ $t("stakeGuide.drag") }}</span>
          </div>
        </div>
        <div v-if="clickService" class="message-stake-wrapper">
          <img src="/img/icon/arrows/curved-arrow.png" alt="" class="arrow-staking-pass" />
          <div class="staking-step-two">
            <span>{{ $t("stakeGuide.clickIcon") }}</span>
          </div>
        </div>
        <div v-if="stakeCongrats" class="message-stake-wrapper-last">
          <div class="staking-step-two">
            <span>{{ $t("stakeGuide.cong") }}</span>
          </div>
        </div>
        <div v-if="passPointer" class="message-stake-wrapper">
          <img src="/img/icon/arrows/curved-arrow.png" alt="" class="arrow-staking-pass" />
          <div class="staking-step-two">
            <span>{{ $t("stakeGuide.clickPass") }}</span>
          </div>
        </div>
        <div v-if="modalGuide" class="modal-guide-wrapper">
          <img src="/img/icon/arrows/Pointer1.png" alt="" class="point-to-modal" />
        </div>
        <div v-if="modalGuide" class="staking-step-three">
          <span>{{ $t("stakeGuide.noSlash") }}</span>
        </div>

        <div class="DisplayValidators-bg"></div>
        <DisplayValidators class="display-val" />
      </div>
    </div>
    <div class="close" @click="close">x</div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeHeader } from "../../../store/nodeHeader";
import { useStakingStore } from "@/store/theStaking";
import { useServices } from "@/store/services";
import DisplayValidators from "../the-staking/DisplayValidators.vue";

export default {
  components: { DisplayValidators },
  data() {
    return {
      slideID: "",
      slide: "",
      message: "",
      nextStep: 0,
      sliderTutorial: [
        {
          id: 1,
          img: "/img/stake_Guide/1.jpg",
          text: this.$t("sliderTutorial.becomeValidator") + " “https://goerli.launchpad.ethereum.org/en/”",
        },
        {
          id: 2,
          img: "/img/stake_Guide/2.jpg",
          text: this.$t("sliderTutorial.becomeValidator"),
        },
        {
          id: 3,
          img: "/img/stake_Guide/3.jpg",
          text: this.$t("sliderTutorial.proofStake"),
        },
        {
          id: 4,
          img: "/img/stake_Guide/4.jpg",
          text: this.$t("sliderTutorial.deposit"),
        },
        {
          id: 5,
          img: "/img/stake_Guide/5.jpg",
          text: this.$t("sliderTutorial.usingTerminal"),
        },
        {
          id: 6,
          img: "/img/stake_Guide/6.jpg",
          text: this.$t("sliderTutorial.validatorUptime"),
        },
        {
          id: 7,
          img: "/img/stake_Guide/7.jpg",
          text: this.$t("sliderTutorial.validatorBahavior"),
        },
        {
          id: 8,
          img: "/img/stake_Guide/8.jpg",
          text: this.$t("sliderTutorial.keyManagement"),
        },
        {
          id: 9,
          img: "/img/stake_Guide/9.jpg",
          text: this.$t("sliderTutorial.validatingLongterm"),
        },
        {
          id: 10,
          img: "/img/stake_Guide/10.jpg",
          text: this.$t("sliderTutorial.earlyAdaptor"),
        },
        {
          id: 11,
          img: "/img/stake_Guide/11.jpg",
          text: this.$t("sliderTutorial.stakingChecklist"),
        },
        {
          id: 12,
          img: "/img/stake_Guide/12.jpg",
          text: this.$t("sliderTutorial.clickCont"),
        },
        {
          id: 13,
          img: "/img/stake_Guide/13.jpg",
          text: this.$t("sliderTutorial.executionClient"),
        },
        {
          id: 14,
          img: "/img/stake_Guide/14.jpg",
          text: this.$t("sliderTutorial.scrollDown"),
        },
        {
          id: 15,
          img: "/img/stake_Guide/15.jpg",
          text: this.$t("sliderTutorial.consensusClient"),
        },
        {
          id: 16,
          img: "/img/stake_Guide/16.jpg",
          text: this.$t("sliderTutorial.scrollDown"),
        },
        {
          id: 17,
          img: "/img/stake_Guide/17.jpg",
          text: this.$t("sliderTutorial.numValidator"),
        },
        {
          id: 18,
          img: "/img/stake_Guide/18.jpg",
          text: this.$t("sliderTutorial.generateKey"),
        },
        {
          id: 19,
          img: "/img/stake_Guide/19.jpg",
          text: this.$t("sliderTutorial.keyGUI"),
        },
        {
          id: 20,
          img: "/img/stake_Guide/20.jpg",
          text: this.$t("sliderTutorial.dlGithub"),
        },
        {
          id: 21,
          img: "/img/stake_Guide/21.jpg",
          text: this.$t("sliderTutorial.clickInstaller"),
        },
        {
          id: 22,
          img: "/img/stake_Guide/22.jpg",
          text: this.$t("sliderTutorial.setupPage"),
        },
        {
          id: 23,
          img: "/img/stake_Guide/23.jpg",
          text: this.$t("sliderTutorial.clickCont"),
        },
        {
          id: 24,
          img: "/img/stake_Guide/24.jpg",
          text: this.$t("sliderTutorial.wagueKey"),
        },
        {
          id: 25,
          img: "/img/stake_Guide/25.jpg",
          text: this.$t("sliderTutorial.secratePhrase"),
        },
        {
          id: 26,
          img: "/img/stake_Guide/26.jpg",
          text: this.$t("sliderTutorial.selectNetwork"),
        },
        {
          id: 27,
          img: "/img/stake_Guide/27.jpg",
          text: this.$t("sliderTutorial.clickOk"),
        },
        {
          id: 28,
          img: "/img/stake_Guide/28.jpg",
          text: this.$t("sliderTutorial.clickCreate"),
        },
        {
          id: 29,
          img: "/img/stake_Guide/29.jpg",
          text: this.$t("sliderTutorial.recoveryPhrase"),
        },
        {
          id: 30,
          img: "/img/stake_Guide/30.jpg",
          text: this.$t("sliderTutorial.recoveryPhrase"),
        },
        {
          id: 31,
          img: "/img/stake_Guide/31.jpg",
          text: this.$t("sliderTutorial.clickNext"),
        },
        {
          id: 32,
          img: "/img/stake_Guide/32.jpg",
          text: this.$t("sliderTutorial.imSure"),
        },
        {
          id: 33,
          img: "/img/stake_Guide/33.jpg",
          text: this.$t("sliderTutorial.pasteRecovery"),
        },
        {
          id: 34,
          img: "/img/stake_Guide/34.jpg",
          text: this.$t("sliderTutorial.clickCheck"),
        },
        {
          id: 35,
          img: "/img/stake_Guide/35.jpg",
          text: this.$t("sliderTutorial.needKey"),
        },
        {
          id: 36,
          img: "/img/stake_Guide/36.jpg",
          text: this.$t("sliderTutorial.typPass"),
        },
        {
          id: 37,
          img: "/img/stake_Guide/37.jpg",
          text: this.$t("sliderTutorial.retypPass"),
        },
        {
          id: 38,
          img: "/img/stake_Guide/38.jpg",
          text: this.$t("sliderTutorial.clickNext"),
        },
        {
          id: 39,
          img: "/img/stake_Guide/39.jpg",
          text: this.$t("sliderTutorial.clickBrowse"),
        },
        {
          id: 40,
          img: "/img/stake_Guide/40.jpg",
          text: this.$t("sliderTutorial.chooseFolder"),
        },
        {
          id: 41,
          img: "/img/stake_Guide/41.jpg",
          text: this.$t("sliderTutorial.clickCreateWait"),
        },
        {
          id: 42,
          img: "/img/stake_Guide/42.jpg",
          text: this.$t("sliderTutorial.clickClose"),
        },
        {
          id: 43,
          img: "/img/stake_Guide/43.jpg",
          text: this.$t("sliderTutorial.switchSetup"),
        },
        {
          id: 44,
          img: "/img/stake_Guide/44.jpg",
          text: this.$t("sliderTutorial.dragFile"),
        },
        {
          id: 45,
          img: "/img/stake_Guide/45.jpg",
          text: this.$t("sliderTutorial.clickCont"),
        },
        {
          id: 46,
          img: "/img/stake_Guide/46.jpg",
          text: this.$t("sliderTutorial.connWalet"),
        },
        {
          id: 47,
          img: "/img/stake_Guide/47.jpg",
          text: this.$t("sliderTutorial.connWalet"),
        },
        {
          id: 48,
          img: "/img/stake_Guide/48.jpg",
          text: this.$t("sliderTutorial.clickCont"),
        },
        {
          id: 49,
          img: "/img/stake_Guide/49.jpg",
          text: this.$t("sliderTutorial.understandRisk"),
        },
        {
          id: 50,
          img: "/img/stake_Guide/50.jpg",
          text: this.$t("sliderTutorial.readSection"),
        },
        {
          id: 51,
          img: "/img/stake_Guide/51.jpg",
          text: this.$t("sliderTutorial.protectYourself"),
        },
        {
          id: 52,
          img: "/img/stake_Guide/52.jpg",
          text: this.$t("sliderTutorial.dblCheck"),
        },
        {
          id: 53,
          img: "/img/stake_Guide/53.jpg",
          text: this.$t("sliderTutorial.sendDeposit"),
        },
        {
          id: 54,
          img: "/img/stake_Guide/54.jpg",
          text: this.$t("sliderTutorial.walletPopup"),
        },
        {
          id: 55,
          img: "/img/stake_Guide/55.jpg",
          text: this.$t("sliderTutorial.contCong"),
        },
        {
          id: 56,
          img: "/img/stake_Guide/56.jpg",
          text: this.$t("sliderTutorial.contCong"),
        },
      ],
    };
  },
  computed: {
    ...mapWritableState(useNodeHeader, {
      stakeFirstStep: "stakeFirstStep",
      stakeGuide: "stakeGuide",
      stakeSecondStep: "stakeSecondStep",
      stakeThirdStep: "stakeThirdStep",
      goForStake: "goForStake",
      stakeBtn: "stakeBtn",
      insertVal: "insertVal",
      stakeCongrats: "stakeCongrats",
    }),

    ...mapWritableState(useStakingStore, {
      isDragOver: "isDragOver",
      clickService: "clickService",
      keyFiles: "keyFiles",
      dragStep: "dragStep",
      modalGuide: "modalGuide",
      passPointer: "passPointer",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      importValidatorKeyActive: "importValidatorKeyActive",
    }),
  },
  watch: {
    stakeSecondStep(newVal) {
      if (newVal === true) {
        setTimeout(() => {
          this.stakeSecondStep = false;
          this.stakeThirdStep = true;
        }, 3000);
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
    close() {
      this.stakeCongrats = false;
      this.stakeFirstStep = true;
      this.stakeGuide = false;
      this.stakeSecondStep = false;
      this.stakeThirdStep = false;
      this.stakeBtn = false;
      this.insertVal = false;
      this.slideID = "";
      this.slide = "";
      this.message = "";
      this.nextStep = 0;
      this.stakeGuide = false;
      this.clickService = false;
      this.modalGuide = false;
      this.goForStake = false;
      this.dragStep = false;
    },
    handleScroll(event) {
      if (!this.isScrolling) {
        this.isScrolling = true;

        const delta = event.deltaY;
        if (delta < 0) {
          this.prevSlide();
        } else if (delta > 0) {
          this.nextSlide();
        }

        setTimeout(() => {
          this.isScrolling = false;
        }, 200);
      }
    },
    nextSlide() {
      this.nextStep++;
      if (this.nextStep > 56) {
        this.stakeThirdStep = false;
        this.goForStake = true;
        this.stakeBtn = true;
      }
    },
    prevSlide() {
      this.nextStep--;
      if (this.nextStep < 1) {
        this.nextStep = 1;
      }
    },

    stakeGuideStep1() {
      this.stakeFirstStep = false;

      setTimeout(() => {
        this.$router.push("/control");
      }, 10);
      this.stakeSecondStep = true;
    },
    stakeGuideStep2() {
      this.stakeFirstStep = false;

      setTimeout(() => {
        this.stakeBtn = false;
        this.insertVal = true;
        this.$router.push("/staking");
      }, 10);
    },
  },
};
</script>
<style scoped>
.drag-message {
  color: #c1c1c1;
  font-size: 150%;
  margin-left: 5%;
  font-weight: 600;
  width: 100%;
  height: 10%;
  top: 40%;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 1;
}
[data-tooltip] {
  position: relative;
  cursor: default;
}
[data-tooltip]::after {
  position: absolute;
  width: max-content;
  text-align: center;
  content: attr(data-tooltip);
  background: black;
  border-radius: 5px;
  font-size: 50%;
  border: 1px solid #929292;
  text-transform: uppercase;
  visibility: hidden;
  opacity: 0;
  padding: 5px 10px;
  transition: opacity 0.3s transform 0.2s;
  font-weight: 500;
}
[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
  transform: translateY(-430%) translateX(-45%);
}

.close {
  position: absolute;
  top: 2%;
  right: 2%;
  cursor: pointer;
  font-size: 200%;
  font-weight: bold;
  color: #eee;
  z-index: 330;
  height: 7%;
  width: 4%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.close:hover {
  border: 2px solid #eee;
}
.close:active {
  border: none;
  background: rgba(238, 238, 238, 0.3);
}
.display-val {
  width: 74.5%;
  height: 85%;
  position: absolute;
  left: 0.5%;
  top: 10%;
  z-index: 1;
}
.DisplayValidators-bg {
  width: 73%;
  height: 79%;
  position: absolute;
  left: 1.5%;
  top: 12%;
  background: #121111;
  z-index: 0;
  border-radius: 20px;
}
.row-box-wrapper {
  width: 72%;
  height: 65%;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 1.5%;
  top: 21%;
}
.key-tableRow {
  width: 99%;
  height: 8%;
  margin: 0.7% auto 0 auto;
  display: grid;
  grid-template-columns: 4% 64% 28% 4%;
  grid-template-rows: 100%;
  background-color: rgb(89, 89, 89);
  border-radius: 30px;
  padding: 0.1%;
}
.key-tableRow .file-name {
  grid-column: 2/3;
  width: 100%;
  height: 95%;
  color: #fff !important;
  font-size: 100% !important;
  font-weight: 400 !important;
  justify-self: center;
  align-self: center;
}

.key-tableRow .chosenService {
  grid-column: 3/4;
  width: 50%;
  height: 100%;
  display: flex;
  justify-self: flex-start;
  align-self: center;
  justify-self: flex-start;
  align-self: center;
}
.key-tableRow .chosenService img {
  width: 23%;
  height: 80%;
  margin-left: 22px;
  align-self: center;
}
.key-tableRow .key-remove-icon {
  grid-column: 4/5;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  border: 1px solid #4a4a4a !important;
  border-radius: 50px !important;
  width: 80% !important;
  height: 80% !important;
  padding: 1% !important;
  background-color: #343434;
  justify-self: center;
  align-self: center;
}

.key-tableRow .key-remove-icon img {
  width: 60% !important;
  height: 60% !important;
}

.key-tableRow .key-circle {
  grid-column: 1/2;
  width: 65% !important;
  height: 64% !important;
  border-radius: 50% !important;
  background-color: #fff !important;
  justify-self: center;
  align-self: center;
}

.drag-icon {
  filter: invert(1);
  transform: rotate(180deg);
  width: 5%;
  position: absolute;
  animation: dragIcon 3s infinite;
  top: 57%;
  z-index: 3;
}
@keyframes dragIcon {
  from {
    left: 80%;
  }
  to {
    left: 50%;
  }
}
.dropActive {
  background: rgba(0, 0, 0, 0.1) !important;
}
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
  background-color: rgba(0, 0, 0, 0.6);
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
.header-node-staking {
  width: 11%;
  height: 7%;
  cursor: pointer;
  position: absolute;
  left: 27%;
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
.header-arrow-staking {
  filter: invert(1);
  transform: rotate(180deg);
  width: 20%;
  position: absolute;
  left: 35%;
  top: 7%;
}
.arrow-staking-pass {
  filter: invert(1);
  transform: rotate(17deg);
  width: 15%;
  position: absolute;
  left: 10%;
  top: 58%;
  z-index: 3;
}
.message-stake-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}
.message-stake-wrapper-last {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 300;
  background: #1a1c1c;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-guide-wrapper {
  width: 35%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  position: absolute;
  left: 0;
  top: 50%;
}
.point-to-modal {
  transform: rotate(180deg);
  width: 20%;
  position: absolute;
  animation: modalPointer 1s infinite;
}

@keyframes modalPointer {
  from {
    left: 70%;
  }
  to {
    left: 80%;
  }
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
.staking-step-one {
  color: #eee;
  display: flex;
  width: 80%;
  height: 20%;
  font-size: 250%;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: absolute;
  top: 40%;
  left: 10%;
}
.staking-step-two {
  color: #eee;
  display: flex;
  width: 100%;
  height: 10%;
  font-size: 180%;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: absolute;
  top: 40%;
  left: -10%;
  z-index: 3;
}
.staking-step-three {
  color: #eee;
  display: flex;
  width: 80%;
  height: 10%;
  font-size: 180%;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  position: absolute;
  top: 7%;
  left: 10%;
  z-index: 3;
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
  animation: slideLeft 0.3s ease-in;
  left: 0;
}
@keyframes slideLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.top-slide {
  width: 24.5%;
  height: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0;
  left: 49%;
  animation: slideTop 0.3s ease-in;
}
@keyframes slideTop {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.bottom-slide {
  width: 24.5%;
  height: 42%;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 65%;
  left: 49%;
  animation: slideBottom 0.3s ease-in;
}
@keyframes slideBottom {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.right-slide {
  width: 27%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0%;
  left: 73.5%;
  animation: slideRight 0.3s ease-in;
}
@keyframes slideRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
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
.stake-modal_header_slideNo {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 180%;
  font-weight: 700;
  color: #eee;
}
.stake-modal_header_slide-tex {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 120%;
  font-weight: 700;
  color: #eee;
  padding: 0 3%;
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
.stake-modal_slider-tutorial img {
  width: 100%;
  height: 100%;
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
