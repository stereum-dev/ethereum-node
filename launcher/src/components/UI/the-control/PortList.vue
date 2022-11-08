<template>
  <div class="portlist_parent">
    <!-- <comming-soon></comming-soon> -->
    <div class="portlist_box">
      <div class="portlist_icon">
        <div class="portlist_icon_contaniner">
          <img
            src="../../../../public/img/icon/control/PORT_LIST_ICON.png"
            alt="portlist"
          />
        </div>
        <span>OPEN PORTS</span>
      </div>
      <div class="portlist-data_box">
        <div class="portlist-data_row" v-for="item in portsInfo" :key="item.id">
          <div class="rowName">
            <span>{{ item.name }}</span>
          </div>
          <div class="rowStatus">
            <span>{{ item.status }}</span>
          </div>
          <div class="portNo">
            <span>{{ item.portNo }}</span>
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
      portsInfo: [
        {
          id: 1,
          name: "name1",
          status: "PORT",
          portNo: 1111,
        },
        {
          id: 2,
          name: "name2",
          status: "PORT",
          portNo: 22,
        },
        {
          id: 3,
          name: "name3",
          status: "PORT",
          portNo: 333,
        },
        {
          id: 4,
          name: "name4",
          status: "PORT",
          portNo: 4,
        },
        {
          id: 5,
          name: "name5",
          status: "PORT",
          portNo: 1515,
        },
        {
          id: 6,
          name: "name6",
          status: "PORT",
          portNo: 123,
        },
      ],
    };
  },
};
</script>
<style scoped>
.portlist_parent {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  position: relative;
}
.portlist_box {
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
}
.portlist_icon {
  box-sizing: border-box;
  width: 35%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.portlist_icon span {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50%;
  font-weight: bold;
  color: #c1c1c1;
}
.portlist_icon_contaniner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}
.portlist_icon_contaniner img {
  width: 72%;
  height: 90%;
}
.portlist-data_box {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 70%;
  height: 100%;
  flex-direction: column;
  overflow-y: auto;
}
.portlist-data_row {
  width: 90%;
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #c1c1c1;
  border-radius: 10px;
  margin: 2px 0;
}
.rowName {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
  height: 100%;
  font-size: 50%;
  color: #c1c1c1;
}
.rowStatus {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: 100%;
  font-size: 50%;
  color: #c1c1c1;
}
.portNo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: 100%;
  font-size: 50%;
  color: #c1c1c1;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  border: 1px solid #343434;
  background: rgb(42, 42, 42);
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px rgb(23, 23, 23);
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #324b3f;
  border-radius: 10px;
}
</style>
