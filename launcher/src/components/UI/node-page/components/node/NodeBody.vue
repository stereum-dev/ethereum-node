<!-- eslint-disable vue/return-in-computed-property -->
import { mapState, map } from 'pinia';
<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-500 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div class="w-full h-full grid grid-cols-3 py-2">
      <ExecutionClients
        @open-expert="openExpertWindow"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="stateHandler"
        @restart-handler="restartService"
      />
      <ConsensusClients
        @open-expert="openExpertWindow"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="stateHandler"
        @restart-handler="restartService"
      />
      <ValidatorClients
        @open-expert="openExpertWindow"
        @open-log="openLogsPage"
        @hide-modal="clickOutside"
        @state-handler="stateHandler"
        @restart-handler="restartService"
      />
    </div>
    <PluginLogs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage" />
    <PruingModal
      v-if="gethPrunningWarningModal"
      :item="item"
      @cancel-warning="hidePrunningWarningsModal"
      @confirm-btn="confirmRunningGethPrunning(item)"
    />
    <ResyncModal
      v-if="resyncWarningModal"
      :item="item"
      @cancel-warning="hideResyncWarningsModal"
      @confirm-btn="confirmRunningResync($event, item)"
    />
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useNodeStore } from "@/store/theNode";
import { useStakingStore } from "@/store/theStaking";
import { useServices } from "@/store/services";
import PluginLogs from "../../sections/PluginLogs.vue";
import ControlService from "@/store/ControlService";
import PruingModal from "./PrunningModal.vue";
import ResyncModal from "./ResyncModal.vue";
import LeaderLine from "leader-line-new";
import ExecutionClients from "./ExecutionClients";
import ConsensusClients from "./ConsensusClients";
import ValidatorClients from "./ValidatorClients";

