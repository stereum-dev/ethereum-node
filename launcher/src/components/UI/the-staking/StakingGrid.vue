<template>
  <div class="staking-parent">
    <div class="staking-green-bg">
      <div class="staking-black-bg">
        <display-validators :button="button"></display-validators>
        <time-reward></time-reward>
        <selection-options
          :buttonState="buttonState"
          @click-btn="clickBtnHandler"
        ></selection-options>
        <validators-box></validators-box>
        <div class="footer"></div>
        <task-manager></task-manager>
      </div>
    </div>
  </div>
</template>
<script>
import DisplayValidators from "./DisplayValidators.vue";
import SelectionOptions from "./SelectionOptions.vue";
import ValidatorsBox from "./ValidatorsBox.vue";
import TimeReward from "./TimeReward.vue";
import TaskManager from "../task-manager/TaskManager.vue";
export default {
  components: {
    DisplayValidators,
    SelectionOptions,
    ValidatorsBox,
    TimeReward,
    TaskManager,
  },
  data() {
    return {
      buttonState: [
        {
          id: 1,
          name: "grafiti",
          displayName: "Grafiti",
          icon: "/img/icon/the-staking/option-graffiti.png",
          method: this.grafitiBtn,
        },
        {
          id: 2,
          name: "remove",
          displayName: "Remove keys",
          icon: "/img/icon/the-staking/option-remove.png",
          method: this.removeBtn,
        },
        // {
        //   id: 3,
        //   name: "fee",
        //   displayName: "change fee recipient",
        //   icon: "img/icon/the-staking/fee-icon2.png",
        //   method: this.feeBtn,
        // },
        // {
        //   id: 4,
        //   name: "exit",
        //   displayName: "exit chain",
        //   icon: "img/icon/the-staking/redexit-icon.png",
        //   method: this.exitBtn,
        // },
      ],
      button: {},
    };
  },
  methods: {
    clickBtnHandler(el) {
      this.button = {};
      setTimeout(() => {
        this.button = el;
      });
    },
  },
};
</script>
<style scoped>
.staking-parent {
  width: 100%;
  height: 95.2%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  margin-top: 27px;
  position: relative;
}
.staking-green-bg {
  width: 100%;
  height: 100%;
  border-radius: 0 0 10px 10px;
  background-color: #324b3e;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
}
.staking-black-bg {
  width: 99.95%;
  height: 95%;
  background-color: #000000;
  border: 4px solid #979797;
  border-radius: 0 15px 10px 10px;
  position: absolute;
  bottom: 0px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 30% 26% 39% 5%;
}
.footer {
  width: 100%;
  height: 99.9%;
  margin: 0 auto;
  grid-column: 1/13;
  grid-row: 4;
  background-color: rgb(52, 52, 52);
  border-radius: 0 0 7px 7px;
}
</style>
