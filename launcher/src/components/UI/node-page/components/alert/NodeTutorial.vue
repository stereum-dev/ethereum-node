<template>
  <div class="tutorial-box border border-gray-600 rounded-md bg-[#151618]">
    <div class="tutorial-btn" @click="handleWrittenOptionClick">
      <div class="icon-box">
        <img src="/img/icon/tutorial-icons/manual-icon.png" alt="" />
      </div>
      <div class="name-span">
        <span>{{ $t("nodeSidebarVideo.written") }}</span>
      </div>
    </div>
    <div class="tutorial-btn" @click="handleCameraOptionClick">
      <div class="icon-box camera">
        <img src="/img/icon/tutorial-icons/big-camera.png" alt="" />
      </div>
      <div class="name-span">
        <span>{{ $t("nodeSidebarVideo.video") }}</span>
      </div>
    </div>
    <div class="tutorial-btn" @click="tutorial = true">
      <div class="icon-box camera">
        <img src="/img/icon/tutorial-icons/Guide-icon.png" alt="" />
      </div>
      <div class="name-span">
        <span>{{ $t("nodeSidebarVideo.rpc") }}</span>
      </div>
    </div>
    <div v-if="currentNetwork.id !== 4" class="tutorial-btn" @click="stakeGuide = true">
      <div class="icon-box camera">
        <img src="/img/icon/tutorial-icons/Guide-icon.png" alt="" />
      </div>
      <div class="name-span">
        <span>{{ $t("nodeSidebarVideo.stake") }}</span>
      </div>
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
import { mapWritableState, mapState } from "pinia";
import { useFooter } from "@/store/theFooter";
import { useNodeStore } from "@/store/theNode";
import { useNodeHeader } from "@/store/nodeHeader";
import { useNodeManage } from "@/store/nodeManage";

export default {
  data() {
    return {
      returnStatus: this.$t("theNode.returnStatus"),
    };
  },

  computed: {
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

  methods: {
    handleWrittenOptionClick() {
      let url = "https://stereum.net/content/guides";
      window.open(url, "_blank");
    },
    handleCameraOptionClick() {
      let url = "https://www.youtube.com/@Stereum";
      window.open(url, "_blank");
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
  border: 2px solid #264744;
}
.tutorial-btn:active {
  background: #264744;
  border: none;
  transform: scale(0.92);
  border: 2px solid #264744;
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
  justify-content: flex-start;
  align-items: center;
  display: flex;
  text-transform: capitalize;
  font-size: 108%;
  font-weight: 700;
}

.tutorial-box {
  width: 100%;
  height: 430px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  position: relative;
  padding-top: 2px;
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
