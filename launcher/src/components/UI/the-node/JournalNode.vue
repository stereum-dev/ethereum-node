<template>
  <div class="journal-parent">
    <div class="edit-btn">
      <router-link to="/manage">
        <span>EDIT</span>
        <img
          src="../../../../public/img/icon/node-journal-icons/maintenance3.png"
          alt="icon"
        />
      </router-link>
    </div>
    <div class="journal-bg">
      <div class="updates">
        <div class="update-title">
          <span>Updates Available</span>
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
      <div class="validator">
        <div class="validator-title">
          <span>Validator</span>
        </div>
        <div class="validator-box">
          <div class="validator-row-1">
            <img
              class="key-icon"
              src="../../../../public/img/icon/node-journal-icons/Key_Icon.png"
              alt="icon"
            />
            <span class="active-text">001 ACTIVE</span>
            <div class="rating-box">
              <span class="rating-text">RATING:</span>
              <span class="monthly-badge">(monthly)</span>
            </div>
          </div>
          <div class="validator-row-2">
            <img
              class="bag-icon"
              src="../../../../public/img/icon/node-journal-icons/bag_icon.png"
              alt="icon"
            />
            <div class="amount-box">
              <div class="amount">
                <span>32.0000001</span>
              </div>
              <div class="unit">
                <span class="price">00000001</span>
                <span class="gwei">GWEI</span>
              </div>
            </div>
            <span class="level-icon">S</span>
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}
.journal-bg {
  width: 90%;
  height: 90%;
  margin: 0 auto;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1;
  grid-template-rows: repeat(4, 1fr);
}

.manage-configuration {
  grid-column: 1;
  grid-row-start: 1/3;
  width: 100%;
  height: 88%;
}
.edit-btn {
  width: 46%;
  height: 5.2%;
  border: 1px solid rgb(59, 81, 69);
  justify-self: end;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c4030;
  box-shadow: 0 1px 2px 1px rgb(43, 46, 46);
  margin: 4px;
  padding: 1px 0;
}
.edit-btn:hover {
  box-shadow: none;
  background-color: #1e2920;
}
.edit-btn:active {
  box-shadow: none;
  border: 1px solid #131413;
}
.edit-btn a {
  width: 100%;
  height: 100%;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1px;
}
.edit-btn span {
  color: rgb(249, 187, 73);
  font-size: 0.75rem;
  font-weight: 800;
  text-align: center;
  margin-left: 10px;
}
.edit-btn img {
  width: 16px;
  height: 16px;
  background-color: transparent;
  margin-right: 10px;
}

.updates {
  grid-column: 1;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
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
  font-size: 0.7rem;
  font-weight: 900;
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
.validator {
  grid-column: 1;
  grid-row: 2/3;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.validator-title {
  width: 80%;
  height: 15px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.validator-title span {
  border-bottom: 1px solid #333e33;
  margin-top: 1px;
  font-size: 0.7rem;
  font-weight: 900;
}
.validator-box {
  width: 100%;
  color: #fff;
  margin: 0 auto;
}
.validator-box img {
  width: 20px;
  height: 20px;
}
.validator-row-1,
.validator-row-2 {
  width: 98%;
  display: flex;
  align-items: center;
  font-weight: 900;
  margin: 3px auto;
}
.validator-box .active-text {
  width: 53%;
  font-size: 0.67rem;
}
.validator-box .rating-box {
  width: 30%;
  position: relative;
}
.validator-box .rating-text {
  font-size: 0.69rem;
}
.validator-box .monthly-badge {
  position: absolute;
  right: 9px;
  top: 16px;
  font-size: 0.45rem;
}
.validator-box .amount-box {
  width: 70%;
}
.validator-box .amount {
  color: rgb(56, 171, 56);
  text-align: left;
  margin-left: 10px;
}
.validator-box .unit {
  text-align: left;
  margin-left: 10px;
}
.validator-box .unit .price {
  font-size: 11px;
}
.validator-box .unit .gwei {
  font-size: 13px;
  margin-left: 5px;
}
.validator-box .level-icon {
  font-size: 23px;
  color: rgb(0, 242, 255);
}

.status-box {
  grid-column: 1;
  grid-row: 3/6;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.status-box .warning-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.warning-box .yellow-warning {
  width: 70px;
  height: 30px;
  background-color: #fed506;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: black;
  border-radius: 10px;
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
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
}
.status-box .red-warning img,
.status-box .yellow-warning img {
  width: 25px;
}
.status-box .status-table {
  width: 95%;
  height: 55%;
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
