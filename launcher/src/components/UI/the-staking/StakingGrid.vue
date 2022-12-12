<template>
  <div class="staking-parent">
    <div class="staking-green-bg">
      <div class="staking-black-bg">
        <display-validators :button="button"></display-validators>
        <ValidatorState />
        <selection-options
          :buttonState="buttonState"
          @click-btn="clickBtnHandler"
        ></selection-options>
        <validators-box></validators-box>
        <div class="footer"></div>
        <TaskManager />
      </div>
    </div>
  </div>
</template>
<script>
import DisplayValidators from "./DisplayValidators.vue";
import SelectionOptions from "./SelectionOptions.vue";
import ValidatorsBox from "./ValidatorsBox.vue";
import ValidatorState from "./ValidatorState.vue";
import TaskManager from "../task-manager/TaskManager.vue";
export default {
  components: {
    DisplayValidators,
    SelectionOptions,
    ValidatorsBox,
    ValidatorState,
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
          display: true,
        },
        {
          id: 2,
          name: "remove",
          displayName: "Remove all keys",
          icon: "/img/icon/the-staking/option-remove.png",
          method: this.removeBtn,
          display: true,
        },
        // {
        //   id: 3,
        //   name: "fee",
        //   displayName: "change fee recipient",
        //   icon: "img/icon/the-staking/fee-icon2.png",
        //   method: this.feeBtn,
        //   display: false,
        // },
        {
          id: 4,
          name: "withdraw",
          displayName: "withdrawal",
          icon: "img/icon/the-staking/redexit-icon.png",
          method: this.exitBtn,
          display: false,
        },
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
  background-color: #324b3e;
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
}
.staking-black-bg {
  width: 99.95%;
  height: 95.8%;
  background-color: #242529;
  border: 5px solid #979797;
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
