<template>
  <div class="custom-layer_parent">
    <div class="header">
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
    <router-link class="install" :class="activeBtn()" to="/node" @click="prepareStereum">{{
      $t("installOption.install")
    }}</router-link>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import { useNodeHeader } from "@/store/nodeHeader";
import { useNodeManage } from "@/store/nodeManage";
import { mapWritableState } from "pinia";
export default {
  data() {
    return {
      installPath: "/opt/stereum",
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      currentNetwork: "currentNetwork",
      networkList: "networkList",
    }),
    ...mapWritableState(useNodeHeader, {
      refresh: "refresh",
    }),
  },

  created() {
    this.activeBtn();
  },

  methods: {
    async prepareStereum() {
      this.currentNetwork = this.networkList.find((item) => item.network === "testnet");
      this.refresh = false;
      await ControlService.prepareStereumNode(this.installPath);
      const restarted = await ControlService.restartServer();
      this.refresh = true;
      if (restarted) await new Promise((resolve) => setTimeout(resolve, 20000));
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

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  top: 10%;
  position: absolute;
}

.header span {
  display: flex;
  width: max-content;
  padding: 0 2%;
  border: 5px solid #929292;
  background-color: #194747;
  box-shadow: 0 1px 3px 1px #1f3737;
  color: #cecece;
  border-radius: 30px;
  font-size: 2rem;
  font-weight: 600;
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
  width: 50%;
  height: 60%;
  border: 5px solid #929292;
  background-color: #194747;
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
  height: 50%;
  flex-direction: column;
  border: 1px solid #343434;
  background: #2a2a2a;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
}

.textbox-cont_front {
  background: #194747;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 88%;
  width: 97%;
  border-radius: 10px;
  flex-direction: column;
  border: 1px solid #343434;
}

.textbox-title {
  width: 100%;
  height: 35%;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  padding: 0 2%;
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
  width: 95%;
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
  border: 5px solid #929292;
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
