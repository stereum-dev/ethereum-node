<template>
  <div class="config-box">
    <div class="nodeSetupTitle">
      <span>Node Setup Configuration</span>
    </div>
    <div class="config-table">
      <div class="config-row" v-for="(item, index) in configData" :key="index">
        <div v-if="item.status === 'online'" class="testnet-icon">
          <img src="/img/icon/testnetIcon.png" alt="status-icon" />
        </div>
        <div v-else-if="item.status === 'serverOff'" class="testnet-icon">
          <img src="/img/icon/testnetIcon.png" alt="status-icon" />
        </div>
        <div v-else-if="item.status === 'offline'" class="testnet-icon">
          <img src="/img/icon/testnetIcon.png" alt="status-icon" />
        </div>
        <div v-else class="testnet-icon">
          <img src="/img/icon/testnetIcon.png" alt="netStatus-icon" />
        </div>
        <div class="mainnet-icon">
          <img src="/img/icon/mainnetIcon.png" alt="status-icon" />
        </div>
        <div class="row-content">
          <p>{{ item.id }}#{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      configData: [
        {
          id: 1,
          name: "Node Configuration",
          status: "online",
        },
        {
          id: 2,
          name: "Node Configuration",
          status: "offline",
        },
        {
          id: 3,
          name: "Node Configuration",
          status: "notOk",
        },
        {
          id: 4,
          name: "Node Configuration",
          status: "serverOff",
        },
      ],
    };
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.config-box {
  grid-row: 2/5;
  border: 10px solid #7f7f7f;
  border-radius: 10px;
  padding: 5px;
  overflow-y: auto;
  background-color: transparent;
}
.nodeSetupTitle {
  padding: 2px;
  color: #fff;
  text-align: left;
  margin-left: 40px;
}
.nodeSetupTitle span {
  font-family: sans-serif;
  font-weight: 600;
}
.config-table {
  width: auto;
  border: 2px solid#747474;
  background: #33393e;
  color: #fff;
  font-weight: 600;
  font-family: sans-serif;
  overflow: hidden;
}
.config-table:hover {
  background-color: #2d3134;
}
.config-row {
  display: flex;
  width: 100%;
  border-bottom: 1px solid gray;
}
.config-row:nth-child(even) {
  background-color: #26292b;
}
.config-row:last-child {
  border-bottom: none;
}
.mainnet-icon,
.testnet-icon {
  display: flex;
  min-width: 40px;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.testnet-icon img,
.mainnet-icon img {
  width: 24px;
  height: 24px;
}

.row-content {
  flex: 30;
}

.row-content p {
  margin: 0;
  padding: 5px;
  text-align: left;
}
/* width */
::-webkit-scrollbar {
  width: 20px;
  background-color: transparent;
}
/* width */
::-webkit-scrollbar {
  width: 20px;
  background-color: transparent;
}

/* Track */
::-webkit-scrollbar-track {
  border: 3px solid #676767;
  border-radius: 100px;
  margin: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #676767;
  border: 2px solid rgb(145, 144, 144);
  border-radius: 100px;
  background-clip: content-box;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #2d3134;
}
</style>
