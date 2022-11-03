<template>
  <div class="addParent">
    <div class="addBox">
      <div
        class="replaceService"
        v-if="items.category !== 'service'"
        @click="$emit('changePlugin', items)"
      >
        <img src="/img/icon/manage-node-icons/replace.png" alt="icon" />
      </div>
      <div class="service">
        <img :src="plugin.icon" alt="icon" />
        <div class="service-details">
          <span class="serviceName">{{ plugin.name }}</span>
          <p class="category">
            {{ plugin.category }}
            <span v-if="plugin.category !== 'service'">Client</span>
          </p>
        </div>
      </div>
      <div class="configBox">
        <div
          class="relaysBox"
          v-if="plugin.service === 'FlashbotsMevBoostService'"
        >
          <div class="relaysBoxTitle">AVAILABLE BLOCK RELAYS</div>
          <div class="relaysBoxContent">
            <div class="relay" v-for="relay in relaysList" :key="relay.id">
              <input
                type="checkbox"
                :id="relay.id"
                :value="relay"
                v-model="checkedRelays"
              />
              <label :for="relay.id">{{ relay.name }}</label>
            </div>
          </div>
        </div>
        <div
          class="change-installation"
          v-if="
            replaceServiceActive &&
            plugin.service !== 'FlashbotsMevBoostService'
          "
        >
          <div class="change-title">
            <span>INSTALLATION PATH</span>
          </div>
          <div class="change-box">
            <input type="text" v-model="installationPath" maxlength="255" />
          </div>
        </div>
        <div
          class="fast-sync"
          v-if="
            (plugin.category === 'execution' ||
              plugin.category === 'consensus') &&
            replaceServiceActive
          "
        >
          <div class="sync-header">
            <div class="headerTitle">
              <span>SYNC</span>
            </div>
            <div class="headerContent">
              <img
                @click="changeTheOption"
                src="/img/icon/arrows/left-arrow.png"
                alt="icon"
              />
              <span v-if="genesisIsActive">GENESIS</span>
              <span v-if="checkPointIsActive">CHECKPOINT</span>
              <img
                @click="changeTheOption"
                src="/img/icon/arrows/right-arrow.png"
                alt="icon"
              />
            </div>
          </div>
          <div class="content">
            <span v-if="genesisIsActive"
              >SYNCS YOUR CLIENT FROM THE BEGINNING OF THE CHAIN</span
            >
            <div class="inputBox" v-if="checkPointIsActive">
              <input type="text" v-model="checkPointSync" />
            </div>
          </div>
        </div>
        <div
          class="portAddBox"
          v-if="plugin.service !== 'FlashbotsMevBoostService'"
        >
          <img src="/img/icon/manage-node-icons/port.png" alt="icon" />
          <div class="portConfig">
            <span>PORT USED</span>
            <input type="text" v-model="port" placeholder="9000" />
          </div>
        </div>
        <template v-for="service in options" :key="service.id">
          <div
            class="optionsBox"
            v-if="!switchHandler(service)"
            @click="changeSelectedServiceToConnect(service)"
          >
            <img src="/img/icon/manage-node-icons/connect.png" alt="icon" />
            <div class="optionsDetails">
              <span class="category">{{ service.category }} Client</span>
              <div class="optionsName">
                <span>{{ service.name }}</span>
              </div>
            </div>
          </div>
          <div
            class="clientAddBox"
            v-if="switchHandler(service)"
            @click="changeSelectedServiceToConnect(service)"
          >
            <img src="/img/icon/manage-node-icons/connected.png" alt="icon" />
            <div class="connectionConfig">
              <span class="category">{{ service.category }} Client</span>
              <span class="name">{{ service.name }}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="btnBox">
        <div class="cancelBtn" @click="$emit('cancelModify')">
          <span>Cancel</span>
        </div>
        <div class="addBtn" @click="$emit('saveModify')">
          <span>SAVE</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useNodeManage } from "../../../store/nodeManage";

