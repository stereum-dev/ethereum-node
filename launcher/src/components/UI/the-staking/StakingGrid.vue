<template>
  <div class="staking-parent">
    <div class="staking-green-bg">
      <div class="staking-black-bg">
        <display-validators :button="button"></display-validators>
        <ValidatorStats />
        <selection-options
          :key="refresh"
          :button-state="buttonState"
          :validator-icon="selectedIcon"
          :validator-name="selectedName"
          :validator-state="selectedStatus"
          :validators="installedValidators"
          :disable="display"
          @click-btn-graffiti="grafittiHandler"
          @click-btn-remove="removeHandler"
          @vld-picker="selectedValidator"
        ></selection-options>

        <TaskManager />
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";
import DisplayValidators from "./DisplayValidators.vue";
import SelectionOptions from "./SelectionOptions.vue";
import ValidatorStats from "./ValidatorStats.vue";
import TaskManager from "../task-manager/TaskManager.vue";
export default {
  components: {
    DisplayValidators,
    SelectionOptions,
    ValidatorStats,
    TaskManager,
  },
  data() {
    return {
      refresh: 0,
      button: {},
      selectedName: "",
      selectedStatus: "",
      selectedID: undefined,
    };
  },

  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      buttonState: "buttonState",
    }),
    ...mapWritableState(useStakingStore, {
      selectedIcon: "selectedIcon",
      selectedValdiatorService: "selectedValdiatorService",
      insertKeyBoxActive: "insertKeyBoxActive",
      enterPasswordBox: "enterPasswordBox",
      exitChainForMultiValidatorsActive: "exitChainForMultiValidatorsActive",
      removeForMultiValidatorsActive: "removeForMultiValidatorsActive",
      grafitiForMultiValidatorsActive: "grafitiForMultiValidatorsActive",
      display: "display",
    }),
    installedValidators() {
      const copyOfInstalledServices = [...this.installedServices];
      return copyOfInstalledServices.filter((obj) => obj.category === "validator");
    },
  },
  created() {
    if (this.installedValidators.length === 0) return;
    this.selectedValdiatorService = this.installedValidators[0];
    this.selectedIcon = this.installedValidators[0].icon;
    this.selectedName = this.installedValidators[0].name;
    this.selectedStatus = this.installedValidators[0].state;
  },
  methods: {
    grafittiHandler() {
      this.insertKeyBoxActive = false;
      this.enterPasswordBox = false;
      this.exitChainForMultiValidatorsActive = false;
      this.removeForMultiValidatorsActive = false;
      this.grafitiForMultiValidatorsActive = true;
    },
    removeHandler() {
      this.exitChainForMultiValidatorsActive = false;
      this.grafitiForMultiValidatorsActive = false;
      this.removeForMultiValidatorsActive = true;
    },
    selectedValidator(validator) {
      this.selectedValdiatorService = validator;
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
</style>
