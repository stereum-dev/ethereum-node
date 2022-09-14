<template>
  <section id="parent">
    <node-header id="head" onmousedown="return false"></node-header>
    <node-bg>
      <div class="manage-parent">
        <div class="config-box">
          <Transition name="slide" >
            <add-panel
              v-if="displayCustomAddPanel"
              :items="itemToInstall"
              @cancel-add="cancelAddProcess"
              @save-config="saveServiceConfiguration"
            ></add-panel>
            <modify-panel
              v-else-if="displayCustomModifyPanel"
              :items="itemToInstall"
              @cancel-modify="cancelModifyProcess"
              @save-modify="saveServiceModification"
            >
            </modify-panel>
            <node-configuration
              v-else
              :configData="configData"
              @modal-preset="openPresetModal"
            ></node-configuration>
          </Transition>
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
            @drop="onDrop($event, allServices)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone
              :title="'execution'"
              :list="
                newConfiguration.filter(
                  (service) => service.category === 'execution'
                )
              "
              @modal-view="showModal"
              @select-item="selectedServiceToRemove"
              @modify-item="selectedServiceToModify"
            ></drop-zone>
          </div>
          <div
            @drop="onDrop($event, allServices)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone
              @modal-view="showModal"
              :title="'consensus'"
              :list="
                newConfiguration.filter(
                  (service) => service.category === 'consensus'
                )
              "
              @select-item="selectedServiceToRemove"
              @modify-item="selectedServiceToModify"
            ></drop-zone>
          </div>
          <div
            @drop="onDrop($event, allServices)"
            @dragenter.prevent
            @dragover.prevent
          >
            <drop-zone
              @modal-view="showModal"
              :title="'validator'"
              :list="
                newConfiguration.filter(
                  (service) => service.category === 'validator'
                )
              "
              @select-item="selectedServiceToRemove"
              @modify-item="selectedServiceToModify"
            ></drop-zone>
          </div>
        </div>
        <div class="service" onmousedown="return false">
          <div class="title">
            <span>SERVICE PLUGIN</span>
          </div>
          <div
            class="service-parent"
            @drop="onDrop($event, allServices)"
            @dragenter.prevent
            @dragover.prevent
          >
            <service-plugin
              :list="
                newConfiguration.filter(
                  (service) => service.category === 'service'
                )
              "
              @select-item="selectedServiceToRemove"
              @modify-item="selectedServiceToModify"
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
            :allServices="allServices"
            @add-service="addNewService"
          >
          </sidebar-manage>
        </div>
        <div class="footer" onmousedown="return false">
          <div class="footer-content"></div>
        </div>
        <task-manager></task-manager>
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
import AddPanel from "../components/UI/node-manage/AddPanel.vue";
import ModifyPanel from "../components/UI/node-manage/ModifyPanel.vue";
import PresetModal from "../components/UI/node-manage/PresetModal.vue";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import TaskManager from "../components/UI/task-manager/TaskManager.vue";
import { useNodeManage } from "../store/nodeManage";
export default {
  components: {
    SidebarManage,
    NodeConfiguration,
    ChangeConfirm,
    DropZone,
    BaseModal,
    PresetModal,
    TaskManager,
    AddPanel,
    ModifyPanel,
  },
  emits: ["startDrag", "closeMe", "modalView"],

  data() {
    return {
      dragging: false,
      isModalActive: false,
      presetModal: false,
      modalItems: [],
      displayCustomAddPanel: false,
      displayCustomModifyPanel: false,
      itemToInstall: null,
    };
  },
  computed: {
    ...mapWritableState(useNodeStore, {
      selectedItemToRemove: "selectedItemToRemove",
      confirmChanges: "confirmChanges",
      configData: "configData",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
    }),
    ...mapWritableState(useNodeManage, {
      newConfiguration: "newConfiguration",
      actionContents: "actionContents",
    }),
  },
  mounted() {
    this.newConfiguration = this.installedServices;
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
      if (this.newConfiguration.some((item) => item.id == itemId)) return;
      this.newConfiguration.push(item);
      item.addPanel = true;
      this.itemToInstall = item;
      this.displayCustomAddPanel = item.modifierPanel;
    },
    addNewService(item) {
      if (this.newConfiguration.some((el) => el.id == item.id)) return;
      this.newConfiguration.push(item);
      item.addPanel = true;
      this.itemToInstall = item;
      this.displayCustomAddPanel = item.addPanel;
    },
    saveServiceConfiguration() {
      this.itemToInstall = null;
      this.displayCustomAddPanel = false;
      this.newConfiguration.pop();
    },
    selectedServiceToRemove(item) {
      if (item.active) {
        this.selectedItemToRemove.push(item);
      } else {
        this.selectedItemToRemove = this.selectedItemToRemove.filter(
          (el) => el.id !== item.id
        );
      }
    },
    cancelAddProcess() {
      this.itemToInstall = null;
      this.displayCustomAddPanel = false;
      this.newConfiguration.pop();
    },
    selectedServiceToModify(item) {
      this.newConfiguration = this.newConfiguration.map((el) => {
        if (el.id === item.id) {
          el.modifierPanel = true;
          this.itemToInstall = item;
          this.displayCustomModifyPanel = el.modifierPanel;
        }
        return {
          ...el,
          modifierPanel: false,
        };
      });
    },
    cancelModifyProcess() {
      this.itemToInstall.modifierPanel = false;
      this.displayCustomModifyPanel = this.itemToInstall.modifierPanel;
      this.itemToInstall = null;
    },
    saveServiceModification() {
      this.itemToInstall.modifierPanel = false;
      this.displayCustomModifyPanel = this.itemToInstall.modifierPanel;
      this.itemToInstall = null;
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
  height: 91%;
  border: 4px solid #979797;
  border-radius: 0 35px 10px 10px;
  grid-template-columns: 20% 45% 20% 15%;
  grid-template-rows: 31% 32% 32% 5%;
  grid-row-gap: 1px;
}

.config-box {
  color: white;
  width: 100%;
  height: 100%;
  grid-column: 1;
  grid-row: 1/4;
  align-self: center;
  position: relative;
}
.activeAddPanel {
  left: 0 !important;
}
.preset-modal {
  width: 81.5%;
  height: 86.4%;
  border-radius: 35px;
  z-index: 5;
  position: absolute;
  top: 9%;
  left: 18%;
}
.drop-parent {
  width: 100%;
  height: 100%;
  grid-column: 2;
  grid-row: 1/4;
  margin-top: 1px;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.modal-parent {
  grid-column: 2;
  grid-row: 1/4;
  width: 45.5%;
  height: 99%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 2%;
  left: 18.5%;
  z-index: 1;
}
.modal-bg {
  width: 100%;
  height: 86.3%;
  position: absolute;
  top: 8%;
  right: 1px;
}
.service {
  width: 99%;
  height: 100.2%;
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
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 1px 3px rgb(19, 40, 31);
  display: flex;
  justify-content: center;
  align-items: center;
}
.trap-title {
  color: rgb(210, 210, 210);
  font-size: 1rem;
  font-weight: 800;
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
  width: 99.5%;
  height: 100.2%;
  grid-row: 1/4;
  grid-column: 4;
  background: #334b3f;
  border: 5px solid #1a2620;
  border-left: 5px solid #161616;
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
  width: 100%;
  height: 88%;
  margin: 0 auto;
  grid-column: 1/5;
  grid-row: 4;
  background-color: #343434;
  border-radius: 0 0 7px 7px;
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

.edit-task__manager {
  position: fixed;
  left: 4px;
  bottom: -1px;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-200px);
  transition-duration: 150ms;
}
</style>
