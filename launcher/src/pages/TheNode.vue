<template>
  <div class="router-view">
    <node-header id="head" onmousedown="return false"></node-header>
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
        <div class="journal-box" onmousedown="return false">
          <journal-node></journal-node>
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
              :title="'execution'"
              :list="
                installedServices.filter(
                  (service) => service.category === 'execution'
                )
              "
              @modal-view="showModal"
            ></drop-zone>
          </div>
          <div>
            <drop-zone
              @modal-view="showModal"
              :title="'consensus'"
              :list="
                installedServices.filter(
                  (service) => service.category === 'consensus'
                )
              "
            ></drop-zone>
          </div>
          <div>
            <drop-zone
              @modal-view="showModal"
              :title="'validator'"
              :list="
                installedServices.filter(
                  (service) => service.category === 'validator'
                )
              "
            ></drop-zone>
          </div>
        </div>
        <div class="service" onmousedown="return false">
          <div class="title">SERVICE PLUGIN</div>
          <div class="service-parent">
            <service-plugin
              :list="
                installedServices.filter(
                  (service) => service.category === 'service'
                )
              "
            >
            </service-plugin>
          </div>
        </div>
        <div class="node-side" onmousedown="return false">
          <node-sidebar @show-modal="showFirstStepModal"></node-sidebar>
        </div>
        <div class="footer" onmousedown="return false">
          <div class="footer-content"></div>
        </div>
        <task-manager></task-manager>
      </div>
    </node-bg>
  </div>
</template>

<script>
import JournalNode from "../components/UI/the-node/JournalNode.vue";
import DropZone from "../components/UI/node-manage/DropZone.vue";
import BaseModal from "../components/UI/node-manage/BaseModal.vue";
import NodeSidebar from "../components/UI/the-node/NodeSidebarParent.vue";
import TaskManager from "../components/UI/task-manager/TaskManager.vue";
import { mapWritableState } from "pinia";

import { useServices } from "../store/services";
import { useNodeStore } from "@/store/theNode";
import { useTutorialStore } from "@/store/tutorialSteps";
import TheVideos from "../components/UI/tutorial-steps/TheVideos.vue";
import TutorialModal from "../components/UI/tutorial-steps/TutorialModal.vue";

export default {
  components: {
    JournalNode,
    DropZone,
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
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapWritableState(useNodeStore, {
      configData: "configData_nodeSidebarVideo",
    }),
    ...mapWritableState(useTutorialStore, {
      steps: "steps",
    }),
  },
  mounted() {},
  methods: {
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
  border: 4px solid #979797;
  border-radius: 0 35px 10px 10px;
  grid-template-columns: 18% 46% 20% 16%;
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
  margin-top: 1px;
  background-color: #606060;
  border-radius: 0 25px 25px 10px;
}
.trapezoid-parent {
  width: 100%;
  height: 100%;
  margin-top: 1px;
  grid-column: 2;
  grid-row: 1/4;
  background-color: #000000;
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
  width: 99%;
  height: 100%;
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
  width: 100%;
  height: 100%;
  margin: 0 auto;
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
}
.node-side {
  grid-column: 4;
  grid-row: 1/4;
  height: 99.8%;
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
</style>
