<template>
  <div class="panel-parent">
    <panel-modal
      @close-modal="closeModalHandler"
      :class="{ modalActive: isModalActive }"
      v-if="isModalActive"
      :item="modalItem"
    >
    </panel-modal>
    <div class="panel-content">
      <div class="level-box">
        <div
          class="general-box"
          @click="generalActive"
          :class="{ active: generalBtn }"
        >
          <span>GENERAL</span>
        </div>
        <div
          class="expert-box"
          @click="expertActive"
          :class="{ active: expertBtn }"
        >
          <span>EXPERT</span>
        </div>
      </div>
      <div class="description-box">
        <div class="general-description-box" v-if="isGeneralActive">
          <div
            class="general-items"
            v-for="item in controlPanelGeneralItems"
            :key="item.id"
            @click="openModalHandler(item)"
          >
            <div class="general-title">
              <span>{{ item.title }}</span>
            </div>
            <div class="general-description">
              <p>{{ item.summary }}</p>
            </div>
          </div>
        </div>
        <div class="expert-description-box" v-else>
          <div
            class="expert-items"
            v-for="item in controlPanelExpertItems"
            :key="item.id"
            @click="openModalHandler(item)"
          >
            <div class="expert-title">
              <span>{{ item.title }}</span>
            </div>
            <div class="expert-description">
              <p>{{ item.summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import panelModal from "./panelModal";
export default {
  components: { panelModal },
  emits: ["close-modal"],
  data() {
    return {
      generalBtn: false,
      expertBtn: false,
      isGeneralActive: false,
      isExpertActive: false,
      isModalActive: false,
      controlPanelGeneralItems: [
        {
          id: 1,
          title: "PRUNNING",
          summary:
            "Initiates the prunning of your execution client to free up storage",
          description:
            "Geth as execution client collects massive amounts of data that can be deleted after a while. Run this to free up some storage space",
        },
        {
          id: 2,
          title: "OS UPDATES",
          summary: "Updates your OS to the newest available version",
          description:
            "Operating System updates might repair security holes, can add new features to your devices and remove outdated ones. Keep your device turned on!",
        },
        {
          id: 3,
          title: "CONFIG EXPORT",
          summary: "Export your configuration to import it on a new device",
          description:
            'Currently running "Configuration" will be exported and stored in "/tmp/exported-config" directory. It could be then used to setup on other/new device.',
        },
        {
          id: 4,
          title: "RESTART HOST",
          summary: "Restarts the host of your node",
          description:
            "Sometimes there are things getting stuck or not responding anymore, a restart might help you resolve some issues (but not all). This will take a couple of minutes.",
        },
      ],
      controlPanelExpertItems: [
        {
          id: 1,
          title: "API BINDING",
          summary: "Configure an IP you can access from the outside",
          description:
            "If you want to use your beacon client(s) or monitoring to be accessible outside of your server, configure on which IP the services should listen on.",
        },
      ],
      modalItem: undefined,
    };
  },
  methods: {
    generalActive() {
      this.isGeneralActive = true;
      this.generalBtn = true;
      this.isExpertActive = false;
      this.expertBtn = false;
    },
    expertActive() {
      this.isExpertActive = true;
      this.expertBtn = true;
      this.isGeneralActive = false;
      this.generalBtn = false;
    },
    openModalHandler(item) {
      this.isModalActive = true;
      this.modalItem = item;
    },
    closeModalHandler() {
      this.isModalActive = false;
    },
  },
};
</script>
<style scoped>
.panel-parent {
  width: 98%;
  height: 91%;
  border: 5px solid rgb(55, 55, 55);
  border-radius: 20px;
  background-color: #464a44;
}
.modalActive {
  display: inline-block;
}
.panel-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.level-box {
  width: 18%;
  height: 90%;
  background-color: #537263;
  border-radius: 13px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.expert-box {
  width: 80%;
  height: 16%;
  border: 1px solid rgb(96, 96, 96);
  background-color: #0f3c3f;
  border-radius: 20px;
  margin-top: 5px;
  cursor: pointer;
  box-shadow: 1px 1px 3px 1px rgb(28, 28, 28);
}
.active {
  box-shadow: none !important;
  background-color: #10383a !important;
  border: 1px solid #041313 !important;
}
.general-box {
  width: 80%;
  height: 16%;
  border: 1px solid rgb(96, 96, 96);
  background-color: #0f3c3f;
  border-radius: 20px;
  margin-top: 5px;
  cursor: pointer;
  box-shadow: 1px 1px 3px 1px rgb(28, 28, 28);
}

.general-box span {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgb(239, 235, 235);
}

.expert-box span {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgb(244, 57, 57);
}
.description-box {
  width: 80%;
  height: 100%;
  min-height: 168px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.expert-description-box,
.general-description-box {
  width: 95%;
  height: 90%;
  background-color: #686a6c;
  border-radius: 15px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
}
.expert-items,
.general-items {
  width: 85%;
  height: 60%;
  background-color: #e8e8e8;
  border: 2px solid #233f3f;
  border-radius: 15px;
  justify-self: center;
  align-self: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 1px 3px 1px #4b4b4b, inset 0 1px 5px 1px #bfbfbf;
  overflow: hidden;
}

.expert-title,
.general-title {
  width: 90%;
  height: 20%;
}
.expert-title span {
  font-size: 0.6rem;
  font-weight: 800;
  color: rgb(240, 20, 20);
}
.general-title span {
  font-size: 0.6rem;
  font-weight: 800;
  color: rgb(82, 82, 82);
}
.expert-description,
.general-description {
  width: 90%;
  height: 80%;
}
.expert-description p,
.general-description p {
  font-size: .55rem;
  font-weight: 900;
  text-align: center;
  color: #2b6262;
}
</style>
