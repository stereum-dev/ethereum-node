<template>
  <section id="parent">
    <node-header id="head"></node-header>
    <node-bg>
      <div class="manage-parent">
        <menu-side></menu-side>
        <div class="config-box">
          <node-configuration :configData="configData"></node-configuration>
        </div>
        <div class="drop-parent">
          <div
            class="consensus"
            @drop="onDrop($event, sidebarPlugins)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone :title="'consensus'" :list="consensusItems"></drop-zone>
          </div>
          <div
            @drop="onDrop($event, sidebarPlugins)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone :title="'validator'" :list="validatorItems"></drop-zone>
          </div>
          <div
            @drop="onDrop($event, sidebarPlugins)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone :title="'execution'" :list="executionItems"></drop-zone>
          </div>
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
import SidebarManage from "../components/UI/node-manage/SidebarManage.vue";
import MenuSide from "../components/UI/node-manage/MenuSide.vue";
import NodeConfiguration from "../components/UI/node-manage/NodeConfiguration.vue";
import ChangeConfirm from "../components/UI/node-manage/ChangeConfirm.vue";
import ServicePlugin from "../components/UI/node-manage/ServicePlugin.vue";
import DropZone from "../components/UI/node-manage/DropZone.vue";
export default {
  components: {
 
    SidebarManage,
    MenuSide,
    NodeConfiguration,
    ChangeConfirm,
    ServicePlugin,
    DropZone,
  },
  emits: ["startDrag"],

  data() {
    return {
      dragging: false,
      consensusItems: [],
      executionItems: [],
      validatorItems: [],
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
          category: "validator",
        },
        {
          id: 6,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
        },
        {
          id: 7,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
        },
        {
          id: 8,
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
      if (item.category === "validator") {
        this.validatorItems.push(item);
      } else if (item.category === "consensus") {
        this.consensusItems.push(item);
      } else {
        this.executionItems.push(item);
      }
      console.log(item);
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
.drop-parent {
  grid-column: 3;
  grid-row: 1/4;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
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
