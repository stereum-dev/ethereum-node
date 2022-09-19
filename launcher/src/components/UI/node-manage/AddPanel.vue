<template>
  <div class="addParent">
    <div class="addBox">
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
        <div class="change-installation">
          <div class="change-title">
            <span>INSTALLATION PATH</span>
          </div>
          <div class="change-box">
            <input type="text" v-model="installationPath" maxlength="255" />
          </div>
        </div>

        <div class="portAddBox">
          <img src="/img/icon/manage-node-icons/port.png" alt="icon" />
          <div class="portConfig">
            <span>PORT USED</span>
            <input type="text" v-model="port" placeholder="9000" />
          </div>
        </div>
        <template v-for="service in options" :key="service.id">
          <div
            class="optionsBox"
            v-if="!serviceIsSelected"
            @click="chooseServiceToConnect(service)"
          >
            <img src="/img/icon/manage-node-icons/connect.png" alt="icon" />
            <div class="optionsDetails">
              <span class="category">{{ service.category }} Client</span>
              <div class="optionsName">
                <span>{{ service.name }}</span>
              </div>
            </div>
          </div>
        </template>
        <div
          class="clientAddBox"
          v-if="serviceIsSelected"
          @click="changeSelectedServiceToConnect"
        >
          <img src="/img/icon/manage-node-icons/connected.png" alt="icon" />
          <div class="connectionConfig">
            <span class="category">{{ selected.category }} Client</span>
            <span class="name">{{ selected.name }}</span>
          </div>
        </div>
        <div
          class="fast-sync"
          v-if="
            plugin.category === 'execution' || plugin.category === 'consensus'
          "
        >
          <div class="sync-header">
            <div class="headerTitle">
              <span>SYNC</span>
            </div>
            <div class="headerContent">
              <img
                @click="changeResyncOptions"
                src="/img/icon/arrows/left-arrow.png"
                alt="icon"
              />
              <span v-if="genesisIsActive">GENESIS</span>
              <span v-if="checkPointIsActive">CHECKPOINT</span>
              <img
                @click="changeResyncOptions"
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
      </div>
      <div class="btnBox">
        <div class="cancelBtn" @click="$emit('cancelAdd')">
          <span>Cancel</span>
        </div>
        <div class="addBtn" @click="$emit('saveConfig')">
          <span>ADD</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useClickInstall } from "@/store/clickInstallation";
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
      serviceIsSelected: false,
      plugin: {},
      port: "",
      selected: {},
      options: [],
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
    }),
    ...mapWritableState(useNodeManage, {
      actionContents: "actionContents",
    }),
    ...mapWritableState(useClickInstall, {
      installationPath: "installationPath",
      checkPointSync: "checkPointSync",
    }),
  },
  mounted() {
    this.plugin = this.items;
    this.optionsToConnect();
  },
  methods: {
    changeResyncOptions() {
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
        this.options = this.allServices.filter(
          (service) => service.category === "execution"
        );
        this.options = this.options.map((option) => {
          return {
            ...option,
            selectedServiceToSync: false,
          };
        });
      } else if (this.items.category === "validator") {
        this.options = this.allServices.filter(
          (service) => service.category === "consensus"
        );
        this.options = this.options.map((option) => {
          return {
            ...option,
            selectedServiceToSync: false,
          };
        });
      } else if (this.items.category === "execution") {
        this.options = [];
        return;
      }
    },
    chooseServiceToConnect(item) {
      if (this.items.category === "consensus") {
        this.options.map((i) => {
          if (i.category === "execution" && i.id === item.id) {
            i.selectedServiceToSync = true;
            this.selected = i;
          }
        });
      } else if (this.items.category === "validator") {
        this.options.forEach((i) => {
          if (i.category === "consensus" && i.id === item.id) {
            i.selectedServiceToSync = true;
            this.selected = i;
          }
        });
      } else if (this.items.category === "execution") {
        return;
      }
      this.serviceIsSelected = true;
    },
    changeSelectedServiceToConnect() {
      this.serviceIsSelected = false;
    },
  },
};
</script>
<style scoped>
.addParent {
  grid-column: 1;
  width: 100%;
  height: 100%;
  margin-top: 1px;
  display: flex;
  background-color: #606060;
  /* background-color: #606060; */
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  transition-duration: 500ms;
}

