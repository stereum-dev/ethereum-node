<template>
  <section id="parent">
    <node-header id="head"></node-header>
    <node-bg>
      <div class="manage-parent">
        <div class="menu-side">
          <div class="menu-background"></div>
          <div class="menu-box">
            <div class="menu">
              <router-link to="/node">
                <img
                  class="home-icon"
                  src="/img/icon/manage-node-icons/home-item-icon.png"
                  alt="icon"
                />
              </router-link>
              <router-link to="/manage">
                <img
                  class="manage-icon"
                  src="/img/icon/manage-node-icons/manage-item-icon.png"
                  alt="icon"
                />
              </router-link>
            </div>
          </div>
        </div>
        <div class="config-box">
          <div class="config-node">
            <div class="config-title">
              <span>NODE CONFIGURATION</span>
            </div>
            <div class="config-squares">
              <div class="sq-1"></div>
              <div class="sq-2"></div>
            </div>
            <div class="config-btns">
              <div class="config-add">
                <span>ADD 1 CLICK PRESET</span>
              </div>
              <div class="config-remove">
                <span>REMOVE NODE CONFIG</span>
              </div>
            </div>
            <div class="config-table">
              <div class="table-title">
                <span>CONFIGURATION SETS</span>
              </div>
              <div class="config-table-box">
                <div
                  class="config-row"
                  v-for="(item, index) in configData"
                  :key="index"
                >
                  <div class="row-content">
                    <span>{{ item.id }}#{{ item.name }}</span>
                  </div>
                  <div v-if="item.status === 'online'" class="testnet-icon">
                    <img
                      src="/Img/icon/manage-node-icons/green-status.png"
                      alt="status-icon"
                    />
                  </div>
                  <div
                    v-else-if="item.status === 'serverOff'"
                    class="testnet-icon"
                  >
                    <img
                      src="/Img/icon/manage-node-icons/yellow-status.png"
                      alt="status-icon"
                    />
                  </div>
                  <div
                    v-else-if="item.status === 'offline'"
                    class="testnet-icon"
                  >
                    <img
                      src="/Img/icon/manage-node-icons/red-status.png"
                      alt="status-icon"
                    />
                  </div>
                  <div
                    v-else-if="item.status === 'update'"
                    class="testnet-icon"
                  >
                    <img
                      src="/Img/icon/manage-node-icons/purple-status.png"
                      alt="status-icon"
                    />
                  </div>
                  <div v-else class="testnet-icon">
                    <img
                      src="/Img/icon/manage-node-icons/blue-status.png"
                      alt="status-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="consensus">
          <manage-trapezoid>
            <template #title>
              <span class="cons-title">consensus</span>
            </template>
            <template #plusIcon>
              <img
                @click="addPlugin"
                class="trap-plus-icon"
                src="../../public/Img/icon/manage-node-icons/plus-icon.png"
                alt="icon"
              />
            </template>
            <template #default>
              <div
                class="item-box"
                @drop="onDrop($event, servicePlugins)"
                @dragenter.prevent
                @dragover.prevent
              >
                <div
                  class="items"
                  v-for="(item, index) in consensusItems"
                  :key="index"
                >
                  <img :src="item.source" alt="icon" />
                </div>
              </div>
            </template>
          </manage-trapezoid>
        </div>
        <div class="validator">
          <manage-trapezoid>
            <template #title>
              <span class="validator-title">consensus</span>
            </template>
            <template #plusIcon>
              <img
                class="trap-plus-icon"
                @click="addPlugin"
                src="../../public/Img/icon/manage-node-icons/plus-icon.png"
                alt="icon"
              />
            </template>
            <template #default>
              <div
                class="cons-items"
                v-for="(item, index) in consesusItems"
                :key="index"
              >
                <img :src="item.source" alt="icon" />
              </div>
            </template>
          </manage-trapezoid>
        </div>
        <div class="execution">
          <manage-trapezoid>
            <template #title>
              <span class="execution-title">consensus</span>
            </template>
            <template #plusIcon>
              <img
                class="trap-plus-icon"
                @click="addPlugin"
                src="../../public/Img/icon/manage-node-icons/plus-icon.png"
                alt="icon"
              />
            </template>
            <template #default>
              <div
                class="cons-items"
                v-for="(item, index) in consesusItems"
                :key="index"
              >
                <img :src="item.source" alt="icon" />
              </div>
            </template>
          </manage-trapezoid>
        </div>

        <div class="service">
          <div class="title">SERVICE PLUGIN</div>
          <div class="service-container">
            <img
              class="service-arrow"
              src="../../public/Img/icon/manage-node-icons/up-arrow.png"
              alt="icon"
            />
            <div class="service-bg">
              <div
                draggable="true"
                @dragstart="startDrag($event, item)"
                v-for="item in servicePlugins"
                :key="item.id"
                :class="{ 'chosen-plugin': item.active }"
                class="service-item"
                @click="item.active = !item.active"
              >
                <img :src="item.source" alt="icon" />
              </div>
            </div>
            <img
              class="service-arrow"
              src="../../public/Img/icon/manage-node-icons/down-arrow.png"
              alt="icon"
            />
          </div>
        </div>
        <div class="change-menu">
          <div class="confirm-box">
            <div class="confirm-bg-1">
              <div class="confirm-bg-2">
                <div class="check-icon">
                  <img
                    src="Img/icon/manage-node-icons/check-mark.png"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
            <base-button class="confirm-btn">CONFIRM</base-button>
          </div>
          <div class="table-container">
            <div class="table-header">
              <span>CHANGES TO CONFIRM</span>
            </div>
            <div class="table-box">
              <div
                class="table-item"
                v-for="item in confirmChanges"
                :key="item.id"
              >
                <div class="left-icon">
                  <img :src="item.contentIcon" alt="" />
                </div>
                <span>{{ item.content }}</span>
                <div class="right-icon">
                  <img
                    src="../../public/Img/icon/manage-node-icons/plugin-item-icon.png"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
            <div class="table-footer"></div>
          </div>
          <div class="trash-box">
            <div class="trash-bg-1">
              <div class="trash-bg-2">
                <div class="trash-icon">
                  <img
                    src="Img/icon/manage-node-icons/trash-icon.png"
                    alt="icon"
                  />
                </div>
              </div>
            </div>
            <base-button class="trash-btn">DELETE</base-button>
          </div>
        </div>
        <div class="sidebar">
          <sidebar-manage> </sidebar-manage>
        </div>

        <div class="footer">
          <div class="footer-content"></div>
        </div>
      </div>
    </node-bg>
  </section>
