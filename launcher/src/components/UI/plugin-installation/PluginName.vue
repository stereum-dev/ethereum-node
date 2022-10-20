<template>
  <div class="plugin-parent">
    <background-page>
      <div class="opacity-bg"></div>
      <div class="plugin-modal-parent">
        <div class="plugin-modal">
          <div class="name-box">
            <div class="name-title-box">
              <div class="name-title">
                <span>{{ selectedPreset.name }}</span>
              </div>
            </div>
          </div>
          <div class="content-box">
            <div class="options-box">
              <div class="option-title">
                <span>{{ $t("pluginName.option") }}</span>
              </div>
              <div class="option-content">
                <div class="network-parent">
                  <div class="network-box">
                    <div class="choose">
                      <span>{{ $t("pluginName.chosen") }}</span>
                    </div>
                    <div class="none">
                      <span>{{ selectedPreset.network }}</span>
                    </div>
                  </div>
                  <div class="circle-box">
                    <img
                      :src="
                        selectedPreset.network === 'mainnet'
                          ? this.mainnetIcon
                          : this.testnetIcon
                      "
                      alt="icon"
                    />
                  </div>
                </div>
                <div class="change-installation">
                  <div class="change-title">
                    <span>{{ $t("pluginName.path") }}</span>
                  </div>
                  <div class="change-box">
                    <input type="text" v-model="installationPath" />
                  </div>
                </div>
                <div class="fast-sync">
                  <div class="sync-header">
                    <div class="headerTitle">
                      <span>SYNCHRONISATION</span>
                    </div>
                    <div class="headerContent">
                      <img
                        @click="changeTheOption"
                        src="/img/icon/arrows/left-arrow.png"
                        alt="icon"
                      />
                      <span v-if="genesisIsActive">GENESIS</span>
                      <span v-if="checkPointIsActive">CHECKPOINT SYNC</span>
                      <img
                        @click="changeTheOption"
                        src="/img/icon/arrows/right-arrow.png"
                        alt="icon"
                      />
                    </div>
                  </div>
                  <div class="content">
                    <span v-if="genesisIsActive">{{
                      $t("pluginName.syncClient")
                    }}</span>
                    <div class="inputBox" v-if="checkPointIsActive">
                      <input type="text" v-model="checkPointSync" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="included-box">
              <div class="included-title">
                <span>{{ $t("pluginName.plugin") }}</span>
              </div>
              <div class="info-box">
                <div
                  class="info-row"
                  v-for="(plugin, index) in selectedPreset.includedPlugins"
                  :key="index"
                >
                  <change-modal v-if="plugin.showChangeModal">
                    <div class="replaced-plugins">
                      <div
                        class="item"
                        v-for="(item, idx) in filteredPluginsOnCategory"
                        :key="idx"
                        @click="pluginChangeHandler(plugin, item, index)"
                      >
                        <img
                          :src="item.icon"
                          alt="icon"
                          @mouseover="runningTooltip(item)"
                          @mouseleave="item.displayTooltip = false"
                        />
                        <span class="tooltip" v-if="item.displayTooltip">{{
                          item.name
                        }}</span>
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
                      <div class="plugin-name">
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
          </div>
          <div class="btn-box">
            <router-link :to="{ path: '/selectPlugin' }">
              <span>{{ $t("pluginName.back") }}</span>
            </router-link>
            <router-link :to="{ path: '/verify' }">
              <span>{{ $t("pluginName.next") }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </background-page>
  </div>
</template>
<script>
import ToggleButton from "./toggleButton.vue";
import ChangeModal from "./ChangeModal.vue";
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "../../../store/services";
export default {
  components: { ToggleButton, ChangeModal },

  data() {
    return {
      genesisIsActive: true,
      checkPointIsActive: false,
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
      testnetIcon: require("../../../../public/img/icon/click-installation/testnet-circle.png"),
      mainnetIcon: require("../../../../public/img/icon/click-installation/mainnet-circle.png"),
    };
  },
  computed: {
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
  mounted() {
    this.selectedPluginsValidation();
    this.pushNewProperthyToPresets();
    this.sortPlugins();
  },
  methods: {
    selectedPluginsValidation() {
      if (Object.keys(this.selectedPreset.includedPlugins).length === 0) {
        this.$router.push("/selectPlugin");
      }
    },
    pushNewProperthyToPresets() {
      this.selectedPreset.includedPlugins =
        this.selectedPreset.includedPlugins.map((item) => {
          return {
            showChangeModal: false,
            ...item,
          };
        });
    },
    pluginChangeHandler(el, item, idx) {
      el.showChangeModal = false;
      this.selectedPreset.includedPlugins[idx] = item; //no matter what change the service you clicked on
      if (this.selectedPreset.name === "staking") {
        //if the preset is staking:
        if (item.category === "consensus") {
          //and you just changed the consensus client
          let valIndex = this.selectedPreset.includedPlugins.findIndex(
            (e) => e.category === "validator"
          ); //find the index of the current validator service
          this.selectedPreset.includedPlugins[valIndex] = this.allPlugins.find(
            (e) => e.service === item.name + "ValidatorService"
          ); //change the validator service to the matching one
        } else if (item.category === "validator") {
          //otherwise if you changed the validator client do the same for the consensus client
          let conIndex = this.selectedPreset.includedPlugins.findIndex(
            (e) => e.category === "consensus"
          );
          this.selectedPreset.includedPlugins[conIndex] = this.allPlugins.find(
            (e) => e.service === item.name + "BeaconService"
          );
        }
      }
    },
    sortPlugins() {
      //sorts includedPlugins in this order: EXECUTION -> CONSENSUS -> VALIDATOR -> SERVICE
      if (this.selectedPreset.includedPlugins) {
        const ec = this.selectedPreset.includedPlugins.filter(
          (p) => p.category === "execution"
        );
        const cc = this.selectedPreset.includedPlugins.filter(
          (p) => p.category === "consensus"
        );
        const vc = this.selectedPreset.includedPlugins.filter(
          (p) => p.category === "validator"
        );
        const services = this.selectedPreset.includedPlugins.filter(
          (p) => p.category === "service"
        );
        this.selectedPreset.includedPlugins = new Array().concat(
          ec,
          cc,
          vc,
          services
        );
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
            item.service !== "SSVNetworkService";
          break;
        case "ssv.network":
          filter = (item) => {
            if (element.category === "validator") {
              return item.service === "SSVNetworkService";
            }
            return item.category === element.category;
          };
          break;
        case "obol ssv":
          //filter = (item) => item.category === element.category
          break;
        case "rocketpool":
          //filter = (item) => item.category === element.category
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
    changeTheOption() {
      if (this.genesisIsActive) {
        this.genesisIsActive = false;
        this.checkPointIsActive = true;
      } else {
        this.checkPointIsActive = false;
        this.genesisIsActive = true;
      }
    },
  },
};
</script>
<style scoped>
.plugin-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
.opacity-bg {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  position: fixed;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 1;
}
.plugin-modal-parent {
  width: 80%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 11.2%;
  left: 10%;
  z-index: 2;
}
.plugin-modal {
  width: 70%;
  height: 95%;
  border: 1px solid rgba(38, 38, 38, 0.5);
  border-radius: 20px;
  background-color: #334b3e;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.included-box {
  width: 49%;
  height: 95%;
  background-color: #5b5b5b;
  border-radius: 20px;
  box-shadow: 0 1px 3px 1px rgb(34, 54, 49);
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 15% 85%;
  position: relative;
}
.included-title {
  width: 61%;
  height: 71%;
  border: 1px solid rgb(98, 98, 98);
  margin: 0 auto;
  border-radius: 10px;
  display: flex;
  background-color: #30483b;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  box-shadow: 0 1px 3px 1px rgb(67, 67, 67);
}
.info-box {
  width: 94%;
  height: 91%;
  margin: 10px auto;
  padding: 2px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 2px solid #343434;
  background-color: #282828;
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
.plugin-name {
  width: 83%;
  height: 90%;
  margin-left: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.plugin-name span {
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
  height: 43px;
  border-radius: 10px 10px 0 0;
  background-color: #2b3034;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
}
.replaced-plugins .item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
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
.name-title-box span {
  font-size: 2rem;
  font-weight: 900;
  color: #d7d7d7;
  text-transform: uppercase;
}
.option-title {
  width: 60%;
  height: 11%;
  border: 1px solid rgb(98, 98, 98);
  border-radius: 10px;
  display: flex;
  background-color: #30483b;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  box-shadow: 0 1px 3px 1px rgb(67, 67, 67);
}
.option-title span,
.included-title span {
  color: #d3d3d3;
  font-size: 0.9rem;
  font-weight: 700;
}
.content-box {
  width: 95%;
  height: 63%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.options-box {
  width: 49%;
  height: 95%;
  background-color: #5b5b5b;
  border-radius: 20px;
  box-shadow: 0 1px 3px 1px rgb(35, 56, 50);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.options-box .option-content {
  width: 94%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.option-content .network-parent {
  width: 100%;
  height: 30%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.network-parent .network-box {
  width: 85%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.network-box .choose {
  width: 90%;
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
  height: 45%;
  border: 2px solid #838383;
  border-radius: 30px;
  background-color: #2a2a2a;
  align-self: flex-end;
  color: #d3d3d3;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.none span {
  font-size: 0.8rem;
  font-weight: 700;
  margin-left: 25px;
  color: rgba(171, 180, 92, 0.982);
  text-transform: capitalize;
}
.network-parent .circle-box {
  width: 24%;
  height: 93%;
  border: 2px solid #5b5b5b;
  border-radius: 50%;
  background-color: #1f1f1f;
  position: absolute;
  right: 3%;
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

.option-content .fast-sync {
  width: 100%;
  height: 30%;
  background-color: #343434;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.fast-sync .sync-header {
  width: 100%;
  height: 34%;
  border: 1px solid #929090;
  border-radius: 15px 0 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.fast-sync .sync-header .headerTitle {
  width: 45%;
  height: 100%;
  border-radius: 15px 0 0 15px;
  background-color: #1a5443;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.headerTitle span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}
.fast-sync .sync-header .headerContent {
  width: 55%;
  height: 100%;
  border-radius: 0;
  padding: 0 5px;
  background-color: #33393e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.headerContent span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}
.headerContent img {
  width: 5%;
  height: 50%;
  cursor: pointer;
}
.fast-sync .content {
  width: 100%;
  height: 64%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fast-sync .content span {
  font-size: 0.5rem;
  font-weight: 400;
  color: #aaaaaa;
}
.fast-sync .content .inputBox {
  width: 96%;
  height: 74%;
  background-color: rgb(209, 209, 209);
  border: 5px solid rgb(104, 104, 104);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.fast-sync .content input {
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
.option-content .change-installation {
  width: 100%;
  height: 30%;
  border-radius: 10px;
  background-color: #30483b;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.change-installation .change-title {
  width: 90%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-title span {
  color: #d3d3d3;
  font-size: 0.6rem;
  font-weight: 600;
}
.change-installation .change-box {
  width: 96%;
  height: 50%;
  background-color: rgb(209, 209, 209);
  border: 5px solid rgb(104, 104, 104);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.change-box input {
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

.btn-box {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.btn-box a {
  width: 25%;
  height: 60%;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-box a span {
  width: 100%;
  border: 2px solid rgb(125, 125, 125);
  border-radius: 20px;
  background-color: #336666;
  color: #eaeaea;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 1px #353e39;
  outline-style: none;
  cursor: pointer;
  text-align: center;
}

.btn-box a span:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60);
}

.btn-box a span:active {
  box-shadow: inset 1px 1px 5px 1px rgb(28, 36, 28);
  font-size: 0.8rem;
}

.passedreq {
  color: #16d26e !important;
}
.faildreq {
  color: rgb(225, 54, 54) !important;
  border: 1px solid rgb(225, 54, 54) !important;
}
.tooltip {
  width: max-content;
  height: 15px;
  background-color: rgb(42, 42, 42);
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  padding: 0 3px 3px 3px;
  position: absolute;
  top: 5px;
  left: 25%;
  transform: translate(-5px, -5px);
  font-size: 0.6rem;
  font-weight: 400;
  color: #dce2e9;
  text-align: center;
  display: inline-block;
}
</style>
