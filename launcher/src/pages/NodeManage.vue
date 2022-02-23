<template>
  <section id="parent">
    <node-header id="head"></node-header>
    <node-bg>
      <div class="manage-parent">
        <menu-side></menu-side>
        <div class="config-box">
          <node-configuration :configData="configData"></node-configuration>
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
                @drop="onDrop($event, sidebarPlugins)"
                @dragenter.prevent
                @dragover.prevent
              >
                <div
                  class="items"
                  v-for="(item, index) in filteredConsensus()"
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
              <span class="cons-title">Validator</span>
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
                @drop="onDrop($event, sidebarPlugins)"
                @dragenter.prevent
                @dragover.prevent
              >
                <div
                  class="items"
                  v-for="(item, index) in filteredValidator()"
                  :key="index"
                >
                  <img :src="item.source" alt="icon" />
                </div>
              </div>
            </template>
          </manage-trapezoid>
        </div>
        <div class="execution">
          <manage-trapezoid>
            <template #title>
              <span class="cons-title">Execution</span>
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
                @drop="onDrop($event, sidebarPlugins)"
                @dragenter.prevent
                @dragover.prevent
              >
                <div
                  class="items"
                  v-for="(item, index) in filteredExecution()"
                  :key="index"
                >
                  <img :src="item.source" alt="icon" />
                </div>
              </div>
            </template>
          </manage-trapezoid>
        </div>
        <div class="service">
          <div class="title">SERVICE PLUGIN</div>
          <service-plugin :servicePlugins="servicePlugins"></service-plugin>
        </div>
        <div class="change-menu">
          <change-confirm :confirmChanges="confirmChanges"></change-confirm>
        </div>
        <div class="sidebar">
          <sidebar-manage
            :startDrag="startDrag"
            :sidebarPlugins="sidebarPlugins"
          >
          </sidebar-manage>
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
import MenuSide from "../components/UI/node-manage/MenuSide.vue";
import NodeConfiguration from "../components/UI/node-manage/NodeConfiguration.vue";
import ChangeConfirm from "../components/UI/node-manage/ChangeConfirm.vue";
import ServicePlugin from "../components/UI/node-manage/ServicePlugin.vue";

export default {
  components: {
    ManageTrapezoid,
    SidebarManage,
    MenuSide,
    NodeConfiguration,
    ChangeConfirm,
    ServicePlugin,
  },
  emits: ["startDrag"],

  data() {
    return {
      dragging: false,
      consensusItems: [],
      executionItems: [],
      validationItems: [],
      droppedItems: [],
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
      sidebarPlugins: [
        {
          id: 1,
          source: require("../../public/Img/icon/manage-node-icons/filter-confirm.png"),
          drag: true,
          category: "execution",
        },
        {
          id: 2,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
        },
        {
          id: 3,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
        },
        {
          id: 4,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
        },
        {
          id: 5,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
        },
        {
          id: 3,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
        },
        {
          id: 4,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
        },
        {
          id: 5,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "execution",
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
      if (event.type === "dragstart") {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("itemId", item.id);
        console.log("drag", event.type);
        console.log("category", item.category);
      }
    },
    onDrop(event, list) {
      const itemId = event.dataTransfer.getData("itemId");
      const item = { ...list.find((item) => item.id == itemId) };
      if (item.category) {
        this.droppedItems.push(item);
      }
      console.log(this.droppedItems);
      console.log("item", item);
      console.log("category", item.category);
      console.log("type", event.type);
    },
    filteredConsensus() {
      this.consensusItems = this.droppedItems.filter(
        (item) => item.category == "consensus"
      );
      return this.consensusItems;
    },
    filteredExecution() {
      this.executionItems = this.droppedItems.filter(
        (item) => item.category == "execution"
      );
      return this.executionItems;
    },
    filteredValidator() {
      this.validatorItems = this.droppedItems.filter(
        (item) => item.category == "validator"
      );
      return this.validatorItems;
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

.config-box {
  color: white;
  width: 100%;
  height: 100%;
  grid-column: 2/3;
  grid-row: 1/5;
  align-self: center;
  background-color: transparent;
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
  justify-content: space-between;
  align-items: center;
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
