<template>
  <installation-box
    :title="selectedPreset.name"
    :back="back"
    :next="nextRouteHandler ? 'mevboost' : 'verify'"
    :icon="selectedPreset.icon"
    :btn="disabledBtn"
  >
    <div class="verify-parent">
      <div class="content-box">
        <div class="table-box">
          <div class="table">
            <div class="table-header">
              <span>{{ $t("fastSync.header") }}</span>
            </div>
            <div class="table-content">
              <div class="table-row_1">
                <div class="clientTitle">
                  <span>{{ $t("fastSync.client") }}</span>
                  <span>{{ $t("fastSync.syncSrc") }}</span>
                </div>
              </div>
              <div class="table-row_2">
                <div class="plugin-name">
                  <div class="serviceIcon">
                    <img :src="executionClient.icon" alt="icon" />
                  </div>
                  <div class="serviceBox">
                    <span>{{ executionClient.name }}</span>
                    <span>{{ executionClient.displayCategory }}</span>
                  </div>
                </div>
                <div class="syncBox">
                  <div class="syncContent">
                    <div class="syncText">
                      <span>{{ $t("fastSync.gen") }}</span>
                      <span>{{ $t("fastSync.sync") }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-row_3">
                <ConsensusSync :client="consensusClient" />
              </div>
              <div class="table-row_5">
                <p>
                  {{ $t("fastSync.message") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </installation-box>
</template>
<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "@/store/services";
import ConsensusSync from "./ConsensusSync.vue";
export default {
  components: {
    ConsensusSync,
  },
  data() {
    return {
      genesisIsActive: true,
      checkPointIsActive: false,
      executionClient: {},
      consensusClient: {},
      back: "install",
      next: "",
      title: "",
      disabledBtn: false,
    };
  },

  computed: {
    ...mapWritableState(useClickInstall, {
      selectedPreset: "selectedPreset",
      syncType: "syncType",
      customElements: "customElements",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      allServices: "allServices",
    }),
    nextRouteHandler() {
      if (this.selectedPreset.name === "mev boost") {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.filterServices();
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
    filterServices() {
      this.executionClient = this.selectedPreset.includedPlugins.filter((service) => service.category === "execution")[0];
      this.consensusClient = this.selectedPreset.includedPlugins.filter((service) => service.category === "consensus")[0];
    },
  },
};
</script>
<style scoped>
.verify-parent {
  grid-column: 2/5;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content-box {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 10px;
  background-color: #2d3134;
  border: 3px solid #b4b4b4;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 1px 3px 1px rgb(25, 33, 32);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-box .table {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.table .table-header {
  width: 97%;
  height: 10%;
  margin-top: 2px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table .table-header span {
  width: 100%;
  color: #d5d5d5;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
}
.table .table-content {
  width: 100%;
  height: 90%;
  padding: 5px 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 10% repeat(5, 1fr);
  overflow: hidden;
  position: relative;
}

.table-row_1 {
  grid-column: 1/6;
  grid-row: 1/2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-row_1 .clientTitle {
  width: 100%;
  height: 100%;
  background-color: #4d8384;
  border-radius: 5px;
  padding: 0 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-row_1 .clientTitle span:first-child {
  width: 40%;
  color: #d5d5d5;
  font-size: 0.6rem;
  font-weight: 500;
  text-align: left;
}
.table-row_1 .clientTitle span:last-child {
  width: 78%;
  color: #d5d5d5;
  font-size: 0.6rem;
  font-weight: 500;
  text-align: left;
}
.table-row_2 {
  grid-column: 1/6;
  grid-row: 2/3;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #336666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-row_3 {
  grid-column: 1/6;
  grid-row: 3/4;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.plugin-name {
  width: 25%;
  height: 80%;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plugin-name .serviceIcon {
  width: 40%;
  height: 100%;
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.plugin-name .serviceIcon img {
  width: 80%;
}

.plugin-name .serviceBox {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
.plugin-name .serviceBox span:first-child {
  width: 100%;
  color: #d5d5d5;
  font-size: 0.7rem;
  font-weight: 600;
  text-align: center;
}
.plugin-name .serviceBox span:last-child {
  width: 100%;
  color: #4d8384;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
}

.syncBox {
  width: 60.7%;
  height: 80%;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 32px;
}
.table-row_5 {
  grid-column: 1/6;
  grid-row: 5/7;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-row_5 p {
  width: 90%;
  color: #d5d5d5;
  font-size: 0.8rem;
  margin: 0 auto;
  font-weight: 500;
  text-align: center;
}

.syncBox .syncContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.syncContent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.syncContent .syncText {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-left: 5px;
}

.syncContent .syncText span:first-child {
  width: 100%;
  height: max-content;
  color: #acaeae;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  padding: 2px;
}
.syncContent .syncText span:last-child {
  height: max-content;
  width: 100%;
  color: #4d8384;
  font-size: 0.6rem;
  font-weight: 500;
  text-align: left;
  padding: 2px;
}

.syncContent .inputBox {
  width: 50%;
  height: 100%;
  border-radius: 10px;
  background-color: #1e2226;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inputBox input,
.inputBox .empty {
  width: 100%;
  height: 100%;
  border: 3px solid #23272c;
  border-radius: 5px;
  background-color: #151a1e;
  color: #d5d5d5;
  font-size: 0.8rem;
  font-weight: 400;
  text-align: left;
  padding: 5px;
  padding-left: 10px;
}
.sync-header {
  width: 100%;
  height: 34%;
  border: 1px solid #707070;
  border-radius: 15px 0 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.sync-header .headerTitle {
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
.sync-header .syncContent {
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
.syncContent span {
  width: 86%;
  font-size: 0.65rem;
  font-weight: 500;
  color: #dedede;
  text-align: center;
  margin-right: 3px;
}

.content {
  width: 100%;
  height: 64%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content span {
  font-size: 0.5rem;
  font-weight: 400;
  color: #aaaaaa;
}
.content .inputBox {
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
.content input {
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
.btnBox {
  width: 10%;
  height: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  position: absolute;
  right: 11%;
  bottom: 6%;
  z-index: 1;
}

.install {
  height: 40px;
  min-width: 120px;
  border-radius: 40px;
  border: 3px solid #929292;
  background-color: #194747;
  font-size: 1.2rem;
  font-weight: 700;
  color: rgb(191, 191, 191);
  box-shadow: 0 1px 3px 1px rgb(41, 61, 51);
  outline-style: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.install:hover {
  background-color: rgb(31, 48, 43);
  box-shadow: 0 1px 3px 0 rgb(21, 31, 26);
}
.install:active {
  box-shadow: inset 1px 1px 3px 1px rgb(14, 19, 17);
}
</style>
