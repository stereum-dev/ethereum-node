<template>
  <div class="plugin-parent">
    <div class="select-box">
      <div class="icon-box">
        <img
          v-if="networkIcon"
          :src="networkIcon"
          alt="icon"
        />
      </div>
      <select
        class="ring-0"
        id="selector"
        @change="pluginNetworkHandler"
        v-model="selectedNetworkName"
      >
        <option class="ring-0" value="" selected>CHOOSE A NETWORK</option>
        <option class="ring-0" value="mainnet">Mainnet</option>
        <option class="ring-0" value="testnet">Testnet</option>
        <option class="ring-0" value="gnosis">Gnosis</option>
      </select>
    </div>
    <div class="plugin-table">
      <div class="table-content">
        <div class="plugin-box">
          <div class="network-container">
            <div
              class="plugin"
              v-for="(item, index) in this.plugins.filter(p => p.network === selectedNetworkName)"
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ControlService from "@/store/ControlService";
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "@/store/services";
export default {
  data() {
    return {
      networkIcon: "",
      selectedNetworkName: "",
    };
  },
  computed: {
    ...mapWritableState(useClickInstall, {
      plugins: "presets",
      selectedPreset: "selectedPreset",
      selectedNetwork: "selectedNetwork",
      networks: "networks",
    }),
    ...mapWritableState(useServices, {
      allServices: "allServices",
    }),
  },
  mounted() {
    this.selectedPreset = undefined;
  },
  methods: {
    pluginNetworkHandler(){
      let network = this.networks.find(item => item.name === this.selectedNetworkName)
      this.networkIcon = network ? network.icon : ""
      this.selectedNetwork = network
    },
    selectItemToInstall: async function (item) {
      const constellation = await ControlService.getOneClickConstellation({
        setup: item.name,
        network: this.selectedNetworkName,
      });
      let includedPlugins = this.allServices.filter((service) =>
        constellation.includes(service.service)
      );
      if (
        includedPlugins.map((e) => e.service).includes("SSVNetworkService") ||
        includedPlugins.map((e) => e.service).includes("RocketpoolService")
      ) {
        includedPlugins.splice(
          includedPlugins.findIndex(
            (e) =>
              e.service != "SSVNetworkService" &&
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
  },
};
</script>
<style scoped>
.plugin-parent {
  width: 97%;
  height: 75%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.select-box {
  width: 35%;
  height: 13%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgb(31, 31, 31);
  border: 2px solid rgb(126, 159, 151);
  border-radius: 5px;
  box-shadow: inset 0 1px 5px 1px rgb(18, 18, 18), 0 1px 3px 1px rgb(31, 31, 31);
}
.select-box #selector {
  width: 85%;
  height: 90%;
  border: none !important;
  border-radius: 5px;
  background-color: transparent;
  padding: 0;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(97, 194, 255);
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
}
.select-box #selector option {
  width: 100%;
  height: 100%;
  margin-left: 5px;
  border: none !important;
  box-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
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
  width: 90%;
  height: 100%;
}
.plugin-table {
  width: 99%;
  height: 72%;
  border-radius: 20px;
  overflow-y: auto;
  box-shadow: 0 1px 2px 1px rgb(21, 45, 41);
}

.table-content {
  width: 100%;
  height: 100%;
  background-color: #2f7270;
}
.network-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  overflow-x: hidden;
  overflow-y: auto;
  align-items: center;
  justify-items: center;
}
/* .mainnet-container::-webkit-scrollbar,
.testnet-container::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: transparent;
}
.mainnet-container::-webkit-scrollbar-track,
.testnet-container::-webkit-scrollbar-track {
  width: 10px;
  height: 50px;
  background-color: transparent;
}
.mainnet-container::-webkit-scrollbar-thumb,
.testnet-container::-webkit-scrollbar {
  background: transparent;
  border-radius: 100px;
  border-top: 60px solid green;

} */
::-webkit-scrollbar {
  width: 8px;
  background: #2f7270;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.392);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 100px;
  border-top: 20px solid #2f7270;
  border-bottom: 20px solid #2f7270;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.542);
  background: rgb(24, 201, 195);
}
.plugin-box {
  width: 100%;
  height: 100%;
}
.plugin {
  width: 100%;
  height: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.plugin img {
  width: 65%;
  height: 77%;
  border-radius: 5px;
  border: 2px solid transparent;
  cursor: pointer;
  transition-duration: 0.2s;
}
.plugin img:hover {
  transform: scale(1.1);
  box-shadow: 1px 1px 7px 1px rgb(24, 69, 61);
  transition-duration: 0.3s;
}

.selectedItem {
  transform: scale(1.1);
  border: 2px solid rgb(53, 178, 246) !important;
}

.notAvailable {
  opacity: 0.2;
  pointer-events: none;
}
</style>
