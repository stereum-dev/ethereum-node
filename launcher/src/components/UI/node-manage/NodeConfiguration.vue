<template>
  <div class="config-node">
    <div class="config-title">
      <span>NODE CONFIGURATION</span>
    </div>
    <div class="config-row">
      <div class="row-content" v-for="(item, index) in configData" :key="index">
        <div v-if="item.network == 'testNet'" class="testnet-icon">
          <img src="../../../../public/Img/icon/mainnetIcon.png" alt="icon" />
        </div>
        <div v-else class="testnet-icon">
          <img src="../../../../public/Img/icon/testnetIcon.png" alt="" />
        </div>
        <span>{{ item.id }}#{{ item.name }}</span>
        <div class="color-icon"></div>
      </div>
    </div>
    <div class="config-btns">
      <div class="config-add">
        <span>ADD 1 CLICK PRESET</span>
      </div>
      <div class="config-network">
        <span>CHANGE NETWORK</span>
      </div>
      <div class="config-priority">
        <span>ADD PRIORITY</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["configData"],
};
</script>
<style scoped>
.config-node {
  grid-column: 1;
  grid-template-rows: repeat(12, 42px);
  height: 93%;
  padding: 5px;
  background-color: #33393e;
  border-radius: 0 30px 30px 30px;
  display: grid;
  grid-template-columns: repeat(5, 20%);
  grid-template-rows: repeat(9, 1fr);
}
.config-box .config-title {
  grid-column: 1/6;
  grid-row: 2;
  justify-content: center;
  align-items: center;
}
.config-title span {
  font-size: 8px;
  font-weight: bold;
  background-color: rgb(48, 48, 48);
  border: 1px solid rgb(169, 168, 168);
  padding: 3px 4px;
  border-radius: 8px;
  box-shadow: 1px 1px 5px 2px rgb(69, 68, 68);
}

.config-btns {
  grid-column: 1/6;
  grid-row: 4/5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.config-btns .config-add,
.config-btns .config-network,
.config-btns .config-priority {
  width: 85%;
  height: 30px;
  background-color: #323232;
  font-size: 10px;
  font-weight: bold;
  border: 1px solid rgb(169, 168, 168);
  margin-top: 5px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: inset 0 0 5px 1px rgb(136, 136, 136);
}
.config-btns .config-add:hover,
.config-btns .config-network:hover,
.config-btns .config-priority:hover {
  background-color: #2c2c2c;
  box-shadow: inset 0 0 5px 1px rgb(82, 81, 81);
}
.config-btns .config-add:active,
.config-btns .config-network:active,
.config-btns .config-priority:active {
  background-color: #252525;
  font-size: 9px;
  box-shadow: none;
}

.config-row {
  grid-column: 1/6;
  grid-row: 3/4;
  width: 98%;
  height: 25px;
  border: 1px solid gray;
  border-radius: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem;
}

.config-row .row-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 25px;
}
.config-row .row-content span {
  font-size: 10px;
  font-weight: bold;
}
.testnet-icon {
  width: 25px;
  min-width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.testnet-icon img {
  width: 25px;
  height: 25px;
}
.color-icon {
  width: 22px;
  height: 23px;
  background-color: greenyellow;
  border-radius: 50px;
}
::-webkit-scrollbar {
  width: 1px;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(160, 160, 160);
  border-radius: 50px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
  margin: 10px;
}
</style>
