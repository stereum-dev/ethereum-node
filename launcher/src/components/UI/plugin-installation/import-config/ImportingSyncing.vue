<template>
  <installation-box :title="title" :back="back" :next="nextRouteHandler" :icon="selectedPreset.icon" :btn="disabledBtn">
    <div class="verify-parent">
      <div class="content-box">
        <div class="table-box">
          <div class="table">
            <div class="table-header">
              <img :src="configNetwork.icon" alt="Icon" />
              <span>{{ configNetwork.name }}</span>
            </div>
            <div class="tableTitle">
              <span>Set how the Node clients will synchronize their blockchain data.</span>
            </div>
            <div class="table-content">
              <div class="table-row_1">
                <div class="clientTitle">
                  <span>CLIENTs</span>
                  <span>SYNC SOURCE</span>
                </div>
              </div>
              <div v-if="configServices.some((s) => s.category === 'execution')" class="table-row_2">
                <ExecutionSync :client="executionClient" />
              </div>
              <div v-if="configServices.some((s) => s.category === 'consensus')" class="table-row_3">
                <ConsensusSync :client="consensusClient" :config-network="configNetwork" />
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
import ConsensusSync from "../ConsensusSync.vue";
import ExecutionSync from "./ExecutionSync.vue";
export default {
  name: "ImportingSyncing",
  components: {
    ConsensusSync,
    ExecutionSync,
  },
  data() {
    return {
      genesisIsActive: true,
      checkPointIsActive: false,
      executionClient: {},
      consensusClient: {},
      back: "importingList",
      next: "importingVerify",
      title: "IMPORTED CONFIG",
      disabledBtn: false,
    };
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    nextRouteHandler() {
      if (!this.btnActive) {
        return this.checkPointSync !== "" || !this.checkPointSync ? "importingVerify" : "disabled";
      } else if (this.btnActive) {
        return "importingVerify";
      }
    },
    ...mapWritableState(useClickInstall, {
      selectedPreset: "selectedPreset",
      syncType: "syncType",
      btnActive: "btnActive",
      checkPointSync: "checkPointSync",
      customElements: "customElements",
      configServices: "configServices",
      configNetwork: "configNetwork",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      allServices: "allServices",
    }),
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
      this.executionClient = this.configServices.filter((service) => service.category === "execution")[0];
      this.consensusClient = this.configServices.filter((service) => service.category === "consensus")[0];
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
.table-header {
  width: 100%;
  height: 11%;
  max-height: 40px;
  margin-top: 2px;
  padding: 1px 5px;
  background-color: transparent;
  border: 2px solid rgb(76, 129, 137);
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr;
}
.table-header img {
  width: 30px;
  grid-column: 1/2;
  grid-row: 1/2;
}
.table-header span {
  grid-column: 2/6;
  grid-row: 1/2;
  font-size: 1rem;
  font-weight: 500;
  color: #e1e1e1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table .tableTitle {
  width: 97%;
  height: 10%;
  margin-top: 2px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table .tableTitle span {
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
  height: 80%;
  margin-top: 10px;
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
  font-size: 0.7rem;
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
.syncContent img {
  width: 5%;
  height: 50%;
  cursor: pointer;
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
