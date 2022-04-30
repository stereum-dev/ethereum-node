<template>
  <div class="staking-parent">
    <div class="staking-green-bg">
      <div class="staking-black-bg">
        <key-table></key-table>
        <time-reward></time-reward>
        <selection-options></selection-options>
        <validators-box></validators-box>
        <div class="footer"></div>
        <task-manager></task-manager>
      </div>
    </div>
  </div>
</template>
<script>
import KeyTable from "./KeyTable.vue";
import SelectionOptions from "./SelectionOptions.vue";
import ValidatorsBox from "./ValidatorsBox.vue";
import TimeReward from "./TimeReward.vue";
import TaskManager from "../task-manager/TaskManager.vue";

export default {
  components: {
    KeyTable,
    SelectionOptions,
    ValidatorsBox,
    TimeReward,
    TaskManager
  },
};
</script>
<style scoped>
.staking-parent {
  width: 100%;
  height: 95%;
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
  width: 100%;
  height: 95.7%;
  background-color: #000000;
  border: 4px solid #979797;
  border-radius: 15px 15px 10px 10px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 30% 32% 33% 5%;
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
