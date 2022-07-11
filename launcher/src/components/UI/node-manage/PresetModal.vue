<template>
  <div class="modal-container">
    <div class="modal-content">
      <div class="plugins">
        <div class="title">
          <span>THE PRESETS</span>
        </div>
        <div class="switch-box">
          <div class="switchBtn">
            <span class="btn" @click="switchNetworkHandler"
              >switch network</span
            >
          </div>
          <div class="networkBox">
            <div class="mainnet" v-if="isMainnetActive">
              <span>mainnet</span>
              <img
                class="mainnet-icon"
                src="../../../../public/img/icon/click-installation/mainnet-icon.png"
                alt="icon"
              />
            </div>
            <div class="testnet" v-else>
              <span>testnet</span>
              <img
                class="testnet-icon"
                src="../../../../public/img/icon/click-installation/testnet-icon.png"
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div class="plugin-box">
          <div class="mainnet-container" v-if="isMainnetActive">
            <div
              class="mainnet-plugin"
              v-for="(item, index) in this.mainnetPlugins"
              :key="index"
            >
              <img
                :src="item.icon"
                alt="icon"
                :class="{
                  selectedItem:
                    item.id === this.selectedPreset?.id &&
                    item.serviceAvailable,
                  notAvailable: !item.serviceAvailable,
                }"
                @click="selectItemToInstall(item)"
              />
            </div>
          </div>
          <div class="testnet-container" v-else>
            <div
              class="testnet-plugin"
              v-for="(item, index) in this.testnetPlugins"
              :key="index"
            >
              <img
                @mousedown.stop
                :src="item.icon"
                alt="icon"
                :class="{
                  selectedItem:
                    item.id === this.selectedPreset?.id &&
                    item.serviceAvailable,
                  notAvailable: !item.serviceAvailable,
                }"
                @click="selectItemToInstall(item)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="title">
          <span>CHOOSE A PRESET</span>
        </div>
        <div class="description">
          <p>
            Stereum gives you the choice of choosing different use case focused
            pre-sets. You don't automatically commit to the changes, it just
            recommends you a selection. Try them out!
          </p>
        </div>

        <router-link class="install-btn" :to="{ path: '/install' }">
          <button>INSTALL</button>
        </router-link>
      </div>
    </div>
    <div class="close-preset" @click="$emit('closePreset')">
      <img
        src="../../../../public/img/icon/manage-node-icons/close3.png"
        alt="icon"
      />
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "@/store/services";
export default {
  props: ["modalStatus"],
  data() {
    return {
      isMainnetActive: true,
      mainnetPlugins: [],
      testnetPlugins: [],
    };
  },
  created() {
    this.switchNetworkHandler();
  },
  computed: {
    ...mapWritableState(useClickInstall, {
      plugins: "presets",
      selectedPreset: "selectedPreset",
      selectedNetworks: "selectedNetworks",
    }),
    ...mapWritableState(useServices, {
      allServices: "allServices",
    }),
  },
  methods: {
    selectItemToInstall: async function (item) {
      const constellation = await ControlService.getOneClickConstellation(
        item.name
      );
      let includedPlugins = this.allServices.filter((service) =>
        constellation.includes(service.service)
      );
      if (
        includedPlugins.map((e) => e.service).includes("BloxSSVService") ||
        includedPlugins.map((e) => e.service).includes("RocketpoolService")
      ) {
        includedPlugins.splice(
          includedPlugins.findIndex(
            (e) =>
              e.service != "BloxSSVService" &&
              e.service != "RocketpoolService" &&
              e.category === "validator"
          ),
          1
        );
      }
      item.includedPlugins = includedPlugins;
      this.selectedPreset = item;
      this.$emit("disableBtn");
    },
    switchNetworkHandler() {
      this.isMainnetActive = !this.isMainnetActive;
      if (this.isMainnetActive) {
        this.mainnetPlugins = this.plugins.filter(
          (item) => item.network == "mainnet"
        );
      } else {
        this.testnetPlugins = this.plugins.filter(
          (item) => item.network == "testnet"
        );
      }
    },
  },
};
</script>
<style scoped>
.modal-container {
  width: 100%;
  height: 100%;
  border-radius: 0 35px 0 0;
  background: #1a1921;
  border: 3px solid rgb(139, 176, 187);
  position: absolute;
  bottom: 0;
  left: 0.5%;
}
.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content .plugins {
  width: 39%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-left: 20px;
}
.plugins .title {
  width: 100%;
  height: 50px;
  padding-top: 4px;
  text-align: center;
}
.plugins .title span {
  color: rgb(206, 206, 206);
  font-size: 1.5rem;
  font-weight: 900;
}
.switch-box {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.switchBtn {
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.switchBtn span {
  width: 130px;
  height: 76%;
  margin-left: 4px;
  padding: 6px 5px;
  border-radius: 5px;
  border: 1px solid rgb(102, 102, 102);
  box-shadow: 1px 1px 3px 1px rgb(7, 7, 7);
  background-color: rgb(26, 53, 54);
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(206, 206, 206);
  text-transform: uppercase;
  cursor: pointer;
  transition-duration: 100ms;
}
.switchBtn span:hover {
  border: 1px solid rgb(163, 163, 163);
  background-color: rgb(32, 65, 67);
  color: rgb(206, 206, 206);
}
.switchBtn span:active {
  transform: scale(0.95);
  border: 1px solid rgb(102, 102, 102);
  background-color: rgb(26, 53, 54);
}
.networkBox {
  width: 45%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.testnet,
.mainnet {
  width: 100%;
  width: 130px;
  height: 63%;
  padding: 6px 5px;
  border: 1px solid rgb(102, 102, 102);
  box-shadow: inset 1px 1px 15px rgb(7, 7, 7);
  background: #1c1c20;
  border-radius: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.testnet .testnet-icon,
.mainnet .mainnet-icon {
  width: 20px;
  height: 20px;
  border: 1px solid rgb(192, 192, 192);
  border-radius: 100%;
}
.testnet span,
.mainnet span {
  width: 75%;
  height: 100%;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(82, 148, 138);
  text-transform: uppercase;
  text-align: center;
}
.plugin-box {
  width: 100%;
  height: 77%;
  border-top: 1px solid rgb(63, 70, 99);
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainnet-container,
.testnet-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
}
.mainnet-plugin,
.testnet-plugin {
  width: 100%;
  height: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainnet-plugin img,
.testnet-plugin img {
  width: 85%;
  height: 62%;
  cursor: pointer;
}
.mainnet-plugin img:hover,
.testnet-plugin img:hover {
  transform: scale(1.04);
  transition-duration: 50ms;
}
.mainnet-plugin img:active,
.testnet-plugin img:active {
  transform: scale(1);
  transition-duration: 50ms;
}
.selectedItem {
  border: 2px solid rgb(53, 178, 246) !important;
  border-radius: 6px !important;
  box-shadow: 0px 1px 5px 2px rgb(31, 31, 31) !important;
}
.notAvailable {
  opacity: 0.2;
  pointer-events: none;
}

.modal-content .content {
  width: 50%;
  height: 90%;
  border-left: 1px solid #3f4663;
  margin-left: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.content .title {
  width: 80%;
  height: 22%;
  border-bottom: 1px solid rgb(63, 70, 99);
  text-align: center;
}
.content .title span {
  color: rgb(206, 206, 206);
  font-size: 1.5rem;
  font-weight: 900;
}
.content .description {
  width: 80%;
  height: 60%;
  margin-top: 9px;
}
.content .description p {
  color: rgb(183, 183, 183);
  font-size: 15px;
  font-weight: 500;
  text-align: justify;
  overflow: hidden;
}
.content .install-btn {
  width: 30%;
  height: 11%;
  border: 3px solid rgb(160, 160, 160);
  border-radius: 30px;
  background-color: #254f4c;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 1px 2px 8px #000000;
}
.content .install-btn:hover {
  background-color: rgb(27, 62, 60);

  box-shadow: none;
}
.content .install-btn:active {
  font-size: 1rem;
  box-shadow: inset 1px 1px 8px 1px #000000;
}
.install-btn button {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}
.close-preset {
  width: 25px;
  height: 25px;
  border-radius: 50px;
  position: fixed;
  margin: 5px;
  padding: 1px;
  top: 11%;
  right: 1%;
  background-color: #171b1f;
  border: 2px solid #63707e;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.close-preset:hover {
  background-color: #141515;
  border: 2px solid #cf503f;
  transform: scale(1.1);
  transition: all 200ms;
}
.close-preset:active {
  background-color: #141515;
  border: 2px solid #63707e;
  transform: scale(1);
  transition: all 200ms;
}
.close-preset img {
  width: 17px;
  height: 17px;
  border-radius: 50px;
}
.selectedItem {
  border: 2px solid rgb(53, 178, 246) !important;
  border-radius: 10px !important;
  box-shadow: 0px 1px 5px 2px rgb(31, 31, 31) !important;
}
</style>
