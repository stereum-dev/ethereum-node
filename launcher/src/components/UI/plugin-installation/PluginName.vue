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
                      <span>{{ plugin.category }}</span>
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
import ToggleButton from './toggleButton.vue'
import { mapGetters } from 'vuex'
export default {
  components: { ToggleButton },

  data () {
    return {
      toggleActive: false,
      requirementPassed: false,
      requirementFailed: false,
      testnetIcon: require('../../../../public/img/icon/click-installation/testnet-circle.png'),
      mainnetIcon: require('../../../../public/img/icon/click-installation/mainnet-circle.png')
    }
  },
  computed: {
    ...mapGetters({
      selectedPreset: 'getSelectedPreset',
      plugins: 'getAllPlugins',
      getInstallationPath: 'getInstallationPath'
    }),
    installationPath: {
      get () {
        return this.getInstallationPath
      },
      set (val) {
        this.$store.commit('mutatedInstallationPath', val)
      }
    }

    // getMemoryClass() {
    //   if (this.systemInfos.memory >= this.selectedPreset.requirements?.memory) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    // getCpuClass() {
    //   if (this.systemInfos.cpu >= this.selectedPreset.requirements?.core) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
  },
  mounted () {
    if (Object.keys(this.selectedPreset).length === 0) {
      this.$router.push('/clickinstall')
    }
  }
}
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
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 15% 85%;
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
  width: 88%;
  height: 83%;
  margin: 10px auto;
  padding: 5px;
  border: 2px solid #343434;
  background-color: #282828;
  border-radius: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto;
}
.info-box::-webkit-scrollbar {
  width: 1px;
}
.info-row {
  grid-column: 1;
  width: 100%;
  height: 90%;
  margin-top: 5px;
  background-color: #33393e;
  border: 1px solid rgb(81, 80, 80);
  box-shadow: 0 1px 3px 1px rgb(19, 19, 19);
  border-radius: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}
.content {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.plugin-name {
  width: 100%;
  max-width: auto;
  height: 90%;
  text-align: left;
}
.plugin-name span {
  font-size: 0.8rem;
  font-weight: 800;
  color: rgb(203, 203, 203);
  margin-left: 10px;
}
.icon-box {
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.plugin-icon {
  width: 61%;
  height: 79%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.plugin-icon img {
  width: 98%;
  height: 98%;
  border-radius: 50%;
  border: 2px solid rgb(84, 84, 84);
  box-shadow: 0 1px 3px 1px rgb(23, 23, 23);
}
.category {
  width: 100%;
  max-width: auto;
  height: 90%;
  text-align: left;
}
.category span {
  font-size: 0.7rem;
  font-weight: 800;
  color: rgb(115, 115, 115);
  text-transform: uppercase;
  margin-left: 10px;
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
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
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
  border: 2px solid #6a6a6a;
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
  border: 2px solid #6a6a6a;
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
  height: 45%;
  margin: 5px;
  border: 3px solid rgb(93, 92, 92);
  border-radius: 15px;
  background-color: #30483b;
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
  height: 40%;
  background-color: rgb(209, 209, 209);
  border: 5px solid rgb(104, 104, 104);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change-box input {
  width: 100%;
  height: 85%;
  background-color: rgb(209, 209, 209);
  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  padding-left: 10px;
}

.btn-box {
  width: 95%;
  height: 12%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.btn-box a {
  width: 95%;
  height: 90%;
  text-decoration: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.next-btn,
.back-btn {
  width: 55%;
  height: 60%;
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
</style>
