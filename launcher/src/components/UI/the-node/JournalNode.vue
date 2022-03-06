<template>
  <div class="journal-parent">
    <div class="edit-btn">
      <router-link to="/manage">
        <span>EDIT NODES</span>
        <img
          src="../../../../public/Img/icon/node-journal-icons/maintenance3.png"
          alt="icon"
        />
      </router-link>
    </div>
    <div class="manage-configuration">
      <div class="config-table">
        <div class="okay">
          <img
            class="running"
            src="../../../../public/Img/icon/node-journal-icons/running.png"
            alt="icon"
          />
          <span>Okay</span>
        </div>
        <div class="sync">
          <img
            class="refresh"
            src="../../../../public/Img/icon/node-journal-icons/refresh.png"
            alt="icon"
          />
          <span>Full synchronized</span>
        </div>
        <div class="storage">
          <img
            class="disc"
            src="../../../../public/Img/icon/node-journal-icons/Disc_Storage_Icon.png"
            alt="icon"
          />
          <span>212 gb</span>
        </div>
        <div class="speed">
          <img
            class="internet-speed"
            src="../../../../public/Img/icon/node-journal-icons/Internet_Speed_Icon.png"
            alt="icon"
          />
          <span>24.2 mb</span>
        </div>
        <div class="setting">
          <img
            class="setting-wrench"
            src="../../../../public/Img/icon/node-journal-icons/setting-wrench.png"
            alt="icon"
          />
          <span>5</span>
        </div>
      </div>
    </div>
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
            src="../../../../public/Img/icon/node-journal-icons/Key_Icon.png"
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
            src="../../../../public/Img/icon/node-journal-icons/bag_icon.png"
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
            src="../../../../public/Img/icon/node-journal-icons/yellow-warning.png"
            alt=""
          />
          <span>002</span>
        </div>
        <div class="red-warning">
          <img
            src="../../../../public/Img/icon/node-journal-icons/red-warning.png"
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
export default {
  data() {
    return {
      newUpdates: [
        {
          id: 1,
          name: "[NAME]",
          version: "[VERSION]",
        },
        {
          id: 2,
          name: "[NAME]",
          version: "[VERSION]",
        },
        {
          id: 3,
          name: "[NAME]",
          version: "[VERSION]",
        },
        {
          id: 4,
          name: "[NAME]",
          version: "[VERSION]",
        },
        {
          id: 5,
          name: "[NAME]",
          version: "[VERSION]",
        },
      ],
      statusContents: [
        {
          id: 1,
          status: "red",
        },
        {
          id: 2,
          status: "yellow",
        },
        {
          id: 3,
          status: "red",
        },
        {
          id: 4,
          status: "yellow",
        },
        {
          id: 3,
          status: "red",
        },
        {
          id: 4,
          status: "yellow",
        },
      ],
    };
  },
};
</script>
<style scoped>
.journal-parent {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1;
  grid-template-rows: 4% 26% 20% 17% 33%;
}

.manage-configuration {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, 1fr);
}
.edit-btn {
  width: 85%;
  height: 27px;
  border: 1px solid rgb(38, 38, 38);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2C4030;
  margin: 5px auto;
  box-shadow: inset 0 1px 5px 0 rgb(155, 155, 155);
}
.edit-btn:hover {
  box-shadow: none;
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
  font-size: 11px;
  font-weight: 900;
  text-align: center;
  margin-left: 55px;
}
.edit-btn img {
  width: 18px;
  height: 18px;
  background-color: transparent;
  margin-right: 10px;
}
.config-table {
  grid-column: 1;
  grid-row: 2/7;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.config-table img {
  width: 14px;
  height: 14px;
}
.config-table span {
  width: 70%;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 900;
  color: rgb(91, 203, 91);
}
.config-table .okay {
  width: 100%;
  margin-top: 3px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.config-table .sync {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.config-table .storage {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.config-table .storage span {
  color: rgb(237, 223, 69);
}
.config-table .speed {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.config-table .setting {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.config-table .setting span {
  color: rgb(82, 153, 216);
}

.updates {
  grid-column: 1;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
}
.update-title {
  width: 80%;
  height: 15px;
  margin: 0 auto;
  border-bottom: 1px solid #333e33;
  display: flex;
  justify-content: center;
  align-items: center;
}

.update-title span {
  margin-top: 5px;
  font-size: 9px;
  font-weight: 900;
}
.update-table {
  width: 98%;
  height: 70%;
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
  width: 95%;
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
  grid-row: 4/5;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.validator-title {
  width: 80%;
  height: 15px;
  margin: 0 auto;
  border-bottom: 1px solid rgb(51, 62, 51);
  display: flex;
  justify-content: center;
  align-items: center;
}
.validator-title span {
  font-size: 10px;
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
  width: 99%;
  display: flex;
  align-items: center;
  font-weight: 900;
  margin-top: 3px;
}
.validator-box .active-text {
  width: 60%;
  font-size: 14px;
}
.validator-box .rating-box {
  width: 30%;
  position: relative;
}
.validator-box .rating-text {
  font-size: 13px;
}
.validator-box .monthly-badge {
  position: absolute;
  right: 13px;
  top: 16px;
  font-size: 8px;
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
  grid-row: 5/6;
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
  width: 90%;
  height: 60%;
  background-color: #2d2d34;
  margin: 10px auto;
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
