<template>
  <div class="active-box">
    <div class="badge">
      <div class="active-badge">ACTIVE</div>
      <div class="installed-badge">INSTALLED</div>
    </div>
    <div class="active-table">
      <div
        class="table-row"
        v-for="(item, index) in configData"
        :key="index"
      >
        <div v-if="item.status === 'deactive'" class="status-icon">
          <img src="/Img/icon/non-functional-icon.png" alt="status-icon" />
        </div>
        <div v-else-if="item.status === 'off'" class="status-icon">
          <img src="/Img/icon/inactive-icon.png" alt="status-icon" />
        </div>
        <div v-else-if="item.status === 'active'" class="status-icon">
          <img src="/Img/icon/active-icon.png" alt="status-icon" />
        </div>
        <div v-else class="status-icon">
          <img src="Img/icon/sync-problem-icon.png" alt="status-icon" />
        </div>
        <div class="row-content">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      configData: "nodeSbActive_get",
    }),
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.active-box {
  width: 96%;
  height: 55%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow: hidden;
  border: 1px solid #7f7f7f;
  border-radius: 20px;
  padding: 0 5px 5px 5px;
  background-color: gray;
}
.badge {
  display: flex;
  justify-content: space-evenly;
  color: white;
}
.active-badge {
  border: 3px solid rgb(82, 82, 82);
  border-radius: 100px;
  font-family: sans-serif;
  font-size: 8px;
  font-weight: 600;
  padding: 4px 10px;
  margin-bottom: 5px;
  box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.297);
}
.installed-badge {
  border: 3px solid rgb(82, 82, 82);
  border-radius: 100px;
  font-family: sans-serif;
  font-size: 8px;
  font-weight: 600;
  padding: 4px 3px;
  margin-bottom: 5px;
  box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.297);
}
.active-badge:hover,
.installed-badge:hover {
  background-color: rgb(82, 82, 82);
  box-shadow: none;
}

.active-table {
  width: 100%;
  height: 80%;
  border: 2px solid#747474;
  border-radius: 15px;
  background: #242526;
  color: rgb(15, 15, 15);
  padding: 10px;
  overflow-x: hidden;
  overflow-y: auto;
}
.active-table::-webkit-scrollbar {
  width: 1px;
}

.table-row {
  display: flex;
  height: 18px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  margin-top: 1px;
}

.status-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 25px;
  text-align: left;
}

.status-icon img {
  width: 25px;
  height: 17px;
  text-align: left;
}

.row-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
  margin: 0;
  padding: 0;
}

.row-content p {
  text-align: center;
  font-size: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
}
</style>
