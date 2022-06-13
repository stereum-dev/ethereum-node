<template>
  <div class="router-view">
    <node-header id="head" onmousedown="return false"></node-header>
    <node-bg>
      <div class="node-parent">
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
              :list="executionItems"
              @modal-view="showModal"
            ></drop-zone>
          </div>
          <div>
            <drop-zone
              @modal-view="showModal"
              :title="'consensus'"
              :list="consensusItems"
            ></drop-zone>
          </div>
          <div>
            <drop-zone
              @modal-view="showModal"
              :title="'validator'"
              :list="validatorItems"
            ></drop-zone>
          </div>
        </div>
        <div class="service" onmousedown="return false">
          <div class="title">SERVICE PLUGIN</div>
          <div class="service-parent">
            <service-plugin :list="servicePlugins"> </service-plugin>
          </div>
        </div>
        <div class="node-side" onmousedown="return false">
          <node-sidebar></node-sidebar>
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
import { mapState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useNodeStore } from "@/store/theNode";
export default {
  components: {
    JournalNode,
    DropZone,
    BaseModal,
    NodeSidebar,
    TaskManager,
  },
  emits: ["startDrag", "closeMe", "modalView"],

  data() {
    return {
      isModalActive: false,
    };
  },
  computed: {
    ...mapState(useClickInstall, {
      selectedPreset: "selectedPreset",
    }),
    ...mapState(useNodeStore, {
      consensusItems: "consensusItems",
      executionItems: "executionItems",
      validatorItems: "validatorItems",
      servicePlugins: "servicePlugins",
    }),
  },
  mounted() {
    if (Object.keys(this.selectedPreset).length !== 0) {
      this.selectedPreset.includedPlugins.map((item) => {
        if (item.category === "validator") {
          if (this.validatorItems.some((plugin) => plugin.id == item.id)) {
            return;
          }
          this.validatorItems.push(item);
        } else if (item.category === "consensus") {
          if (this.consensusItems.some((plugin) => plugin.id == item.id)) {
            return;
          }
          this.consensusItems.push(item);
        } else if (item.category === "execution") {
          if (this.executionItems.some((plugin) => plugin.id == item.id)) {
            return;
          }
          this.executionItems.push(item);
        } else if (item.category === "service") {
          if (this.servicePlugins.some((plugin) => plugin.id == item.id)) {
            return;
          }
          this.servicePlugins.push(item);
        }
      });
      this.selectedPreset = [];
    }
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
  width: 45.5%;
  height: 85.6%;
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
  font-weight: 800;
  font-size: 0.9rem;
  box-shadow: 1px 1px 3px rgb(26, 26, 26);
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
