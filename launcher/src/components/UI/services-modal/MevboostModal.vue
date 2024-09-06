<template>
  <div class="w-full h-full absolute inset-0 flex justify-center items-center">
    <div class="w-full h-full absolute indent-0 bg-black opacity-80 rounded-lg z-10" @click="$emit('closeWindow')"></div>
    <div class="browser-modal">
      <div class="mev-header">
        <div class="icon-box">
          <img :src="mevService.icon" alt="icon" />
        </div>

        <div class="title-box">
          <div class="service-name"><span>Flashbots Mev Boost</span></div>
          <div class="service-option">
            <img src="/img/icon/service-modals-icons/internet.png" alt="icon" @click="openBrowser" />
            <img src="/img/icon/service-modals-icons/github.png" alt="icon" @click="openGitHub" />
          </div>
        </div>
      </div>
      <div class="content">
        <div v-if="showRelaysBox" class="relaysParent">
          <div class="relaysBoxTitle">
            {{ $t("serviceModals.availBlockRel") }}
          </div>
          <div class="relaysBox">
            <div class="relaysBoxContent">
              <div v-for="relay in combinedBlocs" :key="relay.id" class="relay">
                <input :id="relay.id" v-model="checkedRelays" type="checkbox" :value="relay" @change="enableBtn" />
                <label :for="relay.id">{{ relay.name }}</label>
                <div v-if="relay.freeCensorship == false" class="iconBox" data-tooltip="OFAC Compliant - censored">
                  <img src="/img/icon/one-click-icons/mevboost-icons/ofac-compliant-icon.png" alt="flag-icon" />
                </div>
              </div>
            </div>
          </div>

          <div class="btn-box">
            <div v-if="loading" class="process">
              {{ $t("serviceModals.process") }}...
              <img class="animate-spin" src="/img/icon/loading-icons/loading-circle.png" alt="icon" />
            </div>
            <span v-else class="btn" :class="{ disabled: applyBtnDisabled }" @click="applyRelays">{{ $t("secretKeyReg.apply") }}</span>
          </div>
        </div>
        <div v-else class="browserBox">
          <div class="title">
            <span>{{ $t("serviceModals.blockRel") }}</span>
            <p>{{ $t("serviceModals.blockRelTxt") }}.</p>
          </div>
          <div class="btn-box">
            <span class="openBtn" @click="displayRelaysBlock">{{ $t("serviceModal.open") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapWritableState } from "pinia";
import { useNodeManage } from "@/store/nodeManage";
import { useServices } from "@/store/services";
import { useSetups } from "@/store/setups";
import ControlService from "@/store/ControlService";
import { toRaw } from "vue";
export default {
  data() {
    return {
      mevService: {},
      isMevAvailable: false,
      showRelaysBox: false,
      checkedRelays: [],
      serviceConfig: {},
      loading: false,
      applyBtnDisabled: true,
      availableBlocks: [],
    };
  },

  computed: {
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapWritableState(useNodeManage, {
      relaysList: "relaysList",
    }),
    ...mapState(useSetups, {
      selectedSetup: "selectedSetup",
    }),
    combinedBlocs() {
      let names = new Set();
      let combined = this.checkedRelays.concat(this.availableBlocks);
      return combined.filter((item) => {
        if (!names.has(item.name)) {
          names.add(item.name);
          return true;
        }
        return false;
      });
    },
  },
  mounted() {
    this.filtermevService();
    this.availableBlocks = this.shuffleRelaysList(this.relaysList.filter((r) => r[this.selectedSetup?.network.toLowerCase()]));
    console.log(this.selectedSetup);
  },
  methods: {
    shuffleRelaysList(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    enableBtn() {
      if (this.checkedRelays.length > 0) {
        this.applyBtnDisabled = false;
      } else {
        this.applyBtnDisabled = true;
      }
    },
    filtermevService() {
      this.installedServices.forEach((item) => {
        if (item.name === "Flashbots Mev Boost") this.mevService = item;
      });

      this.isMevAvailable = true;

      if (this.mevService && this.mevService.config && this.mevService.config.serviceID) {
        ControlService.getServiceConfig(this.mevService.config.serviceID)
          .then((service) => {
            if (service && service.entrypoint) {
              this.serviceConfig = service;
              const relayEntryPointIndex = service.entrypoint.findIndex((e) => e === "-relays");
              if (relayEntryPointIndex !== -1 && relayEntryPointIndex + 1 < service.entrypoint.length) {
                if (service.entrypoint[relayEntryPointIndex + 1]) {
                  const relayURLs = service.entrypoint[relayEntryPointIndex + 1].split(",");
                  relayURLs.forEach((relay) => {
                    let relayData = this.relaysList.find((r) => r[this.selectedSetup?.network.toLowerCase()] === relay);
                    if (relayData) this.checkedRelays.push(relayData);
                  });
                }
              } else {
                console.error("Invalid or missing -relays entry in service entrypoint");
                // Handle the error or add appropriate fallback logic.
              }
            } else {
              console.error("Invalid service or missing entrypoint");
              // Handle the error or add appropriate fallback logic.
            }
          })
          .catch((error) => {
            console.error("Error fetching service config:", error);
            // Handle the error or add appropriate fallback logic.
          });
      } else {
        console.error("Invalid or missing service or serviceID in config");
        // Handle the error or add appropriate fallback logic.
      }
    },

    openBrowser() {
      let url = "https://boost.flashbots.net/";
      window.open(url, "_blank");
    },
    openGitHub() {
      let url = "https://github.com/flashbots/mev-boost";
      window.open(url, "_blank");
    },
    displayRelaysBlock() {
      this.showRelaysBox = true;
    },
    applyRelays() {
      this.loading = true;
      if (this.serviceConfig.entrypoint) {
        this.serviceConfig.entrypoint[this.serviceConfig.entrypoint.findIndex((e) => e === "-relays") + 1] = this.checkedRelays
          .map((r) => r[this.selectedSetup?.network.toLowerCase()])
          .join();
        ControlService.writeServiceConfig(toRaw(this.serviceConfig)).then(() => {
          setTimeout(() => {
            this.loading = false;
            this.$emit("closeWindow");
          }, 2000);
        });
      } else {
        this.loading = false;
        console.error("Invalid service or missing entrypoint");
      }
    },
    closeWindow() {
      this.$emit("closeWindow");
    },
  },
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
[data-tooltip] {
  position: relative;
  cursor: default;
}
[data-tooltip]::after {
  position: absolute;
  width: max-content;
  left: -900%;
  top: -10%;
  text-align: center;
  content: attr(data-tooltip);
  color: #eee;
  background: rgba(170, 0, 30, 0.8);
  border-radius: 5px;
  font-size: 70%;
  font-weight: 600;
  padding: 20% 35%;
  border: 1px solid #929292;
  visibility: hidden;
  opacity: 0;
  transform: translateY(20%);
  transition: opacity 0.3s transform 0.2s;
}
[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
  transform: rotateY(0);
}
.service-modal_parent {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
}

.bg-dark {
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 102;
  cursor: default;
}

.browser-modal {
  width: 60%;
  height: 80%;
  background-color: #1b1c20;
  border: 5px solid rgb(161, 161, 161);
  border-radius: 30px;
  position: absolute;
  top: 9%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 105;
  cursor: default;
}

.mev-header {
  width: 100%;
  height: 20%;
  margin-top: 1.5%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: nowrap;
  position: relative;
  z-index: 102;
}

.icon-box {
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box img {
  width: 70%;
  height: 90%;
}

.title-box {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.service-name {
  width: 100%;
  height: 45%;
  text-align: center;
  color: rgb(226, 226, 226);
  text-transform: uppercase;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.service-option {
  width: 60%;
  height: 38%;
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.service-option img {
  width: 8%;
  height: 72%;
  margin-right: 15px;
  cursor: pointer;
}

.content {
  width: 100%;
  height: 75%;
  height: 75%;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.relayscheck {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.browserBox {
  width: 95%;
  height: 30%;
  background-color: #393939;
  border: 1px solid #444444;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.browserBox .title {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.title span {
  color: #c4c4c4;
  font-size: 0.9rem;
  font-weight: 700;
  margin-left: 10px;
  margin-top: 5px;
  text-transform: uppercase;
}

.title p {
  color: #c8c8c8;
  font-size: 0.7rem;
  font-weight: 400;
  margin-left: 10px;
  margin-top: 10px;
}

.browserBox .btn-box {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}

.browserBox .useBtn {
  width: 80%;
  height: 35%;
  margin-top: 15px;
  margin-right: 10px;
  background-color: transparent;
  text-decoration: none;
  border: 1px solid rgb(40, 40, 41);
  border-radius: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
  color: #e1e1e1;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
}

.btn-box .useBtn .circleOn {
  width: 12%;
  height: 40%;
  border-radius: 50%;
  background-color: #4eec76;
  box-shadow: 1px 1px 10px 1px #4eec76;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-box .useBtn .circleOff {
  width: 15%;
  height: 55%;
  border-radius: 50%;
  background-color: rgb(81, 81, 81);
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-box .useBtn .text {
  color: #e1e1e1;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.browserBox .openBtn {
  width: 80%;
  height: 35%;
  margin-top: 15px;
  margin-right: 10px;
  background-color: #227ee7;
  text-decoration: none;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #e1e1e1;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  transition-duration: all 200ms;
}

.openBtn:hover {
  transition-duration: 100ms;
  background-color: #1564be;
}

.openBtn:active {
  transition-duration: 100ms !important;
  box-shadow: 1px 1px 10px 1px #171717 inset !important;
}
.relaysParent {
  width: 90%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.relaysBox {
  width: 50%;
  height: 70%;
  padding: 2px;
  border: 1px solid #2b3439;
  box-shadow: 1px 1px 10px 1px #0a0a0a;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.iconBox {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 2%;
}
.relaysBoxTitle {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.8rem;
  font-weight: 600;
  color: #aaaaaa;
}
.relaysBoxContent {
  width: 100%;
  height: 97%;
  margin-top: 0.1%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}
.relaysBoxContent::-webkit-scrollbar {
  width: 5px;
}
.relaysBoxContent::-webkit-scrollbar-track {
  background: #23282b;
}
.relaysBoxContent::-webkit-scrollbar-thumb {
  background: #42a5de;
  border-radius: 5px;
}

.relaysBoxContent .relay {
  width: 90%;
  height: 12%;
  min-height: 35px;
  background-color: #32383e;
  border: 1px solid #22272a;
  border-radius: 5px;
  margin-top: 2px;
  padding: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  text-transform: uppercase;
}
.relaysBoxContent .relay:hover {
  background-color: #404851;
  border: 1px solid #3b4246;
  transition-duration: 0.2s;
}
.relaysBoxContent .relay input {
  width: 8%;
  height: 60%;
  border-radius: 2px;
  background-color: rgb(81, 89, 96);
}
.relaysBoxContent .relay label {
  width: 80%;
  height: 100%;
  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.7rem;
  font-weight: 600;
  color: #aaaaaa;
  cursor: pointer;
}
.btn-box {
  width: 100%;
  height: 20%;
  margin: 0 auto;

  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.btn-box .btn {
  width: 50%;
  height: 70%;
  background-color: #227ee7;
  text-decoration: none;
  border: 1px solid #227ee7;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #e1e1e1;
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  transition-duration: all 200ms;
}
.disabled {
  background-color: #031624 !important;
  pointer-events: none;
  opacity: 0.5;
}
.btn-box span:hover {
  background-color: #1661b7;
  color: #dddddd;
  transition-duration: 100ms;
}
.btn-box span:active {
  transition-duration: 100ms !important;
  box-shadow: 1px 1px 10px 1px #171717 inset !important;
  border: none;
}
.btn-box .process {
  width: 50%;
  height: 70%;
  background-color: #227ee7;
  text-decoration: none;
  border: 1px solid #227ee7;
  border-radius: 50px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #e1e1e1;
  font-size: 1rem;
  font-weight: 700;
  text-transform: capitalize;
  pointer-events: none;
}
.process img {
  width: 10%;
}
</style>
