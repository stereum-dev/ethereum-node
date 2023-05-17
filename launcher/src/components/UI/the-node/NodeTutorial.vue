<template>
  <div class="tutorial-box">
    <TutorialButtons
      v-for="(button, key) in tutorialBtns"
      :key="key"
      :tutorial-btn-ttl="button.title"
      :tutorial-icons="button.icon"
      :current-data="button"
      @guided-option-clicked="handleGuidedOptionClick(button)"
      @written-option-clicked="handleWrittenOptionClick(button)"
      @video-option-clicked="handleVideoOptionClick(button)"
    />

    <TutorialButtons
      v-for="item in tutorialTitles"
      :key="item"
      :tutorial-btn-ttl="item.name"
      :tutorial-icons="item.icon"
      :class="{ disabled: item.disable }"
      @guided-option-clicked="handleGuidedOptionClick(item)"
      @written-option-clicked="handleWrittenOptionClick(item)"
      @video-option-clicked="handleVideoOptionClick(item)"
    />

    <div class="back-button" @click="infoAlarm = !infoAlarm"><div class="up-arrow"></div></div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
import { useNodeHeader } from "../../../store/nodeHeader";
import { useTutorialStore } from "@/store/tutorialSteps";
import { mapState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import TutorialButtons from "./TutorialButtons.vue";

export default {
  components: { TutorialButtons },
  data() {
    return {
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
        console.log("jhiodyjhivjaclkjilj");
      }
    },
    handleWrittenOptionClick(item) {
      let url = item.written;
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
</style>
