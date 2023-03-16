<!-- eslint-disable vue/return-in-computed-property -->
<template>
  <div class="plugin-parent">
    <div class="select-box">
      <div class="selectContent">
        <div class="currentBox" @click="openDropdown">
          <div class="selectBox_current space-x-4">
            <img v-if="currentNetwork.icon !== ''" :src="currentNetwork.icon" alt="Icon" class="w-6" />
            <span class="uppercase">{{ currentNetwork.name }}</span>
          </div>
          <div class="selectBox_icon">
            <img src="/img/icon/arrows/arrow-down.png" alt="arrow-down" class="arrowDown" />
          </div>
        </div>
      </div>
    </div>
    <Transition name="slide-fade">
      <div v-if="show" class="listBox">
        <div class="selectBox_list w-full divide-y-2 divide-gray-400">
          <div
            v-for="(state, i) in networks"
            :key="i"
            class="selectBox_item w-full flex justify-center items-center bg-slate-600 py-2 hover:bg-slate-700 text-slate-100 px-20"
            @click="selectNetwork(state.name)"
          >
            <div class="w-1/2 flex justify-start space-x-4 pl-10">
              <img :src="state.icon" alt="Icon" class="w-6" />
              <span class="text-md uppercase">{{ state.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <div class="plugin-table">
      <div class="table-content">
        <div class="plugin-box">
          <div class="network-container">
            <div
              v-for="(item, index) in plugins.filter((p) => p.network === currentNetwork.name)"
              :key="index"
              class="plugin"
            >
              <img
                :src="item.icon"
                :class="{
                  selectedItem: item.id === selectedPreset?.id && item.serviceAvailable,
                  notAvailable: !item.serviceAvailable,
                }"
                alt="icon"
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
      currentNetwork: {
        name: "Choose a network",
        icon: "",
      },
      show: false,
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
    pluginNetworkHandler() {
      let network = this.networks.find((item) => item.name === this.currentNetwork);
      this.selectedNetwork = network;
    },
    selectItemToInstall: async function (item) {
      const constellation = await ControlService.getOneClickConstellation({
        setup: item.name,
        network: this.currentNetwork.name,
      });
      let includedPlugins = this.allServices.filter((service) => constellation.includes(service.service));
      if (
        includedPlugins.map((e) => e.service).includes("SSVNetworkService") ||
        includedPlugins.map((e) => e.service).includes("RocketpoolService")
      ) {
        includedPlugins.splice(
          includedPlugins.findIndex(
            (e) => e.service != "SSVNetworkService" && e.service != "RocketpoolService" && e.category === "validator"
          ),
          1
        );
      }
      item.includedPlugins = includedPlugins;
      this.selectedPreset = item;
      this.$emit("disableBtn");
    },
    openDropdown() {
      this.show = !this.show;
    },
    selectNetwork(name) {
      this.currentNetwork = this.networks.find((item) => item.name === name);
      this.selectedNetwork = this.currentNetwork
      this.show = false;
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
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgb(31, 31, 31);
  border: 2px solid rgb(126, 159, 151);
  border-radius: 5px;
  box-shadow: inset 0 1px 5px 1px rgb(18, 18, 18), 0 1px 3px 1px rgb(31, 31, 31);
}
.select-box .selectContent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.select-box .selectContent .currentBox {
  width: 98%;
  height: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
}
.currentBox .selectBox_current {
  width: 95%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.currentBox .selectBox_current span {
  color: white;
  font-size: 1rem;
  font-weight: 400;
}
.select-box:hover {
  border-color: rgb(126, 189, 248);
  transition-duration: 0.2s;
}
.select-box:hover .selectBox_current span {
  color: rgb(126, 189, 248);
  transition-duration: 0.2s;
}
.currentBox .selectBox_icon {
  width: 5%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.currentBox .selectBox_icon img {
  width: 10px;
  height: 10px;
}
.listBox {
  width: 90%;
  height: fit-content;
  position: absolute;
  top: 45%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  z-index: 1;
}

.plugin-table {
  width: 99%;
  height: 72%;
  overflow-y: auto;
}

.table-content {
  width: 100%;
  height: 100%;
}
.network-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  overflow-x: hidden;
  overflow-y: auto;
  border-top: 3px solid rgb(96, 96, 96);
  border-bottom: 3px solid rgb(96, 96, 96);
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
  padding: 5px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.plugin img {
  width: 69px;
  height: 69px;
  border-radius: 5px;
  border: 2px solid transparent;
  cursor: pointer;
  transition-duration: 0.2s;
}

.plugin img:hover {
  transform: scale(1.05);
  box-shadow: 1px 1px 7px 1px rgb(24, 69, 61);
  transition-duration: 0.3s;
}

.selectedItem {
  transform: scale(1.05);
  border: 2px solid rgb(53, 178, 246) !important;
}

.notAvailable {
  opacity: 0.2;
  pointer-events: none;
}

.networkIcon {
  width: 20px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
