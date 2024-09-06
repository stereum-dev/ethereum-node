<template>
  <div class="w-full h-full col-start-1 col-span-full row-start-1 row-span-full grid grid-cols-24 grid-rows-12 p-1">
    <div
      class="w-full h-full col-start-5 col-end-21 row-start-3 row-end-11 grid grid-cols-12 grid-rows-12 p-2 mx-auto bg-[#1E2429] rounded-md"
    >
      <div class="col-start-1 col-span-full row-start-1 row-span-1 rounded-md py-1 px-2 flex justify-between items-center">
        <span class="text-sm text-gray-200 font-normal uppercase">{{ $t("importingSyncing.message") }}</span>
      </div>
      <div class="col-start-1 col-span-full row-start-2 row-span-1 overflow-x-hidden grid grid-cols-6 bg-teal-600 px-4 py-1 rounded-md">
        <span class="col-start-1 col-span-2 text-sm text-gray-200 font-semibold uppercase">{{ $t("importingSyncing.client") }}</span>
        <span class="col-start-4 col-span-2 text-sm text-gray-200 font-semibold uppercase">{{ $t("importingSyncing.syncSrc") }}</span>
      </div>
      <div class="col-start-1 col-span-full row-start-3 row-span-full rounded-md p-1 grid grid-cols-6 grid-rows-5 gap-2">
        <div
          v-if="configServices.some((s) => s.category === 'execution')"
          class="w-full h-full col-start-1 col-span-full row-start-2 row-span-1"
        >
          <ExecutionSync :client="executionClient" />
        </div>
        <div
          v-if="configServices.some((s) => s.category === 'consensus')"
          class="w-full h-14 col-start-1 col-span-full row-start-3 row-span-1"
        >
          <ConsensusSync :client="consensusClient" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useClickInstall } from "@/store/clickInstallation";
import { useServices } from "@/store/services";
import ConsensusSync from "../../one-click/components/sync/components/ConsensusSync.vue";
import ExecutionSync from "../../one-click/components/sync/components/ExecutionSync.vue";
export default {
  name: "ImportingSyncing",
  components: {
    ConsensusSync,
    ExecutionSync,
  },
  data() {
    return {
      genesisIsActive: true,
      checkPointIsActive: false,
      executionClient: {},
      consensusClient: {},
      back: "importingList",
      next: "importingVerify",
      title: "IMPORTED CONFIG",
      disabledBtn: false,
    };
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    nextRouteHandler() {
      if (!this.btnActive) {
        return this.checkPointSync !== "" || !this.checkPointSync ? "importingVerify" : "disabled";
      } else if (this.btnActive) {
        return "importingVerify";
      }
    },
    ...mapWritableState(useClickInstall, {
      selectedPreset: "selectedPreset",
      syncType: "syncType",
      btnActive: "btnActive",
      checkPointSync: "checkPointSync",
      customElements: "customElements",
      configServices: "configServices",
      configNetwork: "configNetwork",
    }),
    ...mapWritableState(useServices, {
      installedServices: "installedServices",
      runningServices: "runningServices",
      allServices: "allServices",
    }),
  },

  mounted() {
    this.filterServices();
  },
  methods: {
    changeTheOption() {
      if (this.genesisIsActive) {
        this.genesisIsActive = false;
        this.checkPointIsActive = true;
      } else {
        this.checkPointIsActive = false;
        this.genesisIsActive = true;
      }
    },
    filterServices() {
      this.executionClient = this.configServices.filter((service) => service.category === "execution")[0];
      this.consensusClient = this.configServices.filter((service) => service.category === "consensus")[0];
    },
  },
};
</script>
