<template>
  <section id="parent">
    <node-header id="head" @mousedown.prevent.stop></node-header>
    <node-bg>
      <div class="manage-parent">
        <div class="config-box">
          <Transition name="fade" mode="default">
            <add-panel
              v-if="itemToInstall.addPanel"
              :items="itemToInstall"
              @cancel-add="cancelAddProcess"
              @save-config="saveAddedServiceConfig"
            ></add-panel>
            <modify-panel
              v-else-if="itemToModify.modifierPanel && itemToModify.service !== 'PrometheusNodeExporterService'"
              :items="itemToModify"
              @cancel-modify="cancelModifyProcess"
              @save-modify="saveServiceModification"
              @change-plugin="replacePlugin"
            >
            </modify-panel>
            <replace-panel
              v-else-if="itemToReplace.replacePanel"
              :items="itemToReplace"
              @cancel-replace="cancelReplaceProcess"
              @confirm-replace="confirmReplaceProcess"
              @replace-plugin="replacePluginHandler"
            >
            </replace-panel>
            <node-configuration v-else></node-configuration>
          </Transition>
        </div>
        <div class="drop-parent">
          <switch-network></switch-network>
          <div v-if="isModalActive" class="modal-parent">
            <base-modal :modal-items="modalItems" @close-me="closeModal"></base-modal>
          </div>
          <div @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
            <drop-zone
              :title="$t('theNode.execution')"
              :list="newConfiguration.filter((service) => service.category === 'execution').sort(sortByName)"
              @modal-view="showModal"
              @select-item="selectedServiceToRemove"
              @modify-item="selectedServiceToModify"
            >
            </drop-zone>
          </div>
          <div @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
            <drop-zone
              :title="$t('theNode.consensus')"
              :list="newConfiguration.filter((service) => service.category === 'consensus').sort(sortByName)"
              @modal-view="showModal"
              @select-item="selectedServiceToRemove"
              @modify-item="selectedServiceToModify"
            ></drop-zone>
          </div>
          <div @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
            <drop-zone
              :title="$t('theNode.validator')"
              :list="newConfiguration.filter((service) => service.category === 'validator').sort(sortByName)"
              @modal-view="showModal"
              @select-item="selectedServiceToRemove"
              @modify-item="selectedServiceToModify"
            ></drop-zone>
          </div>
        </div>
        <div class="service" onmousedown="return false">
          <div class="title">
            <span>{{ $t("theNode.servicePlugin") }}</span>
          </div>
          <div class="service-parent" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
            <service-plugin
              :list="newConfiguration.filter((service) => service.category === 'service').sort(sortByName)"
              @select-item="selectedServiceToRemove"
              @modify-item="selectedServiceToModify"
            >
            </service-plugin>
          </div>
        </div>
        <div class="change-menu" onmousedown="return false">
          <change-confirm></change-confirm>
        </div>
        <div class="sidebar">
          <sidebar-manage :start-drag="startDrag" @add-service="addNewService"> </sidebar-manage>
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
import ReplacePanel from "../components/UI/node-manage/ReplacePanel.vue";
import SwitchNetwork from "../components/UI/node-manage/SwitchNetwork.vue";
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import TaskManager from "../components/UI/task-manager/TaskManager.vue";
import { useNodeManage } from "../store/nodeManage";
import { toRaw } from "vue";

