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
  height: 70%;
  width: 90%;
  border: 3px solid#232a2a;
  border-radius: 10px;
  background: #54898a;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 5px 0;
}
.tutorial-table::-webkit-scrollbar {
  width: 1px;
}

.table-row {
  display: flex;
  width: 98%;
  height: 16%;
  margin-top: 2px;
  background-color: #314242;
  border: 3px solid#314242;
  border-radius: 5px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.table-row:hover {
  border: 3px solid#081e34;
}
.table-row:hover .camera-icon {
 border-right: 2px solid #081e34;
}
.camera-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 23%;
  text-align: left;
  border-right: 2px solid #314242;
}

.camera-icon img {
  width: 22px;
  height: 19px;
}

.row-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272a2d;
  height: 100%;
  width: 77%;
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
  height: 20%;
  margin: 5px auto 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  
}
.round-icon img {
  width: 35%;
  height: 35%px;
}
</style>
