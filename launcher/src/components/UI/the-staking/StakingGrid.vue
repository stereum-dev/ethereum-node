<template>
  <div class="staking-parent">
    <div class="staking-green-bg">
      <div class="staking-black-bg">
        <key-table></key-table>
        <time-reward></time-reward>
        <selection-options></selection-options>
        <validators-box></validators-box>
        <div class="footer"></div>
      </div>
    </div>
  </div>
</template>
<script>
import KeyTable from "./KeyTable.vue";
import SelectionOptions from "./SelectionOptions.vue";
import ValidatorsBox from "./ValidatorsBox.vue";
import TimeReward from "./TimeReward.vue";

export default {
  components: {
    KeyTable,
    SelectionOptions,
    ValidatorsBox,
    TimeReward,
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
  border-radius: 0 0 35px 35px;
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
  height: 95.5%;
  background-color: #000000;
  border: 4px solid #979797;
  border-radius: 15px 35px 35px 35px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 30% 32% 33% 5%;
}
.footer {
  width: 99.8%;
  height: 99.9%;
  margin: 0 auto;
  grid-column: 1/13;
  grid-row: 4;
  background-color: rgb(52, 52, 52);
  border-bottom-left-radius: 65px 45px;
  border-bottom-right-radius: 65px 45px;
}
</style>
