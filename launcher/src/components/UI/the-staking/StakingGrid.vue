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
  justify-content: center;
  align-items: flex-end;
  margin-top: 27px;
}
.staking-green-bg {
  width: 100%;
  height: 97%;
  border-radius: 0 0 35px 35px;
  background-color: #324b3e;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.staking-black-bg {
  width: 99%;
  height: 97.5%;
  background-color: #000000;
  border: 4px solid rgb(121, 121, 121);
  border-radius: 0 30px 30px 30px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 30% 30% 35% 5%;
}
.footer {
  position: relative;
  bottom: 0;
  width: 100%;
  grid-column: 1/13;
  grid-row: 4;
  background-color: rgb(52, 52, 52);
  border-bottom-left-radius: 3rem 3rem;
  border-bottom-right-radius: 3rem 3rem;
}
</style>
