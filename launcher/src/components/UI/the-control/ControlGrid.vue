<template>
  <div class="ctrGridParent">
    <div class="plugins-container">
      <control-plugins>
        <div class="plugins-title">
          <span>PLUG-INs</span>
        </div>
        <div class="plugins-table-bg">
          <div class="arrow-up" @click="scrollUp">
            <img src="/img/icon/manage-node-icons/white-arrow-up.png" alt="" />
          </div>
          <div ref="pluginsTable" class="plugins-table">
            <div v-for="(item, index) in installedServices" :key="index" class="plugins-row">
              <div
                class="plugins-pending-state"
                :class="{
                  'plugins-running-state': item.state == 'running',
                  'plugins-exited-state': item.state == 'exited',
                  'plugins-restarting-state': item.state == 'restarting',
                }"
              ></div>
              <div class="plugins-row-content">
                <div class="row-plugin-name">
                  <span>{{ item.name }}</span>
                </div>
                <div class="row-category">
                  <span>{{ item.category }}</span>
                </div>
              </div>
              <div class="service-edit">
                <div class="edit-box">
                  <div class="icon-bg">
                    <div class="power-icon">
                      <img
                        v-if="item.isServicePending"
                        class="pending"
                        src="/img/icon/plugin-menu-icons/turning_circle.gif"
                        alt="icon"
                      />
                      <img
                        v-else-if="item.state == 'running'"
                        src="/img/icon/plugin-menu-icons/shutdown.png"
                        alt="icon"
                        @click.stop="stateHandler(item)"
                      />
                      <img
                        v-else-if="item.state == 'restarting'"
                        src="/img/icon/plugin-menu-icons/restart.png"
                        alt="icon"
                        @click.stop="stateHandler(item)"
                      />
                      <img
                        v-else
                        src="/img/icon/plugin-menu-icons/turn-on.png"
                        alt="icon"
                        @click.stop="stateHandler(item)"
                      />
                    </div>
                  </div>
                  <div class="icon-bg">
                    <div class="seting-icon" @click.stop="expertModeHandler(item)">
                      <img src="/img/icon/plugin-menu-icons/setting8.png" alt="icon" />
                    </div>
                  </div>
                </div>
              </div>
              <the-expert
                v-if="item.expertOptionsModal"
                :item="item"
                position="23.4"
                @hide-modal="hideExpertMode(item)"
                @prunning-warning="runGethPrunningWarning"
                @resync-warning="runResyncWarning"
              ></the-expert>
              <prunning-modal
                v-if="gethPrunningWarningModal"
                :item="item"
                @cancel-warning="hidePrunningWarningsModal"
                @confirm-btn="confirmRunningGethPrunning(option)"
              ></prunning-modal>
              <resync-modal
                v-if="resyncWarningModal"
                :item="item"
                @cancel-warning="hideResyncWarningsModal"
                @confirm-btn="confirmRunningResync"
              ></resync-modal>
            </div>
          </div>
          <div class="arrow-down" @click="scrollDown">
            <img src="/img/icon/manage-node-icons/white-arrow-down.png" alt="icon" />
          </div>
        </div>
      </control-plugins>
    </div>
    <div class="dashboard-container">
      <control-dashboard></control-dashboard>
    </div>
    <div class="alerts">
      <control-alert></control-alert>
    </div>
    <div class="footer"></div>
    <task-manager></task-manager>
  </div>
</template>

