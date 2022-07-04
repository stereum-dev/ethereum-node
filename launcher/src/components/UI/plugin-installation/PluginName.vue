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
                <span>OPTION</span>
              </div>
              <div class="option-content">
                <div class="network-parent">
                  <div class="network-box">
                    <div class="choose">
                      <span>CHOSEN NETWORK</span>
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
                <div class="fast-sync">
                  <div class="sync-box">
                    <toggle-button></toggle-button>
                    <span>FAST SYNC</span>
                  </div>
                </div>
                <div class="change-installation">
                  <div class="change-title">
                    <span>CHANGE INSTALLATION PATH</span>
                  </div>
                  <div class="change-box">
                    <input type="text" v-model="installationPath" />
                  </div>
                </div>
              </div>
            </div>
            <div class="included-box">
              <div class="included-title">
                <span>PLUGINS</span>
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
                          @mousedown.prevent.stop
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
            <router-link :to="{ path: '/clickinstall' }">
              <button class="back-btn">BACK</button>
            </router-link>
            <router-link :to="{ path: '/verify' }">
              <button class="next-btn">NEXT</button>
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
    }),
    ...mapWritableState(useServices, {
      allPlugins: "allServices",
    }),
  },
  beforeMount() {},
  mounted() {
    if (Object.keys(this.selectedPreset.includedPlugins).length === 0) {
      this.$router.push("/clickinstall");
    }
    this.selectedPreset.includedPlugins =
      this.selectedPreset.includedPlugins.map((item) => {
        return {
          showChangeModal: false,
          ...item,
        };
      });
  },
  methods: {
    pluginChangeHandler(el, item, idx) {
      el.showChangeModal = false;
      if (el.category === "execution") {
        this.selectedPreset.includedPlugins[idx] = item;
      }
      if (el.category === "validator" || el.category === "consensus") {
        this.selectedPreset.includedPlugins[idx] = item;
      }
    },
    // validatorAndConsensusHandler(el, item, idx) {
    //   this.selectedPreset.includedPlugins.map((param) => {
    //     if (
    //       param.name === this.selectedPreset.includedPlugins[idx].name &&
    //       (param.category === "validator" || param.category === "consensus")
    //     ) {
    //       // this.filteredPluginsOnName.push(param);
    //       param = item;
    //     }
    //   });
    // },
    pluginExChange(el) {
      this.selectedPreset.includedPlugins.filter((item) => {
        item.showChangeModal = false;
        if (item?.service === el.service && item?.id === el.id) {
          this.checkPluginCategory(item);
        }
      });
      el.showChangeModal = true;
    },
    checkPluginCategory(element) {
      this.filteredPluginsOnCategory = this.allPlugins.filter(
        (item) => item.category === element.category && item.id != element.id
      );
    },
    // runTooltip(el) {
    //   this.filteredPluginsOnName = this.allPlugins.filter((param) => {
    //     param.id == el.id;
    //   }).forEach(e => {
    //   })
    // },
    runningTooltip(el) {
      this.allPlugins.filter((i) => {
        i.category == el.category && i.id == el.id;
        el.displayTooltip = true;
      });
      // .map((e) => {
      //   e.displayTooltip = true;

      // });
      console.log(el);
      console.log(el.displayTooltip);
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
  display: flex;
  justify-content: center;
  align-items: center;
}
.replaced-plugins .item {
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.replaced-plugins .item img {
  width: 30px;
  height: 30px;
  border: 2px solid rgb(175, 175, 175);
  box-shadow: 0 1px 3px 1px rgb(47, 47, 47);
  border-radius: 100%;
}
.replaced-plugins .item img:hover {
  transform: scale(1.07);
  border: 2px solid rgb(123, 208, 251);
}

.replaced-plugins .item img:active {
  transform: scale(1);
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
  height: 25%;
  background-color: rgb(118, 118, 118);
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
}
.fast-sync .sync-box {
  width: 45%;
  height: 52%;
  margin: 5px;
  border: 3px solid #8f8f8f;
  border-radius: 15px;
  background-color: #1a5443;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.fast-sync .sync-box span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 700;
  color: #d3d3d3;
  text-align: center;
  margin-right: 3px;
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
  width: 90%;
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
  justify-content: space-evenly;
  align-items: center;
}
.next-btn,
.back-btn {
  width: 100%;
  height: 100%;
  border: 2px solid rgb(125, 125, 125);
  border-radius: 20px;
  background-color: #336666;
  color: #eaeaea;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 1px 2px 1px #353e39;
  outline-style: none;
  cursor: pointer;
}
.next-btn:hover,
.back-btn:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60);
}
.next-btn:active,
.back-btn:active {
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
  height: max-content;
  background-color: rgb(42, 42, 42);
  border: 1px solid #3c3c3c;
  border-radius: 3px;
  padding: 2px 3px;
  position: absolute;
  top: 10px;
  left: 10%;
  font-size: 0.7rem;
  font-weight: 500;
  color: #cfcfcf;
  text-align: center;
}
</style>
