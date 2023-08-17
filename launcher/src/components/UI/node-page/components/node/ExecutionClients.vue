<template>
  <div class="col-start-1 col-span-1 gap-4 p-2 space-y-8 flex flex-col items-start">
    <div
      v-for="item in getExecutionServices"
      :key="item"
      ref="executionRefs"
      class="max-h-[100px] max-w-[180px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md divide-x divide-gray-700"
    >
      <ClientLayout :client="item" />
      <ClientButtons
        :client="item"
        @open-expert="$emit('openExpert', item)"
        @open-log="$emit('openLog', item)"
        @state-handler="$emit('stateHandler', item)"
        @restart-handler="$emit('restartHandler', item)"
      />
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
import { mapWritableState } from "pinia";
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
      executionRefs: [],
    };
  },
  computed: {
    getExecutionServices() {
      return this.installedServices
        .filter((e) => e.category === "execution")
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    ...mapWritableState(useNodeStore, {
      selectedExecutionRef: "selectedExecutionRef",
      executionRef: "executionRef",
      executionRefItem: "executionRefItem",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
    }),
  },

  mounted() {
    this.executionRef = this.$refs.executionRefs.map((el, index) => {
      return {
        ref: el,
        refId: this.getExecutionServices[index].config.serviceID,
      };
    });
  },
};
</script>
