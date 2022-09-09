<template>
  <div class="modifyParent">
    <div class="modifyBox">
      <div class="service">
        <img :src="plugin.sIcon" alt="icon" />
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
            <span v-if="genesisIsActive"
              >SYNCS YOUR CLIENT FROM THE BEGINNING OF THE CHAIN</span
            >
            <div class="inputBox" v-if="checkPointIsActive">
              <input type="text" v-model="checkPointSync" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useClickInstall } from "@/store/clickInstallation";

export default {
  props: ["items"],
  data() {
    return {
      modalActive: false,
      removeServicesModal: false,
      removeIsConfirmed: false,
      plugin: {},
    };
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      allServices: "allServices",
    }),
    ...mapWritableState(useClickInstall, {
      installationPath: "installationPath",
      checkPointSync: "checkPointSync",
    }),
  },
  mounted() {
    this.plugin = this.items;
  },
  methods: {},
};
</script>
<style scoped>
.modifyParent {
  grid-column: 1;
  width: 100%;
  height: 100%;
  padding: 5px;
  margin-top: 1px;
  display: flex;
  background-color: #242424;
  background-color: #606060;
  justify-content: center;
  align-items: center;
}
.modifyBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #2b2b2b;
  border-radius: 10px;
  margin: 0 auto;
}
.service {
  width: 95%;
  height: 10%;
  margin-top: 15%;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.service img {
  width: 25%;
}

.service-details {
  width: 70%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.service-details span:first-child {
  width: 100%;
  height: 60%;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 800;
  color: #aaaaaa;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clservicecategory;
}
.service-details span:last-child {
  width: 100%;
  height: 40%;
  text-align: left;
  font-size: 0.6rem;
  font-weight: 600;
  color: #8a8a8a;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clservicecategory;
}

.configBox {
  width: 95%;
  height: 30%;
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.configBox .change-installation {
  width: 100%;
  height: 30%;
  border-radius: 5px;
  background-color: #3c4540;
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
  width: 98%;
  height: 50%;
  background-color: rgb(209, 209, 209);
  border: 2px solid rgb(68, 68, 68);
  border-radius: 5px;
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
  font-size: 0.6rem;
  font-weight: 600;
  color: #232323;
  padding: 0;
  padding-left: 7px;
  outline: none !important;
  outline-style: none !important;
}
.configBox .fast-sync {
  width: 100%;
  height: 30%;
  background-color: #3c4540;
  border-radius: 5px;
  margin-top: 5px;
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
</style>
