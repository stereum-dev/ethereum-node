<template>
  <div>
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
  position: fixed;
  left: 0;
  top: 7.5%;
  width: 100vw;
  height: 93vh;
}
.staking-green-bg {
  width: 100%;
  height: 100vh;
  background-color: #324b3e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.staking-black-bg {
  position: absolute;
  top: 2px;
  width: 98%;
  height: 97%;
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