<script>
import ControlService from "@/store/ControlService";
import ControlDashboard from "./ControlDashboard.vue";
import ControlPlugins from "./ControlPlugins.vue";
import ControlAlert from "./ControlAlert.vue";
import TheExpert from "../the-node/TheExpert.vue";
import PrunningModal from "../the-node/PrunningModal.vue";
import ResyncModal from "../the-node/ResyncModal.vue";
import TaskManager from "../task-manager/TaskManager.vue";
import { mapWritableState } from "pinia";
import { useServices } from "../../../store/services";
export default {
  components: {
    ControlDashboard,
    ControlPlugins,
    ControlAlert,
    TaskManager,
    TheExpert,
    PrunningModal,
    ResyncModal,
  },
  data() {
    return {
      powerBtnRed: false,
      gethPrunningWarningModal: false,
      resyncWarningModal: false,
      isPluginLogPageActive: false,
    };
  },
  create() {
    this.installedServices = this.installedServices.map((i) => {
      return {
        isServicePending: false,
        ...i,
      };
    });
  },
  computed: {
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
    }),
  },
  methods: {
    scrollUp() {
      this.$refs.pluginsTable.scrollTop -= 50;
    },
    scrollDown() {
      this.$refs.pluginsTable.scrollTop += 50;
    },
    updateStates: async function () {
      let serviceInfos = await ControlService.listServices();
      this.installedServices.forEach((s, idx) => {
        let updated = false;
        serviceInfos.forEach((i) => {
          if (i.Names.replace("stereum-", "") === s.config.serviceID) {
            this.installedServices[idx].state = i.State;
            updated = true;
          }
        });
        if (!updated) {
          this.installedServices[idx].state = "exited";
        }
      });
    },
    stateHandler: async function (item) {
      item.yaml = await ControlService.getServiceYAML(item.config.serviceID);
      if (!item.yaml.includes("isPruning: true")) {
        this.isServiceOn = false;
        item.serviceIsPending = true;
        let state = "stopped";
        if (item.state === "exited") {
          state = "started";
          this.isServiceOn = true;
        }
        try {
          await ControlService.manageServiceState({
            id: item.config.serviceID,
            state: state,
          });
        } catch (err) {
          console.log(state.replace("ed", "ing") + " service failed:\n", err);
        }
        item.serviceIsPending = false;
        this.updateStates();
      }
    },
    hideExpertMode(el) {
      el.expertOptionsModal = false;
    },
    expertModeHandler(el) {
      this.installedServices.map((item) => {
        if (item.category === el.category && item?.id === el.id) el.expertOptionsModal = true;
      });
    },
    // Check if service is Geth
    runGethPrunningWarning(option) {
      if (option.changeValue && option.displayWarningModal) {
        this.gethPrunningWarningModal = true;
      } else if (!option.changeValue || !option.displayWarningModal) {
        this.gethPrunningWarningModal = false;
      }
    },
    //Double check & run Resync modal
    runResyncWarning(option) {
      if (option.changeValue && option.displayResyncModal) {
        this.resyncWarningModal = true;
      } else if (!option.changeValue || !option.displayWarningModal) {
        this.resyncWarningModal = false;
      }
    },
    // Prunning Functions
    hidePrunningWarningsModal(el) {
      this.gethPrunningWarningModal = false;
      el.expertOptions
        .filter((item) => {
          return item.title === "Prunning";
        })
        .map((item) => {
          if (item.changeValue) {
            item.changeValue = false;
          }
        });
    },
    confirmRunningGethPrunning() {
      this.gethPrunningWarningModal = false;
    },

    // Resync Functions
    hideResyncWarningsModal(el) {
      this.resyncWarningModal = false;
      el.expertOptions
        .filter((item) => {
          return item.title === "Resync";
        })
        .map((item) => {
          if (item.changeValue) {
            item.changeValue = false;
          }
        });
    },
    confirmRunningResync() {
      this.resyncWarningModal = false;
    },
  },
};
</script>

<style scoped>
.ctrGridParent {
  display: grid;
  width: 99.95%;
  height: 91%;
  background-color: #242529;
  border: 5px solid #979797;
  border-radius: 10px 35px 10px 10px;
  grid-template-columns: 24% 59% 17%;
  grid-template-rows: 32% 31% 32% 5%;
  z-index: 0;
  text-align: center;
}

