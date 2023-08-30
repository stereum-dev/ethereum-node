<template>
  <div class="tutorial-box">
    <!-- <TutorialButtons
      tutorial-btn-ttl="written cuides"
      tutorial-icons="/img/icon/tutorial-icons/manual-icon.png"
      current-data="button"
      @guided-option-clicked="handleGuidedOptionClick(button)"
      @written-option-clicked="handleWrittenOptionClick(button)"
      @video-option-clicked="handleVideoOptionClick(button)"
    /> -->
    <!-- <TutorialButtons
      v-for="(button, key) in tutorialBtns"
      :key="key"
      :tutorial-btn-ttl="button.title"
      :tutorial-icons="button.icon"
      :current-data="button"
      @guided-option-clicked="handleGuidedOptionClick(button)"
      @written-option-clicked="handleWrittenOptionClick(button)"
      @video-option-clicked="handleVideoOptionClick(button)"
    /> -->

    <!-- <TutorialButtons
      v-for="item in tutorialTitles"
      :key="item"
      :tutorial-btn-ttl="item.name"
      :tutorial-icons="item.icon"
      :class="{ disabled: item.disable }"
      @guided-option-clicked="handleGuidedOptionClick(item)"
      @written-option-clicked="handleWrittenOptionClick(item)"
      @video-option-clicked="handleVideoOptionClick(item)"
    /> -->
    <div class="tutorial-btn" @click="handleWrittenOptionClick">
      <div class="icon-box"><img src="/img/icon/tutorial-icons/manual-icon.png" alt="" /></div>
      <div class="name-span"><span>written guides</span></div>
    </div>
    <div class="tutorial-btn" @click="handleCameraOptionClick">
      <div class="icon-box camera"><img src="/img/icon/tutorial-icons/big-camera.png" alt="" /></div>
      <div class="name-span"><span>written guides</span></div>
    </div>
    <div class="tutorial-btn" @click="handleCameraOptionClick">
      <div class="icon-box camera"><img src="/img/icon/tutorial-icons/big-camera.png" alt="" /></div>
      <div class="name-span"><span>written guides</span></div>
    </div>

    <div
      class="back-button"
      @click="infoAlarm = !infoAlarm"
      @mouseenter="cursorLocation = `${returnStatus}`"
      @mouseleave="cursorLocation = ''"
    >
      <div class="up-arrow"></div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useFooter } from "@/store/theFooter";
