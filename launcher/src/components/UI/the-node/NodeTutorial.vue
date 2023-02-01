<template>
  <div class="tutorial-box">
    <div class="tutorial-table">
      <div
        class="table-row"
        v-for="(item, index) in configData"
        :key="index"
        @click="$emit('showModal', item)"
        :class="{ disabled: !item.display }"
      >
        <div class="question-icon">
          <img
            src="../../../../public/img/icon/manage-node-icons/QuestionMark.png"
            alt="question-icon"
          />
        </div>
        <div class="row-content">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="round-icon">
      <img src="/img/icon/round-icon.png" alt="round-icon" />
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
//import { useNodeStore } from "@/store/theNode";
import { useTutorialStore } from "@/store/tutorialSteps";
import { mapState } from "pinia";
import { useServices } from "@/store/services";

export default {
  data() {
    return {
      configData: [
        {
          id: 2,
          // name: this.$t("nodeSidebarVideo.stake"),
          name: "",
          videosLink: "",
          writtenLink:
            "https://stereum.net/eth-solo-staking-step-by-step-guide/",
          guideLink: "https://stereum.net/",
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
          guideLink: "https://stereum.net/",
          display: false,
        },
        {
          id: 5,
          name: this.$t("nodeSidebarVideo.switchC"),
          videosLink: "",
          writtenLink: "",
          guideLink: "https://stereum.net/",
          display: false,
        },
        {
          id: 6,
          name: this.$t("nodeSidebarVideo.migrate"),
          videosLink: "",
          writtenLink: "",
          guideLink: "https://stereum.net/",
          display: false,
        },
        {
          id: 1,
          name: this.$t("nodeSidebarVideo.rpc"),
          videosLink: "https://www.youtube.com/embed/iFzSdjg9r6U",
          writtenLink:
            "https://stereum.net/ethereum-node-setup/rpc_endpoint_metamask/",
          guideLink: "https://stereum.net/",
          display: true,
        },
      ],
    };
  },
  mounted() {
    this.configData = this.configData.map((item) => {
      return {
        showPlayModal: false,
        ...item,
      };
    });
    this.serviceController();
  },
  watch: {
    network: {
      handler(newVal, oldVal) {
        this.serviceController();
      },
    },
    immediate: true,
  },
  computed: {
    // ...mapWritableState(useNodeStore, {
    //   configData: "configData_nodeSidebarVideo",
    // }),
    ...mapWritableState(useTutorialStore, {
      showTutorialModal: "showTutorialModal",
    }),
    ...mapState(useServices, {
      network: "network",
    }),
  },
  methods: {
    serviceController() {
      if (this.network === "gnosis") {
        this.configData[0].name = this.$t("nodeSidebarVideo.gnoStake");
        this.configData[0].videosLink =
          "https://www.youtube.com/watch?v=qORXGzhZPns";
        this.configData[0].writtenLink =
          "https://stereum.net/ethereum-node-setup/gno-solo-staking/";
      } else if (this.network === "mainnet") {
        this.configData[0].name = this.$t("nodeSidebarVideo.stake");
        this.configData[0].videosLink =
          "https://www.youtube.com/embed/bfToZ_wTh_Q";
        this.configData[0].writtenLink =
          "https://stereum.net/ethereum-node-setup/gno-solo-staking/";
      } else if (this.network === "testnet") {
        this.configData[0].name = this.$t("nodeSidebarVideo.stake");
        this.configData[0].videosLink =
          "https://www.youtube.com/embed/bfToZ_wTh_Q";
        this.configData[0].writtenLink =
          "https://stereum.net/ethereum-node-setup/gno-solo-staking/";
      } else {
        this.configData[0].name = "Wait...";
        this.configData[0].videosLink = "";
        this.configData[0].writtenLink = "";
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
  width: 96%;
  height: 50%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 15px;
  background-color: #2e5652;
  margin-bottom: 9px;
}
.tutorial-table {
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
}
</style>
