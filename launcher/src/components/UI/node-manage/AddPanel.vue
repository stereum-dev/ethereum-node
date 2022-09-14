<template>
  <div class="addParent">
    <div class="addBox">
      <div class="service">
        <img :src="plugin.icon" alt="icon" />
        <div class="service-details">
          <span class="serviceName">{{ plugin.name }}</span>
          <span class="category">{{ plugin.category }} Client</span>
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
        <div class="portAddBox">
          <img src="/img/icon/manage-node-icons/port.png" alt="icon" />
          <div class="portConfig">
            <span>PORT USED</span>
            <input type="text" v-model="port" placeholder="9000" />
          </div>
        </div>
        <div class="clientAddBox">
          <img src="/img/icon/manage-node-icons/connect.png" alt="icon" />
          <div class="connectionConfig">
            <span>{{ plugin.category }} Client</span>
            <div class="plusBtn">+</div>
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
      plugin: {},
      port: "",
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
  },
  methods: {
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

.service-details span:first-child {
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
.service-details span:last-child {
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
  height: 13%;
  border-radius: 5px;
  background-color: #316355;
  box-shadow: 1px 1px 3px 1px rgb(10, 10, 10);
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
  font-size: 0.7rem;
  font-weight: 700;
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
  height: 13%;
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
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
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
  width: 99%;
  height: 45%;
  background-color: rgb(14, 14, 14);
  border: 1px solid rgb(53, 53, 53);
  border-radius: 30px;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #b0b0b0;
  padding: 0;
}
.connectionConfig {
  width: 80%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.connectionConfig span {
  width: max-content;
  height: 30%;
  font-size: 0.6rem;
  font-weight: 700;
  color: #b3b3b3;
  text-align: center;
  text-transform: uppercase;
}
.connectionConfig .plusBtn {
  width: 100%;
  height: 45%;
  background-color: #c9c9c9;
  color: #2a2a2a;
  border-radius: 30px;
  border: 1px solid #a8a8a8;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  color: #222222;
  text-align: center;
}
.plusBtn:hover {
  transform: scale(1.01);
  color: #c9c9c9;
  font-weight: 600;
  background-color: #285c4e;
  transition-duration: 0.2s;
}
.plusBtn:active {
  background-color: #1c3c33;
  transform: scale(0.9);
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
</style>
