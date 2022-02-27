<template>
  <section id="parent">
    <node-header id="head" onmousedown="return false"></node-header>
    <node-bg>
      <div class="manage-parent">
        <menu-side onmousedown="return false"></menu-side>
        <div class="config-box" onmousedown="return false">
          <node-configuration :configData="configData"></node-configuration>
        </div>
        <div class="drop-parent">
          <div class="modal-parent" v-if="isModalActive">
            <base-modal
              :modalItems="modalItems"
              @close-me="closeModal"
            ></base-modal>
          </div>
          <div
            @drop="onDrop($event, sidebarPlugins)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone
              @modal-view="showModal"
              :title="'consensus'"
              :list="consensusItems"
              @itemSelect="serviceItemSelection"
            ></drop-zone>
          </div>
          <div
            @drop="onDrop($event, sidebarPlugins)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone
              @modal-view="showModal"
              :title="'validator'"
              :list="validatorItems"
              @itemSelect="serviceItemSelection"
            ></drop-zone>
          </div>
          <div
            @drop="onDrop($event, sidebarPlugins)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone
              :title="'execution'"
              :list="executionItems"
              @modal-view="showModal"
              @itemSelect="serviceItemSelection"
            ></drop-zone>
          </div>
        </div>
        <div class="service" onmousedown="return false">
          <div class="title">SERVICE PLUGIN</div>
          <div
            class="service-parent"
            @drop="onDrop($event, sidebarPlugins)"
            @dragenter.prevent
            @dragover.prevent
          >
            <service-plugin
              :list="servicePlugins"
              @itemSelect="serviceItemSelection"
            >
            </service-plugin>
          </div>
        </div>
        <div class="change-menu" onmousedown="return false">
          <change-confirm
            :confirmChanges="confirmChanges"
            @clickOnRemove="clickOnRemoveBtn()"
          ></change-confirm>
        </div>
        <div class="sidebar">
          <sidebar-manage
            :startDrag="startDrag"
            :sidebarPlugins="sidebarPlugins"
          >
          </sidebar-manage>
        </div>
        <div class="footer" onmousedown="return false">
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
import BaseModal from "../components/UI/node-manage/BaseModal.vue";
export default {
  components: {
    SidebarManage,
    MenuSide,
    NodeConfiguration,
    ChangeConfirm,
    ServicePlugin,
    DropZone,
    BaseModal,
  },
  emits: ["startDrag", "closeMe", "modalView"],

  data() {
    return {
      dragging: false,
      isModalActive: false,
      consensusItems: [],
      executionItems: [],
      validatorItems: [],
      selectedItemToRemove: {},
      modalItems: [],
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
          category: "service",
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
          category: "service",
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
        {
          id: 9,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
        },
        {
          id: 10,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
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
    showModal(data) {
      this.isModalActive = true;
      this.modalItems = data;
    },
    closeModal() {
      this.isModalActive = false;
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
      } else if (item.category === "execution") {
        this.executionItems.push(item);
      } else {
        this.servicePlugins.push(item);
      }
      console.log(item);
    },
    serviceItemSelection(item) {
      this.selectedItemToRemove = item;
    },
    clickOnRemoveBtn() {
      console.log("category", this.selectedItemToRemove.category);
      if (this.selectedItemToRemove.category == "service") {
        this.servicePlugins = this.servicePlugins.filter((item) => {
          return item.id !== this.selectedItemToRemove.id;
        });
      }
      if (this.selectedItemToRemove.category == "execution") {
        this.executionItems = this.executionItems.filter((item) => {
          return item.id !== this.selectedItemToRemove.id;
        });
      }
      if (this.selectedItemToRemove.category == "consensus") {
        this.consensusItems = this.consensusItems.filter((item) => {
          return item.id !== this.selectedItemToRemove.id;
        });
      }
      if (this.selectedItemToRemove.category == "validator") {
        this.validatorItems = this.validatorItems.filter((item) => {
          return item.id !== this.selectedItemToRemove.id;
        });
      }
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
.modal-parent {
  display: flex;
  grid-column: 3;
  grid-row: 1/4;
  position: absolute;
  z-index: 1;
}
.service {
  grid-column: 4/5;
  grid-row: 1/4;
  background: #2c4030;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
}
.service-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
