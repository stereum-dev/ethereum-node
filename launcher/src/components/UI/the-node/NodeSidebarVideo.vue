<template>
  <div class="tutorial-box">
    <div class="tutorial-table">
      <div class="table-row" v-for="(item, index) in configData" :key="index">
        <div class="camera-icon">
          <img src="/img/icon/cam-icon.png" alt="camera-icon" />
        </div>
        <div class="row-content">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="round-icon">
      <img src="/img/icon/round-icon.png" alt="round-icon" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    configData() {
      return this.$store.getters.nodeSbVideo_get;
    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.tutorial-box {
  width: 96%;
  height: 43%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 20px;

  background-color: #336666;
}
.tutorial-table {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 80%;
  width: 90%;
  border: 3px solid#232a2a;
  border-radius: 18px;
  background: #1c2626;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top:15px;
}
.tutorial-table::-webkit-scrollbar {
  width: 1px;
}

.table-row {
  display: flex;
  width: 95%;
  height: 16%;
  margin-top: 2px;
  background-color: #3e5757;
  border: 3px solid#3E5757;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}

.camera-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #3c7474;
  width: 25px;
  min-width: 25px;
  text-align: left;
  border-right: 2px solid #3e5757;
}

.camera-icon img {
  width: 24px;
  height: 20px;
}

.row-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272a2d;
  height: 20px;
  width: 70%;
}

.row-content p {
  text-align: center;
  width: 100%;
  color: rgb(208, 208, 208);
  font-size: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  overflow-x: hidden;
}
.round-icon {
  width: 100%;
  height: 15%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.round-icon img {
  width: 30px;
  height: 30px;
}
</style>
