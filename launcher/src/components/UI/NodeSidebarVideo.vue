<template>
  <div class="tutorial-box" :class="mode">
    <div class="tutorial-table">
      <div class="table-row" v-for="(item, index) in configData" :key="index">
        <div class="camera-icon">
          <img src="/Img/icon/cam-icon.png" alt="camera-icon" />
        </div>
        <div class="row-content">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div class="round-icon">
      <img src="/Img/icon/round-icon.png" alt="round-icon" />
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
      return this.$store.state.configData;
    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.tutorial-box {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-content: flex-end;
  overflow: hidden;
  border-radius: 30px;
  padding: 10px 10px 0 10px;
  background-color: #336666;
}
.tutorial-table {
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 100%;
  border: 3px solid#3E5757;
  border-radius: 25px;
  padding: 20px 10px;
  background: #193232;
  overflow-x: hidden;
  overflow-y: auto;
}

.table-row {
  display: flex;
  height: 25px;
  margin-top: 2px;
  background-color: #3e5757;
  border: 3px solid#3E5757;
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
  background-color: #33393e;
  height: 20px;
  width: 100%;
}

.row-content p {
  text-align: center;
  width: 100%;
  color: #fff;
  font-size: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  overflow-x: hidden;
}
.round-icon {
  text-align: center;
  margin: 5px auto;
}

/* width */
::-webkit-scrollbar {
  width: 15px !important;
  margin-left: 5px !important;
  background-color: transparent;
}

/* Track */
::-webkit-scrollbar-track {
  border: 3px solid #676767;
  border-radius: 100px;
  margin: 30px;
  background: #000;
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
