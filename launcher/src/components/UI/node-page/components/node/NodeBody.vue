import { mapState } from 'pinia';
<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-500 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div class="w-full h-full grid grid-cols-3 p-2">
      <div ref="execution" class="col-start-1 col-span-1 gap-2 p-2 space-y-8">
        <div
          v-for="item in getExecutionServices"
          :key="item"
          class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
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
      <div ref="consensus" class="col-start-2 col-end-3 gap-2 p-2">
        <div
          v-for="item in getConsensusServices"
          :key="item"
          class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
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
      <div class="col-start-3 col-end-4 gap-2 p-2">
        <div
          v-for="item in getValidatorServices"
          :key="item"
          class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
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
import ClientButtons from "./ClientButtons";
import { useMouseInElement } from "@vueuse/core";
import ExpertWindow from "../../sections/ExpertWindow.vue";
import PluginLogs from "../../sections/PluginLogs.vue";
import ControlService from "@/store/ControlService";
import PruingModal from "./PrunningModal.vue";
import ResyncModal from "./ResyncModal.vue";

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
      execution: null,
      consensus: null,
      validator: null,
      itemsList: [],
      isPluginMenuActive: false,
      isServiceOn: false,
      isServicePending: false,
      gethPrunningWarningModal: false,
      isPluginLogPageActive: false,
      options: null,
      itemToLogs: {},
      resyncWarningModal: false,
    };
  },
  computed: {
    getExecutionServices() {
      return this.installedServices.filter((e) => e.category === "execution");
    },
    getConsensusServices() {
      return this.installedServices.filter((e) => e.category === "consensus");
    },
    getValidatorServices() {
      return this.installedServices.filter((e) => e.category === "validator");
    },
    ...mapState(useServices, {
      runningServices: "runningServices",
      installedServices: "installedServices",
    }),
    executionPositionX() {
      return this.execution ? this.execution.elementPositionX : 0;
    },
    executionPositionY() {
      return this.execution ? this.execution.elementPositionY : 0;
    },
    executionWidth() {
      return this.execution ? this.execution.width : 0;
    },
    executionHeight() {
      return this.execution ? this.execution.height : 0;
    },
    consensusPositionX() {
      return this.consensus ? this.consensus.elementPositionX : 0;
    },
    consensusPositionY() {
      return this.consensus ? this.consensus.elementPositionY : 0;
    },
    consensusWidth() {
      return this.consensus ? this.consensus.width : 0;
    },
    consensusHeight() {
      return this.consensus ? this.consensus.height : 0;
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.getPosition();
      // this.drawLine();
    });
  },
  methods: {
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
    getPosition() {
      const { elementPositionX, elementPositionY } = useMouseInElement(this.$refs.execution);
      this.execution = {
        elementPositionX: elementPositionX.value,
        elementPositionY: elementPositionY.value,
        width: this.$refs.execution.clientWidth,
        height: this.$refs.execution.clientHeight,
      };

      const consensusRef = this.$refs.consensus;
      if (consensusRef) {
        const { elementPositionX, elementPositionY } = useMouseInElement(consensusRef);
        this.consensus = {
          elementPositionX: elementPositionX.value,
          elementPositionY: elementPositionY.value,
          width: consensusRef.clientWidth,
          height: consensusRef.clientHeight,
        };
      }
      console.log(this.consensus);
    },
    clickOutside(item) {
      item.expertOptionsModal = false;
    },
    // drawLine() {
    //   const canvas = document.getElementById("canvas");
    //   const ctx = canvas.getContext("2d");
    //   ctx.beginPath();
    //   ctx.moveTo(this.executionPositionX, this.executionPositionY);
    //   ctx.lineTo(this.consensusPositionX, this.consensusPositionY);
    //   ctx.stroke();
    // },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
