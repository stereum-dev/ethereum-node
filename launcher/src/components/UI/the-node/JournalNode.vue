<template>
  <div class="journal-parent">
    <div class="edit-btn">
      <router-link to="/manage">
        <span>to edit node</span>
        <img
          src="../../../../public/img/icon/node-journal-icons/maintenance3.png"
          alt="icon"
        />
      </router-link>
    </div>
    <div class="updates">
      <div class="update-title">
        <span>Available Updates</span>
      </div>
      <div class="update-table">
        <div
          class="update-table-content"
          v-for="item in newUpdates"
          :key="item.id"
        >
          <div class="update-table-row">
            <span>{{ item.name }}</span>
            <span>{{ item.version }}</span>
            <span>to</span>
            <span>{{ item.version }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="status-box">
      <div class="warning-box">
        <div class="yellow-warning">
          <img
            src="../../../../public/img/icon/node-journal-icons/yellow-warning.png"
            alt=""
          />
          <span>002</span>
        </div>
        <div class="red-warning">
          <img
            src="../../../../public/img/icon/node-journal-icons/red-warning.png"
            alt=""
          />
          <span>002</span>
        </div>
      </div>
      <div class="status-table">
        <div class="status-table-content">
          <div
            class="status-table-row"
            v-for="item in statusContents"
            :key="item.id"
          >
            <div v-if="item.status == 'yellow'" class="status-yellow"></div>
            <div else class="status-red"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useNodeStore } from "@/store/theNode";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(useNodeStore, {
      newUpdates: "newUpdates",
      statusContents: "statusContents",
    }),
  },
};
</script>
<style scoped>
.journal-parent {
  width: 100%;
  height: 100%;
  background-color: #3b3b3b;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 4% 10% 40% 44%;
}

.edit-btn {
  grid-column: 1/6;
  grid-row: 2/3;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 5px;
}
.edit-btn a:hover {
  background-color: #2c2c2c;
  transform: scale(1.02);
}
.edit-btn a:active {
  box-shadow: none;
  transform: scale(1);
}
.edit-btn a {
  width: 90%;
  height: 32px;
  background-color: #292929;
  font-size: 0.6rem;
  font-weight: 800;
  color: rgb(194, 194, 194);
  border: 1px solid #787878;
  margin-top: 5px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 3px 1px #2c2c2c;
}
.edit-btn span {
  color: rgb(249, 187, 73);
  font-size: 0.7rem;
  font-weight: 800;
  text-align: center;
  margin-left: 10px;
  text-transform: uppercase;
}
.edit-btn img {
  width: 18px;
  height: 18px;
  background-color: transparent;
  margin-right: 10px;
}

.updates {
  grid-column: 1/6;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  margin-top: 10px;
}
.update-title {
  width: 90%;
  height: 15px;
  margin: 5px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.update-title span {
  border-bottom: 1px solid #333e33;
  margin-top: 1px;
  font-size: 0.8rem;
  font-weight: 700;
}
.update-table {
  width: 100%;
  height: 70%;
  border: 2px solid #505250;
  margin: 5px auto 0 auto;
  overflow-y: auto;
}
.update-table::-webkit-scrollbar {
  width: 1px;
}
.update-table-content {
  width: 100%;
}
.update-table-row {
  width: 100%;
  display: flex;
  background-color: #303030;
  justify-content: space-between;
  border: 2px solid #30483c;
  padding: 2px;
  margin: 1px auto;
}
.update-table-row:hover {
  border: 2px solid #1a7584;
}
.update-table-row span {
  font-size: 10px;
  font-weight: 800;
}

.status-box {
  grid-column: 1/6;
  grid-row: 4/5;
  width: 100%;
  height: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
}
.status-box .warning-box {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 10px;
}
.warning-box .yellow-warning {
  width: 70px;
  height: 30px;
  background-color: #fed506;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: black;
  border-radius:8px;
  font-size: 14px;
  font-weight: 800;
}
.warning-box .red-warning {
  width: 70px;
  height: 30px;
  background-color: #f44444;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: black;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 800;
}
.status-box .red-warning img,
.status-box .yellow-warning img {
  width: 25px;
}
.status-box .status-table {
  width: 95%;
  height: 75%;
  background-color: #2d2d34;
  margin: 5px auto;
  overflow: hidden;
  padding: 5px;
}
.status-table .status-table-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.status-table-content::-webkit-scrollbar {
  width: 1px;
}
.status-box .status-table-row {
  width: 100%;
  height: 20px;
}
.status-box .status-table-row .status-red {
  width: 100%;
  height: 100%;
  background-color: #f44444;
  margin-top: 3px;
}
.status-box .status-table-row .status-yellow {
  width: 100%;
  height: 100%;
  background-color: #f6ce07;
  margin-top: 3px;
}
</style>
