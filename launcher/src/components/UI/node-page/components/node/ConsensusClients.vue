<template>
  <div class="col-start-2 col-end-3 gap-4 p-2 space-y-8 flex flex-col items-center">
    <div
      v-for="item in getConsensusServices"
      :key="item"
      ref="consensusRefs"
      class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
    >
      <ClientLayout :client="item" />
      <client-buttons
        :client="item"
        @open-expert="$emit('openExpert', item)"
        @open-log="$emit('openLog', item)"
        @state-handler="$emit('stateHandler', item)"
        @restart-handler="$emit('restartHandler', item)"
      >
        <div v-if="item.config.dependencies.mevboost.length > 0" class="absolute -bottom-2 -right-1">
          <img
            class="w-8 border border-gray-500 rounded-sm"
            src="/img/icon/plugin-icons/Other/mev-sIcon.png"
            alt="Mevboost"
          />
        </div>
      </client-buttons>
      <ExpertWindow
        v-if="item.expertOptionsModal"
        :item="item"
        @hide-modal="$emit('hide-modal', item)"
        @prunning-warning="$emit('prunning-warning', item)"
        @resync-warning="$emit('resync-warning', item)"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";
import ExpertWindow from "../../sections/ExpertWindow.vue";
export default {
  components: {
    ClientLayout,
    ClientButtons,
    ExpertWindow,
  },

  data() {
    return {
      consensusRefs: [],
    };
  },
  computed: {
    getConsensusServices() {
      return this.installedServices
        .filter((e) => e.category === "consensus")
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    ...mapWritableState(useNodeStore, {
      selectedConsensusRef: "selectedConsensusRef",
      consensusRef: "consensusRef",
      consensusRefItem: "consensusRefItem",
    }),
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
  },

  mounted() {
    this.consensusRef = this.$refs.consensusRefs.map((el, index) => {
      return {
        ref: el,
        refId: this.getConsensusServices[index].config.serviceID,
      };
    });
  },
};
</script>
