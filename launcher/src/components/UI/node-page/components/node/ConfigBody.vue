<template>
  <div
    class="scrollbar scrollbar-rounded-* scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-600 overflow-y-auto mt-1 bg-[#151618] relative"
  >
    <div
      class="absolute top-0 w-full mx-auto grid grid-cols-3 h-6 bg-[#33393E] border border-gray-950 rounded-t-[5px] text-gray-200 text-[10px] font-semibold"
    >
      <span class="col-start-1 justify-self-center self-center">{{ $t("editModals.executionClients") }}</span>
      <span class="col-start-2 justify-self-center self-center">{{ $t("editModals.consensusClients") }}</span>
      <span class="col-start-3 justify-self-center self-center">{{ $t("editBody.validator") }} </span>
    </div>
    <div class="w-full h-full grid grid-cols-3 pt-8">
      <ClientSkeleton v-for="i in skeletons" v-show="loadingClients" :key="i" />
      <ExecutionClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
        @mouse-leave="removeConnectionLines"
        @copy-jwt="copyJwt"
      />
      <ConsensusClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
        @mouse-leave="removeConnectionLines"
      />
      <ValidatorClients
        @open-expert="openExpert"
        @open-log="openLog"
        @hide-modal="clickOutside"
        @state-handler="useStateHandler"
        @restart-handler="useRestartService"
        @open-doc="openDocs"
        @mouse-over="lineDrawHandler"
        @mouse-leave="removeConnectionLines"
      />
    </div>
    <PluginLogs v-if="isPluginLogPageActive" :item="itemToLogs" @close-log="closePluginLogsPage" />
  </div>
</template>

<script setup>
import ExecutionClients from "./clients/ExecutionClients.vue";
import ConsensusClients from "./clients/ConsensusClients.vue";
import ValidatorClients from "./clients/ValidatorClients.vue";
import PluginLogs from "../../sections/PluginLogs.vue";
import ClientSkeleton from "./clients/ClientSkeleton.vue";

import { ref, watchEffect } from "vue";

import { useNodeStore } from "@/store/theNode";
</script>
