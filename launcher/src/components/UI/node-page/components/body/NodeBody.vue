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
          <ClientButtons :client="item" @open-expert="openExpertWindow" />
          <ExpertWindow
            v-if="item.expertOptionsModal"
            :item="item"
            position="18.8%"
            long="54%"
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
          <ClientButtons :client="item" />
        </div>
      </div>
      <div class="col-start-3 col-end-4 gap-2 p-2">
        <div
          v-for="item in getValidatorServices"
          :key="item"
          class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
        >
          <ClientLayout :client="item" />
          <ClientButtons :client="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useServices } from "@/store/services";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons";
import { useMouseInElement } from "@vueuse/core";
import ExpertWindow from "../../sections/ExpertWindow.vue";

export default {
  name: "NodeBody",
  components: {
    ClientLayout,
    ClientButtons,
    ExpertWindow,
  },
  data() {
    return {
      execution: null,
      consensus: null,
      validator: null,
      isExpertWindowOpen: false,
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
