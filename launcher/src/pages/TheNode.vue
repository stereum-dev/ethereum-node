<template>
  <section id="parent">
    <node-header id="head" onmousedown="return false"></node-header>
    <node-bg>
      <div class="node-parent">
        <menu-side onmousedown="return false"></menu-side>
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
import JournalNode from "../components/UI/the-node/JournalNode.vue";
import DropZone from "../components/UI/node-manage/DropZone.vue";
import BaseModal from "../components/UI/node-manage/BaseModal.vue";
import NodeSidebar from "../components/UI/NodeSidebarParent.vue";
export default {
  components: {
    JournalNode,
    DropZone,
    BaseModal,
    NodeSidebar,
  },
  emits: ["startDrag", "closeMe", "modalView"],

  data() {
    return {
      isModalActive: false,
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
  width: 99.2vw;
  height: 91.5vh;
  grid-template-columns: 19% 45% 20% 16%;
  grid-template-rows: repeat(3, 32%) 4%;
  grid-row-gap: 1px;
  position: absolute;
  top: 1px;
}

.journal-box {
  color: white;
  height: 98.4%;
  grid-column: 1;
  grid-row: 1/4;
  background-color: transparent;
  border: 4px solid rgb(121, 121, 121);
}
.trapezoid-parent {
  grid-column: 2;
  grid-row: 1/4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.modal-parent {
  width: 44.5vw;
  height: 88.2vh;
  display: flex;
  grid-column: 2;
  grid-row: 1/4;
  position: absolute;
  z-index: 1;
}
.modal-bg{
  height: 88.2vh;
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
  border: 4px solid rgb(121, 121, 121);
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
  height: 5%;
  background: #3e4d41;
  margin-top: 1rem;
  font-weight: bold;
  padding: 0.5px;
  text-align: center;
  font-size: 1rem;
}
.trap-container {
  width: 97%;
  background: #2c4030;
  margin: 0 auto;
  border: 4px solid rgb(121, 121, 121);
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
  width: 99.1vw;
  color: white;
  grid-column: 1/5;
  grid-row: 4;
  background-color: rgb(40, 40, 40);
  border-radius: 0 0 1.9rem 1.9rem;
  position: relative;
}
</style>