export default {
  components: {
    SidebarManage,
    NodeConfiguration,
    ChangeConfirm,
    DropZone,
    BaseModal,
    TaskManager,
    AddPanel,
    ModifyPanel,
    ReplacePanel,
    SwitchNetwork,
  },
  emits: ["startDrag", "closeMe", "modalView"],

  data() {
    return {
      dragging: false,
      isModalActive: false,
      modalItems: [],
      displayCustomAddPanel: false,
      displayCustomModifyPanel: false,
      displayReplacePanel: false,
      itemToInstall: {},
      itemToModify: {},
      itemToReplace: {},
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
    }),
    ...mapWritableState(useNodeManage, {
      newConfiguration: "newConfiguration",
      actionContents: "actionContents",
      selectedItemToRemove: "selectedItemToRemove",
      confirmChanges: "confirmChanges",
      currentNetwork: "currentNetwork",
      configNetwork: "configNetwork",
    }),
  },
  mounted() {
    this.confirmChanges = [];
    this.configNetwork = this.currentNetwork;
  },
  methods: {
    sortByName(a, b) {
      if (a.service.toLowerCase() < b.service.toLowerCase()) {
        return -1;
      }
      if (a.service.toLowerCase() > b.service.toLowerCase()) {
        return 1;
      }
      return 0;
    },
    getActions(action, service, data) {
      let item = this.actionContents.find((item) => item.content === action);
      if (item) return { ...item, service: toRaw(service), data: data };
      return undefined;
    },
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
      }
    },
    onDrop(event) {
      const allServices = JSON.parse(JSON.stringify(this.allServices));
      const itemId = event.dataTransfer.getData("itemId");
      let item = allServices.find((item) => item.id == itemId);
      if (item.category === "service" && this.newConfiguration.map((s) => s.service).includes(item.service)) {
        return;
      } else {
        if (this.itemToInstall.addPanel === true) {
          this.cancelAddProcess();
        }
        item.id = this.newConfiguration.length;
        this.newConfiguration.push(item);
        item.addPanel = true;
        this.itemToInstall = item;
        this.displayCustomAddPanel = item.modifierPanel;
      }
    },
    addNewService(i) {
      let item = JSON.parse(JSON.stringify(i));
      if (item.category === "service" && this.newConfiguration.map((s) => s.servce).includes(item.service)) {
        return;
      } else {
        if (this.itemToInstall.addPanel === true) {
          this.cancelAddProcess();
        }
        item.id = this.newConfiguration.length;
        this.newConfiguration.push(item);
        item.addPanel = true;
        this.itemToInstall = item;
        this.displayCustomAddPanel = item.modifierPanel;
      }
    },

    saveAddedServiceConfig(data) {
      this.confirmChanges.push(JSON.parse(JSON.stringify(this.getActions("INSTALL", this.itemToInstall, data))));
      this.itemToInstall = {};
      this.itemToInstall.addPanel = false;
    },
    selectedServiceToRemove(item) {
      if (item.active) {
        this.selectedItemToRemove = this.selectedItemToRemove.concat(
          this.newConfiguration.filter((el) => el.config.serviceID === item.config.serviceID)
        );
      } else {
        if (!item.config.serviceID) {
          this.newConfiguration = this.newConfiguration.filter((el) => el.id !== item.id);
          this.confirmChanges = this.confirmChanges.filter((el) => el.service.id !== item.id);
        }
        this.selectedItemToRemove = this.selectedItemToRemove.filter(
          (el) => el.config.serviceID !== item.config.serviceID
        );
      }
    },
    cancelAddProcess() {
      this.itemToInstall.addPanel = false;
      this.itemToInstall = {};
      this.newConfiguration.pop();
    },
    selectedServiceToModify(item) {
      if (item.config.serviceID) {
        this.itemToModify = item;
        if (item.name === "Nimbus" || item.name === "Teku") {
          let servicePair = this.newConfiguration.filter((s) => s.config.serviceID === item.config.serviceID);
          if(servicePair.length > 1)
            this.itemToModify = servicePair.find((s) => s.service.includes("Beacon"));
        }
      }
    },
    cancelModifyProcess() {
      this.newConfiguration.forEach((s) => (s.modifierPanel = false));
      this.itemToModify = {};
    },
    saveServiceModification(data) {
      this.confirmChanges.push(JSON.parse(JSON.stringify(this.getActions("MODIFY", this.itemToModify, data))));
      this.cancelModifyProcess();
    },
    replacePlugin(item) {
      if (item.modifierPanel) {
        item.modifierPanel = false;
      }
      this.itemToReplace = item;
      item.replacePanel = true;
    },
    cancelReplaceProcess() {
      this.itemToReplace.replacePanel = false;
      this.itemToReplace = {};
    },
    confirmReplaceProcess() {
      this.itemToReplace.replacePanel = false;
      this.itemToReplace = {};
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
  border: 5px solid #979797;
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

.drop-parent {
  width: 100%;
  height: 95%;
  grid-column: 2;
  grid-row: 1/5;
  background: #33393e;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: relative;
}

.modal-parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.modal-bg {
  width: 100%;
  height: 100%;
}

.service {
  width: 100%;
  height: 95%;
  grid-column: 3;
  grid-row: 1/5;
  background: #33393e;
  color: rgb(201, 201, 201);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  border: 2px solid #242529b4;
}

.service-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
}

.title {
  width: max-content;
  min-width: 110px;
  height: 6%;
  padding: 0 20px;
  background-color: #264744;
  border-radius: 15px;
  margin: 10px auto;
  font-weight: 700;
  font-size: 0.7rem;
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
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

.change-menu {
  width: 100%;
  height: 95%;
  grid-row: 1/5;
  grid-column: 4;
  background: #33393e;
  border: 2px solid #242529b4;
  border-left: none;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