</template>

<script>
import ManageTrapezoid from "../components/UI/node-manage/ManageTrapezoid.vue";
import SidebarManage from "../components/UI/node-manage/SidebarManage.vue";
import BaseButton from "../components/UI/BaseButton.vue";

export default {
  components: {
    ManageTrapezoid,
    SidebarManage,
    BaseButton,
  },
  provide: ["addPlugin"],
  data() {
    return {
      consensusItems: [],
      confirmChanges: [
        {
          id: 1,
          content: "INSTALL",
          contentIcon: require("../../public/Img/icon/manage-node-icons/plus.png"),
        },
        {
          id: 2,
          content: "DELETE",
          contentIcon: require("../../public/Img/icon/manage-node-icons/minus.png"),
        },
        {
          id: 3,
          content: "ACTIVATE",
          contentIcon: require("../../public/Img/icon/manage-node-icons/green-power-icon.png"),
        },
        {
          id: 4,
          content: "DEACTIVATE",
          contentIcon: require("../../public/Img/icon/manage-node-icons/red-power-icon.png"),
        },
        {
          id: 5,
          content: "LINK WITH",
          contentIcon: require("../../public/Img/icon/manage-node-icons/link-icon.png"),
        },
        {
          id: 6,
          content: "DELINK FROM",
          contentIcon: require("../../public/Img/icon/manage-node-icons/delink-icon.png"),
        },
      ],
      servicePlugins: [
        {
          id: 1,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
        {
          id: 2,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
        {
          id: 3,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
        {
          id: 4,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
        {
          id: 5,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          active: false,
        },
      ],
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
        {
          id: 5,
          name: "Node Configuration",
          status: "update",
        },
        {
          id: 5,
          name: "Node Configuration",
          status: "update",
        },
      ],
    };
  },
  methods: {
    addPlugin() {
      this.servicePlugins.forEach((item) => {
        if (item.active) {
          this.consensusItems.push(item);
        }
        item.active = false;
      });
    },
    startDrag(event, item) {
      console.log(item);
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("itemId", item.id);
    },
    onDrop(event, list) {
      const itemId = event.dataTransfer.getData("itemId");
      const item = { ...list.find((item) => item.id == itemId) };
      this.consensusItems.push(item);
    },
  },
};
</script>

<style scoped>
#parent {
  box-sizing: border-box;
  padding: 0;
}

#head {
  position: fixed;
  top: 0;
  z-index: 100;
}
.manage-parent {
  display: grid;
  height: 92%;
  grid-template-columns: 3% 17% 45% 20% 15%;
  grid-template-rows: repeat(3, 32%) 4%;
  grid-row-gap: 1px;
  position: relative;
  top: 9%;
}

.menu-side {
  grid-column-start: 1;
  grid-row: 1/6;
  background-color: transparent;
  width: 100%;
  position: relative;
}
.menu-background {
  grid-row: 1/4;
  background-color: #336666;
  height: 100%;
  clip-path: polygon(0 0, 100% 0%, 40% 100%, 0% 100%);
  z-index: -3;
}
.menu-box {
  position: absolute;
  top: 0;
  width: 100%;
  height: 80%;
  background: #a1c1ad;
  z-index: 0;
}
.menu {
  position: absolute;
  bottom: 0;
  width: 95%;
  height: 90%;
  background: #1c4545;
  border-bottom-right-radius: 100% 15%;
  border-top-left-radius: 100% 15%;
}
.menu .home-icon {
  border-radius: 100%;
  outline-style: none;
  width: 25px;
  margin-top: 50px;
}
.menu .manage-icon {
  border-radius: 100%;
  outline-style: none;
  width: 25px;
  margin-top: 10px;
}

.config-box {
  color: white;
  width: 100%;
  height: 100%;
  grid-column: 2/3;
  grid-row: 1/5;
  align-self: center;
  background-color: transparent;
}
.config-node {
  display: grid;
  grid-column: 1;
  grid-template-rows: repeat(12, 42px);
  width: 90%;
  height: 93%;
  padding: 5px;
  background-color: #33393e;
  border-radius: 0 30px 30px 30px;
}
.config-box .config-title {
  grid-row: 1;
  justify-self: end;
  align-self: flex-end;
}
.config-title span {
  font-size: 8px;
  font-weight: bold;
  background-color: rgb(48, 48, 48);
  border: 1px solid rgb(169, 168, 168);
  padding: 3px 4px;
  border-radius: 8px;
  box-shadow: 1px 1px 5px 2px rgb(69, 68, 68);
}
.config-node .config-squares {
  grid-row: 2/3;
  width: 94%;
  height: 70px;
  border: 5px solid gray;
  margin: 10px auto;
  border-radius: 4px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.config-squares .sq-1,
.config-squares .sq-2 {
  width: 45%;
  height: 90%;
  background-color: #336666;
  border: 1px solid #747474;
  border-radius: 1px;
}

.config-node .config-btns {
  grid-row: 4/6;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}
.config-btns .config-add,
.config-btns .config-remove {
  width: 90%;
  background-color: #323232;
  font-size: 10px;
  font-weight: bold;
  border: 1px solid rgb(169, 168, 168);
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 0 5px 1px rgb(82, 81, 81);
}
.config-node .config-table {
  grid-row: 6/11;
  margin-top: 10px;
}
.config-table .table-title span {
  width: 90%;
  background-color: #323232;
  font-size: 8px;
  font-weight: bold;
  border: 1px solid rgb(169, 168, 168);
  padding: 2px 4px;
  border-radius: 8px;
}
.config-table .config-table-box {
  width: 95%;
  height: 90%;
  margin: 10px auto;
  padding: 2px 0;
  border: 4px solid gray;
  border-radius: 15px;
  overflow-x: hidden;
  overflow-y: auto;
}
.config-row {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid gray;
}
.config-row:nth-child(even) {
  background-color: #26292b;
}
.config-row:last-child {
  border-bottom: none;
  border-radius: 0 0 15px 15px;
}
.config-row .row-content {
  height: 30px;
}
.config-row .row-content span {
  font-size: 10px;
  font-weight: bold;
}
.testnet-icon {
  display: flex;
  width: 20px;
  min-width: 20px;
  justify-content: center;
  align-items: center;
  /* flex: 1; */
}
.testnet-icon img {
  width: 20px;
  height: 20px;
}

.item-box {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(2, 63px);
  justify-content: space-between;
  align-self: center;
  align-items: center;
  row-gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 21%;
  left: 21.6%;
  height: 63px;
  width: 230px;
  background-color: transparent;
  border-top: 1px solid #656565;
  border-bottom: 1px solid #656565;
}

.item-box .items {
  display: flex;
  justify-content: center;
  align-self: center;
  width: 50px;
  height: 50px;
  border: 1px solid rgb(96, 95, 95);
  border-radius: 10px;
  margin: 0 auto;
}
.item-box .items img {
  width: 50px;
  height: 50px;
}
.consensus {
  grid-column: 3/4;
  grid-row: 1/2;
  height: 100%;
  align-self: center;
}

.cons-title,
.validator-title,
.execution-title {
  width: auto;
  height: 20px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 5px;
  background-color: #334b3f;
  border-radius: 20px;
}
.validator {
  grid-column: 3/4;
  grid-row: 2/3;
  align-self: center;
  height: 100%;
}
.execution {
  grid-column: 3/4;
  grid-row: 3/4;
  color: white;
  align-self: center;
  box-sizing: border-box;
  height: 100%;
}
.service {
  grid-column: 4/5;
  grid-row: 1/4;
  background: #2c4030;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.title {
  height: 5%;
  background: #263529;
  margin: 1rem 0;
  font-weight: bold;
  padding: 0.5px;
  text-align: center;
  font-size: 1rem;
}
.trap-title {
  color: white;
  font-size: 1rem;
  font-weight: bold;
}
.trap-plus-icon {
  width: 50px;
  height: 30px;
}
.trap-plus-icon img {
  width: 50px;
  height: 30px;
}
.service-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 95%;
  height: 95%;
  margin-bottom: 10px;
  background: #4f4f4f;
  align-self: center;
  border-radius: 20px;
  overflow: hidden;
  padding: 5px;
  box-sizing: border-box;
}
.service-bg {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: repeat(4, 22%);
  align-items: center;
  justify-items: center;
  padding-top: 20px;
  width: 90%;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #707070;
  border-radius: 20px;
  gap: 3px;
}
.service-arrow {
  width: 50%;
}
.service-item {
  width: 60px;
  height: 60px;
  border: 2px solid gray;
  border-radius: 13px;
}
.service-item img {
  width: 60px;
  height: 60px;
  border-radius: 13px;
  box-shadow: 1px 1px 5px 1px rgb(132, 130, 130);
}
.service-item img:active {
  box-shadow: none;
}
.chosen-plugin {
  border: 2px solid rgb(86, 172, 138);
  border-radius: 13px;
}
.btn {
  width: 90%;
  margin: 3%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-self: center;
  overflow: hidden;
}
.arrow-up {
  width: 0;
  height: 50%;
  border-bottom: solid 0.5rem #eee;
  border-left: solid 50px transparent;
  border-right: solid 50px transparent;
  resize: both;
}
.arrow-down {
  width: 0;
  height: 50%;
  border-top: solid 0.5rem #eee;
  border-left: solid 50px transparent;
  border-right: solid 50px transparent;
}
.change-menu {
  grid-row: 1/4;
  grid-column: 5/6;
  margin: 0 5px;
  background: #334b3f;
  border: solid #1a2620;
  border-width: 1px 6px;
  border-top-right-radius: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.confirm-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.change-menu .confirm-bg-1 {
  width: 70px;
  height: 70px;
  margin: 10px auto;
  border-radius: 50%;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .confirm-bg-2 {
  width: 55px;
  height: 55px;
  background-color: #2c2f30;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .check-icon {
  width: 50px;
  height: 50px;
  background-color: #33393e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu img {
  width: 40px;
  height: 40px;
}
.confirm-btn {
  font-size: 0.8rem;
  font-weight: bold;
  width: 85px;
  height: 35px;
  outline-style: none;
}
.table-container {
  margin: 5px auto 0 auto;
  width: 88%;
  height: 200px;
  background-color: #707070;
  border: 1px solid rgb(63, 63, 63);
  border-radius: 25px;
  padding: 5px;
  position: relative;
}
.table-header {
  width: 85%;
  height: 25px;
  background-color: #707070;
  border: 1px solid rgb(63, 63, 63);
  border-radius: 50px;
  margin: 0 auto;
  position: absolute;
  top: 4px;
  right: 8px;
}
.table-header span {
  color: #fff;
  font-size: 0.5rem;
  font-weight: 800;
}
.table-box {
  width: 90%;
  height: 85%;
  margin: 0 auto;
  background-color: #3b3a3a;
  border-left: 2px solid gray;
  border-right: 2px solid gray;
  border-radius: 10px;
  padding-top: 30px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.table-item {
  width: 90%;
  height: 25px;
  margin: 5px auto;
  background-color: #1c1e1f;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-item .right-icon {
  width: 20px;
  height: 20px;
  border-radius: 100%;
}
.table-item .left-icon {
  width: 20px;
  height: 20px;
  background-color: #336666;
}
.table-item .right-icon img {
  width: 18px;
  height: 18px;
  border-radius: 100%;
}
.table-item .left-icon img {
  width: 18px;
  height: 18px;
}
.table-item span {
  color: #fff;
  font-size: 0.5rem;
  font-weight: bold;
}
.table-footer {
  width: 85%;
  height: 20px;
  background-color: #707070;
  border: 1px solid rgb(63, 63, 63);
  border-radius: 50px;
  margin: 0 auto;
  position: absolute;
  bottom: 4px;
  right: 8px;
}
.table-box img {
  width: 90%;
  height: 200px;
}
.trash-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.change-menu .trash-bg-1 {
  width: 70px;
  height: 70px;
  margin: 10px auto;
  border-radius: 50%;
  background-color: #33393e;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .trash-bg-2 {
  width: 55px;
  height: 55px;
  background-color: #454646;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-menu .trash-icon {
  width: 50px;
  height: 50px;
  background-color: #33393e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.trash-icon img {
  width: 70px;
  height: 70px;
}
.trash-btn {
  font-size: 0.8rem;
  font-weight: bold;
  width: 85px;
  height: 35px;
  outline-style: none;
}
.footer {
  color: white;
  grid-column: 1/7;
  grid-row: 4;
  background-color: gray;
  border-radius: 0 0 1.9rem 1.9rem;
  position: relative;
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(160, 160, 160);
  border-radius: 50px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
  margin: 10px;
}
</style>
