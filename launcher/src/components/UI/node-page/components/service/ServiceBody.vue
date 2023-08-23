<template>
  <div
    class="scrollbar scrollbar-rounded-* hover:scrollbar-thumb-teal-800 scrollbar-track-transparent w-full h-full max-h-[430px] rounded-md border border-gray-500 overflow-y-auto bg-[#151618] relative pt-1 pl-1 hover:scroll-auto"
  >

    <div ref="service" class="flex flex-col space-y-4 items-center pt-2">
      <div
        v-for="item in getServices"
        :key="item"
        class="max-h-[80px] max-w-[160px] grid grid-cols-2 py-2 rounded-md border border-gray-700 bg-[#212629] shadow-md pr-1"
      >
        <ServiceLayout :client="item" />
        <ServiceButtons :client="item" @open-expert="openExpertWindow" @open-log="openLogsPage" />
        <ExpertWindow
          v-if="item.expertOptionsModal"
          :item="item"
          @hide-modal="clickOutside(item)"
          @prunning-warning="runGethPrunningWarning"
          @resync-warning="runResyncWarning"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useServices } from "@/store/services";
import ServiceLayout from "./ServiceLayout.vue";
import ServiceButtons from "./ServiceButtons.vue";
export default {
  name: "ServiceBody",
  components: {
    ServiceLayout,
    ServiceButtons,
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    getServices() {
      return this.installedServices
        .filter((e) => e.category === "service")
        .sort((a, b) => a.name.localeCompare(b.name));
    },

    ...mapState(useServices, {
      installedServices: "installedServices",
    }),
  },
  mounted() {},
  methods: {},
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 3px;
}
</style>
