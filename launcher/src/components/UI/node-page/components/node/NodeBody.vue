<!-- eslint-disable vue/return-in-computed-property -->
import { mapState, map } from 'pinia';
<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-500 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div class="w-full h-full grid grid-cols-3 p-2">
      <div class="col-start-1 col-span-1 gap-6 p-2 space-y-8 flex flex-col items-start">
        <div
          v-for="item in getExecutionServices"
          :key="item"
          :ref="
            (el) => {
              executionRef.push(el);
              executionRefItem.push(item);
            }
          "
          class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
          @click="getExecRefHandler(item)"
        >
          <ClientLayout :client="item" />
          <ClientButtons :client="item" @open-expert="openExpertWindow" @open-log="openLogsPage" />
          <ExpertWindow
            v-if="item.expertOptionsModal"
            :item="item"
            @hide-modal="clickOutside(item)"
            @prunning-warning="runGethPrunningWarning"
            @resync-warning="runResyncWarning"
          />
        </div>
      </div>
      <div class="col-start-2 col-end-3 gap-6 p-2 space-y-8 flex flex-col items-center">
        <div
          v-for="item in getConsensusServices"
          :key="item"
          :ref="
            (el) => {
              consensusRef.push(el);
              consensusRefItem.push(item);
            }
          "
          class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700 relative"
          @click="getConsRefHandler(item)"
        >
          <ClientLayout :client="item" />
          <ClientButtons :client="item" @open-expert="openExpertWindow" @open-log="openLogsPage" />
          <div v-if="item.config.dependencies.mevboost.length > 0" class="absolute -bottom-2 -right-2">
            <img class="w-8" src="/img/icon/plugin-icons/Other/mev-sIcon.png" alt="Mevboost" />
          </div>
          <ExpertWindow
            v-if="item.expertOptionsModal"
            :item="item"
            @hide-modal="clickOutside(item)"
            @prunning-warning="runGethPrunningWarning"
            @resync-warning="runResyncWarning"
          />
        </div>
      </div>
      <div class="col-start-3 col-end-4 gap-6 p-2 space-y-8 flex flex-col items-end">
        <div
          v-for="item in getValidatorServices"
          :key="item"
          ref="validatorRefs"
          class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
          @click="getRefsIndex(item)"
        >
          <ClientLayout :client="item" />
          <ClientButtons :client="item" @open-expert="openExpertWindow" @open-log="openLogsPage" />
          <ExpertWindow
            v-if="item.expertOptionsModal"
            :item="item"
            @hide-modal="clickOutside(item)"
            @open-pruning="runGethPrunningWarning"
            @open-resync="runResyncWarning"
          />
        </div>
      </div>
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
import { mapState } from "pinia";
import { useServices } from "@/store/services";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";
import ExpertWindow from "../../sections/ExpertWindow.vue";
import PluginLogs from "../../sections/PluginLogs.vue";
import ControlService from "@/store/ControlService";
import PruingModal from "./PrunningModal.vue";
import ResyncModal from "./ResyncModal.vue";
import LeaderLine from "leader-line-new";

export default {
  name: "NodeBody",
  components: {
    ClientLayout,
    ClientButtons,
    ExpertWindow,
    PluginLogs,
    PruingModal,
    ResyncModal,
  },
  data() {
    return {
      connectedServices: {},
      selectedExecutionRef: null,
      selectedConsensusRef: null,
      validatorRef: [],
      consensusRef: [],
      consensusRefItem: [],
      executionRef: [],
      executionRefItem: [],
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
    };
  },
  computed: {
    getConsensusToExecution() {
      return this.installedServices
        .filter((e) => e.category === "consensus")
        .find((e) => e.config.dependencies.executionClients.length > 0);
    },

    getExecutionServices() {
      return this.installedServices
        .filter((e) => e.category === "execution")
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    getConsensusServices() {
      return this.installedServices
        .filter((e) => e.category === "consensus")
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    getValidatorServices() {
      return this.installedServices
        .filter((e) => e.category === "validator")
        .sort((a, b) => a.name.localeCompare(b.name));
    },

    getValRef() {
      let ref = this.$refs.validatorRefs[0];
      return ref;
    },
    // getConsRef() {
    //   let ref = this.$refs.consensusRefs[0];
    //   return ref;
    // },
    // getExecRef() {
    //   let ref = this.$refs.executionRefs[0];
    //   return ref;
    // },

    ...mapState(useServices, {
      runningServices: "runningServices",
      installedServices: "installedServices",
    }),
  },
  watch: {
    watchDrawLine() {
      this.drawLine();
    },
  },

  beforeMount() {
    this.addUniqueRefsToServices();
  },

  mounted() {
    this.getConnectedServices();
    this.drawLine();
    console.log(this.consensusRef);
  },
  updated() {
    this.drawLine();
  },
  beforeUnmount() {
    if (this.lineOne) {
      this.lineOne.remove(); // Remove the LeaderLine instance
    }
    if (this.lineTwo) {
      this.lineTwo.remove(); // Remove the LeaderLine instance
    }
  },
  methods: {
    drawLine() {
      this.drawConnection();
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
      item.expertOptionsModal = false;
    },
    getConsRefHandler(item) {
      const index = this.consensusRefItem.indexOf(item);
      console.log(index);
      if (index > -1) this.selectedConsensusRef = this.consensusRef[index];
      console.log(this.consensusRef[index]);
      console.log(this.selectedConsensusRef);
    },
    getExecRefHandler(item) {
      const index = this.executionRefItem.indexOf(item);
      if (index > -1) this.selectedExecutionRef = this.executionRef[index];
      console.log(this.selectedExecutionRef);
    },
    drawValidatorToConsensus() {
      const start = this.getValRef;
      const end = this.getConsRef;
      this.drawConnectingline(start, end);
    },
    drawConnection() {
      const start = this.getValRef;
      const middle = this.selectedConsensusRef;
      const end = this.selectedExecutionRef;
      this.drawConnectingline(start, middle, end);
    },

    drawConnectingline(start, middle, end) {
      if (!start || !end || !middle) {
        return;
      }
      if (this.lineOne) {
        this.lineOne.remove();
      }
      if (this.lineTwo) {
        this.lineTwo.remove();
      }

      this.lineOne = new LeaderLine(start, middle, { dash: { animation: true } });
      this.lineOne.setOptions({
        path: "grid",
        startPlugSize: 1,
        endPlugSize: 2,
        size: 4,
        color: "#58BDA2",
        endPlug: "behind",
      });
      this.lineTwo = new LeaderLine(middle, end, { dash: { animation: true } });
      this.lineTwo.setOptions({
        path: "grid ",
        startPlugSize: 1,
        endPlugSize: 2,
        size: 4,
        color: "#58BDA2",
        endPlug: "behind",
      });
      LeaderLine.mouseHoverAnchor({ start, middle, end, style: { color: "#E9CE1F" } });
    },
    getConnectedServices() {
      if (!this.installedServices.length) {
        return;
      }
      const connectedConsensus = this.installedServices.find((item) => item.category === "validator").config
        .dependencies.consensusClients[0];

      const connectedExecution = this.installedServices.find((item) => item.category === "consensus").config
        .dependencies.executionClients[0];

      this.connectedServices = {
        connectedConsensus,
        connectedExecution,
      };
    },
    addUniqueRefsToServices() {
      this.installedServices.map((e) => {
        return {
          ...e,
          ref: `node-${e.name}-${e.id}`,
        };
      });
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