export default {
  name: "NodeBody",
  components: {
    PluginLogs,
    PruingModal,
    ResyncModal,
    ExecutionClients,
    ConsensusClients,
    ValidatorClients,
  },
  data() {
    return {
      itemsList: [],
      isPluginMenuActive: false,
      lineOne: null,
      lineTwo: null,
      lineThree: null,
      isServiceOn: false,
      isServicePending: false,
      gethPrunningWarningModal: false,
      isPluginLogPageActive: false,
      options: null,
      itemToLogs: {},
      resyncWarningModal: false,
      isClientLinkedToMev: false,
      restartModalShow: false,
      executionItems: [],
      consensusItems: [],
      validatorItems: [],
    };
  },

  computed: {
    ...mapWritableState(useNodeStore, {
      connectedServices: "connectedServices",
      selectedExecutionRef: "selectedExecutionRef",
      selectedConsensusRef: "selectedConsensusRef",
      selectedValidatorRef: "selectedValidatorRef",
      validatorRef: "validatorRef",
      consensusRef: "consensusRef",
      executionRef: "executionRef",
      finalExecutionRef: "finalExecutionRef",
      max: "max",
      hideConnectedLines: "hideConnectedLines",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapWritableState(useStakingStore, {
      keyCounter: "keyCounter",
    }),

    getConnectedValidator() {
      const connectedVal = this.installedServices.find(
        (item) => item.category === "validator" && item.config.dependencies?.consensusClients
      );
      return connectedVal;
    },
    getConnectedConsensus() {
      const connectedCons = this.getConnectedValidator.config.dependencies.consensusClients[0];
      return connectedCons;
    },
    getConnectedExecution() {
      return this.getConnectedConsensus?.dependencies.executionClients[0];
    },
  },
  watch: {
    hideConnectedLines: {
      handler(val) {
        if (val) {
          this.hideConnectedLinesHandler();
        } else {
          this.drawLinesHandler();
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.getRefOfConnectedClients();
    this.$nextTick(() => {
      if (!this.lineOne && !this.lineTwo) {
        this.drawConnectingline(this.selectedValidatorRef, this.selectedConsensusRef, this.selectedExecutionRef);
      }
    });
  },
  updated() {
    console.log("updated", this.hideConnectedLines);
  },

  beforeUnmount() {
    this.hideConnectedLinesHandler();
  },

  methods: {
    drawLinesHandler() {
      if (!this.hideConnectedLines && this.$route.path === "/node") {
        if (this.lineOne && this.lineTwo) {
          this.lineOne.show();
          this.lineTwo.show();
        }
      }
    },
    hideConnectedLinesHandler() {
      if (this.hideConnectedLines || this.$route.path !== "/node") {
        this.lineOne.hide();
        this.lineTwo.hide();
      }
    },
    getRefOfConnectedClients() {
      const connectedVal = this.getConnectedValidator;
      const connectedCons = this.getConnectedConsensus;
      const connectedExec = this.getConnectedExecution;

      if (connectedVal) {
        const refService = this.validatorRef.find((item) => {
          return item.refId === connectedVal.config.serviceID;
        });

        if (refService) {
          this.selectedValidatorRef = refService.ref;
        }
      }

      if (connectedCons) {
        const refService = this.consensusRef.find((item) => {
          return item.refId === connectedCons.id;
        });

        if (refService) {
          this.selectedConsensusRef = refService.ref;
        }
      }

      if (connectedExec) {
        const refService = this.executionRef.find((item) => {
          return item.refId === connectedExec.id;
        });

        if (refService) {
          this.selectedExecutionRef = refService.ref;
        }
      }
    },

    restartService(el) {
      this.itemToRestart = el;
      this.restartModalShow = true;
      this.titlePicker = this.restartTitle;
      this.iconPicker = this.restartIcon;
      this.functionCondition = true;
    },
    async restartConfirmed(service) {
      this.restartLoad = true;
      service.yaml = await ControlService.getServiceYAML(service.config.serviceID);
      if (!service.yaml.includes("isPruning: true")) {
        this.isServiceOn = false;
        service.serviceIsPending = true;
        await ControlService.restartService(service.config.serviceID);
        service.serviceIsPending = false;
        this.updateStates();
      }
    },
    updateStates: async function () {
      let serviceInfos = await ControlService.listServices();
      this.installedServices.forEach((s, idx) => {
        let updated = false;
        serviceInfos.forEach((i) => {
          if (i.Names.replace("stereum-", "") === s.config.serviceID) {
            this.installedServices[idx].state = i.State;
            updated = true;
            this.restartModalClose();
            this.restartLoad = false;
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
    restartModalClose() {
      this.restartModalShow = false;
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
    async confirmRunningGethPrunning(service) {
      this.gethPrunningWarningModal = false;
      service.expertOptions
        .filter((item) => {
          return item.title === "Prunning";
        })
        .map((item) => {
          if (item.changeValue) {
            item.changeValue = false;
          }
        });
      await ControlService.chooseServiceAction({
        action: "pruneGeth",
        service: service,
        data: {},
      });
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
    async confirmRunningResync(data, service) {
      this.resyncWarningModal = false;
      service.expertOptions
        .filter((item) => {
          return item.title === "Resync";
        })
        .map((item) => {
          if (item.changeValue) {
            item.changeValue = false;
          }
        });
      await ControlService.chooseServiceAction({
        action: "reSync",
        service: service,
        data: { checkpointURL: data },
      });
    },
    openLogsPage(item) {
      this.itemToLogs = item;
      this.isPluginLogPageActive = true;
    },
    closePluginLogsPage() {
      this.isPluginLogPageActive = false;
    },
    openExpertWindow(item) {
      item.expertOptionsModal = true;
    },

    clickOutside(item) {
      this.hideConnectedLines = false;
      item.expertOptionsModal = false;
    },

    drawConnectingline(start, middle, end) {
      if (!start || !end || !middle) {
        this.hideConnectedLines = true;
        return;
      }

      if (this.lineOne || this.lineTwo) {
        this.lineOne.remove();
        this.lineTwo.remove();
      }

      if (!this.hideConnectedLines) {
        // Only create lines if hideConnectedLines is not true
        if (this.$route.path === "/node") {
          this.lineOne = new LeaderLine(start, middle, { dash: { animation: true } }, { hide: true });
          this.lineOne.setOptions({
            path: "fluid",
            startPlugSize: 1,
            endPlugSize: 2,
            size: 2,
            color: "#58BDA2",
            endPlug: "behind",
          });
          this.lineTwo = new LeaderLine(middle, end, { dash: { animation: true } }, { hide: true });
          this.lineTwo.setOptions({
            path: "fluid",
            startPlugSize: 1,
            endPlugSize: 2,
            size: 2,
            color: "#58BDA2",
            endPlug: "behind",
          });
          LeaderLine.mouseHoverAnchor({ start, middle, end, style: { color: "#E9CE1F" } });
        }
      }
    },

    async getLogs(item) {
      const logs = await ControlService.getLogs(item);
      this.logs = logs;
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