.plugins-container {
  background-color: transparent;
  color: white;
  border-top-left-radius: 10px;
  grid-column: 1/2;
  grid-row: 1/4;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.dashboard-container {
  width: 99.1%;
  height: 93%;
  margin-top: 7px;
  color: white;
  grid-column: 2/4;
  grid-row: 1/5;
  z-index: 0;
  border: 4px solid grey;
  border-radius: 20px 27px 20px 20px;
  box-shadow: 1px 1px 10px 1px #171717;
}

.control-panel {
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 4;
}

.alerts {
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
}

.footer {
  width: 100%;
  height: 99%;
  margin: 0 auto;
  grid-column: 1/4;
  grid-row: 4;
  background-color: rgb(52, 52, 52);
  border-radius: 0 0 7px 7px;
}
.plugins-title {
  width: 40%;
  height: 25px;
  background-color: #23272a;
  padding: 2px;
  border: 1px solid #4a5150;
  border-radius: 7px;
  margin: 14px auto 5px auto;
  box-shadow: 0 1px 3px 1px rgb(20, 44, 34);
  display: flex;
  justify-content: center;
  align-items: center;
}
.plugins-title span {
  color: rgb(194, 194, 194);
  font-size: 0.8rem;
  font-weight: 600;
}
.plugins-table-bg {
  width: 90%;
  height: 86%;
  background-color: #23272a;
  border: 1px solid #707070;
  box-shadow: 1px 1px 5px 1px rgb(0, 23, 23);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.arrow-down,
.arrow-up {
  width: 50%;
  height: 10%;
  margin: 5px;
}
.arrow-up img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.arrow-down img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.arrow-down:active,
.arrow-up:active {
  transform: scale(0.9);
}
.plugins-table {
  width: 97%;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(8, 1fr);
}
.plugins-table::-webkit-scrollbar {
  width: 0;
}
.plugins-row {
  width: 97%;
  height: 40px;
  justify-self: center;
  margin-top: 5px;
  background-color: #33393e;
  display: flex;
  justify-content: flex-start;
  border: 1px solid #333;
  border-radius: 3px;
  box-shadow: 0 1px 3px 1px #393939;
}
.plugins-running-state {
  width: 20%;
  height: 100%;
  background-color: #22b53f !important;
  border-radius: 3px;
}
.plugins-exited-state {
  width: 20%;
  height: 100%;
  background-color: #d52727 !important;
  border-radius: 3px;
}
.plugins-restarting-state {
  width: 20%;
  height: 100%;
  background-color: #ff843d !important;
  border-radius: 3px;
}
.plugins-pending-state {
  width: 20%;
  height: 100%;
  background-color: #7d7d7d;
  border-radius: 3px;
}
.plugins-row-content {
  width: 68%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: flex-start;
  margin-left: 5px;
}
.row-plugin-name,
.row-category {
  width: 98%;
  height: 40%;
  color: #eee;
  background-color: #464a44;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
}

.row-plugin-name span,
.row-category span {
  font-size: 0.6rem;
  font-weight: 800;
}
.service-edit {
  width: 12%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.service-edit .edit-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
}
.edit-box .icon-bg {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.power-icon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.seting-icon {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.power-icon img:hover,
.seting-icon img:hover {
  transform: scale(1.1);
  border: 1px solid white;
  border-radius: 100%;
}
.power-icon img:active,
.seting-icon img:active {
  transform: scale(1);
}

.power-icon img {
  width: 16px;
  height: 16px;
}
.powerOff {
  background-color: rgb(226, 62, 62);
}
.powerOn {
  background-color: rgb(113, 205, 136);
}
.power-icon .pending {
  width: 17px;
  height: 17px;
  background-color: rgb(71, 70, 70);
  border-radius: 100%;
  box-shadow: 0 1px 2px 1px rgb(48, 48, 48);
  pointer-events: none;
}

.seting-icon img {
  width: 17px;
  height: 17px;
}

.service-options .control-task__manager {
  position: fixed;
  left: -3px;
  bottom: -1px;
  z-index: 1;
}
</style>
