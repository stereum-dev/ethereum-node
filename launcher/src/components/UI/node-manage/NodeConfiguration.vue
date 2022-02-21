<template>
  <div class="config-node">
    <div class="config-title">
      <span>NODE CONFIGURATION</span>
    </div>
    <div class="config-squares">
      <div class="sq-1"></div>
      <div class="sq-2"></div>
    </div>
    <div class="config-btns">
      <div class="config-add">
        <span>ADD 1 CLICK PRESET</span>
      </div>
      <div class="config-remove">
        <span>REMOVE NODE CONFIG</span>
      </div>
    </div>
    <div class="config-table">
      <div class="table-title">
        <span>CONFIGURATION SETS</span>
      </div>
      <div class="config-table-box">
        <div
          class="config-row"
          v-for="(item, index) in configData"
          :key="index"
        >
          <div class="row-content">
            <span>{{ item.id }}#{{ item.name }}</span>
          </div>
          <div v-if="item.status === 'online'" class="testnet-icon">
            <img
              src="../../../../public/Img/icon/manage-node-icons/green-status.png"
              alt="status-icon"
            />
          </div>
          <div v-else-if="item.status === 'serverOff'" class="testnet-icon">
            <img
              src="/Img/icon/manage-node-icons/yellow-status.png"
              alt="status-icon"
            />
          </div>
          <div v-else-if="item.status === 'offline'" class="testnet-icon">
            <img
              src="/Img/icon/manage-node-icons/red-status.png"
              alt="status-icon"
            />
          </div>
          <div v-else-if="item.status === 'update'" class="testnet-icon">
            <img
              src="/Img/icon/manage-node-icons/purple-status.png"
              alt="status-icon"
            />
          </div>
          <div v-else class="testnet-icon">
            <img
              src="/Img/icon/manage-node-icons/blue-status.png"
              alt="status-icon"
            />
          </div>
        </div>
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
  display: grid;
  grid-column: 1;
  grid-template-rows: repeat(12, 42px);
  width: 90%;
  height: 93%;
  padding: 5px;
  background-color: #33393e;
  border-radius: 0 30px 30px 30px;
}
.config-box .config-title {
  grid-row: 1;
  justify-self: end;
  align-self: flex-end;
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
.config-node .config-squares {
  grid-row: 2/3;
  width: 94%;
  height: 70px;
  border: 5px solid gray;
  margin: 10px auto;
  border-radius: 4px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.config-squares .sq-1,
.config-squares .sq-2 {
  width: 45%;
  height: 90%;
  background-color: #336666;
  border: 1px solid #747474;
  border-radius: 1px;
}

.config-node .config-btns {
  grid-row: 4/6;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}
.config-btns .config-add,
.config-btns .config-remove {
  width: 90%;
  background-color: #323232;
  font-size: 10px;
  font-weight: bold;
  border: 1px solid rgb(169, 168, 168);
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 0 5px 1px rgb(82, 81, 81);
}
.config-node .config-table {
  grid-row: 6/11;
  margin-top: 10px;
}
.config-table .table-title span {
  width: 90%;
  background-color: #323232;
  font-size: 8px;
  font-weight: bold;
  border: 1px solid rgb(169, 168, 168);
  padding: 2px 4px;
  border-radius: 8px;
}
.config-table .config-table-box {
  width: 95%;
  height: 90%;
  margin: 10px auto;
  padding: 2px 0;
  border: 4px solid gray;
  border-radius: 15px;
  overflow-x: hidden;
  overflow-y: auto;
}
.config-row {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid gray;
}
.config-row:nth-child(even) {
  background-color: #26292b;
}
.config-row:last-child {
  border-bottom: none;
  border-radius: 0 0 15px 15px;
}
.config-row .row-content {
  height: 30px;
}
.config-row .row-content span {
  font-size: 10px;
  font-weight: bold;
}
.testnet-icon {
  display: flex;
  width: 20px;
  min-width: 20px;
  justify-content: center;
  align-items: center;
  /* flex: 1; */
}
.testnet-icon img {
  width: 20px;
  height: 20px;
}
</style>
