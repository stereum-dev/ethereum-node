import { mapState } from 'pinia';
<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-500 overflow-y-scroll mt-1 bg-[#151618]"
  >
    <div class="w-full h-full grid grid-cols-3 p-2">
      <div ref="execution" class="col-start-1 col-span-1 gap-2 p-2 space-y-8">
        <div
          v-for="item in getExecutionServices"
          :key="item"
          class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
        >
          <ClientLayout :client="item" />
          <ClientButtons :client="item" />
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

export default {
  name: "NodeBody",
  components: {
    ClientLayout,
    ClientButtons,
  },
  data() {
    return {
      execution: null,
      consensus: null,
      validator: null,
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
  width: 5px;
}
</style>
