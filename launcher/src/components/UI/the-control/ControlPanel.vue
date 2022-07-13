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
        <control-panel-btn
          @open-cont="generalActive"
          :class="{ active: generalBtn }"
          name="SERVER"
        ></control-panel-btn>
        <control-panel-btn
          @open-cont="expertActive"
          :class="{ active: generalBtn }"
          name="NODE"
        ></control-panel-btn>
        <control-panel-btn
          @open-cont="connectActive"
          :class="{ active: generalBtn }"
          name="EXC. CLIENT"
          is-color="1"
        ></control-panel-btn>
        <control-panel-btn
          @open-cont="expertActive"
          :class="{ active: generalBtn }"
          name="CON. CLIENT"
          is-color="1"
        ></control-panel-btn>
      </div>
      <div class="description-box">
        <div class="general-description-box" v-if="isGeneralActive">
          <div class="contin">
            <control-panel-item
              v-for="item in controlPanelGeneralItems"
              :key="item.id"
              @open-item="openModalHandler(item)"
              :title="item.title"
              :summary="item.summary"
            ></control-panel-item>
          </div>
        </div>
        <div class="expert-description-box" v-else-if="isExpertActive">
          <div class="contin">
            <control-panel-item
              v-for="item in controlPanelExpertItems"
              :key="item.id"
              @open-item="openModalHandler(item)"
              :title="item.title"
              :summary="item.summary"
              is-color="1"
            ></control-panel-item>
          </div>
        </div>
        <div class="connect-description-box" v-else>
          <div class="contin">
            <control-panel-item
              v-for="item in controlPanelConnectItems"
              :key="item.id"
              @open-item="openModalHandler(item)"
              :title="item.title"
              :summary="item.summary"
              :is-color="item.isColor"
            ></control-panel-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import panelModal from "./panelModal";
import ControlPanelBtn from "./ControlPanelBtn.vue";
import ControlPanelItem from "./ControlPanelItem.vue";
export default {
  components: { panelModal, ControlPanelBtn, ControlPanelItem },
  emits: ["close-modal"],
  data() {
    return {
      generalBtn: false,
      expertBtn: false,
      connectBtn: false,
      isGeneralActive: false,
      isExpertActive: false,
      isConnectActive: false,
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
      controlPanelConnectItems: [
        {
          id: 1,
          title: "RPC - ENDPOINT",
          summary: "Configure an IP you can access from the outside",
          description:
            "If you want to use your beacon client(s) or monitoring to be accessible outside of your server, configure on which IP the services should listen on.",
          isColor: "1",
        },
        {
          id: 2,
          title: "PRUNNING",
          summary: "Configure an IP you can access from the outside",
          description:
            "Your execution client collects massive amounts of data that can be deleted after a while. Run this to free up some storage space.",
          isColor: "2",
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
      this.isConnectActive = false;
      this.connectBtn = false;
    },
    expertActive() {
      this.isExpertActive = true;
      this.expertBtn = true;
      this.isGeneralActive = false;
      this.generalBtn = false;
      this.isConnectActive = false;
      this.connectBtn = false;
    },
    connectActive() {
      this.isExpertActive = false;
      this.expertBtn = false;
      this.isGeneralActive = false;
      this.generalBtn = false;
      this.isConnectActive = true;
      this.connectBtn = true;
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
  width: 100%;
  height: 97%;
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
  width: 19%;
  height: 90%;
  background-color: #537263;
  border-radius: 10px;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}


.description-box {
  width: 80%;
  height: 99%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.connect-description-box,
.expert-description-box,
.general-description-box {
  width: 97%;
  height: 90%;
  background-color: #686a6c;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.contin {
  display: flex;
  width: 90%;
  height: 95%;
  justify-content: space-between;
  align-items: center;
}
</style>
