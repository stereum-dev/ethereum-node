<template>
  <installation-box :title="selectedPreset.name" :icon="selectedPreset.icon" :next="nextPath" :back="backPath">
    <div class="content-box">
      <div class="included-box">
        <div class="included-title">
          <span>{{ $t("pluginName.plugin") }}</span>
        </div>
        <div class="info-box">
          <div v-for="(plugin, index) in selectedPreset.includedPlugins" :key="index" class="info-row">
            <change-modal v-if="plugin.showChangeModal">
              <div class="replaced-plugins">
                <div
                  v-for="(item, idx) in filteredPluginsOnCategory"
                  :key="idx"
                  class="item"
                  :data-tooltip="item.name"
                  @click="pluginChangeHandler(plugin, item, index)"
                >
                  <img
                    :src="item.icon"
                    alt="icon"
                    @mouseover="runningTooltip(item)"
                    @mouseleave="item.displayTooltip = false"
                  />
                </div>
              </div>
            </change-modal>
            <div class="row" @click="pluginExChange(plugin)">
              <div class="icon-box">
                <div class="plugin-icon">
                  <img :src="plugin.icon" alt="icon" />
                </div>
              </div>
              <div class="content">
                <div class="pluginName">
                  <span>{{ plugin.name }}</span>
                </div>
                <div class="category">
                  <span>{{ plugin.displayCategory }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="options-box">
        <div class="option-title">
          <span>{{ $t("pluginName.option") }}</span>
        </div>
        <div class="option-content">
          <div class="optionHeader">
            <span>{{ $t("pluginName.addOpt") }}</span>
          </div>
          <div class="option-content_box gap-y-2">
            <div class="network-parent">
              <div class="network-box">
                <div class="none">
                  <span>{{ currentNetwork.name }}</span>
                </div>
              </div>
              <div class="circle-box">
                <img :src="currentNetwork.icon" alt="icon" />
              </div>
            </div>
            <div class="change-installation gap-y-2">
              <div class="change-title">
                <span>{{ $t("pluginName.path") }}</span>
              </div>
              <div class="change-box">
                <input v-model="installationPath" type="text" />
              </div>
            </div>
            <div v-if="selectedPreset.name === 'stereum on arm'" class="change-installation gap-y-2">
              <div class="change-title">
                <span>MONITORING</span>
              </div>
              <div class="change-box">
                  <span>Install Monitoring?</span>
                  <input v-model="installMonitoring" class="switch" type="checkbox">
              </div>
            </div>  
            <!-- <div class="set-recipient gap-y-2">
              <div class="set-title">
                <span>SET DEFAULT FEE RECIPIENT</span>
              </div>
              <div class="set-box">
                <input v-model="recipientFee" type="text" disabled />
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </installation-box>
</template>
<script>
import ChangeModal from "./ChangeModal.vue";
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import ControlService from "@/store/ControlService";
import { useServices } from "../../../store/services";
import { useNodeManage } from "../../../store/nodeManage";

export default {
  components: { ChangeModal },

  data() {
    return {
      toggleActive: false,
      requirementPassed: false,
      requirementFailed: false,
      activeExecutionClient: false,
      activeConsensusClient: false,
      activeValidatorClient: false,
      exchangeModalActive: false,
      filteredPluginsOnCategory: [],
      filteredPluginsOnName: [],
      categoryDisplayName: "",
      recipientFee: "",
      nextPath: "sync",
      backPath: "selectPlugin",
      mevPath: "mevboost",
      installMonitoring: false,
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      currentNetwork: "currentNetwork",
      networkList: "networkList",
    }),
    ...mapWritableState(useClickInstall, {
      selectedPreset: "selectedPreset",
      plugins: "presets",
      installationPath: "installationPath",
      checkPointSync: "checkPointSync",
    }),
    ...mapWritableState(useServices, {
      allPlugins: "allServices",
    }),
  },
    watch:{
    installMonitoring(){
      this.filterMonitoringServices()
    }
  },
  mounted() {
    this.selectedPluginsValidation();
    this.pushNewProperthyToPresets();
    this.sortPlugins();
    this.getInstallPath();
  },
  methods: {
    filterMonitoringServices(){
      if(this.installMonitoring){
        this.selectedPreset.includedPlugins = this.selectedPreset.includedPlugins.concat(this.allPlugins.filter(s => ["GrafanaService", "PrometheusNodeExporterService", "PrometheusService"].includes(s.service)))
      } else{
        this.selectedPreset.includedPlugins = this.selectedPreset.includedPlugins.filter(s => !["GrafanaService", "PrometheusNodeExporterService", "PrometheusService"].includes(s.service))
      }
    },
    selectedPluginsValidation() {
      if (Object.keys(this.selectedPreset.includedPlugins).length === 0) {
        this.$router.push("/selectPlugin");
      }
    },
    pushNewProperthyToPresets() {
      this.selectedPreset.includedPlugins = this.selectedPreset.includedPlugins.map((item) => {
        return {
          showChangeModal: false,
          ...item,
        };
      });
    },
    pluginChangeHandler(el, item, idx) {
      el.showChangeModal = false;
      this.selectedPreset.includedPlugins[idx] = item; //no matter what change the service you clicked on
      if (["staking", "mev boost", "stereum on arm"].includes(this.selectedPreset.name)) {
        //if the preset is staking:
        if (item.category === "consensus") {
          //and you just changed the consensus client
          let valIndex = this.selectedPreset.includedPlugins.findIndex((e) => e.category === "validator"); //find the index of the current validator service
          this.selectedPreset.includedPlugins[valIndex] = this.allPlugins.find(
            (e) => e.service === item.name + "ValidatorService"
          ); //change the validator service to the matching one
        } else if (item.category === "validator") {
          //otherwise if you changed the validator client do the same for the consensus client
          let conIndex = this.selectedPreset.includedPlugins.findIndex((e) => e.category === "consensus");
          this.selectedPreset.includedPlugins[conIndex] = this.allPlugins.find(
            (e) => e.service === item.name + "BeaconService"
          );
        }
      }
    },
    sortPlugins() {
      //sorts includedPlugins in this order: EXECUTION -> CONSENSUS -> VALIDATOR -> SERVICE
      if (this.selectedPreset.includedPlugins) {
        const ec = this.selectedPreset.includedPlugins.filter((p) => p.category === "execution");
        const cc = this.selectedPreset.includedPlugins.filter((p) => p.category === "consensus");
        const vc = this.selectedPreset.includedPlugins.filter((p) => p.category === "validator");
        const services = this.selectedPreset.includedPlugins.filter((p) => p.category === "service");
        this.selectedPreset.includedPlugins = new Array().concat(ec, cc, vc, services);
      }
    },
    pluginExChange(el) {
      if (el.category !== "service") {
        this.selectedPreset.includedPlugins.filter((item) => {
          item.showChangeModal = false;
          if (item?.service === el.service) {
            this.checkPluginCategory(item);
          }
        });
        el.showChangeModal = true;
      }
    },
    checkPluginCategory(element) {
      let filter;
      switch (
        this.selectedPreset.name //apply filter depending on which preset was chosen
      ) {
        case "staking":
          filter = (item) =>
            item.category === element.category &&
            !/(SSVNetwork|Web3Signer|Charon)/.test(item.service);
          if (this.currentNetwork.network == "gnosis") {
            filter = (item) =>
              item.category === element.category &&
              /(Lighthouse|Teku|Nethermind)/.test(item.service);
          }
          break;
        case "ssv.network":
          filter = (item) => {
            if (element.category === "validator") {
              return item.service === "SSVNetworkService";
            }
            return item.category === element.category;
          };
          break;
        case "obol":
          filter = (item) => {
            if (element.category === "validator" && element.service !== "CharonService") {
              return item.service === "TekuValidatorService";
            } else if (element.category === "validator") {
              return item.service === "CharonService";
            }
            if (element.category === "consensus") {
              return item.service === "LighthouseBeaconService";
            }
            if (element.category === "execution") {
              return item.service === "GethService";
            }
          };
          break;
        case "rocketpool":
          //filter = (item) => item.category === element.category
          break;
        case "mev boost":
          filter = (item) =>
            item.category === element.category &&
            !/(SSVNetwork|Web3Signer|Charon)/.test(item.service);
          break;
        case "stereum on arm":
          filter = (item) =>
            item.category === element.category &&
            !/(Prysm|SSVNetwork|Web3Signer|Charon)/.test(item.service);
          if (this.currentNetwork.network == "gnosis") {
            filter = (item) =>
              item.category === element.category &&
              /(Lighthouse|Teku|Nethermind)/.test(item.service);
          }
          break;
        default:
          break;
      }
      this.filteredPluginsOnCategory = this.allPlugins.filter(filter);
    },
    runningTooltip(el) {
      this.allPlugins.filter((i) => {
        i.category === el.category && i.id == el.id;
        el.displayTooltip = true;
      });
    },
    backToHistoryHandler() {
      history.back();
    },

    getInstallPath: async function () {
      let largestVolumePath = await ControlService.getLargestVolumePath();
      if (largestVolumePath === "/") largestVolumePath = largestVolumePath + "opt";
      const stereumInstallationPath = [largestVolumePath, "/stereum"].join("/").replace(/\/{2,}/, "/");
      this.installationPath = stereumInstallationPath;
    },
  },
};
</script>
<style scoped>
.content-box {
  grid-column: 2/5;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 10px 3px;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 1px 3px 1px rgb(25, 33, 32);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.included-box {
  width: 50%;
  height: 100%;
  margin: 0 auto;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.options-box {
  width: 50%;
  height: 100%;
  margin: 0 auto;
  padding: 0 8px;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.option-title,
.included-title {
  width: 90%;
  height: 25px;
  border: 1px solid rgb(98, 98, 98);
  border-radius: 10px;
  padding: 5px 0;
  display: flex;
  background-color: #33393e;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}
.option-title span,
.included-title span {
  color: #d3d3d3;
  font-size: 0.7rem;
  font-weight: 400;
}
.info-box {
  width: 94%;
  height: 91%;
  margin: 10px auto;
  background-color: #080808;
  border: 1px solid #b4b4b4;
  padding: 2px 5px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 2px solid #545454;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info-box::-webkit-scrollbar {
  width: 1px;
}
.info-row {
  width: 100%;
  height: 45px;
  margin-top: 5px;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.row {
  width: 100%;
  height: 100%;
  background-color: #33393e;
  box-shadow: 0 1px 3px 1px rgb(19, 19, 19);
  border: 2px solid #33393e;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  transition-duration: 50ms;
}
.row:hover {
  border: 2px solid #1d7ecd;
  transition-duration: 50ms;
}
.content {
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pluginName {
  width: 83%;
  height: 90%;
  margin-left: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.pluginName span {
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  color: rgb(203, 203, 203);
  margin-left: 2px;
}
.icon-box {
  width: 15%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 4px;
}

.plugin-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.plugin-icon img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid rgb(133, 133, 133);
}

.category {
  width: 17%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.category span {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(89, 136, 101);
  border-radius: 100%;
  text-transform: uppercase;
}

.replaced-plugins {
  width: 100%;
  height: 100%;
  border-radius: 10px 10px 0 0;
  background-color: #2b3034;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.replaced-plugins .item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}
.replaced-plugins .item img {
  width: 30px;
  height: 30px;
  border: 2px solid rgb(175, 175, 175);
  box-shadow: 0 1px 3px 1px rgb(47, 47, 47);
  border-radius: 100%;
}

.name-box {
  width: 95%;
  height: 20%;
  margin-top: 5px;
  background-color: #8e8e8e;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.name-title-box {
  width: 96%;
  height: 80%;
  border-radius: 15px;
  background-color: #5b5b5b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.name-title span {
  font-size: 2rem;
  font-weight: 800;
  color: #d7d7d7;
  text-transform: uppercase;
}

.options-box .option-content {
  width: 100%;
  height: 78%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.optionHeader {
  width: 100%;
  height: 25px;
  border: 1px solid rgb(98, 98, 98);
  border-radius: 10px;
  padding: 5px 0;
  display: flex;
  background-color: #33393e;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}
.optionHeader span {
  font-size: 0.7rem;
  font-weight: 400;
  color: rgb(214, 214, 214);
  text-transform: uppercase;
}
.option-content .option-content_box {
  width: 100%;
  height: 100%;
  margin: 2px auto 10px auto;
  background-color: #080808;
  border: 1px solid #b4b4b4;
  padding: 5px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 2px solid #545454;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.option-content .network-parent {
  width: 100%;
  height: 30%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: absolute;
  top: -5px;
  right: 0;
}
.network-parent .network-box {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
  margin-right: -20px;
}
.network-box .choose {
  width: 80%;
  height: 51%;
  border: 2px solid #7f7d7d;
  border-radius: 15px;
  background-color: #30483b;
  margin-bottom: 2px;
  color: #d3d3d3;
  text-align: left;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.choose span {
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: 10px;
}
.network-box .none {
  width: 70%;
  height: 30%;
  border: 2px solid #838383;
  border-radius: 30px;
  background-color: #2a2a2a;
  color: #d3d3d3;
  display: flex;
  justify-content: center;
  align-items: center;
}
.none span {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(171, 180, 92, 0.982);
  text-transform: capitalize;
}
.network-parent .circle-box {
  width: 26%;
  height: 70%;
  border: 2px solid #5b5b5b;
  border-radius: 50%;
  background-color: #1f1f1f;
  display: flex;
  justify-content: center;
  align-items: center;
}
.network-parent .circle-box img {
  width: 90%;
  height: 90%;
  border: 2px solid #5b5b5b;
  border-radius: 100%;
}

.option-content .change-installation,
.option-content .set-recipient {
  width: 100%;
  height: 30%;
  padding: 0 2px 2px 2px;
  border-radius: 10px;
  border: 1px solid rgb(78, 78, 78);
  background-color: #383838;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.change-installation .change-title,
.set-recipient .set-title {
  width: 100%;
  height: 40%;
  border-radius: 50px;
  background-color: #336666;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-title span,
.set-title span {
  color: #d3d3d3;
  font-size: 0.8rem;
  font-weight: 500;
}
.change-installation .change-box,
.set-recipient .set-box {
  width: 96%;
  height: 50%;
  background-color: rgb(209, 209, 209);
  border: 3px solid rgb(104, 104, 104);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.change-box input,
.change-box span,
.set-box input {
  width: 100%;
  height: 100%;
  background-color: rgb(209, 209, 209);
  border: none;
  border-radius: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 7px;
  padding-bottom: 3px;
}
</style>