export default {
  props: ["items"],
  data() {
    return {
      modalActive: false,
      removeServicesModal: false,
      removeIsConfirmed: false,
      genesisIsActive: true,
      checkPointIsActive: false,
      replaceServiceActive: false,
      serviceIsSelected: false,
      installationPath: "",
      checkPointSync: "",
      plugin: {},
      port: "",
      selected: {},
      options: [],
    };
  },
  computed: {
    ...mapWritableState(useNodeManage, {
      actionContents: "actionContents",
      newConfiguration: "newConfiguration",
      relaysList: "relaysList",
      checkedRelays: "checkedRelays",
    }),
  },
  watch: {
    items: {
      handler: function (val) {
        this.plugin = val;
        this.optionsToConnect();
      },
      immediate: true,
    },
  },
  methods: {
    switchHandler(service) {
      if (service.selectedForConnection) {
        return service.selectedForConnection;
      }
      return false;
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
    optionsToConnect() {
      if (this.items.category === "consensus") {
        this.options = this.newConfiguration.filter(
          (service) => service.category === "execution"
        );
      } else if (this.items.category === "validator") {
        this.options = this.newConfiguration.filter(
          (service) => service.category === "consensus"
        );
      } else {
        this.options = [];
      }
      this.options = this.options.map((option) => {
        return {
          ...option,
          selectedForConnection: false,
        };
      });
    },
    changeSelectedServiceToConnect(service) {
      service.selectedForConnection = !service.selectedForConnection;
    },
  },
};
</script>
<style scoped>
html {
  box-sizing: border-box;
}
.addParent {
  grid-column: 1;
  width: 100%;
  height: 100%;
  margin-top: 1px;
  display: flex;
  background: #3a3d40;
  border-right: 5px solid rgb(31, 31, 31);
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  transition-duration: 500ms;
  box-sizing: border-box;
}

.activeAddPanel {
  position: relative !important;
  transition-duration: 2s !important;
}
.addBox {
  width: 98%;
  height: 99%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #3a3d40;
  border-radius: 10px;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
}
.replaceService {
  width: 17%;
  height: 6%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  margin: 0 auto;
  position: absolute;
  top: 1%;
  right: 3%;
  box-sizing: border-box;
}
.replaceService img {
  width: 90%;
  height: 90%;
  object-fit: contain;
  cursor: pointer;
}
.replaceService img:hover {
  transform: scale(1.1);
  transition-duration: 200ms;
}
.replaceService img:active {
  transform: scale(1);
  transition-duration: 200ms;
}
.service {
  width: 98%;
  height: 10%;
  margin-top: 15%;
  padding: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.service img {
  width: 25%;
}

.service-details {
  width: 70%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.service-details .serviceName {
  width: 100%;
  height: 60%;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 700;
  color: #c8c8c8;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
  box-sizing: border-box;
}
.service-details p,
.service-details p span {
  width: max-content;
  height: 40%;
  text-align: left;
  font-size: 0.6rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: flex-start;
  box-sizing: border-box;
}

.configBox {
  width: 95%;
  height: 70%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}

.configBox .change-installation {
  width: 100%;
  height: 12%;
  border-radius: 5px;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
}
.change-installation .change-title {
  width: 90%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.change-title span {
  color: #c0c0c0;
  font-size: 0.7rem;
  font-weight: 700;
  box-sizing: border-box;
}
.change-installation .change-box {
  width: 96%;
  height: 45%;
  background-color: rgb(209, 209, 209);
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
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
  font-size: 0.65rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 4px;
  outline: none !important;
  outline-style: none !important;
  box-sizing: border-box;
}
.configBox .fast-sync {
  width: 100%;
  height: 13%;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  border-radius: 10px 0 3px 3px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.fast-sync .sync-header {
  width: 100%;
  height: 40%;
  border: 1px solid #2b2b2b;
  border-radius: 15px 0 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}
.fast-sync .sync-header .headerTitle {
  width: 45%;
  height: 100%;
  border-radius: 15px 0 0 15px;
  background-color: #316355;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}
.headerTitle span {
  width: 86%;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cdcdcd;
  text-align: center;
  margin-right: 3px;
  box-sizing: border-box;
}
.fast-sync .sync-header .headerContent {
  width: 55%;
  height: 100%;
  border-radius: 0;
  padding: 0 2px;
  background-color: #414649;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}
.headerContent span {
  width: 86%;
  height: 100%;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cdcdcd;
  text-align: center;
  margin-right: 3px;
  box-sizing: border-box;
}
.headerContent img {
  padding: 1px;
  width: 8%;
  height: 50%;
  cursor: pointer;
}
.fast-sync .content {
  width: 100%;
  height: 64%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.fast-sync .content span {
  font-size: 0.55rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  box-sizing: border-box;
}
.fast-sync .content .inputBox {
  width: 95%;
  height: 70%;
  background-color: #d1d1d1;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
}
.fast-sync .content input {
  width: 100%;
  height: 100%;
  background-color: rgb(209, 209, 209);
  border: none;
  border-radius: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.65rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 4px;
  box-sizing: border-box;
}
.portAddBox {
  width: 100%;
  height: 12%;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  border-radius: 3px;
  margin-top: 10px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.clientAddBox {
  width: 100%;
  height: 12%;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  border: 1px solid #25282d;
  border-radius: 3px;
  margin-top: 10px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.clientAddBox:hover {
  background-color: #2d3336;
  border: 1px solid #32363b;
  transition-duration: 0.2s;
}
.portAddBox img {
  padding: 1px;
  width: 18%;
  height: 80%;
  opacity: 0.5;
}
.clientAddBox img {
  padding: 1px;
  width: 16%;
  height: 80%;
  opacity: 0.5;
}
.portConfig {
  width: 80%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.portConfig span {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  box-sizing: border-box;
}
.portConfig input {
  width: 96%;
  height: 55%;
  background-color: rgb(14, 14, 14);
  border: 1px solid rgb(53, 53, 53);
  border-radius: 30px;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #b0b0b0;
  padding: 0;
  margin-top: 3%;
  box-sizing: border-box;
}
.connectionConfig {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2px;
  box-sizing: border-box;
}

.connectionConfig .category {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
  box-sizing: border-box;
}
.connectionConfig .name {
  width: 99%;
  height: 60%;
  background-color: rgb(14, 14, 14);
  border: 1px solid rgb(53, 53, 53);
  border-radius: 30px;
  margin-top: 3%;
  padding: 2px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #34a061;
  text-align: center;
  text-transform: uppercase;
  box-sizing: border-box;
}
.btnBox {
  width: 100%;
  height: 6%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  bottom: 20px;
  box-sizing: border-box;
}
.addBtn {
  width: 40%;
  height: 95%;
  background-color: #116b5f;
  color: #dfdfdf;
  border-radius: 5px;
  border: 1px solid #11675c;
  box-shadow: 0 1px 3px 1px #2d2f31;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
  box-sizing: border-box;
}
.addBtn:hover {
  background-color: #0d4f46;
  transition-duration: 0.2s;
}
.addBtn:active {
  background-color: #0d4f46;
  transition-duration: 0.2s;
  transform: scale(0.9);
}
.cancelBtn {
  width: 40%;
  height: 95%;
  background-color: #d75442;
  color: #dfdfdf;
  border-radius: 5px;
  border: 1px solid #d75442;
  box-shadow: 0 1px 3px 1px #2d2f31;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
  box-sizing: border-box;
}
.cancelBtn:hover {
  background-color: #b84738;
  transition-duration: 0.2s;
}
.cancelBtn:active {
  background-color: #b84738;
  transition-duration: 0.2s;
  transform: scale(0.9);
}
.optionsBox {
  width: 100%;
  height: 12%;
  background-color: #23282b;
  box-shadow: 1px 1px 3px 1px #16191b;
  border: 1px solid #242424;
  border-radius: 3px;
  margin-top: 10px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
}
.optionsBox:hover {
  background-color: #2d3336;
  border: 1px solid #32363b;
  transition-duration: 0.2s;
}
.optionsBox img {
  padding: 1px;
  width: 17%;
  height: 90%;
  opacity: 0.5;
}
.optionsDetails {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2px;
  box-sizing: border-box;
}
.optionsDetails .category {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
  box-sizing: border-box;
}
.optionsName {
  width: 99%;
  height: 60%;
  background-color: rgb(14, 14, 14);
  border: 1px solid rgb(53, 53, 53);
  border-radius: 30px;
  margin-top: 3%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.optionsName span {
  padding: 2px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #9a9a9a;
  text-align: center;
  align-self: center;
  text-transform: uppercase;
  box-sizing: border-box;
}
.relaysBox {
  width: 100%;
  height: 100%;
  padding: 2px;
  background-color: #23282b;
  border: 1px solid #22272a;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}
.relaysBoxTitle {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 0.7rem;
  font-weight: 600;
  color: #aaaaaa;
}
.relaysBoxContent {
  width: 100%;
  height: 90%;
  margin-top: 10px;
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
  width: 100%;
  height: 12%;
  min-height: 35px;
  background-color: #2e3438;
  border: 1px solid #22272a;
  border-radius: 5px;
  margin-top: 2px;
  padding: 3px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
}
.relaysBoxContent .relay:hover {
  background-color: #3b4246;
  border: 1px solid #3b4246;
  transition-duration: 0.2s;
}
.relaysBoxContent .relay input {
  width: 10%;
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
</style>
