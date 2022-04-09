<template>
  <section id="parent">
    <node-header id="head" onmousedown="return false"></node-header>
    <node-bg>
      <div class="manage-parent">
        <div class="config-box" onmousedown="return false">
          <node-configuration
            :configData="configData"
            @modal-preset="openPresetModal"
          ></node-configuration>
        </div>
        <div class="preset-modal" v-if="presetModal">
          <preset-modal @close-preset="closePresetModal"></preset-modal>
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
          <div class="title">
            <span>SERVICE PLUGIN</span>
          </div>
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
import NodeConfiguration from "../components/UI/node-manage/NodeConfiguration.vue";
import ChangeConfirm from "../components/UI/node-manage/ChangeConfirm.vue";
import DropZone from "../components/UI/node-manage/DropZone.vue";
import BaseModal from "../components/UI/node-manage/BaseModal.vue";
import PresetModal from "../components/UI/node-manage/PresetModal.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    SidebarManage,
    NodeConfiguration,
    ChangeConfirm,
    DropZone,
    BaseModal,
    PresetModal,
  },
  emits: ["startDrag", "closeMe", "modalView"],

  data() {
    return {
      dragging: false,
      isModalActive: false,
      presetModal: false,
      modalItems: [],
    };
  },
  computed: {
    ...mapGetters({
      consensusItems: "getConsensusItems",
      executionItems: "getExecutionItems",
      validatorItems: "getValidatorItems",
      selectedItemToRemove: "getSelectedItemToRemove",
      confirmChanges: "getConfirmChanges",
      servicePlugins: "getServicePlugins",
      sidebarPlugins: "getSidebarPlugins",
      configData: "getConfigData",
    }),
  },
  methods: {
    showModal(data) {
      this.isModalActive = true;
      this.modalItems = data;
    },
    openPresetModal() {
      this.presetModal = true;
    },
    closeModal() {
      this.isModalActive = false;
    },
    closePresetModal() {
      this.presetModal = false;
    },
    startDrag(event, item) {
      if (event.type === "dragstart") {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("itemId", item.id);
      }
    },
    onDrop(event, list) {
      const itemId = event.dataTransfer.getData("itemId");
      const item = { ...list.find((item) => item.id == itemId) };
      if (item.category === "validator") {
        if (this.validatorItems.some((item) => item.id == itemId)) return;
        this.validatorItems.push(item);
        this.$store.commit("mutatedValidatorItems", this.validatorItems);
      } else if (item.category === "consensus") {
        if (this.consensusItems.some((item) => item.id == itemId)) return;
        this.consensusItems.push(item);
        this.$store.commit("mutatedConsensusItems", this.consensusItems);
      } else if (item.category === "execution") {
        if (this.executionItems.some((item) => item.id == itemId)) return;
        this.executionItems.push(item);
        this.$store.commit("mutatedExecutionItems", this.executionItems);
      } else {
        if (this.servicePlugins.some((item) => item.id == itemId)) return;
        this.servicePlugins.push(item);
        this.$store.commit("mutatedServiceplugins", this.servicePlugins);
      }
    },
    serviceItemSelection(item) {
      this.$store.commit("selectedItemToRemoveMutation", item);
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
  width: 100%;
  height: 92.3vh;
  grid-template-columns: 18% 46% 21% 15%;
  grid-template-rows: repeat(3, 32%) 4%;
  grid-row-gap: 1px;
  position: absolute;
  top: -5px;
}

.config-box {
  color: white;
  margin-top: 5px;
  width: 100%;
  height: 98.7%;
  grid-column: 1;
  grid-row: 1/4;
  align-self: center;
  background-color: transparent;
}
.preset-modal {
  width: 80.6vw;
  height: 87.7vh;
  border-radius: 35px;
  z-index: 5;
  position: absolute;
  top: 1.5%;
  left: 18%;
}
.drop-parent {
  height: 88vh;
  margin: 5px 4px 0 0;
  grid-column: 2;
  grid-row: 1/4;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.modal-parent {
  grid-column: 2;
  grid-row: 1/4;
  width: 45.5vw;
  height: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 1;
}
.modal-bg {
  width: 100vw;
  height: 87.9vh;
}
.service {
  width: 97.7%;
  height: 97%;
  margin-top: 6px;
  grid-column: 3;
  grid-row: 1/4;
  background: #334b3f;
  color: rgb(201, 201, 201);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  border: 5px solid #1a2620;
}
.service-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
}

.title {
  width: 70%;
  height: 6%;
  background: #263529;
  border: 1px solid #2d4338;
  border-radius: 15px;
  margin: 10px auto;
  font-weight: 800;
  font-size: 1rem;
  box-shadow: 1px 1px 3px rgb(26, 26, 26);
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 93.3%;
  height: 97%;
  margin-top: 6px;
  grid-row: 1/4;
  grid-column: 4;
  background: #334b3f;
  border: 5px solid #1a2620;
  border-top-right-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.sidebar {
  z-index: 6;
}

.footer {
  color: white;
  width: 100%;
  grid-column: 1/5;
  grid-row: 4;
  background-color: rgb(40, 40, 40);
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
