<template>
  <div class="portlist_parent">
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
        <div class="portlist-data_row" v-for="item in portstatus.data" :key="item.id">
          <div class="rowName">
            <span>{{ item.name }}</span>
          </div>
          <div class="portNo">
            <span>{{ item.port }}</span>
          </div>
          <div class="protocol">
            <span>{{ item.prot }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useControlStore } from "../../../store/theControl";
export default {
  data() {
    return {
      portsInfo: [
        {
          id: 1,
          name: "name1",
          port: 1111,
          prot: "tcp",
        },
        {
          id: 2,
          name: "name2",
          port: 22,
          prot: "udp",
        },
        {
          id: 3,
          name: "name3",
          port: 333,
          prot: "tcp",
        },
        {
          id: 4,
          name: "name4",
          port: 4,
          prot: "udp",
        },
        {
          id: 5,
          name: "name5",
          port: 1515,
          prot: "tcp",
        },
        {
          id: 6,
          name: "name6",
          port: 123,
          prot: "udp",
        },
      ],
    };
  },
  computed: {
    ...mapState(useControlStore, {
      portstatus: "portstatus",
    }),
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
  width: 45%;
  height: 100%;
  font-size: 50%;
  color: #c1c1c1;
}

.portNo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 100%;
  font-size: 50%;
  color: #c1c1c1;
}
.protocol {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5%;
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
