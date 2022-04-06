<template>
  <div class="plugin-parent">
    <background-page>
      <div class="opacity-bg"></div>
      <div class="plugin-modal-parent">
        <div class="plugin-modal">
          <div class="name-box">
            <div class="name-title-box">
              <div class="name-title">
                <span>{{ selectedPlugin.name }}</span>
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
                      <span>CHOOSEN NETWORK</span>
                    </div>
                    <div class="none">
                      <span>{{ selectedPlugin.network }}</span>
                    </div>
                  </div>
                  <div class="circle-box">
                    <img
                      :src="
                        selectedPlugin.network === 'mainnet'
                          ? this.mainnetIcon
                          : this.testnetIcon
                      "
                      alt="icon"
                    />
                  </div>
                </div>
                <div class="fast-sync">
                  <div class="sync-box">
                    <span>FAST SYNC</span>
                    <toggle-button></toggle-button>
                  </div>
                </div>
                <div class="change-installation">
                  <div class="change-title">
                    <span>CHANGE INSTALLATION PATH</span>
                  </div>
                  <div class="change-box">
                    <span>{{ selectedPlugin.path }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="system-box">
              <div class="system-title">
                <span>SYSTEM</span>
              </div>
              <div class="info-box">
                <div class="system-info">
                  <div class="info-header">
                    <span class="current-title">CURRENT</span>
                    <span class="min-title">MIN</span>
                  </div>
                  <div class="info-titles">
                    <span class="cpu-info">CPU CORES:</span>
                    <span class="memory-info">MEMORY:</span>
                  </div>
                  <div class="info-parent">
                    <div class="info-content">
                      <div class="cpu-cores">
                        <span
                          class="cpu-current"
                          :class="
                            systemInfos.cpu >= selectedPlugin.requirements?.core
                              ? 'passedreq'
                              : 'faildreq'
                          "
                          >{{ systemInfos.cpu }}</span
                        >
                        <span class="cpu-needed">{{
                          selectedPlugin.requirements?.core
                        }}</span>
                      </div>
                      <div class="memory">
                        <span
                          class="memory-current"
                          :class="getClass ? 'passedreq' : 'failedreq'"
                          >{{ systemInfos.memory }}</span
                        >
                        <span class="memory-needed">{{
                          selectedPlugin.requirements?.memory
                        }}</span>
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
import { mapGetters } from "vuex";
export default {
  components: { ToggleButton },

  data() {
    return {
      toggleActive: false,
      requirementPassed: false,
      requirementFailed: false,
      testnetIcon: require("../../../../public/Img/icon/click-installation/testnet-circle.png"),
      mainnetIcon: require("../../../../public/Img/icon/click-installation/mainnet-circle.png"),
    };
  },
  computed: {
    ...mapGetters({
      selectedPlugin: "getSelectedPlugin",
      systemInfos: "getSystemInformation",
      getClass() {
        if(this.selectedPlugin.requirements?.core <= this.systemInfos.memory) {
          return true
        }else {
          return false
        }
      },
    }),
  },
  mounted() {
    if (Object.keys(this.selectedPlugin).length === 0) {
      this.$router.push("/clickinstall");
    }
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
.name-box {
  width: 95%;
  height: 20%;
  background-color: #c2bebe;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
}
.name-title-box {
  width: 95%;
  height: 80%;
  border-radius: 20px;
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
.option-title,
.system-title {
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
.system-title span {
  color: #d3d3d3;
  font-size: 0.9rem;
  font-weight: 700;
}
.content-box {
  width: 95%;
  height: 63%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.options-box {
  width: 48%;
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
  font-size: 0.85rem;
  font-weight: 700;
  margin-left: 20px;
  color: rgba(6, 181, 76, 0.982);
  text-transform: uppercase;
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
  border: 2px solid rgb(93, 92, 92);
  border-radius: 15px;
  background-color: #30483b;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
}
.fast-sync .sync-box span {
  width: 90%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #d3d3d3;
  text-align: left;
  margin-left: 7px;
}
.sync-box .toggle-btn {
  width: 35%;
  height: 90%;
  border: 2px solid rgb(129, 167, 210);
  border-radius: 15px;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: 1px;
}
.toggle-btn .toggle {
  width: 52%;
  height: 93%;
  border: 1px solid rgb(129, 167, 210);
  border-radius: 50px;
  background-color: rgb(11, 97, 201);
  box-shadow: inset 0 1px 7px #2a9dce;
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
  justify-content: flex-start;
  align-items: center;
}
.change-installation .change-box span {
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 10px;
}
.system-box {
  width: 48%;
  height: 95%;
  background-color: #5b5b5b;
  border-radius: 20px;
  box-shadow: 0 1px 4px 1px rgb(31, 47, 43);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.info-box {
  width: 90%;
  height: 45%;
  margin-top: 10px;
  background-color: transparent;
  border: 2px solid rgb(74, 73, 73);
  border-radius: 16px;
  box-shadow: 0 1px 3px 1px rgb(42, 42, 42), inset 0 1px 3px 1px rgb(43, 43, 43);
  display: flex;
  justify-content: center;
  align-items: center;
}
.system-info {
  width: 93%;
  height: 89%;
  border-radius: 12px;
  background-color: rgb(60, 60, 60);
  display: grid;
  grid-template-columns: repeat(4, 24%);
  grid-template-rows: 20% 40% 40%;
  padding: 2px 5px;
}
.info-parent {
  width: 100%;
  grid-column: 3/5;
  grid-row: 2/4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-parent .info-content {
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.info-content .cpu-cores,
.info-content .memory {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-content .cpu-cores span {
  width: 50%;
  height: 20px;
  border: 2px solid #4a4949;
  border-radius: 16px;
  background-color: #222222;
  text-align: center;
  box-shadow: 0 1px 3px 1px #1c1d1d;
  padding-top: 2px;
  margin-right: 2px;
  margin-bottom: 7px;
}
.info-content .memory span {
  width: 50%;
  height: 20px;
  border: 2px solid rgb(74, 73, 73);
  border-radius: 16px;
  background-color: rgb(34, 34, 34);
  text-align: center;
  box-shadow: 0 1px 4px 1px rgb(28, 29, 29);
  padding-top: 2px;
  margin-right: 2px;
}
.info-parent .cpu-current,
.info-parent .memory-current {
  font-size: 0.9rem;
  font-weight: 700;
}
.info-parent .cpu-needed,
.info-parent .memory-needed {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(215, 195, 42);
}

.info-header {
  width: 70%;
  margin-left: 5px;
  grid-column: 3/5;
  grid-row: 1/2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-header span {
  font-size: 0.6rem;
  font-weight: 600;
  color: #d3d3d3;
}
.info-header .min-title {
  margin-left: 15px;
}
.info-titles {
  width: 70%;
  grid-column: 1/3;
  grid-row: 2/4;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.info-titles span {
  width: 100%;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  color: #d3d3d3;
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
  box-shadow: 0 1px 2px 1px #353e39, inset 1px 1px 3px 1px #546c5f;
}
.next-btn:hover,
.back-btn:hover {
  background-color: #1a3535;
  box-shadow: 0 1px 4px 1px rgb(60, 60, 60),
    inset 1px 1px 5px 1px rgb(67, 86, 67);
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
