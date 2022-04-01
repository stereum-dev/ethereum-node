<template>
  <div class="plugin-parent">
    <div class="select-box">
      <div class="icon-box">
        <img
          v-if="isTestnetActive"
          class="textnet-icon"
          src="../../../../public/Img/icon/click-installation/testnet-icon.png"
          alt="icon"
        />
        <img
          v-if="isMainnetActive"
          class="mainnet-icon"
          src="../../../../public/Img/icon/click-installation/mainnet-icon.png"
          alt="icon"
        />
      </div>
      <select
        id="selector"
        @change="pluginNetworkHandler"
        v-model="selectedNetworks"
      >
        <option value="mainnet">Mainnet</option>
        <option value="testnet">Testnet</option>
      </select>
    </div>
    <div class="plugin-table">
      <div class="table-content">
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
                  selectedItem: item.id === selectedPlugin?.id,
                }"
                @click="selectItemToInstall(item)"
              />
            </div>
          </div>
          <div class="testnet-container" v-if="isTestnetActive">
            <div
              class="testnet-plugin"
              v-for="(item, index) in this.testnetPlugins"
              :key="index"
            >
              <img
                :src="item.icon"
                alt="icon"
                :class="{
                  selectedItem: item.id === selectedPlugin?.id,
                }"
                @click="selectItemToInstall(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isMainnetActive: false,
      mainnetPlugins: [],
      isTestnetActive: false,
      testnetPlugins: [],
      selectedNetworks: null,
      selectedPlugin: undefined,
    };
  },
  computed: {
    ...mapGetters({
      plugins: "installationPlugins",
    }),
  },

  beforeUpdate() {
    this.mainnetNetworkHandler();
    this.testnetNetworkHandler();
  },
  updatetd() {
    console.log(this.selectedPlugin);
  },
  methods: {
    mainnetNetworkHandler() {
      if (this.selectedNetworks == "mainnet") {
        this.mainnetPlugins = this.plugins.filter(
          (item) => item.network == "mainnet"
        );
        this.isMainnetActive = true;
        this.isTestnetActive = false;
      }
    },

    testnetNetworkHandler() {
      if (this.selectedNetworks == "testnet") {
        this.testnetPlugins = this.plugins.filter(
          (item) => item.network == "testnet"
        );
        this.isMainnetActive = false;
        this.isTestnetActive = true;
      }
    },
    selectItemToInstall(item) {
      this.selectedPlugin = item;
    },
  },
};
</script>
<style scoped>
.plugin-parent {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.select-box {
  width: 35%;
  height: 12%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgb(31, 31, 31) !important;
  border: 2px solid rgb(126, 159, 151);
  border-radius: 5px;
  box-shadow: inset 0 1px 5px 1px rgb(18, 18, 18), 0 1px 3px 1px rgb(31, 31, 31);
}
.select-box #selector {
  width: 65%;
  height: 80%;
  border: none;
  border-radius: 5px;
  background-color: transparent;
  outline: none;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(234, 234, 234);
}
.select-box:hover {
  border: 2px solid rgb(32, 191, 235);
}
.icon-box {
  width: 13%;
  height: 83%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-box img {
  width: 88%;
  height: 100%;
}
.plugin-table {
  width: 94%;
  height: 77%;
  border-radius: 20px;
  overflow-y: auto;
  box-shadow: 0 1px 2px 1px rgb(21, 45, 41);
}

.table-content {
  width: 100%;
  height: 100%;
  background-color: rgb(47, 114, 112);
}
.mainnet-container,
.testnet-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 50%);
  overflow-x: hidden;
  overflow-y: auto;
  align-items: center;
  justify-items: center;
}
.plugin-box {
  width: 100%;
  height: 100%;
}
.mainnet-plugin,
.testnet-plugin {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainnet-plugin img,
.testnet-plugin img {
  width: 54%;
  height: 80%;
}
.mainnet-plugin img:hover,
.testnet-plugin img:hover {
  width: 58% !important;
  height: 86% !important;
  transition: 0.2s;
}
.selectedItem {
  border: 2px solid rgb(53, 178, 246) !important;
  border-radius: 10px !important;
  box-shadow: 0px 1px 5px 2px rgb(31, 31, 31) !important;
}
</style>
