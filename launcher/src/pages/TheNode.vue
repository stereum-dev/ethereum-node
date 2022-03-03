<template>
  <section id="parent">
    <node-header id="head" onmousedown="return false"></node-header>
    <node-bg>
      <div class="node-parent">
        <menu-side onmousedown="return false"></menu-side>
        <div class="config-box" onmousedown="return false">
          <node-configuration :configData="configData"></node-configuration>
        </div>
        <div class="trapezoid-parent">
          <div class="modal-parent" v-if="isModalActive">
            <base-modal
              :modalItems="modalItems"
              @close-me="closeModal"
            ></base-modal>
          </div>
          <div>
            <drop-zone
              @modal-view="showModal"
              :title="'consensus'"
              :list="consensusItems"
              @itemSelect="serviceItemSelection"
            ></drop-zone>
          </div>
          <div>
            <drop-zone
              @modal-view="showModal"
              :title="'validator'"
              :list="validatorItems"
              @itemSelect="serviceItemSelection"
            ></drop-zone>
          </div>
          <div>
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
          <div class="service-parent">
            <service-plugin
              :list="servicePlugins"
              @itemSelect="serviceItemSelection"
            >
            </service-plugin>
          </div>
        </div>
        <div class="node-side" onmousedown="return false">
          <node-sidebar></node-sidebar>
        </div>
        <div class="footer" onmousedown="return false">
          <div class="footer-content"></div>
        </div>
      </div>
    </node-bg>
  </section>
</template>

<script>
import NodeConfiguration from "../components/UI/node-manage/NodeConfiguration.vue";
import DropZone from "../components/UI/node-manage/DropZone.vue";
import BaseModal from "../components/UI/node-manage/BaseModal.vue";
import NodeSidebar from "../components/UI/NodeSidebarParent.vue";
export default {
  components: {
    NodeConfiguration,
    DropZone,
    BaseModal,
    NodeSidebar,
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
          active: false,
        },
        {
          id: 2,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
          active: false,
        },
        {
          id: 3,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 4,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
          active: false,
        },
        {
          id: 5,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "validator",
          active: false,
        },
        {
          id: 6,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 7,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
          active: false,
        },
        {
          id: 8,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "execution",
          active: false,
        },
        {
          id: 9,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "service",
          active: false,
        },
        {
          id: 10,
          source: require("../../public/Img/icon/manage-node-icons/plugin-item-icon.png"),
          drag: true,
          category: "consensus",
          active: false,
        },
      ],
      configData: [
        {
          id: 1,
          name: "Configuration",
          network: "testNet",
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
.node-parent {
  display: grid;
  height: 92%;
  grid-template-columns: 15% 47% 22% 16%;
  grid-template-rows: repeat(3, 32%) 4%;
  grid-row-gap: 1px;
  position: relative;
  top: 9%;
}

.config-box {
  color: white;
  height: 99%;
  grid-column: 1;
  grid-row: 1/5;
  align-self: center;
  background-color: transparent;
}
.trapezoid-parent {
  grid-column: 2;
  grid-row: 1/4;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.modal-parent {
  display: flex;
  grid-column: 2;
  grid-row: 1/4;
  position: absolute;
  z-index: 1;
}
.service {
  grid-column: 3;
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
  width: 90%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
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
.node-side {
  grid-column: 4;
  grid-row: 1/4;
  height: 100%;
  max-height: 600px;
}

.footer {
  color: white;
  grid-column: 1/5;
  grid-row: 4;
  background-color: gray;
  border-radius: 0 0 1.9rem 1.9rem;
  position: relative;
}

</style>
