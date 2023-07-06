<template>
  <div class="router-view">
    <node-header id="head" @mousedown.prevent></node-header>
    <node-bg>
      <div class="node-parent">
        <div v-if="playYoutubeVideo" class="play-box">
          <div class="close-video" @click="hideVideoDisplay">
            <span>Close</span>
          </div>
          <the-videos :video-url="chosenVideo"></the-videos>
        </div>

        <div class="journal-box" @mousedown.prevent>
          <JournalNode />
        </div>
        <div class="trapezoid-parent">
          <div class="switch-network">
            <div class="switch-network__content">
              <div class="current">
                <div class="networkIcon">
                  <img :src="currentNetwork?.icon ? currentNetwork.icon : loadingGIF" alt="icon" />
                </div>
                <div class="networkSelect">
                  <span>{{ currentNetwork?.name ? currentNetwork.name : "" }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isModalActive" class="modal-parent">
            <base-modal :modal-items="modalItems" @close-me="closeModal"></base-modal>
          </div>
          <div>
            <plugin-zone
              :title="$t('theNode.execution')"
              :list="installedServices.filter((service) => service.category === 'execution').sort(sortByName)"
              @modal-view="showModal"
            ></plugin-zone>
          </div>
          <div>
            <plugin-zone
              :title="$t('theNode.consensus')"
              :list="installedServices.filter((service) => service.category === 'consensus').sort(sortByName)"
              @modal-view="showModal"
            ></plugin-zone>
          </div>
          <div>
            <plugin-zone
              :title="$t('theNode.validator')"
              :list="installedServices.filter((service) => service.category === 'validator').sort(sortByName)"
              @modal-view="showModal"
            ></plugin-zone>
          </div>
        </div>
        <div class="service">
          <div class="title">{{ $t("theNode.servicePlugin") }}</div>
          <div class="service-parent">
            <node-service
              :list="installedServices.filter((service) => service.category === 'service').sort(sortByName)"
            >
            </node-service>
          </div>
        </div>
        <div class="node-side">
          <div class="sidebar-container">
            <NodeAlert v-if="infoAlarm" />
            <div class="info-button" @click="infoAlarm = !infoAlarm">
              <img src="/img/icon/round-icon.png" alt="information" />
            </div>
            <NodeTutorial v-if="!infoAlarm" @show-modal="openTutorialModalHandler" />
          </div>
        </div>
      </div> </node-bg
    ><task-manager></task-manager><TheFooter class="footer" />
  </div>
</template>

<script>
import JournalNode from "../components/UI/the-node/JournalNode.vue";
import PluginZone from "../components/UI/the-node/PluginZone.vue";
import BaseModal from "../components/UI/node-manage/BaseModal.vue";
import TaskManager from "../components/UI/task-manager/TaskManager.vue";
import { mapWritableState } from "pinia";
import ControlService from "@/store/ControlService";
import { useServices } from "../store/services";
import { useNodeStore } from "@/store/theNode";
import { useNodeManage } from "@/store/nodeManage";
import { useTutorialStore } from "@/store/tutorialSteps";
import { useControlStore } from "../store/theControl";
import TheVideos from "../components/UI/tutorial-steps/TheVideos.vue";
import NodeAlert from "../components/UI/the-node/NodeAlert.vue";
import NodeTutorial from "../components/UI/the-node/NodeTutorial.vue";
import { useNodeHeader } from "../store/nodeHeader";
import TheFooter from "../components/layers/TheFooter.vue";

export default {
  components: {
    JournalNode,
    PluginZone,
    BaseModal,
    TaskManager,
    TheVideos,
    NodeAlert,
    NodeTutorial,
    TheFooter,
  },
  emits: ["startDrag", "closeMe", "modalView"],

  data() {
    return {
      isModalActive: false,
      isTutorialModalActive: false,
      loadingGIF: "/img/icon/task-manager-icons/turning_circle_blue.gif",
      itemToTutorial: [],
      serverVitals: {},
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
    }),

    ...mapWritableState(useNodeStore, {
      configData: "configData_nodeSidebarVideo",
      serviceLogs: "serviceLogs",
      infoAlarm: "infoAlarm",
    }),
    ...mapWritableState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useTutorialStore, {
      playYoutubeVideo: "playYoutubeVideo",
      chosenVideo: "chosenVideo",
    }),
    ...mapWritableState(useControlStore, {
      ServerName: "ServerName",
      ipAddress: "ipAddress",
      cpu: "cpu",
      availDisk: "availDisk",
      usedPerc: "usedPerc",
    }),
    ...mapWritableState(useNodeHeader, {
      refresh: "refresh",
    }),
  },
  mounted() {
    this.updateConnectionStats();
    this.updateServiceLogs();
    this.polling = setInterval(this.updateServiceLogs, 10000); // refresh logs
    this.pollingVitals = setInterval(this.updateServerVitals, 1000); // refresh server vitals
  },
  beforeUnmount() {
    clearInterval(this.polling);
    clearInterval(this.pollingVitals);
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
    async updateConnectionStats() {
      const stats = await ControlService.getConnectionStats();
      this.ServerName = stats.ServerName;
      this.ipAddress = stats.ipAddress;
    },
    async updateServiceLogs() {
      if (this.installedServices && this.installedServices.length > 0 && this.refresh) {
        const data = await ControlService.getServiceLogs();
        this.serviceLogs = data;
      }
    },
    async updateServerVitals() {
      if (this.installedServices && this.installedServices.length > 0 && this.refresh) {
        const data = await ControlService.getServerVitals();
        this.serverVitals = data;
        this.cpu = this.serverVitals.cpu;
        this.availDisk = this.serverVitals.availDisk;
        this.usedPerc = this.serverVitals.usedPerc;
      }
    },
    showModal(data) {
      this.isModalActive = true;
      this.modalItems = data;
    },
    closeModal() {
      this.isModalActive = false;
    },

    openTutorialModalHandler(data) {
      this.isTutorialModalActive = true;
      data.displayModal = true;
      this.itemToTutorial = data;
    },
    closeTutorialModalHandler() {
      this.isTutorialModalActive = false;
    },
    hideVideoDisplay() {
      this.isTutorialModalActive = false;
      this.playYoutubeVideo = false;
    },
  },
};
</script>

<style scoped>
.footer {
  z-index: 1;
}
.info-button {
  width: 90%;
  height: 8%;
  background: #264744;
  border-radius: 20px;
  box-shadow: 0 1px 3px 0px #1c1f22;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 4% 0;
}
.info-button:hover {
  background: rgb(43, 84, 81);
}
.info-button:active {
  background: rgba(43, 84, 81, 0.5);
}
.info-button img {
  max-width: 19%;
}
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
  background: #33393e;
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.sidebar-container {
  width: 100%;
  height: 100%;
  background: #33393e;
  border: 2px solid #242529b4;
  border-top-right-radius: 30px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  border-left: none;
  padding: 1% 0;
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
  background: #494e53;
  box-sizing: border-box;
  border: 1px solid #464646;
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
  grid-column: 2/7;
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
  font-size: 95%;
  font-weight: 700;
  color: #408886;
  text-transform: uppercase;
}
</style>
