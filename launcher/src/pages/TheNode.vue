<template>
  <div class="router-view">
    <node-header id="head" @mousedown.prevent></node-header>
    <node-bg>
      <div class="node-parent">
        <div class="play-box" v-if="playFirstVideo">
          <div class="close-video" @click="hideVideoDisplay">
            <span>Close</span>
          </div>
          <the-videos></the-videos>
        </div>
        <tutorial-modal
          @hide-modal="hideFirstStepModal"
          @show-item="displaySingleModal(steps)"
          v-if="isTutorialModalActive"
        ></tutorial-modal>
        <div class="journal-box" @mousedown.prevent>
          <journal-node></journal-node>
        </div>
        <div class="trapezoid-parent">
          <div class="switch-network">
            <div class="switch-network__content">
              <div class="current">
                <div class="networkIcon">
                  <img :src="currentNetwork.icon ? currentNetwork.icon : loadingGIF" alt="icon" />
                </div>
                <div class="networkSelect">
                  <span>{{ currentNetwork.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-parent" v-if="isModalActive">
            <base-modal
              :modalItems="modalItems"
              @close-me="closeModal"
            ></base-modal>
          </div>
          <div>
            <plugin-zone
              :title="'execution'"
              :list="
                installedServices.filter(
                  (service) => service.category === 'execution'
                )
              "
              @modal-view="showModal"
            ></plugin-zone>
          </div>
          <div>
            <plugin-zone
              @modal-view="showModal"
              :title="'consensus'"
              :list="
                installedServices.filter(
                  (service) => service.category === 'consensus'
                )
              "
            ></plugin-zone>
          </div>
          <div>
            <plugin-zone
              @modal-view="showModal"
              :title="'validator'"
              :list="
                installedServices.filter(
                  (service) => service.category === 'validator'
                )
              "
            ></plugin-zone>
          </div>
        </div>
        <div class="service">
          <div class="title">SERVICE PLUGIN</div>
          <div class="service-parent">
            <node-service
              :list="
                installedServices.filter(
                  (service) => service.category === 'service'
                )
              "
            >
            </node-service>
          </div>
        </div>
        <div class="node-side">
          <node-sidebar @show-modal="showFirstStepModal"></node-sidebar>
        </div>
        <div class="footer">
          <div class="footer-content"></div>
        </div>
        <task-manager></task-manager>
      </div>
    </node-bg>
  </div>
</template>

<script>
import JournalNode from "../components/UI/the-node/JournalNode.vue";
import PluginZone from "../components/UI/the-node/PluginZone.vue";
import BaseModal from "../components/UI/node-manage/BaseModal.vue";
import NodeSidebar from "../components/UI/the-node/NodeSidebarParent.vue";
import TaskManager from "../components/UI/task-manager/TaskManager.vue";
import { mapWritableState } from "pinia";
import ControlService from "@/store/ControlService";
import { useServices } from "../store/services";
import { useNodeStore } from "@/store/theNode";
import { useNodeManage } from "@/store/nodeManage";
import { useTutorialStore } from "@/store/tutorialSteps";
import { useControlStore } from "../store/theControl";
import TheVideos from "../components/UI/tutorial-steps/TheVideos.vue";
import TutorialModal from "../components/UI/tutorial-steps/TutorialModal.vue";

export default {
  components: {
    JournalNode,
    PluginZone,
    BaseModal,
    NodeSidebar,
    TaskManager,
    TheVideos,
    TutorialModal,
  },
  emits: ["startDrag", "closeMe", "modalView"],

  data() {
    return {
      isModalActive: false,
      isTutorialModalActive: false,
      playFirstVideo: false,
      loadingGIF: "/img/icon/task-manager-icons/turning_circle_blue.gif",
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
    }),
    ...mapWritableState(useNodeStore, {
      configData: "configData_nodeSidebarVideo",
    }),
    ...mapWritableState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useTutorialStore, {
      steps: "steps",
    }),
    ...mapWritableState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
    }),
  },
  mounted() {
    this.updateConnectionStats();
  },
  methods: {
    async updateConnectionStats() {
      const stats = await ControlService.getConnectionStats();
      this.ServerName = stats.ServerName;
      this.ipAddress = stats.ipAddress;
    },
    showModal(data) {
      this.isModalActive = true;
      this.modalItems = data;
    },
    closeModal() {
      this.isModalActive = false;
    },
    showFirstStepModal() {
      this.isTutorialModalActive = true;
    },
    hideFirstStepModal() {
      this.isTutorialModalActive = false;
    },
    displaySingleModal(el) {
      this.steps.filter((item) => {
        item.displayModal = false;
        item?.id === el.id;
      });
      this.playFirstVideo = true;
      this.isTutorialModalActive = false;
      el.displayModal = true;
    },
    hideVideoDisplay() {
      this.playFirstVideo = false;
      this.isTutorialModalActive = false;
    },
  },
};
</script>

