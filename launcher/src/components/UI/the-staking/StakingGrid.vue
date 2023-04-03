<template>
  <div class="staking-parent">
    <div class="staking-green-bg">
      <div class="staking-black-bg">
        <display-validators :button="button"></display-validators>
        <ValidatorState />
        <selection-options
          :button-state="buttonState"
          :validator-icon="selectedIcon"
          :validator-name="selectedName"
          :validator-state="selectedStatus"
          :validators="installedValidators"
          @click-btn="clickBtnHandler"
          @vld-picker="selectedValidator"
        ></selection-options>
        <validators-box></validators-box>
        <div class="footer"></div>
        <TaskManager />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useServices } from "../../../store/services";
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
        // {
        //   id: 4,
        //   name: "withdraw",
        //   displayName: "withdrawal",
        //   icon: "img/icon/the-staking/withdraw.png",
        //   method: this.exitBtn,
        //   display: false,
        // },
      ],
      button: {},
      selectedIcon: "",
      selectedName: "",
      selectedStatus: "",
    };
  },

  computed: {
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    installedValidators() {
      const copyOfInstalledServices = [...this.installedServices];
      return copyOfInstalledServices.filter((obj) => obj.category === "validator");
    },
  },
  created() {
    if(this.installedValidators.length === 0) return;
    this.selectedIcon = this.installedValidators[0].icon;
    this.selectedName = this.installedValidators[0].name;
    this.selectedStatus = this.installedValidators[0].state;
  },
  methods: {
    clickBtnHandler(el) {
      this.button = {};
      setTimeout(() => {
        this.button = el;
      });
    },
    selectedValidator(validator) {
      this.selectedIcon = validator.icon;
      this.selectedName = validator.name;
      this.selectedStatus = validator.state;
    },
  },
};
</script>
<style scoped>
.staking-parent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  position: relative;
  bottom: 0;
}
.staking-green-bg {
  width: 100%;
  height: 100%;
  background-color: #264744;
  border-radius: 0 0 10px 10px;
  padding-top: 50px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
}
.staking-black-bg {
  width: 100%;
  height: 99%;
  background-color: #242529;
  border: 5px solid #979797;
  border-radius: 0 15px 10px 10px;
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
