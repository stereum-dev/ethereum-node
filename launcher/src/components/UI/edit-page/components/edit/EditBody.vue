<template>
  <div class="w-full h-full flex flex-col justify-between items-center">
    <EditHeader />
    <div
      class="w-full h-full max-h-[430px] rounded-md border overflow-hidden border-gray-500 mt-1 bg-[#151618] relative"
    >
      <div
        id="clientTitle"
        class="absolute top-0 w-full mx-auto flex justify-evenly items-center h-6 bg-[#264744] border border-gray-950 rounded-t-sm text-gray-200 text-sm"
      >
        <span>Validator </span>
        <span>Consensus Clients</span>
        <span>Execution Clients</span>
      </div>
      <div
        class="w-full h-full grid grid-cols-3 pb-2 pt-7 scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent overflow-y-auto"
      >
        <ValidatorClients
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
        <ExecutionClients
          @open-expert="openExpertWindow"
          @open-log="openLogsPage"
          @hide-modal="clickOutside"
          @state-handler="stateHandler"
          @restart-handler="restartService"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import EditHeader from "./EditHeader.vue";
import ExecutionClients from "./ExecutionClients.vue";
import ConsensusClients from "./ConsensusClients.vue";
import ValidatorClients from "./ValidatorClients.vue";
</script>

<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