<style scoped>
#head {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 49;
}
.node-parent {
  display: grid;
  width: 100%;
  height: 91%;
  border: 5px solid #979797;
  border-radius: 0 35px 10px 10px;
  grid-template-columns: 20% 45% 20% 15%;
  grid-template-rows: 32% 32% 31% 5%;
  grid-row-gap: 1px;
  background-color: rgb(0, 0, 0);
  z-index: 1;
  position: relative;
}
.play-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000d9;
  border-radius: 0 35px 5px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 301;
}
.play-box .close-video {
  width: 70px;
  height: 30px;
  border: 2px solid rgb(183, 48, 48);
  border-radius: 5px;
  background-color: rgb(183, 48, 48);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 302;
  cursor: pointer;
  position: fixed;
  bottom: 15px;
  right: 45%;
}
.close-video span {
  font-size: 1rem;
  font-weight: 600;
  color: #eee;
}
.close-video:hover {
  border: 2px solid #b73030;
  background-color: rgb(218, 218, 218);
}
.close-video:hover span {
  color: #b73030;
}
.close-video:active {
  border: 2px solid rgb(183, 48, 48);
  background-color: rgb(151, 36, 36);
}
.close-video:active span {
  color: #eee;
}
.journal-box {
  width: 100%;
  height: 100%;
  color: rgb(219, 219, 219);
  grid-column: 1;
  grid-row: 1/4;
  border-right: 2px solid #242529b4;
  background: #3a3d40;
}
.trapezoid-parent {
  width: 100%;
  height: 95%;
  grid-column: 2;
  grid-row: 1/5;
  background: #3a3d40;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.modal-parent {
  width: 56.2%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  grid-column: 2;
  grid-row: 1/4;
  position: absolute;
  z-index: 1;
}
.modal-bg {
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
  border-left: 2px solid #24252994;
  border-right: 2px solid #242529b4;
  border: 2px solid #242529b4;
  box-sizing: border-box;
}
.service-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
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

.trap-container {
  width: 98%;
  margin: 0 auto;
  background: #3a3d40;
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
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
.node-side {
  grid-column: 4/5;
  grid-row: 1/5;
  width: 100%;
  height: 95%;
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
.node-task-manager {
  position: fixed;
  left: 4px;
  bottom: -1px;
}
.switch-network {
  width: 95%;
  height: 10%;
  margin: 0 auto;
  padding: 5px 1px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #3a3d40;
  box-sizing: border-box;
}
.switch-network__content {
  width: 98%;
  height: 95%;
  padding: 2px;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background-color: #242529;
  transition-duration: 0.3s;
}
.current {
  width: 98%;
  height: 98%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: 1fr;
}
.current .networkIcon {
  grid-column: 1/2;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  margin-left: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.current .networkIcon img {
  width: 73%;
}
.current .networkSelect {
  grid-column: 4/7;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-left: 27%;
}
.current .networkSelect span {
  font-size: 1.1rem;
  font-weight: 700;
  color: #408886;
  text-transform: uppercase;
}
</style>