.addBox {
  width: 98%;
  height: 99%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #3a3a3a;
  border-radius: 10px;
  margin: 0 auto;
}
.service {
  width: 98%;
  height: 10%;
  margin-top: 13%;
  padding: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.service-details .serviceName {
  width: 100%;
  height: 60%;
  text-align: left;
  font-size: 1rem;
  font-weight: 800;
  color: #c8c8c8;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
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
}

.configBox {
  width: 95%;
  height: 80%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.configBox .change-installation {
  width: 100%;
  height: 10%;
  border-radius: 5px;
  background-color: #316355;
  box-shadow: 1px 1px 3px 1px rgb(27, 27, 27);
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
  color: #c0c0c0;
  font-size: 0.6rem;
  font-weight: 600;
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
}
.configBox .fast-sync {
  width: 100%;
  height: 13%;
  background-color: #315e45;
  background-color: #242424;
  box-shadow: 1px 1px 3px 1px rgb(10, 10, 10);
  border-radius: 10px 0 5px 5px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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
}
.headerTitle span {
  width: 86%;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cdcdcd;
  text-align: center;
  margin-right: 3px;
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
}
.headerContent span {
  width: 86%;
  font-size: 0.7rem;
  font-weight: 700;
  color: #cdcdcd;
  text-align: center;
  margin-right: 3px;
}
.headerContent img {
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
}
.fast-sync .content span {
  font-size: 0.55rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
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
}
.portAddBox,
.clientAddBox {
  width: 100%;
  height: 10%;
  background-color: #242424;
  box-shadow: 1px 1px 3px 1px rgb(10, 10, 10);
  border-radius: 5px;
  margin-top: 8px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.portAddBox img {
  width: 18%;
  opacity: 0.5;
}
.clientAddBox img {
  width: 16%;
  opacity: 0.5;
}
.portConfig {
  width: 80%;
  height: 99%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.portConfig span {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
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
}


.btnBox {
  width: 100%;
  height: 6%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  bottom: 20px;
}
.addBtn {
  width: 40%;
  height: 95%;
  background-color: #0d4f46;
  color: #a8a8a8;
  border-radius: 5px;
  border: 1px solid #11675c;
  box-shadow: 0 1px 3px 1px #262626;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
}
.addBtn:hover {
  background-color: #116b5f;
  transition-duration: 0.2s;
  color: #dfdfdf;
}
.addBtn:active {
  background-color: #0d4f46;
  transition-duration: 0.2s;
  transform: scale(0.9);
}
.cancelBtn {
  width: 40%;
  height: 95%;
  background-color: #2a2a2a;
  color: #a8a8a8;
  border-radius: 5px;
  border: 1px solid #414141;
  box-shadow: 0 1px 3px 1px #1c1c1c;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: center;
}
.cancelBtn:hover {
  background-color: #d75442;
  transition-duration: 0.2s;
  color: #dfdfdf;
}
.cancelBtn:active {
  background-color: #b84738;
  transition-duration: 0.2s;
  transform: scale(0.9);
}
.optionsBox {
  width: 100%;
  height: 10%;
  background-color: #242424;
  box-shadow: 1px 1px 3px 1px rgb(10, 10, 10);
  border: 1px solid #242424;
  border-radius: 5px;
  margin-top: 8px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.optionsBox:hover {
  background-color: #2f2f2f;
  border: 1px solid #464646;
  transition-duration: 0.2s;
}
.optionsBox img {
  width: 16%;
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
}
.optionsDetails .category {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
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
}
.optionsName span {
  padding: 2px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #9a9a9a;
  text-align: center;
  align-self: center;
  text-transform: uppercase;
}
.clientAddBox {
  width: 100%;
  height: 10%;
  background-color: #242424;
  border: 1px solid #242424;
  box-shadow: 1px 1px 3px 1px rgb(10, 10, 10);
  border-radius: 5px;
  margin-top: 8px;
  padding: 1px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.clientAddBox:hover {
  background-color: #2f2f2f;
  border: 1px solid #464646;
  transition-duration: 0.2s;
}
.portAddBox img {
  width: 18%;
  height: 80%;
  opacity: 0.5;
}
.clientAddBox img {
  width: 16%;
  height: 80%;
  opacity: 0.5;
}
.connectionConfig {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2px;
}

.connectionConfig .category {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
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
}
</style>
