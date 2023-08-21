<template>
  <div class="custom-layer_parent">
    <div class="customInstall_header">
      <span>{{ $t("customInstallation.customInstallationTitle") }}</span>
    </div>
    <div class="container-box">
      <div class="custom-container">
        <div class="text-container">
          <span>{{ $t("customInstallation.customInstallationText") }}</span>
        </div>
        <div class="path-container">
          <div class="path-title">
            <span>{{ $t("customInstallation.chooseWhereToInstall") }}:</span>
          </div>
          <div class="textbox-cont">
            <div class="textbox-cont_front">
              <div class="textbox-title">
                <span>{{ $t("customInstallation.installationPath") }}</span>
              </div>
              <div class="textbox">
                <input v-model="installPath" type="text" placeholder="/opt/stereum" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-link class="back" to="/welcome">{{ $t("installOption.back") }} </router-link>
    <router-link class="install" :class="activeBtn()" to="/customAnim" @click="prepareStereum">{{
      $t("installOption.install")
    }}</router-link>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useNodeHeader } from "@/store/nodeHeader";
export default {
  data() {
    return {
      installPath: "/opt/stereum",
    };
  },

  computed: {
    ...mapWritableState(useNodeHeader, {
      refresh: "refresh",
    }),
  },
  created() {
    this.activeBtn();
    this.getInstallPath();
  },
  methods: {
    async getInstallPath () {
      let largestVolumePath = await ControlService.getLargestVolumePath();
      if (largestVolumePath === "/") largestVolumePath = largestVolumePath + "opt";
      const stereumInstallationPath = [largestVolumePath, "/stereum"].join("/").replace(/\/{2,}/, "/");
      this.installPath = stereumInstallationPath;
    },
    async prepareStereum() {
      this.refresh = false;
      await ControlService.prepareStereumNode(this.installPath);
      const restarted = await ControlService.restartServer();
      this.refresh = true;
      if (restarted) await new Promise((resolve) => setTimeout(resolve, 5000));
      this.$router.push("/node");
    },
    activeBtn() {
      if (this.installPath === "") {
        return "deactivated";
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  outline: none;
}

.custom-layer_parent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
}

.customInstall_header {
  margin-top: 10px;
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.customInstall_header span {
  width: 60%;
  height: 55%;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  box-shadow: 0 1px 3px 1px rgb(46, 57, 55);
  border-radius: 15px;
  font-size: 2.2rem;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  color: #b4b4b4;
}

.container-box {
  display: flex;
  width: 100%;
  height: 85%;
  position: absolute;
  top: 15%;
  justify-content: center;
  align-items: center;
}

.custom-container {
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 70%;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  box-shadow: 0 1px 3px 1px #1f3737;
  color: #cecece;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
}

.text-container {
  width: 100%;
  height: 50%;
  padding: 3% 4%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: justify;
  font-weight: 400;
}

.path-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 50%;
  width: 100%;
}

.path-title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  margin-bottom: 2%;
}

.textbox-cont {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 68%;
  flex-direction: column;
  border: 1px solid #525a64;
  background-color: #3d4449;
  box-shadow: 0 1px 3px 1px #282a2b;
  border-radius: 20px;
  padding: 10px 20px;
}

.textbox-cont_front {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 88%;
  width: 97%;
  border-radius: 10px;
  flex-direction: column;
}

.textbox-title {
  width: 100%;
  height: 35%;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  font-size: 80%;
  font-weight: 600;
}

.textbox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 65%;
}

.textbox input {
  border: none;
  width: 100%;
  height: 70%;
  padding: 0 2%;
  border-radius: 5px;
  color: #2a2a2a;
  font-weight: 600;
}

.back,
.install {
  width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #929292;
  background-color: #194747;
  box-shadow: 0 1px 3px 1px #1f3737;
  color: #cecece;
  padding: 0 2%;
  border-radius: 30px;
  position: absolute;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
}

.back {
  top: 85%;
  left: 5%;
}

.install {
  top: 85%;
  left: 83%;
}

.deactivated {
  opacity: 80%;
  box-shadow: none;
  pointer-events: none;
}

.back:active,
.install:active {
  transform: scale(0.9);
  box-shadow: none;
}
</style>
