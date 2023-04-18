<template>
  <div class="tutorial-box">
    <!-- <div class="tutorial-table">
      <div
        v-for="(item, index) in configData"
        :key="index"
        class="table-row"
        :class="{ disabled: !item.display }"
        @click="$emit('showModal', item)"
      >
        <div class="question-icon">
          <img src="../../../../public/img/icon/manage-node-icons/QuestionMark.png" alt="question-icon" />
        </div>
        <div class="row-content">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="round-icon">
      <img src="/img/icon/round-icon.png" alt="round-icon" />
    </div> -->
    <TutorialButtons />
    <div class="back-button" @click="infoAlarm = !infoAlarm"><div class="up-arrow"></div></div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
import { useTutorialStore } from "@/store/tutorialSteps";
import { mapState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import TutorialButtons from "./TutorialButtons.vue";

export default {
  components: { TutorialButtons },
  data() {
    return {
      configData: [
        {
          id: 2,
          // name: this.$t("nodeSidebarVideo.stake"),
          name: "",
          videosLink: "",
          writtenLink: "",
          guideLink: "",
          display: true,
        },
        {
          id: 3,
          name: this.$t("nodeSidebarVideo.ssv"),
          videosLink: "https://www.youtube.com/embed/ccKoalZtjlA",
          writtenLink: "https://stereum.net/ssv-network-node-operator-guide/",
          guideLink: "",
          display: true,
        },

        {
          id: 4,
          name: this.$t("nodeSidebarVideo.alert"),
          videosLink: "",
          writtenLink: "",
          guideLink: "",
          display: false,
        },
        {
          id: 5,
          name: this.$t("nodeSidebarVideo.switchC"),
          videosLink: "",
          writtenLink: "",
          guideLink: "",
          display: false,
        },
        {
          id: 6,
          name: this.$t("nodeSidebarVideo.migrate"),
          videosLink: "",
          writtenLink: "",
          guideLink: "",
          display: false,
        },
        {
          id: 1,
          name: this.$t("nodeSidebarVideo.rpc"),
          videosLink: "https://www.youtube.com/embed/iFzSdjg9r6U",
          writtenLink: "https://stereum.net/ethereum-node-setup/rpc_endpoint_metamask/",
          guideLink: "",
          display: true,
        },
      ],
    };
  },

  computed: {
    // ...mapWritableState(useNodeStore, {
    //   configData: "configData_nodeSidebarVideo",
    // }),
    ...mapWritableState(useTutorialStore, {
      showTutorialModal: "showTutorialModal",
    }),
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useNodeStore, {
      infoAlarm: "infoAlarm",
    }),
  },

  watch: {
    currentNetwork: {
      handler() {
        this.serviceController();
      },
      immediate: true,
    },
  },
  mounted() {
    this.configData = this.configData.map((item) => {
      return {
        showPlayModal: false,
        ...item,
      };
    });
    this.serviceController();
    console.log(this.currentNetwork.network);
  },
  methods: {
    serviceController() {
      if (this.currentNetwork.network == "gnosis") {
        this.configData[0] = {
          name: this.$t("nodeSidebarVideo.gnoStake"),
          videosLink: "https://www.youtube.com/embed/qORXGzhZPns",
          writtenLink: "https://stereum.net/ethereum-node-setup/gno-solo-staking/",
          guideLink: "",
          display: true,
        };
      } else if (this.currentNetwork.network) {
        this.configData[0] = {
          name: this.$t("nodeSidebarVideo.stake"),
          videosLink: "https://www.youtube.com/embed/bfToZ_wTh_Q",
          writtenLink: "https://stereum.net/eth-solo-staking-step-by-step-guide/",
          guideLink: "",
          display: true,
        };
      }
    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
}
.tutorial-box {
  width: 90%;
  height: 89%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  position: relative;
  background: #23272a;
  border: 1px solid #4c4848;
  border-radius: 5px;
  box-shadow: 0 1px 3px 1px #1c1f22;
  margin-bottom: 9px;
  padding: 5% 0;
}
.back-button {
  width: 92%;
  height: 9%;
  background: #264744;
  border-radius: 20px;
  box-shadow: 0 1px 3px 0px #1c1f22;
  position: absolute;
  bottom: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.back-button:active {
  box-shadow: none;
  transform: scale(0.9);
}
.up-arrow {
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 10px solid #ade5ff;
}
/*.tutorial-table {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 72%;
  width: 90%;
  border-radius: 10px 10px 0 0;
  background-color: #808080;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 1px;
}
.tutorial-table::-webkit-scrollbar {
  width: 1px;
}

.table-row {
  display: flex;
  width: 96%;
  height: 25px;
  margin-top: 2px;
  background-color: #2d3134;
  border: 1px solid #242529;
  border-radius: 3px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.table-row:hover {
  transition-duration: 100ms;
  background-color: #81b6ae;
  border: 1px solid #235750;
}
.table-row:hover span {
  transition-duration: 100ms;
  color: #242529;
  font-weight: 700;
}

.question-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15%;
  height: 100%;
  text-align: left;
}

.question-icon img {
  width: 90%;
  height: 80%;
}

.row-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 85%;
  padding-top: 2px;
}

.row-content span {
  text-align: center;
  width: 100%;
  color: rgb(208, 208, 208);
  font-size: 0.6rem;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 800;
  overflow-x: hidden;
}
.round-icon {
  width: 100%;
  height: 20%;
  margin: 5px auto 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.round-icon img {
  width: 33%;
  height: 100%;
}*/
</style>
