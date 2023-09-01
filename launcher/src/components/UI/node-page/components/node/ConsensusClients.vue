<template>
  <div class="col-start-2 col-end-3 gap-2 p-2 space-y-6 flex flex-col items-center relative">
    <div
      v-for="item in getConsensusServices"
      :key="item"
      ref="consensusRefs"
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

<script setup>
import { ref, computed, watch } from "vue";
import { useServices } from "@/store/services";
import { useNodeStore } from "@/store/theNode";
import ClientLayout from "./ClientLayout.vue";
import ClientButtons from "./ClientButtons.vue";
import ExpertWindow from "../../sections/ExpertWindow.vue";

const consensusRefs = ref([]);
const nodeStore = useNodeStore();
const serviceStore = useServices();

const getConsensusServices = computed(() =>
  serviceStore.installedServices.filter((e) => e.category === "consensus").sort((a, b) => a.name.localeCompare(b.name))
);

const getConsensusRef = computed(() =>
  consensusRefs.value.map((el, index) => ({
    ref: el,
    refId: getConsensusServices.value[index].config.serviceID,
  }))
);

watch(getConsensusRef, () => {
  nodeStore.consensusRef.value = getConsensusRef.value;
});
</script>