import { useNodeStore } from "@/store/theNode";
import { useNodeHeader } from "@/store/nodeHeader";
import { useTutorialStore } from "@/store/tutorialSteps";
import { mapState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
// import TutorialButtons from "./TutorialButtons.vue";

export default {
  // components: { TutorialButtons },
  data() {
    return {
      returnStatus: this.$t("theNode.returnStatus"),
      selectedGuide: "",
      tutorialTitles: [
        {
          name: this.$t("nodeSidebarVideo.alert"),
          icon: "/img/icon/manage-node-icons/QuestionMark.png",
          disable: true,
          video: "",
          guide: "",
          written: "",
        },
        {
          name: this.$t("nodeSidebarVideo.switchC"),
          icon: "/img/icon/manage-node-icons/QuestionMark.png",
          disable: true,
          video: "",
          guide: "",
          written: "",
        },
        {
          name: this.$t("nodeSidebarVideo.migrate"),
          icon: "/img/icon/manage-node-icons/QuestionMark.png",
          disable: true,
          video: "",
          guide: "",
          written: "",
        },
        {
          name: this.$t("nodeSidebarVideo.rpc"),
          icon: "/img/icon/manage-node-icons/QuestionMark.png",
          disable: false,
          video: " https://www.youtube.com/embed/iFzSdjg9r6U",
          guide: "rpc",
          written: "https://stereum.net/ethereum-node-setup/rpc_endpoint_metamask/",
        },
      ],
      confData: {
        mainnet: [
          {
            title: this.$t("nodeSidebarVideo.stake"),
            guide: "stake",
            video: "https://www.youtube.com/embed/Cbu58ee_Wj4",
            written: "https://stereum.net/ethereum-node-setup/eth-solo-staking-step-by-step-guide/",
            icon: "/img/icon/click-installation/mainnet-icon.png",
          },
        ],
        goerli: [
          {
            title: this.$t("nodeSidebarVideo.stake"),
            guide: "stake",
            video: "https://www.youtube.com/embed/Cbu58ee_Wj4",
            written: "https://stereum.net/ethereum-node-setup/eth-solo-staking-step-by-step-guide/",
            icon: "/img/icon/click-installation/testnet-icon.png",
          },
          {
            title: this.$t("nodeSidebarVideo.ssv"),
            guide: "",
            video: "https://www.youtube.com/embed/ccKoalZtjlA",
            written: "https://stereum.net/ssv-network-node-operator-guide/",
            icon: "/img/icon/click-installation/testnet-icon.png",
          },
        ],
        sepolia: [
          {
            title: this.$t("nodeSidebarVideo.stake"),
            guide: "",
            video: "https://www.youtube.com/embed/Cbu58ee_Wj4",
            written: "https://stereum.net/ethereum-node-setup/eth-solo-staking-step-by-step-guide/",
            icon: "/img/icon/click-installation/testnet-icon.png",
          },
        ],
        gnosis: [
          {
            title: this.$t("nodeSidebarVideo.gnoStake"),
            guide: "",
            video: "https://www.youtube.com/embed/qORXGzhZPns",
            written: "https://stereum.net/ethereum-node-setup/gno-solo-staking/",
            icon: "/img/icon/control/gno_currency_symbol.png",
          },
        ],
      },
      tutorialBtns: [],
    };
  },

  computed: {
    ...mapWritableState(useTutorialStore, {
      playYoutubeVideo: "playYoutubeVideo",
      chosenVideo: "chosenVideo",
    }),
    ...mapState(useNodeManage, {
      currentNetwork: "currentNetwork",
    }),
    ...mapWritableState(useNodeStore, {
      infoAlarm: "infoAlarm",
    }),
    ...mapWritableState(useNodeHeader, {
      tutorial: "tutorial",
      stakeGuide: "stakeGuide",
    }),
    ...mapWritableState(useFooter, {
      cursorLocation: "cursorLocation",
    }),
  },

  mounted() {
    this.mainButtonController();
  },
  methods: {
    handleGuidedOptionClick(item) {
      this.selectedGuide = item.guide;

      if (this.selectedGuide == "rpc") {
        this.tutorial = true;
      } else if (this.selectedGuide == "stake") {
        this.stakeGuide = true;
      }
    },
    handleWrittenOptionClick() {
      let url = "https://stereum.net/content/guides";
      window.open(url, "_blank");
    },
    handleCameraOptionClick() {
      let url = "https://www.youtube.com/@Stereum";
      window.open(url, "_blank");
    },
    handleVideoOptionClick(item) {
      this.chosenVideo = item.video;
      this.playYoutubeVideo = true;
    },
    mainButtonController() {
      const currentService = this.currentNetwork.network;

      for (const service in this.confData) {
        if (service === currentService) {
          const buttons = this.confData[service].map((item) => {
            return {
              title: item.title,
              icon: item.icon,
              video: item.video,
              guide: item.guide,
              written: item.written,
            };
          });
          this.tutorialBtns = buttons;
          break;
        }
      }
    },
  },
};
</script>
<style scoped>
.tutorial-btn {
  width: 95%;
  display: flex;
  height: 9%;
  justify-content: center;
  align-items: center;
  display: flex;
  border: 2px solid #c1c1c1;
  border-radius: 5px;
  margin-bottom: 3%;
  justify-content: space-around;
  align-items: center;
  font-size: 55%;
  font-weight: 700;
  cursor: pointer;
  color: #eee;
}
.tutorial-btn:hover {
  background: #264744;
  border: none;
}
.tutorial-btn:active {
  background: #264744;
  border: none;
  transform: scale(0.92);
}
.icon-box {
  width: 25%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
}
.icon-box img {
  width: 100%;
}
.camera img {
  width: 80%;
}
.name-span {
  width: 75%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  text-transform: capitalize;
  font-size: 115%;
  font-weight: 700;
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
  cursor: pointer;
}
.back-button:hover {
  background: rgb(43, 84, 81);
}
.back-button:active {
  background: rgba(43, 84, 81, 0.5);
}
.up-arrow {
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 10px solid #ade5ff;
}
</style>
