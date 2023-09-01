<template>
  <div class="col-start-3 col-end-4 gap-2 p-2 space-y-6 flex flex-col items-end relative">
    <div
      v-for="item in getValidatorServices"
      :key="item"
      ref="validatorRefs"
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
import { mapState, mapWritableState } from "pinia";
import { useServices } from "@/store/services";
import { useStakingStore } from "@/store/theStaking";
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
      validatorRefs: [],
    };
  },
  computed: {
    getValidatorServices() {
      return this.installedServices
        .filter((e) => e.category === "validator")
        .sort((a, b) => a.name.localeCompare(b.name));
    },

    ...mapWritableState(useNodeStore, {
      selectedValidatorRef: "selectedValidatorRef",
      validatorRef: "validatorRef",
      validatorRefItem: "validatorRefItem",
    }),
    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
    ...mapState(useStakingStore, {
      keyCounter: "keyCounter",
    }),
    getValidatorRef() {
      let ref;
      ref = this.$refs.validatorRefs.map((el, index) => {
        return {
          ref: el,
          refId: this.getValidatorServices[index].config.serviceID,
        };
      });
      return ref;
    },
  },
  watch: {
    watchValidatorRef() {
      this.validatorRef = this.getValidatorRef;
    },
  },

  mounted() {},
};
</script>
